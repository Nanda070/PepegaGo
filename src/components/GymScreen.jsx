import { useState, useEffect } from 'react';
import { X, Swords, Zap, ShieldAlert, Trophy, Skull } from 'lucide-react';
import { PEPEGA_TYPES, getDistance } from '../constants';

export default function GymScreen({ userLocation, gym, inventory, profile, onVictory, onRaid, onClose }) {
  const distance = getDistance(userLocation.lat, userLocation.lng, gym.lat, gym.lng);
  const isCooldown = (Date.now() - gym.lastDefeated) < 24 * 60 * 60 * 1000;
  
  const [battleState, setBattleState] = useState('select'); // select, battle, victory, defeat
  const [selectedPepega, setSelectedPepega] = useState(null);
  
  const bossInfo = PEPEGA_TYPES[gym.boss.typeId] || PEPEGA_TYPES.common;
  
  const [bossHp, setBossHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);
  const [shakePlayer, setShakePlayer] = useState(false);
  const [shakeBoss, setShakeBoss] = useState(false);

  const getMultiplier = (atkType, defType) => {
    if (atkType === 'gold') return 1.5;
    if (atkType === 'water' && defType === 'fire') return 1.5;
    if (atkType === 'fire' && defType === 'common') return 1.2;
    if (defType === 'gold') return 0.8;
    return 1.0;
  };

  useEffect(() => {
    if (battleState === 'battle') {
      const bossMaxHp = gym.boss.cp * 2;
      const playerMaxHp = selectedPepega.cp * 2;
      
      let currentBossHp = bossMaxHp;
      let currentPlayerHp = playerMaxHp;
      
      const pMult = getMultiplier(selectedPepega.typeId, gym.boss.typeId);
      const bMult = getMultiplier(gym.boss.typeId, selectedPepega.typeId);

      const interval = setInterval(() => {
        // Player attacks boss
        setTimeout(() => {
          setShakeBoss(true);
          const pDmg = (selectedPepega.cp * 0.15 * pMult) + (Math.random() * 50);
          currentBossHp -= pDmg;
          setBossHp(Math.max(0, (currentBossHp / bossMaxHp) * 100));
          setTimeout(() => setShakeBoss(false), 200);
          
          if (currentBossHp <= 0) {
             clearInterval(interval);
             setTimeout(() => setBattleState('victory'), 1000);
             return;
          }
        }, 100);
        
        // Boss attacks player
        setTimeout(() => {
          setShakePlayer(true);
          const bDmg = (gym.boss.cp * 0.15 * bMult) + (Math.random() * 50);
          currentPlayerHp -= bDmg;
          setPlayerHp(Math.max(0, (currentPlayerHp / playerMaxHp) * 100));
          setTimeout(() => setShakePlayer(false), 200);
          
          if (currentPlayerHp <= 0 && currentBossHp > 0) {
             clearInterval(interval);
             setTimeout(() => setBattleState('defeat'), 1000);
          }
        }, 600);
        
      }, 1200);
      
      return () => clearInterval(interval);
    }
  }, [battleState]);

  if (distance > 80) {
    return (
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md z-[2000] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 text-center max-w-xs shadow-2xl relative">
          <button onClick={onClose} className="absolute top-2 right-2 p-2 rounded-full hover:bg-slate-100"><X/></button>
          <ShieldAlert className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Слишком далеко</h2>
          <p className="text-slate-500">Подойдите к Арене ближе 80 метров!</p>
        </div>
      </div>
    );
  }

  if (isCooldown) {
    return (
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md z-[2000] flex flex-col items-center justify-center p-4">
        <div className="bg-slate-800 rounded-3xl p-6 text-center max-w-xs shadow-2xl relative text-white border border-slate-700">
          <button onClick={onClose} className="absolute top-2 right-2 p-2 rounded-full hover:bg-slate-700"><X/></button>
          <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4 opacity-50" />
          <h2 className="text-xl font-bold mb-2">Арена повержена</h2>
          <p className="text-slate-400">Босс отдыхает. Возвращайтесь завтра!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-slate-900 z-[2000] flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-red-600 p-4 pt-8 text-white flex justify-between items-center shadow-lg relative z-10">
        <h1 className="text-2xl font-black flex items-center gap-2 uppercase tracking-wider"><Swords/> АРЕНА</h1>
        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X/></button>
      </div>

      {battleState === 'select' && (
        <div className="flex-1 flex flex-col p-4 overflow-hidden relative">
          <div className="text-center text-white mb-6">
            <h2 className="text-xl font-bold text-red-400 mb-1">БОСС АРЕНЫ</h2>
            <div className="flex justify-center mb-2">
              <img src={bossInfo.sprite} className="w-32 h-32 object-contain drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            </div>
            <div className="text-2xl font-black flex items-center justify-center gap-1">
              {bossInfo.name} <span className="text-blue-400 flex items-center text-xl bg-blue-900/50 px-2 py-0.5 rounded-lg"><Zap className="w-5 h-5"/>{gym.boss.cp}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-t-3xl flex-1 -mx-4 p-4 flex flex-col shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
            {/* Raid button */}
            <button
              onClick={onRaid}
              className="w-full mb-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-black py-3 rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              📱 AR-Рейд (Тап-битва)
            </button>
            <h3 className="font-bold text-slate-800 mb-4 text-center">ВЫБЕРИТЕ БОЙЦА (Авто-бой)</h3>
            {inventory.pepegas.length === 0 ? (
              <p className="text-center text-slate-500 mt-10">У вас нет Пепег для битвы!</p>
            ) : (
              <div className="overflow-y-auto flex-1 grid grid-cols-2 gap-3 pb-8">
                {inventory.pepegas.map(p => {
                  const pInfo = PEPEGA_TYPES[p.typeId] || PEPEGA_TYPES.common;
                  return (
                    <button 
                      key={p.id}
                      onClick={() => { setSelectedPepega(p); setBattleState('battle'); }}
                      className={`rounded-2xl p-3 border-2 transition-all active:scale-95 text-left flex flex-col items-center ${pInfo.color} hover:border-blue-500 hover:shadow-md`}
                    >
                      <span className="text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 mb-2 w-full justify-center">
                        <Zap className="w-3 h-3" /> {p.cp}
                      </span>
                      <img src={pInfo.sprite} className="w-16 h-16 object-contain mb-1" />
                      <span className="font-bold text-sm text-slate-800 text-center leading-tight">{pInfo.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {battleState === 'battle' && selectedPepega && (
        <div className="flex-1 flex flex-col items-center justify-around p-4 relative overflow-hidden bg-gradient-to-b from-slate-900 via-red-950 to-slate-900">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          
          {/* Boss */}
          <div className={`w-full max-w-sm flex flex-col items-end transition-transform ${shakeBoss ? 'translate-x-2 translate-y-1 brightness-150' : ''}`}>
            <div className="flex items-center gap-2 mb-2 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md border border-red-900">
              <span className="text-white font-bold">{bossInfo.name}</span>
              <span className="text-blue-400 font-bold flex items-center text-sm"><Zap className="w-4 h-4"/>{gym.boss.cp}</span>
            </div>
            <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden border border-slate-600 shadow-lg">
              <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${bossHp}%` }}></div>
            </div>
            <img src={bossInfo.sprite} className="w-40 h-40 object-contain drop-shadow-[0_0_25px_rgba(239,68,68,0.3)] mt-4" />
          </div>

          <Swords className="w-16 h-16 text-yellow-500 opacity-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          {/* Player */}
          <div className={`w-full max-w-sm flex flex-col items-start transition-transform ${shakePlayer ? '-translate-x-2 -translate-y-1 brightness-150' : ''}`}>
            <img src={(PEPEGA_TYPES[selectedPepega.typeId]||PEPEGA_TYPES.common).sprite} className="w-40 h-40 object-contain drop-shadow-[0_0_25px_rgba(59,130,246,0.3)] mb-4 scale-x-[-1]" />
            <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden border border-slate-600 shadow-lg">
              <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${playerHp}%` }}></div>
            </div>
            <div className="flex items-center gap-2 mt-2 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md border border-emerald-900">
              <span className="text-white font-bold">Ваш Пепега</span>
              <span className="text-blue-400 font-bold flex items-center text-sm"><Zap className="w-4 h-4"/>{selectedPepega.cp}</span>
            </div>
          </div>
        </div>
      )}

      {(battleState === 'victory' || battleState === 'defeat') && (
        <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-6 animate-in zoom-in-95 duration-500">
          {battleState === 'victory' ? (
            <>
              <Trophy className="w-32 h-32 text-yellow-400 mb-6 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
              <h2 className="text-5xl font-black text-white mb-2 uppercase tracking-widest text-center">Победа!</h2>
              <p className="text-yellow-400 text-xl font-bold mb-8">Босс Арены повержен</p>
              <button onClick={() => onVictory()} className="bg-yellow-400 text-black font-black text-xl px-12 py-4 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                ЗАБРАТЬ НАГРАДУ
              </button>
            </>
          ) : (
            <>
              <Skull className="w-32 h-32 text-slate-500 mb-6 drop-shadow-[0_0_20px_rgba(100,116,139,0.5)]" />
              <h2 className="text-5xl font-black text-white mb-2 uppercase tracking-widest text-center">Поражение</h2>
              <p className="text-red-400 text-xl font-bold mb-8">Ваш Пепега оказался слабее</p>
              <button onClick={onClose} className="bg-slate-700 text-white font-black text-xl px-12 py-4 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-lg">
                ОТСТУПИТЬ
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
