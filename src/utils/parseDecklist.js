/**
 * Parses a raw text decklist into an array of objects:
 * [{ count: 4, name: "Lightning Bolt", set: "m11" }, ...]
 */
export const parseDecklist = (rawText) => {
  if (!rawText) return [];
  
  const lines = rawText.split('\n');
  const parsed = [];
  
  // Regex to match "1 Card Name", "1x Card Name", " 1  Card Name"
  const regex = /^\s*(\d+)[xX]?\s+(.+)$/;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    const match = trimmed.match(regex);
    if (match) {
      let count = parseInt(match[1], 10);
      let name = match[2].trim();
      let setCode = null;
      
      // Attempt to extract set code e.g., "Lightning Bolt (M11) 23" or "Soldier Token (tneo)"
      const setMatch = name.match(/\(([A-Z0-9]+)\)/i);
      if (setMatch) {
        setCode = setMatch[1].toLowerCase();
        // Remove the set code from the name
        name = name.replace(/\s*\([A-Z0-9]+\)/i, '');
      }
      
      // Also remove any trailing numbers (like collector numbers)
      name = name.replace(/\s+\d+$/, '').trim();
      
      if (count > 0 && name) {
        parsed.push({ 
          count, 
          name, 
          set: setCode,
          id: Math.random().toString(36).substring(2, 9) 
        });
      }
    }
  }
  
  return parsed;
};
