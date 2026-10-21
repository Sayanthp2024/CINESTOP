import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import Review from '@/models/Review';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongo();
    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const reviewCount = await Review.countDocuments({ user: (user as any)._id });

    return NextResponse.json({
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      createdAt: user.createdAt,
      watchlistCount: user.watchlist ? user.watchlist.length : 0,
      favoritesCount: user.favorites ? user.favorites.length : 0,
      reviewCount,
    });
  } catch (error) {
    console.error('Fetch profile error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
