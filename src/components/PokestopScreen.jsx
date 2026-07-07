import { MapPin, X, Disc } from 'lucide-react';
import { getDistance } from '../constants';

export default function PokestopScreen({ userLocation, pokestop, onSpin, onClose }) {
  const distance = getDistance(userLocation.lat, userLocation.lng, pokestop.lat, pokestop.lng);
  const isCooldown = (Date.now() - pokestop.lastUsed) < 3 * 60 * 1000;
  
  let cooldownMin = 0;
  let cooldownSec = 0;
  if (isCooldown) {
    const remaining = (3 * 60 * 1000) - (Date.now() - pokestop.lastUsed);
    cooldownMin = Math.floor(remaining / 60000);
    cooldownSec = Math.floor((remaining % 60000) / 1000);
  }

  const handleSpin = () => {
    const pokeballs = Math.floor(Math.random() * 3) + 1;
    const coins = Math.floor(Math.random() * 20) + 5;
    
    // Materials
    const iron = Math.random() < 0.4 ? Math.floor(Math.random() * 2) + 1 : 0;
    const chip = Math.random() < 0.2 ? 1 : 0;
    const berry = Math.random() < 0.5 ? Math.floor(Math.random() * 2) + 1 : 0;

    // Egg drop (30%)
    let egg = null;
    if (Math.random() < 0.3) {
      const distances = [1000, 2000, 5000];
      const dist = distances[Math.floor(Math.random() * distances.length)];
      egg = { id: 'egg-' + Date.now(), requiredDistance: dist, receivedAt: new Date().toISOString() };
    }
    
    onSpin({ pokeballs, coins, iron, chip, berry, egg });
  };

  return (
    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md z-[2000] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 relative">
        <div className={`h-48 flex items-center justify-center ${isCooldown ? 'bg-violet-500' : 'bg-blue-500'} relative`}>
          <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-colors z-20">
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center text-white z-10 drop-shadow-md">
            <MapPin className="w-16 h-16 mx-auto mb-2" />
            <h2 className="text-2xl font-bold">Пепе-стоп</h2>
          </div>
          
          <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-white to-transparent"></div>
        </div>
        
        <div className="p-6 text-center">
          <p className="text-slate-500 mb-6 font-medium bg-slate-100 inline-block px-4 py-1 rounded-full">Дистанция: {distance} метров</p>
          
          {isCooldown ? (
            <div className="bg-slate-100 rounded-2xl p-4 mb-2">
              <p className="text-slate-500 font-bold mb-1">Перезарядка</p>
              <p className="text-3xl font-black text-violet-500">{cooldownMin}:{cooldownSec.toString().padStart(2, '0')}</p>
            </div>
          ) : distance > 50 ? (
            <div className="bg-red-50 text-red-600 rounded-2xl p-4 mb-2 border border-red-100">
              <p className="font-bold text-lg mb-1">Слишком далеко!</p>
              <p className="text-sm">Подойдите ближе 50 метров.</p>
            </div>
          ) : (
            <button 
              onClick={onSpin}
              className="w-full bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all text-white font-bold py-4 rounded-2xl text-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
              <Disc className="w-6 h-6 group-hover:animate-spin" /> Собрать награды
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
