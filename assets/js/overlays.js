/*
  TARMAC MOTORS: overlay sections (see ".overlay" in site.css).
  A pinned section sticks while the next one slides over it as a rounded sheet.

  --pin-top: where the section pins.
    - Under the header (header height), or higher when the section is taller than the
      screen, so it scrolls to its bottom first and its CTA is never hidden.
    - The hero runs under the transparent header, so it pins from the very top (0).
  --pin-hold: extra scroll during which the pinned section stays fully readable.
    Only for sections that fill the screen; a shorter one (the stacked hero on phones)
    gets 0, otherwise an empty gap would show under it.
*/
(function () {
  const pins = [...document.querySelectorAll('.overlay__pin')];
  if (!pins.length) return;
  const header = document.querySelector('.site-header');
  const update = () => {
    const hh = header ? header.offsetHeight : 0;
    const vh = window.innerHeight;
    pins.forEach((pin) => {
      const h = pin.offsetHeight;
      const base = pin.classList.contains('hero') ? 0 : hh;
      const top = Math.min(base, vh - h);
      pin.style.setProperty('--pin-top', `${Math.round(top)}px`);
      const fillsScreen = top + h >= vh - 2;
      if (fillsScreen) pin.style.removeProperty('--pin-hold');
      else pin.style.setProperty('--pin-hold', '0px');
    });
  };
  update();
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
})();
