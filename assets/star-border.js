/*
 * StarBorder (port of React Bits <StarBorder />, vanilla JS).
 * Adds two glowing spots that travel along the top and bottom edges
 * of every matching card. Styles live in assets/theme.css (.sb-ring).
 * Per-card overrides: data-sb-color, data-sb-speed, data-sb-thickness.
 */
(function () {
  var CONFIG = {
    selector: '.pc',
    color: null,    // null = theme ink color (--c-ink); or any CSS color, e.g. 'cyan'
    speed: '6s',
    thickness: 1    // px
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function init() {
    var ink = getComputedStyle(document.documentElement).getPropertyValue('--c-ink').trim();
    var defaultColor = CONFIG.color || (ink ? 'rgb(' + ink + ')' : '#1B1B21');

    document.querySelectorAll(CONFIG.selector).forEach(function (card) {
      if (card.querySelector(':scope > .sb-ring')) return;
      var ring = document.createElement('span');
      ring.className = 'sb-ring';
      ring.setAttribute('aria-hidden', 'true');
      ring.style.setProperty('--sb-color', card.dataset.sbColor || defaultColor);
      ring.style.setProperty('--sb-speed', card.dataset.sbSpeed || CONFIG.speed);
      ring.style.setProperty('--sb-thickness', (card.dataset.sbThickness || CONFIG.thickness) + 'px');
      // Offset each card so they don't all move in sync
      ring.style.setProperty('--sb-delay', (-Math.random() * 6).toFixed(2) + 's');
      ring.innerHTML = '<span class="sb-bottom"></span><span class="sb-top"></span>';
      if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
      card.appendChild(ring);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
