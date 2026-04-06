import React from 'react';
import { Loader2, ImageOff } from 'lucide-react';
import { motion } from 'framer-motion';

export const CardItem = ({ card, onClick }) => {
  // Get best image URI: png, then large, then normal.
  const getImageUrl = (scryfallData, faceIndex) => {
    if (!scryfallData) return null;
    
    // If it's a double faced card (indicated by card_faces having independent image_uris)
    // we use the faceIndex passed down from the flattened deck
    if (scryfallData.card_faces && scryfallData.card_faces.length > faceIndex && scryfallData.card_faces[faceIndex].image_uris) {
      const uris = scryfallData.card_faces[faceIndex].image_uris;
      return uris.png || uris.large || uris.normal;
    }

    // Normal single-faced card (or split/adventure card where the image_uris is at the root)
    if (scryfallData.image_uris) {
      return scryfallData.image_uris.png || scryfallData.image_uris.large || scryfallData.image_uris.normal;
    }
    
    return null;
  };

  const imageUrl = getImageUrl(card.scryfall, card.faceIndex || 0);

  return (
    <div 
      className="relative flex items-center justify-center bg-white cursor-pointer group no-print-bg transition-transform"
      style={{
        width: '2.5in',
        height: '3.5in',
        // 1px dashed light-gray for cutting guide
        border: '1px dashed #d1d5db',
        boxSizing: 'border-box'
      }}
      onClick={onClick}
      title="Click to swap art"
    >
      {/* Loading state */}
      {card.loading && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 no-print">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      )}

      {/* Error / Not Found state */}
      {card.error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 p-2 text-center no-print bg-red-50/10">
          <ImageOff className="w-6 h-6 mb-2" />
          <span className="text-[10px] uppercase font-bold leading-tight">{card.name}</span>
          <span className="text-[8px] mt-1">Not Found</span>
        </div>
      )}

      {/* Image Render */}
      {imageUrl && !card.loading && (
        <img 
          src={imageUrl} 
          alt={card.name}
          className="w-full h-full object-cover"
          style={{ width: '100%', height: '100%' }}
        />
      )}

      {/* Hover Overlay (Hidden on Print) */}
      <div className="absolute inset-0 bg-void/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center no-print border-4 border-neon-cyan shadow-glow-cyan">
        <span className="text-neon-cyan text-sm font-bold tracking-widest px-4 py-2 border-2 border-neon-cyan bg-neon-cyan/10 backdrop-blur-sm -skew-x-12 shadow-glow-cyan-intense animate-pulse">
          &gt; SWAP_ART
        </span>
      </div>
    </div>
  );
};
