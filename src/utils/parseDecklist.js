/**
 * Parses a raw text decklist into an array of objects:
 * [{ count: 4, name: "Lightning Bolt" }, { count: 1, name: "Sol Ring" }]
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
    
    // Ignore lines that are clearly MTG Arena set identifiers like "4 Lightning Bolt (A25) 141"
    // To keep it simple, we just extract the name, and optionally we could strip the set info
    // For now, let's just use the basic regex and if there's a match, we use it
    
    const match = trimmed.match(regex);
    if (match) {
      let count = parseInt(match[1], 10);
      let name = match[2].trim();
      
      // Attempt to clean up Arena formatted strings e.g. "Lightning Bolt (M11) 23" -> "Lightning Bolt"
      name = name.replace(/\s+\([A-Z0-9]+\)\s+\d+$/, '').trim();
      
      if (count > 0 && name) {
        parsed.push({ count, name, id: Math.random().toString(36).substring(2, 9) }); // Add temporary ID for react keys
      }
    }
  }
  
  return parsed;
};
