import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { PEPEGA_TYPES } from '../constants';

export default function RaidScreen({ gym, onVictory, onClose }) {
  const RAID_TIME = 30;
  const [timeLeft, setTimeLeft] = useState(RAID_TIME);
  const [bossHp, setBossHp] = useState(gym.boss.cp * 2);
  const [bossMaxHp] = useState(gym.boss.cp * 2);
  const [taps, setTaps] = useState(0);
  const [phase, setPhase] = useState('raid'); // 'raid' | 'win' | 'lose'
  const [tapEffects, setTapEffects] = useState([]);
  const videoRef = useRef(null);
  const bossInfo = PEPEGA_TYPES[gym.boss.typeId] || PEPEGA_TYPES.common;

  // Camera
  useEffect(() => {
    let stream = null;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then(s => { stream = s; if (videoRef.current) videoRef.current.srcObject = s; })
      .catch(() => {});
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== 'raid') return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(t); setPhase('lose'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  const handleTap = (e) => {
    if (phase !== 'raid') return;
    const dmg = Math.floor(Math.random() * 40) + 30; // 30-70 dmg per tap
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = e.touches ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    const effectId = Date.now() + Math.random();
    setTapEffects(prev => [...prev, { id: effectId, x, y, dmg }]);
    setTimeout(() => setTapEffects(prev => prev.filter(ef => ef.id !== effectId)), 600);

    setTaps(t => t + 1);
    setBossHp(prev => {
      const next = prev - dmg;
      if (next <= 0) { setPhase('win'); return 0; }
      return next;
    });
  };

  const bossHpPercent = Math.max(0, (bossHp / bossMaxHp) * 100);
  const timePercent = (timeLeft / RAID_TIME) * 100;

  return (
    <div className="absolute inset-0 z-[5000] bg-black flex flex-col overflow-hidden camera-vignette">
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" />

      {/* HUD Top */}
      <div className="relative z-10 p-4 pt-8">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onClose} className="bg-black/40 backdrop-blur-md p-2 rounded-full">
            <X className="w-6 h-6 text-white" />
          </button>
          {/* Timer */}
          <div className={`px-4 py-2 rounded-full font-black text-lg backdrop-blur-md ${timeLeft <= 10 ? 'bg-red-500/80 text-white' : 'bg-black/40 text-white'}`}>
            ⏱ {timeLeft}с
          </div>
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
            <span className="text-white font-black">👊 {taps}</span>
          </div>
        </div>

        {/* Timer bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mb-3 overflow-hidden">
          <div className="bg-yellow-400 h-full transition-all duration-1000" style={{ width: `${timePercent}%` }} />
        </div>

        {/* Boss HP */}
        <div className="bg-black/50 backdrop-blur-md rounded-2xl p-3">
          <div className="flex justify-between text-white text-sm font-bold mb-1">
            <span>{bossInfo.name}</span>
            <span>{Math.max(0, bossHp)} / {bossMaxHp} HP</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-400 h-full transition-all duration-100 shadow-[0_0_10px_rgba(239,68,68,0.6)]" style={{ width: `${bossHpPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Tap target */}
      {phase === 'raid' && (
        <div
          className="flex-1 flex items-center justify-center relative cursor-pointer select-none"
          onClick={handleTap}
          onTouchStart={handleTap}
        >
          <div className="relative">
            <img
              src={bossInfo.sprite}
              alt="Boss"
              className="w-56 h-56 object-contain drop-shadow-2xl animate-bounce"
              style={{ animationDuration: '2s' }}
            />
            {/* Hit flash */}
          </div>
          
          {/* Tap effects */}
          {tapEffects.map(ef => (
            <div
              key={ef.id}
              className="absolute pointer-events-none text-yellow-300 font-black text-3xl animate-bounce"
              style={{ left: ef.x, top: ef.y, transform: 'translate(-50%,-50%)' }}
            >
              -{ef.dmg}
            </div>
          ))}

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 font-bold text-lg animate-pulse">
            ТАП по Пепеге! 👆
          </div>
        </div>
      )}

      {/* Win screen */}
      {phase === 'win' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
          <div className="text-6xl mb-4 animate-bounce">🏆</div>
          <h2 className="text-3xl font-black text-white mb-2">ПОБЕДА!</h2>
          <p className="text-white/80 mb-2 text-center font-bold">Вы нанесли {taps} ударов!</p>
          {timeLeft > 15 && <p className="text-yellow-300 font-black text-lg mb-6">⚡ Бонус за скорость! ×2 монеты!</p>}
          <button
            onClick={() => onVictory(null)}
            className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-black text-xl px-10 py-4 rounded-3xl shadow-2xl shadow-yellow-500/50 hover:scale-105 transition-all"
          >
            Забрать награду!
          </button>
        </div>
      )}

      {/* Lose screen */}
      {phase === 'lose' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-3xl font-black text-white mb-2">Время вышло!</h2>
          <p className="text-white/80 mb-6 text-center">Вы не успели победить босса. Попробуйте снова!</p>
          <button
            onClick={onClose}
            className="bg-slate-600 text-white font-black text-xl px-10 py-4 rounded-3xl hover:scale-105 transition-all"
          >
            Назад
          </button>
        </div>
      )}
    </div>
  );
}
