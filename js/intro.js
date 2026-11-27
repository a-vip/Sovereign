/* ─── SOVEREIGN 3D SCROLL INTRODUCTION SYSTEM (STRIPE/APPLE-GRADE ZERO-WEBGL 60FPS HOLOGRAPHIC ENGINE) ─── */
/* Real Natural-Earth 3D Continents + Perspective Projection + Floating Orbital Target Callouts + Liquid RGB Morph */
let introInitialized = false;
let isPaused = false;
let isInViewport = true;
let startHeroTriggered = false;

const DEG2RAD = Math.PI / 180;

const GEO_COORDINATES = {
  kyiv:       { lat: 50.45,  lon: 30.52,   color: '#ff2244', sector: 'conflict',   short: 'KYIV',       tag: 'ACTIVE RISK' },
  suez:       { lat: 29.97,  lon: 32.53,   color: '#ff6b00', sector: 'conflict',   short: 'RED SEA',    tag: 'MARITIME' },
  sahel:      { lat: 15.00,  lon: 10.00,   color: '#ff2244', sector: 'conflict',   short: 'SAHEL',      tag: 'TELEMETRY' },
  brussels:   { lat: 50.85,  lon: 4.35,    color: '#00f5ff', sector: 'regulation', short: 'BRUSSELS',   tag: 'EU AI ACT' },
  taiwan:     { lat: 24.40,  lon: 119.50,  color: '#ffd22e', sector: 'regulation', short: 'TAIWAN',     tag: 'COMPUTE HUB' },
  malacca:    { lat: 1.35,   lon: 103.80,  color: '#ff6b00', sector: 'regulation', short: 'SINGAPORE',  tag: 'APAC RULES' },
  washington: { lat: 38.90,  lon: -77.04,  color: '#00f5ff', sector: 'global',     short: 'WASHINGTON', tag: 'POLICY FEED' },
  frankfurt:  { lat: 50.11,  lon: 8.68,    color: '#b366ff', sector: 'enterprise', short: 'FRANKFURT',  tag: 'DATA HUB' }
};

// Equal 23% scroll chapters across 0.00 -> 0.92, followed by smooth 0.92 -> 1.00 hero dissolve
const CHAPTERS = [
  {
    id: 0, start: 0.00, end: 0.23,
    accentHex: '#00f5ff', rgb: [0, 245, 255],
    hudSector: 'GLOBAL PLANETARY SCAN',
    alt: '6,420 KM',
    focusSectors: ['global', 'conflict', 'regulation', 'enterprise'],
    calloutKeys: ['washington', 'brussels', 'frankfurt']
  },
  {
    id: 1, start: 0.23, end: 0.46,
    accentHex: '#ff2244', rgb: [255, 34, 68],
    hudSector: 'LIVE OPERATIONS & RISK LOCK',
    alt: '1,840 KM',
    focusSectors: ['conflict'],
    calloutKeys: ['kyiv', 'suez', 'sahel']
  },
  {
    id: 2, start: 0.46, end: 0.69,
    accentHex: '#ff6b00', rgb: [255, 132, 24],
    hudSector: 'COMPLIANCE & AI SEARCH',
    alt: '1,590 KM',
    focusSectors: ['regulation'],
    calloutKeys: ['taiwan', 'malacca', 'brussels']
  },
  {
    id: 3, start: 0.69, end: 0.92,
    accentHex: '#b366ff', rgb: [179, 102, 255],
    hudSector: 'LIVE DASHBOARD & PRIVATE AI',
    alt: '3,120 KM',
    focusSectors: ['global', 'conflict', 'regulation', 'enterprise'],
    calloutKeys: ['frankfurt', 'brussels', 'kyiv']
  }
];

function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }
function lerp(a, b, t) { return a + (b - a) * t; }
function smoothstep(e0, e1, x) {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

function llToSphereUnit(lat, lon) {
  const phi = lat * DEG2RAD;
  const lam = lon * DEG2RAD;
  const cp = Math.cos(phi);
  return [cp * Math.sin(lam), Math.sin(phi), cp * Math.cos(lam)];
}

// Precompute 3D unit-vector landmass rings with bounding cones from SOV_WORLD_RINGS (zero trig per frame!)
function prepareWorldRings() {
  const raw = (typeof window !== 'undefined' && Array.isArray(window.SOV_WORLD_RINGS)) ? window.SOV_WORLD_RINGS : [];
  const prepared = [];
  for (let r = 0; r < raw.length; r++) {
    const flat = raw[r];
    if (!flat || flat.length < 6) continue;
    const pts = [];
    let cx = 0, cy = 0, cz = 0;
    for (let i = 0; i < flat.length; i += 2) {
      const lon = flat[i] * 0.1;
      const lat = flat[i + 1] * 0.1;
      const u = llToSphereUnit(lat, lon);
      pts.push(u);
      cx += u[0]; cy += u[1]; cz += u[2];
    }
    const cLen = Math.hypot(cx, cy, cz) || 1;
    const center = [cx / cLen, cy / cLen, cz / cLen];
    let minDot = 1;
    for (let i = 0; i < pts.length; i++) {
      const d = pts[i][0] * center[0] + pts[i][1] * center[1] + pts[i][2] * center[2];
      if (d < minDot) minDot = d;
    }
    const sinRadius = Math.sqrt(Math.max(0, 1 - minDot * minDot));
    prepared.push({ pts, center, sinRadius });
  }
  return prepared;
}

// Precompute dense Stripe-style Fibonacci holographic constellation shell
function buildFibonacciShell(count) {
  const pts = [];
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const rY = Math.sqrt(Math.max(0, 1 - y * y));
    const th = 2.39996323 * i;
    pts.push([Math.cos(th) * rY, y, Math.sin(th) * rY, (i * 0.6180339) % 1]);
  }
  return pts;
}

function evalKeyframes(p, keyframes) {
  if (p <= keyframes[0].p) return keyframes[0];
  const last = keyframes[keyframes.length - 1];
  if (p >= last.p) return last;
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (p >= a.p && p <= b.p) {
      const raw = (p - a.p) / (b.p - a.p);
      const t = a.linear ? raw : raw * raw * (3 - 2 * raw);
      return {
        lon:     lerp(a.lon,     b.lon,     t),
        lat:     lerp(a.lat,     b.lat,     t),
        scale:   lerp(a.scale,   b.scale,   t),
        cxRatio: lerp(a.cxRatio, b.cxRatio, t),
        cyRatio: lerp(a.cyRatio, b.cyRatio, t),
        opacity: lerp(a.opacity, b.opacity, t)
      };
    }
  }
  return last;
}

// Pre-render multi-layered atmospheric glow & spherical Fresnel core sprites per chapter
function buildChapterSprites(rgb) {
  const [r, g, b] = rgb;
  const corona = document.createElement('canvas');
  corona.width = 200;
  corona.height = 200;
  const cCtx = corona.getContext('2d');
  const cg = cCtx.createRadialGradient(100, 100, 44, 100, 100, 100);
  cg.addColorStop(0.00, `rgba(${r},${g},${b},0.26)`);
  cg.addColorStop(0.45, `rgba(${r},${g},${b},0.10)`);
  cg.addColorStop(0.76, `rgba(${r},${g},${b},0.025)`);
  cg.addColorStop(1.00, 'rgba(3,5,11,0)');
  cCtx.fillStyle = cg;
  cCtx.fillRect(0, 0, 200, 200);

  const sphere = document.createElement('canvas');
  sphere.width = 320;
  sphere.height = 320;
  const sCtx = sphere.getContext('2d');
  // Deep illuminated oceanic sphere with upper-left specular keylight & bright Fresnel edge
  const sg = sCtx.createRadialGradient(112, 108, 14, 160, 160, 154);
  sg.addColorStop(0.00, `rgba(${Math.round(r * 0.22 + 20)},${Math.round(g * 0.24 + 40)},${Math.round(b * 0.28 + 68)},0.95)`);
  sg.addColorStop(0.46, 'rgba(7, 19, 38, 0.96)');
  sg.addColorStop(0.84, 'rgba(3, 9, 21, 0.98)');
  sg.addColorStop(0.95, `rgba(${r},${g},${b},0.28)`);
  sg.addColorStop(1.00, `rgba(${r},${g},${b},0.65)`);
  sCtx.fillStyle = sg;
  sCtx.beginPath();
  sCtx.arc(160, 160, 154, 0, Math.PI * 2);
  sCtx.fill();

  // Subtle double-hairline orbital limb glow
  sCtx.strokeStyle = `rgba(${r},${g},${b},0.72)`;
  sCtx.lineWidth = 1.8;
  sCtx.stroke();

  return { corona, sphere };
}

function startIntro() {
  if (introInitialized) return;
  introInitialized = true;

  const scrollContainer = document.getElementById('intro-scroll-container');
  const container       = document.getElementById('intro-canvas-container');
  const slides          = Array.from(document.querySelectorAll('.intro-slide'));
  const dwellFills      = slides.map((s) => s.querySelector('.slide-dwell-fill'));
  const chapterPills    = Array.from(document.querySelectorAll('.intro-chapter-pill'));
  const pillFills       = chapterPills.map((p) => p.querySelector('.intro-chapter-fill'));
  const globalHeader    = document.getElementById('global-header');
  const hudReadout      = document.getElementById('intro-telemetry-readout');
  const hudDot          = document.getElementById('intro-brand-dot');
  const hudScrollLabel  = document.getElementById('intro-scroll-label');
  const hudBottom       = document.getElementById('intro-hud-bottom');
  const globalFill      = document.getElementById('intro-global-progress-fill');
  const skipBtn         = document.getElementById('intro-skip-btn');

  if (!scrollContainer || !container) {
    if (globalHeader) globalHeader.classList.remove('intro-hidden');
    if (typeof startHero === 'function') startHero();
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let mobileMode = window.innerWidth <= 900;

  function jumpToHero() {
    if (globalHeader) globalHeader.classList.remove('intro-hidden');
    if (!startHeroTriggered) {
      startHeroTriggered = true;
      if (typeof startHero === 'function') startHero();
    }
    const heroEl = document.getElementById('hero-section');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }
  if (skipBtn) skipBtn.addEventListener('click', jumpToHero);
  window.skipSovereignIntro = jumpToHero;

  // ─── 1. HIGH-CRAFT ZERO-WEBGL 3D HOLOGRAPHIC PLANET ENGINE ───
  container.innerHTML = '';
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'width:100%;height:100%;display:block;';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d', { alpha: true });

  const isLowCore = typeof navigator !== 'undefined' && typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
  let maxDpr = isLowCore ? 1.15 : 1.5;
  let qualityTier = isLowCore ? 0 : 1; // adaptive governor can drop 1 -> 0 if frame times spike

  let viewW = window.innerWidth || 1280;
  let viewH = window.innerHeight || 800;
  let dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

  function sizeCanvas() {
    viewW = window.innerWidth || 1280;
    viewH = window.innerHeight || 800;
    dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    canvas.width = Math.max(1, Math.round(viewW * dpr));
    canvas.height = Math.max(1, Math.round(viewH * dpr));
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  sizeCanvas();

  const worldRings = prepareWorldRings();
  const shellDots = buildFibonacciShell(mobileMode ? 320 : 620);
  const chapterSprites = CHAPTERS.map((ch) => buildChapterSprites(ch.rgb));

  // Two-layer parallax deep-space starfield
  const farStars = [];
  const nearStars = [];
  let starSeed = 1337;
  const sRand = () => { starSeed = (starSeed * 16807) % 2147483647; return (starSeed - 1) / 2147483646; };
  const fCount = mobileMode ? 45 : 85;
  const nCount = mobileMode ? 18 : 34;
  for (let i = 0; i < fCount; i++) farStars.push({ x: sRand(), y: sRand(), r: 0.8 + sRand() * 0.7 });
  for (let i = 0; i < nCount; i++) nearStars.push({ x: sRand(), y: sRand(), r: 1.3 + sRand() * 0.9, p: sRand() * 6.28 });

  // Precompute 3D coordinate beacons
  const beacons = Object.keys(GEO_COORDINATES).map((key, idx) => {
    const c = GEO_COORDINATES[key];
    return {
      key,
      color: c.color,
      sector: c.sector,
      short: c.short,
      tag: c.tag,
      base: llToSphereUnit(c.lat, c.lon),
      phase: idx * 0.41
    };
  });

  // 7 curved 3D geodesic data corridors with glowing comet signal trails
  const arcPairs = [
    { from: GEO_COORDINATES.kyiv,       to: GEO_COORDINATES.suez,       lift: 0.22, color: '#ff2244', speed: 0.24 },
    { from: GEO_COORDINATES.taiwan,     to: GEO_COORDINATES.malacca,    lift: 0.23, color: '#ffd22e', speed: 0.26 },
    { from: GEO_COORDINATES.brussels,   to: GEO_COORDINATES.sahel,      lift: 0.26, color: '#b366ff', speed: 0.20 },
    { from: GEO_COORDINATES.kyiv,       to: GEO_COORDINATES.brussels,   lift: 0.16, color: '#00ff88', speed: 0.29 },
    { from: GEO_COORDINATES.washington, to: GEO_COORDINATES.brussels,   lift: 0.28, color: '#00f5ff', speed: 0.19 },
    { from: GEO_COORDINATES.frankfurt,  to: GEO_COORDINATES.malacca,    lift: 0.30, color: '#ff6b00', speed: 0.17 },
    { from: GEO_COORDINATES.washington, to: GEO_COORDINATES.frankfurt,  lift: 0.24, color: '#38bdf8', speed: 0.22 }
  ];

  const arcs = arcPairs.map((pair, idx) => {
    const p0 = llToSphereUnit(pair.from.lat, pair.from.lon);
    const p1 = llToSphereUnit(pair.to.lat, pair.to.lon);
    const mx = (p0[0] + p1[0]) * 0.5;
    const my = (p0[1] + p1[1]) * 0.5;
    const mz = (p0[2] + p1[2]) * 0.5;
    const mLen = Math.hypot(mx, my, mz) || 1;
    const chord = Math.hypot(p0[0] - p1[0], p0[1] - p1[1], p0[2] - p1[2]);
    const h = 1 + 0.14 + chord * pair.lift;
    const cm = [(mx / mLen) * h, (my / mLen) * h, (mz / mLen) * h];
    const pts = [];
    const steps = 24;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const omt = 1 - t;
      pts.push([
        omt * omt * p0[0] + 2 * omt * t * cm[0] + t * t * p1[0],
        omt * omt * p0[1] + 2 * omt * t * cm[1] + t * t * p1[1],
        omt * omt * p0[2] + 2 * omt * t * cm[2] + t * t * p1[2]
      ]);
    }
    return { pts, color: pair.color, speed: pair.speed, offset: idx / arcPairs.length };
  });

  // Twin tilted 3D satellite orbits + outer dashed telemetry compass ring
  const orbits = [
    { radius: 1.28, tiltX: 1.18, tiltZ: -0.34, speed:  0.46, ringAlpha: 0.28, useAccent: true,  dashed: false },
    { radius: 1.41, tiltX: 0.98, tiltZ:  0.54, speed: -0.33, ringAlpha: 0.22, useAccent: false, color: '#b366ff', dashed: false },
    { radius: 1.19, tiltX: 1.40, tiltZ:  0.96, speed:  0.58, ringAlpha: 0.14, useAccent: true,  dashed: true }
  ].map((orb) => {
    const ringPts = [];
    const steps = 56;
    const cx = Math.cos(orb.tiltX), sx = Math.sin(orb.tiltX);
    const cz = Math.cos(orb.tiltZ), sz = Math.sin(orb.tiltZ);
    for (let s = 0; s <= steps; s++) {
      const a = (s / steps) * Math.PI * 2;
      const x0 = Math.cos(a) * orb.radius;
      const z0 = Math.sin(a) * orb.radius;
      const y1 = -z0 * sx;
      const z1 = z0 * cx;
      ringPts.push([x0 * cz - y1 * sz, x0 * sz + y1 * cz, z1]);
    }
    return { ...orb, ringPts, cx, sx, cz, sz };
  });

  // ─── 2. CINEMATIC CAMERA KEYFRAMES (DESKTOP & MOBILE) ───
  function buildKeyframes(isMob) {
    return [
      { p: 0.00,  lon: -16,  lat: 22, scale: isMob ? 0.34 : 0.42, cxRatio: isMob ? 0.50 : 0.65, cyRatio: isMob ? 0.30 : 0.51, opacity: 1 },
      { p: 0.23,  lon:  14,  lat: 30, scale: isMob ? 0.38 : 0.47, cxRatio: isMob ? 0.50 : 0.66, cyRatio: isMob ? 0.30 : 0.50, opacity: 1 },
      { p: 0.345, lon:  30,  lat: 38, scale: isMob ? 0.42 : 0.54, cxRatio: isMob ? 0.50 : 0.68, cyRatio: isMob ? 0.30 : 0.52, opacity: 1, linear: true },
      { p: 0.46,  lon:  42,  lat: 32, scale: isMob ? 0.43 : 0.55, cxRatio: isMob ? 0.50 : 0.68, cyRatio: isMob ? 0.30 : 0.51, opacity: 1 },
      { p: 0.575, lon: 106,  lat: 18, scale: isMob ? 0.42 : 0.53, cxRatio: isMob ? 0.50 : 0.68, cyRatio: isMob ? 0.31 : 0.50, opacity: 1, linear: true },
      { p: 0.69,  lon:  90,  lat: 24, scale: isMob ? 0.40 : 0.51, cxRatio: isMob ? 0.50 : 0.67, cyRatio: isMob ? 0.31 : 0.50, opacity: 1 },
      { p: 0.92,  lon:  12,  lat: 28, scale: isMob ? 0.37 : 0.48, cxRatio: isMob ? 0.50 : 0.66, cyRatio: isMob ? 0.31 : 0.50, opacity: 1 },
      { p: 1.00,  lon:  -6,  lat: 22, scale: isMob ? 0.40 : 0.51, cxRatio: isMob ? 0.50 : 0.66, cyRatio: isMob ? 0.32 : 0.50, opacity: 0 }
    ];
  }
  let keyframes = buildKeyframes(mobileMode);

  // ─── 3. PASSIVE SCROLL TRACKING ───
  let scrollTopOffset = 0;
  let maxScrollDist = 1;
  let targetProgress = 0;
  let smoothProgress = 0;

  function measureScrollMetrics() {
    mobileMode = window.innerWidth <= 900;
    keyframes = buildKeyframes(mobileMode);
    const rect = scrollContainer.getBoundingClientRect();
    scrollTopOffset = Math.max(0, rect.top + window.scrollY);
    maxScrollDist = Math.max(1, scrollContainer.offsetHeight - window.innerHeight);
    updateTargetProgress();
  }

  function updateTargetProgress() {
    targetProgress = clamp01((window.scrollY - scrollTopOffset) / maxScrollDist);
  }

  measureScrollMetrics();
  smoothProgress = targetProgress;
  window.addEventListener('scroll', updateTargetProgress, { passive: true });

  // Desktop mouse parallax (zero touch interference)
  const pointer = { targetLon: 0, targetLat: 0, curLon: 0, curLat: 0, nx: 0, ny: 0 };
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !isInViewport || prefersReducedMotion) return;
    pointer.nx = (e.clientX / viewW) - 0.5;
    pointer.ny = (e.clientY / viewH) - 0.5;
    pointer.targetLon = pointer.nx * 15;
    pointer.targetLat = pointer.ny * 9;
  }, { passive: true });

  // ─── 4. CACHED ZERO-LAYOUT-THRASH UI SYNC ───
  let lastChapterIdx = -1;
  let lastHeaderHidden = null;
  let lastScrollMode = -1;
  let lastCanvasOp = -1;
  let lastHudBottomOp = -1;
  let activeChapterIdx = 0;
  const curRgb = [0, 245, 255];
  let targetRgb = CHAPTERS[0].rgb;

  function syncChapterDOM(progress) {
    let curIdx = 0;
    for (let i = 0; i < CHAPTERS.length; i++) {
      if (progress >= CHAPTERS[i].start) curIdx = i;
    }
    activeChapterIdx = curIdx;

    if (curIdx !== lastChapterIdx) {
      lastChapterIdx = curIdx;
      const curChapter = CHAPTERS[curIdx];
      targetRgb = curChapter.rgb;

      if (hudDot) {
        hudDot.style.background = curChapter.accentHex;
        hudDot.style.boxShadow = `0 0 10px ${curChapter.accentHex}`;
      }
      if (hudReadout) {
        hudReadout.textContent = `0${curIdx + 1}/04 · ${curChapter.hudSector} · ALT ${curChapter.alt}`;
      }
      chapterPills.forEach((pill, i) => {
        const isActive = i === curIdx;
        pill.classList.toggle('active', isActive);
        pill.setAttribute('aria-current', isActive ? 'step' : 'false');
      });
    }

    const scrollMode = progress > 0.88 ? 10 : curIdx;
    if (scrollMode !== lastScrollMode && hudScrollLabel) {
      lastScrollMode = scrollMode;
      hudScrollLabel.textContent = scrollMode === 10
        ? 'ENTERING SOVEREIGN DASHBOARD ↓'
        : `SCROLL TO EXPLORE · LAYER 0${curIdx + 1} / 04 ↓`;
    }

    if (globalFill) {
      globalFill.style.transform = `scaleX(${clamp01(progress / 0.94).toFixed(4)})`;
    }

    const bottomOp = Number((1 - smoothstep(0.90, 0.97, progress)).toFixed(2));
    if (hudBottom && bottomOp !== lastHudBottomOp) {
      lastHudBottomOp = bottomOp;
      hudBottom.style.opacity = String(bottomOp);
    }

    for (let idx = 0; idx < slides.length; idx++) {
      const slide = slides[idx];
      const ch = CHAPTERS[idx];
      const local = (progress - ch.start) / (ch.end - ch.start);

      let opacity = 0;
      let yShift = 22;
      if (local >= -0.05 && local <= 1.05) {
        const enter = idx === 0 ? 1 : smoothstep(-0.04, 0.10, local);
        const exit  = 1 - smoothstep(0.90, 1.04, local);
        opacity = Math.min(enter, exit);
        if (local < 0.10 && idx !== 0) {
          yShift = (1 - enter) * 20;
        } else if (local > 0.90) {
          yShift = -smoothstep(0.90, 1.04, local) * 18;
        } else {
          yShift = 3 - clamp01(local) * 6;
        }
      }

      slide.style.opacity = opacity.toFixed(3);
      slide.style.transform = `translate3d(0, ${yShift.toFixed(1)}px, 0)`;
      const shouldBeActive = opacity > 0.45;
      if (slide.classList.contains('active') !== shouldBeActive) {
        slide.classList.toggle('active', shouldBeActive);
      }

      const clampedLocal = clamp01(local).toFixed(4);
      if (dwellFills[idx]) dwellFills[idx].style.transform = `scaleX(${clampedLocal})`;
      if (pillFills[idx]) {
        pillFills[idx].style.transform = mobileMode ? `scaleX(${clampedLocal})` : `scaleY(${clampedLocal})`;
      }
    }

    const shouldHideHeader = !prefersReducedMotion && progress < 0.92;
    if (globalHeader && shouldHideHeader !== lastHeaderHidden) {
      lastHeaderHidden = shouldHideHeader;
      globalHeader.classList.toggle('intro-hidden', shouldHideHeader);
    }

    if (progress >= 0.91 && !startHeroTriggered) {
      startHeroTriggered = true;
      if (typeof startHero === 'function') startHero();
    }
  }

  // ─── 5. ULTRA-CRAFT 3D PERSPECTIVE + NATURAL-EARTH HOLOGRAPHIC RENDERER ───
  function orbitSatPoint(angle, orb) {
    const x0 = Math.cos(angle) * orb.radius;
    const z0 = Math.sin(angle) * orb.radius;
    const y1 = -z0 * orb.sx;
    const z1 = z0 * orb.cx;
    return [x0 * orb.cz - y1 * orb.sz, x0 * orb.sz + y1 * orb.cz, z1];
  }

  function renderPlanet(kf, tSec) {
    if (!ctx) return;
    ctx.clearRect(0, 0, viewW, viewH);

    const ch = CHAPTERS[activeChapterIdx] || CHAPTERS[0];
    const rCol = Math.round(curRgb[0]);
    const gCol = Math.round(curRgb[1]);
    const bCol = Math.round(curRgb[2]);
    const accentCss = `rgb(${rCol},${gCol},${bCol})`;

    // Liquid chapter sprite crossfade
    const progChapter = clamp01(smoothProgress / 0.92) * 3;
    const baseSpriteIdx = Math.min(3, Math.floor(progChapter));
    const nextSpriteIdx = Math.min(3, baseSpriteIdx + 1);
    const blendAlpha = progChapter - baseSpriteIdx;

    const cx = viewW * kf.cxRatio;
    const cy = viewH * kf.cyRatio;
    const R = Math.min(viewW, viewH) * kf.scale;

    const lonDeg = kf.lon + pointer.curLon + Math.sin(tSec * 0.24) * 2.4;
    const latDeg = kf.lat + pointer.curLat;
    const lam0 = lonDeg * DEG2RAD;
    const phi0 = latDeg * DEG2RAD;
    const sinL0 = Math.sin(lam0), cosL0 = Math.cos(lam0);
    const sinP0 = Math.sin(phi0), cosP0 = Math.cos(phi0);

    // Camera forward vector in Earth coords (for fast bounding-cone culling)
    const vx0 = cosP0 * sinL0;
    const vy0 = sinP0;
    const vz0 = cosP0 * cosL0;

    // Gentle 3D perspective factor for orbiting arcs, pins & satellites
    const perspK = 4.2;
    const projPersp = (x1, y2, z2) => {
      const f = perspK / (perspK - z2);
      return [cx + x1 * R * f, cy - y2 * R * f, f];
    };

    // 1. Two-layer parallax deep-space starfield
    const parFarX = -pointer.nx * 14;
    const parFarY = -pointer.ny * 10 - smoothProgress * 28;
    ctx.fillStyle = 'rgba(203, 213, 225, 0.28)';
    for (let i = 0; i < farStars.length; i++) {
      const st = farStars[i];
      const sx = ((st.x * viewW + parFarX) % viewW + viewW) % viewW;
      const sy = ((st.y * viewH + parFarY) % viewH + viewH) % viewH;
      ctx.fillRect(sx, sy, st.r, st.r);
    }

    const parNearX = -pointer.nx * 30;
    const parNearY = -pointer.ny * 20 - smoothProgress * 56;
    ctx.fillStyle = `rgba(${Math.round(rCol * 0.4 + 150)},${Math.round(gCol * 0.4 + 150)},${Math.round(bCol * 0.4 + 150)},0.48)`;
    for (let i = 0; i < nearStars.length; i++) {
      const st = nearStars[i];
      const sx = ((st.x * viewW + parNearX) % viewW + viewW) % viewW;
      const sy = ((st.y * viewH + parNearY) % viewH + viewH) % viewH;
      ctx.fillRect(sx, sy, st.r, st.r);
    }

    // 2. Liquid crossfaded volumetric outer corona halo
    const coronaR = R * 1.56;
    ctx.globalAlpha = 1 - blendAlpha;
    ctx.drawImage(chapterSprites[baseSpriteIdx].corona, cx - coronaR, cy - coronaR, coronaR * 2, coronaR * 2);
    if (blendAlpha > 0.01 && nextSpriteIdx !== baseSpriteIdx) {
      ctx.globalAlpha = blendAlpha;
      ctx.drawImage(chapterSprites[nextSpriteIdx].corona, cx - coronaR, cy - coronaR, coronaR * 2, coronaR * 2);
    }
    ctx.globalAlpha = 1;

    // 3. Precision outer tactical azimuth ring (rotating hairline dial around the globe)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(tSec * 0.06 + smoothProgress * 1.2);
    ctx.strokeStyle = `rgba(${rCol},${gCol},${bCol},0.12)`;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 10, 22, 10]);
    ctx.beginPath();
    ctx.arc(0, 0, R * 1.11, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Helper for back/front 3D perspective tilted satellite orbits
    const drawOrbits = (frontPass) => {
      for (let oi = 0; oi < orbits.length; oi++) {
        const orb = orbits[oi];
        const col = orb.useAccent ? accentCss : orb.color;
        const pts = orb.ringPts;
        ctx.save();
        if (orb.dashed) ctx.setLineDash([3, 7]);
        ctx.beginPath();
        let pen = false;
        for (let s = 0; s < pts.length; s++) {
          const p = pts[s];
          if ((p[2] >= 0) === frontPass) {
            const [sx, sy] = projPersp(p[0], p[1], p[2]);
            if (!pen) { ctx.moveTo(sx, sy); pen = true; }
            else ctx.lineTo(sx, sy);
          } else {
            pen = false;
          }
        }
        ctx.strokeStyle = col;
        ctx.globalAlpha = frontPass ? orb.ringAlpha : orb.ringAlpha * 0.34;
        ctx.lineWidth = frontPass ? 1.25 : 0.85;
        ctx.stroke();
        ctx.restore();

        if (orb.dashed) continue;

        const satA = tSec * orb.speed + oi * 1.7;
        const [sx0, sy0, sz0] = orbitSatPoint(satA, orb);
        if ((sz0 >= 0) === frontPass) {
          ctx.beginPath();
          for (let k = 0; k < 8; k++) {
            const ta = satA - (orb.speed > 0 ? 1 : -1) * k * 0.052;
            const [tx, ty, tz] = orbitSatPoint(ta, orb);
            const [psx, psy] = projPersp(tx, ty, tz);
            if (k === 0) ctx.moveTo(psx, psy);
            else ctx.lineTo(psx, psy);
          }
          ctx.strokeStyle = col;
          ctx.globalAlpha = frontPass ? 0.65 : 0.22;
          ctx.lineWidth = 2.1;
          ctx.stroke();

          const [px, py, pf] = projPersp(sx0, sy0, sz0);
          ctx.globalAlpha = frontPass ? 0.36 : 0.14;
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(px, py, (frontPass ? 8 : 4.6) * pf, 0, Math.PI * 2);
          ctx.fill();

          ctx.globalAlpha = frontPass ? 1.0 : 0.45;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(px, py, (frontPass ? 2.7 : 1.8) * pf, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    // Back pass of tilted 3D orbits
    drawOrbits(false);

    // 4. Liquid crossfaded 3D illuminated Earth sphere base
    const sphDrawR = R * (160 / 154);
    ctx.globalAlpha = 1 - blendAlpha;
    ctx.drawImage(chapterSprites[baseSpriteIdx].sphere, cx - sphDrawR, cy - sphDrawR, sphDrawR * 2, sphDrawR * 2);
    if (blendAlpha > 0.01 && nextSpriteIdx !== baseSpriteIdx) {
      ctx.globalAlpha = blendAlpha;
      ctx.drawImage(chapterSprites[nextSpriteIdx].sphere, cx - sphDrawR, cy - sphDrawR, sphDrawR * 2, sphDrawR * 2);
    }
    ctx.globalAlpha = 1;

    // 5. Clipped interior: Real Natural-Earth 3D Continents + Wireframe Graticule + Pole-to-Pole Radar Scan + Fibonacci Shimmer
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();

    // 5A. Spherical Latitude / Longitude Wireframe Mesh (single batched stroke!)
    ctx.beginPath();
    for (let lat = -60; lat <= 60; lat += 30) {
      const phi = lat * DEG2RAD;
      const cp = Math.cos(phi), sp = Math.sin(phi);
      let pen = false;
      for (let lon = -180; lon <= 180; lon += 12) {
        const dl = (lon - lonDeg) * DEG2RAD;
        const x1 = cp * Math.sin(dl);
        const y2 = cosP0 * sp - sinP0 * cp * Math.cos(dl);
        const z2 = sinP0 * sp + cosP0 * cp * Math.cos(dl);
        if (z2 >= -0.02) {
          const sx = cx + x1 * R;
          const sy = cy - y2 * R;
          if (!pen) { ctx.moveTo(sx, sy); pen = true; }
          else ctx.lineTo(sx, sy);
        } else {
          pen = false;
        }
      }
    }
    for (let lon = -180; lon < 180; lon += 30) {
      const dl = (lon - lonDeg) * DEG2RAD;
      const sdl = Math.sin(dl), cdl = Math.cos(dl);
      let pen = false;
      for (let lat = -78; lat <= 78; lat += 12) {
        const phi = lat * DEG2RAD;
        const cp = Math.cos(phi), sp = Math.sin(phi);
        const x1 = cp * sdl;
        const y2 = cosP0 * sp - sinP0 * cp * cdl;
        const z2 = sinP0 * sp + cosP0 * cp * cdl;
        if (z2 >= -0.02) {
          const sx = cx + x1 * R;
          const sy = cy - y2 * R;
          if (!pen) { ctx.moveTo(sx, sy); pen = true; }
          else ctx.lineTo(sx, sy);
        } else {
          pen = false;
        }
      }
    }
    ctx.strokeStyle = `rgba(${rCol},${gCol},${bCol},0.11)`;
    ctx.lineWidth = 0.75;
    ctx.stroke();

    // 5B. REAL NATURAL-EARTH 3D CONTINENTS (single combined path -> razor sharp & ultra fast!)
    if (worldRings.length > 0) {
      ctx.beginPath();
      for (let r = 0; r < worldRings.length; r++) {
        const ring = worldRings[r];
        // Fast bounding-cone backface cull
        const cDot = ring.center[0] * vx0 + ring.center[1] * vy0 + ring.center[2] * vz0;
        if (cDot < -ring.sinRadius - 0.12) continue;

        const pts = ring.pts;
        let hasFront = false;
        for (let i = 0; i < pts.length; i++) {
          const u = pts[i];
          const z1 = u[0] * sinL0 + u[2] * cosL0;
          const z2 = u[1] * sinP0 + z1 * cosP0;
          if (z2 > -0.02) { hasFront = true; break; }
        }
        if (!hasFront) continue;

        for (let i = 0; i < pts.length; i++) {
          const u = pts[i];
          let x1 = u[0] * cosL0 - u[2] * sinL0;
          const z1 = u[0] * sinL0 + u[2] * cosL0;
          let y2 = u[1] * cosP0 - z1 * sinP0;
          const z2 = u[1] * sinP0 + z1 * cosP0;
          if (z2 < 0) {
            const hLen = Math.hypot(x1, y2) || 1;
            x1 = (x1 / hLen) * 1.01;
            y2 = (y2 / hLen) * 1.01;
          }
          const sx = cx + x1 * R;
          const sy = cy - y2 * R;
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.closePath();
      }
      ctx.fillStyle = `rgba(${rCol},${gCol},${bCol},0.11)`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${Math.round(rCol * 0.75 + 64)},${Math.round(gCol * 0.75 + 64)},${Math.round(bCol * 0.75 + 64)},0.54)`;
      ctx.lineWidth = 1.05;
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    // 5C. Travelling Pole-to-Pole Orbital Radar Scan Ring (luminous latitude pulse!)
    const scanLat = 78 - ((tSec * 24) % 156);
    const scanPhi = scanLat * DEG2RAD;
    const scanCp = Math.cos(scanPhi), scanSp = Math.sin(scanPhi);
    ctx.beginPath();
    let scanPen = false;
    for (let lon = -180; lon <= 180; lon += 8) {
      const dl = (lon - lonDeg) * DEG2RAD;
      const x1 = scanCp * Math.sin(dl);
      const y2 = cosP0 * scanSp - sinP0 * scanCp * Math.cos(dl);
      const z2 = sinP0 * scanSp + cosP0 * scanCp * Math.cos(dl);
      if (z2 >= 0) {
        const sx = cx + x1 * R;
        const sy = cy - y2 * R;
        if (!scanPen) { ctx.moveTo(sx, sy); scanPen = true; }
        else ctx.lineTo(sx, sy);
      } else {
        scanPen = false;
      }
    }
    ctx.strokeStyle = `rgba(${rCol},${gCol},${bCol},0.46)`;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // 5D. Stripe-Style Dense 3D Holographic Fibonacci Shimmer Shell (2-bucket batched)
    const shellStride = qualityTier === 0 ? 2 : 1;
    ctx.fillStyle = `rgba(${rCol},${gCol},${bCol},0.22)`;
    for (let i = 0; i < shellDots.length; i += shellStride) {
      const d = shellDots[i];
      const x1 = d[0] * cosL0 - d[2] * sinL0;
      const z1 = d[0] * sinL0 + d[2] * cosL0;
      const y2 = d[1] * cosP0 - z1 * sinP0;
      const z2 = d[1] * sinP0 + z1 * cosP0;
      if (z2 > 0) {
        const sx = cx + x1 * R;
        const sy = cy - y2 * R;
        const sz = z2 > 0.65 ? 2.1 : 1.4;
        ctx.fillRect(sx - sz * 0.5, sy - sz * 0.5, sz, sz);
      }
    }

    ctx.restore(); // end sphere clip

    // 6. Curved 3D Perspective Geodesic Data Arcs & Glowing Comet Energy Trails
    for (let ai = 0; ai < arcs.length; ai++) {
      const arc = arcs[ai];
      const pts = arc.pts;
      const proj = new Array(pts.length);
      for (let s = 0; s < pts.length; s++) {
        const p = pts[s];
        const x1 = p[0] * cosL0 - p[2] * sinL0;
        const z1 = p[0] * sinL0 + p[2] * cosL0;
        const y2 = p[1] * cosP0 - z1 * sinP0;
        const z2 = p[1] * sinP0 + z1 * cosP0;
        const [psx, psy, pf] = projPersp(x1, y2, z2);
        proj[s] = [psx, psy, z2, pf];
      }

      ctx.beginPath();
      let pen = false;
      for (let s = 0; s < proj.length; s++) {
        if (proj[s][2] > -0.10) {
          if (!pen) { ctx.moveTo(proj[s][0], proj[s][1]); pen = true; }
          else ctx.lineTo(proj[s][0], proj[s][1]);
        } else {
          pen = false;
        }
      }
      ctx.strokeStyle = arc.color;
      ctx.globalAlpha = 0.46;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Glowing comet head + 4-step fading energy tail
      const u = (((tSec * arc.speed + arc.offset) % 1) + 1) % 1;
      const idxF = u * (proj.length - 1);
      const i0 = Math.max(0, Math.min(proj.length - 1, Math.floor(idxF)));
      const i1 = Math.min(proj.length - 1, i0 + 1);
      const frac = idxF - i0;
      const px = proj[i0][0] + (proj[i1][0] - proj[i0][0]) * frac;
      const py = proj[i0][1] + (proj[i1][1] - proj[i0][1]) * frac;
      const pz = proj[i0][2] + (proj[i1][2] - proj[i0][2]) * frac;
      const pf = proj[i0][3];
      if (pz > -0.04) {
        if (i0 >= 2) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          for (let back = 1; back <= 3 && i0 - back >= 0; back++) {
            ctx.lineTo(proj[i0 - back][0], proj[i0 - back][1]);
          }
          ctx.strokeStyle = arc.color;
          ctx.globalAlpha = 0.72;
          ctx.lineWidth = 2.4;
          ctx.stroke();
        }

        ctx.globalAlpha = 0.36;
        ctx.fillStyle = arc.color;
        ctx.beginPath();
        ctx.arc(px, py, 7.2 * pf, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 2.3 * pf, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // 7. Protruding 3D Coordinate Beacons + Expanding Shockwave Rings + Floating Pinned Telemetry Callouts
    const activeFocus = ch.focusSectors;
    const calloutKeys = ch.calloutKeys || [];
    const calloutsToDraw = [];

    for (let bi = 0; bi < beacons.length; bi++) {
      const b = beacons[bi];
      const u = b.base;
      const x1 = u[0] * cosL0 - u[2] * sinL0;
      const z1 = u[0] * sinL0 + u[2] * cosL0;
      const y2 = u[1] * cosP0 - z1 * sinP0;
      const z2 = u[1] * sinP0 + z1 * cosP0;
      if (z2 <= 0.02) continue;

      const isFocused = activeFocus.includes(b.sector);
      const fade = Math.min(1, z2 * 2.6);
      const baseX = cx + x1 * R;
      const baseY = cy - y2 * R;
      const pinLift = isFocused ? 1.13 : 1.085;
      const [tipX, tipY, pf] = projPersp(x1 * pinLift, y2 * pinLift, z2 * pinLift);

      // Expanding surface shockwave ring
      const cycle = (tSec * (isFocused ? 0.62 : 0.32) + b.phase) % 1;
      const ringR = 3.5 + cycle * (isFocused ? 21 : 11);
      ctx.strokeStyle = b.color;
      ctx.globalAlpha = (1 - cycle) * (isFocused ? 0.76 : 0.28) * fade;
      ctx.lineWidth = isFocused ? 1.55 : 1.0;
      ctx.beginPath();
      ctx.arc(baseX, baseY, ringR, 0, Math.PI * 2);
      ctx.stroke();

      // Elevated beacon stem
      ctx.globalAlpha = (isFocused ? 0.88 : 0.44) * fade;
      ctx.lineWidth = isFocused ? 1.5 : 1.1;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();

      // Radiant beacon head
      const headR = ((isFocused ? 4.2 : 2.8) + Math.sin(tSec * 4.5 + b.phase * 6) * (isFocused ? 0.8 : 0.3)) * pf;
      ctx.globalAlpha = (isFocused ? 0.35 : 0.18) * fade;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(tipX, tipY, headR * 2.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 0.96 * fade;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(tipX, tipY, headR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(tipX, tipY, Math.max(1.2, headR * 0.42), 0, Math.PI * 2);
      ctx.fill();

      // Queue desktop floating 3D holographic callout label for chapter-locked coordinates
      if (!mobileMode && z2 > 0.28 && calloutKeys.includes(b.key)) {
        calloutsToDraw.push({ b, tipX, tipY, x1, y2, fade: Math.min(1, (z2 - 0.25) * 2.6) });
      }
    }
    ctx.globalAlpha = 1;

    // 8. Front pass of tilted 3D orbits
    drawOrbits(true);

    // 9. Crisp Pinned 3D Orbital Telemetry Callouts (desktop, non-overlapping, never crossing slide card)
    if (calloutsToDraw.length > 0) {
      ctx.font = '700 9px "JetBrains Mono", monospace';
      ctx.textBaseline = 'middle';
      const placed = [];
      for (let i = 0; i < calloutsToDraw.length; i++) {
        const c = calloutsToDraw[i];
        const dirX = c.x1 >= -0.05 ? 1 : -1;
        const label = `${c.b.short} · ${c.b.tag}`;
        const tw = ctx.measureText(label).width + 18;
        const th = 20;
        const elbowX = c.tipX + dirX * 18;
        const elbowY = c.tipY - 14;
        const boxX = dirX > 0 ? elbowX + 6 : elbowX - tw - 6;
        const boxY = elbowY - th * 0.5;

        // Avoid left slide card safe zone (< 560px on desktop) and right chapter rail (> viewW - 148px)
        if (boxX < 555 || boxX + tw > viewW - 145 || boxY < 76 || boxY + th > viewH - 72) continue;

        let clash = false;
        for (let k = 0; k < placed.length; k++) {
          const p = placed[k];
          if (boxX < p.x + p.w + 8 && boxX + tw + 8 > p.x && boxY < p.y + p.h + 6 && boxY + th + 6 > p.y) {
            clash = true;
            break;
          }
        }
        if (clash) continue;
        placed.push({ x: boxX, y: boxY, w: tw, h: th });

        ctx.globalAlpha = 0.92 * c.fade;
        // Leader line
        ctx.strokeStyle = c.b.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(c.tipX, c.tipY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(dirX > 0 ? boxX : boxX + tw, elbowY);
        ctx.stroke();

        // Glass pill tag
        ctx.fillStyle = 'rgba(5, 10, 22, 0.88)';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(boxX, boxY, tw, th, 6) : ctx.rect(boxX, boxY, tw, th);
        ctx.fill();
        ctx.strokeStyle = c.b.color;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        // Status dot + text
        ctx.fillStyle = c.b.color;
        ctx.beginPath();
        ctx.arc(boxX + 8, elbowY, 2.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f1f5f9';
        ctx.fillText(label, boxX + 14, elbowY + 0.5);
      }
      ctx.globalAlpha = 1;
    }
  }

  // ─── 6. REDUCED MOTION ACCESSIBLE MODE ───
  if (prefersReducedMotion) {
    scrollContainer.classList.add('intro-reduced');
    if (globalHeader) globalHeader.classList.remove('intro-hidden');
    if (typeof startHero === 'function') startHero();

    const showStaticChapter = (idx) => {
      const ch = CHAPTERS[idx] || CHAPTERS[0];
      const midP = (ch.start + ch.end) / 2;
      smoothProgress = midP;
      syncChapterDOM(midP);
      curRgb[0] = ch.rgb[0]; curRgb[1] = ch.rgb[1]; curRgb[2] = ch.rgb[2];
      renderPlanet(evalKeyframes(midP, keyframes), 1.4);
    };
    chapterPills.forEach((pill, idx) => pill.addEventListener('click', () => showStaticChapter(idx)));
    showStaticChapter(0);
    return;
  }

  // ─── 7. UNIFIED 60FPS ANIMATION LOOP + ADAPTIVE FRAME GOVERNOR ───
  let lastNow = performance.now();
  let tSec = 0;
  let rafId = null;
  let slowFrameStreak = 0;

  function updatePauseState() {
    const shouldPause = !isInViewport || document.hidden;
    if (shouldPause && !isPaused) {
      isPaused = true;
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    } else if (!shouldPause && isPaused) {
      isPaused = false;
      lastNow = performance.now();
      tick(lastNow);
    }
  }

  function tick(now) {
    if (isPaused) return;
    rafId = requestAnimationFrame(tick);

    const rawMs = now - lastNow;
    const dt = Math.max(0, Math.min(rawMs * 0.001, 0.05));
    lastNow = now;
    tSec += dt;

    // Stripe-style adaptive performance governor: automatically downscales DPR if slow frames persist
    if (qualityTier > 0 && rawMs > 30 && rawMs < 250) {
      slowFrameStreak++;
      if (slowFrameStreak >= 6) {
        qualityTier = 0;
        maxDpr = 1.0;
        sizeCanvas();
      }
    } else {
      slowFrameStreak = 0;
    }

    const diff = targetProgress - smoothProgress;
    if (Math.abs(diff) > 0.00015) {
      smoothProgress += diff * (1 - Math.exp(-15 * dt));
    } else {
      smoothProgress = targetProgress;
    }

    const kf = evalKeyframes(smoothProgress, keyframes);

    const opRounded = Number(kf.opacity.toFixed(3));
    if (opRounded !== lastCanvasOp) {
      lastCanvasOp = opRounded;
      container.style.opacity = String(opRounded);
    }

    syncChapterDOM(smoothProgress);

    const pFactor = 1 - Math.exp(-7 * dt);
    pointer.curLon += (pointer.targetLon - pointer.curLon) * pFactor;
    pointer.curLat += (pointer.targetLat - pointer.curLat) * pFactor;

    const cFactor = 1 - Math.exp(-6 * dt);
    curRgb[0] += (targetRgb[0] - curRgb[0]) * cFactor;
    curRgb[1] += (targetRgb[1] - curRgb[1]) * cFactor;
    curRgb[2] += (targetRgb[2] - curRgb[2]) * cFactor;

    renderPlanet(kf, tSec);
  }

  syncChapterDOM(smoothProgress);
  renderPlanet(evalKeyframes(smoothProgress, keyframes), 0);
  tick(performance.now());

  chapterPills.forEach((pill, idx) => {
    pill.addEventListener('click', () => {
      const ch = CHAPTERS[idx];
      if (!ch) return;
      const targetP = ch.start + (ch.end - ch.start) * 0.24;
      window.scrollTo({ top: Math.round(scrollTopOffset + maxScrollDist * targetP), behavior: 'smooth' });
    });
  });

  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isInViewport = entry.isIntersecting;
        updatePauseState();
        if (!isInViewport && window.scrollY > scrollTopOffset + maxScrollDist * 0.85) {
          if (globalHeader) globalHeader.classList.remove('intro-hidden');
          if (!startHeroTriggered) {
            startHeroTriggered = true;
            if (typeof startHero === 'function') startHero();
          }
        }
      });
    }, { threshold: 0.01 });
    observer.observe(scrollContainer);
  }

  document.addEventListener('visibilitychange', updatePauseState);

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      sizeCanvas();
      measureScrollMetrics();
      renderPlanet(evalKeyframes(smoothProgress, keyframes), tSec);
    }, 120);
  });
}

window.startIntro = startIntro;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startIntro);
} else {
  startIntro();
}
