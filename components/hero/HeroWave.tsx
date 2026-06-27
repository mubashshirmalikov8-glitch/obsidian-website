"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * HeroWave — a minimal, premium animated background built on Canvas 2D.
 *
 * A few stacked sine ribbons drift slowly across a dark obsidian base in
 * blue → violet, each drawn as a soft glow pass + a crisp line. No WebGL,
 * no particles, no images. Lightweight: gradients are cached per-resize so
 * the per-frame work is just two strokes per layer.
 *
 * Honours `prefers-reduced-motion` (renders a single static frame), clamps
 * DPR for performance, handles resize via ResizeObserver, pauses when the
 * tab is hidden, and cancels its rAF on unmount.
 */
const LAYERS = 5;
const MAX_DPR = 2;
const STATIC_TIME = 5200; // pleasant frozen phase for reduced-motion

type Layer = {
  yFactor: number; // vertical position as a fraction of height
  amp: number; // primary amplitude (px)
  len: number; // primary spatial frequency
  len2: number; // secondary spatial frequency (organic detail)
  speed: number;
  speed2: number;
  phase: number;
  widthGlow: number;
  alphaGlow: number;
  alphaThin: number;
};

const LAYER_CONFIG: Layer[] = Array.from({ length: LAYERS }, (_, i) => {
  const t = i / (LAYERS - 1); // 0 (top) .. 1 (bottom)
  return {
    yFactor: 0.44 + t * 0.46, // sit in the lower-middle band
    amp: 30 + (1 - t) * 30, // taller, calmer waves up top
    len: 0.0015 + t * 0.001,
    len2: 0.0041 - t * 0.0011,
    speed: 0.00018 + t * 0.00016,
    speed2: 0.00027 - t * 0.0001,
    phase: i * 1.7,
    widthGlow: 24 - t * 7,
    alphaGlow: 0.07 - t * 0.028,
    alphaThin: 0.5 - t * 0.24,
  };
});

export function HeroWave({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let raf = 0;
    let resizeScheduled = false;
    // Cached gradients (rebuilt only on resize, never per frame).
    let strokeGrad: CanvasGradient | null = null;
    let glowGrad: CanvasGradient | null = null;

    function buildGradients() {
      // Horizontal blue → violet ribbon, fading out at both edges.
      const s = ctx!.createLinearGradient(0, 0, width, 0);
      s.addColorStop(0, "rgba(74,120,255,0)");
      s.addColorStop(0.18, "rgba(74,120,255,1)");
      s.addColorStop(0.5, "rgba(108,104,250,1)");
      s.addColorStop(0.82, "rgba(139,92,246,1)");
      s.addColorStop(1, "rgba(139,92,246,0)");
      strokeGrad = s;

      // Soft central depth glow behind the ribbons.
      const r = Math.max(width, height) * 0.72;
      const g = ctx!.createRadialGradient(
        width * 0.5,
        height * 0.46,
        0,
        width * 0.5,
        height * 0.46,
        r,
      );
      g.addColorStop(0, "rgba(58,86,196,0.12)");
      g.addColorStop(0.45, "rgba(58,38,104,0.07)");
      g.addColorStop(1, "rgba(5,6,10,0)");
      glowGrad = g;
    }

    function applySize() {
      const parent = canvas!.parentElement ?? canvas!;
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS pixels
      buildGradients();
    }

    function render(time: number) {
      if (!strokeGrad || !glowGrad) return;
      const c = ctx!;

      // Obsidian base + depth glow.
      c.fillStyle = "#05060a";
      c.fillRect(0, 0, width, height);
      c.fillStyle = glowGrad;
      c.fillRect(0, 0, width, height);

      const step = Math.max(6, Math.round(width / 180));
      c.lineCap = "round";
      c.lineJoin = "round";

      for (const L of LAYER_CONFIG) {
        const baseY = height * L.yFactor;
        c.beginPath();
        for (let x = -step; x <= width + step; x += step) {
          const y =
            baseY +
            Math.sin(x * L.len + time * L.speed + L.phase) * L.amp +
            Math.sin(x * L.len2 - time * L.speed2 + L.phase) * (L.amp * 0.42);
          if (x <= -step) c.moveTo(x, y);
          else c.lineTo(x, y);
        }
        c.strokeStyle = strokeGrad;
        // soft glow pass
        c.globalAlpha = L.alphaGlow;
        c.lineWidth = L.widthGlow;
        c.stroke();
        // crisp line pass
        c.globalAlpha = L.alphaThin;
        c.lineWidth = 1.2;
        c.stroke();
      }
      c.globalAlpha = 1;
    }

    function loop(now: number) {
      render(now);
      raf = requestAnimationFrame(loop);
    }

    function start() {
      cancelAnimationFrame(raf);
      if (reduceMq.matches || document.hidden) {
        render(STATIC_TIME); // one static frame, no animation
        return;
      }
      raf = requestAnimationFrame(loop);
    }

    function onResize() {
      if (resizeScheduled) return;
      resizeScheduled = true;
      requestAnimationFrame(() => {
        resizeScheduled = false;
        applySize();
        if (reduceMq.matches || document.hidden) render(STATIC_TIME);
      });
    }

    function onVisibility() {
      cancelAnimationFrame(raf);
      if (!document.hidden) start();
    }

    applySize();
    start();

    const ro = new ResizeObserver(onResize);
    ro.observe(canvas.parentElement ?? canvas);
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reduceMq.addEventListener("change", start);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMq.removeEventListener("change", start);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("block h-full w-full", className)}
    />
  );
}
