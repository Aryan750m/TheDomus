/* =====================================================
   THE DOMUS — Main v2
   Loader sequence (multi-phase), mobile nav,
   active nav link, page transitions, form handling,
   smooth-scroll for anchors.
   ===================================================== */
(() => {

  /* =====================================================
     LOADER — multi-phase dramatic reveal
     ===================================================== */
  const loader   = document.querySelector('.loader');
  const loaderBrand = loader?.querySelector('.loader-brand span');

  function hideLoader() {
    if (!loader) return;
    loader.classList.add('hidden');
  }

  window.addEventListener('load', () => {
    // Phase 1: brand word already animating via CSS keyframe
    // Phase 2: hide loader
    const delay = Math.max(1600, performance.now() < 1600 ? 1600 - performance.now() : 0);
    setTimeout(hideLoader, delay);
  });

  // Failsafe: if load event never fires (blocked asset), still hide
  setTimeout(hideLoader, 4000);

  /* =====================================================
     MOBILE NAVIGATION
     ===================================================== */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav?.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', isOpen.toString());
  });

  mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
      hamburger?.setAttribute('aria-expanded', 'false');
    });
  });

  // Close mobile nav on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileNav?.classList.contains('open')) {
      hamburger?.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* =====================================================
     ACTIVE NAV LINK — by current path
     ===================================================== */
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html') || current === href) {
      link.classList.add('active');
    }
  });

  /* =====================================================
     PAGE TRANSITION — slide overlay between pages
     ===================================================== */
  const transitionEl = document.querySelector('.page-transition');
  if (transitionEl) {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (!href || link.target === '_blank' || href.startsWith('http') || href.startsWith('#')) return;
        e.preventDefault();
        transitionEl.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 700);
      });
    });

    // Remove transition overlay on page show (back button)
    window.addEventListener('pageshow', () => {
      transitionEl.classList.remove('active');
    });
  }

  /* =====================================================
     CONTACT / NEWSLETTER FORMS — front-end validation
     ===================================================== */
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const status   = form.querySelector('.form-status');
      const submitBtn= form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      // Simulate async submit delay
      setTimeout(() => {
        if (status) {
          status.textContent = form.classList.contains('newsletter')
            ? 'Thank you for subscribing. A confirmation is on its way.'
            : 'Thank you — your enquiry has been received. We reply within one business day.';
          status.classList.add('visible');
          status.style.opacity = '1';
        }
        form.reset();
        if (submitBtn) submitBtn.disabled = false;

        // Auto-clear status after 6 seconds
        if (status) setTimeout(() => {
          status.style.opacity = '0';
          setTimeout(() => {
            status.classList.remove('visible');
            status.textContent = '';
          }, 500);
        }, 6000);
      }, 800);
    });
  });

  /* =====================================================
     SMOOTH SCROLL — on-page anchor links
     ===================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id     = link.getAttribute('href');
      if (!id || id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const headerH = document.querySelector('.site-header')?.offsetHeight || 80;
        const top     = target.getBoundingClientRect().top + window.scrollY - headerH - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* =====================================================
     ABOUT PANEL SCROLL SCENE (from backup — High Performance 60fps)
     ===================================================== */
  function initAboutScene() {
    if (!window.gsap || !window.ScrollTrigger) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scene = document.querySelector('.hero-sobha-style');
    const panel = document.querySelector('#about-panel');
    const content = document.querySelector('#about-content');
    if (!scene || !panel || !content) return;

    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: true });

    const heroCenter = scene.querySelector('.hero-center-container');
    const titleTop = content.querySelector('.about-title-top');
    const titleBottom = content.querySelector('.about-title-bottom');
    const text = content.querySelector('.about-text');
    const button = content.querySelector('.about-btn');

    gsap.set(panel, {
      yPercent: 100,
      y: 0,
      scale: 0.65,
      borderRadius: "50% 50% 0 0",
      transformOrigin: "50% 100%",
      force3D: true,
      willChange: "transform,border-radius"
    });

    gsap.set([titleTop, titleBottom, text, button], {
      opacity: 0,
      y: 20,
      force3D: true,
      willChange: "transform,opacity"
    });

    if (heroCenter) {
      gsap.set(heroCenter, {
        opacity: 1,
        scale: 1,
        force3D: true,
        willChange: "opacity,transform"
      });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scene,
        start: "top top",
        end: "+=75%",
        pin: true,
        pinSpacing: true,
        scrub: 0.3,
        anticipatePin: 1,
        fastScrollEnd: true,
        preventOverlaps: true
      }
    });

    if (heroCenter) {
      tl.to(heroCenter, {
        opacity: 0,
        scale: 0.96,
        ease: "power1.inOut",
        duration: 0.35
      }, 0);
    }

    tl.to(panel, {
      yPercent: 0,
      scale: 1,
      borderRadius: "0px",
      ease: "none",
      duration: 1
    }, 0.1);

    tl.to([titleTop, titleBottom, text, button], {
      opacity: 1,
      y: 0,
      stagger: 0.06,
      ease: "power2.out",
      duration: 0.25
    }, 0.65);

    ScrollTrigger.refresh();
  }

  /* =====================================================
     3D GALLERY CAROUSEL (from backup)
     ===================================================== */
  function initGalleryCarousel3D() {
    const carousel = document.querySelector('#galleryCarousel3d');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-3d-track');
    const prevBtn = carousel.querySelector('.carousel-3d-btn--prev');
    const nextBtn = carousel.querySelector('.carousel-3d-btn--next');

    if (!track || !prevBtn || !nextBtn) return;

    let slides = Array.from(carousel.querySelectorAll('.carousel-3d-slide'));
    let activeIdx = 0;
    let startX = 0;
    let isDragging = false;

    function updatePositions() {
      if (slides.length === 0) return;

      if (activeIdx < 0) activeIdx = slides.length - 1;
      if (activeIdx >= slides.length) activeIdx = 0;

      slides.forEach((slide, i) => {
        let diff = i - activeIdx;

        const half = slides.length / 2;
        if (diff > half) {
          diff -= slides.length;
        } else if (diff < -half) {
          diff += slides.length;
        }

        slide.classList.remove('active');

        if (diff === 0) {
          slide.style.transform = 'translate3d(0, 0, 100px) rotateY(0deg) scale(1.05)';
          slide.style.opacity = '1';
          slide.style.zIndex = '10';
          slide.style.filter = 'none';
          slide.classList.add('active');
        } else if (diff === 1 || (slides.length === 2 && diff === -1 && i > activeIdx)) {
          slide.style.transform = 'translate3d(80%, 0, -200px) rotateY(-28deg) scale(0.84)';
          slide.style.opacity = '0.7';
          slide.style.zIndex = '5';
          slide.style.filter = 'blur(4px)';
        } else if (diff === -1 || (slides.length === 2 && diff === 1 && i < activeIdx)) {
          slide.style.transform = 'translate3d(-80%, 0, -200px) rotateY(28deg) scale(0.84)';
          slide.style.opacity = '0.7';
          slide.style.zIndex = '5';
          slide.style.filter = 'blur(4px)';
        } else {
          const dir = diff > 0 ? 1 : -1;
          slide.style.transform = `translate3d(${dir * 160}%, 0, -400px) rotateY(${-dir * 35}deg) scale(0.65)`;
          slide.style.opacity = '0';
          slide.style.zIndex = '1';
          slide.style.filter = 'blur(10px)';
        }
      });
    }

    function touchStart(e) {
      startX = getPositionX(e);
      isDragging = true;
    }

    function touchMove(e) {
      if (!isDragging) return;
      const currentX = getPositionX(e);
      const diffX = currentX - startX;

      if (slides[activeIdx]) {
        const centerSlide = slides[activeIdx];
        centerSlide.style.transform = `translate3d(${diffX * 0.3}px, 0, 50px) scale(1.05)`;
      }
    }

    function touchEnd(e) {
      if (!isDragging) return;
      isDragging = false;

      const currentX = getPositionX(e);
      const diffX = currentX - startX;

      if (diffX < -50) {
        activeIdx++;
      } else if (diffX > 50) {
        activeIdx--;
      }

      updatePositions();
    }

    function getPositionX(e) {
      if (e.type.includes('mouse')) {
        return e.pageX;
      }
      return e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.changedTouches[0].clientX;
    }

    track.addEventListener('mousedown', touchStart);
    track.addEventListener('mousemove', touchMove);
    window.addEventListener('mouseup', touchEnd);

    track.addEventListener('touchstart', touchStart, { passive: true });
    track.addEventListener('touchmove', touchMove, { passive: true });
    track.addEventListener('touchend', touchEnd);

    prevBtn.addEventListener('click', () => {
      activeIdx--;
      updatePositions();
    });

    nextBtn.addEventListener('click', () => {
      activeIdx++;
      updatePositions();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        activeIdx--;
        updatePositions();
      } else if (e.key === 'ArrowRight') {
        activeIdx++;
        updatePositions();
      }
    });

    updatePositions();
  }

  // Initialize Scenes
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initAboutScene();
      initGalleryCarousel3D();
    });
  } else {
    initAboutScene();
    initGalleryCarousel3D();
  }

})();
