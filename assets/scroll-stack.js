/* ScrollStack: vanilla port of React Bits <ScrollStack /> (window-scroll mode).
   Markup: <div class="scroll-stack" data-...> <div class="scroll-stack-card">…</div> … <div class="scroll-stack-end"></div></div>
   Options via data attributes on .scroll-stack: item-distance, item-scale, item-stack-distance,
   stack-position, scale-end-position, base-scale, rotation-amount, blur-amount. */
(function () {
  function parsePct(value, h) {
    return typeof value === 'string' && value.indexOf('%') !== -1 ? (parseFloat(value) / 100) * h : parseFloat(value);
  }
  function progress(y, start, end) {
    if (y < start) return 0;
    if (y > end) return 1;
    return (y - start) / (end - start);
  }
  function docTop(el) {
    // Layout position (ignores transforms), so measurements don't feed back into themselves
    var top = 0;
    while (el) { top += el.offsetTop; el = el.offsetParent; }
    return top;
  }

  function init(root) {
    var d = root.dataset;
    var opt = {
      itemDistance: parseFloat(d.itemDistance || 100),
      itemScale: parseFloat(d.itemScale || 0.03),
      itemStackDistance: parseFloat(d.itemStackDistance || 30),
      stackPosition: d.stackPosition || '20%',
      scaleEndPosition: d.scaleEndPosition || '10%',
      baseScale: parseFloat(d.baseScale || 0.85),
      rotationAmount: parseFloat(d.rotationAmount || 0),
      blurAmount: parseFloat(d.blurAmount || 0)
    };
    var cards = Array.prototype.slice.call(root.querySelectorAll('.scroll-stack-card'));
    var end = root.querySelector('.scroll-stack-end');
    if (!cards.length) return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var tops = [], endTop = 0, last = [], ticking = false;

    cards.forEach(function (card, i) {
      if (i < cards.length - 1) card.style.marginBottom = opt.itemDistance + 'px';
      card.style.transformOrigin = 'top center';
      card.style.willChange = 'transform, filter';
    });

    function measure() {
      tops = cards.map(docTop);
      endTop = end ? docTop(end) : 0;
    }

    function update() {
      ticking = false;
      if (reduce.matches) return;
      var y = window.scrollY, vh = window.innerHeight;
      var stackPx = parsePct(opt.stackPosition, vh);
      var scaleEndPx = parsePct(opt.scaleEndPosition, vh);
      var pinEnd = endTop - vh / 2;

      var topIndex = 0;
      if (opt.blurAmount) {
        tops.forEach(function (t, j) { if (y >= t - stackPx - opt.itemStackDistance * j) topIndex = j; });
      }

      cards.forEach(function (card, i) {
        var cardTop = tops[i];
        var pinStart = cardTop - stackPx - opt.itemStackDistance * i;
        var p = progress(y, pinStart, cardTop - scaleEndPx);
        var scale = 1 - p * (1 - (opt.baseScale + i * opt.itemScale));
        var rot = opt.rotationAmount ? i * opt.rotationAmount * p : 0;
        var blur = opt.blurAmount && i < topIndex ? (topIndex - i) * opt.blurAmount : 0;

        var ty = 0;
        if (y >= pinStart && y <= pinEnd) ty = y - cardTop + stackPx + opt.itemStackDistance * i;
        else if (y > pinEnd) ty = pinEnd - cardTop + stackPx + opt.itemStackDistance * i;

        var n = { ty: Math.round(ty * 100) / 100, s: Math.round(scale * 1000) / 1000, r: Math.round(rot * 100) / 100, b: Math.round(blur * 100) / 100 };
        var l = last[i];
        if (!l || Math.abs(l.ty - n.ty) > 0.1 || Math.abs(l.s - n.s) > 0.001 || Math.abs(l.r - n.r) > 0.1 || Math.abs(l.b - n.b) > 0.1) {
          card.style.transform = 'translate3d(0,' + n.ty + 'px,0) scale(' + n.s + ') rotate(' + n.r + 'deg)';
          card.style.filter = n.b > 0 ? 'blur(' + n.b + 'px)' : '';
          last[i] = n;
        }
      });
    }

    function request() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    function refresh() {
      measure();
      last = [];
      if (reduce.matches) cards.forEach(function (c) { c.style.transform = ''; c.style.filter = ''; });
      request();
    }

    measure();
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', refresh);
    window.addEventListener('load', refresh);
    if (reduce.addEventListener) reduce.addEventListener('change', refresh);
    if ('ResizeObserver' in window) new ResizeObserver(refresh).observe(root);
  }

  function boot() {
    document.querySelectorAll('.scroll-stack').forEach(init);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
