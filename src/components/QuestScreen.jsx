import { X } from 'lucide-react';
import { DAILY_QUEST_POOL } from '../constants';
import { playQuestComplete } from '../utils/sounds';

function getDailyQuests() {
  const today = new Date().toDateString();
  const saved = localStorage.getItem('pepegaQuests');
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed.date === today) return parsed;
  }
  // Generate 3 random quests for today
  const shuffled = [...DAILY_QUEST_POOL].sort(() => Math.random() - 0.5);
  const daily = {
    date: today,
    quests: shuffled.slice(0, 3).map(q => ({ ...q, progress: 0, claimed: false }))
  };
  localStorage.setItem('pepegaQuests', JSON.stringify(daily));
  return daily;
}

const QUEST_ICONS = {
  catch: '🎯', catchType: '🔥', spin: '🔵', walk: '👟', gym: '⚔️', evolve: '🧬'
};

export default function QuestScreen({ questState, onClaim, onClose }) {
  const data = questState || getDailyQuests();
  const quests = data.quests || [];

  const handleClaim = (quest) => {
    playQuestComplete();
    onClaim(quest);
  };

  return (
    <div className="absolute inset-0 bg-slate-100 z-[3000] flex flex-col animate-in slide-in-from-bottom-full duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 text-white p-4 pt-8 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-black flex items-center gap-2">
            📜 Ежедневные Квесты
          </h1>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>
        <p className="text-violet-200 text-sm font-medium">Обновляются каждый день в полночь</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {quests.map((quest) => {
          const progress = Math.min(quest.progress || 0, quest.target);
          const percent = Math.min(100, Math.floor((progress / quest.target) * 100));
          const isComplete = progress >= quest.target;
          const isClaimed = quest.claimed;

          return (
            <div key={quest.id} className={`bg-white rounded-3xl p-5 shadow-sm border-2 transition-all ${
              isClaimed ? 'border-slate-200 opacity-60' :
              isComplete ? 'border-violet-400 shadow-violet-100' : 'border-slate-200'
            }`}>
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                  isClaimed ? 'bg-slate-100' : isComplete ? 'bg-violet-100' : 'bg-slate-50'
                }`}>
                  {isClaimed ? '✅' : QUEST_ICONS[quest.type] || '🎯'}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-slate-800 text-base">{quest.label}</h3>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {Object.entries(quest.reward || {}).map(([key, val]) => (
                      <span key={key} className="text-xs bg-yellow-50 border border-yellow-200 text-yellow-700 px-2 py-0.5 rounded-full font-bold">
                        {key === 'coins' ? `💰 ${val}` : key === 'ultraball' ? `⚫ ×${val}` : key === 'greatball' ? `🔵 ×${val}` : key === 'pokeball' ? `🔴 ×${val}` : `${key} ×${val}`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>{progress} / {quest.target}</span>
                  <span>{percent}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isClaimed ? 'bg-slate-400' : isComplete ? 'bg-violet-500' : 'bg-violet-300'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {isComplete && !isClaimed && (
                <button
                  onClick={() => handleClaim(quest)}
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-black py-3 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  🎁 Забрать награду!
                </button>
              )}
              {isClaimed && (
                <div className="w-full text-center text-slate-400 font-bold text-sm py-2">Выполнено ✓</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
