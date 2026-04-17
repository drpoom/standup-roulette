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

// Original sounds (used by Base and Squid themes)
export function playCoin() { playTone(1200, 'square', 0.1); setTimeout(() => playTone(1600, 'square', 0.2), 100); }
export function playEliminate() { playTone(150, 'sawtooth', 0.5, 0.2); }
export function playPraise() { playTone(600, 'sine', 0.1); setTimeout(() => playTone(800, 'sine', 0.2), 100); setTimeout(() => playTone(1200, 'sine', 0.4), 200); }
export function playPunish() { playTone(200, 'square', 0.3, 0.2); setTimeout(() => playTone(150, 'square', 0.4, 0.2), 150); }
export function playBlip() { playTone(400, 'square', 0.05); }
export function playStart() { playTone(400, 'square', 0.1); setTimeout(() => playTone(600, 'square', 0.2), 150); }

// Classroom theme audio — synthesized approximations
function playNoiseBurst(duration, vol = 0.08) {
  if (!audioCtx) return;
  try {
    const bufferSize = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
    }
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    source.connect(gain);
    gain.connect(audioCtx.destination);
    source.start();
  } catch (e) { console.error(e); }
}

export function playClassroomIntro() {
  // Deep taiko hit
  playTone(80, 'sine', 0.8, 0.3);
  setTimeout(() => playTone(100, 'sine', 0.4, 0.15), 100);
  // Shamisen pluck
  setTimeout(() => playTone(900, 'square', 0.15, 0.12), 300);
  setTimeout(() => playTone(1100, 'square', 0.1, 0.08), 500);
}

export function playClassroomPraise() {
  // Taiko roll into gong
  playTone(90, 'sine', 0.15, 0.2);
  setTimeout(() => playTone(95, 'sine', 0.15, 0.2), 100);
  setTimeout(() => playTone(100, 'sine', 0.15, 0.2), 200);
  setTimeout(() => playTone(105, 'sine', 0.15, 0.2), 300);
  // Gong
  setTimeout(() => playTone(400, 'sine', 1.2, 0.15), 400);
}

export function playClassroomPunish() {
  // Low drum thud + scratch
  playTone(70, 'sine', 0.5, 0.25);
  setTimeout(() => playNoiseBurst(0.3, 0.1), 150);
  setTimeout(() => playTone(55, 'sine', 0.3, 0.15), 200);
}

export function playClassroomSelect() {
  // Shamisen twang
  playTone(800, 'square', 0.08, 0.1);
  setTimeout(() => playTone(1000, 'square', 0.12, 0.08), 60);
}

export function playClassroomTimer30() {
  // Single shamisen pluck
  playTone(900, 'square', 0.2, 0.1);
}

export function playClassroomTimer10() {
  // Rapid shamisen tremolo
  for (let i = 0; i < 4; i++) {
    setTimeout(() => playTone(850 + i * 50, 'square', 0.08, 0.08), i * 80);
  }
}