import { useState } from 'react';
import { X, Backpack, Zap, Star, Egg, Heart } from 'lucide-react';
import { PEPEGA_TYPES, ITEMS } from '../constants';
import PepegaDetails from './PepegaDetails';

export default function Inventory({ inventory, profile, onTransfer, onPowerUp, onIncubate, onSetBuddy, onEvolve, onClose }) {
  const [tab, setTab] = useState('pepegas');
  const [selectedPepega, setSelectedPepega] = useState(null);

  if (selectedPepega) {
    const freshPepega = inventory.pepegas.find(p => p.id === selectedPepega.id);
    if (!freshPepega) {
      setTimeout(() => setSelectedPepega(null), 0);
    } else {
      return (
        <PepegaDetails
          pepega={freshPepega}
          inventory={inventory}
          onPowerUp={onPowerUp}
          onEvolve={onEvolve}
          onTransfer={(p) => { onTransfer(p); setSelectedPepega(null); }}
          onClose={() => setSelectedPepega(null)}
        />
      );
    }
  }

  return (
    <div className="absolute inset-0 bg-slate-100 z-[3000] flex flex-col animate-in slide-in-from-bottom-full duration-300">
      <div className="bg-emerald-600 text-white p-4 pt-8 shadow-md z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Backpack className="w-6 h-6" /> Рюкзак
          </h1>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>
        <div className="flex gap-4">
          <button 
            className={`flex-1 pb-2 font-bold transition-colors ${tab === 'pepegas' ? 'border-b-4 border-white text-white' : 'text-emerald-200 border-b-4 border-transparent'}`}
            onClick={() => setTab('pepegas')}
          >
            Пепедекс
          </button>
          <button 
            className={`flex-1 pb-2 font-bold transition-colors ${tab === 'items' ? 'border-b-4 border-white text-white' : 'text-emerald-200 border-b-4 border-transparent'}`}
            onClick={() => setTab('items')}
          >
            Вещи
          </button>
          <button 
            className={`flex-1 pb-2 font-bold transition-colors ${tab === 'eggs' ? 'border-b-4 border-white text-white' : 'text-emerald-200 border-b-4 border-transparent'}`}
            onClick={() => setTab('eggs')}
          >
            🥚
          </button>
          <button 
            className={`flex-1 pb-2 font-bold transition-colors ${tab === 'buddy' ? 'border-b-4 border-white text-white' : 'text-emerald-200 border-b-4 border-transparent'}`}
            onClick={() => setTab('buddy')}
          >
            ❤️ Бадди
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        {tab === 'pepegas' && (
          inventory.pepegas.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <img src="/pepega.png" alt="Empty" className="w-32 h-32 opacity-20 grayscale mb-4" />
              <p className="text-xl font-medium">Вы еще никого не поймали</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 pb-8">
              {inventory.pepegas.map((item) => {
                const typeInfo = PEPEGA_TYPES[item.typeId] || PEPEGA_TYPES.common;
                const accentColor =
                  item.typeId === 'water' ? 'border-cyan-400' :
                  item.typeId === 'fire'  ? 'border-red-400' :
                  item.typeId === 'gold'  ? 'border-yellow-400' :
                                           'border-emerald-400';
                return (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedPepega(item)}
                  className={`cursor-pointer bg-white rounded-3xl shadow-md border-2 ${accentColor} p-3 flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 ${item.typeId === 'gold' ? 'shiny-foil' : ''}`}
                >
                  <div className="w-full flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-slate-400">#{item.id.slice(0,4).toUpperCase()}</span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-lg flex items-center gap-0.5 border border-blue-200">
                      <Zap className="w-3 h-3" /> {item.cp}
                    </span>
                  </div>
                  <img src={typeInfo.sprite} alt="Pepega" className="w-20 h-20 object-contain drop-shadow-lg mb-2" />
                  <span className="font-bold text-slate-800 text-sm text-center leading-tight">{typeInfo.name}</span>
                  <span className="text-[10px] font-medium text-slate-400 mt-1">
                    {new Date(item.catchTime).toLocaleDateString()}
                  </span>
                </div>
              )})}
            </div>
          )
        )}

        {tab === 'items' && (
          <div className="pb-8">
            <h2 className="font-bold text-slate-800 mb-4 text-lg">Конфеты</h2>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {Object.keys(inventory.candies).map(type => (
                <div key={type} className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-slate-200">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    type === 'common' ? 'bg-emerald-100' :
                    type === 'water' ? 'bg-blue-100' :
                    type === 'fire' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    <Star className={`w-6 h-6 ${
                      type === 'common' ? 'text-emerald-500' :
                      type === 'water' ? 'text-blue-500' :
                      type === 'fire' ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 capitalize font-medium">{type}</p>
                    <p className="font-black text-slate-800 text-xl">{inventory.candies[type]}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="font-bold text-slate-800 mb-4 text-lg">Сумка</h2>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(inventory.items).map(([itemId, amount]) => {
                const itemInfo = ITEMS[itemId];
                if (!itemInfo) return null;
                return (
                  <div key={itemId} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-slate-200">
                    {/* CSS Pokeball */}
                    <div className={`w-14 h-14 shrink-0 rounded-full border-4 border-slate-800 flex items-center justify-center relative overflow-hidden ${itemInfo.color} shadow-md`}>
                      <div className="absolute w-full h-[50%] bottom-0 bg-white"></div>
                      <div className="absolute w-full h-[3px] bg-slate-800 z-10 top-1/2 -translate-y-1/2"></div>
                      <div className="w-4 h-4 bg-white border-3 border-slate-800 rounded-full z-20 border-[3px]"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 text-lg leading-tight">{itemInfo.name}</h3>
                      <p className="text-sm text-slate-500">Поимка ×{itemInfo.catchMultiplier}</p>
                    </div>
                    <div className="bg-slate-100 px-4 py-2 rounded-xl text-center min-w-[60px]">
                      <span className="font-black text-slate-800 text-xl">x{amount}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'eggs' && (
          <div className="pb-8">
            <h2 className="font-bold text-slate-800 mb-4 text-lg">Текущий Инкубатор</h2>
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-slate-200 text-center">
              {inventory.incubator ? (
                <>
                  <div className="w-24 h-24 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center border-4 border-orange-300">
                    <Egg className="w-12 h-12 text-orange-500" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-xl mb-2">Яйцо {inventory.incubator.requiredDistance / 1000} км</h3>
                  <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden shadow-inner mb-2">
                    <div 
                      className="bg-orange-500 h-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (inventory.incubator.currentDistance / inventory.incubator.requiredDistance) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-slate-500 font-bold">
                    {Math.floor(inventory.incubator.currentDistance)} / {inventory.incubator.requiredDistance} м
                  </p>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center border-4 border-slate-200 border-dashed">
                    <Egg className="w-12 h-12 text-slate-300" />
                  </div>
                  <h3 className="font-bold text-slate-400 text-xl">Пусто</h3>
                  <p className="text-slate-400 text-sm">Выберите яйцо ниже, чтобы начать инкубацию</p>
                </>
              )}
            </div>

            <h2 className="font-bold text-slate-800 mb-4 text-lg">Яйца ({inventory.eggs?.length || 0}/9)</h2>
            <div className="grid grid-cols-3 gap-3">
              {(inventory.eggs || []).map((egg) => (
                <button
                  key={egg.id}
                  onClick={() => onIncubate(egg)}
                  disabled={!!inventory.incubator}
                  className={`bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm border border-slate-200 transition-all ${!inventory.incubator ? 'hover:border-orange-300 hover:shadow-md active:scale-95' : 'opacity-50 cursor-not-allowed'}`}
                >
                  <Egg className={`w-10 h-10 mb-2 ${
                    egg.requiredDistance === 5000 ? 'text-violet-500' :
                    egg.requiredDistance === 2000 ? 'text-orange-500' : 'text-green-500'
                  }`} />
                  <span className="font-bold text-slate-700 text-sm">{egg.requiredDistance / 1000} км</span>
                </button>
              ))}
              {(inventory.eggs || []).length === 0 && (
                <div className="col-span-3 text-center py-8 text-slate-400">
                  Нет яиц. Вы можете найти их на Пепе-стопах!
                </div>
              )}
            </div>
          </div>
        )}
        {tab === 'buddy' && (
          <div className="pb-8">
            <h2 className="font-bold text-slate-800 mb-2 text-lg">Текущий Бадди</h2>
            {profile?.buddy ? (
              <div className="bg-pink-50 border-2 border-pink-300 rounded-3xl p-5 mb-6 flex items-center gap-4">
                <img src={PEPEGA_TYPES[profile.buddy.typeId]?.sprite} alt="buddy" className="w-20 h-20 object-contain" />
                <div>
                  <p className="font-black text-pink-700 text-xl">{PEPEGA_TYPES[profile.buddy.typeId]?.name}</p>
                  <p className="text-pink-600 text-sm font-medium">❤️ Ваш лучший друг!</p>
                  <p className="text-pink-500 text-xs mt-1">Каждые 200м → +1 конфета</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-100 rounded-3xl p-6 mb-6 text-center">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 font-bold">Нет Бадди</p>
                <p className="text-slate-400 text-sm">Выберите Пепегу ниже!</p>
              </div>
            )}

            <h2 className="font-bold text-slate-800 mb-4 text-lg">Выбрать Бадди</h2>
            <div className="grid grid-cols-2 gap-3">
              {inventory.pepegas.map(p => {
                const pInfo = PEPEGA_TYPES[p.typeId] || PEPEGA_TYPES.common;
                const isCurrentBuddy = profile?.buddy?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSetBuddy(p)}
                    className={`rounded-2xl p-3 border-2 transition-all active:scale-95 flex flex-col items-center ${isCurrentBuddy ? 'border-pink-400 bg-pink-50' : `${pInfo.color} hover:border-pink-300`}`}
                  >
                    {isCurrentBuddy && <span className="text-xs text-pink-600 font-black mb-1">❤️ БАДДИ</span>}
                    <img src={pInfo.sprite} className="w-16 h-16 object-contain mb-1" alt={pInfo.name} />
                    <span className="font-bold text-sm text-slate-800 text-center leading-tight">{pInfo.name.split(' ')[0]}</span>
                    <span className="text-xs text-blue-600 font-bold">⚡ {p.cp}</span>
                  </button>
                );
              })}
              {inventory.pepegas.length === 0 && (
                <div className="col-span-2 text-center py-8 text-slate-400">Нет Пепег. Поймайте хотя бы одну!</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
