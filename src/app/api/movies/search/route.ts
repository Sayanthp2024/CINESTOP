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
      // If no query, just return popular movies
      data = await fetchFromTMDB('/movie/popular', { language: 'en-US', page: '1' });
    } else {
      // Search TMDB
      data = await fetchFromTMDB('/search/movie', { query, language: 'en-US', page: '1' });
    }

    // Inject Custom Vault Movies from MongoDB
    await connectMongo();
    let customMovies = [];
    
    if (!query) {
      customMovies = await CustomMovie.find().lean();
    } else {
      customMovies = await CustomMovie.find({ title: { $regex: query, $options: 'i' } }).lean();
    }
    
    // Merge them at the very top of the search results
    if (data && data.results) {
      data.results = [...customMovies, ...data.results];
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
