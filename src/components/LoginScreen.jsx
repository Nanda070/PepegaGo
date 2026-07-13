import { useState, useEffect } from 'react';
import { UserCircle2, Plus, Trash2, ChevronRight, Gamepad2, Sparkles } from 'lucide-react';

const AVATARS = ['🐸', '🔥', '💧', '⭐', '👾', '🦊', '🐉', '🌊', '⚡', '🎮'];

function getAllProfiles() {
  try {
    const raw = localStorage.getItem('pepegaProfiles');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAllProfiles(profiles) {
  localStorage.setItem('pepegaProfiles', JSON.stringify(profiles));
}

export default function LoginScreen({ onLogin }) {
  const [profiles, setProfiles] = useState([]);
  const [mode, setMode] = useState('list'); // 'list' | 'create'
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const loaded = getAllProfiles();
    setProfiles(loaded);
    // Entrance animation
    setTimeout(() => setVisible(true), 50);
  }, []);

  const handleSelect = (profile) => {
    // Load profile-specific data into active keys
    const storageKey = (key) => `pepega_${profile.id}_${key}`;

    const inv = localStorage.getItem(storageKey('inventory'));
    const prof = localStorage.getItem(storageKey('profile'));
    const stops = localStorage.getItem(storageKey('pokestops'));
    const gyms = localStorage.getItem(storageKey('gyms'));
    const quests = localStorage.getItem(storageKey('quests'));

    if (inv) localStorage.setItem('pepegaInventory', inv);
    else localStorage.removeItem('pepegaInventory');

    if (prof) localStorage.setItem('pepegaProfile', prof);
    else localStorage.removeItem('pepegaProfile');

    if (stops) localStorage.setItem('pepegaPokestops', stops);
    else localStorage.removeItem('pepegaPokestops');

    if (gyms) localStorage.setItem('pepegaGyms', gyms);
    else localStorage.removeItem('pepegaGyms');

    if (quests) localStorage.setItem('pepegaQuests', quests);
    else localStorage.removeItem('pepegaQuests');

    // Update last seen
    const updated = profiles.map(p =>
      p.id === profile.id ? { ...p, lastSeen: new Date().toISOString() } : p
    );
    saveAllProfiles(updated);

    onLogin({ ...profile });
  };

  const handleCreate = () => {
    const trimmed = nickname.trim();
    if (!trimmed) { setError('Введите никнейм!'); return; }
    if (trimmed.length < 3) { setError('Минимум 3 символа'); return; }
    if (trimmed.length > 16) { setError('Максимум 16 символов'); return; }
    if (profiles.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Этот никнейм уже занят');
      return;
    }

    const newProfile = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: trimmed,
      avatar: selectedAvatar,
      createdAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
    };

    const updated = [...profiles, newProfile];
    saveAllProfiles(updated);
    setProfiles(updated);
    setMode('list');
    setNickname('');
    setError('');
    // Auto-login new profile
    handleSelect(newProfile);
  };

  const handleDelete = (e, profile) => {
    e.stopPropagation();
    if (deletingId === profile.id) {
      // Confirm delete
      const updated = profiles.filter(p => p.id !== profile.id);
      saveAllProfiles(updated);
      setProfiles(updated);
      setDeletingId(null);
      // Clean up profile storage
      ['inventory','profile','pokestops','gyms','quests'].forEach(key => {
        localStorage.removeItem(`pepega_${profile.id}_${key}`);
      });
    } else {
      setDeletingId(profile.id);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)',
      }}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      {/* Floating pepega sprites */}
      {['/pepega.png', '/pepega_fire.png', '/pepega_water.png', '/pepega_gold.png'].map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute opacity-10 pointer-events-none select-none"
          style={{
            width: 60 + i * 15,
            top: `${15 + i * 20}%`,
            left: i % 2 === 0 ? `${5 + i * 3}%` : undefined,
            right: i % 2 !== 0 ? `${5 + i * 3}%` : undefined,
            animation: `float-${i} ${6 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 1.5}s`,
            transform: 'translateY(0px)',
          }}
        />
      ))}

      <style>{`
        @keyframes float-0 { 0%,100%{transform:translateY(0px) rotate(-5deg)} 50%{transform:translateY(-20px) rotate(5deg)} }
        @keyframes float-1 { 0%,100%{transform:translateY(0px) rotate(5deg)} 50%{transform:translateY(-15px) rotate(-5deg)} }
        @keyframes float-2 { 0%,100%{transform:translateY(0px) rotate(-3deg)} 50%{transform:translateY(-25px) rotate(3deg)} }
        @keyframes float-3 { 0%,100%{transform:translateY(0px) rotate(8deg)} 50%{transform:translateY(-18px) rotate(-8deg)} }
      `}</style>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src="/pepega.png" alt="Pepega" className="w-12 h-12 object-contain drop-shadow-lg" />
            <h1 className="text-4xl font-black text-white tracking-tight">
              Pepega<span className="text-emerald-400">GO</span>
            </h1>
            <img src="/pepega.png" alt="Pepega" className="w-12 h-12 object-contain drop-shadow-lg scale-x-[-1]" />
          </div>
          <p className="text-slate-400 text-sm font-medium tracking-wider uppercase">
            Лови · Сражайся · Эволюционируй
          </p>
        </div>

        {mode === 'list' && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <UserCircle2 className="w-5 h-5 text-emerald-400" />
                {profiles.length > 0 ? 'Выбери тренера' : 'Добро пожаловать!'}
              </h2>
              {profiles.length > 0 && (
                <span className="text-slate-400 text-xs font-medium">{profiles.length}/5</span>
              )}
            </div>

            {profiles.length === 0 && (
              <div className="text-center py-8">
                <div className="text-6xl mb-3">🐸</div>
                <p className="text-slate-400 text-sm font-medium">Создай своего первого тренера,<br />чтобы начать приключение!</p>
              </div>
            )}

            <div className="flex flex-col gap-2 mb-4">
              {profiles
                .sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen))
                .map(profile => {
                  const isDeleting = deletingId === profile.id;
                  const lastSeen = new Date(profile.lastSeen);
                  const diffHours = Math.floor((Date.now() - lastSeen) / 3600000);
                  const timeLabel = diffHours < 1 ? 'Только что' :
                    diffHours < 24 ? `${diffHours}ч назад` :
                    `${Math.floor(diffHours / 24)}д назад`;

                  return (
                    <button
                      key={profile.id}
                      onClick={() => handleSelect(profile)}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all active:scale-95 text-left group ${
                        isDeleting
                          ? 'border-red-500 bg-red-500/20'
                          : 'border-white/10 bg-white/5 hover:bg-white/15 hover:border-emerald-500/50'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/30 to-blue-500/30 flex items-center justify-center text-2xl shrink-0 border border-white/10">
                        {profile.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-black text-base truncate ${isDeleting ? 'text-red-300' : 'text-white'}`}>
                          {profile.name}
                        </p>
                        <p className="text-slate-400 text-xs font-medium">{timeLabel}</p>
                      </div>

                      {isDeleting ? (
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-red-300 text-xs font-bold">Удалить?</span>
                          <button
                            onClick={(e) => handleDelete(e, profile)}
                            className="bg-red-500 text-white text-xs font-black px-2 py-1 rounded-lg hover:bg-red-600 transition-colors"
                          >
                            ДА
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeletingId(null); }}
                            className="bg-slate-600 text-white text-xs font-black px-2 py-1 rounded-lg hover:bg-slate-500 transition-colors"
                          >
                            НЕТ
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleDelete(e, profile)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                        </div>
                      )}
                    </button>
                  );
                })}
            </div>

            {profiles.length < 5 && (
              <button
                onClick={() => setMode('create')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-emerald-500/50 text-emerald-400 font-bold hover:bg-emerald-500/10 hover:border-emerald-400 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Новый тренер
              </button>
            )}
          </div>
        )}

        {mode === 'create' && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => { setMode('list'); setError(''); setNickname(''); }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                ←
              </button>
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Новый тренер
              </h2>
            </div>

            {/* Avatar Picker */}
            <div className="mb-5">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Выбери аватар</p>
              <div className="grid grid-cols-5 gap-2">
                {AVATARS.map(av => (
                  <button
                    key={av}
                    onClick={() => setSelectedAvatar(av)}
                    className={`h-12 rounded-xl text-2xl flex items-center justify-center transition-all active:scale-90 ${
                      selectedAvatar === av
                        ? 'bg-emerald-500/40 border-2 border-emerald-400 scale-110 shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                        : 'bg-white/10 border-2 border-transparent hover:bg-white/20'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="flex justify-center mb-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-blue-500/30 flex items-center justify-center text-5xl border-2 border-white/20 shadow-xl">
                {selectedAvatar}
              </div>
            </div>

            {/* Nickname Input */}
            <div className="mb-4">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Никнейм</p>
              <input
                type="text"
                value={nickname}
                onChange={e => { setNickname(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder="Введите никнейм..."
                maxLength={16}
                autoFocus
                className="w-full bg-white/10 border-2 border-white/20 rounded-2xl px-4 py-3 text-white font-bold placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors text-base"
              />
              <div className="flex justify-between items-center mt-1.5 px-1">
                {error
                  ? <p className="text-red-400 text-xs font-bold">{error}</p>
                  : <p className="text-slate-500 text-xs">3–16 символов</p>
                }
                <p className="text-slate-500 text-xs">{nickname.length}/16</p>
              </div>
            </div>

            <button
              onClick={handleCreate}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
            >
              <Gamepad2 className="w-5 h-5" />
              Начать игру!
            </button>
          </div>
        )}

        {/* Version badge */}
        <p className="text-center text-slate-600 text-xs font-medium mt-6">
          Pepega GO v0.1.0 · Данные хранятся локально
        </p>
      </div>
    </div>
  );
}
