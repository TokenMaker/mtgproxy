import { useState, useEffect, useMemo } from 'react';
import { parseDecklist } from '../utils/parseDecklist';
import { getCardWithVibe } from '../utils/scryfallApi';

const LOCAL_STORAGE_KEY = 'mtg-deck-generator-raw-text';

export const useDeckState = (vibeFilter = 'default') => {
  const [rawText, setRawText] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY) || '';
  });

  const [cardDataMap, setCardDataMap] = useState({});
  const [isFetching, setIsFetching] = useState(false);

  // Auto-save to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, rawText);
  }, [rawText]);

  // Clear cache if vibe changes, to force refetch
  useEffect(() => {
    setCardDataMap({});
  }, [vibeFilter]);

  // Parse deck internally whenever raw text changes
  const parsedItems = useMemo(() => {
    return parseDecklist(rawText);
  }, [rawText]);

  // Clear card cache when decklist is emptied so stale tokens don't persist
  useEffect(() => {
    if (parsedItems.length === 0) {
      setCardDataMap({});
    }
  }, [parsedItems]);

  // Fetch missing card info
  useEffect(() => {
    let active = true;
    
    const fetchMissingCards = async () => {
      const uniqueNames = [...new Set(parsedItems.map(item => item.name))];
      
      // If a card is merely 'loading', we shouldn't necessarily skip it if it got stuck, 
      // but to avoid double fetches, we let the active fetch complete. 
      // However, if the active fetch was aborted, it's stuck loading. 
      // So we just track fetching promises in a ref, or simply remove the `active` check around state updates.
      // Easiest fix: update state even if active=false, so it doesn't get stuck in 'loading'.
      const missingNames = uniqueNames.filter(name => !cardDataMap[name]);
      if (missingNames.length === 0) return;

      setIsFetching(true);
      for (const name of missingNames) {
        setCardDataMap(prev => {
          if (prev[name]?.loading) return prev; // already loading
          return { ...prev, [name]: { loading: true } };
        });

        const item = parsedItems.find(i => i.name === name);
        const data = await getCardWithVibe(name, vibeFilter, item?.set);
        
        setCardDataMap(prev => ({
          ...prev,
          [name]: { loading: false, data, error: !data }
        }));
      }
      
      if (active) {
        setIsFetching(false);
      }
    };

    fetchMissingCards();
    
    return () => { active = false; };
  }, [parsedItems, cardDataMap]);

  // Handle art swapping manually
  const overrideCardData = (name, newScryfallData) => {
    setCardDataMap(prev => ({
      ...prev,
      [name]: { loading: false, data: newScryfallData, error: false }
    }));
  };

  /**
   * Flatten the decklist into individual items for rendering
   */
  const flattenedDeck = useMemo(() => {
    const list = [];
    parsedItems.forEach(item => {
      for (let i = 0; i < item.count; i++) {
        const scryfallData = cardDataMap[item.name]?.data || null;
        const isLoading = cardDataMap[item.name]?.loading || false;
        const isError = cardDataMap[item.name]?.error || false;

        // Push the front face
        list.push({
          instanceId: `${item.id}-${i}-face0`,
          name: item.name,
          scryfall: scryfallData,
          loading: isLoading,
          error: isError,
          faceIndex: 0
        });

        // Check if it's a Double-Faced Card (both faces have their own image_uris)
        if (scryfallData && scryfallData.card_faces && scryfallData.card_faces.length > 1) {
          if (scryfallData.card_faces[0].image_uris && scryfallData.card_faces[1].image_uris) {
            // Push the back face as a separate printed card
            list.push({
              instanceId: `${item.id}-${i}-face1`,
              name: item.name + ' (Back)',
              scryfall: scryfallData,
              loading: isLoading,
              error: isError,
              faceIndex: 1
            });
          }
        }
      }
    });
    return list;
  }, [parsedItems, cardDataMap]);

  /**
   * Calculate suggested tokens based on loaded cards
   */
  const suggestedTokens = useMemo(() => {
    if (parsedItems.length === 0) return [];

    const tokens = [];
    // Only looking at names, case insensitive
    const seenNames = new Set(parsedItems.map(i => i.name.toLowerCase()));

    for (const name in cardDataMap) {
      const data = cardDataMap[name]?.data;
      if (data?.all_parts) {
        data.all_parts.forEach(part => {
          const isToken = part.component === 'token';
          const isEmblem = part.component === 'combo_piece' && part.type_line?.startsWith('Emblem');
          if (isToken || isEmblem) {
            const cleanTokenName = part.name;
            if (!seenNames.has(cleanTokenName.toLowerCase())) {
               if (!tokens.find(t => t.name === cleanTokenName)) {
                 // Extract UUID from URI: https://api.scryfall.com/cards/{uuid}
                 const uriParts = part.uri?.split('/');
                 const uuid = uriParts?.[uriParts.length - 1] || null;
                 tokens.push({ name: cleanTokenName, uri: part.uri, set: uuid });
               }
            }
          }
        });
      }
    }
    return tokens;
  }, [cardDataMap, parsedItems]);

  return {
    rawText,
    setRawText,
    flattenedDeck,
    isFetching,
    overrideCardData,
    suggestedTokens
  };
};
