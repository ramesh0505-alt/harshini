/* ============================================================
   Marginalia portfolio — interactions
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- reveal on scroll ---------- */
  var revs = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revs.forEach(function (el) { ro.observe(el); });
  } else {
    revs.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- doodles draw themselves ---------- */
  /* measure each path so the dash length matches exactly */
  function prepDoodles(scope) {
    (scope || document).querySelectorAll('.doodle').forEach(function (svg) {
      if (svg.dataset.prepared) return;
      svg.dataset.prepared = '1';
      svg.querySelectorAll('.draw').forEach(function (p) {
        try {
          var L = p.getTotalLength();
          if (L && isFinite(L)) {
            // only the dash array is inline — the offset is left to CSS so the
            // .in class can animate it
            p.style.setProperty('--len', Math.ceil(L) + 1);
            p.style.strokeDasharray = (L + 1) + ' ' + (L + 1);
          }
        } catch (err) { /* unsupported element */ }
      });
    });
  }
  prepDoodles();

  var doodles = document.querySelectorAll('.doodle');
  if ('IntersectionObserver' in window && !reduce) {
    var dObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var delay = parseFloat(el.dataset.delay || 0);
        // hero doodles should be slightly staggered
        setTimeout(function () { el.classList.add('in'); }, delay * 1000);
        dObs.unobserve(el);
      });
    }, { rootMargin: '0px 0px -4% 0px', threshold: 0.15 });
    doodles.forEach(function (d, i) {
      // stagger within the hero
      if (d.closest('.hero')) {
        var idx = Array.prototype.indexOf.call(doodles, d);
        d.dataset.delay = (0.25 + idx * 0.22).toFixed(2);
      }
      dObs.observe(d);
    });
  } else {
    doodles.forEach(function (d) { d.classList.add('in'); });
  }

  /* ---------- scroll progress + section label ---------- */
  var track = document.getElementById('track');
  var label = document.getElementById('sectionLabel');
  var sections = [
    ['cover', 'cover'],
    ['hello', 'hello'],
    ['cv', 'cv'],
    ['skills', 'skills'],
    ['work', 'work'],
    ['notes', 'notes'],
    ['contact', 'hello']
  ];

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? h.scrollTop / max : 0;
      if (track) track.style.width = (p * 100).toFixed(2) + '%';

      if (label) {
        var mid = window.innerHeight * 0.42;
        var current = 'cover';
        for (var i = 0; i < sections.length; i++) {
          var el = document.getElementById(sections[i][0]);
          if (!el) continue;
          var r = el.getBoundingClientRect();
          if (r.top <= mid) current = sections[i][1];
        }
        if (label.textContent !== current) {
          label.style.opacity = '0';
          setTimeout(function () {
            label.textContent = current;
            label.style.opacity = '1';
          }, 130);
        }
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- project card links scroll to detail ---------- */
  document.querySelectorAll('.pcard').forEach(function (card) {
    var id = card.getAttribute('href');
    if (!id || id.charAt(0) !== '#') return;
    var target = document.querySelector(id);
    if (!target) return;
    var extra = document.createElement('span');
    extra.className = 'plink';
    extra.textContent = 'view project →';
    card.querySelector('figcaption').appendChild(extra);
    card.addEventListener('click', function (e) {
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.pageYOffset - 60;
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---------- smooth anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var y = t.getBoundingClientRect().top + window.pageYOffset - (id === '#cover' ? 0 : 40);
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---------- subtle parallax on the hero title ---------- */
  if (!reduce) {
    var heroTitle = document.querySelector('.hero__title');
    var heroSign = document.querySelector('.hero__sign');
    window.addEventListener('scroll', function () {
      var y = window.pageYOffset;
      if (y > window.innerHeight * 1.1) return;
      if (heroTitle) heroTitle.style.transform = 'translate3d(0,' + (y * 0.06) + 'px,0)';
      if (heroSign) heroSign.style.transform = 'translate3d(0,' + (y * 0.11) + 'px,0) rotate(-7deg)';
    }, { passive: true });
  }

  /* ---------- tiny detail: label hover tilt ---------- */
  document.querySelectorAll('.lbl').forEach(function (l) {
    l.style.transition = 'transform .5s var(--ease)';
  });
})();
