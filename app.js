(() => {
  'use strict';

  const LAYER_COLOR = {
    requirements: 'var(--layer-coral)',
    systems:      'var(--layer-violet)',
    automation:   'var(--layer-gold)',
    insight:      'var(--layer-teal)',
    impact:       'var(--layer-pink)'
  };
  const LAYER_TINT = {
    requirements: 'var(--tint-coral)',
    systems:      'var(--tint-violet)',
    automation:   'var(--tint-gold)',
    insight:      'var(--tint-teal)',
    impact:       'var(--tint-pink)'
  };
  const LAYER_TITLE = {
    requirements: 'Requirements',
    systems:      'Executive Reporting',
    automation:   'Process Automation',
    insight:      'Reconciliation Tools',
    impact:       'Impact'
  };
  // Darkened, WCAG-AA-safe (≥4.5:1) text variants of each layer accent — used
  // wherever a layer colour renders as small/normal text (tags, links, badges)
  // rather than as a background, border, dot or decorative icon.
  const LAYER_TEXT = {
    requirements: 'var(--layer-coral-text)',
    systems:      'var(--layer-violet-text)',
    automation:   'var(--layer-gold-text)',
    insight:      'var(--layer-teal-text)',
    impact:       'var(--layer-pink-text)'
  };

  // The 7 builds that carry something to look at inside the expanded panel:
  // six ship a real, click-to-try inline demo (see the ...DemoHTML / wire...Demo
  // functions further down) and 'power-bi' ships a static sample visual instead
  // — it gets a "Sample visual inside" badge rather than "Live demo inside".
  // Everything else renders a plain "Read the full build" panel.
  // Escapes text before it goes into an innerHTML template literal. Any value
  // that originated from something a visitor typed MUST go through this — the
  // email-log demo takes free text, and without escaping a pasted <img onerror>
  // executes in the page.
  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  const LIVE_DEMO_IDS = ['research-combiner', 'annual-report', 'weekly-report', 'form-extractor', 'sharepoint-sync', 'email-log', 'power-bi'];

  // Wraps specific, hand-picked phrases in a bold coloured span — used to
  // surface genuine hard numbers as you read (Direction 2 from the colour
  // review). Curated per block, never a blind regex: only exact phrases
  // listed below get wrapped, everything else in the paragraph is untouched.
  // Restraint is the point — at most 1-2 facts per paragraph, only real
  // quantifiable claims, never adjectives or generic phrases.
  function applyEmphasis(text, phrases) {
    if (!phrases || !phrases.length) return text;
    let result = text;
    phrases.forEach(phrase => {
      if (result.includes(phrase)) {
        result = result.replace(phrase, `<strong class="fact">${phrase}</strong>`);
      }
    });
    return result;
  }
  const PILLAR_FACTS = {
    structure: ['146 departments'],
  };
  // Empty by design: the emphasis helper only ever wraps phrases that are
  // present verbatim in the copy, so entries are added here only alongside the
  // sentence they highlight.
  const PROJECT_BUILD_FACTS = {};
  const PROJECT_IMPACT_FACTS = {};
  const PROJECT_SUMMARY_FACTS = {
    'consolidator': ['five-minute upload'],
  };
  const JOURNEY_SUMMARY_FACTS = {};

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $all = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const el = (tag, opts = {}) => Object.assign(document.createElement(tag), opts);

  /* ---------------------------------------------------------
     HERO
  --------------------------------------------------------- */
  function renderHero() {
    const p = CONTENT.profile;
    $('#hero-eyebrow').textContent = p.heroEyebrow;
    $('#hero-headline').textContent = p.heroHeadline;
    $('#hero-sub').innerHTML = applyEmphasis(p.heroSub, ['146 departments']);

    const wrap = $('#stack-visual');
    const n = p.stackLayers.length;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cards = [];
    p.stackLayers.forEach((layer, i) => {
      const card = el('div', { className: 'stack-card' });
      card.style.background = 'var(--paper-raised)';
      card.style.borderLeft = `5px solid ${layer.color}`;
      card.style.setProperty('--flow-color', layer.color);
      card.style.top = `${i * 62}px`;
      card.style.setProperty('--tilt', `${(i - (n - 1) / 2) * -1.4}deg`);
      card.style.zIndex = n - i;
      card.dataset.index = i;
      card.innerHTML = `
        <div>
          <div class="sc-label">${layer.label}</div>
          <div class="sc-sub">${layer.sub}</div>
        </div>
        <div class="sc-index">0${i + 1}</div>`;

      const rest = `translateZ(0) rotate(var(--tilt)) translateX(${i * 8}px)`;
      card.dataset.rest = rest;
      if (reduce) {
        card.style.transform = rest;
        card.style.opacity = '1';
      } else {
        card.style.opacity = '0';
        card.style.transform = `translateZ(0) rotate(var(--tilt)) translateX(${i * 8}px) translateY(22px) scale(0.96)`;
      }
      wrap.appendChild(card);
      cards.push(card);
    });

    // The "lit" card — driven automatically by the flow timer below, or
    // directly by a click/keypress on any card. Manual activation always
    // works (even under reduced-motion); only the auto-cycle is motion-gated.
    let flowTimer = null, flowIndex = 0;
    function setActive(i) {
      cards.forEach(c => c.classList.remove('is-flowing'));
      cards[i].classList.add('is-flowing');
      cards[i].setAttribute('aria-pressed', 'true');
      cards.forEach((c, idx) => { if (idx !== i) c.setAttribute('aria-pressed', 'false'); });
      flowIndex = (i + 1) % cards.length;
    }
    function stepFlow() { setActive(flowIndex); }
    function startFlow() { if (!flowTimer) { stepFlow(); flowTimer = setInterval(stepFlow, 900); } }
    function stopFlow() { if (flowTimer) { clearInterval(flowTimer); flowTimer = null; cards.forEach(c => c.classList.remove('is-flowing')); } }

    cards.forEach((card, i) => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-pressed', 'false');
      card.setAttribute('aria-label', `Highlight the ${p.stackLayers[i].label} stage`);
      const activate = () => {
        setActive(i);
        // a manual press restarts the auto-cadence from here rather than
        // fighting it — the next auto-step continues on from this card
        if (flowTimer) { clearInterval(flowTimer); flowTimer = setInterval(stepFlow, 900); }
      };
      card.addEventListener('click', activate);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
      });
    });

    if (!reduce) {
      // staggered entrance — cards land one by one
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = card.dataset.rest;
        }, 220 + i * 130);
      });

      // quiet ongoing flow — a glow drifts down through the pipeline, only while in view
      const flowStart = 220 + cards.length * 130 + 500;
      setTimeout(() => {
        const io = new IntersectionObserver((entries) => {
          entries.forEach(entry => entry.isIntersecting ? startFlow() : stopFlow());
        }, { threshold: 0.3 });
        io.observe(wrap);
      }, flowStart);
    }

    // gentle mouse-parallax on the stack (desktop only, respects reduced-motion)
    if (!reduce && window.matchMedia('(pointer:fine)').matches) {
      const stackCards = $all('.stack-card', wrap);
      let cachedRect = null;
      let raf = null;
      wrap.addEventListener('mouseenter', () => { cachedRect = wrap.getBoundingClientRect(); });
      wrap.addEventListener('mousemove', (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = null;
          if (!cachedRect) cachedRect = wrap.getBoundingClientRect();
          const relX = (e.clientX - cachedRect.left) / cachedRect.width - 0.5;
          const relY = (e.clientY - cachedRect.top) / cachedRect.height - 0.5;
          stackCards.forEach((card, i) => {
            const depth = (i + 1) * 3.2;
            card.style.transform =
              `translateZ(0) rotate(var(--tilt)) translateX(${i * 8 + relX * depth}px) translateY(${relY * depth * 0.6}px)`;
          });
        });
      });
      window.addEventListener('resize', () => { cachedRect = null; });
      wrap.addEventListener('mouseleave', () => {
        stackCards.forEach((card, i) => {
          card.style.transform = `translateZ(0) rotate(var(--tilt)) translateX(${i * 8}px)`;
        });
      });
    }
  }

  /* ---------------------------------------------------------
     STATS
  --------------------------------------------------------- */
  function renderStats() {
    const grid = $('#stats-grid');
    CONTENT.stats.forEach(s => {
      // Stats with a destination become real links; stats with none (e.g. proof
      // that lives off-page, like a published dashboard) render as plain, inert
      // cells rather than a link that goes nowhere.
      const cell = el(s.href ? 'a' : 'div', { className: 'stat-cell' });
      if (s.href) {
        cell.href = s.href;
        cell.setAttribute('aria-label', `${s.value}: ${s.label}. Jump to the full evidence.`);
        cell.addEventListener('click', () => {
          const target = document.querySelector(s.href);
          if (target && target.classList.contains('tl-item')) {
            setTimelineItemOpen(target, true);
          }
        });
      }
      cell.innerHTML = `<div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div>`;
      grid.appendChild(cell);
    });
  }

  /* ---------------------------------------------------------
     JOURNEY / TIMELINE
  --------------------------------------------------------- */
  // Shared timeline open/close logic — used by the manual "Show detail" button
  // AND by the stats-band links, so both stay in sync with one code path.
  function setTimelineItemOpen(item, open) {
    const btn = $('.tl-toggle', item);
    const detailsEl = $('.tl-details', item);
    if (!btn || !detailsEl) return;
    item.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    $('.label', btn).textContent = open ? 'Hide detail' : 'Show detail';
    detailsEl.style.maxHeight = open ? `${detailsEl.scrollHeight}px` : '0px';
  }

  function renderTimeline() {
    const tl = $('#timeline');
    tl.innerHTML = ''; // replace any static/pre-rendered fallback markup with the full interactive version
    CONTENT.journey.forEach((role, i) => {
      const color = LAYER_COLOR[role.layer] || 'var(--layer-violet)';
      const textColor = LAYER_TEXT[role.layer] || 'var(--layer-violet-text)';
      const item = el('div', { className: 'tl-item' + (role.concurrent ? ' is-concurrent' : '') + (i >= 3 ? ' tl-item--earlier' : '') });
      if (role.id) item.id = role.id;
      item.style.setProperty('--layer-color', color);
      item.style.setProperty('--layer-color-text', textColor);
      const detailsId = `tl-details-${i}`;

      const periodLine = `${role.period}${role.current ? '<span class="tl-current">Current</span>' : ''}${role.concurrent ? `<span class="tl-concurrent-tag">Concurrent role</span>` : ''}`;

      // Concurrent, single-fact roles (e.g. a short directorship run alongside a
      // full-time role) don't need the expand/collapse pattern built for
      // multi-bullet roles — show the summary directly instead.
      if (role.concurrent && (!role.details || role.details.length === 0)) {
        item.innerHTML = `
          <div class="tl-dot"></div>
          <div class="tl-period">${periodLine}</div>
          <h3 class="tl-role">${role.role}</h3>
          <div class="tl-org">${role.org}</div>
          <p class="tl-summary">${applyEmphasis(role.summary, JOURNEY_SUMMARY_FACTS[i])}</p>`;
      } else {
        item.innerHTML = `
          <div class="tl-dot"></div>
          <div class="tl-period">${periodLine}</div>
          <h3 class="tl-role">${role.role}</h3>
          <div class="tl-org">${role.org}</div>
          <p class="tl-summary">${applyEmphasis(role.summary, JOURNEY_SUMMARY_FACTS[i])}</p>
          <div class="tl-details" id="${detailsId}">
            <ul>${role.details.map(d => `<li>${d}</li>`).join('')}</ul>
          </div>
          <button class="tl-toggle" aria-expanded="false" aria-controls="${detailsId}">
            <span class="label">Show detail</span><span class="chevron">▾</span>
          </button>`;
        const btn = $('.tl-toggle', item);
        btn.addEventListener('click', () => {
          setTimelineItemOpen(item, !item.classList.contains('is-open'));
        });
      }
      tl.appendChild(item);
    });

    // draw the connecting line once the timeline scrolls into view
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { tl.classList.add('is-drawn'); io.disconnect(); }
      });
    }, { threshold: 0.15 });
    io.observe(tl);
  }

  /* ---------------------------------------------------------
     PLATFORM (flagship)
  --------------------------------------------------------- */
  // Maps each raw layer accent to its WCAG-AA-safe text sibling, so data.js can
  // keep declaring one colour per pillar without knowing about the text ramp.
  const PILLAR_TEXT_COLOR = {
    'var(--layer-coral)':  'var(--layer-coral-text)',
    'var(--layer-violet)': 'var(--layer-violet-text)',
    'var(--layer-gold)':   'var(--layer-gold-text)',
    'var(--layer-teal)':   'var(--layer-teal-text)',
    'var(--layer-pink)':   'var(--layer-pink-text)'
  };

  function renderPlatform() {
    const p = CONTENT.platform;
    $('#platform-eyebrow').textContent = p.eyebrow;
    $('#platform-title').textContent = p.title;
    $('#platform-intro').textContent = p.intro;

    const grid = $('#pillar-grid');
    p.pillars.forEach(pillar => {
      const card = el('div', { className: 'pillar-card' });
      card.id = `pillar-${pillar.id}`;
      card.style.setProperty('--pillar-color', pillar.color);
      card.style.setProperty('--pillar-tint', pillar.tint);
      // Darkened sibling of the pillar's accent, for anything that renders as
      // actual text. --layer-coral in particular is far too light to read at
      // label sizes; the raw accent stays in use for borders, dots and glows.
      card.style.setProperty('--pillar-color-text', PILLAR_TEXT_COLOR[pillar.color] || pillar.color);
      let linksHtml = '';
      if (pillar.links) {
        linksHtml = `<div class="pillar-links-label">Published resources</div>
        <div class="pillar-links">${pillar.links.map(l =>
          `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join('')}</div>`;
      }
      let statHtml = '';
      if (pillar.stat) {
        statHtml = `<div class="pillar-stat">
          <span class="ps-from">${pillar.stat.from}</span>
          <span class="ps-arrow">→</span>
          <span class="ps-to">${pillar.stat.to}</span>
          <span class="ps-label">${pillar.stat.label}</span>
        </div>`;
      }
      let riskHtml = '';
      if (pillar.riskBreakdown) {
        const r = pillar.riskBreakdown;
        riskHtml = `<dl class="pillar-risk">
          <div class="pillar-risk-row"><dt>Situation</dt><dd>${r.situation}</dd></div>
          <div class="pillar-risk-row"><dt>Risk</dt><dd>${r.risk}</dd></div>
          <div class="pillar-risk-row"><dt>Action</dt><dd>${r.action}</dd></div>
          <div class="pillar-risk-row"><dt>Outcome</dt><dd>${r.outcome}</dd></div>
        </dl>`;
      }
      card.innerHTML = `
        <div class="pillar-label">${pillar.label}</div>
        <h3>${pillar.title}</h3>
        <p>${applyEmphasis(pillar.body, PILLAR_FACTS[pillar.id])}</p>
        ${riskHtml}
        ${statHtml}
        ${linksHtml}`;
      grid.appendChild(card);
    });
  }

  /* ---------------------------------------------------------
     PROCESS DESIGN — decision framework (separated from Platform
     so it reads as its own supporting-evidence section, not a
     fifth REGIS pillar)
  --------------------------------------------------------- */
  function renderProcessDesign() {
    const df = CONTENT.decisionFramework;
    $('#decision-eyebrow').textContent = df.eyebrow;
    $('#decision-title').textContent = df.title;
    $('#decision-intro').textContent = df.intro;
    renderDecisionDiagram();
  }

  function renderDecisionDiagram() {
    const svg = `
<svg viewBox="0 0 889 1338" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" id="decision-svg">
  <defs>
    <marker id="arrow" viewBox="0 0 9 9" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0.00,0.00 L8.80,4.40 L0.00,8.80 z" fill="var(--ink-faint)"></path>
    </marker>
  </defs>
<g class="df-node" data-group="shared" data-order="0">
<rect x="223.52" y="17.60" width="228.80" height="45.76" rx="20.13" fill="var(--tint-coral)" stroke="var(--layer-coral)" stroke-width="1.32"></rect>
<text x="337.92" y="44.35" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11.00" font-weight="600" fill="var(--ink)">Compliance report submitted</text>
<polygon points="337.92,89.76 452.32,151.36 337.92,212.96 223.52,151.36" fill="var(--tint-violet)" stroke="var(--layer-violet)" stroke-width="1.5"></polygon>
<text x="337.92" y="147.05" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11.00" font-weight="400" fill="var(--ink)">What type of</text>
<text x="337.92" y="163.33" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11.00" font-weight="400" fill="var(--ink)">report is this?</text>
<path d="M337.92,63.36 L337.92,89.76" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<text x="221.76" y="144.32" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="10.12" font-weight="400" fill="var(--ink-soft)">Corporate audit</text>
<path d="M223.52,151.36 L132.00,151.36" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<text x="459.36" y="144.32" text-anchor="start" font-family="IBM Plex Mono, monospace" font-size="10.12" font-weight="400" fill="var(--ink-soft)">Store submission</text>
</g>
<g class="df-node" data-group="shared2" data-order="1">
<polygon points="543.84,248.16 645.04,305.36 543.84,362.56 442.64,305.36" fill="var(--tint-violet)" stroke="var(--layer-violet)" stroke-width="1.5"></polygon>
<text x="543.84" y="301.14" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">Store ID matches</text>
<text x="543.84" y="316.98" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">the request on file?</text>
<path d="M452.32,151.36 L543.84,151.36 L543.84,248.16" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
</g>
<g class="df-node" data-group="shared3" data-order="2">
<polygon points="349.36,424.16 446.16,476.96 349.36,529.76 252.56,476.96" fill="var(--tint-violet)" stroke="var(--layer-violet)" stroke-width="1.5"></polygon>
<text x="349.36" y="472.74" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">Other stores linked</text>
<text x="349.36" y="488.58" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">under same ID?</text>
<text x="440.88" y="298.32" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="10.12" font-weight="400" fill="var(--ink-soft)">Yes</text>
<path d="M442.64,305.36 L349.36,305.36 L349.36,424.16" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
</g>
<g class="df-node" data-group="scenario-a" data-order="1">
<rect x="30.80" y="204.16" width="202.40" height="77.44" rx="7.74" fill="var(--tint-gold)" stroke="var(--layer-gold)" stroke-width="1.32"></rect>
<text x="132.00" y="222.64" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8.36" font-weight="600" fill="var(--layer-gold-text)" letter-spacing="0.04em">SCENARIO A · CORPORATE AUDIT</text>
<text x="132.00" y="249.22" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">Already reviewed centrally —</text>
<text x="132.00" y="265.06" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">no store follow-up needed</text>
<path d="M132.00,151.36 L132.00,204.16" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
</g>
<g class="df-node" data-group="scenario-a" data-order="1">
<rect x="39.60" y="315.04" width="184.80" height="45.76" rx="20.13" fill="var(--tint-gold)" stroke="var(--layer-gold)" stroke-width="1.32"></rect>
<text x="132.00" y="341.62" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="600" fill="var(--ink)">Accepted — closed</text>
<path d="M132.00,281.60 L132.00,315.04" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
</g>
<g class="df-node" data-group="scenario-b" data-order="3">
<path d="M220.00,476.96 L220.00,525.36" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<rect x="117.92" y="525.36" width="204.16" height="77.44" rx="7.74" fill="var(--tint-teal)" stroke="var(--layer-teal)" stroke-width="1.32"></rect>
<text x="220.00" y="543.84" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8.36" font-weight="600" fill="var(--layer-teal-text)" letter-spacing="0.04em">SCENARIO B · SINGLE-STORE REPORT</text>
<text x="220.00" y="570.42" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">Confirm store's milestone</text>
<text x="220.00" y="586.26" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">is marked Active</text>
<path d="M220.00,602.80 L220.00,638.00" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<polygon points="220.00,638.00 303.60,689.04 220.00,740.08 136.40,689.04" fill="var(--tint-violet)" stroke="var(--layer-violet)" stroke-width="1.5"></polygon>
<text x="220.00" y="684.82" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">Evidence</text>
<text x="220.00" y="700.66" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">attached?</text>
<text x="227.04" y="757.68" text-anchor="start" font-family="IBM Plex Mono, monospace" font-size="9.68" font-weight="400" fill="var(--ink-soft)">Missing</text>
<path d="M220.00,740.08 L220.00,775.28" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<rect x="123.20" y="775.28" width="193.60" height="58.08" rx="7.74" fill="var(--tint-teal)" stroke="var(--layer-teal)" stroke-width="1.32"></rect>
<text x="220.00" y="800.10" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.38" font-weight="400" fill="var(--ink)">Request evidence —</text>
<text x="220.00" y="815.76" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.38" font-weight="400" fill="var(--ink)">email this store only</text>
<path d="M220.00,833.36 L220.00,863.28" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<rect x="123.20" y="863.28" width="193.60" height="58.08" rx="7.74" fill="var(--tint-teal)" stroke="var(--layer-teal)" stroke-width="1.32"></rect>
<text x="220.00" y="888.18" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.12" font-weight="400" fill="var(--ink)">Mark linked stores Pending</text>
<text x="220.00" y="903.58" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.12" font-weight="400" fill="var(--ink)">— no emails sent to them</text>
<path d="M220.00,921.36 L220.00,951.28" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<rect x="136.40" y="951.28" width="167.20" height="45.76" rx="7.74" fill="var(--tint-teal)" stroke="var(--layer-teal)" stroke-width="1.32"></rect>
<text x="220.00" y="977.86" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">Wait for response</text>
<path d="M220.00,997.04 L220.00,1030.48" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<rect x="117.92" y="1030.48" width="204.16" height="47.52" rx="20.91" fill="var(--tint-teal)" stroke="var(--layer-teal)" stroke-width="1.32"></rect>
<text x="220.00" y="1057.85" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.38" font-weight="600" fill="var(--ink)">Accept for this store</text>
<text x="310.64" y="680.24" text-anchor="start" font-family="IBM Plex Mono, monospace" font-size="9.68" font-weight="400" fill="var(--ink-soft)">Yes</text>
<path d="M303.60,689.04 L352.00,689.04 L352.00,1054.24 L322.08,1054.24" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<path d="M220.00,1078.00 L220.00,1111.44" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<rect x="136.40" y="1111.44" width="167.20" height="44.00" rx="19.36" fill="var(--tint-teal)" stroke="var(--layer-teal)" stroke-width="1.32"></rect>
<text x="220.00" y="1137.14" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="600" fill="var(--ink)">Report closed</text>
</g>
<g class="df-node" data-group="shared3" data-order="2">
<text x="250.80" y="464.64" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="10.12" font-weight="400" fill="var(--ink-soft)">No</text>
<path d="M252.56,476.96 L220.00,476.96" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
</g>
<g class="df-node" data-group="scenario-c" data-order="3">
<path d="M479.60,476.96 L479.60,525.36" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<rect x="377.52" y="525.36" width="204.16" height="77.44" rx="7.74" fill="var(--tint-pink)" stroke="var(--layer-pink)" stroke-width="1.32"></rect>
<text x="479.60" y="543.84" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8.36" font-weight="600" fill="var(--layer-pink-text)" letter-spacing="0.04em">SCENARIO C · MULTI-STORE REPORT</text>
<text x="479.60" y="570.42" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">Confirm store's milestone</text>
<text x="479.60" y="586.26" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">is marked Active</text>
<path d="M479.60,602.80 L479.60,638.00" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<polygon points="479.60,638.00 563.20,689.04 479.60,740.08 396.00,689.04" fill="var(--tint-violet)" stroke="var(--layer-violet)" stroke-width="1.5"></polygon>
<text x="479.60" y="684.82" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">Evidence</text>
<text x="479.60" y="700.66" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">attached?</text>
<text x="486.64" y="757.68" text-anchor="start" font-family="IBM Plex Mono, monospace" font-size="9.68" font-weight="400" fill="var(--ink-soft)">Missing</text>
<path d="M479.60,740.08 L479.60,775.28" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<rect x="382.80" y="775.28" width="193.60" height="58.08" rx="7.74" fill="var(--tint-pink)" stroke="var(--layer-pink)" stroke-width="1.32"></rect>
<text x="479.60" y="800.10" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.38" font-weight="400" fill="var(--ink)">Request evidence —</text>
<text x="479.60" y="815.76" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.38" font-weight="400" fill="var(--ink)">email this store only</text>
<path d="M479.60,833.36 L479.60,863.28" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<rect x="382.80" y="863.28" width="193.60" height="58.08" rx="7.74" fill="var(--tint-pink)" stroke="var(--layer-pink)" stroke-width="1.32"></rect>
<text x="479.60" y="888.18" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.12" font-weight="400" fill="var(--ink)">Mark linked stores Pending</text>
<text x="479.60" y="903.58" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.12" font-weight="400" fill="var(--ink)">— no emails sent to them</text>
<path d="M479.60,921.36 L479.60,951.28" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<rect x="396.00" y="951.28" width="167.20" height="45.76" rx="7.74" fill="var(--tint-pink)" stroke="var(--layer-pink)" stroke-width="1.32"></rect>
<text x="479.60" y="977.86" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">Wait for response</text>
<path d="M479.60,997.04 L479.60,1030.48" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<rect x="377.52" y="1030.48" width="204.16" height="47.52" rx="20.91" fill="var(--tint-pink)" stroke="var(--layer-pink)" stroke-width="1.32"></rect>
<text x="479.60" y="1057.85" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.38" font-weight="600" fill="var(--ink)">Accept for this store</text>
<text x="570.24" y="680.24" text-anchor="start" font-family="IBM Plex Mono, monospace" font-size="9.68" font-weight="400" fill="var(--ink-soft)">Yes</text>
<path d="M563.20,689.04 L611.60,689.04 L611.60,1054.24 L581.68,1054.24" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<path d="M479.60,1078.00 L479.60,1111.44" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<rect x="377.52" y="1111.44" width="204.16" height="58.08" rx="7.74" fill="var(--tint-pink)" stroke="var(--layer-pink)" stroke-width="1.32"></rect>
<text x="479.60" y="1136.26" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.38" font-weight="400" fill="var(--ink)">Sync all linked stores</text>
<text x="479.60" y="1151.92" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.38" font-weight="400" fill="var(--ink)">to Active</text>
<path d="M479.60,1169.52 L479.60,1202.96" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<rect x="396.00" y="1202.96" width="167.20" height="44.00" rx="19.36" fill="var(--tint-pink)" stroke="var(--layer-pink)" stroke-width="1.32"></rect>
<text x="479.60" y="1228.66" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="600" fill="var(--ink)">Report closed</text>
</g>
<g class="df-node" data-group="shared3" data-order="2">
<text x="453.20" y="464.64" text-anchor="start" font-family="IBM Plex Mono, monospace" font-size="10.12" font-weight="400" fill="var(--ink-soft)">Yes</text>
<path d="M446.16,476.96 L479.60,476.96" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
</g>
<g class="df-node" data-group="scenario-d" data-order="2">
<rect x="637.12" y="402.16" width="204.16" height="77.44" rx="7.74" fill="var(--tint-coral)" stroke="var(--layer-coral)" stroke-width="1.32"></rect>
<text x="739.20" y="420.64" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8.36" font-weight="600" fill="var(--layer-coral-text)" letter-spacing="0.04em">SCENARIO D · WRONG STORE</text>
<text x="739.20" y="447.22" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.38" font-weight="400" fill="var(--ink)">Identify the correct store</text>
<text x="739.20" y="462.88" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.38" font-weight="400" fill="var(--ink)">from the report</text>
<path d="M645.04,305.36 L739.20,305.36 L739.20,402.16" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<text x="652.08" y="293.04" text-anchor="start" font-family="IBM Plex Mono, monospace" font-size="10.12" font-weight="400" fill="var(--ink-soft)">No</text>
</g>
<g class="df-node" data-group="scenario-d" data-order="2">
<rect x="646.80" y="509.52" width="184.80" height="45.76" rx="7.74" fill="var(--tint-coral)" stroke="var(--layer-coral)" stroke-width="1.32"></rect>
<text x="739.20" y="536.01" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.38" font-weight="400" fill="var(--ink)">Redirect report to that store</text>
<path d="M739.20,479.60 L739.20,509.52" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
</g>
<g class="df-node" data-group="scenario-d" data-order="3">
<path d="M739.20,555.28 L739.20,590.48" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<rect x="637.12" y="590.48" width="204.16" height="77.44" rx="7.74" fill="var(--tint-coral)" stroke="var(--layer-coral)" stroke-width="1.32"></rect>
<text x="739.20" y="624.98" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">Confirm store's milestone</text>
<text x="739.20" y="640.82" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">is marked Active</text>
<path d="M739.20,667.92 L739.20,703.12" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<polygon points="739.20,703.12 822.80,754.16 739.20,805.20 655.60,754.16" fill="var(--tint-violet)" stroke="var(--layer-violet)" stroke-width="1.5"></polygon>
<text x="739.20" y="749.94" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">Evidence</text>
<text x="739.20" y="765.78" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">attached?</text>
<text x="746.24" y="822.80" text-anchor="start" font-family="IBM Plex Mono, monospace" font-size="9.68" font-weight="400" fill="var(--ink-soft)">Missing</text>
<path d="M739.20,805.20 L739.20,840.40" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<rect x="642.40" y="840.40" width="193.60" height="58.08" rx="7.74" fill="var(--tint-coral)" stroke="var(--layer-coral)" stroke-width="1.32"></rect>
<text x="739.20" y="865.22" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.38" font-weight="400" fill="var(--ink)">Request evidence —</text>
<text x="739.20" y="880.88" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.38" font-weight="400" fill="var(--ink)">email correct store only</text>
<path d="M739.20,898.48 L739.20,928.40" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<rect x="642.40" y="928.40" width="193.60" height="58.08" rx="7.74" fill="var(--tint-coral)" stroke="var(--layer-coral)" stroke-width="1.32"></rect>
<text x="739.20" y="953.30" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.12" font-weight="400" fill="var(--ink)">Mark linked stores Pending</text>
<text x="739.20" y="968.70" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.12" font-weight="400" fill="var(--ink)">— no emails sent to them</text>
<path d="M739.20,986.48 L739.20,1016.40" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<rect x="655.60" y="1016.40" width="167.20" height="45.76" rx="7.74" fill="var(--tint-coral)" stroke="var(--layer-coral)" stroke-width="1.32"></rect>
<text x="739.20" y="1042.98" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="400" fill="var(--ink)">Wait for response</text>
<path d="M739.20,1062.16 L739.20,1095.60" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<rect x="637.12" y="1095.60" width="204.16" height="47.52" rx="20.91" fill="var(--tint-coral)" stroke="var(--layer-coral)" stroke-width="1.32"></rect>
<text x="739.20" y="1122.97" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.38" font-weight="600" fill="var(--ink)">Accept for correct store</text>
<text x="829.84" y="745.36" text-anchor="start" font-family="IBM Plex Mono, monospace" font-size="9.68" font-weight="400" fill="var(--ink-soft)">Yes</text>
<path d="M822.80,754.16 L871.20,754.16 L871.20,1119.36 L841.28,1119.36" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<path d="M739.20,1143.12 L739.20,1176.56" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<rect x="637.12" y="1176.56" width="204.16" height="58.08" rx="7.74" fill="var(--tint-coral)" stroke="var(--layer-coral)" stroke-width="1.32"></rect>
<text x="739.20" y="1201.38" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.38" font-weight="400" fill="var(--ink)">Sync all linked stores</text>
<text x="739.20" y="1217.04" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.38" font-weight="400" fill="var(--ink)">to Active</text>
<path d="M739.20,1234.64 L739.20,1268.08" fill="none" stroke="var(--ink-faint)" stroke-width="2" marker-end="url(#arrow)"></path>
<rect x="655.60" y="1268.08" width="167.20" height="44.00" rx="19.36" fill="var(--tint-coral)" stroke="var(--layer-coral)" stroke-width="1.32"></rect>
<text x="739.20" y="1293.78" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.56" font-weight="600" fill="var(--ink)">Report closed</text>
</g>
</svg>`;
    $('#decision-diagram').innerHTML = svg;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes = $all('.df-node');
    if (reduce) {
      nodes.forEach(n => n.style.opacity = '1');
    } else {
      nodes.forEach(n => {
        const order = parseInt(n.dataset.order, 10);
        n.style.transitionDelay = `${order * 160}ms`;
      });
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            $('#decision-svg').classList.add('is-in');
            io.disconnect();
          }
        });
      }, { threshold: 0.01 });
      io.observe($('#decision-diagram'));
    }

    // Scenario picker: click a path, trace it through the tree
    const groups = {
      a: ['shared', 'scenario-a'],
      b: ['shared', 'shared2', 'shared3', 'scenario-b'],
      c: ['shared', 'shared2', 'shared3', 'scenario-c'],
      d: ['shared', 'shared2', 'scenario-d']
    };
    $all('.decision-picker button[data-scenario]').forEach(btn => {
      btn.addEventListener('click', () => {
        const already = btn.classList.contains('is-active');
        $all('.decision-picker button[data-scenario]').forEach(b => b.classList.remove('is-active'));
        const svgEl = $('#decision-svg');
        if (already) {
          svgEl.classList.remove('is-filtered');
          nodes.forEach(n => n.classList.remove('is-dim'));
          return;
        }
        btn.classList.add('is-active');
        svgEl.classList.add('is-filtered');
        const active = groups[btn.dataset.scenario];
        nodes.forEach(n => n.classList.toggle('is-dim', !active.includes(n.dataset.group)));
      });
    });

    // Reset: clear the traced path and show the full flow again, no page reload needed
    const resetBtn = $('#decision-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        $all('.decision-picker button[data-scenario]').forEach(b => b.classList.remove('is-active'));
        $('#decision-svg').classList.remove('is-filtered');
        nodes.forEach(n => n.classList.remove('is-dim'));
      });
    }
  }

  /* ---------------------------------------------------------
     ASSISTANT FEATURE — REGIS Assistant + live matching demo
  --------------------------------------------------------- */
  function renderAssistantFeature() {
    const af = CONTENT.assistantFeature;
    $('#af-eyebrow').textContent = af.eyebrow;
    $('#af-title').textContent = af.title;
    $('#af-intro').textContent = af.intro;
    $('#af-body').textContent = af.body;
    $('#af-demo-note').textContent = af.demoNote;

    const statsWrap = $('#af-stats');
    af.stats.forEach(s => {
      const cell = el('div', { className: 'af-stat' });
      cell.innerHTML = `<div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div>`;
      statsWrap.appendChild(cell);
    });

    const chipsWrap = $('#af-chips');
    CONTENT.assistantDemo.chips.forEach(c => {
      const btn = el('button', { type: 'button', textContent: c });
      btn.addEventListener('click', () => runAssistantQuery(c));
      chipsWrap.appendChild(btn);
    });

    showAssistantWelcome();

    $('#af-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('#af-input');
      const val = input.value.trim();
      if (!val) return;
      input.value = '';
      runAssistantQuery(val);
    });

    $('#af-clear').addEventListener('click', () => {
      $('#af-messages').innerHTML = '';
      showAssistantWelcome();
    });
  }

  function showAssistantWelcome() {
    addAssistantMessage("Ask about his role, tools, background or education. Try a suggestion below, or type your own question.", 'bot', { isWelcome: true });
  }

  function buildCascadeHTML(tier, attempted) {
    const labels = { exact: 'Exact', token: 'Token', prefix: 'Prefix', substring: 'Substring', fuzzy: 'Fuzzy' };
    return CASCADE_STAGES.map((stage, i) => {
      let cls = 'is-unreached';
      if (stage === tier) cls = 'is-winner';
      else if (attempted.includes(stage)) cls = 'is-tried';
      const pill = `<span class="af-cascade-stage ${cls}">${labels[stage]}</span>`;
      return i === 0 ? pill : `<span class="af-cascade-arrow">→</span>${pill}`;
    }).join('');
  }

  function addAssistantMessage(text, sender, opts = {}) {
    const wrap = $('#af-messages');
    let scrollToTopOf = null; // for long bot answers, scroll to the START of the message, not the bottom
    if (sender === 'bot' && !opts.isFallback && !opts.isWelcome) {
      const msg = el('div', { className: 'af-msg af-msg-bot af-msg-card' });

      const head = el('div', { className: 'af-card-head' });
      head.innerHTML = '<span>Summary</span>';
      msg.appendChild(head);

      const body = el('div', { className: 'af-card-body' });
      if (opts.list) {
        body.appendChild(el('p', { textContent: text }));
        const ul = el('ul', { className: 'af-card-list' });
        opts.list.forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = item; // authored content — intentional <b> tags for the role names
          ul.appendChild(li);
        });
        body.appendChild(ul);
      } else {
        body.textContent = text;
      }
      msg.appendChild(body);

      if (opts.tier) {
        const cascade = el('div', { className: 'af-cascade' });
        cascade.innerHTML = buildCascadeHTML(opts.tier, opts.attempted || []);
        msg.appendChild(cascade);
        if (opts.tier === 'fuzzy' && opts.runnerUp && opts.margin >= 8) {
          msg.appendChild(el('div', {
            className: 'af-cascade-detail',
            textContent: `Beat "${opts.runnerUp}" by ${opts.margin}%`
          }));
        }

        const feedback = el('div', { className: 'af-feedback' });
        feedback.innerHTML = `
          <span class="af-feedback-label">Helpful?</span>
          <button type="button" class="af-feedback-btn" data-vote="up" aria-label="Helpful">👍</button>
          <button type="button" class="af-feedback-btn" data-vote="down" aria-label="Not helpful">👎</button>`;
        feedback.addEventListener('click', (e) => {
          const btn = e.target.closest('.af-feedback-btn');
          if (!btn) return;
          $all('.af-feedback-btn', feedback).forEach(b => b.classList.remove('is-selected'));
          btn.classList.add('is-selected');
          $('.af-feedback-label', feedback).textContent = btn.dataset.vote === 'up'
            ? 'Thanks, glad that helped.'
            : 'Thanks, noted for improving this answer.';
          $all('.af-feedback-btn', feedback).forEach(b => { b.disabled = true; });
        });
        msg.appendChild(feedback);
      }
      wrap.appendChild(msg);
      // Scroll to show the question that prompted this answer, not just the
      // top of the answer itself — otherwise a long answer scrolls its own
      // preceding question out of view above the visible area.
      const prev = msg.previousElementSibling;
      scrollToTopOf = (prev && prev.classList.contains('af-msg-user')) ? prev : msg;

      if (opts.follow && opts.follow.length) {
        const followWrap = el('div', { className: 'af-follow' });
        followWrap.appendChild(el('span', { className: 'af-follow-label', textContent: 'Ask next:' }));
        opts.follow.forEach(q => {
          const btn = el('button', { type: 'button', textContent: q });
          btn.addEventListener('click', () => runAssistantQuery(q));
          followWrap.appendChild(btn);
        });
        wrap.appendChild(followWrap);
      }
    } else {
      const msg = el('div', {
        className: `af-msg af-msg-${sender}${opts.isFallback ? ' is-fallback' : ''}`,
        textContent: text
      });
      wrap.appendChild(msg);
    }
    // Long answers (like the role list) start below the fold if we scroll straight to the
    // bottom — scroll to the top of the new answer instead so it reads from the start.
    // getBoundingClientRect (not offsetTop) because #af-messages isn't the offsetParent here.
    if (scrollToTopOf) {
      const delta = scrollToTopOf.getBoundingClientRect().top - wrap.getBoundingClientRect().top;
      wrap.scrollTop = Math.max(0, wrap.scrollTop + delta - 4);
    } else {
      wrap.scrollTop = wrap.scrollHeight;
    }
  }

  function runAssistantQuery(query) {
    addAssistantMessage(query, 'user');
    $all('.af-follow').forEach(f => f.remove()); // don't stack stale follow-ups from earlier turns
    const match = findAssistantMatch(query);
    const wrap = $('#af-messages');
    const typing = el('div', { className: 'af-msg af-msg-bot af-typing' });
    typing.innerHTML = '<span></span><span></span><span></span>';
    wrap.appendChild(typing);
    wrap.scrollTop = wrap.scrollHeight;

    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 500 + Math.random() * 350;
    setTimeout(() => {
      typing.remove();
      if (match) {
        addAssistantMessage(match.a, 'bot', {
          tier: match.tier, attempted: match.attempted, list: match.list,
          runnerUp: match.runnerUp, margin: match.margin, follow: match.follow
        });
      } else {
        addAssistantMessage("I couldn't find a good match for that. Try one of the suggestions below, or head to Contact to ask Bilal directly.", 'bot', { isFallback: true });
      }
    }, delay);
  }

  // Hand-implemented Levenshtein edit distance (same shape as the real tool's engine)
  function leven(a, b) {
    const m = [];
    for (let i = 0; i <= b.length; i++) m[i] = [i];
    for (let j = 0; j <= a.length; j++) m[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        m[i][j] = b.charAt(i - 1) === a.charAt(j - 1)
          ? m[i - 1][j - 1]
          : Math.min(m[i - 1][j - 1] + 1, m[i][j - 1] + 1, m[i - 1][j] + 1);
      }
    }
    return m[b.length][a.length];
  }

  function similarity(a, b) {
    const dist = leven(a, b);
    const maxLen = Math.max(a.length, b.length) || 1;
    return 1 - dist / maxLen;
  }

  const STOPWORDS = new Set(['is','he','to','a','an','the','of','do','does','what','are','you','i','in','on','for',
    'and','or','his','him','about','can','could','would','will','has','have','had','it','this','that','with',
    'me','my','so','be','was','were','how','who']);

  function tokenize(str) {
    return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
      .filter(t => t.length > 1 && !STOPWORDS.has(t));
  }

  function tokenSimilarity(t1, t2) {
    if (t1 === t2) return 1;
    const minLen = Math.min(t1.length, t2.length);
    // Containment bonus only applies to tokens with enough length to be meaningful —
    // short tokens (e.g. "ai") are trivial substrings of unrelated words (e.g. "email").
    if (minLen >= 3 && (t1.includes(t2) || t2.includes(t1))) return 0.9;
    return similarity(t1, t2);
  }

  // Genuine 5-stage cascade, matching the real tool's architecture described on this page:
  // exact -> token -> prefix -> substring -> fuzzy (Levenshtein). Each stage is actually
  // attempted in order — the cascade UI reflects real pass/fail per stage, not a label.
  const CASCADE_STAGES = ['exact', 'token', 'prefix', 'substring', 'fuzzy'];

  function findAssistantMatch(query) {
    const qa = CONTENT.assistantDemo.qa;
    const qRaw = query.toLowerCase().trim();
    if (!qRaw) return null;
    const attempted = [];

    // Stage 1 — exact: the query is verbatim the question or a listed keyword.
    for (const item of qa) {
      if (item.q.toLowerCase() === qRaw || item.k.includes(qRaw)) {
        return { ...item, tier: 'exact', attempted };
      }
    }
    attempted.push('exact');

    const qTokens = tokenize(qRaw);
    const termSets = qa.map(item => {
      const kwTokens = new Set();
      item.k.forEach(kw => tokenize(kw).forEach(t => kwTokens.add(t)));
      tokenize(item.q).forEach(t => kwTokens.add(t));
      return { item, kwTokens, terms: [item.q.toLowerCase(), ...item.k] };
    });

    // Stage 2 — token: every query token exactly matches a known token (any order).
    if (qTokens.length) {
      for (const { item, kwTokens } of termSets) {
        if (qTokens.every(t => kwTokens.has(t))) {
          return { ...item, tier: 'token', attempted };
        }
      }
    }
    attempted.push('token');

    // Stage 3 — prefix: the query starts a known phrase, or a known phrase starts the query.
    for (const { item, terms } of termSets) {
      if (terms.some(t => t.length > 3 && (t.startsWith(qRaw) || qRaw.startsWith(t)))) {
        return { ...item, tier: 'prefix', attempted };
      }
    }
    attempted.push('prefix');

    // Stage 4 — substring: the query appears inside a known phrase, or vice versa.
    if (qRaw.length >= 4) {
      for (const { item, terms } of termSets) {
        if (terms.some(t => t.length > 3 && (t.includes(qRaw) || qRaw.includes(t)))) {
          return { ...item, tier: 'substring', attempted };
        }
      }
    }
    attempted.push('substring');

    // Stage 5 — fuzzy: hand-tuned Levenshtein-based token scoring, with a runner-up
    // tracked so the UI can show the margin the winner beat the field by.
    if (qTokens.length === 0) return null;
    let best = null, bestScore = 0, runnerUp = null, runnerUpScore = 0;
    for (const { item, kwTokens } of termSets) {
      let matched = 0;
      for (const qt of qTokens) {
        let bestTokScore = 0;
        for (const kt of kwTokens) {
          const s = tokenSimilarity(qt, kt);
          if (s > bestTokScore) bestTokScore = s;
        }
        if (bestTokScore >= 0.72) matched += 1;
      }
      const score = matched / qTokens.length;
      if (score > bestScore) {
        runnerUp = best; runnerUpScore = bestScore;
        bestScore = score; best = item;
      } else if (score > runnerUpScore && item !== best) {
        runnerUp = item; runnerUpScore = score;
      }
    }
    if (!best || bestScore < 0.5) return null;
    return {
      ...best, tier: 'fuzzy', attempted,
      runnerUp: runnerUp ? runnerUp.q : null,
      margin: runnerUp ? Math.round((bestScore - runnerUpScore) * 100) : null
    };
  }

  /* ---------------------------------------------------------
     PROJECTS
  --------------------------------------------------------- */
  /* ---------------------------------------------------------
     DEMO COMPLETION FLOURISH — shared by all 6 live demos below:
     a brief glow on the result plus a small "Done" chip next to
     the demo's own action buttons.
  --------------------------------------------------------- */
  function markDemoDone(card) {
    const demo = $('.rc-demo', card);
    const resetBtn = $('.rc-reset-btn', card);
    if (!demo || !resetBtn) return;
    demo.classList.add('is-done');
    let chip = $('.rc-done-chip', demo);
    if (!chip) {
      chip = el('span', { className: 'rc-done-chip' });
      chip.innerHTML = `<span aria-hidden="true">✓</span> Done`;
      resetBtn.insertAdjacentElement('afterend', chip);
    }
    requestAnimationFrame(() => chip.classList.add('is-visible'));
  }
  function clearDemoDone(card) {
    const demo = $('.rc-demo', card);
    if (!demo) return;
    demo.classList.remove('is-done');
    const chip = $('.rc-done-chip', demo);
    if (chip) chip.remove();
  }

  /* ---------------------------------------------------------
     RESEARCH DATA COMBINER — live demo
     Same matching logic as the real Shiny app (normalise headers,
     check a list of likely email-column spellings, dedupe by email),
     ported to JS and run on a small made-up dataset, entirely client-side.
  --------------------------------------------------------- */
  const RC_FILES = [
    {
      name: 'conference_signup.csv',
      headers: ['Name', 'Email', 'Organisation'],
      rows: [
        ['Jamie Cole', 'jamie.cole@example.org', 'Southern Health Network'],
        ['Priya Nair', 'priya.nair@example.org', 'Coastal Research Institute'],
        ['Tom Reid', 'tom.reid@example.org', 'Southern Health Network']
      ]
    },
    {
      name: 'newsletter_export.xlsx',
      headers: ['Name', 'Email Address', 'Dept'],
      rows: [
        ['Jamie Cole', 'jamie.cole@example.org', ''],
        ['Alex Wren', 'alex.wren@example.org', 'Public Health'],
        ['Sam Ito', 'sam.ito@example.org', 'Research Governance']
      ]
    },
    {
      name: 'meeting_notes.csv',
      headers: ['Name', 'E-mail', 'Notes'],
      rows: [
        ['Priya Nair', 'priya.nair@example.org', ''],
        ['Morgan Blake', 'morgan.blake@example.org', 'Follow up next quarter'],
        ['Sam Ito', 'sam.ito@example.org', '']
      ]
    }
  ];
  const RC_EMAIL_ALIASES = ['email', 'email_address', 'e_mail', 'email_addr'];
  const RC_COLUMNS = ['Name', 'Email', 'Organisation', 'Dept', 'Notes'];

  function rcNormalize(h) {
    return h.toLowerCase().replace(/[\s-]+/g, '_');
  }

  function rcFindEmailCol(headers) {
    const normalized = headers.map(rcNormalize);
    for (const alias of RC_EMAIL_ALIASES) {
      const idx = normalized.indexOf(alias);
      if (idx !== -1) return idx;
    }
    return -1;
  }

  function researchDemoHTML() {
    const fileCards = RC_FILES.map(f => `
      <div class="rc-file">
        <div class="rc-file-name">${f.name}</div>
        <table class="rc-table">
          <thead><tr>${f.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>${f.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>`).join('');
    return `
      <div class="rc-demo">
        <div class="rc-demo-label">A scaled-down illustration of the matching logic (not the full app), ported to JS and run here on made-up sample data</div>
        <div class="rc-files">${fileCards}</div>
        <div class="rc-demo-actions">
          <button type="button" class="rc-combine-btn">Combine &amp; Deduplicate →</button>
          <button type="button" class="rc-reset-btn" hidden>↺ Reset</button>
        </div>
        <div class="rc-log" id="rc-log"></div>
        <div class="rc-result" id="rc-result"></div>
      </div>`;
  }

  function wireResearchDemo(card) {
    const btn = $('.rc-combine-btn', card);
    const resetBtn = $('.rc-reset-btn', card);
    const logEl = $('#rc-log', card);
    const resultEl = $('#rc-result', card);
    if (!btn) return;

    resetBtn.addEventListener('click', () => {
      logEl.innerHTML = '';
      resultEl.innerHTML = '';
      resetBtn.hidden = true;
      btn.disabled = false;
      clearDemoDone(card);
    });

    btn.addEventListener('click', () => {
      btn.disabled = true;
      resetBtn.hidden = true;
      logEl.innerHTML = '';
      resultEl.innerHTML = '';

      const matches = RC_FILES.map(f => {
        const idx = rcFindEmailCol(f.headers);
        return { file: f.name, matchedHeader: idx !== -1 ? f.headers[idx] : null, idx };
      });

      const allRows = [];
      RC_FILES.forEach((f, fi) => {
        const emailIdx = matches[fi].idx;
        f.rows.forEach(row => {
          const obj = {};
          f.headers.forEach((h, i) => {
            const key = (i === emailIdx) ? 'Email' : h;
            obj[key] = row[i];
          });
          allRows.push(obj);
        });
      });

      const seen = new Set();
      const deduped = [];
      let dupCount = 0;
      allRows.forEach(row => {
        const email = (row.Email || '').toLowerCase();
        if (seen.has(email)) { dupCount++; return; }
        seen.add(email);
        deduped.push(row);
      });

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const stepDelay = reduce ? 0 : 320;

      matches.forEach((m, i) => {
        setTimeout(() => {
          const line = el('div', { className: 'rc-log-line' });
          line.innerHTML = m.matchedHeader
            ? `<span class="rc-log-file">${m.file}</span>: matched <b>"${m.matchedHeader}"</b> as the email column`
            : `<span class="rc-log-file">${m.file}</span>: no email column found`;
          logEl.appendChild(line);
        }, i * stepDelay);
      });

      setTimeout(() => {
        const summary = el('div', { className: 'rc-log-line rc-log-summary' });
        summary.textContent = `${allRows.length} rows combined, ${dupCount} duplicate${dupCount === 1 ? '' : 's'} removed, ${deduped.length} unique contacts`;
        logEl.appendChild(summary);

        const table = el('table', { className: 'rc-table rc-result-table' });
        table.innerHTML = `
          <thead><tr>${RC_COLUMNS.map(c => `<th>${c}</th>`).join('')}</tr></thead>
          <tbody>${deduped.map(row => `<tr>${RC_COLUMNS.map(c => `<td>${row[c] || ''}</td>`).join('')}</tr>`).join('')}</tbody>`;
        resultEl.appendChild(table);
        btn.disabled = false;
        resetBtn.hidden = false;
        markDemoDone(card);
      }, matches.length * stepDelay + 200);
    });
  }

  /* ---------------------------------------------------------
     ANNUAL REPORT RECONCILIATION — live demo
     Same four-category sorting logic as the real tool, ported to JS,
     run on a small made-up dataset, entirely client-side.
  --------------------------------------------------------- */
  const AR_TEAMS = [
    { id: 'STE-1042', status: 'Received' },
    { id: 'STE-1077', status: 'Not Submitted' },
    { id: 'STE-1090', status: 'Not Submitted' }
  ];
  const AR_REGIS = [
    { id: 'STE-1042', due: '15 Mar 2026' },
    { id: 'STE-1077', due: '15 Mar 2026' },
    { id: 'STE-2003', due: '01 Apr 2026' }
  ];
  const AR_CATEGORIES = [
    { key: 'c1', label: 'Marked received on Teams, missing from REGIS', color: 'gold' },
    { key: 'c2', label: 'On REGIS, absent from Teams', color: 'coral' },
    { key: 'c3', label: 'Genuine overdue: confirmed by both', color: 'pink' },
    { key: 'c4', label: 'Stale Teams flag: already resolved in REGIS', color: 'teal' }
  ];

  function arDemoHTML() {
    const teamsTable = `
      <div class="rc-file">
        <div class="rc-file-name">teams_tracking_sheet.xlsx</div>
        <table class="rc-table">
          <thead><tr><th>Project ID</th><th>Status</th></tr></thead>
          <tbody>${AR_TEAMS.map(t => `<tr><td>${t.id}</td><td>${t.status}</td></tr>`).join('')}</tbody>
        </table>
      </div>`;
    const regisTable = `
      <div class="rc-file">
        <div class="rc-file-name">regis_overdue_export.xlsx</div>
        <table class="rc-table">
          <thead><tr><th>Project ID</th><th>Due Date</th></tr></thead>
          <tbody>${AR_REGIS.map(r => `<tr><td>${r.id}</td><td>${r.due}</td></tr>`).join('')}</tbody>
        </table>
      </div>`;
    return `
      <div class="rc-demo">
        <div class="rc-demo-label">A scaled-down illustration of the four-category sorting logic (not the full tool), ported to JS and run here on made-up sample data</div>
        <div class="rc-files">${teamsTable}${regisTable}</div>
        <div class="rc-demo-actions">
          <button type="button" class="ar-reconcile-btn">Reconcile →</button>
          <button type="button" class="rc-reset-btn" hidden>↺ Reset</button>
        </div>
        <div class="ar-result" id="ar-result"></div>
      </div>`;
  }

  function arRunReconcile() {
    const teamsById = new Map(AR_TEAMS.map(t => [t.id, t]));
    const regisById = new Map(AR_REGIS.map(r => [r.id, r]));
    const buckets = { c1: [], c2: [], c3: [], c4: [] };

    AR_REGIS.forEach(r => {
      const t = teamsById.get(r.id);
      if (!t) {
        buckets.c2.push(`${r.id}: on REGIS (due ${r.due}), but never appears on the Teams sheet`);
      } else if (t.status === 'Received') {
        buckets.c1.push(`${r.id}: Teams shows Received, but REGIS still lists it overdue (due ${r.due})`);
      } else {
        buckets.c3.push(`${r.id}: Not Submitted on Teams, and REGIS confirms it's overdue (due ${r.due})`);
      }
    });

    AR_TEAMS.forEach(t => {
      if (t.status === 'Not Submitted' && !regisById.has(t.id)) {
        buckets.c4.push(`${t.id}: Not Submitted on Teams, but REGIS doesn't flag it overdue, likely already resolved`);
      }
    });

    return buckets;
  }

  function wireArDemo(card) {
    const btn = $('.ar-reconcile-btn', card);
    const resultEl = $('#ar-result', card);
    if (!btn) return;

    const arResetBtn = $('.rc-reset-btn', card);

    arResetBtn.addEventListener('click', () => {
      resultEl.innerHTML = '';
      arResetBtn.hidden = true;
      btn.disabled = false;
      clearDemoDone(card);
    });

    btn.addEventListener('click', () => {
      btn.disabled = true;
      arResetBtn.hidden = true;
      resultEl.innerHTML = '';

      const buckets = arRunReconcile();
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const stepDelay = reduce ? 0 : 260;

      AR_CATEGORIES.forEach((cat, i) => {
        setTimeout(() => {
          const items = buckets[cat.key];
          const group = el('div', { className: 'ar-cat' });
          group.style.setProperty('--cat-color', `var(--layer-${cat.color})`);
          group.style.setProperty('--cat-color-text', `var(--layer-${cat.color}-text)`);
          group.style.setProperty('--cat-tint', `var(--tint-${cat.color})`);
          group.innerHTML = `
            <div class="ar-cat-label">${cat.label}</div>
            ${items.length
              ? items.map(txt => `<div class="ar-cat-item">${txt}</div>`).join('')
              : `<div class="ar-cat-item ar-cat-empty">No projects in this category</div>`}`;
          resultEl.appendChild(group);
          if (i === AR_CATEGORIES.length - 1) {
            btn.disabled = false;
            arResetBtn.hidden = false;
            markDemoDone(card);
          }
        }, i * stepDelay);
      });
    });
  }

  /* ---------------------------------------------------------
     WEEKLY REPORT GENERATOR — live demo
     Same date-range presets and five-check logic as the real tool,
     ported to JS, run on a small made-up dataset that's always
     relative to today (not hardcoded dates), entirely client-side.
  --------------------------------------------------------- */
  function wrDaysAgo(n) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - n);
    return d;
  }
  function wrFormatDate(d) {
    return d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  const WR_PROJECTS = [
    { id: 'STE-3001', date: wrDaysAgo(3),   studyType: 'Clinical trial', ctPhase: 'Phase II', ethics: 'Reviewed', hod: 'Confirmed', sponsorType: 'Commercial entity' },
    { id: 'STE-3002', date: wrDaysAgo(5),   studyType: 'Health Research', ctPhase: '', ethics: '', hod: 'Confirmed', sponsorType: 'Collaborative group' },
    { id: 'STE-3003', date: wrDaysAgo(15),  studyType: '', ctPhase: '', ethics: 'Reviewed', hod: 'Confirmed', sponsorType: 'Collaborative group' },
    { id: 'STE-3004', date: wrDaysAgo(22),  studyType: 'Clinical trial', ctPhase: '', ethics: 'Reviewed', hod: 'Confirmed', sponsorType: 'Commercial entity' },
    { id: 'STE-3005', date: wrDaysAgo(45),  studyType: 'Health Research', ctPhase: '', ethics: 'Reviewed', hod: '', sponsorType: 'Collaborative group' },
    { id: 'STE-3006', date: wrDaysAgo(60),  studyType: 'Clinical trial', ctPhase: 'Phase I', ethics: 'Reviewed', hod: 'Confirmed', sponsorType: 'Institution/Investigator-initiated', sponsor: 'Dr. A. Whitfield' },
    { id: 'STE-3007', date: wrDaysAgo(100), studyType: 'Health Research', ctPhase: '', ethics: 'Reviewed', hod: 'Confirmed', sponsorType: 'Collaborative group' },
    { id: 'STE-3008', date: wrDaysAgo(210), studyType: 'Health Research', ctPhase: '', ethics: '', hod: 'Confirmed', sponsorType: 'Collaborative group' }
  ];
  const WR_PRESETS = [
    { key: '7', label: 'Last 7 days' },
    { key: '30', label: 'Last 30 days' },
    { key: 'month', label: 'This month' },
    { key: 'ytd', label: 'Year to date' }
  ];

  function wrRangeFor(key) {
    const today = wrDaysAgo(0);
    if (key === '7') return wrDaysAgo(7);
    if (key === '30') return wrDaysAgo(30);
    if (key === 'month') return new Date(today.getFullYear(), today.getMonth(), 1);
    if (key === 'ytd') return new Date(today.getFullYear(), 0, 1);
    return wrDaysAgo(0);
  }

  function wrDemoHTML() {
    const rows = WR_PROJECTS.map(p => `<tr data-id="${p.id}"><td>${p.id}</td><td>${wrFormatDate(p.date)}</td></tr>`).join('');
    return `
      <div class="rc-demo">
        <div class="rc-demo-label">A scaled-down illustration of the date-range and five-check logic (not the full tool), ported to JS and run here on made-up sample data</div>
        <div class="rc-file" style="max-width:320px;">
          <div class="rc-file-name">all_authorised_projects.xlsx</div>
          <table class="rc-table"><thead><tr><th>Project ID</th><th>Date Authorised</th></tr></thead><tbody>${rows}</tbody></table>
        </div>
        <div class="wr-presets">${WR_PRESETS.map((p, i) => `<button type="button" class="wr-preset-btn" data-key="${p.key}">${p.label}</button>`).join('')}
          <button type="button" class="rc-reset-btn" hidden>↺ Reset</button>
        </div>
        <div class="wr-result" id="wr-result"></div>
      </div>`;
  }

  function wireWeeklyDemo(card) {
    const buttons = $all('.wr-preset-btn', card);
    const resetBtn = $('.rc-reset-btn', card);
    const resultEl = $('#wr-result', card);
    if (!buttons.length) return;

    resetBtn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('is-active'));
      resultEl.innerHTML = '';
      resetBtn.hidden = true;
      clearDemoDone(card);
    });

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        resetBtn.hidden = false;

        const rangeStart = wrRangeFor(btn.dataset.key);
        const inRange = WR_PROJECTS.filter(p => p.date >= rangeStart);

        const checks = {
          ethics: inRange.filter(p => !p.ethics).length,
          studyType: inRange.filter(p => !p.studyType).length,
          ctPhase: inRange.filter(p => p.studyType === 'Clinical trial' && !p.ctPhase).length,
          hod: inRange.filter(p => !p.hod).length,
          investigator: inRange.filter(p => p.sponsorType === 'Institution/Investigator-initiated').length
        };

        const rowsHTML = inRange.length
          ? inRange.map(p => {
              const flags = [];
              if (!p.ethics) flags.push('missing ethics pathway');
              if (!p.studyType) flags.push('missing study type');
              if (p.studyType === 'Clinical trial' && !p.ctPhase) flags.push('missing CT phase');
              if (!p.hod) flags.push('missing HOD sign-off');
              if (p.sponsorType === 'Institution/Investigator-initiated') flags.push(`investigator-initiated, sponsor: ${p.sponsor}`);
              return `<tr><td>${p.id}</td><td>${wrFormatDate(p.date)}</td><td>${flags.length ? flags.join('; ') : 'Complete'}</td></tr>`;
            }).join('')
          : `<tr><td colspan="3" style="color:var(--ink-faint);font-style:italic;">No authorised projects in this range</td></tr>`;

        resultEl.innerHTML = `
          <div class="wr-summary">${inRange.length} project${inRange.length === 1 ? '' : 's'} in range, ${checks.ethics} missing ethics pathway, ${checks.studyType} missing study type, ${checks.ctPhase} missing CT phase, ${checks.hod} missing HOD sign-off, ${checks.investigator} investigator-initiated</div>
          <table class="rc-table wr-result-table">
            <thead><tr><th>Project ID</th><th>Date Authorised</th><th>Check result</th></tr></thead>
            <tbody>${rowsHTML}</tbody>
          </table>`;
        markDemoDone(card);
      });
    });
  }

  /* ---------------------------------------------------------
     TAS FORM EXTRACTOR — live demo
     Same checkbox-detection and boilerplate-filtering logic as the
     real R / VBA tool, ported to JS, run here on two made-up
     completed forms, entirely client-side.
  --------------------------------------------------------- */
  const FE_FORMS = [
    {
      file: 'progress_report_STE-4021.docx',
      ref: 'STE-4021',
      checklistQ: 'Progress against approved protocol',
      options: ['Completed as planned', 'Partially completed: see comments', 'Not yet commenced', 'Discontinued'],
      checked: 1,
      boiler: 'Tick one box only. Refer to the TAS Health Research Governance Guide if unsure.',
      devQ: 'Protocol deviations to report?',
      devA: 'None'
    },
    {
      file: 'progress_report_STE-4118.docx',
      ref: 'STE-4118',
      checklistQ: 'Progress against approved protocol',
      options: ['Completed as planned', 'Partially completed: see comments', 'Not yet commenced', 'Discontinued'],
      checked: 0,
      boiler: 'Tick one box only. Refer to the TAS Health Research Governance Guide if unsure.',
      devQ: 'Protocol deviations to report?',
      devA: 'One minor deviation, reported to HREC 03 Feb 2026'
    }
  ];

  function feDemoHTML() {
    const formCards = FE_FORMS.map(f => `
      <div class="fe-form">
        <div class="fe-form-name">${f.file}</div>
        <div class="fe-qlabel">Project Reference</div>
        <div class="fe-answer">${f.ref}</div>
        <div class="fe-qlabel">${f.checklistQ}</div>
        <div class="fe-checklist">${f.options.map((o, i) => `<div class="fe-check-row${i === f.checked ? ' is-checked' : ''}">${i === f.checked ? '☑' : '☐'} ${o}</div>`).join('')}</div>
        <div class="fe-boiler">${f.boiler}</div>
        <div class="fe-qlabel">${f.devQ}</div>
        <div class="fe-answer">${f.devA}</div>
      </div>`).join('');
    return `
      <div class="rc-demo">
        <div class="rc-demo-label">A scaled-down illustration of the checkbox-detection and boilerplate-filtering logic (not the full tool), ported to JS and run here on made-up sample forms</div>
        <div class="rc-files">${formCards}</div>
        <div class="rc-demo-actions">
          <button type="button" class="fe-extract-btn">Extract →</button>
          <button type="button" class="rc-reset-btn" hidden>↺ Reset</button>
        </div>
        <div class="rc-log" id="fe-log"></div>
        <div class="rc-result" id="fe-result"></div>
      </div>`;
  }

  function wireFeDemo(card) {
    const btn = $('.fe-extract-btn', card);
    const resetBtn = $('.rc-reset-btn', card);
    const logEl = $('#fe-log', card);
    const resultEl = $('#fe-result', card);
    if (!btn) return;

    resetBtn.addEventListener('click', () => {
      logEl.innerHTML = '';
      resultEl.innerHTML = '';
      resetBtn.hidden = true;
      btn.disabled = false;
      clearDemoDone(card);
    });

    btn.addEventListener('click', () => {
      btn.disabled = true;
      resetBtn.hidden = true;
      logEl.innerHTML = '';
      resultEl.innerHTML = '';

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const stepDelay = reduce ? 0 : 340;

      FE_FORMS.forEach((f, i) => {
        setTimeout(() => {
          const line = el('div', { className: 'rc-log-line' });
          line.innerHTML = `<span class="rc-log-file">${f.file}</span>: checkbox matched <b>"${f.options[f.checked]}"</b>, 1 boilerplate line filtered`;
          logEl.appendChild(line);
        }, i * stepDelay);
      });

      setTimeout(() => {
        const summary = el('div', { className: 'rc-log-line rc-log-summary' });
        summary.textContent = `${FE_FORMS.length} forms processed, ${FE_FORMS.length} checkboxes resolved, ${FE_FORMS.length} boilerplate lines filtered, ${FE_FORMS.length} rows extracted`;
        logEl.appendChild(summary);

        const table = el('table', { className: 'rc-table rc-result-table' });
        table.innerHTML = `
          <thead><tr><th>Project Reference</th><th>Progress Status</th><th>Deviations Reported</th></tr></thead>
          <tbody>${FE_FORMS.map(f => `<tr><td>${f.ref}</td><td>${f.options[f.checked]}</td><td>${f.devA}</td></tr>`).join('')}</tbody>`;
        resultEl.appendChild(table);
        btn.disabled = false;
        resetBtn.hidden = false;
        markDemoDone(card);
      }, FE_FORMS.length * stepDelay + 200);
    });
  }

  /* ---------------------------------------------------------
     APPLICATION STATUS SYNC — live demo
     Same upsert-by-Application-ID logic as the real Power Automate
     flow, ported to JS, run here on three made-up source tables,
     entirely client-side.
  --------------------------------------------------------- */
  const SP_TABLES = [
    { file: 'eligible_for_review.xlsx', stage: 'Pre Authorised',
      rows: [ { id: 'APP-1042', name: 'J. Carter' }, { id: 'APP-1077', name: 'R. Nguyen' } ] },
    { file: 'authorised_applications.xlsx', stage: 'Authorised Projects & Amendments',
      rows: [ { id: 'APP-1042', name: 'J. Carter' }, { id: 'APP-1090', name: 'S. Okafor' } ] },
    { file: 'post_authorised.xlsx', stage: 'Post Authorised',
      rows: [ { id: 'APP-1077', name: 'R. Nguyen' }, { id: 'APP-1123', name: 'M. Diaz' } ] }
  ];

  function spDemoHTML() {
    const fileCards = SP_TABLES.map(t => `
      <div class="rc-file">
        <div class="rc-file-name">${t.file}</div>
        <table class="rc-table">
          <thead><tr><th>Application ID</th><th>Applicant</th></tr></thead>
          <tbody>${t.rows.map(r => `<tr><td>${r.id}</td><td>${r.name}</td></tr>`).join('')}</tbody>
        </table>
      </div>`).join('');
    const columns = SP_TABLES.map(t => t.stage);
    const boardCols = columns.map((stage, i) => `
      <div class="sp-col">
        <div class="sp-col-header">${stage}</div>
        <div class="sp-col-cards" id="sp-col-${i}"></div>
      </div>`).join('');
    return `
      <div class="rc-demo">
        <div class="rc-demo-label">A scaled-down illustration of the upsert-by-Application-ID logic (not the full flow), ported to JS and run here on made-up sample tables</div>
        <div class="rc-files">${fileCards}</div>
        <div class="rc-demo-actions">
          <button type="button" class="sp-sync-btn">Run Sync →</button>
          <button type="button" class="rc-reset-btn" hidden>↺ Reset</button>
        </div>
        <div class="sp-status" id="sp-status">SharePoint list: empty</div>
        <div class="sp-board" id="sp-board">${boardCols}</div>
      </div>`;
  }

  function wireSpDemo(card) {
    const btn = $('.sp-sync-btn', card);
    const resetBtn = $('.rc-reset-btn', card);
    const statusEl = $('#sp-status', card);
    const board = $('#sp-board', card);
    if (!btn) return;

    const columns = SP_TABLES.map(t => t.stage);
    const colEls = columns.map((_, i) => $(`#sp-col-${i}`, card));

    resetBtn.addEventListener('click', () => {
      colEls.forEach(c => { c.innerHTML = ''; });
      statusEl.textContent = 'SharePoint list: empty';
      resetBtn.hidden = true;
      btn.disabled = false;
      clearDemoDone(card);
    });

    btn.addEventListener('click', () => {
      btn.disabled = true;
      resetBtn.hidden = true;
      colEls.forEach(c => { c.innerHTML = ''; });

      const cardEls = new Map(); // Application ID -> card element
      const actions = []; // { file, id, name, stage, created }
      const seen = new Map();

      SP_TABLES.forEach(t => {
        t.rows.forEach(r => {
          const created = !seen.has(r.id);
          seen.set(r.id, t.stage);
          actions.push({ file: t.file, id: r.id, name: r.name, stage: t.stage, created });
        });
      });

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const stepDelay = reduce ? 0 : 700;
      const moveDelay = reduce ? 0 : 240;

      function flash(cardEl) {
        cardEl.classList.add('sp-flash');
        setTimeout(() => cardEl.classList.remove('sp-flash'), reduce ? 0 : 550);
      }

      actions.forEach((a, i) => {
        setTimeout(() => {
          statusEl.textContent = a.created
            ? `${a.file} → ${a.id}: not found in SharePoint, creating in ${a.stage}`
            : `${a.file} → ${a.id}: found in SharePoint, moving to ${a.stage}`;
          const targetCol = colEls[columns.indexOf(a.stage)];

          if (a.created) {
            const cardEl = el('div', { className: 'sp-card sp-fade-in' });
            cardEl.innerHTML = `<span class="sp-card-id">${a.id}</span><span class="sp-card-name">${a.name}</span>`;
            targetCol.appendChild(cardEl);
            cardEls.set(a.id, cardEl);
            requestAnimationFrame(() => requestAnimationFrame(() => {
              cardEl.classList.remove('sp-fade-in');
              flash(cardEl);
            }));
          } else {
            const cardEl = cardEls.get(a.id);
            cardEl.classList.add('sp-fade-out');
            setTimeout(() => {
              cardEl.classList.remove('sp-fade-out');
              cardEl.classList.add('sp-fade-in');
              targetCol.appendChild(cardEl);
              requestAnimationFrame(() => requestAnimationFrame(() => {
                cardEl.classList.remove('sp-fade-in');
                flash(cardEl);
              }));
            }, moveDelay);
          }
        }, i * stepDelay);
      });

      setTimeout(() => {
        const created = actions.filter(a => a.created).length;
        const updated = actions.length - created;
        statusEl.textContent = `${actions.length} rows processed across ${SP_TABLES.length} tables, ${created} item${created === 1 ? '' : 's'} created, ${updated} updated, ${seen.size} items now in SharePoint`;
        btn.disabled = false;
        resetBtn.hidden = false;
        markDemoDone(card);
      }, actions.length * stepDelay + moveDelay + 400);
    });
  }

  /* ---------------------------------------------------------
     APPLICATION EMAIL LOG — live demo
     Small illustration of the log-and-lookup concept: pick an
     application, see every email logged against it, log a new
     one — entirely client-side on made-up sample data.
  --------------------------------------------------------- */
  const EL_APPS_SEED = [
    { id: 'APP-2210', applicant: 'J. Whitfield', emails: [
        { date: '14 Feb 2026', text: 'Requested an update on ethics review timing.' },
        { date: '02 Feb 2026', text: 'Submitted amended participant information sheet.' }
      ] },
    { id: 'APP-2264', applicant: 'R. Patel', emails: [
        { date: '20 Jan 2026', text: 'Confirmed site delegation log received.' }
      ] },
    { id: 'APP-2310', applicant: 'M. Sato', emails: [] }
  ];

  function elDemoHTML() {
    return `
      <div class="rc-demo">
        <div class="rc-demo-label">A scaled-down illustration of the log-and-lookup concept (not the full app), run here on made-up sample data</div>
        <div class="el-layout">
          <div class="el-gallery" id="el-gallery" role="listbox" aria-label="Applications"></div>
          <div class="el-detail">
            <div class="el-detail-header" id="el-detail-header"></div>
            <div class="el-history" id="el-history"></div>
            <form class="el-form" id="el-form">
              <input type="text" class="el-input" id="el-input" placeholder="Log a new email note…" aria-label="Log a new email note" autocomplete="off">
              <button type="submit" class="el-log-btn">Log email</button>
            </form>
          </div>
        </div>
        <div class="rc-demo-actions" style="margin-top:12px;">
          <button type="button" class="rc-reset-btn" hidden>↺ Reset</button>
        </div>
      </div>`;
  }

  function wireElDemo(card) {
    const gallery = $('#el-gallery', card);
    const detailHeader = $('#el-detail-header', card);
    const historyEl = $('#el-history', card);
    const form = $('#el-form', card);
    const input = $('#el-input', card);
    const resetBtn = $('.rc-reset-btn', card);
    if (!gallery) return;

    // Work off a deep clone so edits made during this demo session don't
    // persist across a reopen, and Reset can cleanly restore the seed.
    let apps = EL_APPS_SEED.map(a => ({ ...a, emails: a.emails.map(e => ({ ...e })) }));
    let activeId = apps[0].id;

    function renderGallery() {
      gallery.innerHTML = apps.map(a => `
        <button type="button" class="el-gallery-item${a.id === activeId ? ' is-active' : ''}" data-id="${a.id}" role="option" aria-selected="${a.id === activeId}">
          <span class="el-gallery-id">${escapeHtml(a.id)}</span>
          <span class="el-gallery-name">${escapeHtml(a.applicant)}</span>
          <span class="el-gallery-count">${a.emails.length ? a.emails.length + ' email' + (a.emails.length === 1 ? '' : 's') : 'No emails'}</span>
        </button>`).join('');
      $all('.el-gallery-item', gallery).forEach(btn => {
        btn.addEventListener('click', () => {
          activeId = btn.dataset.id;
          renderGallery();
          renderDetail();
        });
      });
    }

    function renderDetail() {
      const app = apps.find(a => a.id === activeId);
      detailHeader.innerHTML = `<span class="el-detail-id">${escapeHtml(app.id)}</span><span class="el-detail-name">${escapeHtml(app.applicant)}</span>`;
      if (!app.emails.length) {
        historyEl.innerHTML = `<p class="el-empty">No emails logged yet for ${escapeHtml(app.id)}.</p>`;
        return;
      }
      historyEl.innerHTML = app.emails.map(e => `
        <div class="el-entry">
          <span class="el-entry-date">${escapeHtml(e.date)}</span>
          <span class="el-entry-text">${escapeHtml(e.text)}</span>
        </div>`).join('');
    }

    renderGallery();
    renderDetail();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      const app = apps.find(a => a.id === activeId);
      app.emails.unshift({ date: 'Just now', text });
      input.value = '';
      renderGallery();
      renderDetail();

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const first = $('.el-entry', historyEl);
      if (first && !reduce) {
        first.classList.add('el-fade-in');
        requestAnimationFrame(() => requestAnimationFrame(() => first.classList.remove('el-fade-in')));
      }

      resetBtn.hidden = false;
      markDemoDone(card);
    });

    resetBtn.addEventListener('click', () => {
      apps = EL_APPS_SEED.map(a => ({ ...a, emails: a.emails.map(e => ({ ...e })) }));
      activeId = EL_APPS_SEED[0].id;
      renderGallery();
      renderDetail();
      resetBtn.hidden = true;
      clearDemoDone(card);
    });
  }


  /* ---------------------------------------------------------
     REGIS EXECUTIVE DASHBOARDS — sample visual mockup (static, not interactive)
     Illustrates the report's visual style — KPI card, trend chart, register table —
     with entirely fabricated numbers. No real data, no screenshots.
  --------------------------------------------------------- */
  function dashboardFlowHTML() {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const days = [120, 92, 74, 58]; // fabricated, illustrative only
    const maxDay = 130;
    const chartW = 280, chartH = 120, padL = 28, padB = 20, padT = 10;
    const plotW = chartW - padL - 8, plotH = chartH - padB - padT;
    const pts = days.map((d, i) => {
      const x = padL + (i / (days.length - 1)) * plotW;
      const y = padT + (1 - d / maxDay) * plotH;
      return { x, y, d };
    });
    const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const gridLines = [0, 0.5, 1].map(f => {
      const y = padT + f * plotH;
      return `<line x1="${padL}" y1="${y}" x2="${chartW - 8}" y2="${y}" stroke="var(--line-strong)" stroke-width="1" stroke-dasharray="2,3" opacity="0.6"/>`;
    }).join('');

    // Donut chart — fabricated, illustrative proportions only
    const donutData = [
      { label: 'Clinical trial', pct: 45, color: 'var(--layer-gold)' },
      { label: 'Health Research', pct: 35, color: 'var(--layer-teal)' },
      { label: 'Clinical research', pct: 20, color: 'var(--layer-coral)' }
    ];
    const donutR = 45, donutCx = 60, donutCy = 60;
    const circumference = 2 * Math.PI * donutR;
    let offsetAcc = 0;
    const donutSegments = donutData.map(seg => {
      const segLen = (seg.pct / 100) * circumference;
      const dasharray = `${segLen.toFixed(2)} ${(circumference - segLen).toFixed(2)}`;
      const dashoffset = (-offsetAcc).toFixed(2);
      offsetAcc += segLen;
      return `<circle cx="${donutCx}" cy="${donutCy}" r="${donutR}" fill="none" stroke="${seg.color}" stroke-width="16" stroke-dasharray="${dasharray}" stroke-dashoffset="${dashoffset}"/>`;
    }).join('');

    return `
      <div class="rc-demo">
        <div class="rc-demo-label">A sample of the report's visual style (KPI card, trend chart, register table, breakdown chart), with entirely made-up numbers, not the real report</div>
        <div class="dv-grid">
          <div class="dv-card dv-kpi">
            <div class="dv-kpi-title">Authorisation Turnaround</div>
            <div class="dv-kpi-number">82%</div>
            <div class="dv-kpi-target">vs. target</div>
          </div>
          <div class="dv-card">
            <div class="dv-chart-title">Mean Days to Site Authorisation</div>
            <svg viewBox="0 0 ${chartW} ${chartH}" class="dv-chart-svg" role="img" aria-label="Sample line chart showing mean days to site authorisation trending down across four quarters, illustrative only">
              ${gridLines}
              <path d="${linePath}" fill="none" stroke="var(--layer-color, var(--layer-violet))" stroke-width="2"/>
              ${pts.map(p => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3" fill="var(--layer-color, var(--layer-violet))"/>`).join('')}
              ${quarters.map((q, i) => `<text x="${pts[i].x.toFixed(1)}" y="${chartH - 4}" text-anchor="middle" font-size="9" font-family="var(--font-mono)" fill="var(--ink-faint)">${q}</text>`).join('')}
              <text x="2" y="${padT + 4}" font-size="9" font-family="var(--font-mono)" fill="var(--ink-faint)">${maxDay}</text>
              <text x="2" y="${chartH - padB + 4}" font-size="9" font-family="var(--font-mono)" fill="var(--ink-faint)">0</text>
            </svg>
          </div>
          <div class="dv-card dv-table-card">
            <div class="dv-chart-title">Sample Study Register</div>
            <table class="rc-table dv-table">
              <thead><tr><th>Study ID</th><th>Region</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td>STU-001</td><td>Region A</td><td>Authorised</td></tr>
                <tr><td>STU-002</td><td>Region B</td><td>Under review</td></tr>
                <tr><td>STU-003</td><td>Region A</td><td>Authorised</td></tr>
                <tr><td>STU-004</td><td>Region C</td><td>Pending sign-off</td></tr>
              </tbody>
            </table>
          </div>
          <div class="dv-card">
            <div class="dv-chart-title">Applications by Study Type</div>
            <div class="dv-donut-wrap">
              <svg viewBox="0 0 120 120" class="dv-donut-svg" role="img" aria-label="Sample donut chart showing application share by study type, illustrative only">
                <g transform="rotate(-90 60 60)">${donutSegments}</g>
              </svg>
              <div class="dv-donut-legend">
                ${donutData.map(seg => `<div class="dv-legend-item"><span class="dv-legend-dot" style="background:${seg.color}"></span>${seg.label}: ${seg.pct}%</div>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  // Pulsing badge for the builds with something inside: "Live demo inside" for
  // the six interactive demos, "Sample visual inside" for the Power BI card.
  // Clicking it opens the card (reusing the existing expand button/logic) and
  // scrolls straight to the demo block inside.
  // Shared across every attachDemoBadge call so each badge's sheen
  // sweeps at a different moment instead of all flashing at once.
  let liveBadgeCount = 0;

  function attachDemoBadge(card, moreBtn, label = 'Live demo inside') {
    const badge = el('button', { type: 'button', className: 'demo-badge' });
    badge.style.setProperty('--sheen-delay', (liveBadgeCount++ * 0.7) + 's');
    badge.innerHTML = `<span class="demo-dot" aria-hidden="true"></span>${label}`;
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!card.classList.contains('is-open')) moreBtn.click();
      requestAnimationFrame(() => {
        const demo = $('.rc-demo', card);
        if (!demo) return;
        demo.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        demo.classList.add('jump-highlight');
        setTimeout(() => demo.classList.remove('jump-highlight'), 1500);
      });
    });
    card.appendChild(badge);
  }

  function renderProjects() {
    const grid = $('#project-grid');
    const filterBar = $('#project-filters');
    const featuredWrap = $('#project-featured');
    // Replace any static/pre-rendered fallback markup with the full interactive version.
    grid.innerHTML = '';
    filterBar.innerHTML = '';
    featuredWrap.innerHTML = '';

    // The flagship build gets its own wide showcase; everything else fills the grid.
    const flagship = CONTENT.projects.find(p => p.tag === 'Flagship build');
    const rest = CONTENT.projects.filter(p => p.tag !== 'Flagship build');
    // Display-order only (data.js untouched): lead with the tools most
    // directly tied to REGIS and statewide reporting scale, rather than
    // ordering by which demo happens to be most visually dynamic.
    const DISPLAY_ORDER = ['power-bi', 'annual-report', 'weekly-report', 'sharepoint-sync', 'email-log', 'form-extractor', 'research-combiner'];
    rest.sort((a, b) => DISPLAY_ORDER.indexOf(a.id) - DISPLAY_ORDER.indexOf(b.id));

    if (flagship) {
      const color = LAYER_COLOR[flagship.layer] || 'var(--layer-violet)';
      const tint = LAYER_TINT[flagship.layer] || 'var(--tint-violet)';
      const textColor = LAYER_TEXT[flagship.layer] || 'var(--layer-violet-text)';
      const card = el('article', { className: 'project-card project-featured-card' });
      card.dataset.layer = flagship.layer;
      card.dataset.projectId = flagship.id;
      card.style.setProperty('--layer-color', color);
      card.style.setProperty('--tint-color', tint);
      card.style.setProperty('--layer-color-text', textColor);
      card.innerHTML = `
        <div class="pf-main">
          <div class="project-tag">${flagship.tag}</div>
          <h3>${flagship.title}</h3>
          <p class="project-summary">${applyEmphasis(flagship.summary, PROJECT_SUMMARY_FACTS[flagship.id])}</p>
          <div class="project-detail" id="pf-detail">
            <div class="pd-block"><div class="pd-label">The problem</div><p>${flagship.problem}</p></div>
            <div class="pd-block"><div class="pd-label">The build</div><p>${flagship.build}</p></div>
            <div class="pd-block"><div class="pd-label">The impact</div><p>${applyEmphasis(flagship.impact, PROJECT_IMPACT_FACTS[flagship.id])}</p></div>
          </div>
        </div>
        <div class="pf-side">
          <div class="pf-side-label">Stack</div>
          <div class="project-stack pf-stack">${flagship.stack.map(s => `<span>${s}</span>`).join('')}</div>
          ${flagship.liveLinks && flagship.liveLinks.length ? `
          <div class="pf-side-label" style="margin-top:22px;">Live &amp; published</div>
          <div class="pf-live-links">${flagship.liveLinks.map(l =>
            `<a class="pf-live-link" href="${l.url}" target="_blank" rel="noopener"><span>${l.label}</span><span class="arrow">↗</span></a>`).join('')}</div>` : ''}
        </div>`;
      featuredWrap.appendChild(card);
    }

    const layers = Array.from(new Set(rest.map(p => p.layer)));
    const chipPill = el('div', { className: 'chip-pill' });
    chipPill.setAttribute('aria-hidden', 'true');
    filterBar.appendChild(chipPill);
    const allChip = el('button', { className: 'chip is-active', textContent: 'All builds' });
    allChip.dataset.filter = 'all';
    filterBar.appendChild(allChip);
    layers.forEach(l => {
      const chip = el('button', { className: 'chip', textContent: LAYER_TITLE[l] || l });
      chip.dataset.filter = l;
      filterBar.appendChild(chip);
    });

    function positionChipPill() {
      const active = $('.chip.is-active', filterBar);
      if (!active) return;
      chipPill.style.width = active.offsetWidth + 'px';
      chipPill.style.height = active.offsetHeight + 'px';
      chipPill.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
    }
    positionChipPill();
    window.addEventListener('resize', positionChipPill);

    function fixGridSpan() {
      const visible = $all('.project-card', grid).filter(c => c.style.display !== 'none');
      $all('.project-card', grid).forEach(c => c.classList.remove('project-card--span'));
      if (visible.length % 2 === 1) {
        visible[visible.length - 1].classList.add('project-card--span');
      }
    }

    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.chip');
      if (!btn) return;
      $all('.chip', filterBar).forEach(c => c.classList.remove('is-active'));
      btn.classList.add('is-active');
      positionChipPill();
      const f = btn.dataset.filter;
      $all('.project-card', grid).forEach(card => {
        card.style.display = (f === 'all' || card.dataset.layer === f) ? '' : 'none';
      });
      fixGridSpan();
    });

    rest.forEach((proj, i) => {
      const color = LAYER_COLOR[proj.layer] || 'var(--layer-violet)';
      const tint = LAYER_TINT[proj.layer] || 'var(--tint-violet)';
      const textColor = LAYER_TEXT[proj.layer] || 'var(--layer-violet-text)';
      const card = el('article', { className: 'project-card' });
      card.dataset.layer = proj.layer;
      card.dataset.projectId = proj.id;
      card.style.setProperty('--layer-color', color);
      card.style.setProperty('--tint-color', tint);
      card.style.setProperty('--layer-color-text', textColor);
      const detailId = `proj-detail-${i}`;
      card.innerHTML = `
        <div class="project-tag">${proj.tag}</div>
        <h3>${proj.title}</h3>
        <p class="project-summary">${proj.summary}</p>
        <div class="project-stack">${proj.stack.map(s => `<span>${s}</span>`).join('')}</div>
        <button class="project-more" aria-expanded="false" aria-controls="${detailId}">
          <span class="label">Read the full build</span><span class="chevron">→</span>
        </button>
        <div class="project-detail" id="${detailId}">
          <div class="pd-block"><div class="pd-label">The problem</div><p>${proj.problem}</p></div>
          <div class="pd-block"><div class="pd-label">The build</div><p>${applyEmphasis(proj.build, PROJECT_BUILD_FACTS[proj.id])}</p></div>
          <div class="pd-block"><div class="pd-label">The impact</div><p>${applyEmphasis(proj.impact, PROJECT_IMPACT_FACTS[proj.id])}</p></div>
          ${proj.id === 'research-combiner' ? researchDemoHTML() : ''}
          ${proj.id === 'annual-report' ? arDemoHTML() : ''}
          ${proj.id === 'weekly-report' ? wrDemoHTML() : ''}
          ${proj.id === 'form-extractor' ? feDemoHTML() : ''}
          ${proj.id === 'sharepoint-sync' ? spDemoHTML() : ''}
          ${proj.id === 'email-log' ? elDemoHTML() : ''}
          ${proj.id === 'power-bi' ? dashboardFlowHTML() : ''}
        </div>`;
      const btn = $('.project-more', card);
      btn.addEventListener('click', () => {
        const open = card.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
        $('.label', btn).textContent = open ? 'Show less' : 'Read the full build';
      });
      if (proj.id === 'research-combiner') wireResearchDemo(card);
      if (proj.id === 'annual-report') wireArDemo(card);
      if (proj.id === 'weekly-report') wireWeeklyDemo(card);
      if (proj.id === 'form-extractor') wireFeDemo(card);
      if (proj.id === 'sharepoint-sync') wireSpDemo(card);
      if (proj.id === 'email-log') wireElDemo(card);
      if (LIVE_DEMO_IDS.includes(proj.id)) attachDemoBadge(card, btn, proj.id === 'power-bi' ? 'Sample visual inside' : 'Live demo inside');
      grid.appendChild(card);
    });
    fixGridSpan();
  }

  /* ---------------------------------------------------------
     COMPETENCIES + TOOLKIT
  --------------------------------------------------------- */
  function renderCompetencies() {
    const grid = $('#competency-grid');
    CONTENT.competencies.forEach(c => {
      const card = el('div', { className: 'competency-card' });
      card.style.setProperty('--card-color', c.color);
      card.innerHTML = `<h3>${c.title}</h3><ul>${c.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
      grid.appendChild(card);
    });

    const groupsWrap = $('#toolkit-groups');
    CONTENT.toolkit.forEach(g => {
      const group = el('div', { className: 'toolkit-group' });
      group.innerHTML = `<div class="toolkit-group-label">${g.label}</div><div class="toolkit-cloud">${g.items.map(t => `<span>${t}</span>`).join('')}</div>`;
      groupsWrap.appendChild(group);
    });
  }

  /* ---------------------------------------------------------
     EDUCATION
  --------------------------------------------------------- */
  function renderEducation() {
    const list = $('#education-list');
    CONTENT.education.forEach(e => {
      const row = el('div', { className: 'edu-row' });
      row.innerHTML = `
        <div><div class="edu-qual">${e.qual}</div><div class="edu-org">${e.org}</div></div>
        <div class="edu-year">${e.year}</div>`;
      list.appendChild(row);
    });
  }

  /* ---------------------------------------------------------
     CONTACT
  --------------------------------------------------------- */
  function renderContact() {
    const p = CONTENT.profile;
    $('#contact-lede').textContent = `${p.availability}. Based in ${p.location}.`;
    const actions = $('#contact-actions');
    actions.innerHTML = `
      <a class="btn btn-primary" href="mailto:${p.email}">Email ${p.email}</a>
      <button type="button" class="contact-copy-btn" id="contact-copy-email" title="Copy email address">Copy ⧉</button>
      <a class="btn btn-ghost" href="${p.linkedin}" target="_blank" rel="noopener">${p.linkedinLabel} ↗</a>
      <a class="btn btn-ghost" href="${p.resumeUrl}" download>Download résumé (PDF) ↓</a>`;
    $('#footer-name').textContent = `© ${new Date().getFullYear()} ${p.name}`;
  }

  /* ---------------------------------------------------------
     NAV — scroll shadow, mobile toggle, scrollspy
  --------------------------------------------------------- */
  function initNav() {
    const nav = $('#nav');
    const progress = $('#nav-progress');
    const backToTop = $('#back-to-top');
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 8);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (y / docHeight) * 100) : 0;
      progress.style.width = pct + '%';
      backToTop.classList.toggle('is-visible', y > 900);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });

    const toggle = $('#nav-toggle');
    const links = $('#nav-links');
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    $all('#nav-links a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));

    const sections = $all('#nav-links a').map(a => {
      const href = a.getAttribute('href');
      return {
        link: a,
        // Only in-page anchors (#section) participate in scroll-spy / the
        // progress rail. Non-hash links (like the résumé download) are
        // real navigation items but aren't page sections, so they're
        // excluded here rather than passed to document.querySelector,
        // which only accepts a valid CSS selector.
        target: href.startsWith('#') ? document.querySelector(href) : null
      };
    }).filter(s => s.target);

    // section progress rail — one dot per nav section, built from the same
    // list, so it always matches the nav exactly with no separate source of truth
    const rail = el('div', { className: 'progress-rail', id: 'progress-rail' });
    const railDots = sections.map(s => {
      const dot = el('a', { className: 'rail-dot' });
      dot.href = s.link.getAttribute('href');
      dot.style.setProperty('--dot-color', s.link.dataset.layer);
      dot.setAttribute('aria-label', `Jump to ${s.link.textContent}`);
      dot.innerHTML = `<span class="rail-tooltip">${s.link.textContent}</span>`;
      rail.appendChild(dot);
      return { dot, target: s.target };
    });
    document.body.appendChild(rail);

    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const match = sections.find(s => s.target === entry.target);
        if (!match) return;
        if (entry.isIntersecting) {
          sections.forEach(s => s.link.classList.remove('is-active'));
          match.link.classList.add('is-active');
          nav.style.setProperty('--current-layer', match.link.dataset.layer);
          railDots.forEach(r => r.dot.classList.toggle('is-active', r.target === entry.target));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => spy.observe(s.target));
  }

  /* ---------------------------------------------------------
     SCROLL REVEALS
  --------------------------------------------------------- */
  function initReveals() {
    const targets = $all('.reveal, .reveal-stagger');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(t => io.observe(t));

    // stagger children timing
    $all('.reveal-stagger').forEach(group => {
      Array.from(group.children).forEach((child, i) => {
        child.style.transitionDelay = `${Math.min(i, 8) * 70}ms`;
      });
    });
  }

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */
  /* ---------------------------------------------------------
     COUNT-UP — animates numeric stats into view once
  --------------------------------------------------------- */
  function animateCountUp(el) {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d+)(\D*)$/);
    if (!match) return; // non-numeric value (e.g. "TechAG", "Since 2022") — leave untouched
    const target = parseInt(match[1], 10);
    const suffix = match[2] || '';
    const looksLikeYear = suffix === '' && target >= 1900 && target <= 2100;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (looksLikeYear || reduce) { el.textContent = target + suffix; return; }

    const duration = 1100;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }

  function initCountUp() {
    const targets = $all('.stat-value, .ps-from, .ps-to');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCountUp(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    targets.forEach(t => io.observe(t));
  }

  /* ---------------------------------------------------------
     3D HOVER DEPTH — subtle mouse-tilt on project & competency
     cards. Same restrained language as the hero stack's parallax
     (desktop pointer only, respects reduced-motion).
  --------------------------------------------------------- */
  /* ---------------------------------------------------------
     TOAST — small transient confirmation message
  --------------------------------------------------------- */
  let toastTimer = null;
  function showToast(message) {
    let toast = $('#site-toast');
    if (!toast) {
      toast = el('div', { className: 'toast', id: 'site-toast' });
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
  }

  /* ---------------------------------------------------------
     COPY EMAIL — small micro-interaction next to the mailto link
  --------------------------------------------------------- */
  function initCopyEmail() {
    const btn = $('#contact-copy-email');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const email = CONTENT.profile.email;
      try {
        await navigator.clipboard.writeText(email);
        showToast(`Email copied: ${email}`);
      } catch {
        showToast(`Copy this: ${email}`);
      }
    });
  }

  /* ---------------------------------------------------------
     COMMAND PALETTE — press "/" anywhere (not while typing) to
     fuzzy-jump to any section or any specific build. Reuses the
     same tokenize/similarity engine that powers the assistant demo.
  --------------------------------------------------------- */
  let cmdkIndex = [];
  let cmdkActive = 0;
  let cmdkResults = [];

  function buildCmdkIndex() {
    const items = [];
    $all('#nav-links a').forEach(a => {
      const href = a.getAttribute('href');
      if (!href.startsWith('#')) return; // skip non-section nav items (e.g. the résumé download)
      const target = document.querySelector(href);
      if (!target) return;
      const desc = $('.lede', target) ? $('.lede', target).textContent.trim() : '';
      items.push({
        kind: 'Section', title: a.textContent.trim(), desc, el: target,
        layerColor: a.dataset.layer || 'var(--layer-violet)'
      });
    });
    $all('#project-featured .project-card, #project-grid .project-card').forEach(card => {
      const h3 = $('h3', card);
      const summary = $('.project-summary', card);
      if (!h3) return;
      items.push({
        kind: 'Build', title: h3.textContent.trim(),
        desc: summary ? summary.textContent.trim() : '',
        el: card,
        hasDemo: LIVE_DEMO_IDS.includes(card.dataset.projectId),
        layerColor: card.style.getPropertyValue('--layer-color') || 'var(--layer-violet)'
      });
    });
    return items;
  }

  function cmdkScore(query, item) {
    const q = query.toLowerCase().trim();
    const title = item.title.toLowerCase();
    if (!q) return 1;
    if (title === q) return 200;
    if (title.startsWith(q)) return 140 - Math.min(40, title.length - q.length);
    if (title.includes(q)) return 100;
    const qTokens = tokenize(q);
    if (!qTokens.length) return 0;
    const itemTokens = tokenize(`${title} ${item.desc || ''}`);
    if (!itemTokens.length) return 0;
    let scoreSum = 0;
    qTokens.forEach(qt => {
      let best = 0;
      itemTokens.forEach(it => { const s = similarity(qt, it); if (s > best) best = s; });
      if (best >= 0.62) scoreSum += best;
    });
    return (scoreSum / qTokens.length) * 70;
  }

  function cmdkRender(query) {
    const wrap = $('#cmdk-results');
    wrap.innerHTML = '';
    cmdkActive = 0;

    if (!query.trim()) {
      cmdkResults = cmdkIndex;
      const sections = cmdkIndex.filter(i => i.kind === 'Section');
      const builds = cmdkIndex.filter(i => i.kind === 'Build');
      wrap.appendChild(el('div', { className: 'cmdk-group-label', textContent: 'Sections' }));
      sections.forEach((item, i) => wrap.appendChild(cmdkRenderItem(item, i)));
      wrap.appendChild(el('div', { className: 'cmdk-group-label', textContent: 'Builds' }));
      builds.forEach((item, i) => wrap.appendChild(cmdkRenderItem(item, sections.length + i)));
      cmdkResults = [...sections, ...builds];
      cmdkHighlight();
      return;
    }

    const scored = cmdkIndex
      .map(item => ({ item, score: cmdkScore(query, item) }))
      .filter(s => s.score > 15)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    cmdkResults = scored.map(s => s.item);
    if (!cmdkResults.length) {
      wrap.appendChild(el('div', { className: 'cmdk-empty', textContent: `No match for "${query}". Try a section name or a build.` }));
      return;
    }
    cmdkResults.forEach((item, i) => wrap.appendChild(cmdkRenderItem(item, i)));
    cmdkHighlight();
  }

  function cmdkRenderItem(item, i) {
    const btn = el('button', { type: 'button', className: 'cmdk-item' });
    btn.dataset.index = i;
    btn.style.setProperty('--layer-color', item.layerColor);
    btn.innerHTML = `
      <span class="cmdk-item-icon">${item.kind === 'Section' ? '§' : '▸'}</span>
      <span class="cmdk-item-body">
        <span class="cmdk-item-title">${item.title}${item.hasDemo ? ' <span class="cmdk-item-live">live demo</span>' : ''}</span>
        ${item.desc ? `<span class="cmdk-item-desc">${item.desc}</span>` : ''}
      </span>
      <span class="cmdk-item-kind">${item.kind}</span>`;
    btn.addEventListener('mouseenter', () => { cmdkActive = i; cmdkHighlight(); });
    btn.addEventListener('click', () => cmdkJump(item));
    return btn;
  }

  function cmdkHighlight() {
    $all('.cmdk-item', $('#cmdk-results')).forEach((n, i) => {
      n.classList.toggle('is-active', i === cmdkActive);
    });
    const activeEl = $('.cmdk-item.is-active', $('#cmdk-results'));
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
  }

  function cmdkJump(item) {
    cmdkTriggerEl = null; // jumping somewhere new — don't snap focus back to the trigger
    closeCmdk();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      item.el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      item.el.classList.add('jump-highlight');
      if (!item.el.hasAttribute('tabindex')) item.el.setAttribute('tabindex', '-1');
      item.el.focus({ preventScroll: true });
      setTimeout(() => item.el.classList.remove('jump-highlight'), 1500);
    }, 120);
  }

  let cmdkTriggerEl = null;

  function openCmdk(triggerEl) {
    cmdkTriggerEl = triggerEl || document.activeElement;
    cmdkIndex = buildCmdkIndex();
    const overlay = $('#cmdk-overlay');
    overlay.classList.add('is-open');
    const input = $('#cmdk-input');
    input.value = '';
    cmdkRender('');
    setTimeout(() => input.focus(), 50);
  }

  function closeCmdk() {
    $('#cmdk-overlay').classList.remove('is-open');
    if (cmdkTriggerEl && typeof cmdkTriggerEl.focus === 'function') {
      cmdkTriggerEl.focus();
    }
    cmdkTriggerEl = null;
  }

  function initCommandPalette() {
    const overlay = $('#cmdk-overlay');
    const input = $('#cmdk-input');

    document.addEventListener('keydown', (e) => {
      if (e.key !== '/') return;
      const tag = (e.target.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
      if (typing || overlay.classList.contains('is-open')) return;
      e.preventDefault();
      openCmdk(e.target);
    });

    $('#nav-jump-hint').addEventListener('click', (e) => openCmdk(e.currentTarget));
    $('#nav-search-toggle').addEventListener('click', (e) => openCmdk(e.currentTarget));

    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeCmdk(); });

    input.addEventListener('input', () => cmdkRender(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeCmdk(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); cmdkActive = Math.min(cmdkActive + 1, cmdkResults.length - 1); cmdkHighlight(); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); cmdkActive = Math.max(cmdkActive - 1, 0); cmdkHighlight(); return; }
      if (e.key === 'Enter') { e.preventDefault(); const item = cmdkResults[cmdkActive]; if (item) cmdkJump(item); }
    });
  }

  // Performance: the badge/link sheen and pulse animations (~19 running at
  // once across the page) only need to run while actually visible. This
  // toggles .is-in-view as each scrolls in/out; the CSS above pauses the
  // animation-play-state when the class is absent.
  function initOffscreenAnimationPause() {
    const targets = $all('.demo-badge, .pillar-links a, .pf-live-link, .contact-actions a[href*="linkedin.com"]');
    if (!targets.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => entry.target.classList.toggle('is-in-view', entry.isIntersecting));
    }, { rootMargin: '150px' });
    targets.forEach(t => io.observe(t));
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderHero();
    renderStats();
    renderTimeline();
    renderPlatform();
    renderProcessDesign();
    renderAssistantFeature();
    renderProjects();
    renderCompetencies();
    renderEducation();
    renderContact();
    initNav();
    initReveals();
    initCountUp();
    initCopyEmail();
    initCommandPalette();
    initOffscreenAnimationPause();
  });
})();
