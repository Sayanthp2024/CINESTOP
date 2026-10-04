import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectMongo from '@/lib/mongodb';
import Review from '@/models/Review';
import User from '@/models/User';

// GET: Fetch reviews for a specific movie
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get('movieId');

  if (!movieId) {
    return NextResponse.json({ error: 'Movie ID required' }, { status: 400 });
  }

  try {
    await connectMongo();
    // Fetch reviews and populate the user's name
    const reviews = await Review.find({ movieId }).populate('user', 'name').sort({ createdAt: -1 });
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add a new review
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { movieId, rating, text } = await request.json();

    if (!movieId || !rating || !text) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await connectMongo();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const review = await Review.create({
      user: user._id,
      movieId,
      rating,
      text,
    });

    const populatedReview = await review.populate('user', 'name');

    return NextResponse.json({ success: true, review: populatedReview });
  } catch (error) {
    console.error('Add review error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
