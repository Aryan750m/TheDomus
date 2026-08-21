/* =====================================================
   THE DOMUS — Architectural Editorial Project Controller
   v2: Re-spaced Namespaces (.p-*)
   ===================================================== */

(function () {
  "use strict";

  /* =====================================================
     1. HERO INITIALIZATION & SMOOTH SCROLL
     ===================================================== */
  function initProjectHero() {
    const hero = document.querySelector(".p-hero");
    if (!hero) return;

    // Trigger scale reveal
    requestAnimationFrame(() => {
      hero.classList.add("loaded");
    });

    // Scroll Down Button
    const scrollBtn = hero.querySelector(".p-hero-scroll");
    if (scrollBtn) {
      scrollBtn.addEventListener("click", () => {
        const nextSection = document.querySelector(".p-statement");
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }

  /* =====================================================
     2. EDITORIAL AMENITIES INTERACTION (STICKY PANEL)
     ===================================================== */
  function initProjectAmenities() {
    const section = document.querySelector(".p-amenities");
    if (!section) return;

    const rows = section.querySelectorAll(".p-amenity-row");
    const previewImg = section.querySelector(".p-amenities-preview img");
    const captionEl = section.querySelector(".p-amenities-preview-cap");

    if (!rows.length || !previewImg) return;

    let isTransitioning = false;

    rows.forEach((row) => {
      row.addEventListener("mouseenter", () => {
        rows.forEach(r => r.classList.remove("active"));
        row.classList.add("active");

        const targetSrc = row.getAttribute("data-img");
        const targetCaption = row.getAttribute("data-caption") || row.querySelector(".p-amenity-name")?.textContent || "";

        if (targetSrc && previewImg.getAttribute("src") !== targetSrc && !isTransitioning) {
          isTransitioning = true;
          previewImg.style.opacity = "0.3";
          previewImg.style.transform = "scale(0.98)";

          setTimeout(() => {
            previewImg.src = targetSrc;
            if (captionEl) captionEl.textContent = targetCaption;
            previewImg.style.opacity = "1";
            previewImg.style.transform = "scale(1)";
            isTransitioning = false;
          }, 200);
        }
      });

      // Click/touch support
      row.addEventListener("click", () => {
        rows.forEach(r => r.classList.remove("active"));
        row.classList.add("active");
        const targetSrc = row.getAttribute("data-img");
        const targetCaption = row.getAttribute("data-caption") || row.querySelector(".p-amenity-name")?.textContent || "";
        if (targetSrc && previewImg) {
          previewImg.src = targetSrc;
          if (captionEl) captionEl.textContent = targetCaption;
        }
      });
    });
  }

  /* =====================================================
     3. EDITORIAL HORIZONTAL GALLERY
     ===================================================== */
  function initProjectGallery() {
    const gallery = document.querySelector(".p-gallery");
    if (!gallery) return;

    const viewport = gallery.querySelector(".p-gallery-viewport");
    const track = gallery.querySelector(".p-gallery-track");
    const slides = Array.from(gallery.querySelectorAll(".p-gallery-slide"));
    const prevBtn = gallery.querySelector(".p-gallery-arrow.prev");
    const nextBtn = gallery.querySelector(".p-gallery-arrow.next");
    const counterEl = gallery.querySelector(".p-gallery-counter");
    const progressBar = gallery.querySelector(".p-gallery-bar");

    if (!track || !slides.length) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    function getSlideWidth() {
      if (!slides[0]) return 0;
      const rect = slides[0].getBoundingClientRect();
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.gap) || 24;
      return rect.width + gap;
    }

    function updateGallery(animate = true) {
      const slideWidth = getSlideWidth();
      const maxScroll = Math.max(0, (totalSlides * slideWidth) - (viewport.clientWidth || window.innerWidth));
      let targetTranslate = currentIndex * slideWidth;

      if (targetTranslate > maxScroll) {
        targetTranslate = maxScroll;
      }

      currentTranslate = targetTranslate;
      prevTranslate = targetTranslate;

      track.style.transition = animate ? "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)" : "none";
      track.style.transform = `translateX(-${targetTranslate}px)`;

      // Update counter
      if (counterEl) {
        const currFormatted = String(currentIndex + 1).padStart(2, "0");
        const totalFormatted = String(totalSlides).padStart(2, "0");
        counterEl.textContent = `${currFormatted} / ${totalFormatted}`;
      }

      // Update progress bar
      if (progressBar) {
        const progress = totalSlides > 1 ? currentIndex / (totalSlides - 1) : 0;
        progressBar.style.width = `${Math.max(15, (1 / totalSlides) * 100)}%`;
        progressBar.style.left = `${progress * (100 - Math.max(15, (1 / totalSlides) * 100))}%`;
      }

      // Update arrow states
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= totalSlides - 1;
    }

    function goToSlide(index) {
      currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
      updateGallery(true);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));
    }

    // Touch & Drag
    function touchStart(e) {
      isDragging = true;
      startX = getPositionX(e);
      track.style.transition = "none";
      viewport.classList.add("is-dragging");
      animationID = requestAnimationFrame(animationLoop);
    }

    function touchMove(e) {
      if (!isDragging) return;
      const currentX = getPositionX(e);
      const diffX = currentX - startX;
      currentTranslate = prevTranslate - diffX;
    }

    function touchEnd() {
      if (!isDragging) return;
      isDragging = false;
      cancelAnimationFrame(animationID);
      viewport.classList.remove("is-dragging");

      const movedBy = currentTranslate - prevTranslate;

      if (movedBy > 45) {
        goToSlide(currentIndex + 1);
      } else if (movedBy < -45) {
        goToSlide(currentIndex - 1);
      } else {
        goToSlide(currentIndex);
      }
    }

    function getPositionX(e) {
      return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    }

    function animationLoop() {
      if (isDragging) {
        track.style.transform = `translateX(-${currentTranslate}px)`;
        requestAnimationFrame(animationLoop);
      }
    }

    viewport.addEventListener("touchstart", touchStart, { passive: true });
    viewport.addEventListener("touchmove", touchMove, { passive: true });
    viewport.addEventListener("touchend", touchEnd);

    viewport.addEventListener("mousedown", touchStart);
    viewport.addEventListener("mousemove", touchMove);
    viewport.addEventListener("mouseup", touchEnd);
    viewport.addEventListener("mouseleave", () => {
      if (isDragging) touchEnd();
    });

    // Keyboard
    window.addEventListener("keydown", (e) => {
      const rect = gallery.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === "ArrowLeft") {
        goToSlide(currentIndex - 1);
      } else if (e.key === "ArrowRight") {
        goToSlide(currentIndex + 1);
      }
    });

    window.addEventListener("resize", () => updateGallery(false));
    updateGallery(false);
  }

  /* =====================================================
     4. EDITORIAL FULLSCREEN LIGHTBOX
     ===================================================== */
  function initProjectLightbox() {
    const gallerySlides = document.querySelectorAll(".p-gallery-slide");
    const lightbox = document.getElementById("projectLightbox");
    if (!lightbox || !gallerySlides.length) return;

    const lightboxImg = lightbox.querySelector(".p-lightbox-img");
    const lightboxCounter = lightbox.querySelector(".p-lightbox-counter");
    const lightboxCaption = lightbox.querySelector(".p-lightbox-caption");
    const closeBtn = lightbox.querySelector(".p-lightbox-close");
    const prevBtn = lightbox.querySelector(".p-lightbox-prev");
    const nextBtn = lightbox.querySelector(".p-lightbox-next");

    const mediaList = Array.from(gallerySlides).map(slide => {
      const img = slide.querySelector("img");
      const title = slide.querySelector(".p-gallery-slide-label")?.textContent || "";
      return {
        src: img ? img.getAttribute("src") : "",
        alt: img ? img.getAttribute("alt") : "",
        caption: title
      };
    });

    let currentIdx = 0;

    function openLightbox(index) {
      currentIdx = index;
      renderImage();
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    }

    function renderImage() {
      if (!mediaList[currentIdx] || !lightboxImg) return;
      lightboxImg.style.opacity = "0.4";

      setTimeout(() => {
        lightboxImg.src = mediaList[currentIdx].src;
        lightboxImg.alt = mediaList[currentIdx].alt;
        if (lightboxCaption) lightboxCaption.textContent = mediaList[currentIdx].caption;
        if (lightboxCounter) {
          const curr = String(currentIdx + 1).padStart(2, "0");
          const total = String(mediaList.length).padStart(2, "0");
          lightboxCounter.textContent = `${curr} / ${total}`;
        }
        lightboxImg.style.opacity = "1";
      }, 150);
    }

    function showNext() {
      currentIdx = (currentIdx + 1) % mediaList.length;
      renderImage();
    }

    function showPrev() {
      currentIdx = (currentIdx - 1 + mediaList.length) % mediaList.length;
      renderImage();
    }

    gallerySlides.forEach((slide, idx) => {
      slide.addEventListener("click", () => openLightbox(idx));
    });

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (prevBtn) prevBtn.addEventListener("click", showPrev);
    if (nextBtn) nextBtn.addEventListener("click", showNext);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.classList.contains("p-lightbox-stage")) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    });
  }

  /* =====================================================
     5. BROCHURE MODAL & PDF DOWNLOAD SYSTEM
     ===================================================== */
  function initBrochureModal() {
    const modal = document.getElementById("brochureModal");
    const closeBtn = document.getElementById("closeBrochure");
    const form = document.getElementById("brochureForm");
    const openBtns = document.querySelectorAll("#openBrochure, [data-open-brochure]");

    if (!modal) return;

    let activePdfUrl = "";

    function openModal(btn) {
      if (btn && btn.hasAttribute("data-pdf")) {
        activePdfUrl = btn.getAttribute("data-pdf");
      }
      modal.classList.add("active");
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
      const nameInput = form?.querySelector("input[type='text'], input[type='tel']");
      if (nameInput) setTimeout(() => nameInput.focus(), 100);
    }

    function closeModal() {
      modal.classList.remove("active");
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }

    openBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal(btn);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && (modal.classList.contains("active") || modal.classList.contains("open"))) {
        closeModal();
      }
    });

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const phoneInput = form.querySelector("#phoneInput") || form.querySelector("input[type='tel']");
        if (phoneInput && !phoneInput.value.trim()) {
          phoneInput.focus();
          return;
        }

        const submitBtn = form.querySelector(".download-btn");
        const originalText = submitBtn ? submitBtn.textContent : "";
        if (submitBtn) {
          submitBtn.textContent = "Downloading...";
          submitBtn.disabled = true;
        }

        if (activePdfUrl) {
          const downloadLink = document.createElement("a");
          downloadLink.href = activePdfUrl;
          downloadLink.download = activePdfUrl.split("/").pop() || "The-Domus-Brochure.pdf";
          downloadLink.target = "_blank";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.textContent = "Downloaded ✓";
          }
          setTimeout(() => {
            closeModal();
            form.reset();
            if (submitBtn) {
              submitBtn.textContent = originalText;
              submitBtn.disabled = false;
            }
          }, 1200);
        }, 800);
      });
    }
  }

  /* =====================================================
     6. PERFORMANCE REVEALS & SCROLL RESTORATION
     ===================================================== */
  function initProjectScrollEffects() {
    const revealElements = document.querySelectorAll(
      ".p-statement, .p-story, .p-data, .p-visual-pause, .p-amenities, .p-gallery, .p-location, .p-cta"
    );

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      revealElements.forEach(el => observer.observe(el));
    }
  }

  /* =====================================================
     7. BOOTSTRAP CONTROLLER
     ===================================================== */
  function init() {
    initProjectHero();
    initProjectAmenities();
    initProjectGallery();
    initProjectLightbox();
    initBrochureModal();
    initProjectScrollEffects();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
