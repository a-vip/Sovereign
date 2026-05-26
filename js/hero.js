/* ── HERO SEQUENCE (fires after boot) ── */
function startHero(){
  // 1. Show badge
  const badge = document.getElementById('hbadge');
  if (badge) badge.style.opacity = '1';

  // 2. Typewriter on h1
  const lines = [
    { text: 'TRACK CONSEQUENTIAL SHIFTS.', cls: '', color: '#ffffff' },
    { text: 'IN REAL TIME.',         cls: 'glitch-word', color: 'var(--cyan)' },
  ];
  const txtEl = document.getElementById('hero-txt');
  const curEl = document.getElementById('hero-cur');
  
  if (txtEl) {
    let lineI = 0, charI = 0;
    let currentSpan = null;

    function typeNext(){
      if(lineI >= lines.length){
        if (curEl) {
          curEl.style.animation = 'none'; 
          curEl.style.opacity = '0';
        }
        revealRest();
        return;
      }
      if(charI === 0){
        if(lineI > 0){ const br = document.createElement('br'); txtEl.appendChild(br); }
        currentSpan = document.createElement('span');
        if(lines[lineI].color){ currentSpan.style.color = lines[lineI].color; }
        txtEl.appendChild(currentSpan);
      }
      const line = lines[lineI].text;
      currentSpan.textContent = line.slice(0, charI + 1);
      charI++;
      if(charI >= line.length){ lineI++; charI = 0; setTimeout(typeNext, lineI < lines.length ? 180 : 60); }
      else { setTimeout(typeNext, charI===1 && lineI>0 ? 160 : 42); }
    }
    setTimeout(typeNext, 300);
  } else {
    revealRest();
  }

  function revealRest(){
    ['hero-p','hero-act','hero-sts'].forEach((id,i) => {
      const el = document.getElementById(id);
      if(el){ el.style.opacity='1'; el.style.transform='translateY(0)'; }
    });
    countUpStats();
  }

  // 3. Start globe interactivity
  startGlobe();
}
window.startHero = startHero;

/* ── STATS COUNT-UP ── */
function countUpStats(){
  ['sn0','sn1','sn2'].forEach(id => {
    const el = document.getElementById(id);
    if(!el) return;
    const target = parseFloat(el.dataset.target);
    const dec = parseInt(el.dataset.dec);
    const sfx = el.dataset.sfx;
    const dur = 1400;
    const start = performance.now();
    function tick(now){
      const t = Math.min((now-start)/dur,1);
      const ease = 1-Math.pow(1-t,3);
      const val = (target * ease).toFixed(dec);
      el.textContent = val + sfx;
      if(t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

/* ── GLOBE INTERACTIVITY ── */
function startGlobe(){
  const panel = document.getElementById('hero-panel');
  const wrap  = document.getElementById('hero-panel-wrap');
  const clockEl = document.getElementById('hp-clock');
  const countEl = document.getElementById('hp-sigcount');
  const markersEl = document.getElementById('hp-markers');
  const toastEl  = document.getElementById('hp-toast');
  let sigCount = 482;

  if (!panel || !wrap) return;

  // Clock
  function padZ(n){ return String(n).padStart(2,'0'); }
  function tickClock(){
    if (clockEl) {
      const d = new Date();
      clockEl.textContent = `${padZ(d.getUTCHours())}:${padZ(d.getUTCMinutes())}:${padZ(d.getUTCSeconds())} UTC`;
    }
  }
  setInterval(tickClock, 1000); tickClock();

  // Signal counter
  setInterval(() => {
    sigCount++;
    if (countEl) countEl.textContent = sigCount + ' SIGNALS';
  }, 3200);

  // Mouse parallax
  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 14;
    const y = ((e.clientY - r.top ) / r.height - 0.5) * -10;
    panel.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  });
  wrap.addEventListener('mouseleave', () => {
    panel.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });

  // Touch parallax (Mobile)
  wrap.addEventListener('touchmove', e => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const r = wrap.getBoundingClientRect();
      const x = ((touch.clientX - r.left) / r.width  - 0.5) * 14;
      const y = ((touch.clientY - r.top ) / r.height - 0.5) * -10;
      const boundedX = Math.max(-14, Math.min(14, x));
      const boundedY = Math.max(-10, Math.min(10, y));
      panel.style.transform = `rotateY(${boundedX}deg) rotateX(${boundedY}deg)`;
    }
  }, { passive: true });
  wrap.addEventListener('touchend', () => {
    panel.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });

  // Event markers on globe
  const events = [
    { x:'33%', y:'28%', type:'CONFLICT',     loc:'Donetsk, UA',        color:'#ff2244' },
    { x:'58%', y:'34%', type:'SURVEILLANCE', loc:'E. Mediterranean',   color:'#00f5ff' },
    { x:'24%', y:'55%', type:'DISASTER',     loc:'São Paulo, BR',      color:'#ff6b00' },
    { x:'72%', y:'42%', type:'ECONOMIC',     loc:'Malacca Strait',     color:'#ffd22e' },
    { x:'50%', y:'20%', type:'POLITICAL',    loc:'Brussels, EU',       color:'#b366ff' },
    { x:'44%', y:'62%', type:'HUMANITARIAN', loc:'Horn of Africa',     color:'#00ff88' },
    { x:'78%', y:'55%', type:'SURVEILLANCE', loc:'South China Sea',    color:'#00f5ff' },
    { x:'18%', y:'38%', type:'CONFLICT',     loc:'Sahel Region',       color:'#ff2244' },
  ];
  let evtI = 0;
  function addMarker(){
    if (!markersEl) return;
    const ev = events[evtI % events.length]; evtI++;
    const m = document.createElement('div');
    m.className = 'hp-marker';
    m.style.cssText = `left:${ev.x};top:${ev.y};`;
    m.innerHTML = `
      <div class="hp-marker-dot" style="background:${ev.color};box-shadow:0 0 10px ${ev.color};"></div>
      <div class="hp-marker-label" style="background:${ev.color}18;border:1px solid ${ev.color}44;color:${ev.color};">
        ${ev.type}<br/><span style="color:#475569;font-weight:400;">${ev.loc}</span>
      </div>`;
    markersEl.appendChild(m);
    setTimeout(() => {
      m.style.transition = 'opacity 0.5s';
      m.style.opacity = '0';
      setTimeout(() => m.remove(), 500);
    }, 3500);
  }
  addMarker();
  setInterval(addMarker, 2000);


}

/* ── CATEGORIES SELECTOR FILTER ── */
document.addEventListener('DOMContentLoaded', () => {
  const pills = document.querySelectorAll('.cat-pill[data-cat]');
  const cards = document.querySelectorAll('.feature-card[data-cat]');

  const catColors = {
    conflict:     '#ff2244',
    surveillance: '#00f5ff',
    disaster:     '#ff6b00',
    economic:     '#ffd22e',
    humanitarian: '#00ff88',
    political:    '#b366ff',
  };

  let activePill = null;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = pill.dataset.cat;

      if (activePill === pill) {
        // Deselect
        pills.forEach(p => { p.classList.remove('pill-active'); p.style.removeProperty('--pill-color'); });
        cards.forEach(c => { c.classList.remove('fc-highlight'); c.style.removeProperty('--fc-color'); });
        activePill = null;
        return;
      }

      // Clear previous
      pills.forEach(p => { p.classList.remove('pill-active'); p.style.removeProperty('--pill-color'); });
      cards.forEach(c => { c.classList.remove('fc-highlight'); c.style.removeProperty('--fc-color'); });

      // Activate
      pill.classList.add('pill-active');
      pill.style.setProperty('--pill-color', catColors[cat]);

      const match = document.querySelector(`.feature-card[data-cat="${cat}"]`);
      if (match) {
        match.classList.add('fc-highlight');
        match.style.setProperty('--fc-color', catColors[cat]);
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

  cards.forEach(c => c.style.setProperty('--card-color', c.dataset.color));

  function swapImage(src) {
    if (!previewImg) return;
    previewImg.style.opacity = '0';
    if (previewPH) previewPH.style.display = 'none';
    previewImg.style.display = 'block';
    setTimeout(() => {
      previewImg.src = src;
      previewImg.onload  = () => previewImg.style.opacity = '1';
      previewImg.onerror = () => { 
        previewImg.style.display='none'; 
        if (previewPH) previewPH.style.display='flex'; 
      };
    }, 180);
  }

  function activate(card, isAuto) {
    const color = card.dataset.color;
    const name  = card.dataset.name;
    const desc  = card.dataset.desc;

    // Info bar
    if (infoBar) infoBar.style.borderColor = color + '44';
    if (infoName) {
      infoName.textContent = name;
      infoName.style.color = color;
    }
    if (infoDesc) infoDesc.textContent = desc;
    if (infoStatus) {
      infoStatus.textContent = isAuto ? '● ACTIVE' : '● SELECTED';
      infoStatus.style.color = isAuto ? '#00ff88' : color;
      infoStatus.style.borderColor = isAuto ? 'rgba(0,255,136,0.25)' : color + '44';
      infoStatus.style.background  = isAuto ? 'rgba(0,255,136,0.10)' : color + '18';
    }

    // Preview panel
    if (previewPanel) {
      previewPanel.style.borderColor = color + '44';
      previewPanel.style.boxShadow   = `0 0 48px ${color}12`;
    }
    if (previewLabel) {
      previewLabel.textContent = name;
      previewLabel.style.color = color;
    }
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
    cards.forEach(c => { if (!c.classList.contains('selected')) c.classList.remove('lit'); });
    const card = cards[index];
    if (card && !card.classList.contains('selected')) {
      card.classList.add('lit');
      activate(card, true);
    }
  }

  // Init
  lightCard(0);

  setInterval(() => {
    if (!selectedCard) {
      currentLit = (currentLit + 1) % cards.length;
      lightCard(currentLit);
    }
  }, 2200);

  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (selectedCard === card) {
        card.classList.remove('selected');
        selectedCard = null;
        lightCard(currentLit);
      } else {
        if (selectedCard) selectedCard.classList.remove('selected');
        cards.forEach(c => c.classList.remove('lit'));
        card.classList.add('selected');
        selectedCard = card;
        currentLit = i;
        activate(card, false);
      }
    });
  });
});
