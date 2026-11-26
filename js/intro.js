/* ─── SOVEREIGN 3D SCROLL INTRODUCTION SYSTEM (BUTTERY 60FPS UNIFIED ENGINE) ─── */
let introInitialized = false;
let introScene, introCamera, introRenderer, globeGroup;
let pinDots = [];
let targetRings = [];
let arcPackets = [];
let isPaused = false;
let isInViewport = true;
let startHeroTriggered = false;

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
    accentHex: '#00f5ff', lightHex: 0x00f5ff,
    hudSector: 'GLOBAL PLANETARY SCAN',
    lat: 26.0, lon: -12.0, alt: '6,420 KM',
    focusSectors: ['global', 'conflict', 'regulation', 'enterprise']
  },
  {
    id: 1, start: 0.23, end: 0.46,
    accentHex: '#ff2244', lightHex: 0xff2244,
    hudSector: 'EASTERN EUROPE & MENA LOCK',
    lat: 43.2, lon: 31.4, alt: '1,840 KM',
    focusSectors: ['conflict']
  },
  {
    id: 2, start: 0.46, end: 0.69,
    accentHex: '#ff6b00', lightHex: 0xff8c1a,
    hudSector: 'EU–APAC REGULATORY CORRIDOR',
    lat: 16.8, lon: 106.4, alt: '1,590 KM',
    focusSectors: ['regulation']
  },
  {
    id: 3, start: 0.69, end: 0.92,
    accentHex: '#b366ff', lightHex: 0xb366ff,
    hudSector: 'SOVEREIGN COMMAND & PRIVATE AI',
    lat: 34.5, lon: 14.2, alt: '3,120 KM',
    focusSectors: ['global', 'conflict', 'regulation', 'enterprise']
  }
];

function latLongToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.sin(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.cos(theta)
  );
}

function getCameraRotationForCoord(lat, lon) {
  return {
    rotY: -((lon + 180) * (Math.PI / 180)) + Math.PI / 2,
    rotX: (lat) * (Math.PI / 180) - 0.22
  };
}

function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }
function lerp(a, b, t) { return a + (b - a) * t; }
function smoothstep(e0, e1, x) {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

// Piece-wise cubic-eased keyframe interpolator (pure math, zero allocations)
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
        rotY: lerp(a.rotY, b.rotY, t),
        rotX: lerp(a.rotX, b.rotX, t),
        camZ: lerp(a.camZ, b.camZ, t),
        posX: lerp(a.posX, b.posX, t),
        posY: lerp(a.posY, b.posY, t),
        opacity: lerp(a.opacity, b.opacity, t)
      };
    }
  }
  return last;
}

function startIntro() {
  if (introInitialized) return;
  introInitialized = true;

  const scrollContainer = document.getElementById('intro-scroll-container');
  const container = document.getElementById('intro-canvas-container');
  const slides = Array.from(document.querySelectorAll('.intro-slide'));
  const dwellFills = slides.map((s) => s.querySelector('.slide-dwell-fill'));
  const chapterPills = Array.from(document.querySelectorAll('.intro-chapter-pill'));
  const pillFills = chapterPills.map((p) => p.querySelector('.intro-chapter-fill'));
  const globalHeader = document.getElementById('global-header');
  const hudReadout = document.getElementById('intro-telemetry-readout');
  const hudDot = document.getElementById('intro-brand-dot');
  const hudScrollLabel = document.getElementById('intro-scroll-label');
  const hudBottom = document.getElementById('intro-hud-bottom');
  const globalFill = document.getElementById('intro-global-progress-fill');
  const skipBtn = document.getElementById('intro-skip-btn');

  if (!scrollContainer || !container || typeof THREE === 'undefined') {
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

  // ─── 1. THREE.JS SCENE (LIGHTWEIGHT, HIGH-FPS CONFIGURATION) ───
  introScene = new THREE.Scene();
  introScene.fog = new THREE.FogExp2(0x03050b, 0.0022);

  const width = window.innerWidth;
  const height = window.innerHeight;
  introCamera = new THREE.PerspectiveCamera(44, width / height, 1, 1200);
  introCamera.position.z = mobileMode ? 465 : 345;

  try {
    introRenderer = new THREE.WebGLRenderer({
      antialias: (window.devicePixelRatio || 1) < 1.5, // Skip costly MSAA on Retina where DPR already smooths edges
      alpha: true,
      powerPreference: 'high-performance'
    });
  } catch (e) {
    if (globalHeader) globalHeader.classList.remove('intro-hidden');
    if (typeof startHero === 'function') startHero();
    return;
  }

  introRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  introRenderer.setSize(width, height);
  introRenderer.setClearColor(0x03050b, 0);
  container.appendChild(introRenderer.domElement);

  // Lights
  introScene.add(new THREE.AmbientLight(0xffffff, 0.72));
  const keyLight = new THREE.DirectionalLight(0x00f5ff, 2.0);
  keyLight.position.set(110, 140, 80);
  introScene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xb366ff, 1.0);
  rimLight.position.set(-120, -100, -70);
  introScene.add(rimLight);

  const parallaxGroup = new THREE.Group();
  introScene.add(parallaxGroup);

  globeGroup = new THREE.Group();
  globeGroup.rotation.x = 0.24;
  globeGroup.rotation.y = 0.35;
  parallaxGroup.add(globeGroup);

  // ─── 2. HOLOGRAPHIC 3D GLOBE GEOMETRY ───
  function createGlowDotTexture() {
    const c = document.createElement('canvas');
    c.width = 48;
    c.height = 48;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(24, 24, 1.5, 24, 24, 22);
    grad.addColorStop(0.0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.32, 'rgba(255,255,255,0.85)');
    grad.addColorStop(0.66, 'rgba(0,245,255,0.28)');
    grad.addColorStop(1.0, 'rgba(0,245,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 48, 48);
    return new THREE.CanvasTexture(c);
  }

  const particleCount = mobileMode ? 1400 : 2100;
  const particlePoints = [];
  const tempVec = new THREE.Vector3();
  for (let i = 0; i < particleCount; i++) {
    const y = 1 - (i / (particleCount - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = 2.3999632 * i;
    tempVec.set(Math.cos(theta) * radiusAtY, y, Math.sin(theta) * radiusAtY).multiplyScalar(100);
    particlePoints.push(tempVec.x, tempVec.y, tempVec.z);
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(particlePoints, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x00f5ff,
    map: createGlowDotTexture(),
    size: mobileMode ? 3.2 : 2.9,
    transparent: true,
    opacity: 0.88,
    alphaTest: 0.02,
    depthWrite: false,
    sizeAttenuation: true
  });
  const pointSphere = new THREE.Points(particleGeo, particleMat);
  globeGroup.add(pointSphere);

  globeGroup.add(new THREE.Mesh(
    new THREE.SphereGeometry(98.2, 22, 22),
    new THREE.MeshBasicMaterial({ color: 0x063554, wireframe: true, transparent: true, opacity: 0.16 })
  ));
  globeGroup.add(new THREE.Mesh(
    new THREE.SphereGeometry(96.5, 22, 22),
    new THREE.MeshBasicMaterial({ color: 0x040915, transparent: true, opacity: 0.72 })
  ));

  const auraMat = new THREE.MeshBasicMaterial({
    color: 0x00f5ff, transparent: true, opacity: 0.045, side: THREE.BackSide
  });
  globeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(106.5, 28, 28), auraMat));

  [-30, 0, 30].forEach((latDeg) => {
    const latRad = latDeg * (Math.PI / 180);
    const r = Math.cos(latRad) * 100.6;
    const yPos = Math.sin(latRad) * 100.6;
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * r, yPos, Math.sin(a) * r));
    }
    globeGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: latDeg === 0 ? 0.18 : 0.08 })
    ));
  });

  // Coordinate Beacons & Target Rings
  const sharedHeadGeo = new THREE.SphereGeometry(1.75, 8, 8);
  const sharedRingGeo = new THREE.RingGeometry(2.6, 3.6, 20);
  Object.keys(GEO_COORDINATES).forEach((key, idx) => {
    const coord = GEO_COORDINATES[key];
    const startPos = latLongToVector3(coord.lat, coord.lon, 98.5);
    const endPos = latLongToVector3(coord.lat, coord.lon, 113.5);

    globeGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([startPos, endPos]),
      new THREE.LineBasicMaterial({ color: coord.color, transparent: true, opacity: 0.8 })
    ));

    const headMesh = new THREE.Mesh(
      sharedHeadGeo,
      new THREE.MeshBasicMaterial({ color: coord.color, transparent: true, opacity: 0.96 })
    );
    headMesh.position.copy(endPos);
    globeGroup.add(headMesh);

    const pulseRingMat = new THREE.MeshBasicMaterial({
      color: coord.color, side: THREE.DoubleSide, transparent: true, opacity: 0.55
    });
    const pulseRing = new THREE.Mesh(sharedRingGeo, pulseRingMat);
    pulseRing.position.copy(latLongToVector3(coord.lat, coord.lon, 101.2));
    pulseRing.lookAt(latLongToVector3(coord.lat, coord.lon, 160));
    globeGroup.add(pulseRing);

    pinDots.push({ mesh: headMesh, sector: coord.sector, phase: idx * 0.9, speed: 0.055 + (idx % 3) * 0.015 });
    targetRings.push({ mesh: pulseRing, mat: pulseRingMat, sector: coord.sector, phase: idx * 0.37 });
  });

  // Geodesic Arcs & Traveling Packets
  const sharedPktGeo = new THREE.SphereGeometry(1.15, 6, 6);
  const connectionPairs = [
    { from: GEO_COORDINATES.kyiv,       to: GEO_COORDINATES.suez,       altitude: 0.22, color: '#ff2244', speed: 0.19 },
    { from: GEO_COORDINATES.taiwan,     to: GEO_COORDINATES.malacca,    altitude: 0.24, color: '#ffd22e', speed: 0.22 },
    { from: GEO_COORDINATES.brussels,   to: GEO_COORDINATES.sahel,      altitude: 0.26, color: '#b366ff', speed: 0.16 },
    { from: GEO_COORDINATES.kyiv,       to: GEO_COORDINATES.brussels,   altitude: 0.16, color: '#00ff88', speed: 0.25 },
    { from: GEO_COORDINATES.washington, to: GEO_COORDINATES.brussels,   altitude: 0.28, color: '#00f5ff', speed: 0.15 },
    { from: GEO_COORDINATES.frankfurt,  to: GEO_COORDINATES.malacca,    altitude: 0.30, color: '#ff6b00', speed: 0.14 }
  ];

  connectionPairs.forEach((pair, idx) => {
    const v1 = latLongToVector3(pair.from.lat, pair.from.lon, 100.2);
    const v2 = latLongToVector3(pair.to.lat, pair.to.lon, 100.2);
    const dist = v1.distanceTo(v2);
    const midPoint = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
    midPoint.normalize().multiplyScalar(100.2 + dist * pair.altitude);

    const curve = new THREE.QuadraticBezierCurve3(v1, midPoint, v2);
    globeGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(36)),
      new THREE.LineBasicMaterial({ color: pair.color, transparent: true, opacity: 0.42 })
    ));

    const pktMesh = new THREE.Mesh(
      sharedPktGeo,
      new THREE.MeshBasicMaterial({ color: pair.color, transparent: true, opacity: 0.95 })
    );
    globeGroup.add(pktMesh);
    arcPackets.push({ curve, mesh: pktMesh, offset: idx / connectionPairs.length, speed: pair.speed });
  });

  // Twin Orbital Rings & Satellites
  const ring1Mat = new THREE.MeshBasicMaterial({
    color: 0x00f5ff, side: THREE.DoubleSide, transparent: true, opacity: 0.13
  });
  const cyberRing1 = new THREE.Mesh(new THREE.RingGeometry(129.4, 130.6, 72), ring1Mat);
  cyberRing1.rotation.x = Math.PI / 2;
  cyberRing1.rotation.y = Math.PI / 6;
  globeGroup.add(cyberRing1);

  const cyberRing2 = new THREE.Mesh(
    new THREE.RingGeometry(142.5, 143.3, 72),
    new THREE.MeshBasicMaterial({ color: 0xb366ff, side: THREE.DoubleSide, transparent: true, opacity: 0.10 })
  );
  cyberRing2.rotation.x = Math.PI / 2.6;
  cyberRing2.rotation.y = -Math.PI / 4;
  globeGroup.add(cyberRing2);

  const sat1 = new THREE.Mesh(new THREE.SphereGeometry(2.3, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00f5ff }));
  const sat2 = new THREE.Mesh(new THREE.SphereGeometry(1.85, 8, 8), new THREE.MeshBasicMaterial({ color: 0xb366ff }));
  globeGroup.add(sat1, sat2);

  // ─── 3. CAMERA KEYFRAMES (DESKTOP & MOBILE) ───
  const eeRot = getCameraRotationForCoord(GEO_COORDINATES.kyiv.lat - 8, GEO_COORDINATES.kyiv.lon - 6);
  const seRot = getCameraRotationForCoord(GEO_COORDINATES.malacca.lat + 10, GEO_COORDINATES.malacca.lon - 4);

  function buildKeyframes(isMob) {
    return [
      { p: 0.00, rotY: 0.35,             rotX: 0.24,             camZ: isMob ? 465 : 345, posX: isMob ? 0 : 58, posY: isMob ? 62 : 0,  opacity: 1 },
      { p: 0.23, rotY: 2.05,             rotX: 0.34,             camZ: isMob ? 428 : 302, posX: isMob ? 0 : 60, posY: isMob ? 64 : 2,  opacity: 1 },
      { p: 0.345,rotY: eeRot.rotY,       rotX: eeRot.rotX,       camZ: isMob ? 386 : 256, posX: isMob ? 0 : 66, posY: isMob ? 66 : -4, opacity: 1, linear: true },
      { p: 0.46, rotY: eeRot.rotY + 0.42,rotX: eeRot.rotX - 0.08,camZ: isMob ? 374 : 244, posX: isMob ? 0 : 66, posY: isMob ? 66 : -2, opacity: 1 },
      { p: 0.575,rotY: seRot.rotY,       rotX: seRot.rotX,       camZ: isMob ? 382 : 248, posX: isMob ? 0 : 66, posY: isMob ? 64 : 2,  opacity: 1, linear: true },
      { p: 0.69, rotY: seRot.rotY - 0.36,rotX: seRot.rotX + 0.12,camZ: isMob ? 390 : 258, posX: isMob ? 0 : 64, posY: isMob ? 62 : 2,  opacity: 1 },
      { p: 0.92, rotY: seRot.rotY + 1.55,rotX: 0.24,             camZ: isMob ? 422 : 292, posX: isMob ? 0 : 62, posY: isMob ? 60 : 2,  opacity: 1 },
      { p: 1.00, rotY: seRot.rotY + 2.10,rotX: 0.24,             camZ: isMob ? 395 : 268, posX: isMob ? 0 : 62, posY: isMob ? 56 : 2,  opacity: 0 }
    ];
  }
  let keyframes = buildKeyframes(mobileMode);

  // ─── 4. PASSIVE SCROLL TRACKING (ZERO DOM WRITES INSIDE SCROLL EVENT!) ───
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

  // Subtle mouse parallax (desktop pointer only — zero touch interference)
  const pointer = { targetX: 0, targetY: 0, curX: 0, curY: 0 };
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !isInViewport || prefersReducedMotion) return;
    pointer.targetX = ((e.clientX / window.innerWidth) - 0.5) * 0.20;
    pointer.targetY = ((e.clientY / window.innerHeight) - 0.5) * 0.12;
  }, { passive: true });

  // ─── 5. CACHED ZERO-LAYOUT-THRASH UI SYNC ───
  let lastChapterIdx = -1;
  let lastHeaderHidden = null;
  let lastScrollMode = -1;
  let lastCanvasOp = -1;
  let lastHudBottomOp = -1;
  let activeChapterIdx = 0;
  const targetAccentColor = new THREE.Color(CHAPTERS[0].lightHex);
  const currentAccentColor = new THREE.Color(CHAPTERS[0].lightHex);

  function syncChapterDOM(progress) {
    let curIdx = 0;
    for (let i = 0; i < CHAPTERS.length; i++) {
      if (progress >= CHAPTERS[i].start) curIdx = i;
    }
    activeChapterIdx = curIdx;

    // Only touch text/classes/colors when chapter ACTUALLY changes!
    if (curIdx !== lastChapterIdx) {
      lastChapterIdx = curIdx;
      const curChapter = CHAPTERS[curIdx];
      targetAccentColor.setHex(curChapter.lightHex);

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

    // Pure GPU transform for global progress bar (no width layout recalc!)
    if (globalFill) {
      globalFill.style.transform = `scaleX(${clamp01(progress / 0.94).toFixed(4)})`;
    }

    const bottomOp = Number((1 - smoothstep(0.90, 0.97, progress)).toFixed(2));
    if (hudBottom && bottomOp !== lastHudBottomOp) {
      lastHudBottomOp = bottomOp;
      hudBottom.style.opacity = String(bottomOp);
    }

    // Pure GPU opacity + translate3d + scaleX/scaleY for slides & chapter fills
    for (let idx = 0; idx < slides.length; idx++) {
      const slide = slides[idx];
      const ch = CHAPTERS[idx];
      const local = (progress - ch.start) / (ch.end - ch.start);

      let opacity = 0;
      let yShift = 26;
      if (local >= 0 && local <= 1) {
        const enter = idx === 0 ? 1 : smoothstep(0.00, 0.14, local);
        const exit = 1 - smoothstep(0.86, 1.00, local);
        opacity = Math.min(enter, exit);
        if (local < 0.14 && idx !== 0) {
          yShift = (1 - enter) * 24;
        } else if (local > 0.86) {
          yShift = -smoothstep(0.86, 1.00, local) * 22;
        } else {
          yShift = 4 - local * 8;
        }
      }

      slide.style.opacity = opacity.toFixed(3);
      slide.style.transform = `translate3d(0, ${yShift.toFixed(1)}px, 0)`;
      const shouldBeActive = opacity > 0.45;
      if (slide.classList.contains('active') !== shouldBeActive) {
        slide.classList.toggle('active', shouldBeActive);
      }

      const clampedLocal = clamp01(local).toFixed(4);
      if (dwellFills[idx]) {
        dwellFills[idx].style.transform = `scaleX(${clampedLocal})`;
      }
      if (pillFills[idx]) {
        pillFills[idx].style.transform = mobileMode
          ? `scaleX(${clampedLocal})`
          : `scaleY(${clampedLocal})`;
      }
    }

    // Header toggle only on boundary crossing
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

  // ─── 6. REDUCED MOTION ACCESSIBLE MODE ───
  if (prefersReducedMotion) {
    scrollContainer.classList.add('intro-reduced');
    if (globalHeader) globalHeader.classList.remove('intro-hidden');
    if (typeof startHero === 'function') startHero();

    const showStaticChapter = (idx) => {
      const ch = CHAPTERS[idx] || CHAPTERS[0];
      const midP = (ch.start + ch.end) / 2;
      syncChapterDOM(midP);
      const kf = evalKeyframes(midP, keyframes);
      globeGroup.rotation.y = kf.rotY;
      globeGroup.rotation.x = kf.rotX;
      globeGroup.position.x = kf.posX;
      globeGroup.position.y = kf.posY;
      introCamera.position.z = kf.camZ;
      introRenderer.render(introScene, introCamera);
    };
    chapterPills.forEach((pill, idx) => pill.addEventListener('click', () => showStaticChapter(idx)));
    showStaticChapter(0);
    return;
  }

  // ─── 7. UNIFIED 60FPS ANIMATION LOOP (SINGLE RAF — ZERO GSAP SCROLL FIGHTING!) ───
  const axisZ = new THREE.Vector3(0, 0, 1);
  const axisX = new THREE.Vector3(1, 0, 0);
  const satVec = new THREE.Vector3();
  let lastNow = performance.now();
  let time = 0;
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

    // Frame-rate independent delta (clamped >= 0 to handle rAF timestamp offset on first frame)
    const dt = Math.max(0, Math.min((now - lastNow) * 0.001, 0.05));
    lastNow = now;
    time += dt * 0.72;

    // Silky frame-rate independent exponential smoothing for scroll progress
    const diff = targetProgress - smoothProgress;
    if (Math.abs(diff) > 0.00015) {
      smoothProgress += diff * (1 - Math.exp(-11 * dt));
    } else {
      smoothProgress = targetProgress;
    }

    // Apply interpolated 3D camera + globe position
    const kf = evalKeyframes(smoothProgress, keyframes);
    globeGroup.rotation.y = kf.rotY;
    globeGroup.rotation.x = kf.rotX;
    globeGroup.position.x = kf.posX;
    globeGroup.position.y = kf.posY;
    introCamera.position.z = kf.camZ;

    const opRounded = Number(kf.opacity.toFixed(3));
    if (opRounded !== lastCanvasOp) {
      lastCanvasOp = opRounded;
      container.style.opacity = String(opRounded);
    }

    // Sync slide/HUD UI seamlessly inside the same RAF frame
    syncChapterDOM(smoothProgress);

    // Smooth cursor parallax damping
    const pFactor = 1 - Math.exp(-6 * dt);
    pointer.curX += (pointer.targetX - pointer.curX) * pFactor;
    pointer.curY += (pointer.targetY - pointer.curY) * pFactor;
    parallaxGroup.rotation.y = pointer.curX;
    parallaxGroup.rotation.x = pointer.curY;

    // Gentle living globe drift
    pointSphere.rotation.y = Math.sin(time * 0.18) * 0.02;

    // Smooth color morph
    currentAccentColor.lerp(targetAccentColor, 1 - Math.exp(-4.5 * dt));
    keyLight.color.copy(currentAccentColor);
    auraMat.color.copy(currentAccentColor);
    ring1Mat.color.copy(currentAccentColor);

    const activeFocus = CHAPTERS[activeChapterIdx] ? CHAPTERS[activeChapterIdx].focusSectors : ['global'];

    for (let i = 0; i < pinDots.length; i++) {
      const node = pinDots[i];
      const isFocused = activeFocus.includes(node.sector);
      const scale = (isFocused ? 1.2 : 0.85) + Math.sin(time * 28 * node.speed + node.phase) * (isFocused ? 0.42 : 0.18);
      node.mesh.scale.set(scale, scale, scale);
    }

    for (let i = 0; i < targetRings.length; i++) {
      const r = targetRings[i];
      const isFocused = activeFocus.includes(r.sector);
      const cycle = (time * (isFocused ? 0.55 : 0.28) + r.phase) % 1;
      const s = 0.7 + cycle * (isFocused ? 2.8 : 1.5);
      r.mesh.scale.set(s, s, 1);
      r.mat.opacity = (1 - cycle) * (isFocused ? 0.68 : 0.22);
    }

    for (let i = 0; i < arcPackets.length; i++) {
      const pkt = arcPackets[i];
      const u = (((time * pkt.speed + pkt.offset) % 1) + 1) % 1;
      pkt.curve.getPointAt(u, pkt.mesh.position);
    }

    const a1 = time * 0.42;
    satVec.set(Math.cos(a1) * 130, 0, Math.sin(a1) * 130);
    satVec.applyAxisAngle(axisZ, Math.PI / 6);
    satVec.applyAxisAngle(axisX, Math.PI / 2);
    sat1.position.copy(satVec);

    const a2 = -time * 0.31 + 1.4;
    satVec.set(Math.cos(a2) * 142.9, 0, Math.sin(a2) * 142.9);
    satVec.applyAxisAngle(axisZ, -Math.PI / 4);
    satVec.applyAxisAngle(axisX, Math.PI / 2.6);
    sat2.position.copy(satVec);

    introRenderer.render(introScene, introCamera);
  }

  // Initial sync & kick off loop
  syncChapterDOM(smoothProgress);
  tick(performance.now());

  // Clickable chapter rail buttons
  chapterPills.forEach((pill, idx) => {
    pill.addEventListener('click', () => {
      const ch = CHAPTERS[idx];
      if (!ch) return;
      const targetP = ch.start + (ch.end - ch.start) * 0.24;
      window.scrollTo({ top: Math.round(scrollTopOffset + maxScrollDist * targetP), behavior: 'smooth' });
    });
  });

  // Pause WebGL automatically when out of viewport or tab hidden
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

  document.addEventListener('visibilitychange', updatePauseState);

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!introRenderer || !introCamera) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      introCamera.aspect = w / h;
      introCamera.updateProjectionMatrix();
      introRenderer.setSize(w, h);
      measureScrollMetrics();
    }, 120);
  });
}

window.startIntro = startIntro;
