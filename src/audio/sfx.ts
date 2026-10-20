/**
 * Sons 8-bit sintetizados com Web Audio — nenhum arquivo de áudio.
 * O navegador só libera áudio depois de um gesto, então `unlock()` é chamado no clique em "Entrar".
 */
const KEY = "gh-muted";

type Wave = OscillatorType;
type ToneOpts = { type?: Wave; vol?: number; to?: number; delay?: number };

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = readMuted();
const listeners = new Set<(m: boolean) => void>();

function readMuted() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function tone(freq: number, dur: number, { type = "square", vol = 0.5, to, delay = 0 }: ToneOpts = {}) {
  if (!ctx || !master || muted) return;
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noise(dur: number, vol = 0.3, delay = 0) {
  if (!ctx || !master || muted) return;
  const t0 = ctx.currentTime + delay;
  const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  const g = ctx.createGain();
  src.buffer = buf;
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(g).connect(master);
  src.start(t0);
}

export const sfx = {
  unlock() {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.14;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
  },
  isMuted: () => muted,
  setMuted(m: boolean) {
    muted = m;
    try {
      localStorage.setItem(KEY, m ? "1" : "0");
    } catch {
      /* ignora */
    }
    listeners.forEach((fn) => fn(m));
  },
  subscribe(fn: (m: boolean) => void) {
    listeners.add(fn);
    return () => void listeners.delete(fn);
  },

  /** ficha caindo */
  coin() {
    tone(988, 0.08);
    tone(1319, 0.32, { delay: 0.08 });
  },
  /** CRT ligando */
  power() {
    noise(0.18, 0.25);
    tone(60, 0.5, { type: "sawtooth", vol: 0.35, to: 420, delay: 0.05 });
    tone(880, 0.12, { type: "triangle", vol: 0.3, delay: 0.45 });
  },
  step(alt: boolean) {
    tone(alt ? 110 : 98, 0.04, { type: "triangle", vol: 0.35 });
  },
  blip() {
    tone(1600 + Math.random() * 300, 0.025, { vol: 0.12 });
  },
  select() {
    tone(660, 0.05, { vol: 0.3 });
    tone(990, 0.07, { vol: 0.3, delay: 0.05 });
  },
  /** chegou numa zona nova */
  zone() {
    [523, 659, 784].forEach((f, i) => tone(f, 0.08, { vol: 0.25, delay: i * 0.06 }));
  },
  jump() {
    tone(330, 0.14, { vol: 0.3, to: 660 });
  },
  tick() {
    tone(440, 0.06, { vol: 0.3 });
  },
  gameOver() {
    [392, 330, 262, 196].forEach((f, i) => tone(f, 0.18, { vol: 0.3, delay: i * 0.16 }));
  },
};
