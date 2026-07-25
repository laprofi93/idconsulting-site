/* Hero: порядок из хаоса — линия идёт слева направо и структурирует поле точек */
(function () {
  var sec = document.getElementById('top');
  if (!sec) return;
  var cv = sec.querySelector('.hero-cv');
  var band = sec.querySelector('.hero-band');
  if (!cv) return;

  var FRONT = 0.24, DENSITY = 0.9, MOTION = 6;
  var SPEED = 0.85 + 0.4 * (MOTION / 6), M = MOTION / 6;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ctx = null, dpr = 1, W = 0, H = 0, dots = null, rowYs = [], tRects = [], bandRect = null;
  var raf = 0, t0 = 0, last = 0, lastTs = 0, frame = 0, anims = [];
  var SS = function (x) { return x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x); };

  function measure() {
    var w = sec.clientWidth || 1160;
    var inner = (wrapWidth() || w) ;
    sec.style.setProperty('--h1', Math.round(Math.max(38, Math.min(150, inner * 0.112))) + 'px');
    resize();
  }
  function wrapWidth() {
    var wr = sec.querySelector('.wrap');
    if (!wr) return 0;
    var cs = getComputedStyle(wr);
    return wr.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  }

  function resize() {
    var w = cv.clientWidth, h = cv.clientHeight;
    if (w < 60 || h < 60) { ctx = null; return; }
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = w; H = h;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    ctx = cv.getContext('2d');
    build();
    buildGeom();
    draw(reduced ? 99 : (t0 ? (performance.now() - t0) / 1000 : 0));
  }

  function build() {
    var R = function (x, y) { return x + Math.random() * (y - x); };
    var gap = Math.round((W > 1100 ? 17 : 14) / Math.sqrt(DENSITY));
    var cols = Math.max(8, Math.floor((W - 12) / gap));
    var rows = Math.max(6, Math.floor((H - 10) / gap));
    var ox = (W - (cols - 1) * gap) / 2;
    var oy = (H - (rows - 1) * gap) / 2;
    rowYs = [];
    for (var r0 = 0; r0 < rows; r0 += 3) rowYs.push(Math.round(oy + r0 * gap));
    var arr = [];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var tx = ox + c * gap, ty = oy + r * gap;
        arr.push({
          tx: tx, ty: ty, u: tx / W,
          cx: tx + R(-145, 145), cy: ty + R(-95, 95),
          ph: R(0, 6.28), sp: R(0.5, 1.4), s: R(0.5, 1.75), av: R(0.05, 0.26),
          acc: (r * cols + c) % 17 === 5
        });
      }
    }
    dots = arr;
  }

  function buildGeom() {
    tRects = []; bandRect = null;
    var cb = cv.getBoundingClientRect();
    sec.querySelectorAll('[data-copy]').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      tRects.push({
        x0: r.left - cb.left - 24, x1: r.right - cb.left + 24,
        y0: r.top - cb.top - 18, y1: r.bottom - cb.top + 18
      });
    });
    if (band) {
      var br = band.getBoundingClientRect();
      if (br.width) bandRect = { x0: br.left - cb.left, x1: br.right - cb.left, y0: br.top - cb.top - 30, y1: br.bottom - cb.top + 30 };
    }
  }

  function sup(x, y) {
    if (!tRects.length) return 1;
    var f = 1;
    for (var i = 0; i < tRects.length; i++) {
      var r = tRects[i];
      if (x < r.x0 - 26 || x > r.x1 + 26 || y < r.y0 - 22 || y > r.y1 + 22) continue;
      var dx = Math.min(x - (r.x0 - 26), (r.x1 + 26) - x) / 26;
      var dy = Math.min(y - (r.y0 - 22), (r.y1 + 22) - y) / 22;
      var k = Math.min(1, Math.max(0, Math.min(dx, dy)));
      f = Math.min(f, 1 - 0.55 * k);
    }
    return f;
  }

  /* a brisk pass, then it keeps easing rightward the whole time you watch */
  function frontPos(T) {
    var u = Math.min(1, T / 2.5);
    var e = 1 - Math.pow(1 - u, 3);
    var past = Math.max(0, T - 2.5);
    return -0.1 + (FRONT + 0.1) * e + (1 - FRONT) * 0.5 * (1 - Math.exp(-past / 26));
  }

  function draw(t) {
    if (!ctx || !dots) return;
    var T = Math.max(0, t) * SPEED;
    var b = frontPos(T);
    frame++;
    if (frame % 90 === 0) buildGeom();

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    /* ruled rows fill in behind the front — the structure the dots snap onto */
    var bpx = b * W, i;
    if (rowYs.length && bpx > 2) {
      ctx.fillStyle = 'rgba(154,171,208,.07)';
      for (i = 0; i < rowYs.length; i++) ctx.fillRect(0, rowYs[i], bpx, 1);
      var gr = ctx.createLinearGradient(Math.max(0, bpx - 170), 0, bpx, 0);
      gr.addColorStop(0, 'rgba(154,171,208,0)');
      gr.addColorStop(1, 'rgba(154,171,208,.1)');
      ctx.fillStyle = gr;
      for (i = 0; i < rowYs.length; i++) ctx.fillRect(Math.max(0, bpx - 170), rowYs[i], Math.min(170, bpx), 1);
    }

    for (i = 0; i < dots.length; i++) {
      var p = dots[i];
      /* the snap happens right at the line: a narrow front, so cause is visible */
      var k = SS((b - p.u) / 0.055);
      var drift = 1 - k;
      var snap = 1 - Math.abs(k - 0.5) * 2;
      var x = p.cx + (p.tx - p.cx) * k + Math.sin(T * 0.55 * p.sp * M + p.ph) * 10 * drift;
      var y = p.cy + (p.ty - p.cy) * k + Math.cos(T * 0.47 * p.sp * M + p.ph) * 9 * drift;
      var inBand = bandRect && y > bandRect.y0 && y < bandRect.y1 && x > bandRect.x0 - 60 && x < bandRect.x1;
      var a = (p.av + (0.46 - p.av) * k + 0.42 * snap * snap + (p.acc ? 0.2 * drift : 0)) * sup(x, y);
      if (inBand) a *= 1 - 0.45 * k;
      if (a < 0.018) continue;
      ctx.fillStyle = (p.acc || k < 0.4)
        ? 'rgba(154,171,208,' + Math.min(1, a).toFixed(4) + ')'
        : 'rgba(255,255,255,' + Math.min(1, a).toFixed(4) + ')';
      var cr = p.s * 1.05;
      var rr = cr + (1.75 - cr) * k + snap * snap * 0.8;
      ctx.beginPath();
      ctx.arc(x, y, rr, 0, 6.2832);
      ctx.fill();
    }

    var fx = b * W;
    if (fx > -70 && fx < W + 70) {
      var X = Math.round(fx);
      var g2 = ctx.createLinearGradient(fx - 96, 0, fx + 18, 0);
      g2.addColorStop(0, 'rgba(168,196,255,0)');
      g2.addColorStop(0.86, 'rgba(168,196,255,.07)');
      g2.addColorStop(1, 'rgba(168,196,255,0)');
      ctx.fillStyle = g2;
      ctx.fillRect(fx - 96, 0, 114, H);
      ctx.fillStyle = 'rgba(168,196,255,.95)';
      ctx.fillRect(X, 0, 2, H);
      ctx.fillStyle = 'rgba(168,196,255,.9)';
      for (i = 0; i < rowYs.length; i++) ctx.fillRect(X - 5, rowYs[i], 12, 1);
      ctx.fillStyle = 'rgba(168,196,255,1)';
      ctx.fillRect(X - 5, 0, 12, 2);
      ctx.fillRect(X - 5, H - 2, 12, 2);
    }
  }

  function start() {
    if (raf || reduced) return;
    if (!t0) t0 = performance.now();
    var loop = function (ts) {
      raf = requestAnimationFrame(loop);
      lastTs = ts;
      if (document.hidden) return;
      if (ts - last < 32) return;
      last = ts;
      draw((ts - t0) / 1000);
    };
    raf = requestAnimationFrame(loop);
  }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

  function reveal() {
    anims.forEach(function (a) { try { a.cancel(); } catch (e) {} });
    anims = [];
    t0 = performance.now(); last = 0; frame = 0;
    if (reduced) { draw(99); return; }
    stop(); start();

    var q = function (s) { return Array.prototype.slice.call(sec.querySelectorAll('[data-a="' + s + '"]')); };
    var add = function (n, f, o) {
      var base = { fill: 'both', easing: 'cubic-bezier(.2,.7,.2,1)' };
      for (var kk in o) base[kk] = o[kk];
      anims.push(n.animate(f, base));
    };

    q('kdot').forEach(function (n) {
      add(n, [
        { boxShadow: '0 0 0 0 rgba(168,196,255,.55)' },
        { boxShadow: '0 0 0 15px rgba(168,196,255,0)', offset: 0.5 },
        { boxShadow: '0 0 0 0 rgba(168,196,255,0)' }
      ], { duration: 3000, iterations: Infinity, easing: 'ease' });
    });

    /* the words arrive out of true and settle into the left flag */
    var OFF = [[62, -17, -1.7], [-38, 11, 1.3], [78, 19, -0.8]];
    q('line').forEach(function (n, i) {
      var o = OFF[i % 3];
      add(n, [
        { transform: 'translate(' + o[0] + 'px,' + o[1] + 'px) rotate(' + o[2] + 'deg)', letterSpacing: '.06em', opacity: 0.16, filter: 'blur(7px)' },
        { transform: 'translate(' + (o[0] * 0.18).toFixed(1) + 'px,' + (o[1] * 0.2).toFixed(1) + 'px) rotate(' + (o[2] * 0.22).toFixed(2) + 'deg)', letterSpacing: '.012em', opacity: 0.88, filter: 'blur(1.4px)', offset: 0.62 },
        { transform: 'translate(0,0) rotate(0deg)', letterSpacing: '-.045em', opacity: 1, filter: 'blur(0px)' }
      ], { duration: 1700, delay: 60 + i * 110, easing: 'cubic-bezier(.16,.9,.2,1)' });
    });

    q('foot').forEach(function (n) { add(n, [{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: 1000, easing: 'ease' }); });
    q('rule').forEach(function (n) { add(n, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 1100, delay: 600 }); });
    q('stat').forEach(function (n, i) { add(n, [{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 700 + i * 100, easing: 'ease' }); });
  }

  measure();
  if (window.ResizeObserver) new ResizeObserver(measure).observe(sec);
  else window.addEventListener('resize', measure);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) start(); });
  setInterval(function () {
    if (document.hidden || reduced) return;
    if (!lastTs || performance.now() - lastTs > 700) { raf = 0; start(); }
  }, 1500);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); buildGeom(); });
  reveal();
})();
