/*
  TARMAC MOTORS — sample inventory for the preview mockup.

  EVERY value below is a SAMPLE. The photos are placeholders from our own past projects
  (see assets/img/PROVENANCE.md); prices, mileage and notes come from those projects'
  listings and are NOT Tarmac's cars. The page labels them "Sample" wherever they render.

  For AAN: on the platform this array is replaced by the live inventory feed.
  Fields the cards need: year, make, model, trim, price (null = "Call for price"),
  miles (null = not shown), transmission ('manual' | 'automatic' | null = not confirmed),
  transmissionLabel, note (one line), photos (paths, 5–10), status (null | 'coming-soon' | 'sold').
*/

const photoSet = (slug, count, max = 10) =>
  Array.from({ length: Math.min(count, max) }, (_, i) =>
    `assets/img/inv/${slug}/${String(i + 1).padStart(2, '0')}.jpg`);

// SIMULATED for the mockup (Alex: every card shows photo arrows): cars we only have one
// placeholder photo for repeat it so the gallery, arrows and counter behave like a real listing.
const simulatedSet = (slug, count = 6) =>
  Array.from({ length: count }, () => `assets/img/inv/${slug}/01.jpg`);

window.TARMAC_INVENTORY = [
  {
    id: '1998-toyota-supra-turbo',
    year: 1998, make: 'Toyota', model: 'Supra', trim: 'Turbo',
    price: 279900, miles: 43501,
    transmission: 'manual', transmissionLabel: '6-speed manual',
    note: 'Fourth-generation Turbo with the six-speed gearbox.',
    photos: photoSet('1998-toyota-supra-turbo', 12),
    status: null,
  },
  {
    id: '2015-porsche-911-gts',
    year: 2015, make: 'Porsche', model: '911', trim: 'Carrera GTS',
    price: 184900, miles: 10093,
    transmission: 'manual', transmissionLabel: '7-speed manual',
    note: 'Rear-drive coupe with the seven-speed manual.',
    photos: photoSet('2015-porsche-911-gts', 12),
    status: null,
  },
  {
    id: '2006-hummer-h1-alpha',
    year: 2006, make: 'Hummer', model: 'H1', trim: 'Alpha',
    price: 234900, miles: 35720,
    transmission: 'automatic', transmissionLabel: 'Automatic',
    note: 'Alpha-generation H1 with the 6.6L Duramax diesel.',
    photos: simulatedSet('2006-hummer-h1-alpha'),  // SIMULATED: one real placeholder photo, repeated
    status: null,
  },
  {
    id: '2009-honda-s2000',
    year: 2009, make: 'Honda', model: 'S2000', trim: '',
    price: 69900, miles: 6188,
    transmission: 'manual', transmissionLabel: '6-speed manual',
    note: 'Berlina Black roadster with 6,188 miles.',
    photos: simulatedSet('2009-honda-s2000'),  // SIMULATED: one real placeholder photo, repeated
    status: null,
  },
  {
    id: '1983-chevrolet-camaro-yenko-imsa',
    year: 1983, make: 'Chevrolet', model: 'Camaro', trim: 'Yenko IMSA',
    price: null, miles: null,
    transmission: null, transmissionLabel: 'Transmission TBC',
    note: 'Wearing its period IMSA race livery.',
    photos: photoSet('1983-chevrolet-camaro-yenko-imsa', 12),
    status: null,
  },
  {
    id: '2006-porsche-911-carrera-s',
    year: 2006, make: 'Porsche', model: '911', trim: 'Carrera S',
    price: 69790, miles: 50455,
    transmission: 'manual', transmissionLabel: '6-speed manual',
    note: 'Guards Red 997 Carrera S with the six-speed.',
    photos: simulatedSet('2006-porsche-911-carrera-s'),  // SIMULATED: one real placeholder photo, repeated
    status: null,
  },
  {
    id: '1995-chevrolet-corvette-pace-car',
    year: 1995, make: 'Chevrolet', model: 'Corvette', trim: 'Indy Pace Car',
    price: 32500, miles: null,
    transmission: null, transmissionLabel: 'Transmission TBC',
    note: 'Indianapolis 500 Pace Car edition convertible.',
    photos: photoSet('1995-chevrolet-corvette-pace-car', 12),
    status: null,
  },
  {
    id: '2005-cadillac-xlr',
    year: 2005, make: 'Cadillac', model: 'XLR', trim: '',
    price: 24900, miles: 32000,
    transmission: 'automatic', transmissionLabel: 'Automatic',
    note: 'Retractable hardtop roadster with the Northstar V8.',
    photos: photoSet('2005-cadillac-xlr', 12),
    status: null,
  },
  {
    id: '1973-lincoln-continental-town-coupe',
    year: 1973, make: 'Lincoln', model: 'Continental', trim: 'Town Coupe',
    price: null, miles: null,
    transmission: 'automatic', transmissionLabel: 'Automatic',
    note: 'Full-size two-door from the last of the big Lincolns.',
    photos: photoSet('1973-lincoln-continental-town-coupe', 12),
    status: 'coming-soon',
  },
  {
    id: '1963-ford-falcon',
    year: 1963, make: 'Ford', model: 'Falcon', trim: '',
    price: 18500, miles: null,
    transmission: null, transmissionLabel: 'Transmission TBC',
    note: 'Early Falcon four-door sedan.',
    photos: photoSet('1963-ford-falcon', 12),
    status: 'sold',
  },
];
