import { X, ArrowUpCircle, Trash2, Coins, Zap, Scale, Ruler, Star, Dna } from 'lucide-react';
import { PEPEGA_TYPES } from '../constants';

export default function PepegaDetails({ pepega, profile, inventory, onPowerUp, onTransfer, onEvolve, onClose }) {
  const typeInfo = PEPEGA_TYPES[pepega.typeId] || PEPEGA_TYPES.common;
  const candies = inventory.candies[pepega.typeId] || 0;

  const canEvolve = typeInfo.evolvesTo && typeInfo.evolutionCost;
  const hasEnoughCandies = candies >= (typeInfo.evolutionCost || Infinity);
  const evolvedInfo = canEvolve ? PEPEGA_TYPES[typeInfo.evolvesTo] : null;

  return (
    <div className="absolute inset-0 bg-slate-50 z-[4000] flex flex-col animate-in slide-in-from-bottom-full duration-300">
      <div className={`${typeInfo.color} p-4 pt-8 shadow-sm relative overflow-hidden flex-shrink-0`}>
        <div className="absolute top-0 right-0 p-4 opacity-10 blur-xl">
          <img src={typeInfo.sprite} className="w-64 h-64" alt="" />
        </div>
        <div className="flex items-center justify-between relative z-10">
          <button onClick={onClose} className="bg-white/50 hover:bg-white/80 p-2 rounded-full transition-colors backdrop-blur-sm">
            <X className="w-6 h-6 text-slate-800" />
          </button>
          <div className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full font-bold text-sm text-slate-700 shadow-sm">
            #{pepega.id.toUpperCase()}
          </div>
        </div>

        <div className="flex flex-col items-center mt-4 relative z-10">
          <span className="text-4xl font-black text-slate-800 flex items-center gap-1 drop-shadow-md bg-white/40 px-6 py-2 rounded-full">
            <Zap className="w-8 h-8 text-blue-600" /> {pepega.cp}
          </span>
          <img src={typeInfo.sprite} alt={typeInfo.name} className="w-48 h-48 object-contain my-4 drop-shadow-[0_15px_15px_rgba(0,0,0,0.25)] hover:scale-110 transition-transform" />
          <h2 className="text-3xl font-black text-slate-800 text-center">{typeInfo.name}</h2>
          
          <div className="w-full max-w-xs grid grid-cols-2 gap-4 mt-6 bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white">
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center"><Scale className="w-3 h-3 mr-1"/> Вес</span>
              <span className="text-xl font-bold text-slate-800">{pepega.weight}kg</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center"><Ruler className="w-3 h-3 mr-1"/> Рост</span>
              <span className="text-xl font-bold text-slate-800">{pepega.height}m</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {/* Candy Info */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center border-2 border-pink-200">
              <Star className="w-6 h-6 text-pink-500" fill="currentColor" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-lg">Конфеты</p>
              <p className="text-sm text-slate-500">{typeInfo.name.split(' ')[0]}</p>
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800">{candies}</div>
        </div>

        {/* Evolution button */}
        {canEvolve && (
          <button
            onClick={() => onEvolve(pepega)}
            disabled={!hasEnoughCandies}
            className={`w-full py-4 rounded-2xl text-xl font-black shadow-lg flex items-center justify-between px-6 transition-all active:scale-95 ${
              hasEnoughCandies
                ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-violet-500/30 hover:scale-105'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-2">
              <Dna className="w-6 h-6" /> ЭВОЛЮЦИЯ
            </div>
            <div className="flex items-center gap-2 text-sm bg-black/20 px-3 py-2 rounded-xl">
              <Star className="w-4 h-4 text-pink-300" fill="currentColor" />
              <span>{candies}/{typeInfo.evolutionCost}</span>
            </div>
          </button>
        )}
        {canEvolve && evolvedInfo && (
          <div className="flex items-center gap-3 bg-violet-50 border border-violet-200 rounded-2xl p-3">
            <img src={typeInfo.sprite} className="w-10 h-10 object-contain" alt="" />
            <span className="text-slate-500 font-bold text-lg">→</span>
            <img src={evolvedInfo.sprite} className="w-10 h-10 object-contain" alt="" />
            <span className="text-slate-700 font-bold text-sm">{evolvedInfo.name}</span>
          </div>
        )}

        {/* Power Up */}
        <button
          onClick={() => onPowerUp(pepega)}
          className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all text-white font-bold py-4 rounded-2xl text-xl shadow-lg shadow-emerald-500/30 flex items-center justify-between px-6"
        >
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="w-6 h-6" /> ПРОКАЧАТЬ
          </div>
          <div className="flex items-center gap-4 text-sm bg-black/20 px-4 py-2 rounded-xl">
            <span className="flex items-center gap-1"><Coins className="w-4 h-4 text-yellow-300"/> 10</span>
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-pink-300" fill="currentColor"/> 1</span>
          </div>
        </button>

        {/* Transfer */}
        <button
          onClick={() => {
            if (window.confirm('Отпустить этого Пепегу? Вы получите 1 конфету.')) {
              onTransfer(pepega);
              onClose();
            }
          }}
          className="w-full mt-auto bg-slate-200 hover:bg-red-100 hover:text-red-600 active:scale-95 transition-all text-slate-600 font-bold py-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 border border-slate-300"
        >
          <Trash2 className="w-5 h-5" /> ОТПУСТИТЬ
        </button>
      </div>
    </div>
  );
}
