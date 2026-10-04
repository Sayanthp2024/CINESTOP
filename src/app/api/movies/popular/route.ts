import { NextResponse } from 'next/server';
import { fetchFromTMDB } from '@/lib/tmdb';
import connectMongo from '@/lib/mongodb';
import CustomMovie from '@/models/Movie';

export async function GET() {
  try {
    const data = await fetchFromTMDB('/movie/popular', { language: 'en-US', page: '1' });
    
    // Inject Custom Vault Movies from MongoDB
    await connectMongo();
    const customMovies = await CustomMovie.find().lean();
    
    // Merge them at the very top of the list!
    data.results = [...customMovies, ...data.results];

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('TMDB Fetch Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular movies' },
      { status: 500 }
    );
  }
}
