"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const COLS = 28;
const ROWS = 8;
const BPM = 140;

// classic waveshaper distortion curve (adds grit + audible harmonics on laptop speakers)
function distortionCurve(amount: number) {
  const n = 256;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] =
      ((3 + amount) * x * 20 * Math.PI) / 180 / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

const RIFF = [
  { f: 55.0, n: "A1" },
  { f: 55.0, n: "A1" },
  { f: 73.42, n: "D2" },
  { f: 49.0, n: "G1" },
  { f: 55.0, n: "A1" },
  { f: 65.41, n: "C2" },
  { f: 49.0, n: "G1" },
  { f: 43.65, n: "F1" },
];

export default function BassSynth() {
  const [playing, setPlaying] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const preRef = useRef<HTMLPreElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const liveRef = useRef<{ stop: () => void } | null>(null);
  const rafRef = useRef<number>(0);
  const logTimers = useRef<number[]>([]);

  const pushLog = useCallback((line: string) => {
    setLog((l) => [...l, line].slice(-40));
  }, []);

  // keep the log scrolled to the newest line
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  const renderIdle = useCallback(() => {
    const el = preRef.current;
    if (!el) return;
    const rows: string[] = [];
    for (let r = 0; r < ROWS; r++) {
      rows.push((r === ROWS - 1 ? "▁" : " ").repeat(COLS));
    }
    el.textContent = rows.join("\n");
  }, []);

  useEffect(() => {
    renderIdle();
  }, [renderIdle]);

  const stop = useCallback(() => {
    liveRef.current?.stop();
    liveRef.current = null;
    cancelAnimationFrame(rafRef.current);
    logTimers.current.forEach((t) => window.clearTimeout(t));
    logTimers.current = [];
    setPlaying(false);
    renderIdle();
    pushLog("■ halted. graph torn down.");
  }, [renderIdle, pushLog]);

  const start = useCallback(() => {
    if (liveRef.current) return;

    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = ctxRef.current ?? new Ctx();
    ctxRef.current = ctx;
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;

    setLog([]);
    pushLog("$ ./dubstep --synth --live");
    pushLog(`audioctx > resumed @ ${Math.round(ctx.sampleRate / 1000)}kHz`);
    pushLog("graph    > saw+sub > lpf(Q=11) > shaper > out");

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.linearRampToValueAtTime(0.55, now + 0.15);

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.72;
    analyserRef.current = analyser;

    master.connect(analyser);
    analyser.connect(ctx.destination);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    filter.Q.value = 11;

    const shaper = ctx.createWaveShaper();
    shaper.curve = distortionCurve(28);
    shaper.oversample = "4x";

    const bassGain = ctx.createGain();
    bassGain.gain.value = 0.9;

    const saw = ctx.createOscillator();
    saw.type = "sawtooth";
    const sub = ctx.createOscillator();
    sub.type = "sine";

    saw.connect(bassGain);
    sub.connect(bassGain);
    bassGain.connect(filter);
    filter.connect(shaper);
    shaper.connect(master);

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = (BPM / 60) * 2;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 420;
    lfo.connect(lfoDepth);
    lfoDepth.connect(filter.frequency);

    pushLog(`lfo      > ${lfo.frequency.value.toFixed(2)}Hz > cutoff +/-420`);
    pushLog(`seq      > ${BPM} BPM, 8 steps/bar`);

    saw.start(now);
    sub.start(now);
    lfo.start(now);

    const stepDur = 60 / BPM / 2;
    let step = 0;
    let nextTime = now + 0.06;

    const kick = (t: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.setValueAtTime(150, t);
      o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
      g.gain.setValueAtTime(0.9, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.connect(g);
      g.connect(master);
      o.start(t);
      o.stop(t + 0.32);
    };

    const snare = (t: number) => {
      const len = Math.floor(ctx.sampleRate * 0.2);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 1400;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.5, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      src.connect(hp);
      hp.connect(g);
      g.connect(master);
      src.start(t);
      src.stop(t + 0.2);
    };

    const scheduleStep = (s: number, t: number) => {
      const { f, n } = RIFF[s % RIFF.length];
      saw.frequency.setValueAtTime(f, t);
      sub.frequency.setValueAtTime(f / 2, t);
      const isKick = s % 8 === 0;
      const isSnare = s % 8 === 4;
      if (isKick) kick(t);
      if (isSnare) snare(t);
      // log it in sync with when it actually sounds
      const delay = Math.max(0, (t - ctx.currentTime) * 1000);
      const bar = Math.floor(s / 8) + 1;
      const pos = `${bar}.${(s % 8) + 1}`;
      const hit = isKick ? "  +kick" : isSnare ? "  +snare" : "";
      const id = window.setTimeout(() => {
        pushLog(`[${pos}] note ${n.padEnd(2)} ${f.toFixed(2)}Hz${hit}`);
      }, delay);
      logTimers.current.push(id);
    };

    const timer = window.setInterval(() => {
      while (nextTime < ctx.currentTime + 0.12) {
        scheduleStep(step, nextTime);
        nextTime += stepDur;
        step += 1;
      }
    }, 25);

    liveRef.current = {
      stop: () => {
        window.clearInterval(timer);
        const t = ctx.currentTime;
        master.gain.cancelScheduledValues(t);
        master.gain.setValueAtTime(master.gain.value, t);
        master.gain.linearRampToValueAtTime(0.0001, t + 0.12);
        const end = t + 0.2;
        [saw, sub, lfo].forEach((o) => {
          try {
            o.stop(end);
          } catch {}
        });
      },
    };

    // visualizer
    const bins = analyser.frequencyBinCount;
    const freq = new Uint8Array(bins);
    const usable = Math.min(bins, 72);
    const span = usable / COLS;
    let lastFrame = 0;

    const draw = (ts: number) => {
      rafRef.current = requestAnimationFrame(draw);
      if (ts - lastFrame < 33) return;
      lastFrame = ts;
      analyser.getByteFrequencyData(freq);
      const levels: number[] = [];
      for (let c = 0; c < COLS; c++) {
        let sum = 0;
        const s0 = Math.floor(c * span);
        const s1 = Math.floor((c + 1) * span);
        for (let i = s0; i < s1; i++) sum += freq[i];
        const avg = sum / Math.max(1, s1 - s0);
        levels[c] = Math.min(ROWS, Math.round((avg / 255) * ROWS * 1.3));
      }
      const el = preRef.current;
      if (!el) return;
      const rows: string[] = [];
      for (let r = 0; r < ROWS; r++) {
        const threshold = ROWS - r;
        let line = "";
        for (let c = 0; c < COLS; c++) {
          line += levels[c] >= threshold ? "█" : r === ROWS - 1 ? "▁" : " ";
        }
        rows.push(line);
      }
      el.textContent = rows.join("\n");
    };
    rafRef.current = requestAnimationFrame(draw);

    setPlaying(true);
  }, [pushLog]);

  const toggle = useCallback(() => {
    if (liveRef.current) stop();
    else start();
  }, [start, stop]);

  useEffect(() => {
    const onStart = () => start();
    const onStop = () => stop();
    const onToggle = () => toggle();
    window.addEventListener("start-bass", onStart);
    window.addEventListener("stop-bass", onStop);
    window.addEventListener("toggle-bass", onToggle);
    return () => {
      window.removeEventListener("start-bass", onStart);
      window.removeEventListener("stop-bass", onStop);
      window.removeEventListener("toggle-bass", onToggle);
    };
  }, [start, stop, toggle]);

  useEffect(() => () => stop(), [stop]);

  return (
    <div className="mt-10">
      <p className="mb-3 font-mono text-sm text-fg-dim">
        <span className="text-accent">$</span> aplay ~/vibes/dubstep.wav
      </p>
      <div className="overflow-hidden rounded-xl border border-border bg-bg-raised">
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
          <span className="font-mono text-xs text-fg-dim">
            {playing
              ? "now playing - wobble bass (synth)"
              : "dubstep synth - built in code"}
          </span>
          <button
            onClick={toggle}
            aria-pressed={playing}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition ${
              playing
                ? "border border-border-strong text-fg hover:border-accent hover:text-accent"
                : "bg-btn-bg text-btn-fg hover:bg-btn-bg-hover"
            }`}
          >
            {playing ? "■ stop" : "▸ drop the bass"}
          </button>
        </div>

        <div className="p-4">
          <pre
            ref={preRef}
            aria-hidden
            className="overflow-hidden font-mono text-[10px] leading-[1.05] text-accent select-none sm:text-xs"
            style={{ textShadow: "0 0 8px var(--accent-glow)" }}
          />

          {/* live code-execution log, collapsed by default */}
          <details className="group mt-4 rounded-lg border border-border bg-bg">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 font-mono text-[11px] text-fg-muted">
              <span className="text-accent transition-transform duration-200 group-open:rotate-90">
                ▸
              </span>
              watch the engine execute
            </summary>
            <div
              ref={logRef}
              className="max-h-44 overflow-y-auto border-t border-border px-3 py-2"
            >
              {log.length === 0 ? (
                <p className="font-mono text-[11px] text-fg-dim">
                  press play - the synth logs every scheduled note, kick &amp;
                  snare here, live.
                </p>
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-[10.5px] leading-relaxed text-fg-muted sm:text-[11px]">
                  {log.join("\n")}
                </pre>
              )}
            </div>
          </details>

          <p className="mt-3 font-mono text-[11px] text-fg-dim">
            100% Web Audio - sawtooth {">"} resonant low-pass wobbled by an LFO,
            plus a synth kick &amp; snare. Try{" "}
            <span className="text-accent">/play</span> in the terminal too.
          </p>
        </div>
      </div>
    </div>
  );
}
