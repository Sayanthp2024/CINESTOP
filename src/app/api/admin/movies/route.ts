import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectMongo from '@/lib/mongodb';
import CustomMovie from '@/models/Movie';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, overview, poster_path, release_date, vote_average } = await request.json();

    if (!title || !overview || !release_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectMongo();

    // Create a unique large integer ID (e.g. 9,000,000 + random) so it doesn't collide with TMDB
    const customId = 9000000 + Math.floor(Math.random() * 1000000);

    const newMovie = await CustomMovie.create({
      id: customId,
      title,
      overview,
      poster_path: poster_path || '', // can use a placeholder image if empty
      release_date,
      vote_average: Number(vote_average) || 0,
    });

    return NextResponse.json({ success: true, movie: newMovie });
  } catch (error) {
    console.error('Admin Add Movie Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
