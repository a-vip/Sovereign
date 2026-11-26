/* ─── SOVEREIGN 3D SCROLL INTRODUCTION SYSTEM (APPLE-GRADE CHOREOGRAPHY) ─── */
let introInitialized = false;
let introScene, introCamera, introRenderer, globeGroup;
let pinDots = [];
let targetRings = [];
let arcPackets = [];
let animTimeline = null;
let introTrigger = null;
let isPaused = false;
let isInViewport = true;
let startHeroTriggered = false;

// Strategic global nodes (Latitude, Longitude, accent color, sector tag)
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

// Equal 23% scroll chapters across 0.00 -> 0.92, followed by smooth 0.92 -> 1.00 hero handoff
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
  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);
  return new THREE.Vector3(x, y, z);
}

function getCameraRotationForCoord(lat, lon) {
  const rotY = -((lon + 180) * (Math.PI / 180)) + Math.PI / 2;
  const rotX = (lat) * (Math.PI / 180) - 0.22;
  return { rotX, rotY };
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function startIntro() {
  if (introInitialized) return;
  introInitialized = true;

  const scrollContainer = document.getElementById('intro-scroll-container');
  const container = document.getElementById('intro-canvas-container');
  const slides = Array.from(document.querySelectorAll('.intro-slide'));
  const chapterPills = Array.from(document.querySelectorAll('.intro-chapter-pill'));
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
  const isMobileViewport = () => window.innerWidth <= 900;

  // Wire Skip Intro button cleanly
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

  // ─── 1. THREE.JS SCENE, CAMERA & RENDERER ───
  introScene = new THREE.Scene();
  introScene.fog = new THREE.FogExp2(0x03050b, 0.0022);

  const width = window.innerWidth;
  const height = window.innerHeight;
  introCamera = new THREE.PerspectiveCamera(44, width / height, 1, 1200);
  introCamera.position.z = isMobileViewport() ? 360 : 335;

  try {
    introRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    if (globalHeader) globalHeader.classList.remove('intro-hidden');
    if (typeof startHero === 'function') startHero();
    return;
  }

  introRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  introRenderer.setSize(width, height);
  introRenderer.setClearColor(0x03050b, 0);
  container.appendChild(introRenderer.domElement);

  // Lights (dynamic accent light morphs smoothly per chapter)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.72);
  introScene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0x00f5ff, 2.0);
  keyLight.position.set(110, 140, 80);
  introScene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xb366ff, 1.0);
  rimLight.position.set(-120, -100, -70);
  introScene.add(rimLight);

  // Root group (for subtle mouse parallax) + Globe group (for scroll rotation)
  const parallaxGroup = new THREE.Group();
  introScene.add(parallaxGroup);

  globeGroup = new THREE.Group();
  globeGroup.rotation.x = 0.26;
  globeGroup.rotation.y = 0.35;
  parallaxGroup.add(globeGroup);

  // ─── 2. HOLOGRAPHIC 3D GLOBE GEOMETRY (LIGHTWEIGHT & HIGH-CRAFT) ───

  // A. Fibonacci Point-Cloud Outer Sphere with Crisp Circular Glow Orbs (no square WebGL blocks)
  function createGlowDotTexture() {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0.0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.32, 'rgba(255,255,255,0.85)');
    grad.addColorStop(0.65, 'rgba(0,245,255,0.28)');
    grad.addColorStop(1.0, 'rgba(0,245,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }

  const particleCount = isMobileViewport() ? 1800 : 2800;
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
    size: isMobileViewport() ? 3.2 : 2.9,
    transparent: true,
    opacity: 0.88,
    alphaTest: 0.02,
    depthWrite: false,
    sizeAttenuation: true
  });
  const pointSphere = new THREE.Points(particleGeo, particleMat);
  globeGroup.add(pointSphere);

  // B. Inner Structural Wireframe + Subtle Core Shading
  const innerGeo = new THREE.SphereGeometry(98.2, 24, 24);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x063554,
    wireframe: true,
    transparent: true,
    opacity: 0.16
  });
  globeGroup.add(new THREE.Mesh(innerGeo, innerMat));

  const coreGeo = new THREE.SphereGeometry(96.5, 24, 24);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x040915,
    transparent: true,
    opacity: 0.72
  });
  globeGroup.add(new THREE.Mesh(coreGeo, coreMat));

  // C. Translucent Atmospheric Rim Halo Ring (billboard-like outer aura)
  const auraGeo = new THREE.SphereGeometry(106.5, 32, 32);
  const auraMat = new THREE.MeshBasicMaterial({
    color: 0x00f5ff,
    transparent: true,
    opacity: 0.045,
    side: THREE.BackSide
  });
  const auraMesh = new THREE.Mesh(auraGeo, auraMat);
  globeGroup.add(auraMesh);

  // D. Equator & Polar Meridian Graticule Lines
  [-30, 0, 30].forEach((latDeg) => {
    const latRad = latDeg * (Math.PI / 180);
    const r = Math.cos(latRad) * 100.6;
    const yPos = Math.sin(latRad) * 100.6;
    const pts = [];
    for (let i = 0; i <= 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * r, yPos, Math.sin(a) * r));
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const m = new THREE.LineBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: latDeg === 0 ? 0.18 : 0.08
    });
    globeGroup.add(new THREE.Line(g, m));
  });

  // E. Protruding Coordinate Beacons + Expanding 3D Target Halo Rings
  Object.keys(GEO_COORDINATES).forEach((key, idx) => {
    const coord = GEO_COORDINATES[key];
    const startPos = latLongToVector3(coord.lat, coord.lon, 98.5);
    const endPos = latLongToVector3(coord.lat, coord.lon, 113.5);

    const stemGeo = new THREE.BufferGeometry().setFromPoints([startPos, endPos]);
    const stemMat = new THREE.LineBasicMaterial({
      color: coord.color,
      transparent: true,
      opacity: 0.8
    });
    globeGroup.add(new THREE.Line(stemGeo, stemMat));

    const headGeo = new THREE.SphereGeometry(1.75, 10, 10);
    const headMat = new THREE.MeshBasicMaterial({
      color: coord.color,
      transparent: true,
      opacity: 0.96
    });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.copy(endPos);
    globeGroup.add(headMesh);

    // Expanding target pulse ring aligned tangent to globe surface
    const pulseRingGeo = new THREE.RingGeometry(2.6, 3.6, 24);
    const pulseRingMat = new THREE.MeshBasicMaterial({
      color: coord.color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55
    });
    const pulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat);
    pulseRing.position.copy(latLongToVector3(coord.lat, coord.lon, 101.2));
    pulseRing.lookAt(latLongToVector3(coord.lat, coord.lon, 160));
    globeGroup.add(pulseRing);

    pinDots.push({
      mesh: headMesh,
      sector: coord.sector,
      baseScale: 1.0,
      phase: idx * 0.9,
      speed: 0.055 + (idx % 3) * 0.015
    });

    targetRings.push({
      mesh: pulseRing,
      mat: pulseRingMat,
      sector: coord.sector,
      phase: idx * 0.37
    });
  });

  // F. Geodesic Data Arcs + Traveling Signal Light Packets
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
    const curveGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(42));
    const curveMat = new THREE.LineBasicMaterial({
      color: pair.color,
      transparent: true,
      opacity: 0.42
    });
    globeGroup.add(new THREE.Line(curveGeo, curveMat));

    // Glowing packet riding along the arc
    const pktGeo = new THREE.SphereGeometry(1.15, 8, 8);
    const pktMat = new THREE.MeshBasicMaterial({ color: pair.color, transparent: true, opacity: 0.95 });
    const pktMesh = new THREE.Mesh(pktGeo, pktMat);
    globeGroup.add(pktMesh);

    arcPackets.push({
      curve,
      mesh: pktMesh,
      offset: idx / connectionPairs.length,
      speed: pair.speed
    });
  });

  // G. Twin Orbital Telemetry Rings & Satellites
  const ring1Geo = new THREE.RingGeometry(129.4, 130.6, 80);
  const ring1Mat = new THREE.MeshBasicMaterial({
    color: 0x00f5ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.13
  });
  const cyberRing1 = new THREE.Mesh(ring1Geo, ring1Mat);
  cyberRing1.rotation.x = Math.PI / 2;
  cyberRing1.rotation.y = Math.PI / 6;
  globeGroup.add(cyberRing1);

  const ring2Geo = new THREE.RingGeometry(142.5, 143.3, 80);
  const ring2Mat = new THREE.MeshBasicMaterial({
    color: 0xb366ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.10
  });
  const cyberRing2 = new THREE.Mesh(ring2Geo, ring2Mat);
  cyberRing2.rotation.x = Math.PI / 2.6;
  cyberRing2.rotation.y = -Math.PI / 4;
  globeGroup.add(cyberRing2);

  const sat1 = new THREE.Mesh(
    new THREE.SphereGeometry(2.3, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0x00f5ff })
  );
  globeGroup.add(sat1);

  const sat2 = new THREE.Mesh(
    new THREE.SphereGeometry(1.85, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xb366ff })
  );
  globeGroup.add(sat2);

  // ─── 3. SUBTLE INTERACTIVE CURSOR PARALLAX (MAKES LAYER 1 IMMEDIATELY ALIVE) ───
  const pointer = { targetX: 0, targetY: 0, curX: 0, curY: 0 };
  window.addEventListener('pointermove', (e) => {
    if (!isInViewport || prefersReducedMotion) return;
    pointer.targetX = ((e.clientX / window.innerWidth) - 0.5) * 0.22;
    pointer.targetY = ((e.clientY / window.innerHeight) - 0.5) * 0.14;
  }, { passive: true });

  // ─── 4. CHAPTER STATE & COLOR MORPHING ───
  let activeChapterIdx = 0;
  const targetAccentColor = new THREE.Color(CHAPTERS[0].lightHex);
  const currentAccentColor = new THREE.Color(CHAPTERS[0].lightHex);
  const axisZ = new THREE.Vector3(0, 0, 1);
  const axisX = new THREE.Vector3(1, 0, 0);
  const satVec = new THREE.Vector3();

  // ─── 5. GPU-FRIENDLY ANIMATION LOOP ───
  let time = 0;
  let rafId = null;

  function updatePauseState() {
    const shouldPause = !isInViewport || document.hidden;
    if (shouldPause && !isPaused) {
      isPaused = true;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    } else if (!shouldPause && isPaused) {
      isPaused = false;
      tick();
    }
  }

  function tick() {
    if (isPaused) return;
    rafId = requestAnimationFrame(tick);

    time += 0.012;

    // Smooth cursor parallax damping
    pointer.curX += (pointer.targetX - pointer.curX) * 0.06;
    pointer.curY += (pointer.targetY - pointer.curY) * 0.06;
    parallaxGroup.rotation.y = pointer.curX;
    parallaxGroup.rotation.x = pointer.curY;

    // Gentle living globe drift layered smoothly on top of scroll rotation
    if (!prefersReducedMotion) {
      pointSphere.rotation.y = Math.sin(time * 0.18) * 0.02;
    }

    // Smoothly morph accent glow colors across chapters
    currentAccentColor.lerp(targetAccentColor, 0.06);
    keyLight.color.copy(currentAccentColor);
    auraMat.color.copy(currentAccentColor);
    ring1Mat.color.copy(currentAccentColor);

    const activeFocus = CHAPTERS[activeChapterIdx] ? CHAPTERS[activeChapterIdx].focusSectors : ['global'];

    // Pulse beacon heads (emphasized when in active chapter's sector)
    pinDots.forEach((node) => {
      const isFocused = activeFocus.includes(node.sector);
      const amp = isFocused ? 0.45 : 0.18;
      const base = isFocused ? 1.2 : 0.85;
      const scale = base + Math.sin(time * 28 * node.speed + node.phase) * amp;
      node.mesh.scale.set(scale, scale, scale);
    });

    // Expanding target shockwave rings
    targetRings.forEach((r) => {
      const isFocused = activeFocus.includes(r.sector);
      const cycle = (time * (isFocused ? 0.55 : 0.28) + r.phase) % 1;
      const s = 0.7 + cycle * (isFocused ? 2.8 : 1.5);
      r.mesh.scale.set(s, s, 1);
      r.mat.opacity = (1 - cycle) * (isFocused ? 0.68 : 0.22);
    });

    // Traveling light packets along curved geodesic data arcs
    arcPackets.forEach((pkt) => {
      const u = (time * pkt.speed + pkt.offset) % 1;
      pkt.curve.getPointAt(u, pkt.mesh.position);
    });

    // Twin orbital satellites
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

  tick();

  // Pause WebGL automatically when out of viewport or tab hidden
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      isInViewport = entry.isIntersecting;
      updatePauseState();
    });
  }, { threshold: 0.02 });
  observer.observe(scrollContainer);

  document.addEventListener('visibilitychange', updatePauseState);

  function handleResize() {
    if (!introRenderer || !introCamera) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    introCamera.aspect = w / h;
    introCamera.updateProjectionMatrix();
    introRenderer.setSize(w, h);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  window.addEventListener('resize', handleResize);

  // ─── 6. SHARED UI RENDERER FOR CHAPTER PROGRESS (DETERMINISTIC BOTH UP & DOWN) ───
  function renderChapterUI(progress) {
    // Identify current active chapter (0..3)
    let curIdx = 0;
    for (let i = 0; i < CHAPTERS.length; i++) {
      if (progress >= CHAPTERS[i].start) curIdx = i;
    }
    activeChapterIdx = curIdx;
    const curChapter = CHAPTERS[curIdx];
    targetAccentColor.setHex(curChapter.lightHex);

    // Update top telemetry HUD
    if (hudDot) {
      hudDot.style.background = curChapter.accentHex;
      hudDot.style.boxShadow = `0 0 10px ${curChapter.accentHex}`;
    }
    if (hudReadout) {
      hudReadout.textContent = `0${curIdx + 1}/04 · ${curChapter.hudSector} · ALT ${curChapter.alt}`;
    }
    if (hudScrollLabel) {
      hudScrollLabel.textContent = progress > 0.88
        ? 'ENTERING SOVEREIGN TERMINAL ↓'
        : `SCROLL TO EXPLORE · LAYER 0${curIdx + 1} / 04 ↓`;
    }
    if (globalFill) {
      globalFill.style.width = `${clamp01(progress / 0.94) * 100}%`;
    }
    if (hudBottom) {
      hudBottom.style.opacity = String(1 - smoothstep(0.90, 0.97, progress));
    }

    // Update each of the 4 slides smoothly from exact equal windows [start, end]
    const mobile = isMobileViewport();
    slides.forEach((slide, idx) => {
      const ch = CHAPTERS[idx];
      if (!ch) return;

      const local = (progress - ch.start) / (ch.end - ch.start); // 0..1 inside chapter
      let opacity = 0;
      let yShift = 28;
      let blurPx = 6;

      if (local >= 0 && local <= 1) {
        // Chapter 0 starts ALREADY crisp at progress = 0 (zero initial fade wait!)
        const enter = idx === 0 ? 1 : smoothstep(0.00, 0.14, local);
        const exit = 1 - smoothstep(0.86, 1.00, local);
        opacity = Math.min(enter, exit);

        // Subtle continuous Apple-style vertical parallax while dwelling
        if (local < 0.14 && idx !== 0) {
          yShift = (1 - enter) * 26;
          blurPx = (1 - enter) * 5;
        } else if (local > 0.86) {
          const outT = smoothstep(0.86, 1.00, local);
          yShift = -outT * 24;
          blurPx = outT * 5;
        } else {
          // Gentle living drift across dwell window
          yShift = 4 - local * 8;
          blurPx = 0;
        }
      }

      slide.style.opacity = opacity.toFixed(3);
      slide.style.transform = `translate3d(0, ${yShift.toFixed(1)}px, 0)`;
      slide.style.filter = blurPx > 0.1 ? `blur(${blurPx.toFixed(1)}px)` : 'none';
      slide.classList.toggle('active', opacity > 0.45);

      // Update per-slide live dwell underline bar
      const dwellBar = slide.querySelector('.slide-dwell-fill');
      if (dwellBar) {
        dwellBar.style.width = `${clamp01(local) * 100}%`;
      }

      // Update chapter progress rail pill
      const pill = chapterPills[idx];
      if (pill) {
        pill.classList.toggle('active', idx === curIdx && progress < 0.95);
        pill.setAttribute('aria-current', idx === curIdx ? 'step' : 'false');
        const fill = pill.querySelector('.intro-chapter-fill');
        if (fill) {
          const pct = `${clamp01(local) * 100}%`;
          if (mobile) {
            fill.style.width = pct;
            fill.style.height = '100%';
          } else {
            fill.style.height = pct;
            fill.style.width = '100%';
          }
        }
      }
    });

    // Global header visibility & Hero activation right at clean 92% handoff
    if (globalHeader) {
      if (progress >= 0.92) {
        globalHeader.classList.remove('intro-hidden');
      } else {
        globalHeader.classList.add('intro-hidden');
      }
    }

    if (progress >= 0.91 && !startHeroTriggered) {
      startHeroTriggered = true;
      if (typeof startHero === 'function') startHero();
    }
  }

  // ─── 7. REDUCED MOTION ACCESSIBLE MODE (INTERACTIVE CHAPTER SWITCHER, NO 840VH LOCK) ───
  if (prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    scrollContainer.classList.add('intro-reduced');
    if (globalHeader) globalHeader.classList.remove('intro-hidden');
    if (typeof startHero === 'function') startHero();

    const showStaticChapter = (idx) => {
      const ch = CHAPTERS[idx] || CHAPTERS[0];
      const midProgress = (ch.start + ch.end) / 2;
      renderChapterUI(midProgress);
      const rot = getCameraRotationForCoord(ch.lat, ch.lon);
      globeGroup.rotation.y = rot.rotY;
      globeGroup.rotation.x = rot.rotX;
      globeGroup.position.x = isMobileViewport() ? 0 : 48;
      introCamera.position.z = isMobileViewport() ? 310 : 250;
    };

    chapterPills.forEach((pill, idx) => {
      pill.addEventListener('click', () => showStaticChapter(idx));
    });
    showStaticChapter(0);
    return;
  }

  // ─── 8. GSAP SCROLLTRIGGER 4-CHAPTER MASTER CHOREOGRAPHY ───
  gsap.registerPlugin(ScrollTrigger);

  if (globalHeader) globalHeader.classList.add('intro-hidden');

  const desk = !isMobileViewport();
  const globeAnimState = {
    rotY: 0.35,
    rotX: 0.24,
    camX: 0,
    camY: 0,
    camZ: desk ? 345 : 465,
    posX: desk ? 58 : 0,
    posY: desk ? 0 : 62,
    canvasOpacity: 1
  };

  function applyThreeState() {
    globeGroup.rotation.y = globeAnimState.rotY;
    globeGroup.rotation.x = globeAnimState.rotX;
    introCamera.position.x = globeAnimState.camX;
    introCamera.position.y = globeAnimState.camY;
    introCamera.position.z = globeAnimState.camZ;
    globeGroup.position.x = globeAnimState.posX;
    globeGroup.position.y = globeAnimState.posY;
    container.style.opacity = globeAnimState.canvasOpacity.toFixed(3);
  }
  applyThreeState();
  renderChapterUI(0);

  // Total normalized duration = 10.0 units (maps 1:1 to 0.00 -> 1.00 scroll progress!)
  //   0.00 -> 2.30 : Layer 01 (23%) — Sweeping planetary orbit + zoom-in across Americas & Atlantic
  //   2.30 -> 4.60 : Layer 02 (23%) — Banked swoop into Eastern Europe / Kyiv & Red Sea conflict arcs
  //   4.60 -> 6.90 : Layer 03 (23%) — Orbital slew across Brussels & Asia-Pacific / Malacca & Taiwan compute corridor
  //   6.90 -> 9.20 : Layer 04 (23%) — Strategic command pullback + full constellation illumination
  //   9.20 -> 10.0 : Handoff  ( 8%) — Graceful canvas dissolve into Hero Terminal
  animTimeline = gsap.timeline({
    defaults: { ease: 'power1.inOut' },
    scrollTrigger: {
      trigger: '#intro-scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.9,
      pin: '#intro-sticky-stage',
      pinSpacing: false,
      onLeave: () => {
        if (globalHeader) globalHeader.classList.remove('intro-hidden');
        if (!startHeroTriggered) {
          startHeroTriggered = true;
          if (typeof startHero === 'function') startHero();
        }
      },
      onEnterBack: () => {
        if (globalHeader) globalHeader.classList.add('intro-hidden');
      },
      onUpdate: (self) => {
        renderChapterUI(self.progress);
      }
    }
  });

  introTrigger = animTimeline.scrollTrigger;

  // LAYER 01 (0.0 -> 2.3): Wide orbital establish -> dynamic rotation & approach
  animTimeline.to(globeAnimState, {
    rotY: 2.05,
    rotX: 0.34,
    camZ: desk ? 302 : 428,
    posX: desk ? 60 : 0,
    posY: desk ? 2 : 64,
    duration: 2.3,
    onUpdate: applyThreeState
  }, 0.0);

  // LAYER 02 (2.3 -> 4.6): Swoop into Eastern Europe / Kyiv & Red Sea arcs (keeping full 3D curvature framed!)
  const eeRot = getCameraRotationForCoord(GEO_COORDINATES.kyiv.lat - 8, GEO_COORDINATES.kyiv.lon - 6);
  animTimeline.to(globeAnimState, {
    rotY: eeRot.rotY,
    rotX: eeRot.rotX,
    camZ: desk ? 256 : 386,
    posX: desk ? 66 : 0,
    posY: desk ? -4 : 66,
    duration: 1.15,
    ease: 'power2.inOut',
    onUpdate: applyThreeState
  }, 2.3);
  // Living orbital micro-pan during Layer 02 dwell
  animTimeline.to(globeAnimState, {
    rotY: eeRot.rotY + 0.42,
    rotX: eeRot.rotX - 0.08,
    camZ: desk ? 244 : 374,
    duration: 1.15,
    ease: 'none',
    onUpdate: applyThreeState
  }, 3.45);

  // LAYER 03 (4.6 -> 6.9): Sweep into Asia-Pacific / Taiwan Strait & Malacca Corridor
  const seRot = getCameraRotationForCoord(GEO_COORDINATES.malacca.lat + 10, GEO_COORDINATES.malacca.lon - 4);
  animTimeline.to(globeAnimState, {
    rotY: seRot.rotY,
    rotX: seRot.rotX,
    camZ: desk ? 248 : 382,
    posX: desk ? 66 : 0,
    posY: desk ? 2 : 64,
    duration: 1.15,
    ease: 'power2.inOut',
    onUpdate: applyThreeState
  }, 4.6);
  // Living orbital micro-pan across Taiwan & Singapore during Layer 03 dwell
  animTimeline.to(globeAnimState, {
    rotY: seRot.rotY - 0.36,
    rotX: seRot.rotX + 0.12,
    camZ: desk ? 258 : 390,
    duration: 1.15,
    ease: 'none',
    onUpdate: applyThreeState
  }, 5.75);

  // LAYER 04 (6.9 -> 9.2): Command pullback + full constellation framing alongside Layer 04 card
  animTimeline.to(globeAnimState, {
    rotY: seRot.rotY + 1.55,
    rotX: 0.24,
    camZ: desk ? 292 : 422,
    posX: desk ? 62 : 0,
    posY: desk ? 2 : 60,
    duration: 2.3,
    ease: 'power1.inOut',
    onUpdate: applyThreeState
  }, 6.9);

  // HANDOFF (9.2 -> 10.0): Smooth dissolve directly into Hero
  animTimeline.to(globeAnimState, {
    rotY: seRot.rotY + 2.1,
    camZ: desk ? 268 : 395,
    canvasOpacity: 0,
    duration: 0.8,
    ease: 'power2.in',
    onUpdate: applyThreeState
  }, 9.2);

  // Wire clickable chapter pills on right rail / mobile bar
  chapterPills.forEach((pill, idx) => {
    pill.addEventListener('click', () => {
      const ch = CHAPTERS[idx];
      if (!ch || !introTrigger) return;
      const targetProgress = ch.start + (ch.end - ch.start) * 0.24; // Land cleanly in crisp dwell zone
      const targetScrollY = introTrigger.start + (introTrigger.end - introTrigger.start) * targetProgress;
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    });
  });
}

window.startIntro = startIntro;
