export const siteContent = {
  businessName: 'Ganpati',
  businessSubtitle: 'Driving Training School',
  locationTag: 'Sidhbari • Dharamshala • Himachal Pradesh',
  phoneDisplay: '98820 51705',
  /** International digits only (no + or spaces) for wa.me links */
  whatsappNumber: '919882051705',
  address: 'Tapovan Road, Sidhbari',
  mapUrl: 'https://maps.google.com/?q=Tapovan+Road+Sidhbari+Dharamshala',
  /** Optional: paste Google Maps “Embed a map” iframe src here; otherwise built from address */
  mapEmbedUrl: '',
  hero: {
    title: 'Every hairpin bend,',
    titleEmphasis: 'mastered',
    titleEnd: '— before you ever need it.',
    description:
      'Ganpati Driving Training School trains you on the very hill roads of Dharamshala, so the day you drive alone, nothing feels unfamiliar. Patient instructors, one car, your full attention.',
  },
  stats: [
    { label: '4.9 / 5 rating', icon: '★' },
    { label: 'Govt Approved', icon: '✓' },
    { label: 'Real Hill Roads', icon: '⛰' },
    { label: 'Open Daily', icon: '◷' },
  ],
  whyUs: {
    heading: "Confidence isn't taught in a parking lot.",
    subheading:
      "It's built on real inclines, real switchbacks and real traffic — the same roads you'll drive on the day you're on your own.",
    items: [
      {
        n: '01',
        title: "Trains you on Dharamshala's actual roads",
        text:
          "Steep climbs, hairpins and narrow Sidhbari lanes — you'll master the terrain you'll really be driving, not a flat practice ground.",
      },
      {
        n: '02',
        title: 'One instructor, one learner, one car',
        text:
          'No batches, no waiting your turn in a shared vehicle. Every minute behind the wheel is yours.',
      },
      {
        n: '03',
        title: 'Extra patient with first-time drivers',
        text:
          'Nervous beginners and first-time women drivers are given extra time and calm, step-by-step instruction.',
      },
      {
        n: '04',
        title: '4.9★ from 189 real learners',
        text:
          'One of the highest-rated driving schools in the Dharamshala area — reputation built lesson by lesson.',
      },
      {
        n: '05',
        title: 'Transparent, honest pricing',
        text:
          'One fee, clearly explained upfront. No hidden charges, no surprise "extra lesson" fees.',
      },
      {
        n: '06',
        title: 'Centrally located, easy to reach',
        text:
          'Right on Tapovan Road near the Clock Tower, Sidhbari — simple to find, simple to get to.',
      },
    ],
  },
  fleet: {
    heading: 'A car sized for confidence, not intimidation.',
    description:
      "You'll train in our well-maintained Maruti Alto 800 — light, easy to judge on narrow hill lanes, and forgiving for a first-time driver. Dual awareness, calm instruction, real roads.",
    details: [
      { label: 'Vehicle', value: 'Maruti Suzuki Alto 800' },
      { label: 'Registration', value: 'HP 40C 7038' },
      { label: 'Transmission', value: 'Manual — the license that opens every car' },
      { label: 'Maintained', value: 'Regularly serviced & sanitised' },
    ],
  },
  reviews: {
    heading: 'What learners keep telling Google.',
    quotes: [
      '"I was terrified of the hill turns near Sidhbari — after two weeks here I actually look forward to them."',
      '"Patient instructor, no rush, no shouting. Exactly what a nervous first-time driver needs."',
      '"Booked the demo just to test the waters, ended up signing up for the full 25-day course the same evening."',
    ],
  },
  cta: {
    heading: 'The road to your license starts with one ₹400 ride.',
    text: 'No pressure, no long forms — book a demo, meet your instructor, and decide from there.',
  },
  footerTagline:
    'HP Govt approved driving training in Sidhbari, Dharamshala. Real roads, real confidence, one learner at a time.',
  whatsappDefaultMessage:
    'Hi, I am interested in booking a driving lesson. Could you please share the available slots?',
  lessons: [
    {
      id: 'trial-demo',
      slug: 'trial-demo',
      name: 'Trial Demo Ride',
      badge: 'ONE DAY',
      subtitle: 'A single guided session',
      price: 400,
      durationLabel: '1 Day',
      features: [
        'One full driving session',
        'Feel the car, meet your instructor',
        'No commitment required',
        'Amount adjusts into full course if you continue',
      ],
    },
    {
      id: 'standard-course',
      slug: 'standard-course',
      name: 'Standard Course',
      badge: '15 DAYS',
      subtitle: 'Daily practice sessions',
      price: 4500,
      durationLabel: '15 Days',
      features: [
        '15 days of one-on-one training',
        'City roads, hill roads & parking',
        'Flexible morning / evening slots',
        'Ideal for quick, focused learners',
      ],
    },
    {
      id: 'complete-course',
      slug: 'complete-course',
      name: 'Complete Course',
      badge: '200 KM · 25 DAYS',
      subtitle: 'Our most thorough program',
      price: 7500,
      durationLabel: '25 Days',
      features: [
        '200 KM of real, logged driving practice',
        'Full 25-day structured program',
        'Hill starts, reverse parking, night driving',
        'Road-test ready, best value per hour',
      ],
    },
  ],
};
