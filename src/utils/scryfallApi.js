import axios from 'axios';

// Scryfall asks clients to add a 50-100ms delay between requests
// https://scryfall.com/docs/api
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const api = axios.create({
  baseURL: 'https://api.scryfall.com',
});

let lastRequestTime = 0;
const RATE_LIMIT_MS = 100;

// Intercept requests to enforce rate limit
api.interceptors.request.use(async (config) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < RATE_LIMIT_MS) {
    await delay(RATE_LIMIT_MS - timeSinceLastRequest);
  }
  
  lastRequestTime = Date.now();
  return config;
});

/**
 * Searches for a card by exact name
 */
export const getCardExact = async (cardName) => {
  try {
    const response = await api.get('/cards/named', {
      params: { exact: cardName }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching card ${cardName}:`, error);
    return null;
  }
};

/**
 * Fetches all printings for a card using the prints_search_uri
 */
export const getCardPrints = async (printsSearchUri) => {
  try {
    const response = await axios.get(printsSearchUri); // Note: Should probably use the rate-limited api instance if it's scryfall
    return response.data.data;
  } catch (error) {
    console.error('Error fetching card prints:', error);
    return [];
  }
};

/**
 * Searches for a card with specific styling or set requirements
 */
export const getCardWithVibe = async (cardName, vibe, setCode) => {
  try {
    // If a specific set is requested, prioritize that
    if (setCode) {
      const response = await api.get('/cards/search', {
        params: { q: `!"${cardName}" set:${setCode} include:extras`, order: 'released', dir: 'asc' }
      });
      if (response.data?.data?.length > 0) return response.data.data[0];
    }

    // If retro vibe is requested, try finding an old frame version
    if (vibe === 'retro') {
      const response = await api.get('/cards/search', {
        params: { q: `!"${cardName}" (is:retro OR is:old)`, order: 'released', dir: 'asc' }
      });
      if (response.data?.data?.length > 0) return response.data.data[0];
    }
    
    // Fallback to exact search
    return await getCardExact(cardName);
  } catch (error) {
    // If search fails (e.g., no retro version or invalid set), fallback to exact
    console.warn(`Error fetching vibe/set for ${cardName}, falling back to exact:`, error);
    return await getCardExact(cardName);
  }
};
