import { useState, useEffect, useMemo } from 'react';
import { parseDecklist } from '../utils/parseDecklist';
import { getCardExact } from '../utils/scryfallApi';

const LOCAL_STORAGE_KEY = 'mtg-deck-generator-raw-text';

export const useDeckState = () => {
  const [rawText, setRawText] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY) || '';
  });

  const [cardDataMap, setCardDataMap] = useState({});
  const [isFetching, setIsFetching] = useState(false);

  // Auto-save to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, rawText);
  }, [rawText]);

  // Parse deck internally whenever raw text changes
  const parsedItems = useMemo(() => {
    return parseDecklist(rawText);
  }, [rawText]);

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
      const missingNames = uniqueNames.filter(name => !cardDataMap[name] || cardDataMap[name].error);
      if (missingNames.length === 0) return;

      setIsFetching(true);
      for (const name of missingNames) {
        setCardDataMap(prev => {
          if (prev[name]?.loading) return prev; // already loading
          return { ...prev, [name]: { loading: true } };
        });

        const data = await getCardExact(name);
        
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

  return {
    rawText,
    setRawText,
    flattenedDeck,
    isFetching,
    overrideCardData
  };
};
