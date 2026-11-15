/*
  TARMAC MOTORS — sample inventory for the preview mockup.

  EVERY value below is a SAMPLE. The photos are placeholders from our own past projects
  (see assets/img/PROVENANCE.md); prices, mileage and notes come from those projects'
  listings and are NOT Tarmac's cars. The page labels them "Sample" wherever they render.

  For AAN: on the platform this array is replaced by the live inventory feed.
  Fields the cards need: year, make, model, trim, price (null = "Call for price"),
  miles (null = not shown), transmission ('manual' | 'automatic' | null = not confirmed),
  transmissionLabel, note (one line), photos (paths, 5–10), status (null | 'coming-soon' | 'sold').
  SIMULATED VDP DATA (Alex: "take the cars from our dealer projects, it's a mockup"): each car's
  description, highlights, colours, VIN / stock number and video come from its real listing in our
  past projects (Tucson Classic Motor Co: assets/data/inventory.json; Gold Coast Motors:
  _dealer/inventory.json). Gold Coast listings had no copy, so their description is built from
  the facts in their listing titles. Videos are the source dealer's YouTube walkarounds.
  The VDP also reads vin: { body, engine, drivetrain } for its "VIN Decoded" table. SAMPLE values:
  public, model-level factory specs only (no VINs are invented); a field we can't be sure of is
  left out, and the row simply doesn't show. On the platform the VIN decoder fills this per car.
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
    vin: { body: '2-door liftback coupe', engine: '3.0L twin-turbo inline-6', drivetrain: 'Rear-wheel drive' },
    vinNumber: "JT2DE82A7W1003268",
    stock: "0968",
    exterior: "Quicksilver FX (Met)",
    interior: "Black",
    engineLabel: "3.0L Straight 6 Cylinder",
    description: [
      "Turbo with the six-speed manual, in Quicksilver FX metallic: one of only 24 built in this colour.",
      "The 3.0L twin-turbo straight-six, 43,501 miles, black interior.",
    ],
    status: null,
  },
  {
    id: '2015-porsche-911-gts',
    year: 2015, make: 'Porsche', model: '911', trim: 'Carrera GTS',
    price: 184900, miles: 10093,
    transmission: 'manual', transmissionLabel: '7-speed manual',
    note: 'Rear-drive coupe with the seven-speed manual.',
    photos: photoSet('2015-porsche-911-gts', 12),
    vin: { body: '2-door coupe', engine: '3.8L flat-6', drivetrain: 'Rear-wheel drive' },
    vinNumber: "WP0AB2A96FS124486",
    stock: "3522",
    exterior: "GT Silver Metallic",
    interior: "Black/Carmine Red",
    engineLabel: "3.8L Flat 6 Cylinder",
    description: [
      "991.1 Carrera GTS with the seven-speed manual and low miles, wrapped in full-car paint protection film.",
      "GT Silver Metallic over Black and Carmine Red, 3.8L flat-six, 10,093 miles.",
    ],
    status: null,
  },
  {
    id: '2006-hummer-h1-alpha',
    year: 2006, make: 'Hummer', model: 'H1', trim: 'Alpha',
    price: 234900, miles: 35720,
    transmission: 'automatic', transmissionLabel: 'Automatic',
    note: 'Alpha-generation H1 with the 6.6L Duramax diesel.',
    photos: simulatedSet('2006-hummer-h1-alpha'),  // SIMULATED: one real placeholder photo, repeated
    vin: { engine: '6.6L Duramax V8 turbo-diesel', drivetrain: 'Four-wheel drive' },
    vinNumber: "137PH843X6E220996",
    stock: "3351",
    exterior: "Black",
    interior: "Black/Brown",
    engineLabel: "6.6L 8 Cylinder",
    description: [
      "H1 Alpha wagon with Predator upgrades: a genuinely rare truck.",
      "6.6L Duramax V8 turbo-diesel and automatic, black over black and brown, 35,720 miles.",
    ],
    status: null,
  },
  {
    id: '2009-honda-s2000',
    year: 2009, make: 'Honda', model: 'S2000', trim: '',
    price: 69900, miles: 6188,
    transmission: 'manual', transmissionLabel: '6-speed manual',
    note: 'Berlina Black roadster with 6,188 miles.',
    photos: simulatedSet('2009-honda-s2000'),  // SIMULATED: one real placeholder photo, repeated
    vin: { body: '2-door roadster', engine: '2.2L inline-4', drivetrain: 'Rear-wheel drive' },
    vinNumber: "JHMAP21429S000045",
    stock: "3221",
    exterior: "Berlina Black",
    interior: "Black",
    engineLabel: "2.2L 4 Cylinder",
    description: [
      "A last-year S2000: one of 324, one owner, with only 6,188 miles.",
      "Berlina Black over black, 2.2L four-cylinder and the six-speed manual.",
    ],
    status: null,
  },
  {
    id: '1983-chevrolet-camaro-yenko-imsa',
    year: 1983, make: 'Chevrolet', model: 'Camaro', trim: 'Yenko IMSA',
    price: null, miles: null,
    transmission: 'manual', transmissionLabel: 'Manual',
    note: 'Wearing its period IMSA race livery.',
    photos: photoSet('1983-chevrolet-camaro-yenko-imsa', 12),
    vin: { body: '2-door coupe, tube chassis', engine: '310 cu in V8 (race-built)', drivetrain: 'Rear-wheel drive' },
    exterior: "White (IMSA livery)",
    interior: "Race cockpit",
    video: "zaV58Sem8Yc",
    description: [
      "Don Yenko, Jerry Thompson, and Chris Thompson, had been competing in the IMSA Camel GT and American Challenge series since the late 1970’s, in both Chevrolet Novas and Camaros. For 1983, IMSA changed their rules to allow cars to be built around a tube chassis. Dillon Race Works, out of Indiana, whose main business had been building tube frame cars for stock car racing, was selected to build this car. This was the first of several road race cars that Dillon would build. A similar Dillon built Camaro, driven by Gene Felton, dominated the IMSA “GTO” class in 1983 and 1984.",
      "This car was raced at numerous tracks across the U.S., including Daytona, Sebring, Lime Rock, Mid-Ohio, Sears Point, and Road Atlanta. In May of 1983, Don Yenko and Jerry Thompson finished 3rd in a Kelly American Challenge race at Lime Rock.",
      "In an interview with Jerry, he was quoted as saying “this was a very good race car, capable of winning, but Don and I did not have the financial backing as did Gene Felton and others. Back then, $10,000 was worth 30 horsepower, which was the difference between winning and losing“.",
      "In 1983, this car was state of the art, with its tube chassis, dry sump oil system, rack and pinion steering and quick change rear end. With IMSA having no rules on engine size, just that cars must weigh 10 pounds per cubic inch, the car ran both a V6 and a V8, depending on the length of the track. Except for the engine and transmission, the car retains most of its original parts, as it has been in storage in California since 1987. Ironically, the car was purchased from Gene Felton, who raced a similar car and competed against the #11 Camaro numerous times. This was the last car Don Yenko competitively raced.",
    ],
    highlights: [
      "Sold on Bill of Sale",
      "The last car to be competitively raced by Don Yenko",
      "Built by Dillon Race Works",
      "Raced at Daytona, Sebring, Lime Rock, Mid Ohio, Sears Point and Road Atlanta",
      "2nd Place at Pocono, 1983",
      "Don Yenko and Jerry Thompson finished 3rd at Kelly America Challenge at Lime Rock, 1983",
      "Tube chassis",
      "Dry sump oil system",
      "Rack and pinion steering",
      "Quick change rear end, 3.55 gear",
      "310 CI engine rebuilt and race-prepped by Joe Wambolt",
      "Kept in storage from 1987-2005",
      "Hoosier Slicks from 2015 but appear like new",
      "recent compression and Leak down tests performed",
    ],
    status: null,
  },
  {
    id: '2006-porsche-911-carrera-s',
    year: 2006, make: 'Porsche', model: '911', trim: 'Carrera S',
    price: 69790, miles: 50455,
    transmission: 'manual', transmissionLabel: '6-speed manual',
    note: 'Guards Red 997 Carrera S with the six-speed.',
    photos: simulatedSet('2006-porsche-911-carrera-s'),  // SIMULATED: one real placeholder photo, repeated
    vin: { body: '2-door coupe', engine: '3.8L flat-6', drivetrain: 'Rear-wheel drive' },
    vinNumber: "WP0AB29936S744068",
    stock: "3322",
    exterior: "Guards Red",
    interior: "Black",
    engineLabel: "3.8L Flat 6 Cylinder",
    description: [
      "997 Carrera S in Guards Red with the six-speed manual and the Sport Chrono package.",
      "3.8L flat-six, black interior, 50,455 miles.",
    ],
    status: null,
  },
  {
    id: '1995-chevrolet-corvette-pace-car',
    year: 1995, make: 'Chevrolet', model: 'Corvette', trim: 'Indy Pace Car',
    price: 32500, miles: 10708,
    transmission: 'automatic', transmissionLabel: '4-speed automatic',
    note: 'Indianapolis 500 Pace Car edition convertible.',
    photos: photoSet('1995-chevrolet-corvette-pace-car', 12),
    vin: { body: '2-door convertible', engine: '5.7L LT1 V8', drivetrain: 'Rear-wheel drive' },
    exterior: "Dark Purple Metallic / Arctic White",
    interior: "Black leather, purple inserts",
    video: "R6P4hHTd7u8",
    description: [
      "Always Garaged: This car has been stored in a climate-controlled garage under a premium car cover, entirely shielded from weather, UV rays, and moisture.",
      "Exterior: The factory two-tone Dark Purple Metallic and Arctic White paint shines like new. The original, bold Indy 500 door graphics and red accent pinstripes remain perfectly intact and crisp with no fading or cracking. There are a couple small flaws that I’ve taken close up pics of in the gallery.",
      "Interior: The unique black leather sport seats with vibrant purple inserts are in pristine condition with virtually no bolster wear. The headrests feature the beautifully embroidered official Indy 500 logos.",
      "Top: The original white vinyl soft top is in good shape, operates smoothly, and seals very well as an original should.",
      "Engine: Numbers-matching 5.7L LT1 V8 producing 300 horsepower. It starts immediately, runs flawlessly, and sounds exactly as it did leaving the showroom floor.",
      "Transmission: 4-speed automatic transmission with the factory-ordered 3.07 performance rear axle ratio.",
      "Wheels/Tires: Iconic 17-inch silver-painted 5-spoke aluminum wheels.",
      "Options: Fully loaded with the mandatory Preferred Equipment Group, including electronic climate control, dual power seats, and the premium Delco/Bose stereo system.",
      "Clean accident free Carfax, original owner’s manuals, selling Dealer plate, and original keys included.",
      "New Michelin Pilot Sport tires were installed less than 30 miles ago in 6/2023.",
    ],
    status: null,
  },
  {
    id: '2005-cadillac-xlr',
    year: 2005, make: 'Cadillac', model: 'XLR', trim: '',
    price: 24900, miles: 32000,
    transmission: 'automatic', transmissionLabel: 'Automatic',
    note: 'Retractable hardtop roadster with the Northstar V8.',
    photos: photoSet('2005-cadillac-xlr', 12),
    vin: { body: '2-door retractable-hardtop roadster', engine: '4.6L Northstar V8', drivetrain: 'Rear-wheel drive' },
    exterior: "Blue",
    interior: "Tan leather",
    video: "cz9KWNa0IdI",
    description: [
      "Impeccable Care: Always garaged, zero rust, no accidents, and smoke-free.",
      "Retractable Hardtop: The power-retractable hardtop operates smoothly and flawlessly, turning the sleek coupe into a stunning open-air roadster in seconds.",
      "Premium Features: Equipped with a heads-up display (HUD), adaptive cruise control, heated and cooled leather seats, Bose premium audio, and magnetic ride control.",
      "Mechanical Status: The 4.6L Northstar V8 runs beautifully with crisp shifting. Fresh oil change and inspection completed recently. Tires and brakes are in excellent shape.",
    ],
    status: null,
  },
  {
    id: '1973-lincoln-continental-town-coupe',
    year: 1973, make: 'Lincoln', model: 'Continental', trim: 'Town Coupe',
    price: null, miles: null,
    transmission: 'automatic', transmissionLabel: 'Automatic',
    note: 'Full-size two-door from the last of the big Lincolns.',
    photos: photoSet('1973-lincoln-continental-town-coupe', 12),
    vin: { body: '2-door hardtop coupe', engine: '7.5L (460 cu in) V8', drivetrain: 'Rear-wheel drive' },
    exterior: "Raven Black, black vinyl top",
    interior: "Black and camel leather",
    video: "uxCrvYlgxFY",
    description: [
      "1973 Lincoln Town coupe with only 25,047 miles since new. Optioned as a Premium town coupe and factory ordered in code 1c “Raven Black” and GA code Black Leather.",
      "This car had a show-quality repaint in its original color of Raven Black with a very high level of detail. Door jambs are as nice as the exterior and the car was fully sanded and Buffed to a mirror finish. All door, hood, and trunk gaps are excellent. The undercarriage retains all of its original floors, rockers, and trunk and reflect the condition of a true low mile vehicle.",
      "All exterior chrome and brightwork are in excellent condition. Windshield was replaced with a new one sourced from AGP, all other glass is original and in very good condition. The Vinyl top is original and in excellent condition minus one scratch on the Driver side C Pillar (pictured) The hide away headlight work great. All exterior lighting works.",
      "The interior was completely redone in high grade Leather and appears like new. Some custom touches were added like the two tone with camel Brown and Black, hand embroidered Lincoln Logos on seats and door panels. Very Well done. Power seats work great, AC blows cold, heat works, wipers work, AM FM stereo works as well. Power door locks function as intended and it has a trunk release in the glove box. Power windows all work great. All of the weatherstripping and seals are in very good condition. Trunk has been completely refinished and comes with a set of floormats. It has a super cool cup holder in forward console, the doors flip open when you turn the knob forward, glove box door opens when you turn the other way. The dashboard has no crack and is in amazing condition. Door panels are beautiful.",
      "Powered by a 460 V8 and C-6 automatic that at a minimum were removed from the car and resealed/ painted. Runs and drives amazing and the 460 just purrs. AC has been upgraded to R134a refrigerant. The under hood is fully detailed to show quality standards. The car is optioned with power steering and Power disc Brakes.",
      "Rolls On fully polished Factory Lincoln 15” aluminum Rims and Michelin Radials. I have seen a few of these era Lincolns but NEVER one restored to this level. True collector grade quality and you will certainly not find one nicer at any price.",
    ],
    status: 'coming-soon',
  },
  {
    id: '1963-ford-falcon',
    year: 1963, make: 'Ford', model: 'Falcon', trim: 'Futura',
    price: 18500, miles: null,
    transmission: 'automatic', transmissionLabel: 'Automatic',
    note: 'Early Falcon four-door sedan.',
    photos: photoSet('1963-ford-falcon', 12),
    vin: { body: '4-door sedan', engine: '260 cu in V8', drivetrain: 'Rear-wheel drive' },
    exterior: "Tucson Yellow, white insert",
    interior: "White and beige",
    video: "1mdxe1LPKBI",
    description: [
      "1963 Ford Falcon Futura 4 door sedan. Restored by a Falcon Club member and enthusiast in its very rare original specifications. Factory 260 V8 car with automatic transmission and originally sold new in Dallas Texas.",
      "Solid rust free car that retains all of its original, floors, trunk, and rockers. No evidence of any body panel replacement, everything fits very well. It was professionally repainted in its original color of “Tucson Yellow”, code “R” with a white 2 tone insert. All of the chrome and stainless is in very good shape. All weatherstripping is in good shape and all glass is very nice and functions with ease.",
      "The car retains its original 260 V8, very rare in a falcon. With the v8 came 5 lug big brakes all around, this car was upgraded with Mustang 4 piston disc brakes and dual master cylinder for added safety. The factory automatic transmission shifts great. Chrome American racing 15″ wheels make it look great and rides nice with the radial 225 50 R15 Kumho Ecstas. A heavy duty 3 core aluminum radiator and flex fan were installed recently, car cools great.",
      "The interior was completely redone to a very high standard in white with beige cloth seat inserts and beige carpet. A modern stereo was added in the glove box with Kick panel speakers and even a subwoofer system in trunk with amplifier. All seals and weatherstrips are in good shape.",
      "Well sorted Falcon ready to enjoy! Make it your daily driver or car show cruiser!",
    ],

    status: 'sold',
  },
];
