/* =====================================================
   THE DOMUS — Scroll Behaviors v2
   - Sticky header (smart hide on scroll down)
   - Scroll progress bar
   - IntersectionObserver reveal system
   - Animated counters (with easing)
   - Process row in-view activation
   - Parallax on data-parallax elements
   - Section-level scroll progress variable --sp
   - Lazy image loading (data-src swap)
   - Horizontal scroll material reel
   ===================================================== */
(() => {
  /* =====================================================
     PREMIUM INERTIAL SMOOTH SCROLL
     Works on all pages. Gives up control to any internal
     scrollable element (gallery, modal, overflow container)
     so there are zero conflicts site-wide.
     ===================================================== */
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch   = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isReduced && !isTouch) {
    let current = window.scrollY;
    let target  = current;
    let rafId   = null;

    /* Returns true if the wheel event should be handled by an
       internal scroll container rather than our inertial engine. */
    function shouldPassThrough(e) {
      let el = e.target;
      while (el && el !== document.body) {
        /* Named containers that own their own scroll */
        if (
          el.id === 'stage'              ||   /* Helix 3-D gallery */
          el.closest('#stage')           ||
          el.classList.contains('p-gallery-viewport') ||
          el.classList.contains('p-lightbox-inner')   ||
          el.classList.contains('h-scroll-section')   ||
          el.tagName === 'IFRAME'        ||
          el.tagName === 'TEXTAREA'      ||
          el.dataset.noInertia !== undefined
        ) return true;

        /* Any element that is itself scrollable and has overflow to scroll */
        if (el !== document.documentElement) {
          const style = getComputedStyle(el);
          const overflow = style.overflowY;
          const isScrollable = (overflow === 'auto' || overflow === 'scroll');
          if (isScrollable) {
            const canScrollDown = e.deltaY > 0 && el.scrollTop < el.scrollHeight - el.clientHeight - 1;
            const canScrollUp   = e.deltaY < 0 && el.scrollTop > 0;
            if (canScrollDown || canScrollUp) return true;
          }
        }
        el = el.parentElement;
      }
      return false;
    }

    function tick() {
      current += (target - current) * 0.11;
      if (Math.abs(target - current) < 0.5) {
        current = target;
        window.scrollTo(0, current);
        rafId = null;
        return;
      }
      window.scrollTo(0, current);
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener('wheel', (e) => {
      /* Do nothing if a modal/lightbox has locked body scroll */
      if (document.body.style.overflow === 'hidden') return;
      if (shouldPassThrough(e)) return;

      e.preventDefault();
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      target += e.deltaY;
      target  = Math.max(0, Math.min(target, maxScroll));
      if (!rafId) rafId = requestAnimationFrame(tick);
    }, { passive: false });

    /* Sync when anchor links / programmatic scrolls move the page */
    window.addEventListener('scroll', () => {
      if (!rafId) {
        target  = window.scrollY;
        current = target;
      }
    }, { passive: true });
  }

  const header     = document.querySelector('.site-header');
  const backToTop  = document.querySelector('.back-to-top');
  const progressBar= document.querySelector('.scroll-progress');

  /* =====================================================
     STICKY HEADER — smart hide on scroll down
     ===================================================== */
  let lastScrollY  = 0;
  let ticking      = false;

  function updateHeader() {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', y > 12);
    }
    if (backToTop) backToTop.classList.toggle('visible', y > 800);
    if (progressBar) {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = docH > 0 ? `${(y / docH) * 100}%` : '0%';
    }
    lastScrollY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateHeader); ticking = true; }
  }, { passive: true });
  updateHeader();

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* =====================================================
     REVEAL ON SCROLL — IntersectionObserver
     ===================================================== */
  const revealEls = document.querySelectorAll(
    '[data-reveal], [data-reveal-stagger], [data-stagger]'
  );
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  /* =====================================================
     PROCESS ROWS — activate individually
     ===================================================== */
  const processRows = document.querySelectorAll('.process-row');
  if (processRows.length) {
    const rowObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, { threshold: 0.45 });
    processRows.forEach(row => rowObs.observe(row));
  }

  /* =====================================================
     ANIMATED COUNTERS
     ===================================================== */
  const counters = document.querySelectorAll('.counter .num[data-count]');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start  = performance.now();

      function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased    = easeOutCubic(progress);
        const value    = target % 1 === 0
          ? Math.floor(target * eased)
          : (target * eased).toFixed(1);
        el.textContent = `${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = `${target}${suffix}`;
      }
      requestAnimationFrame(step);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterObs.observe(c));

  /* =====================================================
     PARALLAX — data-parallax="speed" elements
     ===================================================== */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    function updateParallax() {
      const vy = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.08;
        const rect  = el.getBoundingClientRect();
        const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
        el.style.transform = `translateY(${centerOffset * speed * -0.2}px)`;
      });
    }
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  /* =====================================================
     HERO VIDEO — trigger scale-down after load
     ===================================================== */
  const heroWrap = document.querySelector('.hero-video-wrap');
  const heroVideo = heroWrap?.querySelector('video');
  if (heroVideo) {
    heroVideo.addEventListener('canplay', () => {
      heroWrap.classList.add('loaded');
    });
    // Also trigger if video is cached
    if (heroVideo.readyState >= 3) heroWrap?.classList.add('loaded');
  }

  /* =====================================================
     HERO ENTRANCE — animate in after loader hides
     ===================================================== */
  function heroEntrance() {
    // Lines animate by CSS, but trigger .revealed classes
    document.querySelectorAll('.hero-headline .line span').forEach((span, i) => {
      setTimeout(() => span.classList.add('revealed'), 300 + i * 160);
    });
    setTimeout(() => document.querySelector('.hero-sub')?.classList.add('revealed'), 850);
    setTimeout(() => document.querySelector('.hero-ctas')?.classList.add('revealed'), 1100);
    setTimeout(() => document.querySelector('.hero-meta')?.classList.add('revealed'), 1400);
    setTimeout(() => document.querySelector('.scroll-indicator')?.classList.add('revealed'), 1750);
  }

  // Fire hero entrance once loader hides
  const loader = document.querySelector('.loader');
  if (loader) {
    const loaderObs = new MutationObserver(() => {
      if (loader.classList.contains('hidden')) {
        heroEntrance();
        loaderObs.disconnect();
      }
    });
    loaderObs.observe(loader, { attributes: true, attributeFilter: ['class'] });
    // Fallback
    setTimeout(heroEntrance, 1400);
  } else {
    heroEntrance();
  }

  /* =====================================================
     LAZY IMAGE LOADING — data-src
     ===================================================== */
  const lazyImgs = document.querySelectorAll('img[data-src], source[data-srcset]');
  if (lazyImgs.length) {
    const lazyObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.tagName === 'IMG' && el.dataset.src) {
          el.src = el.dataset.src;
          el.removeAttribute('data-src');
        }
        if (el.tagName === 'SOURCE' && el.dataset.srcset) {
          el.srcset = el.dataset.srcset;
          el.removeAttribute('data-srcset');
        }
        lazyObs.unobserve(el);
      });
    }, { rootMargin: '200px 0px' });
    lazyImgs.forEach(img => lazyObs.observe(img));
  }

  /* =====================================================
     HORIZONTAL SCROLL MATERIAL REEL
     Converts vertical scroll into horizontal translation
     within .h-scroll-section while it is pinned.
     ===================================================== */
  const hSection = document.querySelector('.h-scroll-section');
  const hTrack   = hSection?.querySelector('.h-scroll-track');
  if (hSection && hTrack) {
    // We do a simple "transform on scroll" approach
    // The section has enough height to allow scrolling through all items.
    function updateHScroll() {
      const rect   = hSection.getBoundingClientRect();
      const trackW = hTrack.scrollWidth - window.innerWidth;
      // How far have we scrolled into the pinned section?
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      hTrack.style.transform = `translateX(-${progress * trackW}px)`;
    }

    window.addEventListener('scroll', updateHScroll, { passive: true });
    updateHScroll();
  }

  /* =====================================================
     SECTION PROGRESS VARIABLE
     Sets --sp (0 → 1) on every section as it scrolls through
     ===================================================== */
  const spSections = document.querySelectorAll('[data-sp]');
  if (spSections.length) {
    function updateSP() {
      const vy = window.scrollY;
      const vh = window.innerHeight;
      spSections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        const sp   = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
        sec.style.setProperty('--sp', sp.toFixed(4));
      });
    }
    window.addEventListener('scroll', updateSP, { passive: true });
    updateSP();
  }

})();
