import { NextResponse } from 'next/server';
import { fetchFromTMDB } from '@/lib/tmdb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Movie ID required' }, { status: 400 });
  }

  try {
    const data = await fetchFromTMDB(`/movie/${id}`, { language: 'en-US' });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('TMDB Details Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 }
    );
  }
}
