/* ─── LIVE SIGNALS STREAM ENGINE ─── */

const SOVEREIGN_SIGNALS_POOL = [
  { tag:'CONFLICT',    sev:'S5', color:'#ff2244', headline:'Artillery exchange reported near border — multiple casualties confirmed', loc:'Donetsk Region, Ukraine' },
  { tag:'SURVEILLANCE',sev:'S4', color:'#00f5ff', headline:'Security monitoring systems updated at border checkpoints', loc:'United States' },
  { tag:'CONFLICT',    sev:'S5', color:'#ff2244', headline:'Airstrike reported in urban area — civilian impact unconfirmed', loc:'Northern Syria' },
  { tag:'ECONOMIC',    sev:'S3', color:'#ffd22e', headline:'Critical minerals supply chain flagged for forced-labour risk', loc:'Global' },
  { tag:'SURVEILLANCE',sev:'S1', color:'#00f5ff', headline:'Suspicious vessel tracking anomaly detected in gulf corridor', loc:'Gulf of Aden' },
  { tag:'CONFLICT',    sev:'S4', color:'#ff2244', headline:'Militant group mobilisation detected across three provinces', loc:'Sahel Region' },
  { tag:'DISASTER',    sev:'S2', color:'#ff6b00', headline:'Severe flooding displaces 40,000 residents in coastal region', loc:'Rio Grande do Sul, Brazil' },
  { tag:'ECONOMIC',    sev:'S2', color:'#ffd22e', headline:'Oil prices surge past $93 per barrel on supply disruption', loc:'Global Markets' },
  { tag:'SURVEILLANCE',sev:'S3', color:'#00f5ff', headline:'Radio tracking alert: signal anomaly detected over shipping route', loc:'Eastern Mediterranean' },
  { tag:'DISASTER',    sev:'S3', color:'#ff6b00', headline:'6.2 magnitude earthquake detected — tsunami advisory issued', loc:'Kyushu, Japan' },
  { tag:'POLITICAL',   sev:'S2', color:'#b366ff', headline:'Emergency UN Security Council session called on cyber attacks', loc:'New York, USA' },
  { tag:'SURVEILLANCE',sev:'S4', color:'#00f5ff', headline:'Cyber intrusion attempt blocked — critical infrastructure targeted', loc:'Eastern Europe' },
  { tag:'ECONOMIC',    sev:'S3', color:'#ffd22e', headline:'Major port disruption — container traffic halted indefinitely', loc:'Strait of Malacca' },
  { tag:'CONFLICT',    sev:'S5', color:'#ff2244', headline:'Military escalation detected near disputed transport route', loc:'Eastern Europe' },
  { tag:'HUMANITARIAN',sev:'S3', color:'#00ff88', headline:'Refugee displacement exceeds 2M — aid corridors under threat', loc:'Horn of Africa' },
  { tag:'SURVEILLANCE',sev:'S2', color:'#00f5ff', headline:'Drone incursion detected near restricted airspace boundary', loc:'Taiwan Strait' },
  { tag:'ECONOMIC',    sev:'S4', color:'#ffd22e', headline:'Sanctions package announced targeting energy sector exports', loc:'Moscow, Russia' },
  { tag:'DISASTER',    sev:'S1', color:'#ff6b00', headline:'Wildfire perimeter expands — evacuation orders in three zones', loc:'California, USA' },
  { tag:'CONFLICT',    sev:'S4', color:'#ff2244', headline:'Naval vessels repositioned to contested waters — standoff ongoing', loc:'South China Sea' },
  { tag:'POLITICAL',   sev:'S3', color:'#b366ff', headline:'Emergency summit called following intelligence leak disclosure', loc:'Brussels, Belgium' },
];

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
  const shuffledPool = [...SOVEREIGN_SIGNALS_POOL].sort(() => Math.random() - 0.5);

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
