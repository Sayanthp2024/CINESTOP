import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import { fetchFromTMDB } from '@/lib/tmdb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongo();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user || user.watchlist.length === 0) {
      // If user has no watchlist, fallback to general popular movies
      const data = await fetchFromTMDB('/movie/popular', { language: 'en-US', page: '1' });
      return NextResponse.json(data);
    }

    // Pick the most recently added movie to their watchlist (last element)
    const latestMovieId = user.watchlist[user.watchlist.length - 1];
    
    // Fetch recommendations based on that specific movie from TMDB
    const data = await fetchFromTMDB(`/movie/${latestMovieId}/recommendations`, { language: 'en-US', page: '1' });
    
    // If TMDB returns no recommendations for that specific movie, fallback to top rated
    if (!data.results || data.results.length === 0) {
      const fallback = await fetchFromTMDB('/movie/top_rated', { language: 'en-US', page: '1' });
      return NextResponse.json(fallback);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Recommendation Engine Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
