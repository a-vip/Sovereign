/* ── PREMIUM NON-BLOCKING SVG EMBLEM BOOT SEQUENCE (PRE-WARMS 3D GLOBE IN PARALLEL) ── */
const bootLines = [
  { statusText: 'Syncing live intelligence layers...', delay: 0 },
  { statusText: 'Calibrating 3D orbital globe...', delay: 260 },
  { statusText: 'Verifying citation-locked AI...', delay: 540 },
  { statusText: 'Systems ready.', delay: 800 },
];
let bootDone = false;

function dismissBoot() {
  if (bootDone) return;
  bootDone = true;
  const ol = document.getElementById('boot-ol');
  if (ol) {
    ol.classList.add('boot-exit');
    setTimeout(() => {
      ol.style.display = 'none';
    }, 480);
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
  const bar      = document.getElementById('boot-bar');

  // Pre-warm the 3D globe immediately behind the curtain for zero black pause
  if (typeof startIntro === 'function') {
    startIntro();
  }

  // Instant skip for returning tabs, cross-page transitions, hash links, restored scroll, or reduced-motion
  const hasDeepLink = window.location.hash && window.location.hash.length > 1;
  let fromInternalNav = false;
  try {
    const ts = Number(sessionStorage.getItem('sov_page_transition_ts') || 0);
    if (ts && Date.now() - ts < 3500) fromInternalNav = true;
  } catch {}

  if (
    hasDeepLink ||
    fromInternalNav ||
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
  if (!ol || !bar) return;

  // Click anywhere, scroll, or press Escape/Space to dismiss immediately
  ol.addEventListener('click', (e) => {
    if (e.target === ol) dismissBoot();
  });
  window.addEventListener('wheel', dismissBoot, { once: true, passive: true });
  window.addEventListener('touchmove', dismissBoot, { once: true, passive: true });
  document.addEventListener('keydown', (e) => {
    if (!bootDone && (e.key === 'Escape' || e.key === ' ')) dismissBoot();
  }, { once: true });

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
        setTimeout(() => dismissBoot(), 260);
      }
    }, delay);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runBoot);
} else {
  runBoot();
}
