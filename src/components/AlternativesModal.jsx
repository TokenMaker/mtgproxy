import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { getCardPrints } from '../utils/scryfallApi';

export const AlternativesModal = ({ activeCard, onClose, onSelect }) => {
  const [prints, setPrints] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeCard || !activeCard.scryfall?.prints_search_uri) return;

    let active = true;
    const fetchPrints = async () => {
      setLoading(true);
      const data = await getCardPrints(activeCard.scryfall.prints_search_uri);
      if (active) {
        setPrints(data);
        setLoading(false);
      }
    };

    fetchPrints();
    return () => { active = false; };
  }, [activeCard]);

  if (!activeCard) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/90 backdrop-blur-md no-print"
      onClick={onClose}
    >
      <div 
        className="bg-glass-dark border-2 border-neon-cyan/50 rounded-none shadow-[0_0_30px_rgba(0,255,255,0.2)] w-full max-w-4xl max-h-[80vh] flex flex-col relative z-50 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="bg-neon-cyan/10 border-b-2 border-neon-cyan px-4 py-3 flex justify-between items-center">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-none bg-neon-magenta shadow-[0_0_5px_#FF00FF]" />
            <div className="h-3 w-3 rounded-none bg-neon-cyan shadow-[0_0_5px_#00FFFF]" />
            <div className="h-3 w-3 rounded-none bg-neon-orange shadow-[0_0_5px_#FF9900]" />
          </div>
          <span className="text-xs text-neon-cyan font-bold tracking-widest font-mono">
            SELECT_ART.EXE
          </span>
          <button 
            onClick={onClose}
            className="text-neon-cyan hover:text-white hover:bg-neon-cyan transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-black/60">
          <div className="mb-6 border-l-4 border-neon-magenta pl-4">
            <h2 className="text-2xl font-black text-white font-heading text-glow-magenta uppercase">Select Art Version</h2>
            <p className="text-sm text-neon-cyan font-mono tracking-widest uppercase">&gt; SWAPPING ART FOR: {activeCard.name}</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-4 text-neon-cyan font-mono uppercase tracking-widest">
              <Loader2 className="w-10 h-10 animate-spin text-neon-magenta shadow-glow-magenta rounded-full" />
              <p className="animate-pulse">&gt; FETCHING FROM SCRYFALL_MAINFRAME...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {prints.map((printCard) => {
                const imgUri = printCard.image_uris?.normal || printCard.card_faces?.[0]?.image_uris?.normal;
                if (!imgUri) return null;

                return (
                  <div 
                    key={printCard.id}
                    className="relative cursor-pointer group rounded-none overflow-hidden border-2 border-neon-cyan/30 hover:border-neon-magenta hover:shadow-[0_0_15px_#FF00FF] transition-all transform hover:-translate-y-1"
                    onClick={() => {
                      onSelect(activeCard.name, printCard);
                      onClose();
                    }}
                  >
                    <img src={imgUri} alt={printCard.set_name} className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 mix-blend-screen group-hover:mix-blend-normal transition-opacity" />
                    <div className="absolute bottom-0 w-full bg-void/90 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform border-t-2 border-neon-magenta">
                      <p className="text-[10px] font-bold text-neon-cyan truncate font-mono uppercase tracking-widest">{printCard.set_name}</p>
                      <p className="text-[8px] text-neon-magenta uppercase font-mono">&gt; {printCard.set}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
