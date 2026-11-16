/*
  TARMAC MOTORS — vehicle detail page (vehicle.html?car=<id>). Preview mockup, no dependencies.

  Builds the page from data.js. Client requirements (Zoom + Kirsten's notes):
    - big photo with arrows, thumbnail strip, full screen on click, uniform photo grid below;
    - NO automatic slideshow: photos change only when the visitor asks;
    - description open by default (never behind a "read more");
    - VIN decoding, a video, and no finance buttons: "Sell Your Car" instead.
      On phones the description sits ABOVE the Sell Your Car block (layout in site.css).
  Save / Text to phone / Share / Ask About This Car are handled by home.js (shared).
*/
(() => {
  const root = document.querySelector('[data-vdp]');
  if (!root) return;

  const cars = window.TARMAC_INVENTORY || [];
  const id = new URLSearchParams(location.search).get('car');
  const car = cars.find((c) => c.id === id);

  if (!car) {
    root.querySelector('[data-vdp-body]').hidden = true;
    root.querySelector('[data-vdp-photos-section]').hidden = true;
    root.querySelector('[data-vdp-missing]').hidden = false;
    document.title = 'Car not found — Tarmac Motors';
    return;
  }

  /* ---------- helpers ---------- */
  const ICON = {
    prev: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m14.5 6-6 6 6 6"/></svg>',
    next: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m9.5 6 6 6-6 6"/></svg>',
    expand: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    manual: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 5v14M12 5v14M18 5v7H6"/><circle cx="6" cy="5" r="1.4"/><circle cx="12" cy="5" r="1.4"/><circle cx="18" cy="5" r="1.4"/><circle cx="6" cy="19" r="1.4"/><circle cx="12" cy="19" r="1.4"/></svg>',
    automatic: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="4.5" y="3" width="15" height="18" rx="2.5"/><path d="M12 7v10"/><circle cx="12" cy="10" r="2.4"/></svg>',
    miles: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4.5 16a8 8 0 1 1 15 0"/><path d="m12 13 3.5-4"/><circle cx="12" cy="13" r="1"/></svg>',
    save: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/></svg>',
    text: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/></svg>',
    share: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 15V3.5M7.5 8 12 3.5 16.5 8"/><path d="M5 12v7.5h14V12"/></svg>',
    external: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M9 6.5h8.5V15M17.5 6.5 7 17"/></svg>',
    play: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
  };
  const money = (n) => '$' + n.toLocaleString('en-US');
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const model = [car.model, car.trim].filter(Boolean).join(' ');
  const title = [car.year, car.make, model].join(' ');
  const price = car.status === 'sold' ? 'Sold' : car.price ? money(car.price) : 'Call for price';
  const status = car.status === 'sold' ? 'Sold' : car.status === 'coming-soon' ? 'Coming soon' : '';
  const photos = car.photos;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let savedIds;
  try { savedIds = new Set(JSON.parse(localStorage.getItem('tarmac-saved') || '[]')); } catch { savedIds = new Set(); }
  const isSaved = savedIds.has(car.id);

  document.title = `${title} — Tarmac Motors`;

  /* ---------- gallery: swipe (native scroll-snap), arrows, thumbs, click = full screen ---------- */
  const gallery = root.querySelector('[data-vdp-gallery]');
  gallery.innerHTML = `
    <div class="gallery__stage">
      <ul class="gallery__track" data-g-track aria-label="Photos of ${esc(title)}">
        ${photos.map((src, i) => `
        <li><button class="gallery__open" type="button" data-open="${i}" aria-label="Open photo ${i + 1} of ${photos.length} full screen">
          <img src="${src}" alt="${i === 0 ? esc(title) : `${esc(title)}, photo ${i + 1}`}" width="1600" height="1067"
            loading="${i === 0 ? 'eager' : 'lazy'}" decoding="async" ${i === 0 ? 'fetchpriority="high"' : ''}>
        </button></li>`).join('')}
      </ul>
      ${status ? `<span class="tag tag--status gallery__status">${status}</span>` : ''}
      <button class="car__arrow car__arrow--prev" type="button" data-g-prev aria-label="Previous photo">${ICON.prev}</button>
      <button class="car__arrow car__arrow--next" type="button" data-g-next aria-label="Next photo">${ICON.next}</button>
      <span class="car__count" data-g-count aria-hidden="true">1 / ${photos.length}</span>
      <button class="gallery__full" type="button" data-open-current aria-label="View full screen">${ICON.expand}</button>
    </div>
    <ul class="gallery__thumbs" aria-label="Choose a photo">
      ${photos.map((src, i) => `
      <li><button class="gallery__thumb" type="button" data-thumb="${i}" aria-label="Photo ${i + 1}" ${i === 0 ? 'aria-current="true"' : ''}>
        <img src="${src}" alt="" width="160" height="107" loading="lazy" decoding="async">
      </button></li>`).join('')}
    </ul>`;

  const track = gallery.querySelector('[data-g-track]');
  const countEl = gallery.querySelector('[data-g-count]');
  const thumbs = [...gallery.querySelectorAll('[data-thumb]')];
  const index = () => Math.round(track.scrollLeft / track.clientWidth);
  const goTo = (i) => {
    const n = (i + photos.length) % photos.length;   // wraps, like the cards
    track.scrollTo({ left: n * track.clientWidth, behavior: reduce.matches ? 'auto' : 'smooth' });
  };
  track.addEventListener('scroll', () => {
    const i = index();
    countEl.textContent = `${i + 1} / ${photos.length}`;
    thumbs.forEach((t, k) => (k === i ? t.setAttribute('aria-current', 'true') : t.removeAttribute('aria-current')));
    const active = thumbs[i];
    if (active) {   // keep the active thumb in view inside its own strip (never scroll the page)
      const strip = active.closest('.gallery__thumbs');
      const left = active.offsetLeft - (strip.clientWidth - active.offsetWidth) / 2;
      strip.scrollTo({ left, behavior: reduce.matches ? 'auto' : 'smooth' });
    }
  }, { passive: true });
  gallery.querySelector('[data-g-prev]').addEventListener('click', () => goTo(index() - 1));
  gallery.querySelector('[data-g-next]').addEventListener('click', () => goTo(index() + 1));
  thumbs.forEach((t) => t.addEventListener('click', () => goTo(+t.dataset.thumb)));

  /* ---------- summary panel ---------- */
  const specs = [];
  if (car.transmission) specs.push(`<li>${ICON[car.transmission]}<span>${car.transmissionLabel}</span></li>`);
  if (car.miles != null) specs.push(`<li>${ICON.miles}<span>${car.miles.toLocaleString('en-US')} miles</span></li>`);
  /* CARFAX vehicle history report. Preview: links by VIN where we have one (carfax.com otherwise).
     On the platform: the dealer's CARFAX partner link and official badge (AAN integration).
     The note under it repeats only what the listing itself says about the report. */
  const carfaxURL = car.vinNumber
    ? `https://www.carfax.com/VehicleHistory/p/Report.cfx?vin=${encodeURIComponent(car.vinNumber)}`
    : 'https://www.carfax.com/';
  const carfaxHTML = `
    <a class="vdp__carfax" href="${carfaxURL}" target="_blank" rel="noopener">
      <span class="vdp__carfax-brand">
        <img class="vdp__carfax-logo" src="assets/img/brand/carfax-logo-white.svg?v=20261116f" alt="CARFAX" width="366" height="71">
        <span class="vdp__carfax-tag">Vehicle History Reports</span>
      </span>
      <span class="vdp__carfax-text"><strong>View the report</strong><span>${esc(car.carfaxNote || 'Accidents, owners, service')}</span></span>
      ${ICON.external}
    </a>`;
  root.querySelector('[data-vdp-panel]').innerHTML = `
    <p class="vdp__kicker">${car.year} ${esc(car.make)}</p>
    <h1 class="vdp__title">${esc(model)}</h1>
    <p class="vdp__price">${price}</p>
    ${specs.length ? `<ul class="car__specs vdp__specs">${specs.join('')}</ul>` : ''}
    <div class="vdp__cta">
      <button class="button button--primary button--block" type="button" data-drawer="car" data-car="${car.id}">Ask About This Car</button>
      <a class="button button--secondary button--block" href="tel:+14052379363">Call (405) 237-9363</a>
    </div>
    ${carfaxHTML}
    <div class="car__actions vdp__actions">
      <button class="car__action" type="button" data-save="${car.id}" aria-pressed="${isSaved}">${ICON.save}<span>${isSaved ? 'Saved' : 'Save'}</span></button>
      <button class="car__action" type="button" data-drawer="text" data-car="${car.id}">${ICON.text}<span>Text to phone</span></button>
      <button class="car__action" type="button" data-drawer="share" data-car="${car.id}">${ICON.share}<span>Share</span></button>
    </div>`;

  /* ---------- description: open by default (client: never behind a button).
     SIMULATED: the copy of this car's listing in our past dealer projects (see data.js). On the
     platform: the dealer's own write-up, shown in full. ---------- */
  const paras = car.description && car.description.length ? car.description : [car.note];
  const fmt = (t) => {   // "Engine: Numbers-matching…" → bold lead-in, like the source listing
    const m = /^([A-Z][A-Za-z/ ]{2,22}):\s+(.*)$/.exec(t);
    return m ? `<strong>${esc(m[1])}:</strong> ${esc(m[2])}` : esc(t);
  };
  let descHTML = paras.map((t) => `<p>${fmt(t)}</p>`).join('');
  if (car.highlights && car.highlights.length) {
    descHTML += `<ul class="vdp__highlights">${car.highlights.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;
  }
  root.querySelector('[data-vdp-desc]').innerHTML = descHTML;

  /* ---------- VIN decoded: rows we know; unknown fields are left out ---------- */
  const v = car.vin || {};
  const rows = [
    ['VIN', car.vinNumber], ['Stock', car.stock ? `#${car.stock}` : null],
    ['Year', car.year], ['Make', car.make], ['Model', car.model], ['Trim', car.trim],
    ['Body', v.body], ['Engine', v.engine || car.engineLabel], ['Drivetrain', v.drivetrain],
    ['Transmission', car.transmission ? car.transmissionLabel : null],
    ['Exterior', car.exterior], ['Interior', car.interior],
    ['Mileage', car.miles != null ? `${car.miles.toLocaleString('en-US')} miles` : null],
  ].filter(([, val]) => val);
  root.querySelector('[data-vdp-vin]').innerHTML = rows
    .map(([k, val]) => `<div class="vin__row${k === 'VIN' ? ' vin__row--vin' : ''}"><dt>${k}</dt><dd>${esc(val)}</dd></div>`).join('');

  /* ---------- video: click to play, never autoplays.
     With a video id (YouTube, from the source listing): a poster until the visitor presses play,
     then the privacy-enhanced player loads in place. Without one: the dealer's TikTok, where their
     walkarounds live. On the platform: this car's own walkaround. ---------- */
  const poster = photos[Math.min(1, photos.length - 1)];
  const videoBox = root.querySelector('[data-vdp-video]');
  if (car.video) {
    videoBox.innerHTML = `
      <button class="video-card" type="button" data-play aria-label="Play the walkaround video of the ${esc(title)}">
        <img src="${poster}" alt="" width="1600" height="1067" loading="lazy" decoding="async">
        <span class="video-card__play">${ICON.play}</span>
        <span class="video-card__label">Walkaround video</span>
      </button>`;
    videoBox.querySelector('[data-play]').addEventListener('click', () => {
      videoBox.innerHTML = `
        <div class="video-card video-card--playing">
          <iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(car.video)}?autoplay=1&rel=0&modestbranding=1"
            title="Walkaround video: ${esc(title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>
        </div>`;
    });
  } else {
    videoBox.innerHTML = `
      <a class="video-card" href="https://www.tiktok.com/@tarmacmotors" target="_blank" rel="noopener">
        <img src="${poster}" alt="" width="1600" height="1067" loading="lazy" decoding="async">
        <span class="video-card__play">${ICON.play}</span>
        <span class="video-card__label">Watch our walkarounds on TikTok</span>
      </a>`;
  }

  /* ---------- uniform photo grid (repeated placeholder photos shown once) ---------- */
  const unique = [...new Set(photos)];
  const photoGrid = root.querySelector('[data-vdp-photos]');
  // three across: a remainder of 1 or 2 turns the last rows into pairs (10 photos = 3 + 3 + 2 + 2), see site.css
  photoGrid.dataset.rest = unique.length % 3;
  // a single photo is already the whole top gallery: no point repeating it full width
  if (unique.length < 2) root.querySelector('[data-vdp-photos-section]').hidden = true;
  photoGrid.innerHTML = unique.map((src) => {
    const i = photos.indexOf(src);
    return `<li><button class="photo-grid__item" type="button" data-open="${i}" aria-label="Open photo ${i + 1} full screen">
      <img src="${src}" alt="" width="1600" height="1067" loading="lazy" decoding="async"></button></li>`;
  }).join('');

  /* ---------- full-screen viewer (<dialog>): arrows, keys, swipe; no autoplay ---------- */
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('[data-lb-img]');
  const lbCount = lb.querySelector('[data-lb-count]');
  let lbIndex = 0;
  const lbShow = (i) => {
    lbIndex = (i + photos.length) % photos.length;
    lbImg.src = photos[lbIndex];
    lbImg.alt = `${title}, photo ${lbIndex + 1}`;
    lbCount.textContent = `${lbIndex + 1} / ${photos.length}`;
  };
  const lbOpen = (i) => {
    lbShow(i);
    lb.showModal();
    document.documentElement.classList.add('has-drawer');
    if (window.tarmacLenis) window.tarmacLenis.stop();
  };
  lb.addEventListener('close', () => {
    document.documentElement.classList.remove('has-drawer');
    if (window.tarmacLenis) window.tarmacLenis.start();
    goTo(lbIndex);   // the page gallery follows what was viewed
  });
  root.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) { lbOpen(+opener.dataset.open); return; }
    if (e.target.closest('[data-open-current]')) lbOpen(index());
  });
  lb.querySelector('[data-lb-prev]').addEventListener('click', () => lbShow(lbIndex - 1));
  lb.querySelector('[data-lb-next]').addEventListener('click', () => lbShow(lbIndex + 1));
  lb.querySelector('[data-lb-close]').addEventListener('click', () => lb.close());
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
    if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
  });
  let x0 = null;   // swipe
  lb.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
  lb.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 40) lbShow(lbIndex + (dx < 0 ? 1 : -1));
  });
})();
