import { X, Coins } from 'lucide-react';
import { ITEMS } from '../constants';

export default function Shop({ profile, items, onBuy, onClose }) {
  return (
    <div className="absolute inset-0 bg-slate-100 z-[3000] flex flex-col animate-in slide-in-from-bottom-full duration-300">
      <div className="bg-blue-600 text-white p-4 pt-8 flex items-center justify-between shadow-md z-10">
        <h1 className="text-2xl font-bold">Магазин</h1>
        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full font-bold">
          <Coins className="w-5 h-5 text-yellow-400" />
          {profile.coins}
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors ml-2">
          <X className="w-8 h-8" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        <div className="space-y-4">
          {Object.values(ITEMS).map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center relative overflow-hidden ${item.color}`}>
                  <div className="absolute w-full h-[50%] bottom-0 bg-white"></div>
                  <div className="absolute w-full h-1 bg-slate-800 z-20"></div>
                  <div className="w-3 h-3 bg-white border-2 border-slate-800 rounded-full z-30"></div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{item.name}</h3>
                  <p className="text-xs text-slate-500">Шанс поимки: x{item.catchMultiplier}</p>
                  <p className="text-xs text-emerald-600 font-bold mt-1">В наличии: {items[item.id]}</p>
                </div>
              </div>
              <button 
                onClick={() => onBuy(item.id, item.price)}
                disabled={profile.coins < item.price}
                className={`font-bold px-4 py-2 rounded-full shadow-sm flex items-center gap-1 transition-all ${
                  profile.coins >= item.price 
                    ? 'bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-slate-900' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Coins className="w-4 h-4" /> {item.price}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
