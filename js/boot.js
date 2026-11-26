/* ── FAST NON-BLOCKING BOOT SEQUENCE (PRE-WARMS 3D GLOBE IN PARALLEL) ── */
const bootLines = [
  { statusText: 'Initializing encrypted data channel...', delay: 0 },
  { statusText: 'Syncing orbital & regulatory telemetry...', delay: 220 },
  { statusText: 'All systems operational. Signal clear.', delay: 480 },
  { statusText: 'Welcome to Sovereign Intel.', delay: 720 },
];
let bootDone = false;

function dismissBoot() {
  if (bootDone) return;
  bootDone = true;
  const ol = document.getElementById('boot-ol');
  if (ol) {
    ol.style.pointerEvents = 'none';
    ol.style.opacity = '0';
    setTimeout(() => {
      ol.style.display = 'none';
    }, 420);
  }
  if (typeof startIntro === 'function') {
    startIntro();
  } else if (typeof startHero === 'function') {
    startHero();
  }
}
window.dismissBoot = dismissBoot;

function runBoot() {
  const ol       = document.getElementById('boot-ol');
  const statusEl = document.getElementById('boot-status');
  const barWrap  = document.getElementById('boot-bar-wrap');
  const bar      = document.getElementById('boot-bar');

  // Pre-warm the 3D globe immediately behind the curtain so there is zero black pause
  if (typeof startIntro === 'function') {
    startIntro();
  }

  // Instant skip for returning tabs, hash deep-links, restored scroll position, or reduced-motion users
  const hasDeepLink = window.location.hash && window.location.hash.length > 1;
  if (
    hasDeepLink ||
    window.scrollY > 20 ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    sessionStorage.getItem('bootPlayed') === 'true'
  ) {
    if (ol) ol.style.display = 'none';
    bootDone = true;
    if (hasDeepLink && typeof startHero === 'function') {
      const gh = document.getElementById('global-header');
      if (gh) gh.classList.remove('intro-hidden');
      startHero();
    }
    return;
  }

  sessionStorage.setItem('bootPlayed', 'true');
  if (!ol || !barWrap || !bar) return;

  // Click anywhere, scroll, or press Escape/Space to dismiss immediately
  ol.addEventListener('click', (e) => {
    if (e.target === ol) dismissBoot();
  });
  window.addEventListener('wheel', dismissBoot, { once: true, passive: true });
  window.addEventListener('touchmove', dismissBoot, { once: true, passive: true });
  document.addEventListener('keydown', (e) => {
    if (!bootDone && (e.key === 'Escape' || e.key === ' ')) dismissBoot();
  }, { once: true });

  barWrap.style.display = 'block';

  let completed = 0;
  bootLines.forEach(({ statusText, delay }) => {
    setTimeout(() => {
      if (bootDone) return;
      completed++;
      if (statusEl) {
        statusEl.textContent = statusText;
        if (completed === bootLines.length) {
          statusEl.style.color = '#00f5ff';
        }
      }
      bar.style.width = ((completed / bootLines.length) * 100) + '%';
      if (completed === bootLines.length) {
        setTimeout(() => dismissBoot(), 280);
      }
    }, delay);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runBoot);
} else {
  runBoot();
}
