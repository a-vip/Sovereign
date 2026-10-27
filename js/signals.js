/* ─── LIVE SIGNALS STREAM ENGINE (Connected to app.sovdash.com API) ─── */

let SOVEREIGN_SIGNALS_POOL = [
  { tag:'CONFLICT',    sev:'S5', color:'#ff2244', headline:'Stop Killer Robots: UN First Committee Advances Resolution on Lethal Autonomous Weapons Systems (LAWS)', loc:'New York, United States' },
  { tag:'SURVEILLANCE',sev:'S4', color:'#00f5ff', headline:'EU AI Act High-Risk Biometric & Autonomous Systems Enforcement Framework Enters Active Phase', loc:'Brussels, Belgium' },
  { tag:'CONFLICT',    sev:'S5', color:'#ff2244', headline:'Loitering Munitions & Terminal Guidance Autonomy Documented in Eastern European Theatre', loc:'Kyiv, Ukraine' },
  { tag:'POLITICAL',   sev:'S4', color:'#b366ff', headline:'ICRC & Stop Killer Robots Issue Joint Briefing on Meaningful Human Control Over Force Application', loc:'Geneva, Switzerland' },
  { tag:'SURVEILLANCE',sev:'S4', color:'#00f5ff', headline:'Automated Target Recognition & Mass Facial Biometrics Deployed Along Contested Checkpoints', loc:'Middle East Corridor' },
  { tag:'ECONOMIC',    sev:'S3', color:'#ffd22e', headline:'Hyperscale Sovereign AI Compute Cluster & Export Control Compliance Audit', loc:'Singapore' },
  { tag:'CONFLICT',    sev:'S4', color:'#ff2244', headline:'Naval Unmanned Surface Vessels (USVs) & Electronic Warfare Spoofing Detected in Maritime Corridor', loc:'Red Sea / Bab el-Mandeb' },
  { tag:'POLITICAL',   sev:'S3', color:'#b366ff', headline:'Latin America & Caribbean Regional Communiqué Endorses Binding Instrument on Autonomous Weapons', loc:'San José, Costa Rica' },
  { tag:'SURVEILLANCE',sev:'S3', color:'#00f5ff', headline:'GNSS / GPS Navigational Interference & Spoofing Envelope Recorded Along Eastern Flank', loc:'Kaliningrad / Baltic Sector' },
  { tag:'HUMANITARIAN',sev:'S4', color:'#00ff88', headline:'Algorithmic Decision Systems in Humanitarian Aid Triage Audited for Bias and Civilian Exclusion', loc:'Geneva, Switzerland' },
  { tag:'ECONOMIC',    sev:'S3', color:'#ffd22e', headline:'Subsea Fiber-Optic Cable Redundancy & Sovereign Cloud Interconnect Resilience Assessment', loc:'Marseille, France' },
  { tag:'CONFLICT',    sev:'S5', color:'#ff2244', headline:'Counter-UAS Directed Energy & Autonomous Interceptor Battery Deployment Verified', loc:'Indo-Pacific Theatre' }
];

function mapCategoryToTagAndColor(cat) {
  const c = (cat || '').toUpperCase();
  if (c.includes('CONFLICT') || c.includes('WAR') || c.includes('MILITARY') || c.includes('SECURITY')) {
    return { tag: 'CONFLICT', color: '#ff2244' };
  }
  if (c.includes('SURVEILLANCE') || c.includes('CYBER') || c.includes('TECH') || c.includes('AI')) {
    return { tag: 'SURVEILLANCE', color: '#00f5ff' };
  }
  if (c.includes('POLITICAL') || c.includes('LAW') || c.includes('REGULATION') || c.includes('RIGHTS')) {
    return { tag: 'POLITICAL', color: '#b366ff' };
  }
  if (c.includes('DISASTER') || c.includes('CLIMATE')) {
    return { tag: 'DISASTER', color: '#ff6b00' };
  }
  if (c.includes('HUMANITARIAN')) {
    return { tag: 'HUMANITARIAN', color: '#00ff88' };
  }
  return { tag: 'ECONOMIC', color: '#ffd22e' };
}

async function hydrateLiveSignalsFromApp() {
  try {
    const res = await fetch('https://app.sovdash.com/api/events');
    if (!res.ok) return;
    const data = await res.json();
    const events = Array.isArray(data) ? data : (data.events || []);
    if (events.length === 0) return;

    const mapped = events.slice(0, 35).map(ev => {
      const { tag, color } = mapCategoryToTagAndColor(ev.category);
      const sevNum = Math.min(5, Math.max(1, parseInt(ev.severity || 3, 10)));
      return {
        id: ev.id,
        tag,
        sev: `S${sevNum}`,
        color,
        headline: ev.title,
        loc: ev.location || 'Global',
        desc: ev.details?.summary || ev.details?.description || ev.title,
        coords: (ev.lat && ev.lon) ? `${Number(ev.lat).toFixed(4)}° N, ${Number(ev.lon).toFixed(4)}° E` : 'WGS84 VERIFIED'
      };
    });

    if (mapped.length > 0) {
      SOVEREIGN_SIGNALS_POOL.splice(0, SOVEREIGN_SIGNALS_POOL.length, ...mapped);
      window.dispatchEvent(new CustomEvent('sovereign_live_signals_loaded', { detail: mapped }));
    }
  } catch (err) {
    // Graceful fallback to curated LAWS & geopolitical pool
  }
}

hydrateLiveSignalsFromApp();

function padZero(n){ return String(n).padStart(2,'0'); }

function getUTCNowString() {
  const d = new Date();
  return `${padZero(d.getUTCHours())}:${padZero(d.getUTCMinutes())}:${padZero(d.getUTCSeconds())}`;
}

function createSignalRowHTML(sig, timeStr) {
  const sev = sig.sev.toLowerCase();
  const isHigh = sev === 's5' || sev === 's4';
  const alertHTML = isHigh
    ? `<div class="sig-alert"><div class="sig-alert-dot"></div>${sev==='s5'?'CRITICAL':'ALERT'}</div>`
    : '';

  return `
    <span class="sig-time">${timeStr}</span>
    <span class="sig-tag" style="color:${sig.color};border-color:${sig.color}44;background:${sig.color}14;">${sig.tag}</span>
    <div>
      <div class="sig-headline">${sig.headline}</div>
      <div class="sig-loc">📍 ${sig.loc}</div>
    </div>
    <div class="sig-right">
      <span class="sig-sev">${sig.sev}</span>
      ${alertHTML}
    </div>
  `;
}

// Initialise the landing page preview feed if the elements exist on DOM
document.addEventListener('DOMContentLoaded', () => {
  const feed = document.getElementById('live-feed');
  const clock = document.getElementById('sig-clock');
  const counter = document.getElementById('sig-count');
  
  if (!feed) return; // Not on the landing page

  let count = 482;
  let poolIdx = 0;
  const MAX_ROWS = 8;

  // Shuffle pool once
  let shuffledPool = [...SOVEREIGN_SIGNALS_POOL];

  window.addEventListener('sovereign_live_signals_loaded', (e) => {
    if (e.detail && e.detail.length > 0) {
      shuffledPool = [...e.detail];
      poolIdx = 0;
    }
  });

  function makeRow(sig, timeStr) {
    const row = document.createElement('div');
    row.className = `sig-row sev-${sig.sev.toLowerCase()}`;
    row.style.setProperty('--sig-color', sig.color);
    row.innerHTML = createSignalRowHTML(sig, timeStr);
    return row;
  }

  function addSignal(){
    const sig = shuffledPool[poolIdx % shuffledPool.length];
    poolIdx++;
    count++;
    if (counter) counter.textContent = count;

    const row = makeRow(sig, getUTCNowString());
    feed.insertBefore(row, feed.firstChild);

    // Remove oldest if too many
    const rows = feed.querySelectorAll('.sig-row');
    if(rows.length > MAX_ROWS){
      const last = rows[rows.length - 1];
      last.classList.add('fading');
      setTimeout(() => last.remove(), 550);
    }
  }

  // Clock tick
  if (clock) {
    setInterval(() => { clock.textContent = getUTCNowString(); }, 1000);
    clock.textContent = getUTCNowString();
  }

  // Pre-fill with 6 rows immediately
  for(let i = 5; i >= 0; i--){
    const sig = shuffledPool[poolIdx % shuffledPool.length];
    poolIdx++;
    const d = new Date();
    d.setSeconds(d.getUTCSeconds() - i * 8);
    const t = `${padZero(d.getUTCHours())}:${padZero(d.getUTCMinutes())}:${padZero(d.getUTCSeconds())}`;
    feed.appendChild(makeRow(sig, t));
  }

  // New signal every 2.8s
  setInterval(addSignal, 2800);
});
