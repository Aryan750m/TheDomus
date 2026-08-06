/* =====================================================
   THE DOMUS — Interaction Animations v2
   Magnetic buttons, ripple, gallery filter (smooth),
   lightbox (prev/next + keyboard), testimonial slider
   (touch swipe + dots), FAQ accordion, project tilt.
   ===================================================== */
(() => {

  /* =====================================================
     MAGNETIC BUTTONS
     ===================================================== */
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width  / 2) * 0.30;
      const y = (e.clientY - rect.top  - rect.height / 2) * 0.45;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });

  /* =====================================================
     RIPPLE ON CLICK
     ===================================================== */
  document.querySelectorAll('.ripple-el').forEach(el => {
    el.addEventListener('click', e => {
      const rect   = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size   = Math.max(rect.width, rect.height) * 2;
      ripple.className = 'ripple';
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        width:  ${size}px;
        height: ${size}px;
        left:   ${e.clientX - rect.left - size / 2}px;
        top:    ${e.clientY - rect.top  - size / 2}px;
        background: rgba(246,242,232,0.18);
        transform: scale(0);
        animation: rippleAnim .65s cubic-bezier(.16,.84,.44,1) forwards;
        pointer-events: none;
        z-index: 10;
      `;
      el.style.position = 'relative';
      el.style.overflow = 'hidden';
      el.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  /* =====================================================
     GALLERY FILTERS — smooth opacity + scale transition
     ===================================================== */
  const filterBtns     = document.querySelectorAll('.gallery-filters button');
  const filterableItems= document.querySelectorAll('.masonry-item[data-category], .project-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      filterableItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        if (show) {
          item.classList.remove('hidden');
          // Slight stagger based on position
          item.style.transitionDelay = `${Math.random() * 0.2}s`;
        } else {
          item.classList.add('hidden');
          item.style.transitionDelay = '0s';
        }
      });
    });
  });

  /* =====================================================
     LIGHTBOX — prev / next / keyboard / touch
     ===================================================== */
  const lightbox        = document.querySelector('.lightbox');
  const lightboxInner   = lightbox?.querySelector('.lightbox-inner');
  const lightboxCounter = lightbox?.querySelector('.lightbox-counter');
  let lightboxItems  = [];
  let lightboxIndex  = 0;

  function openLightbox(index) {
    if (!lightbox || !lightboxInner) return;
    lightboxIndex = Math.max(0, Math.min(index, lightboxItems.length - 1));
    const item = lightboxItems[lightboxIndex];
    const img  = item.querySelector('img');
    const ph   = item.querySelector('.ph');
    if (img) {
      lightboxInner.innerHTML = `<img src="${img.src}" alt="${img.alt || ''}" loading="lazy" style="max-width:90vw;max-height:88vh;object-fit:contain;border-radius:2px;" />`;
    } else if (ph) {
      lightboxInner.innerHTML = ph.outerHTML;
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxItems.length}`;
    }
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Update prev/next visibility
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    if (prevBtn) prevBtn.style.opacity = lightboxIndex === 0 ? '0.3' : '1';
    if (nextBtn) nextBtn.style.opacity = lightboxIndex === lightboxItems.length - 1 ? '0.3' : '1';
  }

  function closeLightbox() {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function lightboxNext() { openLightbox(lightboxIndex + 1); }
  function lightboxPrev() { openLightbox(lightboxIndex - 1); }

  if (lightbox) {
    lightboxItems = Array.from(document.querySelectorAll('[data-lightbox]'));

    lightboxItems.forEach((trigger, i) => {
      trigger.addEventListener('click', () => openLightbox(i));
    });

    lightbox.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev')?.addEventListener('click', lightboxPrev);
    lightbox.querySelector('.lightbox-next')?.addEventListener('click', lightboxNext);

    // Click outside
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowRight') lightboxNext();
      if (e.key === 'ArrowLeft')  lightboxPrev();
    });

    // Touch swipe on lightbox
    let lbTouchStartX = 0;
    lightbox.addEventListener('touchstart', e => {
      lbTouchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - lbTouchStartX;
      if (dx > 60)  lightboxPrev();
      if (dx < -60) lightboxNext();
    }, { passive: true });
  }

  /* =====================================================
     TESTIMONIAL SLIDER — swipe, dots, autoplay
     ===================================================== */
  const track  = document.querySelector('.testimonial-track');
  const dotsEl = document.querySelector('.slider-dots');
  if (track) {
    const slides = Array.from(track.querySelectorAll('.testimonial-slide'));
    let index = 0;
    let autoplayTimer;
    let touchStartX = 0;

    // Build dots
    if (dotsEl) {
      slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(dot);
      });
    }

    function goTo(i) {
      index = ((i % slides.length) + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((s, n) => s.classList.toggle('active', n === index));
      // Update dots
      dotsEl?.querySelectorAll('span').forEach((d, n) => {
        d.classList.toggle('active', n === index);
      });
    }

    function startAutoplay() {
      autoplayTimer = setInterval(() => goTo(index + 1), 5500);
    }
    function stopAutoplay() {
      clearInterval(autoplayTimer);
    }

    goTo(0);
    startAutoplay();

    document.querySelector('.slider-nav .prev')?.addEventListener('click', () => {
      stopAutoplay(); goTo(index - 1); startAutoplay();
    });
    document.querySelector('.slider-nav .next')?.addEventListener('click', () => {
      stopAutoplay(); goTo(index + 1); startAutoplay();
    });

    // Pause on hover
    track.closest('.testimonial-slider')?.addEventListener('mouseenter', stopAutoplay);
    track.closest('.testimonial-slider')?.addEventListener('mouseleave', startAutoplay);

    // Touch swipe
    track.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (dx > 55)  { stopAutoplay(); goTo(index - 1); startAutoplay(); }
      if (dx < -55) { stopAutoplay(); goTo(index + 1); startAutoplay(); }
    }, { passive: true });
  }

  /* =====================================================
     FAQ ACCORDION
     ===================================================== */
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const body = item.querySelector('.faq-body');
      const inner= item.querySelector('.faq-body-inner');
      const isOpen = item.classList.contains('open');

      // Close all others
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          const b = openItem.querySelector('.faq-body');
          openItem.classList.remove('open');
          b.style.maxHeight = '0';
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('open');
        body.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        body.style.maxHeight = inner.scrollHeight + 'px';
      }
    });
  });

  /* =====================================================
     PROJECT CARD 3D TILT (with light reflex)
     ===================================================== */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });

  /* =====================================================
     MARQUEE STRIP — pause on hover (CSS handles it)
     Already handled via CSS: .marquee-strip:hover .marquee-track
     ===================================================== */

  /* =====================================================
     HOVER SHIMMER — activate on .hover-shimmer elements
     ===================================================== */
  // CSS animation handles this via .hover-shimmer:hover::after

  /* =====================================================
     MOBILE NAV LINK STAGGER (on open)
     ===================================================== */
  const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      mobileNavLinks.forEach((link, i) => {
        link.style.transitionDelay = isOpen ? `${i * 0.07}s` : '0s';
        link.style.opacity         = isOpen ? '1' : '0';
        link.style.transform       = isOpen ? 'translateX(0)' : 'translateX(-20px)';
      });
    });
  }

})();
