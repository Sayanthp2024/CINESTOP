import { NextResponse } from 'next/server';
import { fetchFromTMDB } from '@/lib/tmdb';
import connectMongo from '@/lib/mongodb';
import CustomMovie from '@/models/Movie';

export async function GET() {
  try {
    const data = await fetchFromTMDB('/movie/popular', { language: 'en-US', page: '1' });
    
    // Inject Custom Vault Movies from MongoDB
    try {
      await connectMongo();
      const customMovies = await CustomMovie.find().lean();
      if (customMovies && customMovies.length > 0 && data?.results) {
        data.results = [...customMovies, ...data.results];
      }
    } catch (dbErr: any) {
      console.warn('MongoDB popular custom movies fetch skipped:', dbErr?.message);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('TMDB Fetch Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular movies' },
      { status: 500 }
    );
  }
}
