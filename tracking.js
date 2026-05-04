(function () {
  'use strict';

  /* ─────────────────────────────────────────
     Helper — push to dataLayer (GTM-ready)
  ───────────────────────────────────────── */
  function push(data) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
  }

  /* ─────────────────────────────────────────
     NAVBAR — brand click
  ───────────────────────────────────────── */
  var brand = document.querySelector('.navbar-brand');
  if (brand) {
    brand.addEventListener('click', function () {
      push({
        event: 'navbar_brand_click',
        link_text: brand.textContent.trim(),
        link_url: brand.getAttribute('href')
      });
    });
  }

  /* ─────────────────────────────────────────
     NAVBAR — anchor links
  ───────────────────────────────────────── */
  document.querySelectorAll('.navbar-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      push({
        event: 'navbar_link_click',
        link_text: link.textContent.trim(),
        link_url: link.getAttribute('href')
      });
    });
  });

  /* ─────────────────────────────────────────
     NAVBAR — social icon buttons
  ───────────────────────────────────────── */
  document.querySelectorAll('.navbar-icons .icon-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      push({
        event: 'social_link_click',
        platform: btn.getAttribute('title') || 'unknown',
        link_url: btn.getAttribute('href'),
        location: 'navbar'
      });
    });
  });

  /* ─────────────────────────────────────────
     HERO — CTA buttons
  ───────────────────────────────────────── */
  document.querySelectorAll('.hero-cta a').forEach(function (btn) {
    btn.addEventListener('click', function () {
      push({
        event: 'hero_cta_click',
        cta_text: btn.textContent.trim(),
        cta_destination: btn.getAttribute('href')
      });
    });
  });

  /* ─────────────────────────────────────────
     PROJECTS — card & CTA button clicks
  ───────────────────────────────────────── */
  document.querySelectorAll('.card').forEach(function (card) {
    var titleEl = card.querySelector('.card-title');
    var projectTitle = titleEl ? titleEl.textContent.trim() : 'unknown';

    card.addEventListener('click', function (e) {
      if (!e.target.closest('.btn-card')) {
        push({
          event: 'project_card_click',
          project_title: projectTitle
        });
      }
    });

    var ctaBtn = card.querySelector('.btn-card');
    if (ctaBtn) {
      ctaBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        push({
          event: 'project_cta_click',
          project_title: projectTitle,
          cta_text: ctaBtn.textContent.trim(),
          link_url: ctaBtn.getAttribute('href')
        });
      });
    }
  });

  /* ─────────────────────────────────────────
     HOBBIES — card clicks
  ───────────────────────────────────────── */
  document.querySelectorAll('.hobby-card').forEach(function (card) {
    var labelEl = card.querySelector('.hobby-label');
    card.addEventListener('click', function () {
      push({
        event: 'hobby_card_click',
        hobby_name: labelEl ? labelEl.textContent.trim() : 'unknown'
      });
    });
  });

  /* ─────────────────────────────────────────
     CONTACT FORM — field focus (once per field)
  ───────────────────────────────────────── */
  var form = document.querySelector('.contact-form');
  if (form) {
    form.querySelectorAll('input, textarea').forEach(function (field) {
      var fired = false;
      field.addEventListener('focus', function () {
        if (!fired) {
          fired = true;
          push({
            event: 'contact_form_field_focus',
            field_id: field.id || field.name || field.type
          });
        }
      });
    });

    /* CONTACT FORM — submit attempt */
    form.addEventListener('submit', function () {
      var name    = document.getElementById('cf-name');
      var subject = document.getElementById('cf-subject');
      push({
        event: 'contact_form_submit',
        form_name: 'contact',
        subject_filled: !!(subject && subject.value.trim()),
        name_filled:    !!(name    && name.value.trim())
      });
    });
  }

  /* ─────────────────────────────────────────
     FOOTER — social link clicks
  ───────────────────────────────────────── */
  document.querySelectorAll('.footer-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      push({
        event: 'social_link_click',
        platform: link.textContent.trim(),
        link_url: link.getAttribute('href'),
        location: 'footer'
      });
    });
  });

  /* ─────────────────────────────────────────
     SECTION VISIBILITY — fired once per section
  ───────────────────────────────────────── */
  var trackedSections = {};
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var id = entry.target.id;
      if (entry.isIntersecting && !trackedSections[id]) {
        trackedSections[id] = true;
        push({
          event: 'section_view',
          section_name: id
        });
      }
    });
  }, { threshold: 0.3 });

  ['hero', 'skills', 'projects', 'hobbies', 'contact'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  /* ─────────────────────────────────────────
     SCROLL DEPTH — 25 / 50 / 75 / 100 %
  ───────────────────────────────────────── */
  var depthsFired = {};
  window.addEventListener('scroll', function () {
    var scrolled  = window.scrollY || document.documentElement.scrollTop;
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    var pct = Math.round((scrolled / maxScroll) * 100);

    [25, 50, 75, 100].forEach(function (depth) {
      if (pct >= depth && !depthsFired[depth]) {
        depthsFired[depth] = true;
        push({
          event: 'scroll_depth',
          depth_percent: depth
        });
      }
    });
  }, { passive: true });

}());
