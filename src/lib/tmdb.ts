const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// In-memory response cache to eliminate redundant network delays and speed up page loads
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

export async function fetchFromTMDB(endpoint: string, queryParams: Record<string, string> = {}, retries = 2) {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB_API_KEY is not defined in the environment variables');
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  
  Object.keys(queryParams).forEach((key) => {
    url.searchParams.append(key, queryParams[key]);
  });

  const cacheKey = url.toString();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url.toString(), {
        signal: AbortSignal.timeout(5000), // 5 second timeout to prevent blocking
      });
      if (response.ok) {
        const data = await response.json();
        cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
      }
    } catch (e) {
      // Network error or timeout, will retry
    }
    // Wait a bit before retrying
    await new Promise(res => setTimeout(res, 300));
  }

  // Return stale cache if available upon total failure
  if (cached) {
    return cached.data;
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
