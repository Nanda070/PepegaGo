export default function TeamSelect({ onSelect }) {
  const teams = [
    { id: 'GigaChad', name: 'Team GigaChad', emoji: '🔴', desc: 'Сила и мощь. Для настоящих чемпионов.', from: 'from-red-500', to: 'to-rose-700', border: 'border-red-400', shadow: 'shadow-red-500/40' },
    { id: 'Sadge',    name: 'Team Sadge',    emoji: '🔵', desc: 'Мудрость и тактика. Для умных тренеров.', from: 'from-blue-500', to: 'to-indigo-700', border: 'border-blue-400', shadow: 'shadow-blue-500/40' },
    { id: 'MonkaS',   name: 'Team MonkaS',   emoji: '🟢', desc: 'Баланс и природа. Для истинных путников.', from: 'from-emerald-500', to: 'to-green-700', border: 'border-emerald-400', shadow: 'shadow-emerald-500/40' },
  ];

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 z-[9000] flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="text-6xl mb-4">⚔️</div>
        <h1 className="text-3xl font-black text-white mb-2">Выберите Фракцию</h1>
        <p className="text-slate-400 font-medium">Вы достигли 5 уровня! Выберите команду, чтобы сражаться за Арены.</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => onSelect(team.id)}
            className={`bg-gradient-to-r ${team.from} ${team.to} border-2 ${team.border} rounded-3xl p-5 flex items-center gap-4 shadow-2xl ${team.shadow} hover:scale-105 active:scale-95 transition-all duration-200`}
          >
            <div className="text-4xl">{team.emoji}</div>
            <div className="text-left">
              <h2 className="font-black text-white text-xl">{team.name}</h2>
              <p className="text-white/70 text-sm font-medium">{team.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
