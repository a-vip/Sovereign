/* ─── NAVIGATION & SCROLL OBSERVERS ─── */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Hamburger and Nav Drawer Toggles
  const hamburger = document.querySelector('.nav-hamburger');
  const drawer = document.querySelector('.nav-drawer');
  const drawerTabs = document.querySelectorAll('.nav-drawer-tab');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isExpanded);
      drawer.classList.toggle('open');
      drawer.setAttribute('aria-hidden', isExpanded);
    });

    // Close drawer when clicking a link
    drawerTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        hamburger.setAttribute('aria-expanded', 'false');
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // Smooth active nav state on scroll (Scroll-Spy)
  const sections = document.querySelectorAll('section[id], div[id]');
  const navTabs = document.querySelectorAll('.nav-tab');

  if (sections.length && (navTabs.length || drawerTabs.length)) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          // Clear active states
          navTabs.forEach(t => t.classList.remove('active'));
          drawerTabs.forEach(t => t.classList.remove('active'));

          // Activate matches
          const matchNav = document.querySelector(`.nav-tab[href="#${e.target.id}"]`);
          if (matchNav) matchNav.classList.add('active');

          const matchDrawer = document.querySelector(`.nav-drawer-tab[href="#${e.target.id}"]`);
          if (matchDrawer) matchDrawer.classList.add('active');
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(s => observer.observe(s));
  }

  // Animate stats on scroll
  const statNums = document.querySelectorAll('.stat-num');
  if (statNums.length) {
    const statsObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.animation = 'fadeUp 0.5s ease both';
          statsObs.unobserve(e.target);
        }
      });
    });
    statNums.forEach(n => statsObs.observe(n));
  }
});
