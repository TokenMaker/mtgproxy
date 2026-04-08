import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { PrintPreview } from './components/PrintPreview';
import { PrintFAB } from './components/PrintFAB';
import { AlternativesModal } from './components/AlternativesModal';
import { useDeckState } from './hooks/useDeckState';

function App() {
  const [bleedEnabled, setBleedEnabled] = useState(false);
  const [vibeFilter, setVibeFilter] = useState('default');

  const { rawText, setRawText, flattenedDeck, isFetching, overrideCardData, suggestedTokens } = useDeckState(vibeFilter);
  const [activeCardForSwap, setActiveCardForSwap] = useState(null);

  const handleCardClick = (card) => {
    // Only open if the card loaded successfully and has a print URI
    if (!card.loading && !card.error && card.scryfall?.prints_search_uri) {
      setActiveCardForSwap(card);
    }
  };

  const handleSelectAlternative = (cardName, newScryfallData) => {
    overrideCardData(cardName, newScryfallData);
  };

  return (
    <div className="flex bg-void min-h-screen text-chrome font-mono relative overflow-hidden select-none">
      {/* Vaporwave Background Elements */}
      <div className="perspective-grid" />
      <div className="floating-sun" />

      <Sidebar 
        rawText={rawText} 
        setRawText={setRawText} 
        isFetching={isFetching} 
        bleedEnabled={bleedEnabled}
        setBleedEnabled={setBleedEnabled}
        vibeFilter={vibeFilter}
        setVibeFilter={setVibeFilter}
        suggestedTokens={suggestedTokens}
      />
      
      {/* 
        The main content area is offset by the sidebar width (w-80 = 20rem = 320px).
        By hiding the margin on print, the preview scales exactly to 8.5x11 inches.
      */}
      <main className="ml-80 flex-1 relative z-10 print:ml-0 print:absolute print:inset-0 pt-10 h-screen overflow-y-auto overflow-x-hidden">
        <PrintPreview 
          flattenedDeck={flattenedDeck} 
          onCardClick={handleCardClick} 
          bleedEnabled={bleedEnabled}
        />
        
        {flattenedDeck.length > 0 && <PrintFAB />}
      </main>

      {/* Modals */}
      {activeCardForSwap && (
        <AlternativesModal 
          activeCard={activeCardForSwap} 
          onClose={() => setActiveCardForSwap(null)}
          onSelect={handleSelectAlternative}
        />
      )}
    </div>
  );
}

export default App;
