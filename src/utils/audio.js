let audioCtx = null;

export function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq, type, duration, vol=0.1) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.error(e);
  }
}

export function playCoin() { playTone(1200, 'square', 0.1); setTimeout(() => playTone(1600, 'square', 0.2), 100); }
export function playEliminate() { playTone(150, 'sawtooth', 0.5, 0.2); }
export function playPraise() { playTone(600, 'sine', 0.1); setTimeout(() => playTone(800, 'sine', 0.2), 100); setTimeout(() => playTone(1200, 'sine', 0.4), 200); }
export function playPunish() { playTone(200, 'square', 0.3, 0.2); setTimeout(() => playTone(150, 'square', 0.4, 0.2), 150); }
export function playBlip() { playTone(400, 'square', 0.05); }
export function playStart() { playTone(400, 'square', 0.1); setTimeout(() => playTone(600, 'square', 0.2), 150); }