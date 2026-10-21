import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import { fetchFromTMDB } from '@/lib/tmdb';

import CustomMovie from '@/models/Movie';

// POST: Add or remove a movie from watchlist/favorites
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { movieId, action, listType } = await request.json();
    // listType is either 'watchlist' or 'favorites'
    // action is either 'add' or 'remove'

    if (!movieId || !action || !['watchlist', 'favorites'].includes(listType)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await connectMongo();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const numId = Number(movieId);
    const list = user[listType];

    if (action === 'add' && !list.includes(numId)) {
      list.push(numId);
    } else if (action === 'remove') {
      user[listType] = list.filter((id: number) => id !== numId);
    }

    await user.save();
    return NextResponse.json({ success: true, [listType]: user[listType] });
  } catch (error) {
    console.error('Failed to update movie list', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET: Fetch user's saved movies and hydrate them with TMDB data
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const listType = searchParams.get('listType') as 'watchlist' | 'favorites';

    if (!['watchlist', 'favorites'].includes(listType)) {
      return NextResponse.json({ error: 'Invalid list type' }, { status: 400 });
    }

    await connectMongo();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const movieIds = user[listType];
    
    // Fetch full movie details from TMDB in parallel with CustomMovie fallback
    const movies = await Promise.all(
      movieIds.map(async (id: number) => {
        try {
          const tmdbMovie = await fetchFromTMDB(`/movie/${id}`, {});
          if (tmdbMovie && tmdbMovie.title) return tmdbMovie;
        } catch {
          // Check MongoDB for custom injected movies
        }
        try {
          const custom = await CustomMovie.findOne({ id }).lean();
          if (custom) return custom;
        } catch {
          // ignore
        }
        return null;
      })
    );

    // Filter out any nulls
    const validMovies = movies.filter(Boolean);

    return NextResponse.json({ results: validMovies });
  } catch (error) {
    console.error('Failed to fetch user movies', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
