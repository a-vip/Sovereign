/* ─── SOVEREIGN 3D SCROLL INTRODUCTION SYSTEM ─── */
let introScene, introCamera, introRenderer, globeGroup;
let pinDots = [];
let animTimeline;
let isPaused = false;
let startHeroTriggered = false;

// Coordinates dictionary (Latitude, Longitude) for key telemetries
const GEO_COORDINATES = {
  kyiv:     { lat: 50.45,  lon: 30.52,  color: '#ff2244', name: 'TACTICAL CONFLICT // UKRAINE' },
  malacca:  { lat: 1.35,   lon: 103.80, color: '#ffd22e', name: 'MARITIME CHOKEPOINT // SINGAPORE' },
  taiwan:   { lat: 24.40,  lon: 119.50, color: '#00f5ff', name: 'SURVEILLANCE NODE // TAIWAN STRAIT' },
  suez:     { lat: 29.97,  lon: 32.53,  color: '#ff6b00', name: 'TRADE BLOCKADE // SUEZ CANAL' },
  sahel:    { lat: 15.00,  lon: 10.00,  color: '#ff2244', name: 'MILITARY DISRUPTION // SAHEL' },
  brussels: { lat: 50.85,  lon: 4.35,   color: '#b366ff', name: 'COMMAND NODE // BRUSSELS HQ' }
};

// Helper: Translate Latitude/Longitude to 3D Cartesian coordinates on a sphere of radius R
function latLongToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);
  
  return new THREE.Vector3(x, y, z);
}

// ─── INITIALIZATION FUNCTION ───
function startIntro() {
  const container = document.getElementById('intro-canvas-container');
  if (!container) {
    // If element is not present, skip and directly launch main page
    if (typeof startHero === 'function') startHero();
    return;
  }

  // 1. Scene, Camera, Renderer setup
  introScene = new THREE.Scene();
  introScene.fog = new THREE.FogExp2(0x03050b, 0.0028);

  const width = window.innerWidth;
  const height = window.innerHeight;
  introCamera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
  introCamera.position.z = 320;

  introRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  introRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Lock ratio to 2 for performance
  introRenderer.setSize(width, height);
  introRenderer.setClearColor(0x03050b, 0);
  container.appendChild(introRenderer.domElement);

  // 2. Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  introScene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0x00f5ff, 1.8);
  dirLight1.position.set(100, 150, 50);
  introScene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xff6b00, 0.9);
  dirLight2.position.set(-100, -150, -50);
  introScene.add(dirLight2);

  // 3. Globe Base Group
  globeGroup = new THREE.Group();
  globeGroup.rotation.x = 0.28; // Tilting the Earth axis slightly
  introScene.add(globeGroup);

  // ─── BUILD GORGEOUS 3D HOLOGRAPHIC GLOBE ───

  // A. Point-Cloud Geodesic Outer Sphere (Apple-style dots)
  const particleCount = 2400;
  const particlePoints = [];
  const tempVec = new THREE.Vector3();
  
  for (let i = 0; i < particleCount; i++) {
    // Fibonacci sphere algorithm to distribute points evenly
    const y = 1 - (i / (particleCount - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = 2.3999632 * i; // golden angle
    
    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;
    
    tempVec.set(x, y, z).multiplyScalar(100);
    particlePoints.push(tempVec.x, tempVec.y, tempVec.z);
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(particlePoints, 3));
  
  const particleMat = new THREE.PointsMaterial({
    color: 0x00f5ff,
    size: 1.25,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true
  });
  
  const pointSphere = new THREE.Points(particleGeo, particleMat);
  globeGroup.add(pointSphere);

  // B. Concentric Interior Wireframe Sphere (Structure)
  const innerGeo = new THREE.SphereGeometry(98, 22, 22);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x003355,
    wireframe: true,
    transparent: true,
    opacity: 0.14
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  globeGroup.add(innerMesh);

  // C. Protruding Coordinate Beacons (Pins)
  Object.keys(GEO_COORDINATES).forEach(key => {
    const coord = GEO_COORDINATES[key];
    const startPos = latLongToVector3(coord.lat, coord.lon, 98);
    const endPos = latLongToVector3(coord.lat, coord.lon, 115);

    // Pin stem line
    const stemGeo = new THREE.BufferGeometry().setFromPoints([startPos, endPos]);
    const stemMat = new THREE.LineBasicMaterial({
      color: coord.color,
      transparent: true,
      opacity: 0.75
    });
    const stemLine = new THREE.Line(stemGeo, stemMat);
    globeGroup.add(stemLine);

    // Pin pulsing node head
    const headGeo = new THREE.SphereGeometry(1.6, 8, 8);
    const headMat = new THREE.MeshBasicMaterial({
      color: coord.color,
      transparent: true,
      opacity: 0.95
    });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.copy(endPos);
    globeGroup.add(headMesh);

    // Keep track of node heads for pulsing size scale in ticks
    pinDots.push({
      mesh: headMesh,
      baseScale: 1.0,
      speed: 0.05 + Math.random() * 0.04
    });
  });

  // D. Data Arcs (Bezier curves connecting nodes)
  const connectionPairs = [
    { from: GEO_COORDINATES.kyiv,     to: GEO_COORDINATES.suez,     altitude: 0.18, color: '#ff2244' },
    { from: GEO_COORDINATES.taiwan,   to: GEO_COORDINATES.malacca,  altitude: 0.22, color: '#00f5ff' },
    { from: GEO_COORDINATES.brussels, to: GEO_COORDINATES.sahel,    altitude: 0.28, color: '#b366ff' },
    { from: GEO_COORDINATES.kyiv,     to: GEO_COORDINATES.brussels, altitude: 0.12, color: '#00ff88' }
  ];

  connectionPairs.forEach(pair => {
    const v1 = latLongToVector3(pair.from.lat, pair.from.lon, 100);
    const v2 = latLongToVector3(pair.to.lat, pair.to.lon, 100);
    
    // Middle control vector pulled outwards to curve the line
    const dist = v1.distanceTo(v2);
    const midPoint = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
    midPoint.normalize().multiplyScalar(100 + dist * pair.altitude);

    const curve = new THREE.QuadraticBezierCurve3(v1, midPoint, v2);
    const curvePoints = curve.getPoints(36);
    
    const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const curveMat = new THREE.LineBasicMaterial({
      color: pair.color,
      transparent: true,
      opacity: 0.45
    });
    
    const arcLine = new THREE.Line(curveGeo, curveMat);
    globeGroup.add(arcLine);
  });

  // E. Cyber Satellite Ring
  const ringGeo = new THREE.RingGeometry(130, 131, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00f5ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.08
  });
  const cyberRing = new THREE.Mesh(ringGeo, ringMat);
  cyberRing.rotation.x = Math.PI / 2;
  cyberRing.rotation.y = Math.PI / 6;
  globeGroup.add(cyberRing);

  // Satellite orbiting on the ring
  const satGeo = new THREE.SphereGeometry(2.4, 8, 8);
  const satMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff });
  const satellite = new THREE.Mesh(satGeo, satMat);
  globeGroup.add(satellite);

  // ─── TICK & ANIMATION LOOP ───
  let time = 0;
  function tick() {
    if (isPaused) return;

    requestAnimationFrame(tick);

    time += 0.01;

    // Ambient globe drift (only active if GSAP is not overriding fully)
    if (!animTimeline || !animTimeline.isActive()) {
      globeGroup.rotation.y += 0.002;
    }

    // Pulse node heads
    pinDots.forEach(node => {
      const scale = node.baseScale + Math.sin(time * 30 * node.speed) * 0.35;
      node.mesh.scale.set(scale, scale, scale);
    });

    // Animate satellite orbit
    const orbitAngle = time * 0.4;
    const satRadius = 130.5;
    // Map to the tilted orbit plane
    const satX = Math.cos(orbitAngle) * satRadius;
    const satZ = Math.sin(orbitAngle) * satRadius;
    
    tempVec.set(satX, 0, satZ);
    tempVec.applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 6); // Rotate ring tilt
    tempVec.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    satellite.position.copy(tempVec);

    introRenderer.render(introScene, introCamera);
  }

  // Kick off render loops
  tick();

  // ─── VIEWPORT RESIZING ───
  function handleResize() {
    if (!introRenderer || !introCamera) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    introCamera.aspect = w / h;
    introCamera.updateProjectionMatrix();
    introRenderer.setSize(w, h);
  }
  window.addEventListener('resize', handleResize);

  // ─── AUTO-PAUSE RENDER ENGINE ON VIEWPORT LEAVE ───
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (isPaused) {
          isPaused = false;
          tick(); // Resume
        }
      } else {
        isPaused = true; // Stop rendering loops when out of view
      }
    });
  }, { threshold: 0.05 });
  
  observer.observe(document.getElementById('intro-scroll-container'));

  // ─── GSAP SCROLLTRIGGER SEQUENCING ───
  
  // Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  const slides = document.querySelectorAll('.intro-slide');
  const globalHeader = document.getElementById('global-header');

  // Initial State
  if (slides.length > 0) slides[0].classList.add('active');
  if (globalHeader) globalHeader.classList.add('intro-hidden');

  // Let's create an animation target object for GSAP to interpolate smoothly
  const globeAnimState = {
    rotY: globeGroup.rotation.y,
    rotX: globeGroup.rotation.x,
    camX: 0,
    camY: 0,
    camZ: 320,
    posX: 0,
    posY: 0,
    canvasOpacity: 1
  };

  // Bind properties to Three.js objects inside GSAP update loops
  function updateThreeObjects() {
    globeGroup.rotation.y = globeAnimState.rotY;
    globeGroup.rotation.x = globeAnimState.rotX;
    introCamera.position.x = globeAnimState.camX;
    introCamera.position.y = globeAnimState.camY;
    introCamera.position.z = globeAnimState.camZ;
    globeGroup.position.x = globeAnimState.posX;
    globeGroup.position.y = globeAnimState.posY;
    
    const canvasWrap = document.getElementById('intro-canvas-container');
    if (canvasWrap) canvasWrap.style.opacity = globeAnimState.canvasOpacity;
  }

  // Create GSAP Scroll-linked Timeline
  animTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#intro-scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2, // Smoother scrub easing for slow majestic pacing
      onUpdate: (self) => {
        // Toggle the global header when scroll reaches 85% depth (previous hero page entry)
        if (globalHeader) {
          if (self.progress >= 0.85) {
            globalHeader.classList.remove('intro-hidden');
          } else {
            globalHeader.classList.add('intro-hidden');
          }
        }

        // Trigger typewriter boot transition to Hero at 88% depth
        if (self.progress >= 0.88 && !startHeroTriggered) {
          startHeroTriggered = true;
          if (typeof startHero === 'function') startHero();
        }
      }
    }
  });

  // Helper to calculate camera orientation towards a latitude/longitude coordinate
  function getCameraRotationForCoord(lat, lon) {
    const targetVec = latLongToVector3(lat, lon, 100);
    // Find absolute angles needed to place coord at the center-front facing camera
    const rotY = -((lon + 180) * (Math.PI / 180)) + Math.PI / 2;
    const rotX = (lat) * (Math.PI / 180) - 0.28;
    return { rotX, rotY };
  }

  // 1. Initial slow majestical spin segment (Slide 1 Active)
  animTimeline.to(globeAnimState, {
    rotY: '+=1.6',
    camZ: 300,
    duration: 2.0, // Stretched from 1.0
    onUpdate: updateThreeObjects
  });

  // Transition Slide 1 Out -> Slide 2 In (Scroll progress ~22%)
  animTimeline.add(() => {
    toggleSlide(0);
  }, 1.8);

  // 2. Pivot camera & zoom into Eastern Europe / Ukraine (Slide 2 Active)
  const eeRot = getCameraRotationForCoord(GEO_COORDINATES.kyiv.lat, GEO_COORDINATES.kyiv.lon);
  animTimeline.to(globeAnimState, {
    rotY: eeRot.rotY,
    rotX: eeRot.rotX,
    camZ: 185, // Zoom in closer
    duration: 2.6, // Stretched from 1.2
    onUpdate: updateThreeObjects
  });

  // Transition Slide 2 Out -> Slide 3 In (Scroll progress ~52%)
  animTimeline.add(() => {
    toggleSlide(1);
  }, 4.4);

  // 3. Pivot camera & zoom into Southeast Asia / Malacca (Slide 3 Active)
  const seRot = getCameraRotationForCoord(GEO_COORDINATES.malacca.lat, GEO_COORDINATES.malacca.lon);
  animTimeline.to(globeAnimState, {
    rotY: seRot.rotY,
    rotX: seRot.rotX,
    camZ: 170, // Zoom even closer
    duration: 2.6, // Stretched from 1.2
    onUpdate: updateThreeObjects
  });

  // Transition Slide 3 Out -> Slide 4 In (Scroll progress ~78%)
  animTimeline.add(() => {
    toggleSlide(2);
  }, 7.0);

  // 4. Slide 4: Translate globe to the right and scale down to match Hero live preview card
  // On desktop: shifts right (+60). On mobile: stays centered.
  const isDesktop = window.innerWidth > 900;
  const finalPosX = isDesktop ? 60 : 0;
  const finalPosY = isDesktop ? 5 : -10;
  const finalCamZ = isDesktop ? 220 : 190;
  
  animTimeline.to(globeAnimState, {
    rotY: '+=2.4', // Spin earth to transition smoothly
    rotX: 0.28,    // Restore default tilt axial values
    camZ: finalCamZ,
    posX: finalPosX,
    posY: finalPosY,
    duration: 2.8, // Stretched from 1.4
    onUpdate: updateThreeObjects
  });

  // Transition Slide 4 Out -> Fade Canvas to transparent (Scroll progress ~94%)
  animTimeline.add(() => {
    toggleSlide(3);
  }, 9.8);

  animTimeline.to(globeAnimState, {
    canvasOpacity: 0,
    duration: 1.6, // Stretched from 0.8
    onUpdate: updateThreeObjects
  });

  // Helper function to handle slide element active toggles
  function toggleSlide(activeIndex) {
    slides.forEach((slide, idx) => {
      if (idx === activeIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }
}

// Make globally accessible
window.startIntro = startIntro;
window.startIntro = startIntro;
