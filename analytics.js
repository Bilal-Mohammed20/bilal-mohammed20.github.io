/* =============================================================
   ANALYTICS — Google Analytics 4 + Microsoft Clarity
   -------------------------------------------------------------
   1. Paste your two IDs below (replace the placeholder text).
      - GA4 Measurement ID: analytics.google.com → Admin → Data streams
        → your web stream. Looks like  G-AB12CD34EF
      - Clarity Project ID: clarity.microsoft.com → your project →
        Settings → Overview. Looks like  k9x2m4p7qz
   2. Commit. Nothing loads until a real ID is filled in, so leaving
      a placeholder in place simply switches that tool off.

   To stop counting YOUR OWN visits, open this once in each browser
   you use (laptop, phone):
       https://bilal-mohammed20.github.io/?notrack=1
   To start counting that browser again:
       https://bilal-mohammed20.github.io/?notrack=0
============================================================= */
(function () {
  'use strict';

  const GA_ID = 'G-XXXXXXXXXX';        // ← your GA4 Measurement ID
  const CLARITY_ID = 'XXXXXXXXXX';     // ← your Clarity Project ID

  const gaReady = /^G-[A-Z0-9]+$/.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX';
  const clarityReady = /^[a-z0-9]+$/i.test(CLARITY_ID) && CLARITY_ID !== 'XXXXXXXXXX';

  /* ---- Opt-out for the site owner's own browsers ---- */
  const OPT_OUT_KEY = 'analytics-optout';
  try {
    const flag = new URLSearchParams(location.search).get('notrack');
    if (flag === '1') localStorage.setItem(OPT_OUT_KEY, '1');
    if (flag === '0') localStorage.removeItem(OPT_OUT_KEY);
    if (flag !== null) {
      // tidy the address bar so the flag isn't shared by accident
      history.replaceState(null, '', location.pathname + location.hash);
    }
  } catch (e) { /* storage blocked: carry on as a normal visitor */ }

  let optedOut = false;
  try { optedOut = localStorage.getItem(OPT_OUT_KEY) === '1'; } catch (e) {}

  // Don't record local testing or opted-out browsers
  const isLocal = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  if (optedOut || isLocal) return;

  /* ---- Load Google Analytics 4 ---- */
  if (gaReady) {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  /* ---- Load Microsoft Clarity ---- */
  if (clarityReady) {
    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    const c = document.createElement('script');
    c.async = true;
    c.src = 'https://www.clarity.ms/tag/' + CLARITY_ID;
    document.head.appendChild(c);
  }

  if (!gaReady && !clarityReady) return;

  /* ---- Send one named event to whichever tools are on ---- */
  function track(name, details) {
    if (gaReady && window.gtag) window.gtag('event', name, details);
    if (clarityReady && window.clarity) window.clarity('event', name);
  }

  // Which part of the page a click came from (nav, hero, contact, ...)
  function whereOnPage(el) {
    if (el.closest('nav')) return 'nav';
    if (el.closest('.hero')) return 'hero';
    const section = el.closest('section[id], header[id], footer, [id="contact"]');
    return section ? (section.id || section.tagName.toLowerCase()) : 'page';
  }

  function cleanText(el) {
    return (el.textContent || '').replace(/\s+/g, ' ').replace(/[↓↗→⧉]/g, '').trim().slice(0, 100);
  }

  /* ---- Click tracking ----
     One listener for the whole page, in the capture phase, so it also
     sees buttons the site builds later from data.js and buttons whose
     own click handlers stop the event from bubbling. */
  document.addEventListener('click', function (e) {
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;

    // Copy-email button
    if (target.closest('#contact-copy-email')) {
      track('email_copy', { link_location: 'contact' });
      return;
    }

    // "Live demo inside" badges on project cards
    const badge = target.closest('.demo-badge');
    if (badge) {
      const card = badge.closest('.project-card');
      const title = card && card.querySelector('h3') ? cleanText(card.querySelector('h3')) : '';
      track('demo_open', { project: title });
      return;
    }

    // Expanding a project card ("more" button) — only count opening, not closing
    const more = target.closest('.project-more');
    if (more) {
      if (more.getAttribute('aria-expanded') === 'false') {
        const card = more.closest('.project-card');
        const title = card && card.querySelector('h3') ? cleanText(card.querySelector('h3')) : '';
        track('project_open', { project: title });
      }
      return;
    }

    const link = target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    const where = whereOnPage(link);

    if (/\.pdf($|\?)/i.test(href)) {
      track('resume_download', { link_location: where });
    } else if (href.startsWith('mailto:')) {
      track('email_click', { link_location: where });
    } else if (href.includes('linkedin.com')) {
      track('linkedin_click', { link_location: where });
    } else if (link.matches('.pf-live-link')) {
      track('live_project_click', { link_text: cleanText(link) });
    } else if (link.closest('.pillar-links')) {
      track('resource_click', { link_text: cleanText(link) });
    }
  }, true);
})();
