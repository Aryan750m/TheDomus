/*
  Nexus System Template
  https://templatemo.com/tm-629-nexus-system
  — Adapted for embedded use inside The Domus About page.
    All queries scoped to .nexus-embed; IDs prefixed nexus*.
    Fixed cards are hidden once user scrolls past the 400vh spacer.
*/

(function () {
  "use strict";

  /* Scope root — all DOM queries stay inside .nexus-embed */
  var root = document.querySelector(".nexus-embed");
  if (!root) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var cards   = Array.prototype.slice.call(root.querySelectorAll(".zcard"));
  var vh      = window.innerHeight;
  var ticking = false;

  /* The scroll-spacer is 400vh — that is the full Nexus experience track */
  var SPACER_VH = 4;

  function clamp01(v) { return Math.max(0, Math.min(1, v)); }

  /* ── z-depth escalator engine ─────────────────────────────────────── */
  function renderEngine() {
    var y       = window.scrollY || window.pageYOffset || 0;
    var spacerH = vh * SPACER_VH;
    var i, entry, recede, scale, ty;

    /* Once the user has scrolled past the Nexus spacer, hide all fixed
       cards so the Domus About content beneath becomes fully visible. */
    if (y >= spacerH - 2) {
      root.style.visibility = "hidden";
      root.style.pointerEvents = "none";
      return;
    } else {
      root.style.visibility = "visible";
      root.style.pointerEvents = "auto";
    }

    for (i = 0; i < cards.length; i++) {
      entry  = i === 0 ? 1 : clamp01((y - (i - 1) * vh) / vh);
      recede = i === cards.length - 1 ? 0 : clamp01((y - i * vh) / vh);
      scale  = 1 - 0.1 * recede;
      ty     = (1 - entry) * 100;
      cards[i].style.transform = "translateY(" + ty + "%) scale(" + scale + ")";
      cards[i].style.opacity   = String(1 - 0.6 * recede);
    }
  }

  function onFrame() {
    if (!reduceMotion) { renderEngine(); }
    ticking = false;
  }

  function requestRender() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onFrame);
    }
  }

  window.addEventListener("scroll", requestRender, { passive: true });

  window.addEventListener("resize", function () {
    vh = window.innerHeight;
    requestRender();
  });

  setTimeout(requestRender, 100);
  requestRender();

  /* ── Kinetic accordion: hover on fine pointers, tap everywhere ──── */
  var accordion    = document.getElementById("nexus-accordion");
  if (!accordion) return;

  var slices       = Array.prototype.slice.call(accordion.querySelectorAll(".slice"));
  var hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function setActiveSlice(target) {
    slices.forEach(function (s) {
      var on = s === target;
      s.classList.toggle("active", on);
      s.setAttribute("aria-expanded", on ? "true" : "false");
    });
  }

  slices.forEach(function (slice) {
    if (hoverCapable) {
      slice.addEventListener("mouseenter", function () { setActiveSlice(slice); });
      slice.addEventListener("focus",      function () { setActiveSlice(slice); });
    }
    slice.addEventListener("click", function () {
      if (slice.classList.contains("active") && !hoverCapable) {
        setActiveSlice(null);
      } else {
        setActiveSlice(slice);
      }
    });
  });

  if (hoverCapable) {
    accordion.addEventListener("mouseleave", function () { setActiveSlice(null); });
  }

  /* ── Matrix tabs with data-goto switching ───────────────────────── */
  var tabs    = Array.prototype.slice.call(root.querySelectorAll(".matrix-tab"));
  var panels  = Array.prototype.slice.call(root.querySelectorAll(".matrix-img"));
  var caption = document.getElementById("nexusMatrixCaption");

  var captions = {
    core:     "FIG. 01 / CORE FRAME",
    fluidics: "FIG. 02 / FLUIDICS MANIFOLD",
    sync:     "FIG. 03 / SYNC TIMING PLANE"
  };

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var key = tab.getAttribute("data-goto");

      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });

      panels.forEach(function (p) {
        p.classList.toggle("active", p.getAttribute("data-panel") === key);
      });

      if (caption) caption.textContent = captions[key];
    });
  });

})();
