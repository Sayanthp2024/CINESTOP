import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectMongo from '@/lib/mongodb';
import Review from '@/models/Review';

// GET: Fetch all reviews for admin
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongo();
    // Fetch all reviews, populate user to see who wrote it
    const reviews = await Review.find().populate('user', 'name email').sort({ createdAt: -1 }).lean();
    
    // Hydrate with movie info (since Review model only stores movieId)
    const { fetchFromTMDB } = await import('@/lib/tmdb');
    const hydrated = await Promise.all(
      reviews.map(async (rev: any) => {
        try {
          const movie = await fetchFromTMDB(`/movie/${rev.movieId}`, { language: 'en-US' });
          return { ...rev, movieTitle: movie.title };
        } catch {
          return { ...rev, movieTitle: `Movie ID: ${rev.movieId}` };
        }
      })
    );

    return NextResponse.json({ reviews: hydrated });
  } catch (error) {
    console.error('Admin Fetch Reviews Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Delete an inappropriate review
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('id');

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
    }

    await connectMongo();
    await Review.findByIdAndDelete(reviewId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin Delete Review Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
