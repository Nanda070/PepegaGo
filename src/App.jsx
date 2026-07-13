import { useState, useEffect } from 'react';
import MapView from './components/MapView';
import CatchScreen from './components/CatchScreen';
import Inventory from './components/Inventory';
import Shop from './components/Shop';
import PokestopScreen from './components/PokestopScreen';
import GymScreen from './components/GymScreen';
import TeamSelect from './components/TeamSelect';
import Workshop from './components/Workshop';
import RaidScreen from './components/RaidScreen';
import EvolutionScreen from './components/EvolutionScreen';
import QuestScreen from './components/QuestScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import LoginScreen from './components/LoginScreen';
import ToastContainer from './components/Toast';
import { getRandomPepegaType, generatePepegaStats, LEVELS, PEPEGA_TYPES, getDistance, DAILY_QUEST_POOL } from './constants';
import { playCatch, playFlee, playWin } from './utils/sounds';

// Helpers for per-profile storage keys
const profileKey = (profileId, key) => `pepega_${profileId}_${key}`;

// Sync active localStorage keys → profile-scoped keys
function syncProfileOut(profileId) {
  ['pepegaInventory', 'pepegaProfile', 'pepegaPokestops', 'pepegaGyms', 'pepegaQuests'].forEach(key => {
    const val = localStorage.getItem(key);
    if (val) localStorage.setItem(profileKey(profileId, key.replace('pepega', '').toLowerCase()), val);
  });
}

function App() {
  const [activeProfile, setActiveProfile] = useState(null);
  const [currentView, setCurrentView] = useState('map');
  const [userLocation, setUserLocation] = useState(null);
  const [pepegas, setPepegas] = useState([]);
  const [evolutionData, setEvolutionData] = useState(null); // { pepega, newTypeId }

  // Quests state
  const [questState, setQuestState] = useState(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem('pepegaQuests');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) return parsed;
    }
    const shuffled = [...DAILY_QUEST_POOL].sort(() => Math.random() - 0.5);
    const daily = {
      date: today,
      quests: shuffled.slice(0, 3).map(q => ({ ...q, progress: 0, claimed: false }))
    };
    localStorage.setItem('pepegaQuests', JSON.stringify(daily));
    return daily;
  });

  // Advance quest progress
  const advanceQuest = (type, opts = {}) => {
    setQuestState(prev => {
      const newQuests = prev.quests.map(q => {
        if (q.claimed || q.progress >= q.target) return q;
        if (q.type === type) {
          if (type === 'catchType' && q.targetType !== opts.typeId) return q;
          return { ...q, progress: Math.min(q.target, (q.progress || 0) + 1) };
        }
        if (type === 'walk' && q.type === 'walk') {
          return { ...q, progress: Math.min(q.target, (q.progress || 0) + (opts.dist || 0)) };
        }
        return q;
      });
      const updated = { ...prev, quests: newQuests };
      localStorage.setItem('pepegaQuests', JSON.stringify(updated));
      return updated;
    });
  };


  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };
  
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('pepegaInventory');
    let parsed = saved ? JSON.parse(saved) : null;
    const defaultItems = { pokeball: 20, greatball: 5, ultraball: 1 };
    const defaultCandies = { common: 0, water: 0, fire: 0, gold: 0 };
    
    if (parsed) {
      return { 
        pepegas: Array.isArray(parsed.pepegas) ? parsed.pepegas : (Array.isArray(parsed) ? parsed : []), 
        items: parsed.items || defaultItems,
        candies: parsed.candies || defaultCandies,
        eggs: parsed.eggs || [],
        incubator: parsed.incubator || null
      };
    }
    return { pepegas: [], items: defaultItems, candies: defaultCandies, eggs: [], incubator: null };
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('pepegaProfile');
    return saved ? JSON.parse(saved) : { level: 1, xp: 0, coins: 0, team: null, buddy: null };
  });

  const handleLogin = (profile) => {
    setActiveProfile(profile);
  };

  const handleLogout = () => {
    // Save current state before logout
    if (activeProfile) syncProfileOut(activeProfile.id);
    setActiveProfile(null);
    // Reset in-memory state
    setCurrentView('map');
    setUserLocation(null);
    setPepegas([]);
    setEvolutionData(null);
    setPokestops(null);
    setGyms(null);
    setWeather(null);
    setTargetPepega(null);
    setTargetPokestop(null);
    setTargetGym(null);
    setPrevLocation(null);
    setBuddyMeterDistance(0);
    // Re-read fresh data from localStorage (which was loaded by LoginScreen)
    const savedInv = localStorage.getItem('pepegaInventory');
    const defaultItems = { pokeball: 20, greatball: 5, ultraball: 1 };
    const defaultCandies = { common: 0, water: 0, fire: 0, gold: 0 };
    if (savedInv) {
      const parsed = JSON.parse(savedInv);
      setInventory({
        pepegas: Array.isArray(parsed.pepegas) ? parsed.pepegas : [],
        items: parsed.items || defaultItems,
        candies: parsed.candies || defaultCandies,
        eggs: parsed.eggs || [],
        incubator: parsed.incubator || null
      });
    } else {
      setInventory({ pepegas: [], items: defaultItems, candies: defaultCandies, eggs: [], incubator: null });
    }
    const savedProf = localStorage.getItem('pepegaProfile');
    setProfile(savedProf ? JSON.parse(savedProf) : { level: 1, xp: 0, coins: 0, team: null, buddy: null });
  };

  const [pokestops, setPokestops] = useState(() => {
    const saved = localStorage.getItem('pepegaPokestops');
    return saved ? JSON.parse(saved) : null;
  });

  const [gyms, setGyms] = useState(() => {
    const saved = localStorage.getItem('pepegaGyms');
    return saved ? JSON.parse(saved) : null;
  });

  // Sync to profile-scoped storage whenever data changes
  useEffect(() => {
    if (!activeProfile) return;
    const id = activeProfile.id;
    ['pepegaInventory','pepegaProfile','pepegaPokestops','pepegaGyms','pepegaQuests'].forEach(key => {
      const suffix = key.replace('pepega', '').charAt(0).toLowerCase() + key.replace('pepega', '').slice(1);
      const val = localStorage.getItem(key);
      if (val) localStorage.setItem(profileKey(id, suffix), val);
    });
  }, [activeProfile, inventory, profile, pokestops, gyms, questState]);

  // Keep the buddy snapshot fresh — reflects CP/type changes from power-ups and evolution
  useEffect(() => {
    if (!profile.buddy) return;
    const fresh = inventory.pepegas.find(p => p.id === profile.buddy.id);
    if (fresh && (fresh.typeId !== profile.buddy.typeId || fresh.cp !== profile.buddy.cp)) {
      setProfile(prev => ({ ...prev, buddy: fresh }));
    }
  }, [inventory.pepegas, profile.buddy]);

  const [weather, setWeather] = useState(null); // { code, label, icon, multipliers }
  const [targetPepega, setTargetPepega] = useState(null);
  const [targetPokestop, setTargetPokestop] = useState(null);
  const [targetGym, setTargetGym] = useState(null);
  const [, setPrevLocation] = useState(null);
  const [buddyMeterDistance, setBuddyMeterDistance] = useState(0);

  useEffect(() => {
    localStorage.setItem('pepegaInventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('pepegaProfile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (pokestops) localStorage.setItem('pepegaPokestops', JSON.stringify(pokestops));
  }, [pokestops]);

  useEffect(() => {
    if (gyms) localStorage.setItem('pepegaGyms', JSON.stringify(gyms));
  }, [gyms]);

  // Fetch weather when location is known (only once per session)
  useEffect(() => {
    if (!userLocation || weather) return;
    const { lat, lng } = userLocation;
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`)
      .then(r => r.json())
      .then(data => {
        const code = data.current_weather?.weathercode ?? 0;
        let label, icon, multipliers;
        if (code === 0 || code === 1) { label = 'Ясно'; icon = '☀️'; multipliers = { fire: 1.5, gold: 1.3 }; }
        else if (code >= 51 && code <= 67) { label = 'Дождь'; icon = '🌧'; multipliers = { water: 1.7 }; }
        else if (code >= 95) { label = 'Гроза'; icon = '⛈'; multipliers = { _elite: true }; }
        else if (code >= 71 && code <= 77) { label = 'Снег'; icon = '❄️'; multipliers = { _slow: true }; }
        else { label = 'Облачно'; icon = '☁️'; multipliers = {}; }
        setWeather({ code, label, icon, multipliers });
      })
      .catch(() => {});
  }, [userLocation, weather]);

  const handleDistanceMoved = (dist) => {
    // Incubator logic
    setInventory(prev => {
      if (!prev.incubator) return prev;
      
      const newDistance = prev.incubator.currentDistance + dist;
      if (newDistance >= prev.incubator.requiredDistance) {
        const type = getRandomPepegaType();
        const stats = generatePepegaStats(1);
        const hatchedPepega = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          typeId: type,
          cp: Math.floor(stats.cp * 1.5),
          weight: stats.weight,
          height: stats.height,
          catchTime: new Date().toISOString()
        };
        
        setTimeout(() => {
          showToast(`ЯЙЦО ВЫЛУПИЛОСЬ! Это ${PEPEGA_TYPES[type].name}!`, 'success');
        }, 500);

        return {
          ...prev,
          pepegas: [...prev.pepegas, hatchedPepega],
          candies: { ...prev.candies, [type]: (prev.candies[type] || 0) + 10 },
          incubator: null
        };
      } else {
        return {
          ...prev,
          incubator: { ...prev.incubator, currentDistance: newDistance }
        };
      }
    });

    // Buddy candy logic — every 200m gain 1 candy
    if (profile.buddy) {
      setBuddyMeterDistance(prev => {
        const newDist = prev + dist;
        if (newDist >= 200) {
          const candyType = profile.buddy.typeId;
          setInventory(inv => ({
            ...inv,
            candies: { ...inv.candies, [candyType]: (inv.candies[candyType] || 0) + 1 }
          }));
          showToast(`Бадди нашёл конфету! +1 ${PEPEGA_TYPES[candyType]?.name.split(' ')[0]} 🍬`, 'info');
          return newDist - 200;
        }
        return newDist;
      });
    }
  };

  const handleSelectTeam = (team) => {
    setProfile(prev => ({ ...prev, team }));
    showToast(`Вы вступили в ${team}!`, 'success');
    setCurrentView('map');
  };

  const handleSetBuddy = (pepega) => {
    setProfile(prev => ({ ...prev, buddy: pepega }));
    showToast(`${PEPEGA_TYPES[pepega.typeId]?.name} теперь ваш Бадди!`, 'success');
  };

  const handleCraft = (recipe) => {
    setInventory(prev => {
      const mats = { ...(prev.materials || { iron: 0, chip: 0, berry: 0 }) };
      for (const [mat, cost] of Object.entries(recipe.cost)) {
        if ((mats[mat] || 0) < cost) {
          showToast(`Недостаточно материалов!`, 'error');
          return prev;
        }
      }
      for (const [mat, cost] of Object.entries(recipe.cost)) mats[mat] -= cost;
      const newItems = { ...prev.items };
      if (recipe.reward.type === 'item') newItems[recipe.reward.id] = (newItems[recipe.reward.id] || 0) + 1;
      const newEggs = [...(prev.eggs || [])];
      if (recipe.reward.type === 'incubator') newEggs.push({ id: 'egg-crafted-' + Date.now(), requiredDistance: 2000, receivedAt: new Date().toISOString() });
      showToast(`Скрафтовано: ${recipe.name}!`, 'success');
      return { ...prev, materials: mats, items: newItems, eggs: newEggs };
    });
  };

  // Generate Pokestops
  useEffect(() => {
    if (userLocation && !pokestops) {
      const generated = Array.from({ length: 8 }).map((_, i) => {
        const latOffset = (Math.random() - 0.5) * 0.01;
        const lngOffset = (Math.random() - 0.5) * 0.01;
        return {
          id: `stop-${i}`,
          lat: userLocation.lat + latOffset,
          lng: userLocation.lng + lngOffset,
          lastUsed: 0,
        };
      });
      setPokestops(generated);
    }
  }, [userLocation, pokestops]);

  // Generate Gyms
  useEffect(() => {
    if (userLocation && !gyms) {
      const generated = Array.from({ length: 4 }).map((_, i) => {
        const latOffset = (Math.random() - 0.5) * 0.015;
        const lngOffset = (Math.random() - 0.5) * 0.015;
        const types = Object.keys(PEPEGA_TYPES);
        const bossType = types[Math.floor(Math.random() * types.length)];
        const bossCp = Math.floor(Math.random() * 2000) + 1500;
        return {
          id: `gym-${i}`,
          lat: userLocation.lat + latOffset,
          lng: userLocation.lng + lngOffset,
          lastDefeated: 0,
          boss: {
            typeId: bossType,
            cp: bossCp,
          }
        };
      });
      setGyms(generated);
    }
  }, [userLocation, gyms]);

  // Geolocation tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      showToast("Геолокация не поддерживается вашим браузером", 'error');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLoc = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(newLoc);
        
        setPrevLocation((prev) => {
          if (prev) {
            const distMoved = getDistance(prev.lat, prev.lng, newLoc.lat, newLoc.lng);
            if (distMoved > 0 && distMoved < 500) {
               handleDistanceMoved(distMoved);
            }
          }
          return newLoc;
        });
      },
      (error) => {
        console.error("Error watching position:", error);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Pepega Spawner
  useEffect(() => {
    if (!userLocation) return;

    if (pepegas.length < 5) {
      const newPepegas = Array.from({ length: 5 - pepegas.length }).map(() => {
        const latOffset = (Math.random() - 0.5) * 0.004;
        const lngOffset = (Math.random() - 0.5) * 0.004;
        return {
          id: Math.random().toString(36).substring(7),
          typeId: getRandomPepegaType(),
          lat: userLocation.lat + latOffset,
          lng: userLocation.lng + lngOffset,
          ...generatePepegaStats(profile.level),
        };
      });
      setPepegas((prev) => [...prev, ...newPepegas]);
    }
  }, [userLocation, pepegas.length, profile.level]);

  const handleCatchClick = (pepega) => {
    setTargetPepega(pepega);
    setCurrentView('catch');
  };

  const handleCatchSuccess = () => {
    playCatch();
    const typeInfo = PEPEGA_TYPES[targetPepega.typeId] || PEPEGA_TYPES.common;
    const gainedXp = typeInfo.xp;
    
    let newXp = profile.xp + gainedXp;
    let newLevel = profile.level;
    let newCoins = profile.coins;
    
    while (newXp >= LEVELS.getXpRequired(newLevel)) {
      newXp -= LEVELS.getXpRequired(newLevel);
      newLevel += 1;
      newCoins += LEVELS.getCoinsReward(newLevel);
      showToast(`🎉 Уровень ${newLevel}!`, 'success');
    }

    setProfile(prev => ({ ...prev, level: newLevel, xp: newXp, coins: newCoins }));
    setInventory((prev) => ({
      ...prev,
      pepegas: [...prev.pepegas, { ...targetPepega, catchTime: new Date().toISOString() }],
      candies: { ...prev.candies, [targetPepega.typeId]: (prev.candies[targetPepega.typeId] || 0) + 3 }
    }));
    setPepegas((prev) => prev.filter(p => p.id !== targetPepega.id));

    // Quest tracking
    advanceQuest('catch');
    advanceQuest('catchType', { typeId: targetPepega.typeId });

    setTargetPepega(null);
    setCurrentView('map');
  };

  const handleCatchFlee = () => {
    playFlee();
    setPepegas((prev) => prev.filter(p => p.id !== targetPepega.id));
    setTargetPepega(null);
    setCurrentView('map');
  };

  const handleUseItem = (itemId) => {
    setInventory(prev => ({
      ...prev,
      items: { ...prev.items, [itemId]: prev.items[itemId] - 1 }
    }));
  };

  const handleBuyItem = (itemId, price, amount = 1) => {
    if (profile.coins >= price) {
      setProfile(prev => ({ ...prev, coins: prev.coins - price }));
      setInventory(prev => ({
        ...prev,
        items: { ...prev.items, [itemId]: prev.items[itemId] + amount }
      }));
      showToast(`Куплено: ${amount}x ${itemId}`, 'success');
    } else {
      showToast("Недостаточно монет!", 'error');
    }
  };

  const handleTransferPepega = (pepega) => {
    setInventory(prev => ({
      ...prev,
      pepegas: prev.pepegas.filter(p => p.id !== pepega.id),
      candies: { ...prev.candies, [pepega.typeId]: (prev.candies[pepega.typeId] || 0) + 1 }
    }));
  };

  const handleIncubate = (egg) => {
    setInventory(prev => {
      if (prev.incubator) {
        showToast("Инкубатор уже занят!", 'error');
        return prev;
      }
      return {
        ...prev,
        eggs: (prev.eggs || []).filter(e => e.id !== egg.id),
        incubator: { ...egg, currentDistance: 0 }
      };
    });
    showToast("Яйцо помещено в инкубатор!", 'success');
  };

  const handleEvolve = (pepega) => {
    const typeInfo = PEPEGA_TYPES[pepega.typeId];
    if (!typeInfo?.evolvesTo || !typeInfo.evolutionCost) return;
    const candies = inventory.candies[pepega.typeId] || 0;
    if (candies < typeInfo.evolutionCost) {
      showToast(`Нужно ${typeInfo.evolutionCost} конфет!`, 'error');
      return;
    }
    setInventory(prev => ({
      ...prev,
      candies: { ...prev.candies, [pepega.typeId]: (prev.candies[pepega.typeId] || 0) - typeInfo.evolutionCost },
      pepegas: prev.pepegas.map(p => p.id === pepega.id
        ? { ...p, typeId: typeInfo.evolvesTo, cp: Math.floor(p.cp * 1.8) }
        : p)
    }));
    advanceQuest('evolve');
    setEvolutionData({ pepega, newTypeId: typeInfo.evolvesTo });
  };

  const handleClaimQuest = (quest) => {
    const rewards = quest.reward || {};
    setProfile(prev => ({ ...prev, coins: prev.coins + (rewards.coins || 0) }));
    setInventory(prev => {
      const newItems = { ...prev.items };
      if (rewards.ultraball) newItems.ultraball = (newItems.ultraball || 0) + rewards.ultraball;
      if (rewards.greatball) newItems.greatball = (newItems.greatball || 0) + rewards.greatball;
      if (rewards.pokeball) newItems.pokeball = (newItems.pokeball || 0) + rewards.pokeball;
      return { ...prev, items: newItems };
    });
    setQuestState(prev => {
      const updated = { ...prev, quests: prev.quests.map(q => q.id === quest.id ? { ...q, claimed: true } : q) };
      localStorage.setItem('pepegaQuests', JSON.stringify(updated));
      return updated;
    });
    showToast(`Награда получена: +${quest.reward?.coins || 0} монет!`, 'success');
  };

  const handlePowerUpPepega = (pepega) => {
    if (profile.coins < 10) {
      showToast("Недостаточно монет (нужно 10)!", 'error');
      return;
    }
    if ((inventory.candies[pepega.typeId] || 0) < 1) {
      showToast("Недостаточно конфет (нужна 1)!", 'error');
      return;
    }

    setProfile(prev => ({ ...prev, coins: prev.coins - 10 }));
    setInventory(prev => {
      const newCandies = { ...prev.candies, [pepega.typeId]: prev.candies[pepega.typeId] - 1 };
      const newPepegas = prev.pepegas.map(p => {
        if (p.id === pepega.id) {
          const cpGain = Math.floor(Math.random() * 30) + 20;
          showToast(`CP увеличено на +${cpGain}!`, 'success');
          return { ...p, cp: p.cp + cpGain };
        }
        return p;
      });
      return { ...prev, candies: newCandies, pepegas: newPepegas };
    });
  };

  const handlePokestopClick = (stop) => {
    setTargetPokestop(stop);
    setCurrentView('pokestop');
  };

  const handleSpinPokestop = (rewards) => {
    setInventory(prev => {
      const newItems = { ...prev.items };
      if (rewards.pokeballs) newItems.pokeball += rewards.pokeballs;
      
      let newEggs = [...(prev.eggs || [])];
      if (rewards.egg && newEggs.length < 9) {
        newEggs.push(rewards.egg);
      }

      // Materials from pokestop
      const newMaterials = { ...(prev.materials || { iron: 0, chip: 0, berry: 0 }) };
      if (rewards.iron) newMaterials.iron += rewards.iron;
      if (rewards.chip) newMaterials.chip += rewards.chip;
      if (rewards.berry) newMaterials.berry += rewards.berry;
      
      return { ...prev, items: newItems, eggs: newEggs, materials: newMaterials };
    });
    setProfile(prev => ({ ...prev, coins: prev.coins + (rewards.coins || 0) }));
    setPokestops(prev => prev.map(p => p.id === targetPokestop.id ? { ...p, lastUsed: Date.now() } : p));
  };

  const handleGymClick = (gym) => {
    setTargetGym(gym);
    setCurrentView('gym');
  };

  const handleGymVictory = (capturedByTeam = null) => {
    const gainedXp = 1000;
    let newXp = profile.xp + gainedXp;
    let newLevel = profile.level;
    let newCoins = profile.coins + 100;
    
    while (newXp >= LEVELS.getXpRequired(newLevel)) {
      newXp -= LEVELS.getXpRequired(newLevel);
      newLevel += 1;
      newCoins += LEVELS.getCoinsReward(newLevel);
    }
    setProfile(prev => ({ ...prev, level: newLevel, xp: newXp, coins: newCoins }));
    
    setInventory(prev => ({
      ...prev,
      candies: { ...prev.candies, gold: (prev.candies.gold || 0) + 1, common: (prev.candies.common || 0) + 5 }
    }));

    setGyms(prev => prev.map(g => g.id === targetGym.id ? { ...g, lastDefeated: Date.now(), team: capturedByTeam || profile.team } : g));
    
    showToast("ПОБЕДА! +1000 XP, +100 Монеток, +1 Золотая конфета!", 'success');
    setTargetGym(null);
    setCurrentView('map');
  };

  // Show TeamSelect if level 5+ and no team yet
  const shouldShowTeamSelect = profile.level >= 5 && !profile.team && currentView === 'map';

  if (!activeProfile) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="w-full h-full bg-slate-100 overflow-hidden relative">
      <ToastContainer toasts={toasts} />

      {/* Team Select overlay */}
      {shouldShowTeamSelect && (
        <TeamSelect onSelect={handleSelectTeam} />
      )}

      {currentView === 'map' && !shouldShowTeamSelect && (
        <MapView 
          userLocation={userLocation} 
          pepegas={pepegas} 
          pokestops={pokestops || []}
          gyms={gyms || []}
          profile={profile}
          activeProfile={activeProfile}
          weather={weather}
          buddyMeterDistance={buddyMeterDistance}
          questState={questState}
          onCatchClick={handleCatchClick} 
          onPokestopClick={handlePokestopClick}
          onGymClick={handleGymClick}
          onOpenInventory={() => setCurrentView('inventory')}
          onOpenShop={() => setCurrentView('shop')}
          onOpenWorkshop={() => setCurrentView('workshop')}
          onOpenQuests={() => setCurrentView('quests')}
          onOpenLeaderboard={() => setCurrentView('leaderboard')}
          onLogout={handleLogout}
        />
      )}
      
      {currentView === 'catch' && targetPepega && (
        <CatchScreen 
          pepega={targetPepega} 
          items={inventory.items}
          onCatch={handleCatchSuccess} 
          onFlee={handleCatchFlee} 
          onUseItem={handleUseItem}
          onClose={() => { setTargetPepega(null); setCurrentView('map'); }}
        />
      )}

      {currentView === 'inventory' && (
        <Inventory 
          inventory={inventory} 
          profile={profile}
          onTransfer={handleTransferPepega}
          onPowerUp={handlePowerUpPepega}
          onIncubate={handleIncubate}
          onSetBuddy={handleSetBuddy}
          onEvolve={handleEvolve}
          onClose={() => setCurrentView('map')} 
        />
      )}

      {currentView === 'shop' && (
        <Shop 
          profile={profile}
          items={inventory.items}
          onBuy={handleBuyItem}
          onClose={() => setCurrentView('map')}
        />
      )}

      {currentView === 'workshop' && (
        <Workshop
          inventory={inventory}
          onCraft={handleCraft}
          onClose={() => setCurrentView('map')}
        />
      )}

      {currentView === 'quests' && (
        <QuestScreen
          questState={questState}
          onClaim={handleClaimQuest}
          onClose={() => setCurrentView('map')}
        />
      )}

      {currentView === 'leaderboard' && (
        <LeaderboardScreen
          profile={profile}
          inventory={inventory}
          activeProfile={activeProfile}
          onClose={() => setCurrentView('map')}
        />
      )}

      {currentView === 'pokestop' && targetPokestop && (
        <PokestopScreen
          userLocation={userLocation}
          pokestop={targetPokestop}
          onSpin={(rewards) => {
            handleSpinPokestop(rewards);
            advanceQuest('spin');
            const parts = [];
            if (rewards.pokeballs) parts.push(`${rewards.pokeballs} Покеболов`);
            if (rewards.coins) parts.push(`${rewards.coins} Монет`);
            if (rewards.berry) parts.push(`${rewards.berry} Ягод`);
            if (rewards.iron) parts.push(`${rewards.iron} Железа`);
            if (rewards.egg) parts.push(`1 Яйцо 🥚`);
            showToast(`Собрано: ${parts.join(', ')}`, 'success');
          }}
          onClose={() => { setTargetPokestop(null); setCurrentView('map'); }}
        />
      )}

      {currentView === 'gym' && targetGym && (
        <GymScreen
          userLocation={userLocation}
          gym={targetGym}
          inventory={inventory}
          profile={profile}
          onVictory={(team) => { advanceQuest('gym'); playWin(); handleGymVictory(team); }}
          onRaid={() => setCurrentView('raid')}
          onClose={() => { setTargetGym(null); setCurrentView('map'); }}
        />
      )}

      {currentView === 'raid' && targetGym && (
        <RaidScreen
          gym={targetGym}
          onVictory={(team) => { advanceQuest('gym'); playWin(); handleGymVictory(team); }}
          onClose={() => setCurrentView('gym')}
        />
      )}

      {/* Evolution overlay */}
      {evolutionData && (
        <EvolutionScreen
          pepega={evolutionData.pepega}
          newTypeId={evolutionData.newTypeId}
          onComplete={() => {
            setEvolutionData(null);
            showToast(`Эволюция завершена! 🧬`, 'success');
          }}
        />
      )}
    </div>
  );
}

export default App;
