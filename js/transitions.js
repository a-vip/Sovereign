/* ─── SOVEREIGN CROSS-PAGE TRANSITION CONTROLLER ─── */
(function initPageTransitions() {
  const STORAGE_KEY = 'sov_page_transition_ts';
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  function buildVeil() {
    let veil = document.getElementById('sov-page-veil');
    if (veil) return veil;
    veil = document.createElement('div');
    veil.id = 'sov-page-veil';
    veil.setAttribute('aria-hidden', 'true');
    veil.innerHTML = `
      <svg class="veil-svg" viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="veilGrad" x1="0" y1="0" x2="78" y2="78" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#00f5ff"/>
            <stop offset="100%" stop-color="#b366ff"/>
          </linearGradient>
        </defs>
        <g class="veil-ring-a">
          <circle cx="39" cy="39" r="34" stroke="rgba(0,245,255,0.22)" stroke-width="1" stroke-dasharray="18 10"/>
          <circle cx="39" cy="5" r="2.6" fill="#00f5ff"/>
        </g>
        <g class="veil-ring-b">
          <circle cx="39" cy="39" r="26" stroke="rgba(179,102,255,0.34)" stroke-width="1" stroke-dasharray="28 16"/>
          <circle cx="65" cy="39" r="2.2" fill="#b366ff"/>
        </g>
        <polygon points="39,17 57,28 57,50 39,61 21,50 21,28" stroke="url(#veilGrad)" stroke-width="1.6" fill="rgba(0,245,255,0.06)"/>
        <polygon points="39,25 50,31.5 50,46.5 39,53 28,46.5 28,31.5" stroke="rgba(0,245,255,0.55)" stroke-width="1" fill="none"/>
        <circle cx="39" cy="39" r="3.4" fill="#00f5ff"/>
      </svg>
      <div class="veil-label" id="sov-veil-label">SOVEREIGN</div>
    `;
    document.body.appendChild(veil);
    return veil;
  }

  function clearVeil(veil) {
    if (!veil) return;
    veil.classList.remove('entering', 'arrived');
    veil.classList.add('revealing');
    setTimeout(() => {
      veil.classList.remove('revealing');
    }, 380);
  }

  function setup() {
    const veil = buildVeil();

    // If arriving from an internal Sovereign page transition, smoothly sweep curtain open
    try {
      const ts = Number(sessionStorage.getItem(STORAGE_KEY) || 0);
      if (ts && Date.now() - ts < 3500) {
        sessionStorage.removeItem(STORAGE_KEY);
        veil.classList.add('arrived');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => clearVeil(veil));
        });
      }
    } catch {}

    // Never stay stuck when user presses browser Back/Forward (bfcache restore)
    window.addEventListener('pageshow', () => {
      veil.classList.remove('entering', 'arrived', 'revealing');
    });

    // Intercept internal same-origin page navigations cleanly
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = e.target.closest && e.target.closest('a[href]');
      if (!anchor) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const rawHref = anchor.getAttribute('href');
      if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('javascript:')) return;

      let dest;
      try {
        dest = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (dest.origin !== window.location.origin) return;
      // Same-page hash jump should scroll normally without transition veil
      if (dest.pathname === window.location.pathname && dest.search === window.location.search) return;

      e.preventDefault();
      const labelEl = document.getElementById('sov-veil-label');
      if (labelEl) {
        const clean = dest.pathname.replace(/^\/|\.html$/g, '').toUpperCase();
        labelEl.textContent = clean ? `SOVEREIGN · ${clean}` : 'SOVEREIGN';
      }

      try { sessionStorage.setItem(STORAGE_KEY, String(Date.now())); } catch {}
      veil.classList.remove('revealing', 'arrived');
      veil.classList.add('entering');

      setTimeout(() => {
        window.location.href = dest.href;
      }, 240);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
