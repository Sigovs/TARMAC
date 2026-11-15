/*
  TARMAC MOTORS — design system page (design-system.html).
  Reads the LIVE custom properties from site.css, so the tables never drift from the site:
  colour swatches with contrast ratios, the type scale, spacing, layout and motion tokens.
  Usage notes live here; values come from the stylesheet.
*/
(() => {
  const root = document.documentElement;
  const css = getComputedStyle(root);
  const val = (name) => css.getPropertyValue(name).trim();
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* resolve any length token (clamp, rem, svh) to px at the current viewport */
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;height:0';
  document.body.append(probe);
  const px = (name) => { probe.style.width = `var(${name})`; return parseFloat(getComputedStyle(probe).width); };

  /* colour → [r,g,b,a] via the browser's own parser */
  const rgba = (color) => {
    probe.style.color = color;
    const m = getComputedStyle(probe).color.match(/[\d.]+/g).map(Number);
    return [m[0], m[1], m[2], m[3] ?? 1];
  };
  const lum = ([r, g, b]) => {
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (fg, bg) => {
    const a = lum(rgba(fg)), b = lum(rgba(bg));
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };

  /* ---------- colour ---------- */
  const COLORS = [
    ['Ground', [
      ['--bg', 'Page ground. Every section unless a note says otherwise.'],
      ['--bg-raised', 'Raised grounds: Sell and About sections, the VDP Sell block, drawer car summary.'],
      ['--bg-sunk', 'Inputs and the footer.'],
      ['--line', 'Hairline dividers: card action rows, section rules.'],
      ['--line-strong', 'Control borders: chips, secondary buttons, fields.'],
    ]],
    ['Text', [
      ['--text', 'Headings, body copy, the primary button fill.', '--bg'],
      ['--text-muted', 'Secondary copy, labels, specs.', '--bg'],
      ['--text-faint', 'Captions, placeholders, step numerals at rest.', '--bg'],
    ]],
    ['Light surface (the Sell card only)', [
      ['--on-light', 'Text and the dark Submit on light grounds.', '--text'],
      ['--paper-field', 'Fields on the light Sell card.'],
      ['--paper-line', 'Field borders on the light card.'],
      ['--paper-muted', 'Labels on the light card.', '--text'],
    ]],
    ['Accent and effects', [
      ['--accent', 'Logo lime. Small marks only: focus ring, link hover, Saved, the hero slide number, text selection. Never a fill, band or button.', '--bg'],
      ['--glass', 'Glass cards over photos, always with a backdrop blur.', null, 'glass'],
      ['--glass-line', 'Hairline border of glass cards, the drawer and the dropdown.', null, 'glass'],
    ]],
  ];
  const swatches = document.querySelector('[data-ds-colors]');
  if (swatches) {
    swatches.innerHTML = COLORS.map(([group, list]) => `
      <div class="ds-sub">
        <h3 class="ds-h3">${esc(group)}</h3>
        <div class="ds-swatches">${list.map(([name, usage, on, kind]) => {
          const v = val(name);
          const r = on ? ratio(v, val(on)) : null;
          const chip = kind === 'glass'
            ? `<div class="ds-swatch__chip ds-swatch__chip--glass"><span style="background:var(${name});-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px)"></span></div>`
            : `<div class="ds-swatch__chip" style="background:var(${name})"></div>`;
          return `
          <div class="ds-swatch">
            ${chip}
            <div class="ds-swatch__body">
              <div class="ds-swatch__name"><button type="button" data-copy="var(${name})" title="Copy var(${name})">${name}</button></div>
              <span class="ds-swatch__value">${esc(v)}</span>
              <p class="ds-swatch__usage">${esc(usage)}</p>
              ${r ? `<span class="ds-swatch__ratio">${r.toFixed(1)}:1 on ${on}${r >= 4.5 ? ' · AA' : r >= 3 ? ' · AA large' : ' · below AA'}</span>` : ''}
            </div>
          </div>`;
        }).join('')}</div>
      </div>`).join('');
  }

  /* ---------- type scale ---------- */
  const TYPE = [
    ['--fs-hero', 'Hero headline. 600, width 112, line-height 0.98. Desktop caps it at 80px.', 'Cars worth getting excited about.', 'font-weight:600;font-variation-settings:"wdth" 112;line-height:.98;letter-spacing:-.03em'],
    ['--fs-h2', 'Section titles. 600, width 112.', 'Sell Your Car. How it Works', 'font-weight:600;font-variation-settings:"wdth" 112;line-height:1.04;letter-spacing:-.02em'],
    ['--fs-h3', 'Card titles, step titles, drawer titles. 500 to 600.', 'Send Us the Details', 'font-weight:600'],
    ['--fs-lead', 'Section intros and the hero lede.', 'Weekend cars from the ’80s, ’90s and 2000s, some older classics, and plenty of manuals.', 'color:var(--text-muted)'],
    ['--fs-body', 'Running text. Line-height 1.55.', 'Always garaged, zero rust, no accidents, and smoke-free. The power-retractable hardtop operates smoothly.', ''],
    ['--fs-small', 'Specs, notes, nav links, form hints.', '6-speed manual · 43,501 miles', 'color:var(--text-muted)'],
    ['--fs-label', 'Labels and actions. Uppercase, 600, letter-spacing 0.06em.', 'Save · Text to phone · Share', 'text-transform:uppercase;font-weight:600;letter-spacing:.06em;color:var(--text-muted)'],
  ];
  const typeBox = document.querySelector('[data-ds-type]');
  if (typeBox) {
    typeBox.innerHTML = TYPE.map(([name, usage, sample, style]) => `
      <div class="ds-type__row">
        <div class="ds-type__meta"><code>${name}</code><span>${Math.round(px(name))}px now · ${esc(val(name))}</span></div>
        <div class="ds-type__sample" style="font-size:var(${name});${style}">${esc(sample)}<p class="ds-swatch__usage" style="font-size:var(--fs-small);font-weight:400;letter-spacing:0;text-transform:none;font-variation-settings:normal;line-height:1.5;margin-top:.5rem">${esc(usage)}</p></div>
      </div>`).join('');
  }

  /* ---------- token tables ---------- */
  const table = (rows, opts = {}) => `
    <div class="ds-table-wrap"><table class="ds-table">
      <thead><tr><th>Token</th><th>Value</th>${opts.bar ? '<th>Now</th>' : ''}<th>Use</th></tr></thead>
      <tbody>${rows.map(([name, usage]) => {
        const v = val(name);
        const n = opts.bar ? px(name) : null;
        return `<tr>
          <td><button type="button" class="ds-swatch__name" style="padding:0;border:0;background:none;cursor:copy" data-copy="var(${name})"><code>${name}</code></button></td>
          <td class="ds-num">${esc(v)}</td>
          ${opts.bar ? `<td class="ds-num" style="min-width:12rem"><span style="display:flex;align-items:center;gap:.75rem"><span class="ds-bar" style="width:${Math.min(n, 160)}px"></span>${Math.round(n)}px</span></td>` : ''}
          <td class="ds-usage">${esc(usage)}</td>
        </tr>`;
      }).join('')}</tbody>
    </table></div>`;

  const fill = (sel, rows, opts) => { const el = document.querySelector(sel); if (el) el.innerHTML = table(rows, opts); };
  fill('[data-ds-space]', [
    ['--s-1', 'Tight gaps: icon to label, chip rows.'],
    ['--s-2', 'Default gap between related items; card padding on phones.'],
    ['--s-3', 'Inside cards and forms; between a title and its text.'],
    ['--s-4', 'Between groups inside a section.'],
    ['--s-5', 'Between a section head and its content.'],
    ['--s-6', 'Between large blocks; footer top padding.'],
    ['--s-7', 'Desktop rhythm between big groups.'],
    ['--s-8', 'Largest step; rare.'],
  ], { bar: true });
  fill('[data-ds-layout]', [
    ['--section', 'Vertical padding of every section. Fluid.'],
    ['--gutter', 'Side padding of .container. Fluid, 20px to 80px.'],
    ['--max', 'Content width cap inside .container.'],
    ['--header-h', 'Header height: 64px, 80px from 1200px.'],
    ['--radius-sheet', 'Rounded top of the overlay sheets and the drawer edge.'],
    ['--pin-hold', 'Reading time before an overlay sheet starts covering the pinned section.'],
  ], { bar: true });
  fill('[data-ds-radius]', [
    ['--radius', 'Buttons, fields, chips’ inner parts, thumbnails.'],
    ['--radius-lg', 'Cards, photos, panels, the dropdown list.'],
  ]);
  fill('[data-ds-motion]', [
    ['--ease', 'The one ease of the site (CSS). Calm, no overshoot.'],
    ['--t-fast', 'Colour and border changes on hover.'],
    ['--t-med', 'Fades, glow lines, the dropdown chevron.'],
    ['--m-ease', 'Anime.js name of the same ease (motion.js).'],
    ['--m-enter', 'Hero headline lines rising, the slide-change entrance.'],
    ['--m-arrive', 'Hero buttons pulling in from the right.'],
    ['--m-arrive-x', 'How far the hero buttons travel.'],
    ['--m-stagger', 'Delay between headline lines.'],
    ['--m-swap-out', 'Old headline lines leaving on a slide change.'],
  ]);

  /* ---------- motion demo: the site ease, replayable ---------- */
  const demo = document.querySelector('[data-ds-motion-demo]');
  if (demo) {
    const track = demo.querySelector('.ds-motion__track');
    const setW = () => demo.style.setProperty('--ds-track', `${track.clientWidth}px`);
    setW(); window.addEventListener('resize', setW);
    demo.querySelector('button').addEventListener('click', () => demo.classList.toggle('is-on'));
  }

  /* ---------- copy a token reference ---------- */
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const label = b.querySelector('code') || b;
    const before = label.textContent;
    try { await navigator.clipboard.writeText(b.dataset.copy); label.textContent = 'Copied'; }
    catch { label.textContent = b.dataset.copy; }
    setTimeout(() => { label.textContent = before; }, 1200);
  });

  /* ---------- contents: highlight the section in view ---------- */
  const links = [...document.querySelectorAll('.ds__toc a')];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => (a.getAttribute('href') === `#${en.target.id}` ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    });
  }, { rootMargin: '-30% 0px -65% 0px' });
  document.querySelectorAll('.ds-sec').forEach((s) => spy.observe(s));
})();
