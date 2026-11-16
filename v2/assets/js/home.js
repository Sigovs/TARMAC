/*
  TARMAC MOTORS — shared page behaviour (preview mockup, no dependencies).
  Runs on index.html (home), inventory.html (SRP) and vehicle.html (VDP); every block checks
  that its elements exist.
  1. Inventory grid: keyword search + quick filters + sort, 2-up cards, photo swipe with arrows.
     Home shows 6 cards and links to the SRP; the SRP (data-limit="all") shows every car.
  2. Mobile menu (<dialog>), nav highlight, header bar.
  3. Side drawer (Ask / Text to Phone / Share) and preview forms: nothing is sent.
*/
(() => {
  const cars = window.TARMAC_INVENTORY || [];
  const HOME_LIMIT = 6; // cards shown on the home page before "Show all" (a link to the SRP)

  const grid = document.querySelector('[data-grid]');
  const search = document.querySelector('[data-search]');
  const filters = document.querySelector('[data-filters]');
  const sortSelect = document.querySelector('[data-sort]');
  const count = document.querySelector('[data-count]');
  const showAllBtn = document.querySelector('[data-show-all]');
  const limit = grid && grid.dataset.limit === 'all' ? Infinity : HOME_LIMIT;
  // the contact form lives on the home page; other pages link to it
  const contactHref = document.getElementById('contact') ? '#contact' : 'index.html#contact';

  /* ---------- icons (one stroke set, 24px grid) ---------- */
  const ICON = {
    manual: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 5v14M12 5v14M18 5v7H6"/><circle cx="6" cy="5" r="1.4"/><circle cx="12" cy="5" r="1.4"/><circle cx="18" cy="5" r="1.4"/><circle cx="6" cy="19" r="1.4"/><circle cx="12" cy="19" r="1.4"/></svg>',
    automatic: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="4.5" y="3" width="15" height="18" rx="2.5"/><path d="M12 7v10"/><circle cx="12" cy="10" r="2.4"/></svg>',
    miles: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4.5 16a8 8 0 1 1 15 0"/><path d="m12 13 3.5-4"/><circle cx="12" cy="13" r="1"/></svg>',
    prev: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m14.5 6-6 6 6 6"/></svg>',
    next: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m9.5 6 6 6-6 6"/></svg>',
    save: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/></svg>',
    text: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/></svg>',
    share: '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 15V3.5M7.5 8 12 3.5 16.5 8"/><path d="M5 12v7.5h14V12"/></svg>',
  };

  const money = (n) => '$' + n.toLocaleString('en-US');
  const name = (c) => [c.year, c.make, c.model, c.trim].filter(Boolean).join(' ');
  // Deep link per car (client: buyers share cars by text). VDP = vehicle.html, next in the build.
  const carURL = (c) => new URL(`vehicle.html?car=${encodeURIComponent(c.id)}`, location.href).href;

  // Saved cars: a per-visitor convenience, so localStorage is fine (wrapped: it can throw).
  const SAVED_KEY = 'tarmac-saved';
  const readSaved = () => { try { return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')); } catch { return new Set(); } };
  const writeSaved = (set) => { try { localStorage.setItem(SAVED_KEY, JSON.stringify([...set])); } catch { /* private mode */ } };
  const saved = readSaved();
  const statusRank = { null: 0, 'coming-soon': 1, sold: 2 };

  /* ---------- filtering ---------- */
  const matchesFilter = (c, f) => {
    switch (f) {
      case 'manual': return c.transmission === 'manual';
      case 'pre80': return c.year < 1980;
      case '80s': return c.year >= 1980 && c.year < 1990;
      case '90s': return c.year >= 1990 && c.year < 2000;
      case '00s': return c.year >= 2000;
      default: return true;
    }
  };

  const matchesQuery = (c, q) => {
    if (!q) return true;
    const hay = [name(c), c.transmissionLabel, c.note].join(' ').toLowerCase();
    return q.toLowerCase().split(/\s+/).every((word) => hay.includes(word));
  };

  // every sort keeps available cars first, then coming soon, then sold
  const byStatus = (a, b) => statusRank[a.status] - statusRank[b.status];
  const then = (fn) => (a, b) => byStatus(a, b) || fn(a, b);
  const sorters = {
    featured: byStatus,
    'year-desc': then((a, b) => b.year - a.year),
    'year-asc': then((a, b) => a.year - b.year),
    // cars without a price go last in both price sorts
    'price-asc': then((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity)),
    'price-desc': then((a, b) => (b.price ?? -1) - (a.price ?? -1)),
  };

  /* ---------- card markup ---------- */
  const cardHTML = (c) => {
    const title = name(c);
    const href = `vehicle.html?car=${encodeURIComponent(c.id)}`; // VDP: next page in the build
    const many = c.photos.length > 1;
    // Clicking a photo opens the VDP (Alex). The links stay out of the tab order: the title and
    // "Details" are the keyboard routes. A finger swipe scrolls the track and never counts as a click.
    const slides = c.photos.map((src, i) => `
      <li><a class="car__photo" href="${href}" tabindex="-1" aria-hidden="true"><img src="${src}" alt="${i === 0 ? title : `${title}, photo ${i + 1}`}" width="1600" height="1067"
        loading="${i === 0 ? 'eager' : 'lazy'}" decoding="async"></a></li>`).join('');

    const status = c.status === 'sold' ? 'Sold' : c.status === 'coming-soon' ? 'Coming soon' : '';
    const price = c.status === 'sold' ? 'Sold' : c.price ? money(c.price) : 'Call for price';

    const specs = [];
    if (c.transmission) specs.push(`<li>${ICON[c.transmission]}<span>${c.transmissionLabel}</span></li>`);
    if (c.miles != null) specs.push(`<li>${ICON.miles}<span>${c.miles.toLocaleString('en-US')} miles</span></li>`);

    return `
    <li class="car${c.status ? ' car--' + c.status : ''}" data-car>
      <div class="car__media">
        <ul class="car__track" data-track aria-label="Photos of ${title}">${slides}</ul>
        ${status ? `<span class="tag tag--status car__status">${status}</span>` : ''}
        ${many ? `
          <button class="car__arrow car__arrow--prev" type="button" data-prev aria-label="Previous photo of ${title}">${ICON.prev}</button>
          <button class="car__arrow car__arrow--next" type="button" data-next aria-label="Next photo of ${title}">${ICON.next}</button>
          <span class="car__count" data-counter aria-hidden="true">1 / ${c.photos.length}</span>` : ''}
      </div>
      <div class="car__body">
        <h3 class="car__title"><a href="${href}"><span class="car__year">${c.year} ${c.make}</span>${[c.model, c.trim].filter(Boolean).join(' ')}</a></h3>
        <p class="car__price">${price}</p>
        <ul class="car__specs">${specs.join('')}</ul>
        <p class="car__note">${c.note}</p>
      </div>
      <div class="car__actions">
        <button class="car__action" type="button" data-save="${c.id}" aria-pressed="${saved.has(c.id)}">${ICON.save}<span>${saved.has(c.id) ? 'Saved' : 'Save'}</span></button>
        <button class="car__action" type="button" data-drawer="text" data-car="${c.id}">${ICON.text}<span>Text to phone</span></button>
        <button class="car__action" type="button" data-drawer="share" data-car="${c.id}">${ICON.share}<span>Share</span></button>
        <a class="car__action car__action--details" href="${href}" aria-label="Details: ${title}"><span>Details</span>${ICON.next}</a>
      </div>
    </li>`;
  };

  /* ---------- render ---------- */
  const render = () => {
    const q = search.value.trim();
    const f = filters.querySelector('input:checked').value;
    const sorted = cars
      .filter((c) => matchesFilter(c, f) && matchesQuery(c, q))
      .sort(sorters[sortSelect.value] || sorters.featured);

    const browsing = !q && f === 'all';
    const visible = browsing ? sorted.slice(0, limit) : sorted;

    if (!sorted.length) {
      grid.innerHTML = `
        <li class="empty">
          <h3 class="car__title">No cars match${q ? ` “${escapeHTML(q)}”` : ' this filter'}</h3>
          <p>The lot changes often. Clear the search, or tell us what you’re looking for and we’ll keep an eye out.</p>
          <div class="empty__actions">
            <button class="button button--secondary" type="button" data-clear>Clear search</button>
            <a class="button button--primary" href="${contactHref}" data-topic="Looking for a car">Tell us what you want</a>
          </div>
        </li>`;
    } else {
      grid.innerHTML = visible.map(cardHTML).join('');
    }

    count.textContent = sorted.length === cars.length
      ? `${cars.length} cars`
      : `${sorted.length} of ${cars.length} cars`;

    if (showAllBtn) showAllBtn.hidden = sorted.length - visible.length <= 0;
  };

  const escapeHTML = (s) => s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  if (grid) {
  search.addEventListener('input', render);
  filters.addEventListener('change', render);
  sortSelect.addEventListener('change', render);
  document.querySelector('[data-finder]').addEventListener('submit', (e) => e.preventDefault());
  grid.addEventListener('click', (e) => {
    if (e.target.closest('[data-clear]')) {
      search.value = '';
      filters.querySelector('input[value="all"]').checked = true;
      render();
      search.focus();
    }
  });

  }

  /* ---------- Save (cards and the VDP); Text to phone / Share open the drawer (below) ---------- */
  document.addEventListener('click', (e) => {
    const saveBtn = e.target.closest('[data-save]');
    if (saveBtn) {
      const id = saveBtn.dataset.save;
      saved.has(id) ? saved.delete(id) : saved.add(id);
      writeSaved(saved);
      saveBtn.setAttribute('aria-pressed', saved.has(id));
      saveBtn.querySelector('span').textContent = saved.has(id) ? 'Saved' : 'Save';
      return;
    }
  });

  /* ---------- hero slides: manual prev / next, crossfade, wraps around. No autoplay (client). ---------- */
  const heroSlides = document.querySelector('[data-hero-slides]');
  const heroPager = document.querySelector('[data-hero-pager]');
  if (heroSlides && heroPager) {
    const slides = [...heroSlides.querySelectorAll('.hero__slide')];
    const indexEl = heroPager.querySelector('[data-hero-index]');
    const pad = (n) => String(n).padStart(2, '0');
    let current = 0;
    heroPager.querySelector('[data-hero-total]').textContent = pad(slides.length);
    const heroTitle = document.querySelector('.hero__title');
    const heroLede = document.querySelector('.hero__lede');
    let busy = false;
    // Each slide carries its own headline + lede (data-title / data-lede). With motion on,
    // motion.js animates the swap (window.tarmacHeroSwap: old lines rise out, new lines rise in,
    // same move as the intro). Without it (reduced motion, module blocked) the text just changes.
    const swapCopy = (img) => {
      const t = img.dataset.title, l = img.dataset.lede;
      if (!t || !heroTitle || heroTitle.textContent.trim() === t) return Promise.resolve();
      if (window.tarmacHeroSwap) return window.tarmacHeroSwap(t, l);
      heroTitle.textContent = t;
      if (heroLede && l) heroLede.textContent = l;
      return Promise.resolve();
    };
    const show = (i) => {
      if (busy) return;   // one change at a time: the text swap takes ~0.4 s before the next can start
      busy = true;
      current = (i + slides.length) % slides.length;
      slides.forEach((img, k) => {
        img.classList.toggle('is-active', k === current);
        if (k === current) img.removeAttribute('aria-hidden'); else img.setAttribute('aria-hidden', 'true');
        if (k === current) img.loading = 'eager';
      });
      indexEl.textContent = pad(current + 1);
      swapCopy(slides[current]).finally(() => { busy = false; });
    };
    heroPager.querySelector('[data-hero-prev]').addEventListener('click', () => show(current - 1));
    heroPager.querySelector('[data-hero-next]').addEventListener('click', () => show(current + 1));
    if (slides.length > 1) heroPager.hidden = false;
  }

  /* ---------- card photo swipe: native scroll-snap, arrows step one photo ----------
     Both arrows are always shown (Alex) and wrap around: next on the last photo goes back
     to the first, prev on the first goes to the last. */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-car] [data-prev], [data-car] [data-next]');
    if (!btn) return;
    const track = btn.closest('[data-car]').querySelector('[data-track]');
    const total = track.children.length;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    const step = btn.hasAttribute('data-next') ? 1 : -1;
    const target = (i + step + total) % total;
    track.scrollTo({ left: target * track.clientWidth, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  });

  // keep the counter in step with swipes and arrow clicks
  document.addEventListener('scroll', (e) => {
    const track = e.target;
    if (!track.matches || !track.matches('[data-track]')) return;
    const card = track.closest('[data-car]');
    const total = track.children.length;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    const counter = card.querySelector('[data-counter]');
    if (counter) counter.textContent = `${i + 1} / ${total}`;
  }, true); // capture: scroll events do not bubble

  if (grid) render();

  /* ---------- mobile menu ---------- */
  const menu = document.getElementById('menu');
  document.querySelector('[data-menu-open]').addEventListener('click', () => menu.showModal());
  menu.querySelector('[data-menu-close]').addEventListener('click', () => menu.close());
  menu.querySelectorAll('[data-menu-link]').forEach((a) => a.addEventListener('click', () => menu.close()));

  /* ---------- nav: sliding highlight + "you are here" ----------
     The pill slides to the hovered link; otherwise it rests on the link of the section
     currently crossing the middle of the screen (aria-current="true"). */
  const navList = document.querySelector('.nav__list');
  const pill = navList && navList.querySelector('.nav__pill');
  if (navList && pill) {
    const links = [...navList.querySelectorAll('a')];
    const hashLinks = links.filter((a) => a.getAttribute('href').startsWith('#'));
    let current = navList.querySelector('a[aria-current="page"]');   // SRP / VDP mark their page
    const moveTo = (a) => {
      if (!a) { pill.classList.remove('is-on'); return; }
      const box = navList.getBoundingClientRect(), r = a.getBoundingClientRect();
      pill.style.setProperty('--pill-x', `${r.left - box.left - navList.clientLeft}px`);
      pill.style.setProperty('--pill-w', `${r.width}px`);
      pill.classList.add('is-on');
    };
    links.forEach((a) => {
      a.addEventListener('mouseenter', () => moveTo(a));
      a.addEventListener('focus', () => moveTo(a));
    });
    navList.addEventListener('mouseleave', () => moveTo(current));
    navList.addEventListener('focusout', (e) => { if (!navList.contains(e.relatedTarget)) moveTo(current); });

    // scroll-spy: which nav target is in the middle band of the screen
    const targets = hashLinks.map((a) => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const link = hashLinks.find((a) => a.getAttribute('href') === `#${en.target.id}`);
        hashLinks.forEach((a) => a.removeAttribute('aria-current'));
        if (link) link.setAttribute('aria-current', 'true');
        current = link || null;
        if (!navList.matches(':hover')) moveTo(current);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach((t) => spy.observe(t));
    // the hero (top of the page) has no nav item: clear the highlight there
    const hero = document.querySelector('.hero');
    if (hero) new IntersectionObserver(([en]) => {
      if (en.isIntersecting && en.intersectionRatio > 0.5) {
        hashLinks.forEach((a) => a.removeAttribute('aria-current'));
        current = null;
        if (!navList.matches(':hover')) moveTo(null);
      }
    }, { threshold: [0.5] }).observe(hero);
    window.addEventListener('resize', () => moveTo(navList.matches(':hover') ? null : current));
    if (current) requestAnimationFrame(() => moveTo(current));
  }

  /* ---------- header bar appears after the page starts scrolling ---------- */
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    document.documentElement.classList.add('js-header');
    const overHero = !!document.querySelector('.hero');   // only the home page starts transparent
    const onScroll = () => siteHeader.classList.toggle('is-scrolled', !overHero || window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- "Ask about storage" etc. prefill the contact message ---------- */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-topic]');
    if (!link) return;
    const msg = document.querySelector('[data-message]');
    if (msg && !msg.value) msg.value = `${link.dataset.topic}: `;
  });

  /* ---------- Sell form: Year dropdown, newest first (next model year down to 1950, then "Older") ---------- */
  document.querySelectorAll('[data-year-select]').forEach((select) => {
    const top = new Date().getFullYear() + 1;
    const frag = document.createDocumentFragment();
    for (let y = top; y >= 1950; y -= 1) frag.append(new Option(String(y), String(y)));
    frag.append(new Option('Older', 'older'));
    select.append(frag);
  });

  /* ---------- forms: preview only ---------- */
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('[data-preview-form]');
    if (!form) return;
    e.preventDefault();
    const status = form.querySelector('[data-form-status]');
    // Preview: nothing is sent. On the platform this posts to the dealer's lead inbox (or SMS / mailer).
    status.textContent = form.dataset.success || 'Thanks, we’ll get back to you soon.';
    status.classList.add('is-done');
    form.reset();
  });

  /* ---------- side drawer: Ask About Services / Storage, Text to Phone, Share ----------
     One <dialog> (focus trap + Esc), content cloned from <template id="tpl-…">. Slides in from
     the right; under reduced motion it simply appears. Page scroll is held while it is open. */
  const drawer = document.getElementById('drawer');
  if (drawer) {
    const body = drawer.querySelector('[data-drawer-body]');
    const titleEl = drawer.querySelector('#drawer-title');
    const quiet = window.matchMedia('(prefers-reduced-motion: reduce)');
    const TITLES = { services: 'Ask About Services', storage: 'Ask About Storage', text: 'Text to Phone', share: 'Share This Car', car: 'Ask About This Car' };
    let opener = null;

    const fill = (car) => {
      if (!car) return;
      const title = name(car);
      const url = carURL(car);
      const msg = `${title} at Tarmac Motors: ${url}`;
      const price = car.status === 'sold' ? 'Sold' : car.price ? money(car.price) : 'Call for price';
      body.querySelectorAll('[data-car-title]').forEach((el) => { el.textContent = title; });
      body.querySelectorAll('[data-car-price]').forEach((el) => { el.textContent = price; });
      body.querySelectorAll('[data-car-img]').forEach((el) => { el.src = car.photos[0]; });
      body.querySelectorAll('[data-car-message]').forEach((el) => { el.textContent = msg; });
      body.querySelectorAll('[data-car-question]').forEach((el) => { el.value = `Hi, is the ${title} still available?`; });
      body.querySelectorAll('[data-car-sms]').forEach((el) => { el.href = `sms:?&body=${encodeURIComponent(msg)}`; });
      body.querySelectorAll('[data-car-mailto]').forEach((el) => {
        el.href = `mailto:?subject=${encodeURIComponent(`${title} at Tarmac Motors`)}&body=${encodeURIComponent(msg)}`;
      });
      const native = body.querySelector('[data-native-share]');
      if (native && navigator.share) {
        native.hidden = false;
        native.addEventListener('click', () => navigator.share({ title, url }).catch(() => {}));
      }
      const copy = body.querySelector('[data-copy-link]');
      if (copy) copy.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(url); copy.textContent = 'Link copied'; }
        catch { copy.textContent = 'Copy failed'; }
        setTimeout(() => { copy.textContent = 'Copy link'; }, 2000);
      });
      body.querySelectorAll('[data-drawer-switch]').forEach((b) => {
        b.addEventListener('click', () => render(b.dataset.drawerSwitch, car));
      });
    };

    const render = (kind, car) => {
      const tpl = document.getElementById(`tpl-${kind}`);
      if (!tpl) return false;
      titleEl.textContent = TITLES[kind];
      body.replaceChildren(tpl.content.cloneNode(true));
      fill(car);
      body.scrollTop = 0;
      const first = body.querySelector('input:not([type=checkbox]):not([type=radio]), textarea');
      if (first && drawer.open) first.focus({ preventScroll: true });
      return true;
    };

    const open = (kind, car, from) => {
      if (!render(kind, car)) return;
      opener = from || null;
      drawer.showModal();
      document.documentElement.classList.add('has-drawer');
      if (window.tarmacLenis) window.tarmacLenis.stop();
      drawer.getBoundingClientRect();   // commit the off-screen start position before sliding in
      requestAnimationFrame(() => requestAnimationFrame(() => drawer.classList.add('is-open')));
    };

    let closedByKey = false;
    const close = () => {
      if (!drawer.open) return;
      drawer.classList.add('is-closing');
      drawer.classList.remove('is-open');
      const done = () => {
        drawer.classList.remove('is-closing');
        drawer.close();
        document.documentElement.classList.remove('has-drawer');
        if (window.tarmacLenis) window.tarmacLenis.start();
        if (opener) {
          // back to the button that opened it; show the focus ring only if the visitor used the keyboard
          if (!closedByKey) {
            opener.classList.add('no-ring');
            opener.addEventListener('blur', () => opener.classList.remove('no-ring'), { once: true });
          }
          opener.focus({ preventScroll: true });
        }
        closedByKey = false;
      };
      if (quiet.matches) { done(); return; }
      setTimeout(done, 420);   // = --drawer-out in site.css
    };

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-drawer]');
      if (trigger) {
        e.preventDefault();
        const car = trigger.dataset.car ? cars.find((c) => c.id === trigger.dataset.car) : null;
        open(trigger.dataset.drawer, car, trigger);
      }
    });
    drawer.querySelector('[data-drawer-close]').addEventListener('click', close);
    drawer.addEventListener('cancel', (e) => { e.preventDefault(); closedByKey = true; close(); });   // Esc
    drawer.querySelector('[data-drawer-close]').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') closedByKey = true;
    });
    drawer.addEventListener('click', (e) => { if (e.target === drawer) close(); });          // backdrop
  }

  /* ---------- custom dropdowns (Alex: the browser's own list looked foreign) ----------
     Each .field <select> gets a button + listbox in the site's style. The native <select> stays
     in the form (visually hidden) and keeps the value, so filters, forms and reset work as before.
     Keyboard: ↑/↓, Home/End, Enter/Space, Esc, type-ahead. Touch devices keep the native picker. */
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const CHEVRON = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"/></svg>';
  const CHECK = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m5.5 12.5 4 4 9-9"/></svg>';
  let ddCount = 0;
  let openDD = null;

  const enhanceSelect = (select) => {
    if (select.dataset.dd) return;
    select.dataset.dd = 'on';
    const uid = `dd-${++ddCount}`;
    const wrap = document.createElement('div');
    wrap.className = 'dd';
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'dd__trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', `${uid}-list`);
    const label = select.closest('label')?.querySelector('.field__label, .visually-hidden');
    if (label) { label.id = label.id || `${uid}-label`; trigger.setAttribute('aria-labelledby', `${label.id} ${uid}-value`); }
    trigger.innerHTML = `<span class="dd__value" id="${uid}-value"></span>${CHEVRON}`;
    const list = document.createElement('ul');
    list.className = 'dd__list';
    list.id = `${uid}-list`;
    list.setAttribute('role', 'listbox');
    list.setAttribute('data-lenis-prevent', '');
    if (label) list.setAttribute('aria-labelledby', label.id);
    list.hidden = true;

    select.classList.add('dd__native');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');
    select.after(wrap);
    wrap.append(trigger, list);

    const options = () => [...list.children];
    const build = () => {
      // the empty "Select" option is the nothing-chosen state, not a choice: it stays out of the list
      list.innerHTML = [...select.options].map((o, i) => (o.value === '' ? '' :
        `<li role="option" id="${uid}-o${i}" data-i="${i}" tabindex="-1" aria-selected="${o.selected}">${CHECK}<span>${o.textContent}</span></li>`)).join('');
    };
    const sync = () => {
      const o = select.options[select.selectedIndex];
      trigger.querySelector('.dd__value').textContent = o ? o.textContent : '';
      trigger.classList.toggle('is-placeholder', !!o && o.value === '');
      options().forEach((li) => li.setAttribute('aria-selected', String(+li.dataset.i === select.selectedIndex)));
    };
    const focusOpt = (pos) => {   // position in the visible list
      const opts = options();
      const n = Math.max(0, Math.min(opts.length - 1, pos));
      opts[n].focus({ preventScroll: true });
      opts[n].scrollIntoView({ block: 'nearest' });
    };
    const posOf = (optionIndex) => Math.max(0, options().findIndex((li) => +li.dataset.i === optionIndex));
    const open = () => {
      if (openDD && openDD !== close) openDD();
      build(); sync();
      list.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      wrap.classList.add('is-open');
      // flip up when there isn't room below
      const r = trigger.getBoundingClientRect();
      wrap.classList.toggle('dd--up', window.innerHeight - r.bottom < Math.min(list.scrollHeight, 300) + 16 && r.top > 320);
      focusOpt(posOf(select.selectedIndex));
      openDD = close;
    };
    function close(refocus = true) {
      if (list.hidden) return;
      list.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      wrap.classList.remove('is-open', 'dd--up');
      if (refocus) trigger.focus({ preventScroll: true });
      if (openDD === close) openDD = null;
    }
    const choose = (i) => {
      if (select.selectedIndex !== i) {
        select.selectedIndex = i;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      sync();
      close();
    };

    trigger.addEventListener('click', (e) => { e.preventDefault(); list.hidden ? open() : close(); });
    trigger.addEventListener('keydown', (e) => {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); open(); }
    });
    list.addEventListener('click', (e) => {
      const li = e.target.closest('[role="option"]');
      if (li) choose(+li.dataset.i);
    });
    let typed = '', typedAt = 0;
    list.addEventListener('keydown', (e) => {
      const cur = options().indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); focusOpt(cur + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); focusOpt(cur - 1); }
      else if (e.key === 'Home') { e.preventDefault(); focusOpt(0); }
      else if (e.key === 'End') { e.preventDefault(); focusOpt(options().length - 1); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (cur >= 0) choose(+options()[cur].dataset.i); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
      else if (e.key === 'Tab') { close(false); }
      else if (e.key.length === 1) {   // type-ahead
        const now = Date.now();
        typed = (now - typedAt > 700 ? '' : typed) + e.key.toLowerCase();
        typedAt = now;
        const hit = options().findIndex((li) => li.textContent.trim().toLowerCase().startsWith(typed));
        if (hit >= 0) focusOpt(hit);
      }
    });
    select.addEventListener('change', sync);
    select.form?.addEventListener('reset', () => setTimeout(sync));
    sync();
  };

  document.addEventListener('pointerdown', (e) => {
    if (openDD && !e.target.closest('.dd')) openDD(false);
  });
  window.addEventListener('resize', () => { if (openDD) openDD(false); });

  const enhanceAll = (scope = document) => {
    if (!finePointer.matches) return;
    scope.querySelectorAll('.field select').forEach(enhanceSelect);
  };
  enhanceAll();
  window.tarmacEnhanceSelects = enhanceAll;   // vdp / drawer content can call it after rendering
})();
