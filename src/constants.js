export const PEPEGA_TYPES = {
  common:       { id: 'common',       name: 'Обычный Пепега',    xp: 100,  catchRate: 0.8, color: 'bg-gradient-to-br from-green-50 to-emerald-100 border-emerald-300',            sprite: '/pepega.png',       chance: 0.60, evolvesTo: 'fire',  evolutionCost: 25 },
  water:        { id: 'water',        name: 'Водяной Пепега',    xp: 150,  catchRate: 0.6, color: 'bg-gradient-to-br from-blue-50 to-cyan-100 border-cyan-300',                  sprite: '/pepega_water.png', chance: 0.25, evolvesTo: null,    evolutionCost: null },
  fire:         { id: 'fire',         name: 'Огненный Пепега',   xp: 200,  catchRate: 0.5, color: 'bg-gradient-to-br from-orange-50 to-red-100 border-red-300',                  sprite: '/pepega_fire.png',  chance: 0.10, evolvesTo: 'gold',  evolutionCost: 50 },
  gold:         { id: 'gold',         name: 'Золотой Пепега',    xp: 500,  catchRate: 0.2, color: 'bg-gradient-to-br from-yellow-100 via-yellow-300 to-amber-200 border-yellow-400 shiny-foil', sprite: '/pepega_gold.png',  chance: 0.05, evolvesTo: null,    evolutionCost: null },
};

export const DAILY_QUEST_POOL = [
  { id: 'catch3',    label: 'Поймай 3 Пепеги',          type: 'catch',    target: 3,   reward: { coins: 50, ultraball: 1 } },
  { id: 'catch5',    label: 'Поймай 5 Пепег',            type: 'catch',    target: 5,   reward: { coins: 100 } },
  { id: 'catchFire', label: 'Поймай Огненного Пепегу',   type: 'catchType', target: 1, targetType: 'fire', reward: { coins: 80, greatball: 2 } },
  { id: 'spin3',     label: 'Прокрути 3 Пепе-стопа',     type: 'spin',     target: 3,   reward: { coins: 60, pokeball: 5 } },
  { id: 'walk500',   label: 'Пройди 500 метров',          type: 'walk',     target: 500, reward: { coins: 75, greatball: 1 } },
  { id: 'gym1',      label: 'Победи 1 Арену',             type: 'gym',      target: 1,   reward: { coins: 150, ultraball: 1 } },
  { id: 'evolve1',   label: 'Эволюционируй Пепегу',       type: 'evolve',   target: 1,   reward: { coins: 100 } },
];

export const ITEMS = {
  pokeball: { id: 'pokeball', name: 'Покебол', catchMultiplier: 1.0, price: 10, color: 'bg-red-500' },
  greatball: { id: 'greatball', name: 'Грейтбол', catchMultiplier: 1.5, price: 50, color: 'bg-blue-500' },
  ultraball: { id: 'ultraball', name: 'Ультрабол', catchMultiplier: 2.0, price: 150, color: 'bg-slate-800' },
};

export const WEATHER_SPAWN_MULTIPLIERS = {
  sunny:   { fire: 1.5, gold: 1.3 },
  rainy:   { water: 1.7 },
  stormy:  { _elite: true },
  snowy:   { _slow: true },
  cloudy:  {},
};

export const LEVELS = {
  getXpRequired: (level) => level * 1000,
  getCoinsReward: (level) => level * 50,
};

export const getRandomPepegaType = () => {
  const rand = Math.random();
  let cumulative = 0;
  for (const key in PEPEGA_TYPES) {
    cumulative += PEPEGA_TYPES[key].chance;
    if (rand <= cumulative) {
      return key;
    }
  }
  return 'common';
};

export const generatePepegaStats = (playerLevel) => {
  const maxCP = Math.max(100, playerLevel * 200);
  const cp = Math.floor(Math.random() * maxCP) + 10;
  
  const weight = (10 + Math.random() * 20).toFixed(1);
  const height = (0.5 + Math.random() * 1.0).toFixed(2);
  
  return { cp, weight, height };
}

export const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const p1 = lat1 * Math.PI/180;
  const p2 = lat2 * Math.PI/180;
  const dp = (lat2-lat1) * Math.PI/180;
  const dl = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(dp/2) * Math.sin(dp/2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dl/2) * Math.sin(dl/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return Math.floor(R * c);
};
