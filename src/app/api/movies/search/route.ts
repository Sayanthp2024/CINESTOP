import { NextResponse } from 'next/server';
import { fetchFromTMDB } from '@/lib/tmdb';
import connectMongo from '@/lib/mongodb';
import CustomMovie from '@/models/Movie';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  try {
    let data: any;

    if (!query) {
      data = await fetchFromTMDB('/movie/popular', { language: 'en-US', page: '1' });
    } else {
      data = await fetchFromTMDB('/search/movie', { query, language: 'en-US', page: '1' });
    }

    // Inject Custom Vault Movies from MongoDB
    try {
      await connectMongo();
      let customMovies = [];
      if (!query) {
        customMovies = await CustomMovie.find().lean();
      } else {
        customMovies = await CustomMovie.find({ title: { $regex: query, $options: 'i' } }).lean();
      }
      
      if (data && data.results && customMovies && customMovies.length > 0) {
        data.results = [...customMovies, ...data.results];
      }
    } catch (dbErr: any) {
      console.warn('MongoDB search custom movies fetch skipped:', dbErr?.message);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('TMDB Search Error:', error);
    return NextResponse.json(
      { error: 'Failed to search movies' },
      { status: 500 }
    );
  }
}
