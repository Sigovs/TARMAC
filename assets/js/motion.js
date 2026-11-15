/*
  TARMAC MOTORS — page motion (Anime.js 4.5.0).

  Client brief: "Less animations on the site the better" (Kirsten's notes); Blake disliked sites
  where everything would "bounce and move around" (Zoom, 00:22). So: two moves on load, on one
  ease (--m-ease) with no overshoot, each played once. The photos, header and navigation never
  move. (Scroll feel = Lenis in smooth-scroll.js; section overlays = CSS sticky in site.css.)

    Hero (on load, elements marked [data-intro]):
       - the headline rises line by line out of its own masks;
       - the two hero buttons (CTAs) pull in from the right, one after the other.

  Why Anime.js: splitText splits the headline into real lines and re-splits after the web
  font loads and on resize, which a build-free page can't do reliably by hand.

  Safety: start states exist only under html.js-motion (set in <head> when reduced motion is
  off); if this module fails to load, an inline timeout in index.html removes that class and
  the page shows as it is. Reduced motion = the static page. All timings are CSS tokens (--m-*).
  For AAN: drop this file and the page is complete without it.
*/
import { animate, splitText, stagger, utils, createScope }
  from 'https://cdn.jsdelivr.net/npm/animejs@4.5.0/+esm';

const root = document.documentElement;
root.classList.add('anime-on');

const tokens = getComputedStyle(root);
const token = (name) => tokens.getPropertyValue(name).trim();
const ms = (name) => parseFloat(token(name));
const EASE = token('--m-ease') || 'out(4)';

createScope({ mediaQueries: { reduce: '(prefers-reduced-motion: reduce)' } })
  .add(({ matches }) => {
    if (matches.reduce || !root.classList.contains('js-motion')) {
      // Reduced motion: the static page, nothing hidden, nothing moving.
      root.classList.remove('js-motion');
      return;
    }

    const cleanups = [];
    const STAGGER = ms('--m-stagger');
    const t0 = performance.now();
    const at = (t) => Math.max(0, t - (performance.now() - t0));  // keep the schedule if the font arrives late

    /* ---------- 1a. hero headline: lines rise out of their masks once the font has loaded ---------- */
    const title = document.querySelector('.hero__title[data-intro]');
    let titleSplit = null;
    if (title) {
      let played = false;
      const split = splitText(title, { lines: { wrap: 'clip' } });
      titleSplit = split;
      split.addEffect(({ lines }) => {
        if (!lines.length) return;
        if (played) { title.classList.add('m-in'); return; }   // re-split on resize: no replay
        played = true;
        utils.set(lines, { y: '105%' });
        title.classList.add('m-in');
        return animate(lines, {
          y: '0%',
          duration: ms('--m-enter'),
          ease: EASE,
          delay: stagger(STAGGER, { start: at(100) }),
        });
      });
      cleanups.push(() => titleSplit && titleSplit.revert());
    }

    /* ---------- 1c. hero slide change (home.js calls this on prev / next) ----------
       The same move as the intro, so the page has one motion language: the old headline lines
       rise out of their masks, the new ones rise in; the lede steps out and back in. The photo
       crossfade with its short settle is CSS (.hero__slide). Clicks only, never autoplay. */
    const lede = document.querySelector('.hero__lede');
    const OUT = ms('--m-swap-out');
    window.tarmacHeroSwap = async (newTitle, newLede) => {
      if (!title) return;
      const outs = [];
      if (titleSplit && titleSplit.lines.length) {
        outs.push(animate(titleSplit.lines, { y: '-105%', duration: OUT, ease: 'in(3)', delay: stagger(50) }));
      }
      if (lede) outs.push(animate(lede, { opacity: 0, y: -10, duration: OUT * 0.8, ease: 'in(3)' }));
      await Promise.all(outs.map((anim) => new Promise((done) => anim.then(done))));

      if (titleSplit) titleSplit.revert();
      title.textContent = newTitle;
      if (lede && newLede) lede.textContent = newLede;

      let played = false;
      titleSplit = splitText(title, { lines: { wrap: 'clip' } });
      titleSplit.addEffect(({ lines }) => {
        if (!lines.length || played) return;   // re-split on resize: no replay
        played = true;
        utils.set(lines, { y: '105%' });
        return animate(lines, { y: '0%', duration: ms('--m-enter'), ease: EASE, delay: stagger(STAGGER) });
      });
      if (lede) animate(lede, { opacity: { from: 0, to: 1 }, y: { from: 14, to: 0 }, duration: ms('--m-enter'), ease: EASE, delay: 140 });
    };
    cleanups.push(() => { delete window.tarmacHeroSwap; });

    /* ---------- 1b. hero buttons pull in from the right, after the headline ---------- */
    const actions = document.querySelector('.hero__actions[data-intro]');
    if (actions) {
      const buttons = [...actions.children];
      utils.set(buttons, { opacity: 0, x: token('--m-arrive-x') });
      actions.classList.add('m-in');
      animate(buttons, {
        x: 0,
        opacity: { to: 1, duration: ms('--m-arrive') * 0.6 },
        duration: ms('--m-arrive'),
        ease: EASE,
        delay: stagger(90, { start: 500 }),
      });
    }

    return () => cleanups.forEach((fn) => fn());
  });
