import { X, Trophy, Zap } from 'lucide-react';
import { PEPEGA_TYPES } from '../constants';

const TEAM_COLORS = {
  GigaChad: 'bg-red-500',
  Sadge: 'bg-blue-500',
  MonkaS: 'bg-emerald-500',
};

const TEAM_EMOJIS = {
  GigaChad: '🔴',
  Sadge: '🔵',
  MonkaS: '🟢',
};

// Generate simulated opponents
function generateRivals(playerLevel) {
  const names = ['PepegaMaster', 'Sadge_Pro', 'GigaTrainer', 'WaterBoy', 'FireLord99', 'GoldHunter', 'Pepegalover'];
  const teams = ['GigaChad', 'Sadge', 'MonkaS'];
  return names.map((name, i) => {
    const level = Math.max(1, playerLevel + Math.floor(Math.random() * 6) - 3);
    const pepegaCount = Math.floor(Math.random() * 20) + 5;
    const totalCp = Math.floor(Math.random() * 10000) + pepegaCount * 100;
    return {
      name,
      level,
      pepegaCount,
      totalCp,
      team: teams[Math.floor(Math.random() * teams.length)],
      isRival: true,
    };
  });
}

export default function LeaderboardScreen({ profile, inventory, activeProfile, onClose }) {
  const playerTotalCp = inventory.pepegas.reduce((sum, p) => sum + (p.cp || 0), 0);
  const playerEntry = {
    name: activeProfile?.name || 'Вы',
    level: profile.level,
    pepegaCount: inventory.pepegas.length,
    totalCp: playerTotalCp,
    team: profile.team,
    isPlayer: true,
  };

  const rivals = generateRivals(profile.level);
  const allPlayers = [...rivals, playerEntry]
    .sort((a, b) => b.level !== a.level ? b.level - a.level : b.totalCp - a.totalCp);

  const playerRank = allPlayers.findIndex(p => p.isPlayer) + 1;

  return (
    <div className="absolute inset-0 bg-slate-900 z-[3000] flex flex-col animate-in slide-in-from-bottom-full duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-4 pt-8 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Trophy className="w-7 h-7" /> Таблица Лидеров
          </h1>
          <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors">
            <X className="w-8 h-8 text-slate-900" />
          </button>
        </div>
        <div className="bg-black/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="text-3xl font-black text-slate-900">#{playerRank}</div>
          <div>
            <p className="font-black text-slate-900">Ваше место</p>
            <p className="text-slate-900/70 text-sm font-medium">{profile.team ? `Team ${profile.team}` : 'Без фракции'}</p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {allPlayers.map((player, i) => {
          const rank = i + 1;
          const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
          const teamColor = player.team ? TEAM_COLORS[player.team] : 'bg-slate-500';
          const teamEmoji = player.team ? TEAM_EMOJIS[player.team] : '⬜';
          
          return (
            <div
              key={i}
              className={`rounded-2xl p-4 flex items-center gap-3 transition-all ${
                player.isPlayer
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/30 border-2 border-yellow-300'
                  : 'bg-slate-800 border border-slate-700'
              }`}
            >
              <div className={`w-10 text-center text-2xl font-black ${player.isPlayer ? 'text-slate-900' : 'text-white'}`}>
                {rankEmoji}
              </div>

              <div className={`w-10 h-10 rounded-full ${teamColor} flex items-center justify-center text-xl shrink-0`}>
                {teamEmoji}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`font-black text-base truncate ${player.isPlayer ? 'text-slate-900' : 'text-white'}`}>
                  {player.name} {player.isPlayer && '(Вы)'}
                </p>
                <p className={`text-sm font-medium ${player.isPlayer ? 'text-slate-700' : 'text-slate-400'}`}>
                  {player.pepegaCount} Пепег · {player.totalCp} CP
                </p>
              </div>

              <div className={`text-right ${player.isPlayer ? 'text-slate-900' : 'text-white'}`}>
                <div className="font-black text-xl">Ур.{player.level}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
