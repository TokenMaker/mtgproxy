import React from 'react';
import { DeckInput } from './DeckInput';

export const Sidebar = ({ rawText, setRawText, isFetching }) => {
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

      <div className="flex-1 overflow-hidden px-6 pb-6">
        <DeckInput rawText={rawText} setRawText={setRawText} isFetching={isFetching} />
      </div>

      <div className="border-t-2 border-border-dark bg-void p-4 text-[10px] text-center text-neon-magenta tracking-widest uppercase">
        <p>&gt; 1. PASTE</p>
        <p>&gt; 2. SWAP ARTS (CLICK)</p>
        <p>&gt; 3. PRINT (CTRL+P)</p>
      </div>
    </aside>
  );
};
