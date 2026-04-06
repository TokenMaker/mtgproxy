import React from 'react';
import { Printer } from 'lucide-react';

export const PrintFAB = () => {
  return (
    <button 
      onClick={() => window.print()}
      className="fixed bottom-8 right-8 z-50 bg-transparent border-2 border-neon-magenta text-neon-magenta -skew-x-12 px-6 py-4 shadow-glow-magenta hover:bg-neon-magenta hover:text-void hover:shadow-[0_0_40px_#FF00FF] transition-all flex items-center justify-center gap-3 no-print font-heading tracking-widest text-lg group"
      title="Print Sheets"
    >
      <Printer className="w-6 h-6 transform group-hover:rotate-12 transition-transform" />
      <span className="skew-x-12 inline-block font-bold">PRINT.EXE</span>
    </button>
  );
};
