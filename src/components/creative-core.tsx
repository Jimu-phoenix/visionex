"use client";

import { useEffect, useRef } from "react";

/**
 * CreativeCore
 * A wireframe "mesh" that continuously morphs between hard-edged geometry
 * (cube -> sphere -> torus) and an organic, breathing form, while a
 * design-tool Bézier curve with handles sweeps behind it. Orange signal
 * pulses race along the mesh like data through a circuit.
 *
 * Technical (lattice, ticks, registration marks) meets creative (curves, morphing, flow).
 *
 * Interaction: move the cursor to tilt the form, repel the mesh and bend the curve.
 * Click to trigger the next morph.
 *
 * Usage: <CreativeCore className="h-full w-full" />  (fills its parent)
 */

type Props = {
  className?: string;
  color?: string; // mesh / line colour
  accent?: string; // signal pulses
};

const COLS = 40; // around (u)
const ROWS = 24; // pole to pole (v)
const N = COLS * (ROWS + 1);
const HOLD = 3.2; // seconds a shape rests
const MORPH = 1.8; // seconds a morph takes
const SHAPES = 4;
const TAU = Math.PI * 2;

const sp = (c: number, e: number) => Math.sign(c) * Math.pow(Math.abs(c), e);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function surface(
  shape: number,
  u: number,
  v: number,
  t: number,
  out: Float32Array,
  o: number
) {
  const cu = Math.cos(u);
  const su = Math.sin(u);
  const cv = Math.cos(v);
  const sv = Math.sin(v);
  switch (shape) {
    case 0: {
      // box (superellipsoid with a high exponent)
      const e = 2 / 7;
      out[o] = 0.78 * sp(cv, e) * sp(cu, e);
      out[o + 1] = 0.78 * sp(sv, e);
      out[o + 2] = 0.78 * sp(cv, e) * sp(su, e);
      break;
    }
    case 1: {
      // sphere
      out[o] = 0.85 * cv * cu;
      out[o + 1] = 0.85 * sv;
      out[o + 2] = 0.85 * cv * su;
      break;
    }
    case 2: {
      // torus
      const phi = (v + Math.PI / 2) * 2;
      const rr = 0.6 + 0.3 * Math.cos(phi);
      out[o] = rr * cu;
      out[o + 1] = 0.3 * Math.sin(phi);
      out[o + 2] = rr * su;
      break;
    }
    default: {
      // living, breathing blob
      const r =
        0.78 + 0.2 * Math.sin(3 * u + t * 1.6) * Math.cos(2 * v + t * 1.1);
      out[o] = r * cv * cu;
      out[o + 1] = r * sv;
      out[o + 2] = r * cv * su;
    }
  }
}

export default function CreativeCore({
  className = "",
  color = "#ffffff",
  accent = "#FF6A2B",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speed = reduce ? 0.15 : 1;

    // static shapes precomputed; shape 3 (blob) is recomputed each frame
    const buffers: Float32Array[] = [];
    for (let s = 0; s < SHAPES; s++) buffers.push(new Float32Array(N * 3));
    for (let s = 0; s < 3; s++) {
      for (let j = 0; j <= ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          const u = (i / COLS) * TAU;
          const v = -Math.PI / 2 + (j / ROWS) * Math.PI;
          surface(s, u, v, 0, buffers[s], (j * COLS + i) * 3);
        }
      }
    }
    const shapeAt = (s: number, t: number) => {
      if (s === 3) {
        for (let j = 0; j <= ROWS; j++) {
          for (let i = 0; i < COLS; i++) {
            const u = (i / COLS) * TAU;
            const v = -Math.PI / 2 + (j / ROWS) * Math.PI;
            surface(3, u, v, t, buffers[3], (j * COLS + i) * 3);
          }
        }
      }
      return buffers[s];
    };

    const sx = new Float32Array(N);
    const sy = new Float32Array(N);
    const sz = new Float32Array(N);

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // pointer state (smoothed)
    const target = { x: 0, y: 0, nx: 0, ny: 0, inside: false };
    const sm = { x: 0, y: 0, nx: 0, ny: 0, power: 0 };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      target.x = x;
      target.y = y;
      target.nx = clamp((x / rect.width - 0.5) * 2, -1, 1);
      target.ny = clamp((y / rect.height - 0.5) * 2, -1, 1);
    };
    window.addEventListener("pointermove", onMove);

    // morph state machine
    let time = 0;
    let from = 0;
    let to = 1;
    let morphStart = HOLD;
    const onClick = () => {
      if (time < morphStart) morphStart = time; // skip the rest of the hold
    };
    canvas.addEventListener("click", onClick);

    // orbiting pulses
    const pulses = [
      { row: 6, speed: 5.5, offset: 0 },
      { row: 12, speed: -4, offset: 14 },
      { row: 18, speed: 6.5, offset: 27 },
    ];

    let spin = 0;
    let last = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000) * speed;
      last = now;
      time += dt;
      spin += dt * 0.28;

      if (time >= morphStart + MORPH) {
        from = to;
        to = (to + 1) % SHAPES;
        morphStart = time + HOLD;
      }
      const p = clamp((time - morphStart) / MORPH, 0, 1);
      const e = ease(p);

      // smooth the pointer
      const k = 1 - Math.pow(0.001, dt || 0.016);
      const gx = target.inside ? target.nx : 0;
      const gy = target.inside ? target.ny : 0;
      sm.nx += (gx - sm.nx) * k * 0.6;
      sm.ny += (gy - sm.ny) * k * 0.6;
      sm.x += (target.x - sm.x) * k * 1.5;
      sm.y += (target.y - sm.y) * k * 1.5;
      sm.power += ((target.inside ? 1 : 0) - sm.power) * k;

      const cx = w / 2;
      const cy = h / 2;
      const S = Math.min(w, h) * 0.34;

      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";

      // ---------- registration marks (technical) ----------
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 1;
      const m = 14;
      const L = 14;
      ctx.beginPath();
      ctx.moveTo(m, m + L); ctx.lineTo(m, m); ctx.lineTo(m + L, m);
      ctx.moveTo(w - m - L, m); ctx.lineTo(w - m, m); ctx.lineTo(w - m, m + L);
      ctx.moveTo(m, h - m - L); ctx.lineTo(m, h - m); ctx.lineTo(m + L, h - m);
      ctx.moveTo(w - m - L, h - m); ctx.lineTo(w - m, h - m); ctx.lineTo(w - m, h - m - L);
      ctx.stroke();

      // ---------- rotating tick ring ----------
      const ringR = S * 1.32;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      for (let n = 0; n < 72; n++) {
        const a = (n / 72) * TAU + time * 0.08;
        const r2 = ringR + (n % 6 === 0 ? 11 : 5);
        ctx.moveTo(cx + Math.cos(a) * ringR, cy + Math.sin(a) * ringR);
        ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
      }
      ctx.stroke();

      // ---------- Bézier curve with handles (creative) ----------
      const hw = w * 0.44;
      const P0 = [cx - hw, cy + S * 0.85];
      const P3 = [cx + hw, cy - S * 0.85];
      const P1 = [
        cx - hw * 0.35 + sm.nx * S * 0.45,
        cy - S * 1.15 + Math.sin(time * 0.7) * S * 0.16 + sm.ny * S * 0.3,
      ];
      const P2 = [
        cx + hw * 0.35 + sm.nx * S * 0.25,
        cy + S * 1.15 + Math.cos(time * 0.6) * S * 0.16,
      ];
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(P0[0], P0[1]);
      ctx.bezierCurveTo(P1[0], P1[1], P2[0], P2[1], P3[0], P3[1]);
      ctx.stroke();

      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      ctx.moveTo(P0[0], P0[1]); ctx.lineTo(P1[0], P1[1]);
      ctx.moveTo(P3[0], P3[1]); ctx.lineTo(P2[0], P2[1]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.globalAlpha = 0.85;
      ctx.strokeRect(P0[0] - 4, P0[1] - 4, 8, 8);
      ctx.strokeRect(P3[0] - 4, P3[1] - 4, 8, 8);
      ctx.beginPath();
      ctx.arc(P2[0], P2[1], 4, 0, TAU);
      ctx.stroke();
      ctx.fillStyle = accent;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(P1[0], P1[1], 4.5, 0, TAU);
      ctx.fill();

      // ---------- project the morphing mesh ----------
      const A = shapeAt(from, time);
      const B = shapeAt(to, time);
      const ry = spin + sm.nx * 0.9;
      const rx = 0.32 + sm.ny * 0.5;
      const cyr = Math.cos(ry), syr = Math.sin(ry);
      const cxr = Math.cos(rx), sxr = Math.sin(rx);
      const repelR = 110;

      for (let n = 0; n < N; n++) {
        const o = n * 3;
        const x = A[o] + (B[o] - A[o]) * e;
        const y = A[o + 1] + (B[o + 1] - A[o + 1]) * e;
        const z = A[o + 2] + (B[o + 2] - A[o + 2]) * e;
        const x1 = x * cyr + z * syr;
        const z1 = -x * syr + z * cyr;
        const y2 = y * cxr - z1 * sxr;
        const z2 = y * sxr + z1 * cxr;
        const persp = 2.6 / (2.6 - z2);
        let px = cx + x1 * S * persp;
        let py = cy + y2 * S * persp;
        if (sm.power > 0.01) {
          const dx = px - sm.x;
          const dy = py - sm.y;
          const d = Math.hypot(dx, dy);
          if (d < repelR && d > 0.001) {
            const push = Math.pow(1 - d / repelR, 2) * 46 * sm.power;
            px += (dx / d) * push;
            py += (dy / d) * push;
          }
        }
        sx[n] = px;
        sy[n] = py;
        sz[n] = z2;
      }

      // ---------- wires (batched by depth) ----------
      const wires = [new Path2D(), new Path2D(), new Path2D()];
      const bucket = (z: number) => (z > 0.25 ? 0 : z > -0.25 ? 1 : 2);
      for (let j = 0; j <= ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          const a = j * COLS + i;
          const b = j * COLS + ((i + 1) % COLS);
          const pa = wires[bucket((sz[a] + sz[b]) / 2)];
          pa.moveTo(sx[a], sy[a]);
          pa.lineTo(sx[b], sy[b]);
          if (j < ROWS) {
            const c = (j + 1) * COLS + i;
            const pc = wires[bucket((sz[a] + sz[c]) / 2)];
            pc.moveTo(sx[a], sy[a]);
            pc.lineTo(sx[c], sy[c]);
          }
        }
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.55; ctx.stroke(wires[0]);
      ctx.globalAlpha = 0.28; ctx.stroke(wires[1]);
      ctx.globalAlpha = 0.12; ctx.stroke(wires[2]);

      // ---------- vertices as pixels (nod to the logo) ----------
      const dots = [new Path2D(), new Path2D(), new Path2D()];
      for (let n = 0; n < N; n++) {
        const b = bucket(sz[n]);
        const s = b === 0 ? 2.6 : b === 1 ? 2 : 1.4;
        dots[b].rect(sx[n] - s / 2, sy[n] - s / 2, s, s);
      }
      ctx.fillStyle = color;
      ctx.globalAlpha = 1; ctx.fill(dots[0]);
      ctx.globalAlpha = 0.6; ctx.fill(dots[1]);
      ctx.globalAlpha = 0.3; ctx.fill(dots[2]);

      // ---------- signal pulses ----------
      ctx.fillStyle = accent;
      for (const pl of pulses) {
        const head = (((time * pl.speed + pl.offset) % COLS) + COLS) % COLS;
        const dir = pl.speed < 0 ? -1 : 1;
        for (let t = 0; t < 7; t++) {
          const pos = (((head - dir * t * 0.55) % COLS) + COLS) % COLS;
          const i0 = Math.floor(pos);
          const i1 = (i0 + 1) % COLS;
          const f = pos - i0;
          const a = pl.row * COLS + i0;
          const b = pl.row * COLS + i1;
          const px = sx[a] + (sx[b] - sx[a]) * f;
          const py = sy[a] + (sy[b] - sy[a]) * f;
          const size = t === 0 ? 5 : 4 - t * 0.35;
          ctx.globalAlpha = (1 - t / 7) * (sz[a] > -0.3 ? 1 : 0.35);
          ctx.fillRect(px - size / 2, py - size / 2, size, size);
        }
      }

      // ---------- cursor crosshair ----------
      if (sm.power > 0.02) {
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.5 * sm.power;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(sm.x, sm.y, 16, 0, TAU);
        ctx.moveTo(sm.x - 24, sm.y); ctx.lineTo(sm.x - 10, sm.y);
        ctx.moveTo(sm.x + 10, sm.y); ctx.lineTo(sm.x + 24, sm.y);
        ctx.moveTo(sm.x, sm.y - 24); ctx.lineTo(sm.x, sm.y - 10);
        ctx.moveTo(sm.x, sm.y + 10); ctx.lineTo(sm.x, sm.y + 24);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("click", onClick);
    };
  }, [color, accent]);

  return (
    <div className={`relative h-full w-full min-h-[320px] ${className}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Animated wireframe form morphing between geometric shapes, crossed by a Bézier curve"
        className="absolute inset-0 h-full w-full cursor-pointer"
      />
    </div>
  );
}
