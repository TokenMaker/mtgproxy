import React from 'react';
import { CardItem } from './CardItem';

export const CardSheet = ({ cards, onCardClick, bleedEnabled }) => {
  return (
    <div className="print-page bg-white relative overflow-hidden shadow-2xl print:shadow-none print:!w-[8.5in] print:!h-[11in] flex items-center justify-center no-print-bg">
      {/* 
        This inline style enforces exactly 8.5x11in on screen. 
        It will scale nicely to standard Letter paper.
        Inside we center a grid of 3x3 cards.
      */}
      <div 
        className="w-[8.5in] h-[11in] box-border grid grid-cols-3 grid-rows-3 gap-0 place-items-center"
        style={{ width: '8.5in', height: '11in' }}
      >
        {cards.map((card) => (
          <CardItem 
            key={card.instanceId} 
            card={card} 
            onClick={() => onCardClick(card)} 
            bleedEnabled={bleedEnabled}
          />
        ))}
      </div>
    </div>
  );
};
