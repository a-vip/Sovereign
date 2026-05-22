/* ── BOOT SEQUENCE ── */
const bootLines = [
  { text: '> Establishing secure connection...', delay: 0,    result: '[OK]',  color: '#00ff88' },
  { text: '> Loading satellite feed (12 active)...', delay: 500, result: '[OK]', color: '#00ff88' },
  { text: '> Calibrating signal processors...', delay: 1000, result: '[OK]',  color: '#00ff88' },
  { text: '> Syncing intelligence layers...', delay: 1500,   result: '[OK]',  color: '#00ff88' },
  { text: '> 27 CRITICAL ALERTS DETECTED',    delay: 2000,   result: '[!!]',  color: '#ff2244' },
  { text: '> SYSTEM STATUS: OPERATIONAL',     delay: 2500,   result: '',      color: '#00f5ff' },
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
      if (typeof startHero === 'function') {
        startHero(); 
      }
    }, 900);
  }
}
window.dismissBoot = dismissBoot;

(function runBoot(){
  const linesEl = document.getElementById('boot-lines');
  const barWrap = document.getElementById('boot-bar-wrap');
  const bar     = document.getElementById('boot-bar');
  
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    dismissBoot();
    return;
  }

  if (!linesEl || !barWrap || !bar) return;

  let completed = 0;
  bootLines.forEach(({ text, delay, result, color }) => {
    setTimeout(() => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;justify-content:space-between;gap:16px;';
      row.innerHTML = `<span style="color:#475569;">${text}</span><span style="color:${color};font-weight:800;">${result}</span>`;
      linesEl.appendChild(row);
      completed++;
      if(completed === 1){ barWrap.style.display='block'; }
      bar.style.width = ((completed/bootLines.length)*100) + '%';
      if(completed === bootLines.length){
        setTimeout(() => dismissBoot(), 700);
      }
    }, delay);
  });
})();
