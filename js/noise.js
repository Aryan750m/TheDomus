/* =====================================================
   THE DOMUS — Film Grain Noise Engine
   Renders animated film-grain on a fixed <canvas> element
   at 12fps for a premium, cinematic feel.
   Canvas is transparent; mix-blend-mode: overlay gives
   just enough texture without obscuring content.
   ===================================================== */
(() => {
  // Create the canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'grain-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  // Config
  const OPACITY_BASE   = 0.038;  // overall grain opacity
  const GRAIN_SIZE     = 1;      // pixel size of each grain particle
  const GRAIN_DENSITY  = 0.42;   // fraction of canvas covered (0–1)
  const FPS_TARGET     = 14;     // grain refresh rate
  const FRAME_INTERVAL = 1000 / FPS_TARGET;

  let width, height, lastTime = 0;

  function resize() {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function drawGrain(timestamp) {
    if (timestamp - lastTime < FRAME_INTERVAL) {
      requestAnimationFrame(drawGrain);
      return;
    }
    lastTime = timestamp;

    ctx.clearRect(0, 0, width, height);

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    const totalPixels = width * height;
    const grainPixels = Math.floor(totalPixels * GRAIN_DENSITY);

    for (let i = 0; i < grainPixels; i++) {
      const x = Math.random() * width  | 0;
      const y = Math.random() * height | 0;
      const value = (Math.random() * 200 + 55) | 0; // 55–255 brightness
      const alpha = (Math.random() * 180 + 30) | 0; // 30–210 alpha

      const pixelIndex = (y * width + x) * 4;
      data[pixelIndex]     = value;
      data[pixelIndex + 1] = value;
      data[pixelIndex + 2] = value;
      data[pixelIndex + 3] = alpha;
    }

    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(drawGrain);
  }

  // Respect prefers-reduced-motion
  function init() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      canvas.style.display = 'none';
      return;
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    requestAnimationFrame(drawGrain);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
