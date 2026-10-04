import { NextResponse } from 'next/server';
import { fetchFromTMDB } from '@/lib/tmdb';

export async function GET() {
  try {
    const data = await fetchFromTMDB('/trending/movie/day', { language: 'en-US' });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('TMDB Trending Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending movies' },
      { status: 500 }
    );
  }
}
