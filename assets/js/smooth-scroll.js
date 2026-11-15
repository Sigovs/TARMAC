/*
  TARMAC MOTORS: smooth scrolling (Lenis 1.3.27, loaded from unpkg in index.html).

  - Off for visitors who ask for reduced motion: they keep native scrolling.
  - Touch scrolling stays native (Lenis default), only wheel/trackpad is smoothed.
  - In-page links (#inventory, #sell, #contact ...) glide to their section and stop
    below the sticky header: Lenis reads the CSS scroll-padding-top (header + 16px).
  - Nested scrollers (card photo tracks, the mobile menu) keep their own scrolling.
  For AAN: optional. Remove this file and the two Lenis tags and the page scrolls natively.
*/
(function () {
  if (!window.Lenis) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lenis = new window.Lenis({
    autoRaf: true,
    allowNestedScroll: true,
    stopInertiaOnNavigate: true,
    anchors: false,            // handled below (pushes the hash, works with the overlay sections)
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link || e.defaultPrevented) return;
    const id = link.getAttribute('href');
    if (id.length < 2) return;
    const target = document.getElementById(id.slice(1));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target);
    history.pushState(null, '', id);
  });

  window.tarmacLenis = lenis;   // for debugging / AAN hooks
})();
