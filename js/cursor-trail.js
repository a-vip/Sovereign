/**
 * Sovereign — High-Performance Luminous Cursor Trail (Adapted from aviperera.com v2 Zero-Lag Engine)
 *
 * - 0% CPU/GPU overhead when idle (immediate RAF sleep after 180ms)
 * - Zero `shadowBlur` (no GPU readback or software rasterizer lag)
 * - Dual-pass luminous cyan-to-violet quadratic spline ribbon + tip photon + micro-sparkles
 * - Strictly disabled on touch screens (`pointer: coarse`) and `prefers-reduced-motion: reduce`
 * - Completely inert pointer-events: never intercepts clicks, scrolling, or form inputs
 */
(function () {
  'use strict';

  if (typeof window === 'undefined') return;
  if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const CONFIG = {
    trailLength: 14,
    springDampening: 0.45,
    maxParticles: 12,
    glowWidth: 7.2,
    coreWidth: 2.2,
    idleSleepDelay: 180
  };

  let canvas, ctx;
  let width = 0, height = 0, dpr = 1;
  let isHoveringInteractive = false;
  let isRunning = false;
  let rafId = null;
  let lastMoveTime = 0;

  const mouse = { x: -100, y: -100, targetX: -100, targetY: -100, isInside: false };
  const trailPoints = [];
  const particles = [];

  class MicroSparkle {
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 5;
      this.y = y + (Math.random() - 0.5) * 5;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.78 + 0.22;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 0.22;
      this.size = Math.random() * 1.5 + 0.8;
      this.alpha = 0.86;
      this.decay = Math.random() * 0.035 + 0.025;
      this.isViolet = Math.random() > 0.65;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.size *= 0.965;
      this.alpha -= this.decay;
      return this.alpha > 0 && this.size > 0.2;
    }

    draw(context) {
      context.fillStyle = this.isViolet
        ? `rgba(192, 132, 252, ${this.alpha.toFixed(2)})`
        : `rgba(207, 250, 254, ${this.alpha.toFixed(2)})`;
      context.beginPath();
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      context.fill();
    }
  }

  function resize() {
    if (!canvas || !ctx) return;
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initCanvas() {
    if (document.getElementById('sov-cursor-trail-canvas')) return;
    canvas = document.createElement('canvas');
    canvas.id = 'sov-cursor-trail-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.setAttribute('role', 'presentation');

    Object.assign(canvas.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: '999990',
      userSelect: 'none',
      webkitUserSelect: 'none',
      display: 'block'
    });

    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d', { alpha: true });
    resize();
    window.addEventListener('resize', resize, { passive: true });

    for (let i = 0; i < CONFIG.trailLength; i++) {
      trailPoints.push({ x: -100, y: -100 });
    }
  }

  function wakeUp() {
    lastMoveTime = performance.now();
    if (!isRunning) {
      isRunning = true;
      rafId = requestAnimationFrame(render);
    }
  }

  function render(currentTime) {
    if (!isRunning || !ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'screen';

    mouse.x += (mouse.targetX - mouse.x) * CONFIG.springDampening;
    mouse.y += (mouse.targetY - mouse.y) * CONFIG.springDampening;

    if (mouse.isInside) {
      trailPoints[0].x += (mouse.x - trailPoints[0].x) * 0.75;
      trailPoints[0].y += (mouse.y - trailPoints[0].y) * 0.75;

      for (let i = 1; i < trailPoints.length; i++) {
        const prev = trailPoints[i - 1];
        const curr = trailPoints[i];
        curr.x += (prev.x - curr.x) * 0.6;
        curr.y += (prev.y - curr.y) * 0.6;
      }
    }

    if (mouse.isInside && trailPoints[0].x > 0) {
      ctx.beginPath();
      ctx.moveTo(trailPoints[0].x, trailPoints[0].y);
      for (let i = 0; i < trailPoints.length - 1; i++) {
        const midX = (trailPoints[i].x + trailPoints[i + 1].x) * 0.5;
        const midY = (trailPoints[i].y + trailPoints[i + 1].y) * 0.5;
        ctx.quadraticCurveTo(trailPoints[i].x, trailPoints[i].y, midX, midY);
      }

      const head = trailPoints[0];
      const tail = trailPoints[trailPoints.length - 1];

      // Pass 1: Ambient cyan -> violet aura
      const auraGrad = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
      auraGrad.addColorStop(0.0, 'rgba(0, 245, 255, 0.36)');
      auraGrad.addColorStop(0.45, 'rgba(139, 92, 246, 0.20)');
      auraGrad.addColorStop(1.0, 'rgba(179, 102, 255, 0)');

      ctx.strokeStyle = auraGrad;
      ctx.lineWidth = isHoveringInteractive ? CONFIG.glowWidth * 1.32 : CONFIG.glowWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Pass 2: White-hot -> electric cyan -> cyber violet core filament
      const coreGrad = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
      coreGrad.addColorStop(0.0, '#ffffff');
      coreGrad.addColorStop(0.22, '#00f5ff');
      coreGrad.addColorStop(0.68, '#b366ff');
      coreGrad.addColorStop(1.0, 'rgba(179, 102, 255, 0)');

      ctx.strokeStyle = coreGrad;
      ctx.lineWidth = isHoveringInteractive ? CONFIG.coreWidth * 1.28 : CONFIG.coreWidth;
      ctx.stroke();

      // Pass 3: Leading tip photon
      ctx.beginPath();
      ctx.arc(head.x, head.y, isHoveringInteractive ? 2.8 : 2.0, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (p.update()) {
        p.draw(ctx);
      } else {
        particles.splice(i, 1);
      }
    }

    const elapsed = currentTime - lastMoveTime;
    if (elapsed > CONFIG.idleSleepDelay && particles.length === 0) {
      const head = trailPoints[0];
      const tail = trailPoints[trailPoints.length - 1];
      const dist = Math.hypot(head.x - tail.x, head.y - tail.y);
      if (dist < 1 || !mouse.isInside) {
        ctx.clearRect(0, 0, width, height);
        isRunning = false;
        if (rafId) cancelAnimationFrame(rafId);
        return;
      }
    }

    rafId = requestAnimationFrame(render);
  }

  let prevX = 0, prevY = 0;

  function onMouseMove(e) {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;

    if (!mouse.isInside) {
      mouse.isInside = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      for (let i = 0; i < trailPoints.length; i++) {
        trailPoints[i].x = e.clientX;
        trailPoints[i].y = e.clientY;
      }
    }

    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;
    prevX = e.clientX;
    prevY = e.clientY;

    if (dx * dx + dy * dy > 36 && particles.length < CONFIG.maxParticles && Math.random() < 0.30) {
      particles.push(new MicroSparkle(e.clientX, e.clientY));
    }

    wakeUp();
  }

  function onMouseLeave() {
    mouse.isInside = false;
    wakeUp();
  }

  function onMouseDown(e) {
    if (particles.length < CONFIG.maxParticles - 2) {
      particles.push(new MicroSparkle(e.clientX, e.clientY));
      particles.push(new MicroSparkle(e.clientX, e.clientY));
      wakeUp();
    }
  }

  function onPointerOver(e) {
    const t = e.target;
    isHoveringInteractive = !!(
      t &&
      (
        t.tagName === 'A' ||
        t.tagName === 'BUTTON' ||
        t.tagName === 'INPUT' ||
        t.tagName === 'TEXTAREA' ||
        t.tagName === 'SELECT' ||
        (typeof t.closest === 'function' && t.closest('a, button, [role="button"], .feature-card, .uc-card, .pricing-card, .support-card'))
      )
    );
  }

  function onPointerOut(e) {
    if (!e.relatedTarget) isHoveringInteractive = false;
  }

  function start() {
    initCanvas();
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
