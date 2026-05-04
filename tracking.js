(function () {
  'use strict';

  function push(data) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
  }

  /* ── Navbar brand ── */
  var brand = document.querySelector('.navbar-brand');
  if (brand) {
    brand.addEventListener('click', function () {
      push({ event: 'navbar_brand_click', link_text: brand.textContent.trim() });
    });
  }

  /* ── Navbar links ── */
  document.querySelectorAll('.navbar-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      push({ event: 'navbar_link_click', link_text: link.textContent.trim(), link_url: link.getAttribute('href') });
    });
  });

  /* ── Hero CTAs ── */
  var linkPrimary = document.querySelector('.link-primary');
  if (linkPrimary) {
    linkPrimary.addEventListener('click', function () {
      push({ event: 'hero_cta_click', cta_text: linkPrimary.textContent.trim(), cta_destination: linkPrimary.getAttribute('href') });
    });
  }
  var linkSecondary = document.querySelector('.link-secondary');
  if (linkSecondary) {
    linkSecondary.addEventListener('click', function () {
      push({ event: 'hero_cta_click', cta_text: linkSecondary.textContent.trim(), cta_destination: linkSecondary.getAttribute('href') });
    });
  }

  /* ── Project items ── */
  document.querySelectorAll('.project-item').forEach(function (item) {
    var titleEl = item.querySelector('.project-title');
    var yearEl  = item.querySelector('.project-year');
    item.addEventListener('click', function () {
      push({
        event:         'project_click',
        project_title: titleEl ? titleEl.textContent.trim() : 'unknown',
        project_year:  yearEl  ? yearEl.textContent.trim()  : 'unknown',
        link_url:      item.getAttribute('href')
      });
    });
  });

  /* ── Footer social links ── */
  document.querySelectorAll('.footer-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      push({ event: 'social_link_click', platform: link.textContent.trim(), link_url: link.getAttribute('href'), location: 'footer' });
    });
  });

  /* ── Section visibility (once per section) ── */
  var seen = {};
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var id = entry.target.id;
      if (entry.isIntersecting && !seen[id]) {
        seen[id] = true;
        push({ event: 'section_view', section_name: id });
      }
    });
  }, { threshold: 0.3 });

  ['hero', 'skills', 'projects'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  /* ── Scroll depth 25 / 50 / 75 / 100 % ── */
  var depthsFired = {};
  window.addEventListener('scroll', function () {
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    var pct = Math.round(((window.scrollY || document.documentElement.scrollTop) / maxScroll) * 100);
    [25, 50, 75, 100].forEach(function (d) {
      if (pct >= d && !depthsFired[d]) {
        depthsFired[d] = true;
        push({ event: 'scroll_depth', depth_percent: d });
      }
    });
  }, { passive: true });

}());
