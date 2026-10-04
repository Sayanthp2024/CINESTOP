const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchFromTMDB(endpoint: string, queryParams: Record<string, string> = {}, retries = 3) {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB_API_KEY is not defined in the environment variables');
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  
  Object.keys(queryParams).forEach((key) => {
    url.searchParams.append(key, queryParams[key]);
  });

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url.toString());
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      // Network error, will retry
    }
    // Wait a bit before retrying
    await new Promise(res => setTimeout(res, 500));
  }

  throw new Error(`Failed to fetch from TMDB after ${retries} retries`);
}

/**
 * Example usage:
 * 
 * export async function getPopularMovies() {
 *   return fetchFromTMDB('/movie/popular');
 * }
 * 
 * export async function searchMovies(query: string) {
 *   return fetchFromTMDB('/search/movie', { query });
 * }
 */
