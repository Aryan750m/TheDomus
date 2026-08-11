// Force page to always load at the top of the Hero section on reload
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
// window.scrollTo(0, 0);

/* ==============================
   HELPERS
============================= */
const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)];

/* ==============================
   HERO SLIDER (UNCHANGED LOGIC)
============================== */
function initHeroSlider() {
    const slides = $$(".slide");
    const dotsContainer = $("#dots");

    if (!slides.length || !dotsContainer) return;

    let currentSlide = 0;
    const slideDuration = 5000;

    slides.forEach((_, index) => {
        const dot = document.createElement("span");
        dot.className = "dot" + (index === 0 ? " active" : "");
        dot.addEventListener("click", () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = $$(".dot", dotsContainer);

    function goToSlide(index) {
        slides[currentSlide].classList.remove("active");
        dots[currentSlide].classList.remove("active");

        currentSlide = index;

        slides[currentSlide].classList.add("active");
        dots[currentSlide].classList.add("active");
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    setInterval(nextSlide, slideDuration);
}

/* ==============================
   LOGO SCROLL SCALE (EXACT OLD LOGIC RESTORED)
============================== */
function initLogoScroll() {
    const logo = $("#logo");
    const hero = $("#hero");
    const header = $("header");
    console.log("Logo scroll initialized");

    if (!logo || !hero || !header) return;

    const maxWidth = 420;
    const minWidth = 240;

    function updateLogoPosition() {
        const heroRect = hero.getBoundingClientRect();
        const headerHeight = header.offsetHeight;
        console.log("scrolling", hero.getBoundingClientRect().top);

        const triggerDistance = heroRect.height / 2 - headerHeight;
        let progress = Math.min(Math.max((0 - heroRect.top) / triggerDistance, 0), 1);

        progress = 1 - Math.pow(1 - progress, 2);

        const scale = (minWidth / maxWidth - 1) * progress + 1;

        const heroCenterY = heroRect.height / 2;
        const headerCenterY =
            headerHeight / 2 + header.getBoundingClientRect().top;

        const translateY = (headerCenterY - heroCenterY) * progress;

        logo.style.transform =
            `translate(-50%, calc(-50% + ${translateY}px)) scale(${scale})`;
    }

    window.addEventListener("scroll", () => {
        requestAnimationFrame(updateLogoPosition);
    });

    window.addEventListener("resize", updateLogoPosition);

    updateLogoPosition();
}

/* ==============================
   ABOUT US CAROUSEL (INFINITE RESTORED)
============================== */
function initAboutCarousel() {
    const carousel = $("#carousel");
    const prevBtn = $(".prev-btn");
    const nextBtn = $(".next-btn");

    if (!carousel || !prevBtn || !nextBtn) return;

    let scrollAmount = 0;
    const cardWidth = 236;

    const galleryItems = Array.from(carousel.children);
    galleryItems.forEach(item => {
        const clone = item.cloneNode(true);
        carousel.appendChild(clone);
    });

    function scrollNext() {
        scrollAmount += cardWidth;
        if (scrollAmount >= carousel.scrollWidth / 2) {
            scrollAmount = 0;
        }
        carousel.style.transform = `translateX(-${scrollAmount}px)`;
    }

    function scrollPrev() {
        scrollAmount -= cardWidth;
        if (scrollAmount < 0) {
            scrollAmount = (carousel.scrollWidth / 2) - cardWidth;
        }
        carousel.style.transform = `translateX(-${scrollAmount}px)`;
    }

    nextBtn.addEventListener("click", scrollNext);
    prevBtn.addEventListener("click", scrollPrev);
}

/* ==============================
   GALLERY CAROUSEL (RESTORED)
============================== */
function initGalleryCarousel() {
    const galleryCarousel = $("#galleryCarousel");
    const galleryNext = $("#galleryNext");
    const galleryPrev = $("#galleryPrev");

    if (!galleryCarousel || !galleryNext || !galleryPrev) return;

    let galleryIndex = 0;

    function updateGallery() {
        const slideWidth =
            galleryCarousel.children[0].offsetWidth + 40;
        galleryCarousel.style.transform =
            `translateX(-${galleryIndex * slideWidth}px)`;
    }

    galleryNext.addEventListener("click", () => {
        if (galleryIndex < galleryCarousel.children.length - 3) {
            galleryIndex++;
            updateGallery();
        }
    });

    galleryPrev.addEventListener("click", () => {
        if (galleryIndex > 0) {
            galleryIndex--;
            updateGallery();
        }
    });

    window.addEventListener("resize", updateGallery);
}

/* ==============================
   3D GALLERY CAROUSEL (NEW EFFECT)
============================== */
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

        // Normalize active index limits
        if (activeIdx < 0) activeIdx = slides.length - 1;
        if (activeIdx >= slides.length) activeIdx = 0;

        slides.forEach((slide, i) => {
            let diff = i - activeIdx;

            // Shortest distance wrapping
            const half = slides.length / 2;
            if (diff > half) {
                diff -= slides.length;
            } else if (diff < -half) {
                diff += slides.length;
            }

            slide.classList.remove('active');

            if (diff === 0) {
                // Center Slide - Large Focus
                slide.style.transform = 'translate3d(0, 0, 100px) rotateY(0deg) scale(1.05)';
                slide.style.opacity = '1';
                slide.style.zIndex = '10';
                slide.style.filter = 'none';
                slide.classList.add('active');
            } else if (diff === 1 || (slides.length === 2 && diff === -1 && i > activeIdx)) {
                // Right Side Slide - Depth & Tilt (Apple style: less aggressive tilt & blur)
                slide.style.transform = 'translate3d(80%, 0, -200px) rotateY(-28deg) scale(0.84)';
                slide.style.opacity = '0.7';
                slide.style.zIndex = '5';
                slide.style.filter = 'blur(4px)';
            } else if (diff === -1 || (slides.length === 2 && diff === 1 && i < activeIdx)) {
                // Left Side Slide - Depth & Tilt
                slide.style.transform = 'translate3d(-80%, 0, -200px) rotateY(28deg) scale(0.84)';
                slide.style.opacity = '0.7';
                slide.style.zIndex = '5';
                slide.style.filter = 'blur(4px)';
            } else {
                // Back/Far Slides - Faded out and hidden
                const dir = diff > 0 ? 1 : -1;
                slide.style.transform = `translate3d(${dir * 160}%, 0, -400px) rotateY(${-dir * 35}deg) scale(0.65)`;
                slide.style.opacity = '0';
                slide.style.zIndex = '1';
                slide.style.filter = 'blur(10px)';
            }
        });
    }

    // Drag/Swipe Gesture Handlers
    function touchStart(e) {
        startX = getPositionX(e);
        isDragging = true;
    }

    function touchMove(e) {
        if (!isDragging) return;
        const currentX = getPositionX(e);
        const diffX = currentX - startX;

        // Subtle offset feedback in real-time
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

    // Event Registration
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

    // Keyboard Arrow Keys
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            activeIdx--;
            updatePositions();
        } else if (e.key === 'ArrowRight') {
            activeIdx++;
            updatePositions();
        }
    });

    // Run Initial Positions
    updatePositions();
}

/* ==============================
   POPUP FORM (RESTORED)
============================== */
function initPopupForm() {
    const openFormBtn = $(".open-form-btn");
    const popupOverlay = $("#popupOverlay");
    const closePopup = $("#closePopup");
    const form = $("#contactForm");

    if (!openFormBtn || !popupOverlay || !closePopup) return;

    openFormBtn.addEventListener("click", () => {
        popupOverlay.style.display = "flex";
    });

    closePopup.addEventListener("click", () => {
        popupOverlay.style.display = "none";
    });

    popupOverlay.addEventListener("click", e => {
        if (e.target === popupOverlay) {
            popupOverlay.style.display = "none";
        }
    });

    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        fetch(form.action, {
            method: "POST",
            body: new FormData(form)
        })
            .then(r => r.text())
            .then(() => form.reset())
            .catch(() => alert("Error sending message"));
    });
}

/* ==============================
   MOBILE MENU (RESTORED)
============================== */
function initMobileMenu() {
    const ham = $(".hamburger");
    const mobileMenu = $(".mobile-menu");
    const mobileClose = $(".mobile-close");
    const men = $("#logo2");

    if (!ham || !mobileMenu || !mobileClose) return;

    ham.addEventListener("click", () => {
        ham.classList.toggle("active");
        mobileMenu.classList.toggle("open");
        ham.style.display = "none";
        if (men) men.style.zIndex = "300";
    });

    mobileClose.addEventListener("click", () => {
        ham.classList.remove("active");
        mobileMenu.classList.remove("open");
        ham.style.display = "flex";
        if (men) men.style.zIndex = "1500";
    });
}

/* ==============================
   SECTION ANIMATIONS (RESTORED)
============================== */
function initSectionAnimations() {
    const sections = [
        { el: $(".about-section"), threshold: 0.3 },
        { el: $(".gallery-section"), threshold: 0.3 }
    ];

    sections.forEach(({ el, threshold }) => {
        if (!el) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    el.classList.add("animate");
                    observer.unobserve(el);
                }
            });
        }, { threshold });

        observer.observe(el);
    });
}

/* ==============================
   STATS COUNTER (OLD VERSION RESTORED)
============================== */
function initStatsCounter() {
    const section = document.querySelector(".stats-section-luxury");
    if (!section) return;

    const yearsEl = document.getElementById("stat-years");
    const homesEl = document.getElementById("stat-homes");

    if (!yearsEl || !homesEl) return;

    // Years Counter (0 to 30)
    let startYears = 0;
    const endYears = 30;
    const durationYears = 1500; // ms
    const stepYears = endYears / (durationYears / 16);

    // Homes Counter (0 to 2000)
    let startHomes = 0;
    const endHomes = 2000;
    const durationHomes = 1500; // ms
    const stepHomes = endHomes / (durationHomes / 16);

    function runYears() {
        startYears += stepYears;
        if (startYears < endYears) {
            yearsEl.innerText = Math.floor(startYears);
            requestAnimationFrame(runYears);
        } else {
            yearsEl.innerText = endYears;
        }
    }

    function runHomes() {
        startHomes += stepHomes;
        if (startHomes < endHomes) {
            homesEl.innerText = Math.floor(startHomes).toLocaleString();
            requestAnimationFrame(runHomes);
        } else {
            homesEl.innerText = endHomes.toLocaleString();
        }
    }

    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            section.classList.add("animate");
            runYears();
            runHomes();
            observer.disconnect();
        }
    }, { threshold: 0.2 });

    observer.observe(section);
}

function initStatsCounter2() {
    // Consolidated with initStatsCounter()
}

// Project carousel functions moved to projects.html


function initAboutScene() {
    if (!window.gsap || !window.ScrollTrigger) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scene = $("#hero");
    const panel = $("#about-panel");
    const content = $("#about-content");
    if (!scene || !panel || !content) return;

    gsap.registerPlugin(ScrollTrigger);

    const bg = $(".hero-image", scene);
    const heroFrame = $(".hero-frame", scene);
    const logo = $("#logo");
    const eyebrow = $(".eyebrow-block", content);
    const titleTop = $(".about-title-top", content);
    const titleBottom = $(".about-title-bottom", content);
    const text = $(".about-text", content);
    const button = $(".about-btn", content);

    gsap.set(panel, {
        yPercent: 100,
        y: 0,
        scale: 0.65,
        borderRadius: "50% 50% 0 0",
        transformOrigin: "50% 100%",
        willChange: "transform,border-radius"
    });

    if (bg) {
        gsap.set(bg, {
            scale: 1.08,
            y: 40,
            transformOrigin: "50% 50%",
            willChange: "transform"
        });
    }

    gsap.set([eyebrow, titleTop, titleBottom, text, button], {
        opacity: 0,
        y: 26,
        willChange: "transform,opacity"
    });

    gsap.set([heroFrame, logo], {
        opacity: 1,
        scale: 1,
        willChange: "opacity,transform"
    });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: "+=80%",
            pin: true,
            pinSpacing: true,
            scrub: 0.3,
            anticipatePin: 1
        }
    });

    tl.to([heroFrame, logo], {
        opacity: 0,
        scale: 0.95,
        ease: "power1.inOut",
        duration: 0.35
    }, 0);

    tl.to(panel, {
        yPercent: 0,
        scale: 1,
        borderRadius: "0px",
        ease: "none",
        duration: 1
    }, 0.15);

    if (bg) {
        tl.to(bg, {
            scale: 1,
            y: 0,
            ease: "none",
            duration: 1
        }, 0.15);
    }

    tl.to([eyebrow, titleTop, titleBottom, text, button], {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        ease: "power2.out",
        duration: 0.25
    }, 0.75);

    ScrollTrigger.refresh();
}

/* ==============================
   LUXURY MOTION LAYER
============================== */
function initLuxuryMotion() {
    if (!window.gsap || !window.ScrollTrigger) return;
    if (document.body.classList.contains("about-page")) return;

    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const revealTargets = [
        ".gallery-section",
        ".stats-banner",
        ".stats-banner-mobile",
        ".who-we-are-section:not(#aboutModal *)",
        ".vision-mission-section:not(#aboutModal *)",
        ".values-section:not(#aboutModal *)",
        ".legacy-section:not(#aboutModal *)",
        ".contact-section",
        ".project-carousel",
        ".hero-banner",
        ".ugc-section",
        ".domus-footer"
    ].filter(Boolean).join(", ");

    gsap.utils.toArray(revealTargets).forEach((section) => {
        gsap.fromTo(section, {
            opacity: 0,
            y: 40
        }, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 82%",
                toggleActions: "play none none reverse"
            }
        });
    });

    gsap.utils.toArray(".gallery-slide, .amenity-card, .project-carousel__slide, .mobile-carousel__item, .ugc-item").forEach((el) => {
        gsap.fromTo(el, {
            opacity: 0,
            y: 24,
            scale: 0.985
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none reverse"
            }
        });
    });

    gsap.utils.toArray(".about-text:not(#about-section *):not(#aboutModal *), .vm-text:not(#aboutModal *), .legacy-text:not(#aboutModal *), .who-text:not(#aboutModal *), .property-list li, .contact-info p, .footer-right li").forEach((el) => {
        gsap.fromTo(el, {
            opacity: 0,
            y: 18
        }, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
                trigger: el,
                start: "top 92%",
                toggleActions: "play none none reverse"
            }
        });
    });
}

function initPageLoader() {
    const loader = document.querySelector(".page-loader");
    if (!loader) return;
    window.addEventListener("load", () => {
        requestAnimationFrame(() => loader.classList.add("is-hidden"));
    });
}

function initHeaderScrollState() {
    const header = document.querySelector(".site-header");
    // The big JS-animated logo that starts in the hero (position: fixed, outside header)
    const animatedLogo = document.getElementById("logo2");
    if (!header) return;

    const onScroll = () => {
        if (window.scrollY > 24) {
            header.classList.add("is-scrolled");
            // Flip the animated hero logo to dark when over light glass header
            if (animatedLogo) {
                animatedLogo.style.filter = "brightness(0) invert(0)";
            }
        } else {
            header.classList.remove("is-scrolled");
            // Restore white logo over dark hero video
            if (animatedLogo) {
                animatedLogo.style.filter = "brightness(0) invert(1)";
            }
        }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run immediately on load
}

// document.addEventListener("DOMContentLoaded", function () {

//     const modal = document.getElementById("brochureModal");
//     const openBtn = document.getElementById("openBrochure");
//     const closeBtn = document.getElementById("closeBrochure");
//     const form = document.getElementById("brochureForm");

//     openBtn.addEventListener("click", () => {
//         modal.classList.add("active");
//         document.body.style.overflow = "hidden";
//     });

//     closeBtn.addEventListener("click", () => {
//         modal.classList.remove("active");
//         document.body.style.overflow = "auto";
//     });
//     modal.addEventListener("click", (e) => {
//         if (e.target === modal) {
//             modal.classList.remove("active");
//             document.body.style.overflow = "auto";
//         }
//     });

//     form.addEventListener("submit", function (e) {
//         e.preventDefault();

//         const phone = document.getElementById("phoneInput").value;

//         if (phone.trim() === "") {
//             alert("Phone number is required.");
//             return;
//         }

//         // 🔥 Replace with your PDF link
//         window.open("YOUR_PDF_LINK_HERE.pdf", "_blank");

//         modal.classList.remove("active");
//         document.body.style.overflow = "auto";
//     });

// });

document.addEventListener("DOMContentLoaded", function () {

    const modal = document.getElementById("brochureModal");
    const openBtn = document.getElementById("openBrochure");
    const closeBtn = document.getElementById("closeBrochure");
    const form = document.getElementById("brochureForm");

    if (!openBtn || !closeBtn || !modal || !form) return;

    let pdfLink = ""; // store dynamic PDF link

    openBtn.addEventListener("click", () => {
        pdfLink = openBtn.getAttribute("data-pdf"); // 👈 get PDF from button
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const phone = document.getElementById("phoneInput").value;

        if (phone.trim() === "") {
            alert("Phone number is required.");
            return;
        }

        // 🔥 Open dynamic PDF
        if (pdfLink) {
            window.open(pdfLink, "_blank");
        }

        modal.classList.remove("active");
        document.body.style.overflow = "auto";
    });

});


/* ==============================
   SMOOTH SCROLLING (LENIS)
============================== */
let lenis = null;
function initSmoothScroll() {
    if (typeof Lenis === "undefined") return;

    lenis = new Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo easeOut
        smooth: true,
        smoothTouch: false,
    });

    lenis.on("scroll", () => {
        if (window.ScrollTrigger) {
            ScrollTrigger.update();
        }
    });

    gsap.ticker.add((time) => {
        if (lenis) lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
    window.lenis = lenis;
}

/* ==============================
   ABOUT FULL-SCREEN PANEL
============================== */
function initAboutModal() {
    const modal = document.getElementById("aboutModal");
    const pane = document.getElementById("aboutModalPane");
    const overlay = document.getElementById("aboutModalOverlay");
    const closeBtn = document.getElementById("closeAboutModal");
    const openBtn = document.getElementById("openAboutBtn");

    if (!modal || !pane || !overlay || !closeBtn) return;

    let previousActiveElement = null;

    // Open modal pane
    window.openAboutModal = function (pushState = true) {
        previousActiveElement = document.activeElement;

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        // Stop Lenis background scrolling
        if (window.lenis) {
            window.lenis.stop();
        }

        // Set focus inside modal
        setTimeout(() => {
            closeBtn.focus();
        }, 100);

        // Push state for back button navigation
        if (pushState) {
            history.pushState({ aboutOpen: true }, "", "#about");
        }

        // Trigger ScrollTrigger refresh inside the scrollable pane
        setTimeout(() => {
            if (window.ScrollTrigger) {
                window.ScrollTrigger.refresh();
            }
        }, 200);
    };

    // Close modal pane
    window.closeAboutModal = function (triggerBack = false) {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        // Resume Lenis smooth scroll
        if (window.lenis) {
            window.lenis.start();
        }

        // Restore focus
        if (previousActiveElement && previousActiveElement.focus) {
            previousActiveElement.focus();
        }

        // Clean browser history hash
        if (triggerBack && history.state && history.state.aboutOpen) {
            history.back();
        } else if (window.location.hash === "#about") {
            history.replaceState(null, "", window.location.pathname + window.location.search);
        }
    };

    // Bind triggers
    if (openBtn) {
        openBtn.addEventListener("click", (e) => {
            e.preventDefault();
            openAboutModal();
        });
    }

    // Intercept navigation links to about.html ONLY on the homepage
    const isHomepage = window.location.pathname === "/" || window.location.pathname.endsWith("index.html") || window.location.pathname === "";
    if (isHomepage) {
        document.querySelectorAll('a[href*="about.html"]').forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                // Close mobile menu if active
                const mobileMenu = document.querySelector(".mobile-menu");
                if (mobileMenu && mobileMenu.classList.contains("open")) {
                    mobileMenu.classList.remove("open");
                }
                openAboutModal();
            });
        });
    }

    // Close buttons
    closeBtn.addEventListener("click", () => {
        closeAboutModal(true);
    });

    overlay.addEventListener("click", () => {
        closeAboutModal(true);
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeAboutModal(true);
        }
    });

    // Popstate integration
    window.addEventListener("popstate", (e) => {
        if (e.state && e.state.aboutOpen) {
            openAboutModal(false);
        } else {
            closeAboutModal(false);
        }
    });

    // Handle initial hash check
    if (window.location.hash === "#about") {
        setTimeout(() => {
            openAboutModal(false);
        }, 400);
    }

    // Keyboard focus trap loop
    modal.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
            const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusables.length === 0) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        }
    });

    // Premium interactive tab click animations for Values inside the modal pane
    const valueItems = pane.querySelectorAll(".value-item");
    if (valueItems.length) {
        valueItems.forEach(item => {
            item.addEventListener("click", () => {
                valueItems.forEach(i => i.classList.remove("active"));
                item.classList.add("active");

                if (window.gsap) {
                    gsap.fromTo(item.querySelector(".value-icon img"), {
                        scale: 0.9
                    }, {
                        scale: 1,
                        duration: 0.45,
                        ease: "back.out(2)"
                    });
                }
            });
        });
    }

    // Setup custom ScrollTriggers for elements inside the modal pane container
    if (window.gsap && window.ScrollTrigger) {
        // Sections animations
        const modalSections = pane.querySelectorAll(".who-we-are-section, .vision-mission-section, .values-section, .legacy-section");
        modalSections.forEach(section => {
            gsap.fromTo(section, {
                opacity: 0,
                y: 40
            }, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    scroller: pane, // scroll inside the modal pane!
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // Subtext reveal animations inside sections
        const modalTextElements = pane.querySelectorAll(".about-text, .vm-text, .legacy-text, .who-text");
        modalTextElements.forEach(el => {
            gsap.fromTo(el, {
                opacity: 0,
                y: 18
            }, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    scroller: pane, // scroll inside the modal pane!
                    start: "top 92%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }
}

/* ==============================
   VALUE ITEM INTERACTION (STATIC & MODAL)
============================== */
function initValueItems() {
    const valueItems = document.querySelectorAll(".value-item");
    if (!valueItems.length) return;

    valueItems.forEach(item => {
        item.addEventListener("click", () => {
            const container = item.closest(".values-left") || item.parentElement;
            if (container) {
                container.querySelectorAll(".value-item").forEach(i => i.classList.remove("active"));
            }
            item.classList.add("active");

            if (window.gsap) {
                const img = item.querySelector(".value-icon img");
                if (img) {
                    gsap.fromTo(img, { scale: 0.9 }, { scale: 1, duration: 0.45, ease: "back.out(2)" });
                }
            }
        });
    });
}

/* ==============================
   BOOTSTRAP
============================= */
document.addEventListener("DOMContentLoaded", () => {
    // initPageLoader();
    // initSmoothScroll(); // Initialize Lenis smooth scroll
    // initHeaderScrollState();
    initAboutScene();
    initAboutModal();
    initHeroSlider();
    // initLogoScroll();
    initAboutCarousel();
    initGalleryCarousel();
    initGalleryCarousel3D();
    initPopupForm();
    // initMobileMenu();
    initSectionAnimations();
    initStatsCounter();
    initStatsCounter2();
    initLuxuryMotion();
    initValueItems(); // Handle values item active tab clicking
});

document.addEventListener('DOMContentLoaded', function () {

    const items = document.querySelectorAll('.ugc-item');
    const modal = document.getElementById('ugcModal');
    const modalVideo = document.getElementById('ugcModalVideo');
    const closeBtn = document.querySelector('.ugc-close');
    const prevBtn = document.querySelector('.ugc-prev');
    const nextBtn = document.querySelector('.ugc-next');

    if (!items.length || !modal || !modalVideo) return;

    let currentIndex = 0;

    const videoSources = Array.from(items).map(item => {
        const source = item.querySelector('source');
        return source ? source.getAttribute('src') : null;
    });

    function openModal(index) {
        currentIndex = index;
        modal.classList.add('active');
        modalVideo.src = videoSources[currentIndex];
        modalVideo.play();
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.classList.remove('active');
        modalVideo.pause();
        modalVideo.src = "";
        document.body.style.overflow = "";
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % videoSources.length;
        modalVideo.src = videoSources[currentIndex];
        modalVideo.play();
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + videoSources.length) % videoSources.length;
        modalVideo.src = videoSources[currentIndex];
        modalVideo.play();
    }

    items.forEach((item, index) => {
        item.addEventListener('click', () => openModal(index));
    });

    closeBtn.addEventListener('click', closeModal);
    document.querySelector('.ugc-overlay').addEventListener('click', closeModal);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

});
