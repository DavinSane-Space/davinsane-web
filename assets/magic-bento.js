/*
 * MagicBento (port of React Bits <MagicBento />, vanilla JS + GSAP).
 * Turns every grid matching CONFIG.grid into a bento section: cursor spotlight,
 * border glow, floating particles, magnetism, optional tilt and click ripple.
 * Requires GSAP (loaded from cdnjs in the page). Styles live in assets/theme.css (.mb-*).
 * Per-grid overrides: data-mb-color="r, g, b", data-mb-radius, data-mb-particles.
 */
(function () {
  var CONFIG = {
    grid: '.wd-grid',
    card: '.wd-card',
    glowColor: null,       // null = theme accent (--accent-1); or 'r, g, b', e.g. '132, 0, 255'
    spotlightRadius: 300,
    particleCount: 12,
    enableStars: true,
    enableSpotlight: true,
    enableBorderGlow: true,
    enableTilt: false,
    enableMagnetism: true,
    clickEffect: true,
    mobileBreakpoint: 768
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function isMobile() { return window.innerWidth <= CONFIG.mobileBreakpoint; }

  function themeColor() {
    var v = getComputedStyle(document.documentElement).getPropertyValue('--accent-1').trim();
    return v ? v.split(/\s+/).join(', ') : '27, 27, 33';
  }

  function createParticle(x, y, color) {
    var el = document.createElement('div');
    el.className = 'mb-particle';
    el.style.cssText = 'left:' + x + 'px;top:' + y + 'px;background:rgba(' + color + ',1);box-shadow:0 0 6px rgba(' + color + ',0.6);';
    return el;
  }

  function setupCard(card, opts) {
    var gsap = window.gsap;
    var particles = [];
    var timeouts = [];
    var hovered = false;
    var magnet = null;

    function clearParticles() {
      timeouts.forEach(clearTimeout);
      timeouts = [];
      if (magnet) magnet.kill();
      particles.forEach(function (p) {
        gsap.to(p, { scale: 0, opacity: 0, duration: 0.3, ease: 'back.in(1.7)', onComplete: function () { p.remove(); } });
      });
      particles = [];
    }

    function spawnParticles() {
      var r = card.getBoundingClientRect();
      for (var i = 0; i < opts.particleCount; i++) {
        (function (i) {
          timeouts.push(setTimeout(function () {
            if (!hovered) return;
            var p = createParticle(Math.random() * r.width, Math.random() * r.height, opts.color);
            card.appendChild(p);
            particles.push(p);
            gsap.fromTo(p, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
            gsap.to(p, { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100, rotation: Math.random() * 360, duration: 2 + Math.random() * 2, ease: 'none', repeat: -1, yoyo: true });
            gsap.to(p, { opacity: 0.3, duration: 1.5, ease: 'power2.inOut', repeat: -1, yoyo: true });
          }, i * 100));
        })(i);
      }
    }

    card.addEventListener('mouseenter', function () {
      if (isMobile()) return;
      hovered = true;
      if (CONFIG.enableStars) spawnParticles();
      if (CONFIG.enableTilt) gsap.to(card, { rotateX: 5, rotateY: 5, duration: 0.3, ease: 'power2.out', transformPerspective: 1000 });
    });

    card.addEventListener('mouseleave', function () {
      hovered = false;
      clearParticles();
      if (CONFIG.enableTilt) gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.3, ease: 'power2.out' });
      if (CONFIG.enableMagnetism) gsap.to(card, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
    });

    card.addEventListener('mousemove', function (e) {
      if (isMobile() || (!CONFIG.enableTilt && !CONFIG.enableMagnetism)) return;
      var r = card.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      var cx = r.width / 2, cy = r.height / 2;
      if (CONFIG.enableTilt) {
        gsap.to(card, { rotateX: ((y - cy) / cy) * -10, rotateY: ((x - cx) / cx) * 10, duration: 0.1, ease: 'power2.out', transformPerspective: 1000 });
      }
      if (CONFIG.enableMagnetism) {
        magnet = gsap.to(card, { x: (x - cx) * 0.05, y: (y - cy) * 0.05, duration: 0.3, ease: 'power2.out' });
      }
    });

    card.addEventListener('click', function (e) {
      if (!CONFIG.clickEffect || isMobile()) return;
      var r = card.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      var d = Math.max(Math.hypot(x, y), Math.hypot(x - r.width, y), Math.hypot(x, y - r.height), Math.hypot(x - r.width, y - r.height));
      var ripple = document.createElement('div');
      ripple.className = 'mb-ripple';
      ripple.style.cssText = 'width:' + d * 2 + 'px;height:' + d * 2 + 'px;left:' + (x - d) + 'px;top:' + (y - d) + 'px;' +
        'background:radial-gradient(circle, rgba(' + opts.color + ',0.4) 0%, rgba(' + opts.color + ',0.2) 30%, transparent 70%);';
      card.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: function () { ripple.remove(); } });
    });
  }

  function setupSpotlight(grid, cards, opts) {
    var gsap = window.gsap;
    var spot = document.createElement('div');
    var c = opts.color;
    spot.className = 'mb-spotlight';
    spot.style.background = 'radial-gradient(circle, rgba(' + c + ',0.15) 0%, rgba(' + c + ',0.08) 15%, rgba(' + c + ',0.04) 25%, rgba(' + c + ',0.02) 40%, rgba(' + c + ',0.01) 65%, transparent 70%)';
    document.body.appendChild(spot);

    var proximity = opts.radius * 0.5;
    var fade = opts.radius * 0.75;

    function hide() {
      gsap.to(spot, { opacity: 0, duration: 0.3, ease: 'power2.out' });
      cards.forEach(function (card) { card.style.setProperty('--glow-intensity', '0'); });
    }

    document.addEventListener('mousemove', function (e) {
      if (isMobile()) return hide();
      var r = grid.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return hide();

      var minDist = Infinity;
      cards.forEach(function (card) {
        var cr = card.getBoundingClientRect();
        var dist = Math.max(0, Math.hypot(e.clientX - (cr.left + cr.width / 2), e.clientY - (cr.top + cr.height / 2)) - Math.max(cr.width, cr.height) / 2);
        minDist = Math.min(minDist, dist);
        var glow = dist <= proximity ? 1 : dist <= fade ? (fade - dist) / (fade - proximity) : 0;
        card.style.setProperty('--glow-x', ((e.clientX - cr.left) / cr.width) * 100 + '%');
        card.style.setProperty('--glow-y', ((e.clientY - cr.top) / cr.height) * 100 + '%');
        card.style.setProperty('--glow-intensity', glow.toString());
        card.style.setProperty('--glow-radius', opts.radius + 'px');
      });

      gsap.to(spot, { left: e.clientX, top: e.clientY, duration: 0.1, ease: 'power2.out' });
      var target = minDist <= proximity ? 0.8 : minDist <= fade ? ((fade - minDist) / (fade - proximity)) * 0.8 : 0;
      gsap.to(spot, { opacity: target, duration: target > 0 ? 0.2 : 0.5, ease: 'power2.out' });
    });

    document.addEventListener('mouseleave', hide);
  }

  function init() {
    if (!window.gsap) return;
    document.querySelectorAll(CONFIG.grid).forEach(function (grid) {
      if (grid.classList.contains('mb-section')) return;
      grid.classList.add('mb-section');
      var opts = {
        color: grid.dataset.mbColor || CONFIG.glowColor || themeColor(),
        radius: Number(grid.dataset.mbRadius) || CONFIG.spotlightRadius,
        particleCount: Number(grid.dataset.mbParticles) || CONFIG.particleCount
      };
      grid.style.setProperty('--glow-color', opts.color);
      var cards = Array.prototype.slice.call(grid.querySelectorAll(CONFIG.card));
      cards.forEach(function (card) {
        card.classList.add('mb-card');
        if (CONFIG.enableBorderGlow) card.classList.add('mb-card--border-glow');
        setupCard(card, opts);
      });
      if (CONFIG.enableSpotlight) setupSpotlight(grid, cards, opts);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
