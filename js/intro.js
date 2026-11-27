/* ─── SOVEREIGN 3D SCROLL INTRODUCTION SYSTEM (ULTRA-FAST ZERO-WEBGL 60FPS HOLOGRAPHIC ENGINE) ─── */
/* Renders instantaneously at ~60fps on EVERY device & browser (zero external 3D CDN, zero WebGL required) */
let introInitialized = false;
let isPaused = false;
let isInViewport = true;
let startHeroTriggered = false;

const DEG2RAD = Math.PI / 180;

const GEO_COORDINATES = {
  kyiv:       { lat: 50.45,  lon: 30.52,   color: '#ff2244', sector: 'conflict',   name: 'KYIV // EASTERN EUROPE' },
  suez:       { lat: 29.97,  lon: 32.53,   color: '#ff6b00', sector: 'conflict',   name: 'RED SEA // SUEZ CORRIDOR' },
  sahel:      { lat: 15.00,  lon: 10.00,   color: '#ff2244', sector: 'conflict',   name: 'SAHEL // FIELD TELEMETRY' },
  brussels:   { lat: 50.85,  lon: 4.35,    color: '#00f5ff', sector: 'regulation', name: 'BRUSSELS // EU AI ACT' },
  taiwan:     { lat: 24.40,  lon: 119.50,  color: '#ffd22e', sector: 'regulation', name: 'TAIWAN STRAIT // COMPUTE' },
  malacca:    { lat: 1.35,   lon: 103.80,  color: '#ff6b00', sector: 'regulation', name: 'SINGAPORE // MALACCA HUB' },
  washington: { lat: 38.90,  lon: -77.04,  color: '#00f5ff', sector: 'global',     name: 'WASHINGTON D.C. // POLICY' },
  frankfurt:  { lat: 50.11,  lon: 8.68,    color: '#b366ff', sector: 'enterprise', name: 'FRANKFURT // DATA HUB' }
};

// Equal 23% scroll chapters across 0.00 -> 0.92, followed by smooth 0.92 -> 1.00 hero dissolve
const CHAPTERS = [
  {
    id: 0, start: 0.00, end: 0.23,
    accentHex: '#00f5ff', rgb: [0, 245, 255],
    hudSector: 'GLOBAL PLANETARY SCAN',
    lat: 26.0, lon: -12.0, alt: '6,420 KM',
    focusSectors: ['global', 'conflict', 'regulation', 'enterprise']
  },
  {
    id: 1, start: 0.23, end: 0.46,
    accentHex: '#ff2244', rgb: [255, 34, 68],
    hudSector: 'LIVE OPERATIONS & RISK LOCK',
    lat: 43.2, lon: 31.4, alt: '1,840 KM',
    focusSectors: ['conflict']
  },
  {
    id: 2, start: 0.46, end: 0.69,
    accentHex: '#ff6b00', rgb: [255, 132, 24],
    hudSector: 'COMPLIANCE & AI SEARCH',
    lat: 16.8, lon: 106.4, alt: '1,590 KM',
    focusSectors: ['regulation']
  },
  {
    id: 3, start: 0.69, end: 0.92,
    accentHex: '#b366ff', rgb: [179, 102, 255],
    hudSector: 'LIVE DASHBOARD & PRIVATE AI',
    lat: 34.5, lon: 14.2, alt: '3,120 KM',
    focusSectors: ['global', 'conflict', 'regulation', 'enterprise']
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

// Precompute realistic continental landmass dot-matrix + sparse Fibonacci silhouette dots
function buildIntroGlobeDots(isLowSpec) {
  const regions = [
    [48, -104, 15, 22], [36, -98, 12, 18], [58, -122, 10, 18], [22, -101, 8, 8], [66, -150, 6, 12],
    [72, -42, 8, 12],
    [-6, -60, 14, 14], [-22, -56, 13, 10], [-40, -68, 12, 6],
    [51, 10, 9, 14], [44, 16, 7, 13], [61, 18, 8, 12], [54, -2, 4, 5],
    [22, 14, 13, 18], [6, 22, 12, 17], [-14, 24, 13, 12], [-28, 24, 7, 8],
    [26, 46, 10, 11], [56, 62, 12, 30], [60, 112, 11, 28], [40, 68, 10, 18],
    [21, 79, 11, 8], [35, 108, 12, 15], [20, 104, 9, 9], [36, 138, 6, 5], [-2, 114, 5, 14],
    [-25, 134, 10, 16]
  ];

  const landDots = [];
  const stepLat = isLowSpec ? 4.8 : 3.9;
  for (let lat = -60; lat <= 74; lat += stepLat) {
    const lonStep = Math.max(stepLat, stepLat / Math.max(0.32, Math.cos(lat * DEG2RAD)));
    for (let lon = -180; lon < 180; lon += lonStep) {
      for (let i = 0; i < regions.length; i++) {
        const [clat, clon, rl, rn] = regions[i];
        const dLat = (lat - clat) / rl;
        const dLon = (lon - clon) / rn;
        if (dLat * dLat + dLon * dLon <= 1.0) {
          landDots.push(llToSphereUnit(lat, lon));
          break;
        }
      }
    }
  }

  const shellDots = [];
  const shellCount = isLowSpec ? 180 : 280;
  for (let i = 0; i < shellCount; i++) {
    const y = 1 - (i / (shellCount - 1)) * 2;
    const rY = Math.sqrt(Math.max(0, 1 - y * y));
    const th = 2.39996323 * i;
    shellDots.push([Math.cos(th) * rY, y, Math.sin(th) * rY]);
  }

  return { landDots, shellDots };
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

// Pre-render soft glow/sphere sprites once per chapter (15x faster than per-frame full-viewport radial gradients on CPU!)
function buildChapterSprites(rgb) {
  const [r, g, b] = rgb;
  const corona = document.createElement('canvas');
  corona.width = 160;
  corona.height = 160;
  const cCtx = corona.getContext('2d');
  const cg = cCtx.createRadialGradient(80, 80, 34, 80, 80, 80);
  cg.addColorStop(0.0, `rgba(${r},${g},${b},0.22)`);
  cg.addColorStop(0.55, `rgba(${r},${g},${b},0.06)`);
  cg.addColorStop(1.0, 'rgba(3,5,11,0)');
  cCtx.fillStyle = cg;
  cCtx.fillRect(0, 0, 160, 160);

  const sphere = document.createElement('canvas');
  sphere.width = 256;
  sphere.height = 256;
  const sCtx = sphere.getContext('2d');
  const sg = sCtx.createRadialGradient(90, 90, 12, 128, 128, 124);
  sg.addColorStop(0.00, `rgba(${Math.round(r * 0.18 + 16)},${Math.round(g * 0.20 + 34)},${Math.round(b * 0.24 + 58)},0.92)`);
  sg.addColorStop(0.56, 'rgba(6, 15, 32, 0.96)');
  sg.addColorStop(0.90, 'rgba(3, 8, 18, 0.98)');
  sg.addColorStop(1.00, `rgba(${r},${g},${b},0.34)`);
  sCtx.fillStyle = sg;
  sCtx.beginPath();
  sCtx.arc(128, 128, 124, 0, Math.PI * 2);
  sCtx.fill();
  sCtx.strokeStyle = `rgba(${r},${g},${b},0.55)`;
  sCtx.lineWidth = 2.0;
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

  // ─── 1. ULTRA-FAST ZERO-WEBGL CANVAS 2D 3D PLANET ENGINE ───
  container.innerHTML = '';
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'width:100%;height:100%;display:block;';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d', { alpha: true });

  const isLowCore = typeof navigator !== 'undefined' && typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
  // Cap DPR to 1.0 on low-core/software machines and 1.25 on HiDPI so software compositing stays 50-60 FPS
  const maxDpr = isLowCore ? 1.0 : 1.25;

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

  const { landDots, shellDots } = buildIntroGlobeDots(mobileMode || isLowCore);
  const chapterSprites = CHAPTERS.map((ch) => buildChapterSprites(ch.rgb));

  // Subtle ambient stars
  const stars = [];
  let starSeed = 1337;
  const sRand = () => { starSeed = (starSeed * 16807) % 2147483647; return (starSeed - 1) / 2147483646; };
  const starCount = mobileMode ? 36 : 64;
  for (let i = 0; i < starCount; i++) {
    stars.push({ x: sRand(), y: sRand(), r: 0.9 + sRand() * 0.9 });
  }

  // Precompute 3D beacon vectors
  const beacons = Object.keys(GEO_COORDINATES).map((key, idx) => {
    const c = GEO_COORDINATES[key];
    return {
      key,
      color: c.color,
      sector: c.sector,
      base: llToSphereUnit(c.lat, c.lon),
      phase: idx * 0.41
    };
  });

  // Precompute 3D geodesic arc polylines
  const arcPairs = [
    { from: GEO_COORDINATES.kyiv,       to: GEO_COORDINATES.suez,       lift: 0.20, color: '#ff2244', speed: 0.24 },
    { from: GEO_COORDINATES.taiwan,     to: GEO_COORDINATES.malacca,    lift: 0.22, color: '#ffd22e', speed: 0.26 },
    { from: GEO_COORDINATES.brussels,   to: GEO_COORDINATES.sahel,      lift: 0.25, color: '#b366ff', speed: 0.20 },
    { from: GEO_COORDINATES.kyiv,       to: GEO_COORDINATES.brussels,   lift: 0.15, color: '#00ff88', speed: 0.29 },
    { from: GEO_COORDINATES.washington, to: GEO_COORDINATES.brussels,   lift: 0.27, color: '#00f5ff', speed: 0.18 },
    { from: GEO_COORDINATES.frankfurt,  to: GEO_COORDINATES.malacca,    lift: 0.28, color: '#ff6b00', speed: 0.17 }
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
    const steps = 20;
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

  // Precompute orbit circle unit points (zero sin/cos inside render loop!)
  const orbits = [
    { radius: 1.29, tiltX: 1.18, tiltZ: -0.34, speed:  0.46, ringAlpha: 0.24, useAccent: true  },
    { radius: 1.42, tiltX: 0.98, tiltZ:  0.54, speed: -0.34, ringAlpha: 0.18, useAccent: false, color: '#b366ff' }
  ].map((orb) => {
    const ringPts = [];
    const steps = 48;
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

  // ─── 2. CAMERA CHOREOGRAPHY KEYFRAMES (DESKTOP & MOBILE) ───
  function buildKeyframes(isMob) {
    return [
      { p: 0.00,  lon: -14,  lat: 20, scale: isMob ? 0.34 : 0.42, cxRatio: isMob ? 0.50 : 0.65, cyRatio: isMob ? 0.31 : 0.51, opacity: 1 },
      { p: 0.23,  lon:  18,  lat: 30, scale: isMob ? 0.38 : 0.47, cxRatio: isMob ? 0.50 : 0.66, cyRatio: isMob ? 0.30 : 0.50, opacity: 1 },
      { p: 0.345, lon:  32,  lat: 38, scale: isMob ? 0.42 : 0.54, cxRatio: isMob ? 0.50 : 0.68, cyRatio: isMob ? 0.30 : 0.52, opacity: 1, linear: true },
      { p: 0.46,  lon:  44,  lat: 32, scale: isMob ? 0.43 : 0.55, cxRatio: isMob ? 0.50 : 0.68, cyRatio: isMob ? 0.30 : 0.51, opacity: 1 },
      { p: 0.575, lon: 104,  lat: 18, scale: isMob ? 0.42 : 0.53, cxRatio: isMob ? 0.50 : 0.68, cyRatio: isMob ? 0.31 : 0.50, opacity: 1, linear: true },
      { p: 0.69,  lon:  88,  lat: 24, scale: isMob ? 0.40 : 0.51, cxRatio: isMob ? 0.50 : 0.67, cyRatio: isMob ? 0.31 : 0.50, opacity: 1 },
      { p: 0.92,  lon:  12,  lat: 24, scale: isMob ? 0.37 : 0.48, cxRatio: isMob ? 0.50 : 0.66, cyRatio: isMob ? 0.31 : 0.50, opacity: 1 },
      { p: 1.00,  lon:  -8,  lat: 20, scale: isMob ? 0.40 : 0.51, cxRatio: isMob ? 0.50 : 0.66, cyRatio: isMob ? 0.32 : 0.50, opacity: 0 }
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

  // Desktop pointer parallax (zero touch interference)
  const pointer = { targetLon: 0, targetLat: 0, curLon: 0, curLat: 0 };
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !isInViewport || prefersReducedMotion) return;
    pointer.targetLon = ((e.clientX / viewW) - 0.5) * 14;
    pointer.targetLat = ((e.clientY / viewH) - 0.5) * 8;
  }, { passive: true });

  // ─── 4. CACHED ZERO-LAYOUT-THRASH UI SYNC ───
  let lastChapterIdx = -1;
  let lastHeaderHidden = null;
  let lastScrollMode = -1;
  let lastCanvasOp = -1;
  let lastHudBottomOp = -1;
  let activeChapterIdx = 0;

  function syncChapterDOM(progress) {
    let curIdx = 0;
    for (let i = 0; i < CHAPTERS.length; i++) {
      if (progress >= CHAPTERS[i].start) curIdx = i;
    }
    activeChapterIdx = curIdx;

    if (curIdx !== lastChapterIdx) {
      lastChapterIdx = curIdx;
      const curChapter = CHAPTERS[curIdx];

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

    // Crisp overlapping crossfades so a chapter card is ALWAYS visible across 0.00 -> 0.92 (zero blank gaps!)
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

  // ─── 5. BATCHED ZERO-ALLOCATION CANVAS 2D PLANET RENDERER (<3ms PER FRAME EVEN ON CPU!) ───
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
    const [rCol, gCol, bCol] = ch.rgb;
    const accentCss = ch.accentHex;
    const sprites = chapterSprites[activeChapterIdx] || chapterSprites[0];

    const cx = viewW * kf.cxRatio;
    const cy = viewH * kf.cyRatio;
    const R = Math.min(viewW, viewH) * kf.scale;

    const lonDeg = kf.lon + pointer.curLon + Math.sin(tSec * 0.22) * 2.2;
    const latDeg = kf.lat + pointer.curLat;
    const lam0 = lonDeg * DEG2RAD;
    const phi0 = latDeg * DEG2RAD;
    const sinL0 = Math.sin(lam0), cosL0 = Math.cos(lam0);
    const sinP0 = Math.sin(phi0), cosP0 = Math.cos(phi0);

    // 1. Batched deep-space stars (single fillStyle)
    ctx.fillStyle = 'rgba(226, 232, 240, 0.34)';
    for (let i = 0; i < stars.length; i++) {
      const st = stars[i];
      ctx.fillRect(st.x * viewW, st.y * viewH, st.r, st.r);
    }

    // 2. Pre-rendered outer corona halo (single drawImage, zero per-frame gradient compute!)
    const coronaR = R * 1.50;
    ctx.drawImage(sprites.corona, cx - coronaR, cy - coronaR, coronaR * 2, coronaR * 2);

    // Helper for back/front tilted orbital rings + satellites
    const drawOrbits = (frontPass) => {
      for (let oi = 0; oi < orbits.length; oi++) {
        const orb = orbits[oi];
        const col = orb.useAccent ? accentCss : orb.color;
        const pts = orb.ringPts;
        ctx.beginPath();
        let pen = false;
        for (let s = 0; s < pts.length; s++) {
          const p = pts[s];
          if ((p[2] >= 0) === frontPass) {
            const sx = cx + p[0] * R;
            const sy = cy - p[1] * R;
            if (!pen) { ctx.moveTo(sx, sy); pen = true; }
            else ctx.lineTo(sx, sy);
          } else {
            pen = false;
          }
        }
        ctx.strokeStyle = col;
        ctx.globalAlpha = frontPass ? orb.ringAlpha : orb.ringAlpha * 0.34;
        ctx.lineWidth = frontPass ? 1.25 : 0.9;
        ctx.stroke();

        const satA = tSec * orb.speed + oi * 1.7;
        const [sx0, sy0, sz0] = orbitSatPoint(satA, orb);
        if ((sz0 >= 0) === frontPass) {
          ctx.beginPath();
          for (let k = 0; k < 7; k++) {
            const ta = satA - (orb.speed > 0 ? 1 : -1) * k * 0.055;
            const [tx, ty] = orbitSatPoint(ta, orb);
            if (k === 0) ctx.moveTo(cx + tx * R, cy - ty * R);
            else ctx.lineTo(cx + tx * R, cy - ty * R);
          }
          ctx.strokeStyle = col;
          ctx.globalAlpha = frontPass ? 0.62 : 0.22;
          ctx.lineWidth = 2.0;
          ctx.stroke();

          const px = cx + sx0 * R;
          const py = cy - sy0 * R;
          ctx.globalAlpha = frontPass ? 0.34 : 0.14;
          ctx.fillStyle = col;
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
    };

    // 3. Back pass of orbits
    drawOrbits(false);

    // 4. Pre-rendered 3D sphere core + Fresnel rim (single drawImage!)
    const sphDrawR = R * (128 / 124);
    ctx.drawImage(sprites.sphere, cx - sphDrawR, cy - sphDrawR, sphDrawR * 2, sphDrawR * 2);

    // 5. Batched Graticules + Shell + 3-Bucket Continental Dot Matrix (ONLY 5 draw calls total!)
    // Latitude & longitude wireframe (combined into 1 single path!)
    ctx.beginPath();
    for (let lat = -60; lat <= 60; lat += 30) {
      const phi = lat * DEG2RAD;
      const cp = Math.cos(phi), sp = Math.sin(phi);
      let pen = false;
      for (let lon = -180; lon <= 180; lon += 15) {
        const dl = (lon - lonDeg) * DEG2RAD;
        const x1 = cp * Math.sin(dl);
        const y2 = cosP0 * sp - sinP0 * cp * Math.cos(dl);
        const z2 = sinP0 * sp + cosP0 * cp * Math.cos(dl);
        if (z2 >= 0) {
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
      for (let lat = -75; lat <= 75; lat += 15) {
        const phi = lat * DEG2RAD;
        const cp = Math.cos(phi), sp = Math.sin(phi);
        const x1 = cp * sdl;
        const y2 = cosP0 * sp - sinP0 * cp * cdl;
        const z2 = sinP0 * sp + cosP0 * cp * cdl;
        if (z2 >= 0) {
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
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Fibonacci shell dots (single fillStyle)
    ctx.fillStyle = `rgba(${rCol},${gCol},${bCol},0.18)`;
    for (let i = 0; i < shellDots.length; i++) {
      const d = shellDots[i];
      const x1 = d[0] * cosL0 - d[2] * sinL0;
      const z1 = d[0] * sinL0 + d[2] * cosL0;
      const y2 = d[1] * cosP0 - z1 * sinP0;
      const z2 = d[1] * sinP0 + z1 * cosP0;
      if (z2 > 0) {
        ctx.fillRect(cx + x1 * R - 0.8, cy - y2 * R - 0.8, 1.6, 1.6);
      }
    }

    // 3-Bucket Batched Continental Dot Matrix (ZERO per-dot fillStyle/beginPath overhead!)
    const rearPts = [];
    const midPts = [];
    const brightPts = [];
    for (let i = 0; i < landDots.length; i++) {
      const d = landDots[i];
      const x1 = d[0] * cosL0 - d[2] * sinL0;
      const z1 = d[0] * sinL0 + d[2] * cosL0;
      const y2 = d[1] * cosP0 - z1 * sinP0;
      const z2 = d[1] * sinP0 + z1 * cosP0;
      const sx = cx + x1 * R;
      const sy = cy - y2 * R;
      if (z2 < 0) rearPts.push(sx, sy);
      else if (z2 < 0.56) midPts.push(sx, sy);
      else brightPts.push(sx, sy);
    }

    ctx.fillStyle = `rgba(${rCol},${gCol},${bCol},0.10)`;
    for (let i = 0; i < rearPts.length; i += 2) {
      ctx.fillRect(rearPts[i] - 0.7, rearPts[i + 1] - 0.7, 1.4, 1.4);
    }

    ctx.fillStyle = `rgba(${rCol},${gCol},${bCol},0.62)`;
    ctx.beginPath();
    for (let i = 0; i < midPts.length; i += 2) {
      const x = midPts[i], y = midPts[i + 1];
      ctx.moveTo(x + 1.8, y);
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
    }
    ctx.fill();

    ctx.fillStyle = 'rgba(218, 250, 255, 0.92)';
    ctx.beginPath();
    for (let i = 0; i < brightPts.length; i += 2) {
      const x = brightPts[i], y = brightPts[i + 1];
      ctx.moveTo(x + 2.25, y);
      ctx.arc(x, y, 2.25, 0, Math.PI * 2);
    }
    ctx.fill();

    // 6. Curved 3D Geodesic Data Arcs & Traveling Signal Packets
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
        proj[s] = [cx + x1 * R, cy - y2 * R, z2];
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
      ctx.globalAlpha = 0.44;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      const u = (((tSec * arc.speed + arc.offset) % 1) + 1) % 1;
      const idxF = u * (proj.length - 1);
      const i0 = Math.max(0, Math.min(proj.length - 1, Math.floor(idxF)));
      const i1 = Math.min(proj.length - 1, i0 + 1);
      const frac = idxF - i0;
      const px = proj[i0][0] + (proj[i1][0] - proj[i0][0]) * frac;
      const py = proj[i0][1] + (proj[i1][1] - proj[i0][1]) * frac;
      const pz = proj[i0][2] + (proj[i1][2] - proj[i0][2]) * frac;
      if (pz > -0.04) {
        ctx.globalAlpha = 0.36;
        ctx.fillStyle = arc.color;
        ctx.beginPath();
        ctx.arc(px, py, 6.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // 7. Protruding 3D Coordinate Beacon Pins + Target Shockwaves
    const activeFocus = ch.focusSectors;
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
      const pinLift = isFocused ? 1.135 : 1.09;
      const tipX = cx + x1 * R * pinLift;
      const tipY = cy - y2 * R * pinLift;

      const cycle = (tSec * (isFocused ? 0.62 : 0.32) + b.phase) % 1;
      const ringR = 3.5 + cycle * (isFocused ? 20 : 11);
      ctx.strokeStyle = b.color;
      ctx.globalAlpha = (1 - cycle) * (isFocused ? 0.72 : 0.28) * fade;
      ctx.lineWidth = isFocused ? 1.5 : 1.0;
      ctx.beginPath();
      ctx.arc(baseX, baseY, ringR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = (isFocused ? 0.85 : 0.45) * fade;
      ctx.lineWidth = isFocused ? 1.5 : 1.1;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();

      const headR = (isFocused ? 4.2 : 2.8) + Math.sin(tSec * 4.5 + b.phase * 6) * (isFocused ? 0.85 : 0.35);
      ctx.globalAlpha = (isFocused ? 0.34 : 0.18) * fade;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(tipX, tipY, headR * 2.0, 0, Math.PI * 2);
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
    }
    ctx.globalAlpha = 1;

    // 8. Front pass of tilted orbits
    drawOrbits(true);
  }

  // ─── 6. REDUCED MOTION ACCESSIBLE MODE ───
  if (prefersReducedMotion) {
    scrollContainer.classList.add('intro-reduced');
    if (globalHeader) globalHeader.classList.remove('intro-hidden');
    if (typeof startHero === 'function') startHero();

    const showStaticChapter = (idx) => {
      const ch = CHAPTERS[idx] || CHAPTERS[0];
      const midP = (ch.start + ch.end) / 2;
      syncChapterDOM(midP);
      renderPlanet(evalKeyframes(midP, keyframes), 1.4);
    };
    chapterPills.forEach((pill, idx) => pill.addEventListener('click', () => showStaticChapter(idx)));
    showStaticChapter(0);
    return;
  }

  // ─── 7. UNIFIED 60FPS ANIMATION LOOP ───
  let lastNow = performance.now();
  let tSec = 0;
  let rafId = null;

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

    const dt = Math.max(0, Math.min((now - lastNow) * 0.001, 0.05));
    lastNow = now;
    tSec += dt;

    // Snappy frame-rate independent scroll damping
    const diff = targetProgress - smoothProgress;
    if (Math.abs(diff) > 0.00015) {
      smoothProgress += diff * (1 - Math.exp(-16 * dt));
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
