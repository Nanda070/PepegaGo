// 8-bit sound generator using Web Audio API — no external files needed

let ctx = null;
const getCtx = () => {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
};

const playTone = (freq, duration, type = 'square', volume = 0.2, delay = 0) => {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime + delay);
    gain.gain.setValueAtTime(volume, c.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
    osc.start(c.currentTime + delay);
    osc.stop(c.currentTime + delay + duration);
  } catch {}
};

export const playThrow = () => {
  playTone(300, 0.1, 'sine', 0.15);
  playTone(200, 0.1, 'sine', 0.15, 0.1);
};

export const playCatch = () => {
  // Victory jingle: C E G C
  [261, 329, 392, 523].forEach((f, i) => playTone(f, 0.15, 'square', 0.18, i * 0.12));
};

export const playFlee = () => {
  playTone(400, 0.1, 'sawtooth', 0.15);
  playTone(250, 0.2, 'sawtooth', 0.15, 0.1);
};

export const playHit = () => {
  playTone(150, 0.05, 'square', 0.3);
};

export const playWin = () => {
  // Full fanfare
  const notes = [523, 659, 784, 1046, 784, 659, 523];
  notes.forEach((f, i) => playTone(f, 0.18, 'square', 0.2, i * 0.15));
};

export const playEvolution = () => {
  // Rising ethereal arpeggio
  const notes = [261, 330, 392, 523, 659, 784, 1046];
  notes.forEach((f, i) => {
    playTone(f, 0.3, 'sine', 0.15, i * 0.1);
    playTone(f * 2, 0.3, 'sine', 0.05, i * 0.1);
  });
};

export const playQuestComplete = () => {
  [784, 880, 1046].forEach((f, i) => playTone(f, 0.2, 'square', 0.2, i * 0.1));
};
