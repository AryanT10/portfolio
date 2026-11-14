"use client";

import { useEffect, useRef, useState } from "react";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

export default function Fun() {
  const [active, setActive] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // triggers: /matrix command event + the konami code
  useEffect(() => {
    const start = () => setActive(true);
    window.addEventListener("start-matrix", start);

    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === KONAMI[idx]) {
        idx += 1;
        if (idx === KONAMI.length) {
          idx = 0;
          setToast("cheat code accepted — welcome to the matrix");
          setActive(true);
          window.setTimeout(() => setToast(null), 4000);
        }
      } else {
        idx = k === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("start-matrix", start);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // run the rain while active
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cols = 0;
    let drops: number[] = [];
    const fontSize = 16 * dpr;
    const chars =
      "アカサタナハマヤラ0123456789ABCDEFﾊﾐﾋｰｳｼﾅﾓﾆｻﾜ$><_/".split("");

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      cols = Math.floor(canvas.width / fontSize);
      drops = new Array(cols).fill(0).map(() => Math.random() * -40);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 45) return; // ~22fps, gentle on the CPU
      last = t;
      ctx.fillStyle = "rgba(5,8,11,0.16)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < cols; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const y = drops[i] * fontSize;
        // bright leading glyph, dimmer trail
        ctx.fillStyle = Math.random() > 0.94 ? "#d7ffe9" : "#4ade80";
        ctx.fillText(ch, i * fontSize, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
    };
    raf = requestAnimationFrame(loop);

    const stop = () => setActive(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") stop();
    };
    window.addEventListener("keydown", onKey);
    const auto = window.setTimeout(stop, 15000);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(auto);
    };
  }, [active]);

  return (
    <>
      {active && (
        <div
          className="fixed inset-0 z-[60] cursor-pointer"
          style={{ background: "#05080b" }}
          onClick={() => setActive(false)}
          role="button"
          aria-label="Close matrix effect"
        >
          <canvas ref={canvasRef} className="block" />
          <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-border bg-bg/70 px-4 py-2 font-mono text-xs text-fg-muted backdrop-blur">
            press <span className="text-accent">esc</span> or click to exit
          </div>
        </div>
      )}
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-[70] -translate-x-1/2 rounded-lg border border-accent/40 bg-bg-raised px-4 py-2.5 font-mono text-sm text-accent shadow-2xl shadow-black/50">
          <span className="text-accent">▸</span> {toast}
        </div>
      )}
    </>
  );
}
