// ---------- Weighted (heavy) scroll for desktop only ----------
(function () {
    // enable only for non-touch / desktop widths to avoid mobile UX breakage
    if ('ontouchstart' in window || window.innerWidth < 800) return;

    let wheelTarget = 0;
    let wheelRaf = null;
    const APPLY_EASE = 0.22;   // how fast wheelCurrent approaches wheelTarget (0..1). lower = heavier
    const DAMPING = 0.95;      // how much of motion is applied to actual scroll (0..1). lower = heavier
    const MIN_DELTA = 1.5;     // minimal delta threshold to actually call scrollBy

    // accumulate wheel deltas here
    function onWheel(e) {
        // allow pinch zoom / ctrl+wheel to behave normally
        if (e.ctrlKey) return;

        // prevent default to take control of the wheel behavior
        e.preventDefault();
        // larger deltaY for trackpads, normalize a little:
        const delta = e.deltaY;
        wheelTarget += delta;
        if (!wheelRaf) wheelRaf = requestAnimationFrame(applyWheel);
    }

    // handle arrow/page keys to feel heavier too
    function onKeyDown(e) {
        // keys that move page: ArrowUp, ArrowDown, PageUp, PageDown, Space
        const key = e.key;
        let delta = 0;
        if (key === "ArrowDown") delta = 80;
        if (key === "ArrowUp") delta = -80;
        if (key === "PageDown") delta = window.innerHeight * 0.9;
        if (key === "PageUp") delta = -window.innerHeight * 0.9;
        if (key === " " || key === "Spacebar") { delta = window.innerHeight * 0.9; e.preventDefault(); }

        if (delta !== 0) {
            // prevent default navigation (for space) and apply our heavier feel
            e.preventDefault();
            wheelTarget += delta;
            if (!wheelRaf) wheelRaf = requestAnimationFrame(applyWheel);
        }
    }

    // smoothing state
    let wheelCurrent = 0;

    function applyWheel() {
        // ease wheelCurrent toward wheelTarget
        wheelCurrent += (wheelTarget - wheelCurrent) * APPLY_EASE;

        // compute delta to apply now (smoothed * damping)
        const deltaToApply = (wheelCurrent) * DAMPING - (window.__lastAppliedWheelDelta || 0);

        // only apply if significant to avoid micro jitter
        if (Math.abs(deltaToApply) > MIN_DELTA) {
            window.scrollBy({ top: deltaToApply, left: 0, behavior: 'auto' });
            window.__lastAppliedWheelDelta = (window.__lastAppliedWheelDelta || 0) + deltaToApply;
        }

        // stop when settled
        if (Math.abs(wheelTarget - wheelCurrent) > 0.5) {
            wheelRaf = requestAnimationFrame(applyWheel);
        } else {
            // reset small accumulators so future scrolls start fresh
            wheelTarget = wheelCurrent = 0;
            window.__lastAppliedWheelDelta = 0;
            wheelRaf = null;
        }
    }

    // Attach listeners (non-passive so we can preventDefault)
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown, { passive: false });

    // Optional: expose a small function to toggle this behavior from console
    window.__toggleWeightedScroll = function (enable) {
        if (!enable) {
            window.removeEventListener('wheel', onWheel, { passive: false });
            window.removeEventListener('keydown', onKeyDown, { passive: false });
        } else {
            window.addEventListener('wheel', onWheel, { passive: false });
            window.addEventListener('keydown', onKeyDown, { passive: false });
        }
    };

    // Tweak these to taste:
    // - LOWER APPLY_EASE (e.g. 0.10) = heavier lag,
    // - LOWER DAMPING (e.g. 0.35) = you must scroll more to move page (heavier),
    // - increase MIN_DELTA to avoid tiny scroll jumps on sensitive trackpads.
})();