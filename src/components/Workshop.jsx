import { X, Hammer } from 'lucide-react';

const RECIPES = [
  { id: 'pokeball', name: 'Покебол', cost: { berry: 3 }, reward: { type: 'item', id: 'pokeball' }, icon: '🔴', desc: '3 Ягоды → 1 Покебол' },
  { id: 'greatball', name: 'Грейтбол', cost: { berry: 2, iron: 1 }, reward: { type: 'item', id: 'greatball' }, icon: '🔵', desc: '2 Ягоды + 1 Железо → 1 Грейтбол' },
  { id: 'ultraball', name: 'Ультрабол', cost: { berry: 1, iron: 2, chip: 1 }, reward: { type: 'item', id: 'ultraball' }, icon: '⚫', desc: '1 Ягода + 2 Железа + 1 Чип → 1 Ультрабол' },
  { id: 'incubator', name: 'Инкубатор', cost: { iron: 5, chip: 3 }, reward: { type: 'incubator' }, icon: '🥚', desc: '5 Железа + 3 Чипа → 1 Инкубатор (2 км яйцо)' },
];

const MAT_INFO = {
  iron:  { label: 'Железо',  emoji: '🔩' },
  chip:  { label: 'Чип',    emoji: '💾' },
  berry: { label: 'Ягода',  emoji: '🍓' },
};

export default function Workshop({ inventory, onCraft, onClose }) {
  const materials = inventory.materials || { iron: 0, chip: 0, berry: 0 };

  const canCraft = (recipe) => {
    return Object.entries(recipe.cost).every(([mat, cost]) => (materials[mat] || 0) >= cost);
  };

  return (
    <div className="absolute inset-0 bg-slate-100 z-[3000] flex flex-col animate-in slide-in-from-bottom-full duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 text-white p-4 pt-8 shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Hammer className="w-7 h-7" /> Верстак
          </h1>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Materials HUD */}
        <div className="flex gap-3">
          {Object.entries(MAT_INFO).map(([id, info]) => (
            <div key={id} className="flex-1 bg-black/20 rounded-2xl p-3 text-center">
              <div className="text-2xl mb-1">{info.emoji}</div>
              <div className="font-black text-xl">{materials[id] || 0}</div>
              <div className="text-xs text-white/70 font-medium">{info.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipes */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-slate-500 text-sm font-medium mb-4">
          Материалы выпадают из Пепе-стопов при прокрутке.
        </p>
        <div className="flex flex-col gap-3">
          {RECIPES.map(recipe => {
            const craftable = canCraft(recipe);
            return (
              <div key={recipe.id} className={`bg-white rounded-3xl p-5 shadow-sm border-2 transition-all ${craftable ? 'border-amber-300' : 'border-slate-200'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${craftable ? 'bg-amber-50' : 'bg-slate-100'}`}>
                    {recipe.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-slate-800 text-lg">{recipe.name}</h3>
                    <p className="text-sm text-slate-500 mb-3">{recipe.desc}</p>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {Object.entries(recipe.cost).map(([mat, cost]) => {
                        const have = materials[mat] || 0;
                        const enough = have >= cost;
                        return (
                          <span key={mat} className={`text-xs px-2 py-1 rounded-full font-bold ${enough ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {MAT_INFO[mat]?.emoji} {have}/{cost}
                          </span>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => onCraft(recipe)}
                      disabled={!craftable}
                      className={`w-full py-2.5 rounded-xl font-black text-sm transition-all ${craftable ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md hover:scale-105 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                    >
                      {craftable ? '🔨 Скрафтить' : 'Не хватает материалов'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
