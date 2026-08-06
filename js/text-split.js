/* =====================================================
   THE DOMUS — Text Split Engine
   Splits [data-split="words"] and [data-split="chars"]
   elements into individually animated spans, then reveals
   them via IntersectionObserver on scroll.
   ===================================================== */
(() => {
  const EASE_OUT = 'cubic-bezier(.16,.84,.44,1)';

  /**
   * Wraps each word in an element with:
   *   <span class="word"><span class="inner">word</span></span>
   */
  function splitWords(el) {
    const rawText = el.textContent;
    const words = rawText.split(/(\s+)/);
    el.innerHTML = '';
    words.forEach((chunk, i) => {
      if (/^\s+$/.test(chunk)) {
        el.insertAdjacentHTML('beforeend', '<span style="display:inline-block;width:0.28em;"></span>');
        return;
      }
      const delay = i * 0.045;
      const outer = document.createElement('span');
      outer.className = 'word';
      outer.style.cssText = `display:inline-block;overflow:hidden;vertical-align:bottom;`;
      const inner = document.createElement('span');
      inner.className = 'inner';
      inner.style.cssText = `display:inline-block;transform:translateY(110%);transition:transform 1s ${EASE_OUT} ${delay}s;`;
      inner.textContent = chunk;
      outer.appendChild(inner);
      el.appendChild(outer);
    });
    el.dataset.splitDone = 'words';
  }

  /**
   * Wraps each character in an element with:
   *   <span class="char"><span class="inner">c</span></span>
   */
  function splitChars(el) {
    const rawText = el.textContent;
    el.innerHTML = '';
    let wordOffset = 0;
    rawText.split(/(\s+)/).forEach((chunk) => {
      if (/^\s+$/.test(chunk)) {
        el.insertAdjacentHTML('beforeend', '<span style="display:inline-block;width:0.28em;"></span>');
        return;
      }
      chunk.split('').forEach((char, ci) => {
        const delay = (wordOffset + ci) * 0.028;
        const outer = document.createElement('span');
        outer.className = 'char';
        outer.style.cssText = `display:inline-block;overflow:hidden;vertical-align:bottom;`;
        const inner = document.createElement('span');
        inner.className = 'inner';
        inner.style.cssText = `display:inline-block;transform:translateY(110%);transition:transform 0.8s ${EASE_OUT} ${delay}s;`;
        inner.textContent = char === ' ' ? '\u00A0' : char;
        outer.appendChild(inner);
        el.appendChild(outer);
      });
      wordOffset += chunk.length;
    });
    el.dataset.splitDone = 'chars';
  }

  /**
   * Reveal: sets transform to translateY(0) for all .inner spans
   */
  function revealEl(el) {
    el.querySelectorAll('.inner').forEach(span => {
      span.style.transform = 'translateY(0)';
    });
    el.classList.add('in-view');
  }

  // Initialize
  function init() {
    const wordEls = document.querySelectorAll('[data-split="words"]:not([data-split-done])');
    const charEls = document.querySelectorAll('[data-split="chars"]:not([data-split-done])');

    wordEls.forEach(el => splitWords(el));
    charEls.forEach(el => splitChars(el));

    const allSplit = document.querySelectorAll('[data-split-done]');
    if (!allSplit.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          revealEl(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

    allSplit.forEach(el => observer.observe(el));
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
