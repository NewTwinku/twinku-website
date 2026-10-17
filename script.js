(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Hero images: rotate every 2 seconds (as in the Figma Home variants) ---- */
  const heroImgs = [...document.querySelectorAll('.hero__img')];
  if (heroImgs.length > 1) {
    let i = 0;
    // make sure later images are fetched early so the first swap is seamless
    heroImgs.slice(1).forEach(img => { img.loading = 'eager'; });
    setInterval(() => {
      if (document.hidden) return;
      heroImgs[i].classList.remove('is-active');
      i = (i + 1) % heroImgs.length;
      heroImgs[i].classList.add('is-active');
    }, 2000);
  }

  /* ---- Sticky nav shadow + back-to-top ---- */
  const nav = document.querySelector('.nav');
  const toTop = document.querySelector('.back-to-top');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 8);
    toTop.classList.toggle('is-visible', y > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  const toggle = document.querySelector('.nav__toggle');
  toggle.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  document.querySelectorAll('.nav__menu a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  /* ---- Dropdowns (Resources, Download the app) ---- */
  const dropdowns = [...document.querySelectorAll('.dropdown')];
  const closeAll = except => dropdowns.forEach(d => {
    if (d !== except) {
      d.classList.remove('is-open');
      d.querySelector('.dropdown__trigger').setAttribute('aria-expanded', 'false');
    }
  });
  const canHover = window.matchMedia('(hover: hover) and (min-width: 901px)');
  dropdowns.forEach(d => {
    const trigger = d.querySelector('.dropdown__trigger');
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const open = !d.classList.contains('is-open');
      closeAll(d);
      d.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    });
    d.addEventListener('mouseenter', () => { if (canHover.matches) { closeAll(d); d.classList.add('is-open'); trigger.setAttribute('aria-expanded', 'true'); } });
    d.addEventListener('mouseleave', () => { if (canHover.matches) { d.classList.remove('is-open'); trigger.setAttribute('aria-expanded', 'false'); } });
  });
  document.addEventListener('click', () => closeAll());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  /* ---- Feature list: auto-advance + click to select ---- */
  const features = [...document.querySelectorAll('.feature')];
  let fi = 0, timer;
  const setFeature = n => {
    features.forEach((f, k) => f.classList.toggle('is-active', k === n));
    fi = n;
  };
  const start = () => { if (!reduceMotion) timer = setInterval(() => setFeature((fi + 1) % features.length), 4000); };
  features.forEach((f, k) => f.addEventListener('click', () => { clearInterval(timer); setFeature(k); start(); }));
  start();

  /* ---- Reveal on scroll ---- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.problem__inner, .features__list, .phone-card, .faq__item, .cta__inner, .footer__cta');
    targets.forEach(t => t.classList.add('reveal'));
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { threshold: 0.15 });
    targets.forEach(t => io.observe(t));
  }

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
