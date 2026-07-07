import { useState, useEffect } from 'react';
import { PEPEGA_TYPES } from '../constants';
import { playEvolution } from '../utils/sounds';

export default function EvolutionScreen({ pepega, newTypeId, onComplete }) {
  const [phase, setPhase] = useState('flash'); // flash → transform → reveal
  const newType = PEPEGA_TYPES[newTypeId];
  const oldType = PEPEGA_TYPES[pepega.typeId];

  useEffect(() => {
    playEvolution();
    // flash phase
    const t1 = setTimeout(() => setPhase('transform'), 800);
    // transform phase
    const t2 = setTimeout(() => setPhase('reveal'), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className={`absolute inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-500 ${
      phase === 'flash' ? 'bg-white' :
      phase === 'transform' ? 'bg-gradient-to-b from-violet-900 to-indigo-950' :
      'bg-gradient-to-b from-yellow-900 to-amber-950'
    }`}>
      
      {/* Particle rings */}
      {phase !== 'flash' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="absolute rounded-full border-2 border-white/20 animate-ping" 
              style={{ width: `${(i+1)*120}px`, height: `${(i+1)*120}px`, animationDelay: `${i*0.3}s`, animationDuration: '1.5s' }} 
            />
          ))}
        </div>
      )}

      {phase === 'flash' && (
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <img src={oldType.sprite} className="w-40 h-40 object-contain brightness-0 invert" alt="" />
          <p className="text-white/0 text-2xl font-black">Эволюция!</p>
        </div>
      )}

      {phase === 'transform' && (
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <img src={oldType.sprite} className="w-40 h-40 object-contain blur-sm opacity-50 animate-spin" 
              style={{ animationDuration: '1s' }} alt="" />
            <div className="absolute inset-0 bg-white/60 rounded-full blur-xl animate-pulse" />
          </div>
          <p className="text-white text-2xl font-black animate-pulse tracking-widest">ЭВОЛЮЦИЯ...</p>
        </div>
      )}

      {phase === 'reveal' && (
        <div className="flex flex-col items-center gap-6 animate-in zoom-in-75 duration-500">
          <div className="text-5xl mb-2">✨</div>
          <div className={`p-6 rounded-full ${newType.color} border-4 border-white/50 shadow-2xl`}>
            <img src={newType.sprite} className="w-40 h-40 object-contain drop-shadow-2xl" alt={newType.name} />
          </div>
          <div className="text-center">
            <p className="text-white/70 text-lg font-medium">Появился</p>
            <h1 className="text-white text-4xl font-black">{newType.name}!</h1>
          </div>
          <button
            onClick={onComplete}
            className="mt-4 bg-white text-slate-900 font-black text-xl px-12 py-4 rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            Отлично! 🎉
          </button>
        </div>
      )}
    </div>
  );
}
