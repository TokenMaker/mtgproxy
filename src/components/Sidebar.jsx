import React from 'react';
import { DeckInput } from './DeckInput';

export const Sidebar = ({ 
  rawText, setRawText, isFetching,
  bleedEnabled, setBleedEnabled,
  vibeFilter, setVibeFilter,
  suggestedTokens = []
}) => {
  const handleAddTokens = () => {
    let toAppend = '';
    suggestedTokens.forEach(token => {
      // Create syntax string like: 1 Token Name (SET)
      const setPart = token.set ? ` (${token.set})` : '';
      toAppend += `\n1 ${token.name}${setPart}`;
    });
    if (toAppend) {
      setRawText(prev => prev + toAppend);
    }
  };

  return (
    <aside className="w-80 h-screen fixed left-0 top-0 bg-glass-dark/95 backdrop-blur-md shadow-glow-cyan z-20 flex flex-col no-print border-r-4 border-neon-cyan/50">
      {/* Title Bar like old OS */}
      <div className="bg-neon-cyan/10 border-b-2 border-neon-cyan px-6 py-3 flex justify-between items-center">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-none bg-neon-magenta shadow-[0_0_5px_#FF00FF]" />
          <div className="h-3 w-3 rounded-none bg-neon-cyan shadow-[0_0_5px_#00FFFF]" />
          <div className="h-3 w-3 rounded-none bg-neon-orange shadow-[0_0_5px_#FF9900]" />
        </div>
        <span className="text-[10px] text-neon-cyan tracking-widest font-bold">TERMOUT.EXE</span>
      </div>

      <div className="p-6 pb-2">
        <h1 className="text-4xl font-black tracking-tight text-white mb-2 text-glow-magenta mb-4">
          <span className="text-sunset">MTG</span> PROXY
        </h1>
        <div className="text-xs text-chrome/70 border-l-2 border-neon-magenta pl-3 my-4 uppercase tracking-wider">
          <span className="text-neon-cyan">&gt; INITIALIZING...</span><br/>
          PASTE DECKLIST BELOW.<br/>
          GLOW PROTOCOL ENGAGED.
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-6 pb-2 flex flex-col gap-4">
        {/* Controls */}
        <div className="bg-void/50 p-3 border-2 border-neon-cyan/30 flex flex-col gap-3 text-xs">
          <div className="flex justify-between items-center">
            <label className="text-chrome font-bold uppercase tracking-wider">Bleed Margin:</label>
            <input 
              type="checkbox" 
              className="w-4 h-4 accent-neon-magenta"
              checked={bleedEnabled}
              onChange={(e) => setBleedEnabled(e.target.checked)}
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-chrome font-bold uppercase tracking-wider">Style Override:</label>
            <select 
              className="bg-void text-neon-cyan border border-neon-cyan/30 p-1 uppercase focus:outline-none focus:border-neon-cyan"
              value={vibeFilter}
              onChange={(e) => setVibeFilter(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="retro">Old Border</option>
            </select>
          </div>
        </div>

        {/* Deck Input */}
        <div className="flex-1 min-h-[150px]">
          <DeckInput rawText={rawText} setRawText={setRawText} isFetching={isFetching} />
        </div>

        {/* Suggested Tokens */}
        {suggestedTokens.length > 0 && (
          <div className="bg-void/50 p-3 border-2 border-neon-magenta/30 flex flex-col gap-2">
            <h3 className="text-[10px] text-neon-magenta uppercase tracking-widest font-bold border-b border-neon-magenta/50 pb-1">
              &gt; DETECTED TOKENS ({suggestedTokens.length})
            </h3>
            <ul className="text-[10px] text-chrome/80 max-h-24 overflow-y-auto">
              {suggestedTokens.map((t, idx) => (
                <li key={idx} className="truncate">- {t.name}</li>
              ))}
            </ul>
            <button 
              onClick={handleAddTokens}
              className="mt-1 bg-neon-magenta/20 hover:bg-neon-magenta/40 text-neon-magenta border border-neon-magenta px-2 py-1 text-[10px] uppercase font-bold transition-colors"
            >
              + ADD MISSING TOKENS
            </button>
          </div>
        )}
      </div>

      <div className="border-t-2 border-border-dark bg-void p-4 text-[10px] text-center text-neon-magenta tracking-widest uppercase shrink-0">
        <p>&gt; 1. PASTE</p>
        <p>&gt; 2. SWAP ARTS (CLICK)</p>
        <p>&gt; 3. PRINT (CTRL+P)</p>
      </div>
    </aside>
  );
};
