// A small software-rendered stairwell, modelled on the real one: red-lit
// exposed brick, a black handrail, plants, and the glowing arrow sign.
// Progress 0 stands at the foot of the stairs in the market; progress 1
// steps through the door at the top.
// World axes: x forward (up the flight), y up, z sideways.

import { clamp, lerp, smooth, range } from './dom.js';
import { LOGO_PATH } from './logo.js';

const S = {
  steps: 15,
  run: 0.3,
  rise: 0.19,
  width: 1.3,
  eye: 1.6,
  ceil: 2.7,
  landing: 1.5,
  near: 0.06,
};
S.len = S.steps * S.run;
S.top = S.steps * S.rise;
S.end = S.len + S.landing; // far wall with the door
S.slope = S.top / S.len;

const floorAt = (x) => (x <= 0 ? 0 : x >= S.len ? S.top : x * S.slope);
const ceilAt = (x) => (x < -0.3 ? 3.6 : floorAt(x) + S.ceil);

// The lit arrow sign, projecting from the left wall part way up and
// pointing on up the stairs.
const SIGN = { x: S.len * 0.36, z: -S.width / 2 + 0.03, y: 0, tilt: 0.42 };
SIGN.y = floorAt(SIGN.x) + 2.0;

const LIGHTS = [
  { p: [S.end - 0.2, S.top + 1.3, 0], c: [255, 170, 100], k: 2.2, fall: 0.22 }, // the door
  { p: [S.len * 0.3, S.top * 0.3 + 2.0, -0.4], c: [255, 62, 38], k: 1.9, fall: 0.42 }, // red wall wash
  { p: [S.len * 0.85, S.top * 0.85 + 2.0, 0.4], c: [255, 72, 44], k: 1.9, fall: 0.42 },
  { p: [SIGN.x - 0.15, SIGN.y + 0.1, SIGN.z + 0.35], c: [255, 236, 210], k: 0.9, fall: 2.2 }, // sign spill
  { p: [-1.2, 2.9, 0], c: [165, 230, 210], k: 3.2, fall: 0.38 }, // market fluorescents
];
const AMBIENT = [26, 8, 7];
const HAZE = [62, 16, 12];

const MAT = {
  brick: [0.62, 0.3, 0.22],
  ceiling: [0.1, 0.06, 0.05],
  tread: [0.2, 0.15, 0.13],
  riser: [0.13, 0.1, 0.09],
  marketFloor: [0.28, 0.3, 0.29],
};

const PLANTS = [
  { x: 0.9, side: -1, h: 2.05, r: 0.34 },
  { x: 2.25, side: 1, h: 2.1, r: 0.3 },
  { x: 3.3, side: -1, h: 1.95, r: 0.38 },
  { x: SIGN.x + 0.9, side: 1, h: 1.35, r: 0.26 },
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

let logoPath = null;
const getLogo = () => (logoPath ||= new Path2D(LOGO_PATH));

export function createStairwell(canvas) {
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, F = 1, cx = 0, cy = 0;
  let cam = null;

  function resize() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
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

  const screen = (C) => [cx + (F * C[0]) / C[2], cy - (F * C[1]) / C[2]];

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
    return out.map(screen);
  }

  function fog(c, P) {
    const dx = P[0] - cam.x, dy = P[1] - cam.y;
    const f = 1 - Math.exp(-Math.sqrt(dx * dx + dy * dy) * 0.11);
    return [lerp(c[0], HAZE[0], f), lerp(c[1], HAZE[1], f), lerp(c[2], HAZE[2], f)];
  }

  function trace(s) {
    ctx.beginPath();
    ctx.moveTo(s[0][0], s[0][1]);
    for (let i = 1; i < s.length; i++) ctx.lineTo(s[i][0], s[i][1]);
    ctx.closePath();
  }

  function fill(pts, mat, n, centre) {
    const s = projectPoly(pts);
    if (s.length < 3) return;
    trace(s);
    ctx.fillStyle = rgb(fog(shade(mat, centre, n), centre));
    ctx.fill();
  }

  // Clip a world-space segment to the near plane; returns camera-space ends.
  function clipSeg(a, b) {
    let A = toCam(a), B = toCam(b);
    if (A[2] < S.near && B[2] < S.near) return null;
    if (A[2] < S.near || B[2] < S.near) {
      const t = (S.near - A[2]) / (B[2] - A[2]);
      const C = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, S.near];
      if (A[2] < S.near) A = C; else B = C;
    }
    return [A, B];
  }

  function line(a, b, color, width) {
    const seg = clipSeg(a, b);
    if (!seg) return;
    const [A, B] = seg;
    const z = (A[2] + B[2]) / 2;
    const p = screen(A), q = screen(B);
    ctx.beginPath();
    ctx.moveTo(p[0], p[1]);
    ctx.lineTo(q[0], q[1]);
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(0.6, Math.min(8, (width * F) / z));
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
      const c0 = ceilAt(x0), c1 = ceilAt(x1);
      const xm = (x0 + x1) / 2, fm = floorAt(xm);
      fill([[x0, c0, -hw], [x1, c1, -hw], [x1, c1, hw], [x0, c0, hw]], MAT.ceiling, [0, -1, 0], [xm, fm + S.ceil, 0]);
      for (const side of [-1, 1]) {
        const z = side * hw;
        const n = [0, 0, -side];
        // two bands so the light falls off up the wall
        const mid0 = f0 + 1.2, mid1 = f1 + 1.2;
        fill([[x0, f0, z], [x1, f1, z], [x1, mid1, z], [x0, mid0, z]], MAT.brick, n, [xm, fm + 0.6, z]);
        fill([[x0, mid0, z], [x1, mid1, z], [x1, c1, z], [x0, c0, z]], MAT.brick, n, [xm, fm + 1.9, z]);
      }
    }
  }

  // Mortar courses and joints, batched into one stroke per wall.
  function drawBrickwork() {
    const hw = S.width / 2 - 0.002;
    const course = 0.15;
    for (const side of [-1, 1]) {
      const z = side * hw;
      ctx.beginPath();
      for (let k = 1, y = course; y < S.top + S.ceil; k++, y += course) {
        const xFloor = y >= S.top ? S.end : y / S.slope;
        const xCeil = y <= S.ceil ? -3 : Math.max(-0.3, (y - S.ceil) / S.slope);
        const x0 = Math.max(-3, xCeil), x1 = Math.min(S.end, xFloor);
        if (x1 <= x0) continue;
        const seg = clipSeg([x0, y, z], [x1, y, z]);
        if (seg) {
          const p = screen(seg[0]), q = screen(seg[1]);
          ctx.moveTo(p[0], p[1]);
          ctx.lineTo(q[0], q[1]);
        }
        // vertical joints, staggered, only close enough to read
        for (let x = x0 + (k % 2 ? 0 : 0.11); x < x1; x += 0.22) {
          if (Math.abs(x - cam.x) > 3.2) continue;
          const j = clipSeg([x, y - course, z], [x, y, z]);
          if (!j) continue;
          const p = screen(j[0]), q = screen(j[1]);
          ctx.moveTo(p[0], p[1]);
          ctx.lineTo(q[0], q[1]);
        }
      }
      ctx.strokeStyle = 'rgba(28,6,4,.42)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function drawPlants() {
    for (const pl of PLANTS) {
      const hw = S.width / 2 - 0.12;
      const C = toCam([pl.x, floorAt(pl.x) + pl.h, pl.side * hw]);
      if (C[2] < 0.3) continue;
      const [sx, sy] = screen(C);
      const R = (F * pl.r) / C[2];
      let seed = Math.round(pl.x * 100);
      const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
      const f = fog([0, 0, 0], [pl.x, pl.h, 0]);
      for (let i = 0; i < 22; i++) {
        const a = rnd() * Math.PI * 2;
        const d = Math.sqrt(rnd()) * R * 0.75;
        ctx.save();
        ctx.translate(sx + Math.cos(a) * d, sy + Math.sin(a) * d * 0.8);
        ctx.rotate(a + (rnd() - 0.5));
        ctx.beginPath();
        ctx.ellipse(0, 0, R * (0.22 + rnd() * 0.12), R * 0.07, 0, 0, Math.PI * 2);
        const lit = rnd() > 0.6;
        ctx.fillStyle = lit ? `rgb(${86 + f[0] * 0.3 | 0},${74 + f[1] * 0.2 | 0},${40})` : `rgb(${38 + f[0] * 0.4 | 0},${46 + f[1] * 0.3 | 0},${26})`;
        ctx.fill();
        ctx.restore();
      }
    }
  }

  // Map logo coordinates onto a quad given by three world points.
  function drawLogoOn(P0, Px, Py, color, glow) {
    const a0 = toCam(P0), ax = toCam(Px), ay = toCam(Py);
    if (a0[2] < S.near || ax[2] < S.near || ay[2] < S.near) return;
    const p0 = screen(a0), px = screen(ax), py = screen(ay);
    const a = (px[0] - p0[0]) / 3615, b = (px[1] - p0[1]) / 3615;
    const c = (py[0] - p0[0]) / 783, d = (py[1] - p0[1]) / 783;
    ctx.save();
    ctx.transform(a, b, c, d, p0[0] - 30 * a - 30 * c, p0[1] - 30 * b - 30 * d);
    if (glow) {
      ctx.shadowColor = glow;
      ctx.shadowBlur = 40;
    }
    ctx.fillStyle = color;
    ctx.fill(getLogo());
    ctx.restore();
  }

  function drawSign() {
    const { x, z, y, tilt } = SIGN;
    if (cam.x > x - 0.35) return;
    const depth = 0.12;
    const cs = Math.cos(tilt), sn = Math.sin(tilt);
    // (u, v) on the sign face: u runs out from the wall, v up; rotated so the
    // arrow points up and away
    const at = (u, v, dx = 0) => {
      const ru = u * cs - (v - 0.15) * sn, rv = u * sn + (v - 0.15) * cs + 0.15;
      return [x + dx, y + rv, z + ru];
    };
    const shape = [[0, 0.07], [0.4, 0.07], [0.4, -0.03], [0.64, 0.15], [0.4, 0.33], [0.4, 0.23], [0, 0.23]];
    const front = shape.map(([u, v]) => at(u, v));
    const back = shape.map(([u, v]) => at(u, v, depth));
    for (let i = 0; i < shape.length; i++) {
      const j = (i + 1) % shape.length;
      const s = projectPoly([back[i], back[j], front[j], front[i]]);
      if (s.length < 3) continue;
      trace(s);
      ctx.fillStyle = 'rgb(236,206,180)';
      ctx.fill();
    }
    const s = projectPoly(front);
    if (s.length < 3) return;
    ctx.save();
    trace(s);
    ctx.shadowColor = 'rgba(255,236,210,.95)';
    ctx.shadowBlur = Math.min(70, (F * 0.3) / Math.max(0.3, x - cam.x));
    ctx.fillStyle = '#fff7ec';
    ctx.fill();
    ctx.restore();
    const lw = 0.33, lh = lw / (3615 / 783), u0 = 0.035, v0 = 0.15 + lh / 2;
    drawLogoOn(at(u0, v0, -0.001), at(u0 + lw, v0, -0.001), at(u0, v0 - lh, -0.001), '#1a0b08');
  }

  function drawDoor(p) {
    const hw = S.width / 2;
    const X = S.end;
    fill([[X, S.top, -hw], [X, S.top, hw], [X, S.top + S.ceil, hw], [X, S.top + S.ceil, -hw]], MAT.brick, [-1, 0, 0], [X, S.top + 1.2, 0]);
    const dw = 0.46, dh = 2.08;
    const s = projectPoly([[X, S.top, -dw], [X, S.top, dw], [X, S.top + dh, dw], [X, S.top + dh, -dw]]);
    if (s.length < 3) return;
    const xs = s.map((q) => q[0]), ys = s.map((q) => q[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const g = ctx.createRadialGradient((minX + maxX) / 2, minY + (maxY - minY) * 0.35, 0, (minX + maxX) / 2, minY + (maxY - minY) * 0.4, Math.max(maxX - minX, maxY - minY) * 0.75);
    g.addColorStop(0, '#ffe2b0');
    g.addColorStop(0.35, '#ffad5e');
    g.addColorStop(1, '#b23a1c');
    trace(s);
    ctx.fillStyle = g;
    ctx.fill();
    // a hint of the room through the door
    const dwq = maxX - minX, dhq = maxY - minY;
    ctx.save();
    ctx.clip();
    ctx.fillStyle = 'rgba(120,30,16,.35)';
    for (let k = 0; k < 3; k++) ctx.fillRect(minX, minY + dhq * (0.28 + k * 0.12), dwq, Math.max(1, dhq * 0.012));
    ctx.fillStyle = 'rgba(90,20,12,.5)';
    ctx.fillRect(minX, minY + dhq * 0.72, dwq, dhq * 0.28);
    ctx.restore();
    const fr = [[X - 0.01, S.top, -dw - 0.05], [X - 0.01, S.top + dh + 0.05, -dw - 0.05], [X - 0.01, S.top + dh + 0.05, dw + 0.05], [X - 0.01, S.top, dw + 0.05]];
    for (let i = 0; i < 3; i++) line(fr[i], fr[i + 1], 'rgba(20,10,8,.9)', 0.04);
    // the wordmark above the door
    const lw = 0.86, lh = lw / (3615 / 783), ly = S.top + dh + 0.42;
    const alpha = 0.6 + 0.4 * range(p, 0.2, 0.7);
    drawLogoOn([X - 0.02, ly, -lw / 2], [X - 0.02, ly, lw / 2], [X - 0.02, ly - lh, -lw / 2], `rgba(255,220,180,${alpha})`, 'rgba(255,150,90,.9)');
  }

  function drawFloors() {
    const hw = S.width / 2;
    fill([[-3, 0, -hw], [0, 0, -hw], [0, 0, hw], [-3, 0, hw]], MAT.marketFloor, [0, 1, 0], [-0.8, 0, 0]);
    fill([[S.len, S.top, -hw], [S.end, S.top, -hw], [S.end, S.top, hw], [S.len, S.top, hw]], MAT.tread, [0, 1, 0], [S.len + S.landing * 0.5, S.top, 0]);
  }

  function drawSteps() {
    const hw = S.width / 2;
    for (let k = S.steps - 1; k >= 0; k--) {
      const x0 = k * S.run, x1 = x0 + S.run;
      const yb = k * S.rise, yt = yb + S.rise;
      if (cam.y > yt) {
        fill([[x0, yt, -hw], [x1, yt, -hw], [x1, yt, hw], [x0, yt, hw]], MAT.tread, [0, 1, 0], [x0 + S.run / 2, yt, 0]);
      }
      if (cam.x < x0) {
        fill([[x0, yb, -hw], [x0, yb, hw], [x0, yt, hw], [x0, yt, -hw]], MAT.riser, [-1, 0, 0], [x0, yb + S.rise / 2, 0]);
        // worn metal nosing catching the red light
        line([x0, yt, -hw], [x0, yt, hw], 'rgba(255,120,90,.32)', 0.01);
      }
    }
  }

  function drawRail() {
    const z = S.width / 2 - 0.07;
    let prev = null;
    for (let x = -0.6; x <= S.len - 0.1; x += 0.15) {
      const P = [x, floorAt(x) + 0.92, z];
      if (prev) {
        line(prev, P, 'rgba(12,8,8,.95)', 0.04);
        line([prev[0], prev[1] + 0.02, z - 0.01], [P[0], P[1] + 0.02, z - 0.01], 'rgba(255,110,80,.35)', 0.008);
      }
      prev = P;
    }
    // brackets back to the wall
    for (let x = 0.2; x < S.len; x += 1.1) {
      const y = floorAt(x) + 0.92;
      line([x, y, z], [x, y - 0.06, z + 0.07], 'rgba(12,8,8,.95)', 0.015);
    }
  }

  function draw(p) {
    p = clamp(p);
    cam = camera(p);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#120605';
    ctx.fillRect(0, 0, W, H);

    drawDoor(p);
    drawWalls();
    drawBrickwork();
    drawFloors();
    drawSteps();
    drawSign();
    drawPlants();
    drawRail();

    // door bloom
    const D = toCam([S.end, S.top + 1.1, 0]);
    if (D[2] > S.near) {
      const [dx, dy] = screen(D);
      const rad = Math.min(Math.max(W, H) * 1.6, (F * 2.4) / D[2]);
      const g = ctx.createRadialGradient(dx, dy, 0, dx, dy, rad);
      g.addColorStop(0, `rgba(255,180,110,${0.3 + 0.25 * p})`);
      g.addColorStop(0.4, 'rgba(255,120,70,.10)');
      g.addColorStop(1, 'rgba(255,100,60,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
    }

    // cool market wash at the foot of the stairs
    const cool = 1 - smooth(range(p, 0, 0.45));
    if (cool > 0.01 && D[2] > S.near) {
      const [dx, dy] = screen(D);
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

    // step through: warm flash, then eyes adjust to the lamp-lit room
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
