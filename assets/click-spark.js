/*
 * ClickSpark (port of React Bits <ClickSpark />, vanilla JS).
 * Draws short spark lines radiating from every click on a fixed,
 * full-viewport canvas. Tweak the look in CONFIG below.
 */
(function () {
  var CONFIG = {
    sparkColor: null, // null = theme ink color (--c-ink); or any CSS color, e.g. '#fff'
    sparkSize: 10,
    sparkRadius: 15,
    sparkCount: 8,
    duration: 400,
    easing: 'ease-out', // 'linear' | 'ease-in' | 'ease-in-out' | 'ease-out'
    extraScale: 1
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function easeFunc(t) {
    switch (CONFIG.easing) {
      case 'linear': return t;
      case 'ease-in': return t * t;
      case 'ease-in-out': return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      default: return t * (2 - t);
    }
  }

  function init() {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText =
      'position:fixed;inset:0;width:100vw;height:100vh;display:block;' +
      'pointer-events:none;user-select:none;z-index:9999;';
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var sparks = [];
    var running = false;
    var color = CONFIG.sparkColor;
    if (!color) {
      var ink = getComputedStyle(document.documentElement).getPropertyValue('--c-ink').trim();
      color = ink ? 'rgb(' + ink + ')' : '#1B1B21';
    }

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(timestamp) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      sparks = sparks.filter(function (spark) {
        var elapsed = timestamp - spark.startTime;
        if (elapsed >= CONFIG.duration) return false;

        var eased = easeFunc(Math.max(elapsed, 0) / CONFIG.duration);
        var distance = eased * CONFIG.sparkRadius * CONFIG.extraScale;
        var lineLength = CONFIG.sparkSize * (1 - eased);
        var cos = Math.cos(spark.angle);
        var sin = Math.sin(spark.angle);

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(spark.x + distance * cos, spark.y + distance * sin);
        ctx.lineTo(spark.x + (distance + lineLength) * cos, spark.y + (distance + lineLength) * sin);
        ctx.stroke();
        return true;
      });

      // Only keep the loop alive while sparks are on screen.
      if (sparks.length) requestAnimationFrame(draw);
      else running = false;
    }

    function handleClick(e) {
      var now = performance.now();
      for (var i = 0; i < CONFIG.sparkCount; i++) {
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          angle: (2 * Math.PI * i) / CONFIG.sparkCount,
          startTime: now
        });
      }
      if (!running) {
        running = true;
        requestAnimationFrame(draw);
      }
    }

    var resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 100);
    });
    document.addEventListener('click', handleClick, { passive: true });
    resize();
  }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
