import React from 'react';
import { Loader2 } from 'lucide-react';

export const DeckInput = ({ rawText, setRawText, isFetching }) => {
  return (
    <div className="flex flex-col h-full gap-2 font-mono">
      <div className="flex justify-between items-center border-b-2 border-neon-magenta/50 pb-2">
        <h2 className="text-sm font-bold flex items-center gap-2 text-neon-cyan uppercase tracking-widest">
          &gt; INPUT.TXT
          {isFetching && <Loader2 className="w-4 h-4 animate-spin text-neon-magenta" />}
        </h2>
      </div>
      <div className="relative flex-1 group">
        <textarea
          className="w-full h-full bg-void/80 text-neon-cyan border-2 border-neon-cyan/20 p-4 font-mono text-xs resize-none focus:outline-none focus:border-neon-cyan focus:shadow-glow-cyan transition-all rounded-none uppercase"
          placeholder={`4 LIGHTNING BOLT\n1 SOL RING\n...`}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
        />
        <div className="absolute inset-0 pointer-events-none border-2 border-neon-magenta opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay" />
      </div>
    </div>
  );
};
