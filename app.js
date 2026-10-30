/* Logika landing page. Koneksi Supabase ada di supabase.js */
/* ============================================================
   LANDING PAGE  (hanya jalan di index.html)
   ============================================================ */
(function () {
  if (!document.getElementById('galgrid')) return;
  var $ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); },
      $1 = function (s, c) { return (c || document).querySelector(s); },
      root = document.documentElement, D = null;
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function ic(n) { return '<svg class="i"><use href="#i-' + n + '"/></svg>'; }
  var stars = '<div class="stars">' + '<svg class="i f"><use href="#i-star"/></svg>'.repeat(5) + '</div>';

  /* ---------- render ---------- */
  function applyTexts() { for (var k in D.texts) $('[data-t="' + k + '"]').forEach(function (el) { el.textContent = D.texts[k]; }); }
  function renderGal() {
    var ics = ['pencil', 'game', 'mic', 'book', 'check', 'smile'];
    $1('#galgrid').innerHTML = D.gal.map(function (g, i) {
      var pic = g.image ? '<img src="' + esc(g.image) + '" alt="' + esc(g.caption) + '" loading="lazy" decoding="async">' : ic(g.icon || ics[i % 6]);
      return '<figure class="ph hv" data-aos="' + ['fade-right', 'fade-up', 'fade-left'][i % 3] + '" style="' + ['', '--c:var(--sun)', '--c:var(--coral)'][i % 3] + '"><div class="pic">' + pic + '</div><figcaption>' + esc(g.caption) + '</figcaption></figure>';
    }).join('');
  }
  function renderTs() {
    $1('#tlist').innerHTML = D.ts.map(function (t, i) {
      return '<article class="tc"><span class="qm">“</span><p>' + esc(t.q) + '</p><div class="who"><span class="av" style="background:' + ['var(--coral)', 'var(--soft)', 'var(--sun)'][i % 3] + '">' + ic(['bag', 'smile', 'cap', 'apple'][i % 4]) + '</span><div><b>' + esc(t.n) + '</b>' + stars + '</div></div></article>';
    }).join('');
  }
  function applyCfg() {
    $('.wal').forEach(function (a) { a.href = 'https://wa.me/' + D.cfg.wa + (a.dataset.m ? '?text=' + encodeURIComponent(a.dataset.m) : ''); });
    $1('#maplink').href = D.cfg.map;
  }

  /* ---------- nav ---------- */
  var navBox = $1('.nav'), burger = $1('#burger');
  function setNav(o) { navBox.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); }
  burger.addEventListener('click', function () { setNav(!navBox.classList.contains('open')); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.nav')) setNav(false); });
  addEventListener('resize', function () { if (innerWidth > 860) setNav(false); });
  $('[data-go]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); setNav(false); var t = document.getElementById(a.dataset.go); if (t) t.scrollIntoView({ behavior: 'smooth' }); });
  });

  /* ---------- reversible scroll reveal ---------- */
  $('[data-aos-group]').forEach(function (g) { $('[data-aos]', g).forEach(function (el, i) { el.dataset.aosDelay = i * 90; }); });
  function show(el) {
    if (el.classList.contains('aos-in')) return; clearTimeout(el._t);
    var d = el.dataset.aosDuration ? parseFloat(el.dataset.aosDuration) * 1000 : 800, dl = +el.dataset.aosDelay || 0;
    el.style.setProperty('--ad', d + 'ms'); el.style.setProperty('--dl', dl + 'ms');
    requestAnimationFrame(function () { el.classList.add('aos-in'); });
    el._t = setTimeout(function () { el.classList.add('done'); }, d + dl + 200);
  }
  function hide(el) { clearTimeout(el._t); el.style.setProperty('--dl', '0ms'); el.classList.remove('done', 'aos-in'); }
  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        var el = en.target;
        if (en.intersectionRatio >= .15) show(el); else if (en.intersectionRatio === 0 && en.boundingClientRect.top > 0) hide(el);
      });
    }, { threshold: [0, .15], rootMargin: '0px 0px -6% 0px' });
  }
  function watch(scope) {
    $('[data-aos]', scope).forEach(function (el) {
      if (el._w) return; el._w = 1;
      if (io) io.observe(el); else show(el);
    });
  }

  /* ---------- scroll journey ---------- */
  var pin = $1('#cerita'), stick = $1('.stick', pin), view = $1('.tview', pin), tlist = $1('#tlist'), cnt = $1('#cnt'),
      navh = $1('.navw'), ill = $1('#illus'), links = $('.links a'), fx = $('.sx'), tick = false,
      secs = ['top', 'visi', 'keunggulan', 'galeri', 'cerita', 'lokasi'].map(function (i) { return document.getElementById(i); });
  function size() {
    root.style.setProperty('--nh', navh.offsetHeight + 'px');
    pin.style.height = (stick.offsetHeight + Math.max($('.tc', tlist).length, 2) * .8 * innerHeight) + 'px';
  }
  function sc() {
    tick = false;
    var y = scrollY, H = innerHeight, nb = navh.offsetHeight;
    fx.forEach(function (el) {
      var bt = el.getBoundingClientRect().bottom;
      el.style.setProperty('--x', Math.max(0, Math.min(1, (nb + H * .55 - bt) / (H * .5))).toFixed(3));
    });
    $('[data-p]').forEach(function (el) { el.style.translate = '0 ' + (y * el.dataset.p) + 'px'; });
    var r = pin.getBoundingClientRect(), tot = pin.offsetHeight - stick.offsetHeight,
        p = tot > 0 ? Math.max(0, Math.min(1, (nb - r.top) / tot)) : 0;
    ill.style.setProperty('--p', p.toFixed(4));
    tlist.style.translate = '0 ' + (-p * Math.max(0, tlist.scrollHeight - view.clientHeight)) + 'px';
    var cards = $('.tc', tlist);
    if (cards.length) {
      var vr = view.getBoundingClientRect(), mid = vr.top + vr.height / 2, best = 0, bd = 1e9;
      cards.forEach(function (c, i) { var b = c.getBoundingClientRect(), d = Math.abs(b.top + b.height / 2 - mid); if (d < bd) { bd = d; best = i; } });
      cards.forEach(function (c, i) { c.classList.toggle('act', i === best); });
      cnt.textContent = (best + 1) + ' / ' + cards.length;
    }
    var cur = '';
    secs.forEach(function (s) { if (s && s.getBoundingClientRect().top < innerHeight * .4) cur = s.id; });
    links.forEach(function (a) { a.classList.toggle('on', a.dataset.go === cur); });
  }
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(sc); } }, { passive: true });
  addEventListener('resize', function () { size(); sc(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { size(); sc(); });

  /* ---------- boot ---------- */
  watch(document);
  size(); sc();
  AK.fetchContent().catch(function () { return JSON.parse(JSON.stringify(AK.DEFAULTS)); }).then(function (data) {
    D = data;
    applyTexts(); renderGal(); renderTs(); applyCfg();
    $('[data-aos-group]').forEach(function (g) { $('[data-aos]', g).forEach(function (el, i) { el.dataset.aosDelay = i * 90; }); });
    watch(document);
    size(); sc(); setTimeout(function () { size(); sc(); }, 400);
    requestAnimationFrame(function () { root.classList.remove('loading'); });
  });
})();