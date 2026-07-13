import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Backpack, Store, Coins, Trophy, User, Hammer, ScrollText, LogOut } from 'lucide-react';
import { useEffect } from 'react';
import { PEPEGA_TYPES, LEVELS } from '../constants';

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const pokestopReadyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const pokestopCooldownIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const gymReadyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const gymCooldownIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function Recenter({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], map.getZoom());
    }
  }, [location, map]);
  return null;
}

export default function MapView({ userLocation, pepegas, pokestops, gyms, profile, activeProfile, weather, buddyMeterDistance, questState, onCatchClick, onPokestopClick, onGymClick, onOpenInventory, onOpenShop, onOpenWorkshop, onOpenQuests, onOpenLeaderboard, onLogout }) {
  if (!userLocation) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-slate-200">
        <div className="text-xl font-bold animate-pulse text-slate-500">Определяем местоположение...</div>
      </div>
    );
  }

  const xpRequired = LEVELS.getXpRequired(profile.level);
  const progress = Math.min(100, Math.floor((profile.xp / xpRequired) * 100));

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 right-4 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 z-[1000] flex flex-col gap-2 pointer-events-auto transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full border-2 shadow-inner ${
              profile.team === 'GigaChad' ? 'bg-red-100 border-red-500' :
              profile.team === 'Sadge' ? 'bg-blue-100 border-blue-500' :
              profile.team === 'MonkaS' ? 'bg-emerald-100 border-emerald-500' :
              'bg-emerald-100 border-emerald-500'
            }`}>
              {activeProfile?.avatar
                ? <span className="text-xl leading-none">{activeProfile.avatar}</span>
                : <User className={`w-6 h-6 ${
                    profile.team === 'GigaChad' ? 'text-red-600' :
                    profile.team === 'Sadge' ? 'text-blue-600' :
                    'text-emerald-600'
                  }`} />
              }
            </div>
            <div>
              <p className="font-bold text-slate-800 leading-none text-base">
                {activeProfile?.name || 'Тренер'}
              </p>
              <p className="text-xs font-bold text-emerald-600">Ур. {profile.level}{profile.team ? ` · ${profile.team}` : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {weather && <span className="text-2xl" title={weather.label}>{weather.icon}</span>}
            <div className="bg-yellow-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-yellow-200 shadow-sm">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-black text-slate-800 text-base">{profile.coins}</span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-400 transition-all active:scale-90"
              title="Сменить профиль"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Buddy strip */}
        {profile.buddy && (
          <div className="flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-xl px-3 py-2">
            <img src={PEPEGA_TYPES[profile.buddy.typeId]?.sprite} alt="buddy" className="w-7 h-7 object-contain" />
            <p className="text-sm font-bold text-pink-700 flex-1">Бадди: {PEPEGA_TYPES[profile.buddy.typeId]?.name.split(' ')[0]}</p>
            <div className="text-xs text-pink-500 font-bold">{Math.floor(buddyMeterDistance || 0)}/200м 🍬</div>
          </div>
        )}
        
        {/* XP Bar */}
        <div className="mt-1">
          <div className="flex justify-between text-xs font-bold text-slate-500 mb-1 px-1">
            <span>{profile.xp} XP</span>
            <span>{LEVELS.getXpRequired(profile.level)} XP</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner border border-slate-300">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-[1000] pointer-events-auto">
        <button onClick={onOpenInventory} className="bg-gradient-to-b from-emerald-400 to-emerald-600 backdrop-blur-md border-2 border-white/50 active:scale-90 text-white p-4 rounded-full shadow-[0_10px_25px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-1">
          <Backpack className="w-7 h-7 drop-shadow-md" />
        </button>
        <button onClick={onOpenShop} className="bg-gradient-to-b from-yellow-300 to-amber-500 backdrop-blur-md border-2 border-white/50 active:scale-90 text-slate-900 p-4 rounded-full shadow-[0_10px_25px_rgba(250,204,21,0.5)] transition-all hover:-translate-y-1">
          <Store className="w-7 h-7 drop-shadow-md" />
        </button>
        <button onClick={onOpenWorkshop} className="bg-gradient-to-b from-orange-400 to-amber-700 backdrop-blur-md border-2 border-white/50 active:scale-90 text-white p-4 rounded-full shadow-[0_10px_25px_rgba(251,146,60,0.5)] transition-all hover:-translate-y-1">
          <Hammer className="w-7 h-7 drop-shadow-md" />
        </button>
        <button onClick={onOpenQuests} className="relative bg-gradient-to-b from-violet-500 to-purple-700 backdrop-blur-md border-2 border-white/50 active:scale-90 text-white p-4 rounded-full shadow-[0_10px_25px_rgba(139,92,246,0.5)] transition-all hover:-translate-y-1">
          <ScrollText className="w-7 h-7 drop-shadow-md" />
          {questState?.quests?.some(q => !q.claimed && q.progress >= q.target) && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </button>
        <button onClick={onOpenLeaderboard} className="bg-gradient-to-b from-yellow-400 to-amber-600 backdrop-blur-md border-2 border-white/50 active:scale-90 text-slate-900 p-4 rounded-full shadow-[0_10px_25px_rgba(251,191,36,0.5)] transition-all hover:-translate-y-1">
          <Trophy className="w-7 h-7 drop-shadow-md" />
        </button>
      </div>

      <MapContainer 
        center={[userLocation.lat, userLocation.lng]} 
        zoom={18} 
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter location={userLocation} />
        
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>Это вы!</Popup>
        </Marker>

        {pokestops.map(stop => {
          const isCooldown = (Date.now() - stop.lastUsed) < 3 * 60 * 1000;
          return (
            <Marker 
              key={stop.id} 
              position={[stop.lat, stop.lng]} 
              icon={isCooldown ? pokestopCooldownIcon : pokestopReadyIcon}
              eventHandlers={{
                click: () => onPokestopClick(stop),
              }}
            >
              <Popup>{isCooldown ? 'Перезаряжается...' : 'Пепе-стоп'}</Popup>
            </Marker>
          );
        })}

        {gyms.map(gym => {
          const isCooldown = (Date.now() - gym.lastDefeated) < 24 * 60 * 60 * 1000;
          return (
            <Marker 
              key={gym.id} 
              position={[gym.lat, gym.lng]} 
              icon={isCooldown ? gymCooldownIcon : gymReadyIcon}
              eventHandlers={{
                click: () => onGymClick(gym),
              }}
            >
              <Popup>{isCooldown ? 'Арена побеждена' : 'Арена Пепег'}</Popup>
            </Marker>
          );
        })}

        {pepegas.map(pepega => {
          const typeInfo = PEPEGA_TYPES[pepega.typeId] || PEPEGA_TYPES.common;
          const customIcon = new L.Icon({
            iconUrl: typeInfo.sprite,
            iconSize: [50, 50],
            iconAnchor: [25, 25],
          });
          return (
            <Marker 
              key={pepega.id} 
              position={[pepega.lat, pepega.lng]} 
              icon={customIcon}
              eventHandlers={{
                click: () => onCatchClick(pepega),
              }}
            >
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
