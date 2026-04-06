import React from 'react';
import { CardSheet } from './CardSheet';

export const PrintPreview = ({ flattenedDeck, onCardClick }) => {
  // If no cards, show placeholder
  if (flattenedDeck.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen no-print">
        <div className="text-gray-500 text-lg flex flex-col items-center gap-4">
          <div className="w-16 h-24 border-2 border-dashed border-gray-600 rounded-md opacity-50 flex items-center justify-center">
            ?
          </div>
          <p>Paste a decklist to preview print sheets.</p>
        </div>
      </div>
    );
  }

  // Chunk array into groups of 9 for each sheet
  const sheets = [];
  for (let i = 0; i < flattenedDeck.length; i += 9) {
    sheets.push(flattenedDeck.slice(i, i + 9));
  }

  return (
    <div className="flex flex-col items-center gap-10 py-10 print:py-0 print:gap-0 min-h-screen">
      {sheets.map((sheetCards, index) => (
        <CardSheet 
          key={index} 
          cards={sheetCards} 
          onCardClick={onCardClick} 
        />
      ))}
    </div>
  );
};
