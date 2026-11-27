export function initAdvancedMotion() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  const revealTargets = () => {
    const targets = document.querySelectorAll(
      '.section-head, .t-card, .panel, .feed-card, .team-hero, .live-board, ' +
      '.admin-stat-card, .admin-quick-btn, .table-wrap, .lb-table-wrap, .t-header, ' +
      '.team-card-react, .teams-card, .match-card-react, .home-info-panel, ' +
      '.player-card, .dashboard-stat, .community-post, .stats-strip'
    );

    if (reduceMotion) {
      targets.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    targets.forEach((element) => {
      if (!element.classList.contains('motion-reveal')) {
        element.classList.add('motion-reveal');
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: '0px 0px -5% 0px' });

    document.querySelectorAll('.motion-reveal:not(.is-visible)').forEach((element) => observer.observe(element));
  };

  const updateNavbar = () => {
    document.querySelector('.app-nav')?.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  const updatePointer = (event) => {
    document.documentElement.style.setProperty('--pointer-x', `${event.clientX / window.innerWidth * 100}%`);
    document.documentElement.style.setProperty('--pointer-y', `${event.clientY / window.innerHeight * 100}%`);

    if (!finePointer) return;
    const card = event.target.closest(
      '.t-card, .team-card-react, .teams-card, .match-card-react, .panel, ' +
      '.home-info-panel, .player-card, .community-post'
    );
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty('--spot-x', `${x * 100}%`);
    card.style.setProperty('--spot-y', `${y * 100}%`);
  };

  const resetTilt = (card) => {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  };

  const updateTilt = (event) => {
    if (!finePointer || reduceMotion) return;
    const card = event.currentTarget;
    if (event.pointerType === 'touch') return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    card.style.setProperty('--rx', `${-y * 5}deg`);
    card.style.setProperty('--ry', `${x * 7}deg`);
  };

  const refreshTilts = () => {
    document.querySelectorAll(
      '.t-card, .team-card-react, .teams-card, .match-card-react, .panel, ' +
      '.home-info-panel, .player-card, .community-post'
    ).forEach((card) => {
      if (card.dataset.motionReady) return;
      card.dataset.motionReady = 'true';
      card.addEventListener('pointermove', updateTilt);
      card.addEventListener('pointerleave', () => resetTilt(card));
    });
  };

  const refresh = () => {
    window.requestAnimationFrame(() => {
      revealTargets();
      refreshTilts();
    });
  };

  let lastPath = window.location.pathname;
  const appObserver = new MutationObserver(() => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      const main = document.querySelector('.app-shell main');
      if (main) {
        main.classList.remove('route-enter');
        void main.offsetWidth;
        main.classList.add('route-enter');
      }
    }
    refresh();
  });

  window.addEventListener('scroll', updateNavbar, { passive: true });
  window.addEventListener('pointermove', updatePointer, { passive: true });
  window.addEventListener('load', refresh);
  document.addEventListener('click', () => window.setTimeout(refresh, 80));
  appObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  updateNavbar();
  refresh();
}
