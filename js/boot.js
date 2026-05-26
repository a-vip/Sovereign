/* ── BOOT SEQUENCE ── */
const bootLines = [
  { statusText: 'Initializing encrypted data channel...', delay: 0 },
  { statusText: 'Establishing high-fidelity satellite nodes...', delay: 500 },
  { statusText: 'Verifying signal telemetry databases...', delay: 1000 },
  { statusText: 'Securing algorithmic compliance layers...', delay: 1500 },
  { statusText: 'All systems operational. Signal clear.', delay: 2000 },
  { statusText: 'Welcome to Sovereign Intel.', delay: 2550 },
];
let bootDone = false;

function dismissBoot(){
  if(bootDone) return;
  bootDone = true;
  const ol = document.getElementById('boot-ol');
  if (ol) {
    ol.style.opacity = '0';
    setTimeout(() => { 
      ol.style.display = 'none'; 
      if (typeof startIntro === 'function') {
        startIntro();
      } else if (typeof startHero === 'function') {
        startHero(); 
      }
    }, 900);
  }
}
window.dismissBoot = dismissBoot;

(function runBoot(){
  const statusEl = document.getElementById('boot-status');
  const barWrap  = document.getElementById('boot-bar-wrap');
  const bar      = document.getElementById('boot-bar');
  
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || sessionStorage.getItem('bootPlayed') === 'true') {
    const ol = document.getElementById('boot-ol');
    if (ol) ol.style.display = 'none';
    if (typeof startIntro === 'function') {
      startIntro();
    } else if (typeof startHero === 'function') {
      startHero();
    }
    return;
  }
  sessionStorage.setItem('bootPlayed', 'true');

  if (!barWrap || !bar) return;

  // Render the loading bar immediately
  barWrap.style.display = 'block';

  let completed = 0;
  bootLines.forEach(({ statusText, delay }) => {
    setTimeout(() => {
      completed++;
      if (statusEl) {
        statusEl.textContent = statusText;
        if (completed === bootLines.length) {
          statusEl.style.color = '#00f5ff'; // highlight cyan on complete
        }
      }
      bar.style.width = ((completed/bootLines.length)*100) + '%';
      if(completed === bootLines.length){
        setTimeout(() => dismissBoot(), 800);
      }
    }, delay);
  });
})();
