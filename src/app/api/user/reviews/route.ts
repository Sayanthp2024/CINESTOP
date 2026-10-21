import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectMongo from '@/lib/mongodb';
import Review from '@/models/Review';
import User from '@/models/User';

// GET: Fetch reviews posted by the logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongo();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Fetch reviews by this user
    const reviews = await Review.find({ user: user._id }).sort({ createdAt: -1 }).lean();
    
    // Hydrate reviews with movie data from TMDB
    const { fetchFromTMDB } = await import('@/lib/tmdb');
    const hydratedReviews = await Promise.all(
      reviews.map(async (rev: any) => {
        try {
          const movie = await fetchFromTMDB(`/movie/${rev.movieId}`, { language: 'en-US' });
          return { ...rev, movieTitle: movie.title, posterPath: movie.poster_path };
        } catch {
          return { ...rev, movieTitle: `Movie ID: ${rev.movieId}`, posterPath: null };
        }
      })
    );

    return NextResponse.json({ reviews: hydratedReviews });
  } catch (error) {
    console.error('Fetch user reviews error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
