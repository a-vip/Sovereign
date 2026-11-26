/* ── HOLOGRAPHIC 3D ORTHOGRAPHIC GLOBE ENGINE (HERO + CTA SHOWCASE) ── */
function buildContinentDots() {
  // Compact simplified global landmass blobs [latCenter, lonCenter, latRad, lonRad, density]
  const regions = [
    // North America
    [48, -104, 15, 22, 1.0], [36, -98, 12, 18, 1.0], [58, -122, 10, 18, 0.85], [22, -101, 8, 8, 0.9], [66, -150, 6, 12, 0.7],
    // Greenland
    [72, -42, 8, 12, 0.8],
    // South America
    [-6, -60, 14, 14, 1.0], [-22, -56, 13, 10, 1.0], [-40, -68, 12, 6, 0.85],
    // Europe
    [51, 10, 9, 14, 1.0], [44, 16, 7, 13, 0.95], [61, 18, 8, 12, 0.85], [54, -2, 4, 5, 0.9],
    // Africa
    [22, 14, 13, 18, 1.0], [6, 22, 12, 17, 1.0], [-14, 24, 13, 12, 1.0], [-28, 24, 7, 8, 0.9],
    // Middle East & Eurasia
    [26, 46, 10, 11, 0.95], [56, 62, 12, 30, 0.95], [60, 112, 11, 28, 0.85], [40, 68, 10, 18, 0.9],
    // India & South Asia
    [21, 79, 11, 8, 1.0],
    // East & Southeast Asia
    [35, 108, 12, 15, 1.0], [20, 104, 9, 9, 0.9], [36, 138, 6, 5, 0.9], [-2, 114, 5, 14, 0.75],
    // Australia
    [-25, 134, 10, 16, 1.0]
  ];

  const dots = [];
  for (let lat = -60; lat <= 74; lat += 4.8) {
    const lonStep = Math.max(4.8, 4.8 / Math.max(0.32, Math.cos((lat * Math.PI) / 180)));
    for (let lon = -180; lon < 180; lon += lonStep) {
      let inside = false;
      for (let i = 0; i < regions.length; i++) {
        const [clat, clon, rl, rn] = regions[i];
        const dLat = (lat - clat) / rl;
        const dLon = (lon - clon) / rn;
        if (dLat * dLat + dLon * dLon <= 1.0) {
          inside = true;
          break;
        }
      }
      if (inside) {
        const phi = ((90 - lat) * Math.PI) / 180;
        const theta = (lon * Math.PI) / 180;
        dots.push([
          Math.sin(phi) * Math.sin(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.cos(theta)
        ]);
      }
    }
  }
  return dots;
}

const CONTINENT_DOTS = buildContinentDots();

function llToUnit(lat, lon) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = (lon * Math.PI) / 180;
  return [
    Math.sin(phi) * Math.sin(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.cos(theta)
  ];
}

function createHolographicGlobe(canvas, opts) {
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const container = opts.container || canvas.parentElement;

  const hotspots = opts.hotspots || [
    { lat: 50.8, lon: 4.3,   color: '#00f5ff' },
    { lat: 50.4, lon: 30.5,  color: '#ff2244' },
    { lat: 38.9, lon: -77.0, color: '#00f5ff' },
    { lat: 1.35, lon: 103.8, color: '#ffd22e' },
    { lat: 24.4, lon: 119.5, color: '#ff6b00' },
    { lat: 12.6, lon: 43.3,  color: '#b366ff' },
    { lat: -23.5,lon: -46.6, color: '#00ff88' },
    { lat: 35.7, lon: 139.7, color: '#ff6b00' }
  ];

  const arcs = opts.arcs || [
    { a: 0, b: 2, color: '#00f5ff', speed: 0.28 },
    { a: 1, b: 5, color: '#ff2244', speed: 0.34 },
    { a: 3, b: 4, color: '#ffd22e', speed: 0.31 },
    { a: 0, b: 3, color: '#b366ff', speed: 0.22 },
    { a: 4, b: 7, color: '#ff6b00', speed: 0.38 },
    { a: 2, b: 6, color: '#00ff88', speed: 0.25 }
  ];

  // Precompute 3D unit vectors for hotspots and smooth geodesic arc polylines
  const hotspotVecs = hotspots.map((h) => ({ ...h, v: llToUnit(h.lat, h.lon) }));
  const arcCurves = arcs.map((arc, idx) => {
    const p0 = hotspotVecs[arc.a].v;
    const p1 = hotspotVecs[arc.b].v;
    const mx = (p0[0] + p1[0]) * 0.5;
    const my = (p0[1] + p1[1]) * 0.5;
    const mz = (p0[2] + p1[2]) * 0.5;
    const mLen = Math.hypot(mx, my, mz) || 1;
    const chord = Math.hypot(p0[0] - p1[0], p0[1] - p1[1], p0[2] - p1[2]);
    const lift = 1 + 0.16 + chord * 0.18;
    const cm = [(mx / mLen) * lift, (my / mLen) * lift, (mz / mLen) * lift];

    const pts = [];
    const steps = 28;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const omt = 1 - t;
      pts.push([
        omt * omt * p0[0] + 2 * omt * t * cm[0] + t * t * p1[0],
        omt * omt * p0[1] + 2 * omt * t * cm[1] + t * t * p1[1],
        omt * omt * p0[2] + 2 * omt * t * cm[2] + t * t * p1[2]
      ]);
    }
    return { ...arc, pts, offset: idx / arcs.length };
  });

  const orbits = opts.orbits || [
    { radius: 1.28, tiltX: 1.18, tiltZ: -0.34, speed: 0.62, color: '#00f5ff', ringAlpha: 0.30 },
    { radius: 1.38, tiltX: 1.02, tiltZ:  0.52, speed: -0.44, color: '#b366ff', ringAlpha: 0.24 },
    { radius: 1.21, tiltX: 1.30, tiltZ:  0.88, speed: 0.82, color: '#ff6b00', ringAlpha: 0.22 }
  ];

  let w = 0, h = 0, dpr = 1;
  let inView = true;
  let rafId = null;
  let rotY = opts.initialRotY || -0.3;
  let baseTiltX = opts.tiltX || 0.28;
  let hoverTargetX = 0, hoverTargetY = 0;
  let hoverX = 0, hoverY = 0;
  let lastNow = performance.now();
  let tSec = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = Math.max(100, Math.round(rect.width));
    h = Math.max(100, Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();

  // Desktop mouse-only interactive tilt (NEVER intercepts mobile touch scrolling!)
  if (container) {
    container.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || reduced) return;
      const r = container.getBoundingClientRect();
      hoverTargetX = ((e.clientX - r.left) / r.width - 0.5) * 0.45;
      hoverTargetY = ((e.clientY - r.top) / r.height - 0.5) * 0.35;
    }, { passive: true });
    container.addEventListener('pointerleave', () => {
      hoverTargetX = 0;
      hoverTargetY = 0;
    }, { passive: true });
  }

  function rotPoint(vx, vy, vz, ry, tx) {
    const cosY = Math.cos(ry), sinY = Math.sin(ry);
    const x1 = vx * cosY + vz * sinY;
    const z1 = -vx * sinY + vz * cosY;
    const cosX = Math.cos(tx), sinX = Math.sin(tx);
    const y2 = vy * cosX - z1 * sinX;
    const z2 = vy * sinX + z1 * cosX;
    return [x1, y2, z2];
  }

  function orbitPoint(angle, orb) {
    const x0 = Math.cos(angle) * orb.radius;
    const z0 = Math.sin(angle) * orb.radius;
    // Apply tiltX then tiltZ
    const cx = Math.cos(orb.tiltX), sx = Math.sin(orb.tiltX);
    const y1 = -z0 * sx;
    const z1 = z0 * cx;
    const cz = Math.cos(orb.tiltZ), sz = Math.sin(orb.tiltZ);
    return [
      x0 * cz - y1 * sz,
      x0 * sz + y1 * cz,
      z1
    ];
  }

  function drawOrbits(cx, cy, R, frontPass) {
    const steps = 64;
    for (let oi = 0; oi < orbits.length; oi++) {
      const orb = orbits[oi];
      ctx.beginPath();
      let drawing = false;
      for (let s = 0; s <= steps; s++) {
        const a = (s / steps) * Math.PI * 2;
        const [ox, oy, oz] = orbitPoint(a, orb);
        const isFront = oz >= 0;
        if (isFront === frontPass) {
          const sx = cx + ox * R;
          const sy = cy - oy * R;
          if (!drawing) { ctx.moveTo(sx, sy); drawing = true; }
          else ctx.lineTo(sx, sy);
        } else {
          drawing = false;
        }
      }
      ctx.strokeStyle = orb.color;
      ctx.globalAlpha = frontPass ? orb.ringAlpha : orb.ringAlpha * 0.42;
      ctx.lineWidth = frontPass ? 1.25 : 0.9;
      ctx.stroke();

      // Satellite & fading motion tail
      const satA = tSec * orb.speed + oi * 2.1;
      const [sx0, sy0, sz0] = orbitPoint(satA, orb);
      if ((sz0 >= 0) === frontPass) {
        // Motion trail
        ctx.beginPath();
        for (let k = 0; k < 10; k++) {
          const ta = satA - (orb.speed > 0 ? 1 : -1) * k * 0.045;
          const [tx, ty] = orbitPoint(ta, orb);
          if (k === 0) ctx.moveTo(cx + tx * R, cy - ty * R);
          else ctx.lineTo(cx + tx * R, cy - ty * R);
        }
        ctx.strokeStyle = orb.color;
        ctx.globalAlpha = frontPass ? 0.65 : 0.25;
        ctx.lineWidth = 2.0;
        ctx.stroke();

        // Glowing satellite core
        const px = cx + sx0 * R;
        const py = cy - sy0 * R;
        ctx.globalAlpha = frontPass ? 0.35 : 0.14;
        ctx.fillStyle = orb.color;
        ctx.beginPath();
        ctx.arc(px, py, frontPass ? 7.5 : 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = frontPass ? 1.0 : 0.45;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, frontPass ? 2.6 : 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function renderFrame() {
    ctx.clearRect(0, 0, w, h);

    const cx = w * (opts.centerXRatio || 0.5);
    const cy = h * (opts.centerYRatio || 0.5);
    const R = Math.min(w, h) * (opts.radiusRatio || 0.34);
    const curRotY = rotY + hoverX;
    const curTiltX = baseTiltX + hoverY;

    // 1. Soft atmospheric outer glow
    const outerGlow = ctx.createRadialGradient(cx, cy, R * 0.72, cx, cy, R * 1.48);
    outerGlow.addColorStop(0, 'rgba(0, 245, 255, 0.15)');
    outerGlow.addColorStop(0.55, 'rgba(0, 145, 255, 0.05)');
    outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.48, 0, Math.PI * 2);
    ctx.fill();

    // 2. Back pass of tilted 3D satellite orbits (strictly behind globe)
    drawOrbits(cx, cy, R, false);

    // 3. Holographic Earth sphere base
    const sphereGrad = ctx.createRadialGradient(
      cx - R * 0.32, cy - R * 0.32, R * 0.08,
      cx, cy, R
    );
    sphereGrad.addColorStop(0.0, 'rgba(26, 86, 130, 0.42)');
    sphereGrad.addColorStop(0.42, 'rgba(8, 26, 48, 0.90)');
    sphereGrad.addColorStop(0.84, 'rgba(4, 12, 26, 0.96)');
    sphereGrad.addColorStop(1.0, 'rgba(0, 245, 255, 0.24)');

    ctx.fillStyle = sphereGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();

    // 4. Clipped interior: graticules + sweeping scanner + continent dot-matrix
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();

    // Latitude & longitude holographic wireframe lines
    ctx.lineWidth = 0.75;
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      let started = false;
      for (let lon = -180; lon <= 180; lon += 10) {
        const u = llToUnit(lat, lon);
        const [rx, ry, rz] = rotPoint(u[0], u[1], u[2], curRotY, curTiltX);
        if (rz >= -0.08) {
          const sx = cx + rx * R;
          const sy = cy - ry * R;
          if (!started) { ctx.moveTo(sx, sy); started = true; }
          else ctx.lineTo(sx, sy);
        } else {
          started = false;
        }
      }
      ctx.strokeStyle = lat === 0 ? 'rgba(0, 245, 255, 0.22)' : 'rgba(0, 245, 255, 0.09)';
      ctx.stroke();
    }

    for (let lon = -180; lon < 180; lon += 30) {
      ctx.beginPath();
      let started = false;
      for (let lat = -84; lat <= 84; lat += 8) {
        const u = llToUnit(lat, lon);
        const [rx, ry, rz] = rotPoint(u[0], u[1], u[2], curRotY, curTiltX);
        if (rz >= -0.08) {
          const sx = cx + rx * R;
          const sy = cy - ry * R;
          if (!started) { ctx.moveTo(sx, sy); started = true; }
          else ctx.lineTo(sx, sy);
        } else {
          started = false;
        }
      }
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.09)';
      ctx.stroke();
    }

    // Subtle longitude orbital scan sweep
    const scanLon = ((tSec * 0.75) % (Math.PI * 2)) - Math.PI;
    const scanX = cx + Math.sin(scanLon) * R;
    const scanGrad = ctx.createLinearGradient(scanX - R * 0.28, cy, scanX + R * 0.06, cy);
    scanGrad.addColorStop(0, 'rgba(0, 245, 255, 0)');
    scanGrad.addColorStop(0.85, 'rgba(0, 245, 255, 0.14)');
    scanGrad.addColorStop(1, 'rgba(0, 245, 255, 0)');
    ctx.fillStyle = scanGrad;
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

    // 3D Continental Dot Matrix (rear dimmed + front crisp glowing cyan)
    for (let i = 0; i < CONTINENT_DOTS.length; i++) {
      const d = CONTINENT_DOTS[i];
      const [rx, ry, rz] = rotPoint(d[0], d[1], d[2], curRotY, curTiltX);
      const sx = cx + rx * R;
      const sy = cy - ry * R;
      if (rz >= 0) {
        const alpha = 0.28 + rz * 0.72;
        const sz = 1.05 + rz * 1.15;
        ctx.fillStyle = rz > 0.65 ? `rgba(175, 248, 255, ${alpha.toFixed(2)})` : `rgba(0, 245, 255, ${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, sz, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(0, 170, 220, 0.10)';
        ctx.fillRect(sx - 0.6, sy - 0.6, 1.2, 1.2);
      }
    }
    ctx.restore();

    // 5. Crisp Fresnel edge highlight
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.45)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    // 6. 3D Geodesic Data Arcs + Traveling Signal Comet Packets
    for (let ai = 0; ai < arcCurves.length; ai++) {
      const arc = arcCurves[ai];
      const proj = arc.pts.map((p) => rotPoint(p[0], p[1], p[2], curRotY, curTiltX));

      ctx.beginPath();
      let started = false;
      for (let s = 0; s < proj.length; s++) {
        const [px, py, pz] = proj[s];
        if (pz > -0.15) {
          const sx = cx + px * R;
          const sy = cy - py * R;
          if (!started) { ctx.moveTo(sx, sy); started = true; }
          else ctx.lineTo(sx, sy);
        } else {
          started = false;
        }
      }
      ctx.strokeStyle = arc.color;
      ctx.globalAlpha = 0.46;
      ctx.lineWidth = 1.35;
      ctx.stroke();

      // Traveling signal packet along arc (wrapped safely to [0, 1))
      const u = (((tSec * arc.speed + arc.offset) % 1) + 1) % 1;
      const idxF = u * (proj.length - 1);
      const i0 = Math.max(0, Math.min(proj.length - 1, Math.floor(idxF)));
      const i1 = Math.min(proj.length - 1, i0 + 1);
      const frac = idxF - i0;
      const px = proj[i0][0] + (proj[i1][0] - proj[i0][0]) * frac;
      const py = proj[i0][1] + (proj[i1][1] - proj[i0][1]) * frac;
      const pz = proj[i0][2] + (proj[i1][2] - proj[i0][2]) * frac;
      if (pz > -0.05) {
        const sx = cx + px * R;
        const sy = cy - py * R;
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = arc.color;
        ctx.beginPath();
        ctx.arc(sx, sy, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // 7. Pulsing 3D Surface Hotspots (Front Hemisphere)
    for (let hi = 0; hi < hotspotVecs.length; hi++) {
      const hs = hotspotVecs[hi];
      const [rx, ry, rz] = rotPoint(hs.v[0], hs.v[1], hs.v[2], curRotY, curTiltX);
      if (rz > 0.02) {
        const sx = cx + rx * R;
        const sy = cy - ry * R;
        const pulse = (tSec * 0.7 + hi * 0.23) % 1;

        ctx.strokeStyle = hs.color;
        ctx.globalAlpha = (1 - pulse) * 0.72 * Math.min(1, rz * 2.5);
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(sx, sy, 3 + pulse * 12, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 0.95 * Math.min(1, rz * 2.5);
        ctx.fillStyle = hs.color;
        ctx.beginPath();
        ctx.arc(sx, sy, 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(sx, sy, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // 8. Front pass of tilted 3D satellite orbits (cleanly IN FRONT of globe!)
    drawOrbits(cx, cy, R, true);
  }

  function loop(now) {
    if (!inView || document.hidden) {
      rafId = null;
      return;
    }
    rafId = requestAnimationFrame(loop);
    const dt = Math.max(0, Math.min((now - lastNow) * 0.001, 0.05));
    lastNow = now;
    tSec += dt;
    rotY += dt * (opts.spinSpeed || 0.22);

    const damp = 1 - Math.exp(-7 * dt);
    hoverX += (hoverTargetX - hoverX) * damp;
    hoverY += (hoverTargetY - hoverY) * damp;

    renderFrame();
  }

  function syncRunState() {
    if (reduced) {
      renderFrame();
      return;
    }
    if (inView && !document.hidden && !rafId) {
      lastNow = performance.now();
      rafId = requestAnimationFrame(loop);
    } else if ((!inView || document.hidden) && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  if (typeof IntersectionObserver !== 'undefined') {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        inView = e.isIntersecting;
        syncRunState();
      });
    }, { threshold: 0.02 });
    obs.observe(container || canvas);
  }
  document.addEventListener('visibilitychange', syncRunState);

  let rzTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(rzTimer);
    rzTimer = setTimeout(() => {
      resize();
      if (reduced) renderFrame();
    }, 120);
  });

  renderFrame();
  syncRunState();
  return { resize };
}

/* ── HERO SEQUENCE (LCP-SAFE, IDEMPOTENT, VIEWPORT-AWARE) ── */
let heroStarted = false;
let globeStarted = false;

function startHero() {
  if (heroStarted) return;
  heroStarted = true;

  const badge = document.getElementById('hbadge');
  if (badge) badge.style.opacity = '1';

  const curEl = document.getElementById('hero-cur');
  if (curEl) {
    setTimeout(() => {
      curEl.style.animation = 'none';
      curEl.style.opacity = '0';
    }, 900);
  }

  ['hero-p', 'hero-act', 'hero-sts'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }
  });
  countUpStats();
  startGlobe();
}
window.startHero = startHero;

document.addEventListener('DOMContentLoaded', () => {
  const heroSection = document.getElementById('hero-section');
  if (heroSection && typeof IntersectionObserver !== 'undefined') {
    const heroObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startHero();
          heroObs.disconnect();
        }
      });
    }, { threshold: 0.08 });
    heroObs.observe(heroSection);
  }

  // Initialize bottom CTA showcase holographic globe cleanly on DOM ready
  const ctaCanvas = document.getElementById('cta-globe-canvas');
  const ctaWrap = document.getElementById('cta-globe-wrap');
  if (ctaCanvas) {
    createHolographicGlobe(ctaCanvas, {
      container: ctaWrap,
      radiusRatio: 0.34,
      centerXRatio: 0.5,
      centerYRatio: 0.5,
      spinSpeed: 0.20,
      tiltX: 0.24,
      initialRotY: -0.7
    });
  }
});

/* ── STATS COUNT-UP ── */
function countUpStats() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  ['sn0', 'sn1', 'sn2'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const target = parseFloat(el.dataset.target);
    const dec = parseInt(el.dataset.dec, 10);
    const sfx = el.dataset.sfx;
    if (reduced) {
      el.textContent = (dec === 0 ? Math.round(target).toLocaleString('en-US') : target.toFixed(dec)) + sfx;
      return;
    }
    const dur = 1100;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const cur = target * ease;
      el.textContent = (dec === 0 ? Math.round(cur).toLocaleString('en-US') : cur.toFixed(dec)) + sfx;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

/* ── HERO LIVE GLOBE PREVIEW & FOREGROUND SIGNAL CALLOUT HUD ── */
function startGlobe() {
  if (globeStarted) return;
  globeStarted = true;

  const panel = document.getElementById('hero-panel');
  const wrap  = document.getElementById('hero-panel-wrap');
  const canvas = document.getElementById('hero-globe-canvas');
  const clockEl = document.getElementById('hp-clock');
  const countEl = document.getElementById('hp-sigcount');
  const calloutEl = document.getElementById('hp-live-callout');
  const typeEl = document.getElementById('hp-callout-type-text');
  const dotEl = document.getElementById('hp-callout-dot');
  const sevEl = document.getElementById('hp-callout-sev');
  const titleEl = document.getElementById('hp-callout-title');
  const metaEl = document.getElementById('hp-callout-meta');
  let sigCount = 482;
  let panelInView = true;

  if (!panel || !wrap) return;

  // Launch high-craft 3D holographic Earth canvas inside Hero Preview
  if (canvas) {
    createHolographicGlobe(canvas, {
      container: wrap,
      radiusRatio: 0.37,
      centerXRatio: 0.56,
      centerYRatio: 0.45,
      spinSpeed: 0.24,
      tiltX: 0.28,
      initialRotY: -0.2
    });
  }

  if (typeof IntersectionObserver !== 'undefined') {
    const panelObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { panelInView = e.isIntersecting; });
    }, { threshold: 0.05 });
    panelObs.observe(wrap);
  }

  // Live UTC Clock
  function padZ(n) { return String(n).padStart(2, '0'); }
  function tickClock() {
    if (!panelInView || document.hidden) return;
    if (clockEl) {
      const d = new Date();
      clockEl.textContent = `${padZ(d.getUTCHours())}:${padZ(d.getUTCMinutes())}:${padZ(d.getUTCSeconds())} UTC`;
    }
  }
  setInterval(tickClock, 1000);
  tickClock();

  // Live Signal Counter
  setInterval(() => {
    if (!panelInView || document.hidden) return;
    sigCount++;
    if (countEl) countEl.textContent = sigCount + ' SIGNALS';
  }, 3200);

  // Subtle desktop-only mouse card tilt (zero mobile touch-scroll blocking!)
  wrap.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = wrap.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 9;
    const y = ((e.clientY - r.top ) / r.height - 0.5) * -7;
    panel.style.transform = `rotateY(${x.toFixed(2)}deg) rotateX(${y.toFixed(2)}deg)`;
  }, { passive: true });
  wrap.addEventListener('pointerleave', () => {
    panel.style.transform = 'rotateY(0deg) rotateX(0deg)';
  }, { passive: true });

  // Crisp foreground cycling signal callout cards (ALWAYS above globe at z-index: 20)
  const liveSignals = [
    { type: 'AI GOVERNANCE',  sev: 'S4', title: 'EU AI Act Art. 73 incident compliance window active',       meta: 'Brussels, EU · Verified Primary Filing',   color: '#b366ff' },
    { type: 'INFRASTRUCTURE', sev: 'S3', title: '238 PeeringDB hyperscale data hubs indexed in DACH',        meta: 'Frankfurt, DE · Compute Layer',            color: '#00f5ff' },
    { type: 'OPERATIONS',     sev: 'S4', title: 'Maritime GNSS interference corridor flagged near Aden',     meta: 'Red Sea · Live Maritime Telemetry',        color: '#ffd22e' },
    { type: 'CONFLICT RISK',  sev: 'S5', title: 'Autonomous drone guidance escalations tracked in theatre',  meta: 'Eastern Europe · Admiralty B2 Verified',   color: '#ff2244' },
    { type: 'SUPPLY CHAIN',   sev: 'S3', title: 'Semiconductor export compliance update across APAC hubs',   meta: 'Taipei / Singapore · Trade Signal',        color: '#ff6b00' },
    { type: 'ASK SOVDASH AI', sev: 'AI', title: 'Citation-locked RAG query answered in 1.2s · 3 sources',   meta: '60+ Jurisdictions · Zero Hallucination',   color: '#00ff88' }
  ];

  let sigIdx = 0;
  function cycleCallout() {
    if (!calloutEl || !panelInView || document.hidden) return;
    const item = liveSignals[sigIdx % liveSignals.length];
    sigIdx++;
    calloutEl.classList.add('swapping');
    setTimeout(() => {
      if (typeEl) { typeEl.textContent = item.type; typeEl.style.color = item.color; }
      if (dotEl) { dotEl.style.background = item.color; dotEl.style.boxShadow = `0 0 8px ${item.color}`; }
      if (sevEl) {
        sevEl.textContent = item.sev;
        sevEl.style.color = item.color;
        sevEl.style.background = `${item.color}1c`;
        sevEl.style.border = `1px solid ${item.color}44`;
      }
      if (titleEl) titleEl.textContent = item.title;
      if (metaEl) metaEl.textContent = item.meta;
      calloutEl.style.borderColor = `${item.color}48`;
      calloutEl.classList.remove('swapping');
    }, 240);
  }
  setInterval(cycleCallout, 3600);
}

/* ── CATEGORIES SELECTOR FILTER ── */
document.addEventListener('DOMContentLoaded', () => {
  const pills = document.querySelectorAll('.cat-pill[data-cat]');
  const cards = document.querySelectorAll('.feature-card[data-cat]');

  const catColors = {
    telemetry:  '#ff2244',
    rag:        '#00f5ff',
    pipelines:  '#ff6b00',
    operations: '#ffd22e',
    compliance: '#00ff88',
    enterprise: '#b366ff',
    // Backward compatibility aliases
    conflict:     '#ff2244',
    surveillance: '#00f5ff',
    disaster:     '#ff6b00',
    economic:     '#ffd22e',
    humanitarian: '#00ff88',
    political:    '#b366ff'
  };

  let activePill = null;

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const cat = pill.dataset.cat;

      if (activePill === pill) {
        pills.forEach((p) => { p.classList.remove('pill-active'); p.style.removeProperty('--pill-color'); });
        cards.forEach((c) => { c.classList.remove('fc-highlight'); c.style.removeProperty('--fc-color'); });
        activePill = null;
        return;
      }

      pills.forEach((p) => { p.classList.remove('pill-active'); p.style.removeProperty('--pill-color'); });
      cards.forEach((c) => { c.classList.remove('fc-highlight'); c.style.removeProperty('--fc-color'); });

      pill.classList.add('pill-active');
      pill.style.setProperty('--pill-color', catColors[cat] || '#00f5ff');

      const match = document.querySelector(`.feature-card[data-cat="${cat}"]`);
      if (match) {
        match.classList.add('fc-highlight');
        match.style.setProperty('--fc-color', catColors[cat] || '#00f5ff');
        match.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      activePill = pill;
    });
  });
});

/* ── MAP LAYER INTERACTIVITY ── */
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.map-card');
  const infoBar  = document.getElementById('layer-info-bar');
  const infoName = document.getElementById('layer-info-name');
  const infoDesc = document.getElementById('layer-info-desc');
  const infoStatus = document.getElementById('layer-info-status');
  const previewPanel = document.getElementById('map-preview-panel');
  const previewImg   = document.getElementById('map-preview-img');
  const previewLabel = document.getElementById('map-preview-label');
  const previewBadge = document.getElementById('map-preview-badge');
  const previewDesc  = document.getElementById('map-preview-desc');
  const previewPH    = document.getElementById('map-preview-placeholder');

  if (!cards.length) return;

  let currentLit = 0;
  let selectedCard = null;
  let sectionInView = false;

  const mapSection = document.getElementById('how-it-works');
  if (mapSection && typeof IntersectionObserver !== 'undefined') {
    const mapObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { sectionInView = e.isIntersecting; });
    }, { threshold: 0.05 });
    mapObs.observe(mapSection);
  }

  cards.forEach((c) => c.style.setProperty('--card-color', c.dataset.color));

  function swapImage(src) {
    if (!previewImg) return;
    previewImg.style.opacity = '0';
    if (previewPH) previewPH.style.display = 'none';
    previewImg.style.display = 'block';
    setTimeout(() => {
      previewImg.src = src;
      previewImg.onload  = () => { previewImg.style.opacity = '1'; };
      previewImg.onerror = () => {
        previewImg.style.display = 'none';
        if (previewPH) previewPH.style.display = 'flex';
      };
    }, 180);
  }

  function activate(card, isAuto) {
    const color = card.dataset.color;
    const name  = card.dataset.name;
    const desc  = card.dataset.desc;

    if (infoBar) infoBar.style.borderColor = color + '44';
    if (infoName) { infoName.textContent = name; infoName.style.color = color; }
    if (infoDesc) infoDesc.textContent = desc;
    if (infoStatus) {
      infoStatus.textContent = isAuto ? '● ACTIVE' : '● SELECTED';
      infoStatus.style.color = isAuto ? '#00ff88' : color;
      infoStatus.style.borderColor = isAuto ? 'rgba(0,255,136,0.25)' : color + '44';
      infoStatus.style.background  = isAuto ? 'rgba(0,255,136,0.10)' : color + '18';
    }

    if (previewPanel) {
      previewPanel.style.borderColor = color + '44';
      previewPanel.style.boxShadow   = `0 0 48px ${color}12`;
    }
    if (previewLabel) { previewLabel.textContent = name; previewLabel.style.color = color; }
    if (previewBadge) {
      previewBadge.textContent = isAuto ? '● LIVE' : '● SELECTED';
      previewBadge.style.color = isAuto ? '#00ff88' : color;
      previewBadge.style.borderColor = isAuto ? 'rgba(0,255,136,0.25)' : color + '44';
      previewBadge.style.background  = isAuto ? 'rgba(0,255,136,0.10)' : color + '18';
    }
    if (previewDesc) previewDesc.textContent = desc;

    swapImage(card.dataset.img);
  }

  function lightCard(index) {
    cards.forEach((c) => { if (!c.classList.contains('selected')) c.classList.remove('lit'); });
    const card = cards[index];
    if (card && !card.classList.contains('selected')) {
      card.classList.add('lit');
      activate(card, true);
    }
  }

  lightCard(0);

  setInterval(() => {
    if (!selectedCard && sectionInView && !document.hidden) {
      currentLit = (currentLit + 1) % cards.length;
      lightCard(currentLit);
    }
  }, 2400);

  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (selectedCard === card) {
        card.classList.remove('selected');
        selectedCard = null;
        lightCard(currentLit);
      } else {
        if (selectedCard) selectedCard.classList.remove('selected');
        cards.forEach((c) => c.classList.remove('lit'));
        card.classList.add('selected');
        selectedCard = card;
        currentLit = i;
        activate(card, false);
      }
    });
  });
});
