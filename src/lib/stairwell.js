// A small software-rendered stairwell. Progress 0 stands at the foot of
// the stairs in the market; progress 1 steps through the door at the top.
// World axes: x forward (up the flight), y up, z sideways.

import { clamp, lerp, smooth, range } from './dom.js';

const S = {
  steps: 15,
  run: 0.3,
  rise: 0.19,
  width: 1.36,
  runner: 0.46, // half-width of the carpet runner
  eye: 1.6,
  ceil: 2.7,
  landing: 1.5,
  near: 0.06,
};
S.len = S.steps * S.run;
S.top = S.steps * S.rise;
S.end = S.len + S.landing; // far wall with the door

const floorAt = (x) => (x <= 0 ? 0 : x >= S.len ? S.top : (x / S.len) * S.top);

// Lights: warm door glow at the top, cool fluorescent spill from the market.
const LIGHTS = [
  { p: [S.end - 0.2, S.top + 1.3, 0], c: [255, 168, 92], k: 2.4, fall: 0.22 },
  { p: [S.len * 0.55, S.top * 0.6 + 2.2, 0], c: [255, 150, 90], k: 0.5, fall: 0.5 },
  { p: [-1.2, 2.9, 0], c: [165, 230, 210], k: 3.2, fall: 0.38 },
];
const AMBIENT = [30, 10, 9];
const HAZE = [70, 22, 16];

const MAT = {
  carpet: [0.62, 0.1, 0.09],
  wood: [0.3, 0.17, 0.1],
  wall: [0.34, 0.2, 0.16],
  dado: [0.16, 0.07, 0.06],
  ceiling: [0.16, 0.08, 0.07],
  marketFloor: [0.28, 0.3, 0.29],
};

const FLYERS = [
  { x: 0.9, side: -1, c: [168, 184, 140] },
  { x: 2.1, side: 1, c: [143, 176, 189] },
  { x: 3.15, side: -1, c: [215, 154, 146] },
  { x: 4.05, side: 1, c: [224, 164, 88] },
];

function shade(mat, pos, n) {
  let r = AMBIENT[0] * mat[0] * 3, g = AMBIENT[1] * mat[1] * 3, b = AMBIENT[2] * mat[2] * 3;
  for (const L of LIGHTS) {
    const dx = L.p[0] - pos[0], dy = L.p[1] - pos[1], dz = L.p[2] - pos[2];
    const d2 = dx * dx + dy * dy + dz * dz;
    const d = Math.sqrt(d2) || 1;
    const lam = Math.max(0, (n[0] * dx + n[1] * dy + n[2] * dz) / d) * 0.75 + 0.25;
    const I = (L.k * lam) / (1 + d2 * L.fall);
    r += L.c[0] * mat[0] * I;
    g += L.c[1] * mat[1] * I;
    b += L.c[2] * mat[2] * I;
  }
  return [r, g, b];
}

const rgb = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

export function createStairwell(canvas) {
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, dpr = 1, F = 1, cx = 0, cy = 0;
  let cam = null;

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    F = Math.max(H * 0.82, W * 0.62);
    cx = W / 2;
    cy = H * 0.5;
  }

  function camera(p) {
    const travel = S.end - 0.5;
    const x = lerp(-0.9, travel, smooth(p) * 0.15 + p * 0.85);
    const onStairs = x > 0 && x < S.len;
    const bob = onStairs ? Math.sin((x / S.run) * Math.PI * 2) * 0.014 : 0;
    const pitch = lerp(0.26, 0.015, smooth(range(p, 0.05, 0.92)));
    return { x, y: floorAt(x) + S.eye + bob, pitch, cs: Math.cos(pitch), sn: Math.sin(pitch) };
  }

  function toCam(P) {
    const dx = P[0] - cam.x, dy = P[1] - cam.y;
    return [P[2], -dx * cam.sn + dy * cam.cs, dx * cam.cs + dy * cam.sn];
  }

  // Clip a camera-space polygon against the near plane, then project it.
  function projectPoly(pts) {
    const cp = pts.map(toCam);
    const out = [];
    for (let i = 0; i < cp.length; i++) {
      const a = cp[i], b = cp[(i + 1) % cp.length];
      const ain = a[2] >= S.near, bin = b[2] >= S.near;
      if (ain) out.push(a);
      if (ain !== bin) {
        const t = (S.near - a[2]) / (b[2] - a[2]);
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, S.near]);
      }
    }
    return out.map(([x, y, z]) => [cx + (F * x) / z, cy - (F * y) / z]);
  }

  function fog(c, P) {
    const dx = P[0] - cam.x, dy = P[1] - cam.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    const f = 1 - Math.exp(-d * 0.11);
    return [lerp(c[0], HAZE[0], f), lerp(c[1], HAZE[1], f), lerp(c[2], HAZE[2], f)];
  }

  function fill(pts, mat, n, centre, alpha = 1) {
    const s = projectPoly(pts);
    if (s.length < 3) return;
    ctx.beginPath();
    ctx.moveTo(s[0][0], s[0][1]);
    for (let i = 1; i < s.length; i++) ctx.lineTo(s[i][0], s[i][1]);
    ctx.closePath();
    ctx.fillStyle = rgb(fog(shade(mat, centre, n), centre), alpha);
    ctx.fill();
  }

  function line(a, b, color, width) {
    let A = toCam(a), B = toCam(b);
    if (A[2] < S.near && B[2] < S.near) return;
    if (A[2] < S.near || B[2] < S.near) {
      const t = (S.near - A[2]) / (B[2] - A[2]);
      const C = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, S.near];
      if (A[2] < S.near) A = C; else B = C;
    }
    const z = (A[2] + B[2]) / 2;
    ctx.beginPath();
    ctx.moveTo(cx + (F * A[0]) / A[2], cy - (F * A[1]) / A[2]);
    ctx.lineTo(cx + (F * B[0]) / B[2], cy - (F * B[1]) / B[2]);
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(0.6, Math.min(6, (width * F) / z));
    ctx.stroke();
  }

  function drawWalls() {
    const hw = S.width / 2;
    const xs = [];
    for (let x = -3; x < S.end; x += S.run) xs.push(x);
    xs.push(S.end);
    for (let i = xs.length - 2; i >= 0; i--) {
      const x0 = xs[i], x1 = xs[i + 1];
      const f0 = floorAt(x0), f1 = floorAt(x1);
      const ceil0 = x0 < -0.3 ? 3.6 : f0 + S.ceil;
      const ceil1 = x1 < -0.3 ? 3.6 : f1 + S.ceil;
      const xm = (x0 + x1) / 2, fm = floorAt(xm);
      // ceiling
      fill([[x0, ceil0, -hw], [x1, ceil1, -hw], [x1, ceil1, hw], [x0, ceil0, hw]], MAT.ceiling, [0, -1, 0], [xm, fm + S.ceil, 0]);
      for (const side of [-1, 1]) {
        const z = side * hw;
        const n = [0, 0, -side];
        fill([[x0, f0, z], [x1, f1, z], [x1, f1 + 0.95, z], [x0, f0 + 0.95, z]], MAT.dado, n, [xm, fm + 0.5, z]);
        fill([[x0, f0 + 0.95, z], [x1, f1 + 0.95, z], [x1, ceil1, z], [x0, ceil0, z]], MAT.wall, n, [xm, fm + 1.6, z]);
      }
    }
    // dado rails
    for (const side of [-1, 1]) {
      const z = side * hw * 0.999;
      let prev = null;
      for (let i = 0; i < xs.length; i++) {
        const P = [xs[i], floorAt(xs[i]) + 0.95, z];
        if (prev) line(prev, P, 'rgba(214,170,98,.55)', 0.012);
        prev = P;
      }
    }
  }

  function drawFlyers() {
    const hw = S.width / 2 - 0.002;
    for (const f of FLYERS) {
      const z = f.side * hw;
      const fl = floorAt(f.x);
      const y0 = fl + 1.25, y1 = fl + 1.85;
      const x0 = f.x, x1 = f.x + 0.42;
      const n = [0, 0, -f.side];
      const lit = shade([0.9, 0.9, 0.9], [x0, y0, z], n);
      const mix = [lit[0] / 255, lit[1] / 255, lit[2] / 255];
      const frame = [[x0 - 0.03, y0 - 0.03, z], [x1 + 0.03, y0 - 0.03, z], [x1 + 0.03, y1 + 0.03, z], [x0 - 0.03, y1 + 0.03, z]];
      fill(frame, [0.75, 0.55, 0.3], n, [x0, y0, z]);
      const s = projectPoly([[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]);
      if (s.length < 3) continue;
      ctx.beginPath();
      s.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.fillStyle = rgb(fog([f.c[0] * mix[0], f.c[1] * mix[1], f.c[2] * mix[2]], [x0, y0, z]));
      ctx.fill();
      // a few bold "type" bars on each flyer
      for (let k = 0; k < 3; k++) {
        const yy = y1 - 0.12 - k * 0.11;
        line([x0 + 0.06, yy, z], [x1 - 0.06 - k * 0.08, yy, z], 'rgba(20,6,5,.35)', 0.025);
      }
    }
  }

  function drawDoor(p) {
    const hw = S.width / 2;
    const X = S.end;
    fill([[X, S.top, -hw], [X, S.top, hw], [X, S.top + S.ceil, hw], [X, S.top + S.ceil, -hw]], MAT.wall, [-1, 0, 0], [X, S.top + 1.2, 0]);
    const dw = 0.46, dh = 2.08;
    const s = projectPoly([[X, S.top, -dw], [X, S.top, dw], [X, S.top + dh, dw], [X, S.top + dh, -dw]]);
    if (s.length < 3) return;
    const minX = Math.min(...s.map((q) => q[0])), maxX = Math.max(...s.map((q) => q[0]));
    const minY = Math.min(...s.map((q) => q[1])), maxY = Math.max(...s.map((q) => q[1]));
    const g = ctx.createRadialGradient((minX + maxX) / 2, minY + (maxY - minY) * 0.35, 0, (minX + maxX) / 2, minY + (maxY - minY) * 0.4, Math.max(maxX - minX, maxY - minY) * 0.75);
    g.addColorStop(0, '#ffe2b0');
    g.addColorStop(0.35, '#ffb162');
    g.addColorStop(1, '#b4421e');
    ctx.beginPath();
    s.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
    // a hint of the room through the door: shelves and a figure-free bar line
    const dwq = maxX - minX, dhq = maxY - minY;
    ctx.save();
    ctx.clip();
    ctx.fillStyle = 'rgba(120,30,16,.35)';
    for (let k = 0; k < 3; k++) ctx.fillRect(minX, minY + dhq * (0.28 + k * 0.12), dwq, Math.max(1, dhq * 0.012));
    ctx.fillStyle = 'rgba(90,20,12,.5)';
    ctx.fillRect(minX, minY + dhq * 0.72, dwq, dhq * 0.28);
    ctx.restore();
    // door frame
    const fr = [[X - 0.01, S.top, -dw - 0.05], [X - 0.01, S.top + dh + 0.05, -dw - 0.05], [X - 0.01, S.top + dh + 0.05, dw + 0.05], [X - 0.01, S.top, dw + 0.05]];
    for (let i = 0; i < 3; i++) line(fr[i], fr[i + 1], 'rgba(226,180,104,.9)', 0.03);
    // sign above the door
    const sign = toCam([X - 0.02, S.top + dh + 0.3, 0]);
    if (sign[2] > S.near) {
      const sx = cx + (F * sign[0]) / sign[2], sy = cy - (F * sign[1]) / sign[2];
      const size = (F * 0.15) / sign[2];
      ctx.font = `italic 500 ${size}px "Fraunces Variable", Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(255,170,90,.9)';
      ctx.shadowBlur = size * 0.6;
      ctx.fillStyle = `rgba(255,214,160,${0.55 + 0.45 * range(p, 0.2, 0.7)})`;
      ctx.fillText('Mezzanine', sx, sy);
      ctx.shadowBlur = 0;
    }
  }

  function drawFloors() {
    const hw = S.width / 2;
    // market floor below the first step
    fill([[-3, 0, -hw], [0, 0, -hw], [0, 0, hw], [-3, 0, hw]], MAT.marketFloor, [0, 1, 0], [-0.8, 0, 0]);
    // landing
    for (const [z0, z1, m] of [[-hw, -S.runner, MAT.wood], [-S.runner, S.runner, MAT.carpet], [S.runner, hw, MAT.wood]]) {
      fill([[S.len, S.top, z0], [S.end, S.top, z0], [S.end, S.top, z1], [S.len, S.top, z1]], m, [0, 1, 0], [S.len + S.landing * 0.5, S.top, (z0 + z1) / 2]);
    }
  }

  function drawSteps() {
    const hw = S.width / 2;
    const strips = [[-hw, -S.runner, MAT.wood], [-S.runner, S.runner, MAT.carpet], [S.runner, hw, MAT.wood]];
    for (let k = S.steps - 1; k >= 0; k--) {
      const x0 = k * S.run, x1 = x0 + S.run;
      const yb = k * S.rise, yt = yb + S.rise;
      if (cam.y > yt) {
        for (const [z0, z1, m] of strips) {
          fill([[x0, yt, z0], [x1, yt, z0], [x1, yt, z1], [x0, yt, z1]], m, [0, 1, 0], [x0 + S.run / 2, yt, (z0 + z1) / 2]);
        }
      }
      if (cam.x < x0) {
        for (const [z0, z1, m] of strips) {
          fill([[x0, yb, z0], [x0, yb, z1], [x0, yt, z1], [x0, yt, z0]], m, [-1, 0, 0], [x0, yb + S.rise / 2, (z0 + z1) / 2]);
        }
        // nosing highlight and brass stair rod
        line([x0, yt, -hw], [x0, yt, hw], 'rgba(255,196,128,.22)', 0.008);
        line([x0 - 0.02, yb + 0.015, -S.runner - 0.03], [x0 - 0.02, yb + 0.015, S.runner + 0.03], 'rgba(232,188,110,.95)', 0.012);
      }
    }
  }

  function drawRail() {
    const z = S.width / 2 - 0.07;
    let prev = null;
    for (let x = -0.6; x <= S.len - 0.1; x += 0.15) {
      const P = [x, floorAt(x) + 0.92, z];
      if (prev) line(prev, P, 'rgba(236,190,112,.95)', 0.028);
      prev = P;
    }
    if (prev) line(prev, [prev[0], S.top, z], 'rgba(236,190,112,.8)', 0.03);
  }

  function draw(p) {
    p = clamp(p);
    cam = camera(p);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#120605';
    ctx.fillRect(0, 0, W, H);

    drawDoor(p);
    drawWalls();
    drawFlyers();
    drawFloors();
    drawSteps();
    drawRail();

    // door bloom
    const D = toCam([S.end, S.top + 1.1, 0]);
    if (D[2] > S.near) {
      const dx = cx + (F * D[0]) / D[2], dy = cy - (F * D[1]) / D[2];
      const rad = Math.min(Math.max(W, H) * 1.6, (F * 2.4) / D[2]);
      const g = ctx.createRadialGradient(dx, dy, 0, dx, dy, rad);
      g.addColorStop(0, `rgba(255,186,110,${0.32 + 0.25 * p})`);
      g.addColorStop(0.4, 'rgba(255,140,70,.10)');
      g.addColorStop(1, 'rgba(255,120,60,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
    }

    // cool market wash at the foot of the stairs
    const cool = 1 - smooth(range(p, 0, 0.45));
    if (cool > 0.01 && D[2] > S.near) {
      // shift everything but the doorway towards fluorescent green-grey
      const dx = cx + (F * D[0]) / D[2], dy = cy - (F * D[1]) / D[2];
      const tint = ctx.createRadialGradient(dx, dy, Math.min(W, H) * 0.08, dx, dy, Math.max(W, H) * 0.75);
      tint.addColorStop(0, 'rgba(90,150,138,0)');
      tint.addColorStop(0.35, `rgba(90,150,138,${0.35 * cool})`);
      tint.addColorStop(1, `rgba(90,150,138,${0.7 * cool})`);
      ctx.globalCompositeOperation = 'color';
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
    }
    if (cool > 0.01) {
      const g = ctx.createLinearGradient(0, H, 0, 0);
      g.addColorStop(0, `rgba(150,215,195,${0.3 * cool})`);
      g.addColorStop(0.45, `rgba(60,120,108,${0.16 * cool})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // vignette
    const v = ctx.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.25, W / 2, H * 0.5, Math.max(W, H) * 0.8);
    v.addColorStop(0, 'rgba(10,3,2,0)');
    v.addColorStop(1, 'rgba(10,3,2,.75)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);

    // step through: warm flash, then eyes adjust to the dim room
    const flash = smooth(range(p, 0.82, 0.93)) * (1 - smooth(range(p, 0.93, 1)));
    if (flash > 0) {
      ctx.fillStyle = `rgba(255,190,120,${0.75 * flash})`;
      ctx.fillRect(0, 0, W, H);
    }
    const dim = smooth(range(p, 0.92, 1));
    if (dim > 0) {
      ctx.fillStyle = `rgba(59,10,9,${dim})`;
      ctx.fillRect(0, 0, W, H);
      const lamp = ctx.createRadialGradient(W * 0.1, -H * 0.05, 0, W * 0.1, -H * 0.05, Math.max(W, H) * 0.7);
      lamp.addColorStop(0, `rgba(255,170,95,${0.22 * dim})`);
      lamp.addColorStop(1, 'rgba(255,170,95,0)');
      ctx.fillStyle = lamp;
      ctx.fillRect(0, 0, W, H);
    }
  }

  resize();
  return { draw, resize };
}
