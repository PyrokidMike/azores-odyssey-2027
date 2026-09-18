// Azores Odyssey 2027 — curated, manually embedded trip content.
// This app does no web research, AI calls, scraping, or live data fetching.
// Everything below is hand-curated by the planning group.

export type VoteValue = 'must' | 'interested' | 'skip' | 'no'

export const VOTE_OPTIONS: { value: VoteValue; label: string }[] = [
  { value: 'must', label: 'Must do' },
  { value: 'interested', label: 'Interested' },
  { value: 'skip', label: 'Fine to skip' },
  { value: 'no', label: 'No thanks' },
]

export type Island = 'São Miguel' | 'Terceira' | 'Faial' | 'Pico'
export const ISLANDS: Island[] = ['São Miguel', 'Terceira', 'Faial', 'Pico']

export type CategoryId = 'water' | 'volcano' | 'land'
export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'water', label: 'Water' },
  { id: 'volcano', label: 'Volcano & Geology' },
  { id: 'land', label: 'Land & Adventure' },
]

// A curated activity belongs to one of three collections. This keeps the core
// itinerary focused while offering optional upgrades and quieter recovery days
// without overloading the main menu.
export type Collection = 'core' | 'optional' | 'recovery'
export const COLLECTIONS: { id: Collection; label: string; blurb: string }[] = [
  {
    id: 'core',
    label: 'Core itinerary',
    blurb:
      'The high-priority pillars: whales, water, volcanoes, caves, hikes, canyoning, plantations and culture.',
  },
  {
    id: 'optional',
    label: 'Optional adventures',
    blurb:
      'Adults and older teens only — optional upgrades that should not drive island choice.',
  },
  {
    id: 'recovery',
    label: 'Family recovery & discovery',
    blurb: 'Quieter, lower-energy days to slot between the big adventures.',
  },
]

// Sub-theme used only inside the Optional adventures collection.
export type OptionalTheme = 'Aerial' | 'Underwater' | 'Technical land'
export const OPTIONAL_THEMES: OptionalTheme[] = ['Aerial', 'Underwater', 'Technical land']

export type Intensity = 'Easy' | 'Moderate' | 'High'
export const INTENSITIES: Intensity[] = ['Easy', 'Moderate', 'High']

export type GroupFit =
  | 'Whole group'
  | 'Whole group if age-qualified'
  | 'Split group'
  | 'Adults/older kids'
  | 'Weather-flexible'
export const GROUP_FITS: GroupFit[] = [
  'Whole group',
  'Whole group if age-qualified',
  'Split group',
  'Adults/older kids',
  'Weather-flexible',
]

export type Urgency =
  | 'Book early'
  | 'Confirm before booking'
  | 'Flexible'
  | 'Weather dependent'
export const URGENCIES: Urgency[] = [
  'Book early',
  'Confirm before booking',
  'Flexible',
  'Weather dependent',
]

export type ResearchStatus =
  | 'Confirmed research'
  | 'Needs 2027 confirmation'
  | 'Hold / unavailable'

export interface Activity {
  id: string
  name: string
  category: CategoryId
  /** Defaults to the core itinerary when omitted. */
  collection?: Collection
  /** Sub-theme, only meaningful for the optional adventures collection. */
  theme?: OptionalTheme
  islands: Island[]
  groupFit: GroupFit
  fitNote: string
  intensity: Intensity
  notes: string
  urgency: Urgency
  status: ResearchStatus
  link: string
}

export interface DecisionOption {
  id: string
  label: string
  detail?: string
  /** Optional shared vote id so a decision option can reuse another item's votes. */
  voteId?: string
}

export interface Decision {
  id: string
  title: string
  question: string
  notes: string
  options: DecisionOption[]
  /** Current planning baseline; this does not replace family voting. */
  baselineOptionId?: string
  sourceLink?: string
  voteLabels?: Partial<Record<VoteValue, string>>
  keyPoints?: string[]
  experiences?: string[]
  criticalItems?: string[]
}

export interface IslandConcept {
  id: string
  title: string
  islands: Island[]
  summary: string
  bestFor: string
  tradeoff: string
  minNights?: string
}

/* -------------------------------------------------------------------------- */
/*  Group decisions                                                           */
/* -------------------------------------------------------------------------- */

export const DECISIONS: Decision[] = [
  {
    id: 'timing',
    title: 'Timing',
    question: 'Which part of June works best?',
    notes:
      'Down and dirty: early June is the simplest default for whale watching and lighter crowds. Mid-June may be best if Vila Franca opens. Late June is only worth it if Sanjoaninas is a priority; expect festival crowds, higher demand, and less flexible transport. Pick the dates that match the experience you actually want, not just the cheapest flights.',
    sourceLink: 'https://www.visitazores.com/en/experiences/events',
    voteLabels: { must: 'Best fit', interested: 'Could work', skip: 'No preference', no: 'Not available' },
    keyPoints: ['Early June usually gives calmer logistics and strong whale activity.', 'Mid-June may unlock Vila Franca do Campo, depending on the seasonal opening.', 'Late June brings Sanjoaninas energy but also busier roads, lodging, and restaurants.'],
    experiences: ['Whale watching and ocean days', 'Seasonal festivals and local food', 'More relaxed sightseeing with fewer crowds'],
    criticalItems: ['Flight and ferry schedules', 'Vila Franca and festival dates', 'Weather flexibility and accommodation availability'],
    options: [
      { id: 'early', label: 'Early June', detail: 'Lighter crowds, strong whale season' },
      { id: 'mid', label: 'Mid-June', detail: 'May align with Vila Franca opening' },
      { id: 'late', label: 'Late June', detail: 'Sanjoaninas festival — more crowds and traffic' },
    ],
  },
  {
    id: 'length',
    title: 'Trip length',
    question: 'How many nights?',
    notes:
      'Down and dirty: 5 nights means one island and a tight schedule. 7 nights gives São Miguel room to breathe. 11 nights can support one additional island without turning the trip into transfers. 13 nights is the point where a more ambitious multi-island route becomes realistic. More nights add cost, luggage moves, and travel days as well as experiences.',
    sourceLink: 'https://www.visitazores.com/en/plan-your-trip/getting-around',
    voteLabels: { must: 'My preference', interested: 'I could do this', skip: 'No preference', no: 'Does not work' },
    keyPoints: ['Five nights is a focused São Miguel trip with little room for weather changes.', 'Seven nights gives the main island breathing room without overcomplicating travel.', 'Eleven or thirteen nights make a second island more realistic, but add travel days and cost.'],
    experiences: ['Hot springs, crater lakes, coastal drives, and food on São Miguel', 'A second island with a distinct landscape and culture', 'More buffer for weather-dependent activities'],
    criticalItems: ['Extra accommodation and transport nights', 'Island transfer time and baggage movement', 'A realistic rest day after demanding activities'],
    options: [
      { id: '5', label: '5 nights', detail: 'Short single-island trip — São Miguel only' },
      { id: '7', label: '7 nights', detail: 'A relaxed São Miguel week with breathing room' },
      { id: '11', label: '11 nights', detail: 'São Miguel or São Miguel + one second island' },
      { id: '13', label: '13 nights', detail: 'Supports a deeper second island or expedition' },
    ],
  },
  {
    id: 'pico',
    title: 'Mt. Pico participation',
    question: 'Where do you stand on the Mount Pico climb?',
    notes:
      'Down and dirty: this is not a casual walk. The summit is a long, steep, exposed day with a guide, a reservation, suitable fitness, weather flexibility, and a recovery day. The climb can be cancelled by conditions, so it should not dictate everyone’s itinerary unless a committed subgroup is large enough to justify the island transfer and buffer day.',
    sourceLink: 'https://montanhapico.pt/en/mountain/',
    voteLabels: { must: 'I am committed', interested: 'I may join', skip: 'I will support others', no: 'I will not climb' },
    keyPoints: ['This is a guided, strenuous summit day—not a casual hike.', 'Weather can cancel or delay the climb, so flexibility is essential.', 'Non-climbers need a worthwhile alternative while the climbing group is away.'],
    experiences: ['A demanding volcanic summit with wide Atlantic views', 'A shared achievement for a committed subgroup', 'A recovery day and slower pace afterward'],
    criticalItems: ['Fitness, age, footwear, and medical suitability', 'Guide availability and official reservation', 'Weather buffer, cancellation risk, and recovery time'],
    options: [
      { id: 'committed', label: 'I am committed to climbing' },
      { id: 'might', label: 'I might climb' },
      { id: 'no', label: 'I will not climb' },
    ],
  },
  {
    id: 'island-concept',
    title: 'Island concept',
    question: 'Which island concept should we build the trip around?',
    notes:
      'Down and dirty: choose the route before pricing lodging. São Miguel only is the easiest and richest base. Adding Terceira or Faial/Pico adds transfer time, packing, weather risk, and cost—but unlocks specific experiences. The maximum route is only sensible with enough nights and a group willing to spend multiple days moving between islands.',
    sourceLink: '/concepts',
    voteLabels: { must: 'My first choice', interested: 'I would consider it', skip: 'No strong view', no: 'Not for me' },
    keyPoints: ['São Miguel only offers the simplest logistics and the broadest mix of activities.', 'Terceira adds Angra, caves, and culture; Faial/Pico adds volcanoes, vineyards, and the mountain.', 'Every added island means another transfer, weather exposure, and accommodation move.'],
    experiences: ['A relaxed base with day trips', 'Distinct island food, landscapes, and local history', 'A more expedition-like trip across several islands'],
    criticalItems: ['Ferry and flight reliability', 'Minimum nights needed on each island', 'Whether the group values variety more than downtime'],
    options: [
      {
        id: 'saomiguel-only',
        voteId: 'concept:saomiguel-only',
        label: 'São Miguel only',
        detail: 'Maximum variety, least transfer friction',
      },
      {
        id: 'saomiguel-terceira',
        voteId: 'concept:saomiguel-terceira',
        label: 'São Miguel + Terceira',
        detail: 'Adds caves, Angra, and the Sanjoaninas festival',
      },
      {
        id: 'saomiguel-faialpico',
        voteId: 'concept:saomiguel-faialpico',
        label: 'São Miguel + Faial/Pico',
        detail: 'Adds Capelinhos, UNESCO vineyards, and Mount Pico',
      },
      {
        id: 'maximum-expedition',
        voteId: 'concept:maximum-expedition',
        label: 'Maximum expedition',
        detail: 'All four islands — responsible only at 13 nights',
      },
    ],
  },
  {
    id: 'priority',
    title: 'Priority tradeoff',
    question: 'If we must choose a character for the trip, which one?',
    notes:
      'Down and dirty: this is the tie-breaker. Pick the experience you would be most disappointed to miss. Caves and culture favor Terceira; volcanoes and vineyards favor Faial/Pico; water and adventure favor a slower São Miguel plan; maximum variety means accepting more transfers and less downtime.',
    sourceLink: '/activities',
    voteLabels: { must: 'Top priority', interested: 'Strong interest', skip: 'Not a priority', no: 'Please avoid' },
    keyPoints: ['Caves and culture favor Terceira; volcanoes, vineyards, and Pico favor Faial/Pico.', 'Water and adventure work best when the itinerary leaves room for weather changes.', 'Maximum variety is possible, but each transfer reduces unstructured family time.'],
    experiences: ['Local festivals, food, and historic towns', 'Volcanic landscapes, vineyards, and summit ambitions', 'Ocean activities, hot springs, and a slower family rhythm'],
    criticalItems: ['What the group would most regret missing', 'Which activities are weather-dependent', 'How much transfer time and complexity everyone accepts'],
    options: [
      { id: 'caves', label: 'Caves + culture + Sanjoaninas' },
      { id: 'volcanoes', label: 'Volcanoes + vineyards + Mount Pico' },
      { id: 'water', label: 'Water + adventure + relaxed pacing' },
      { id: 'variety', label: 'Maximum variety, accepting more transfers' },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/*  Island concepts (trip decision #5, presented richly)                      */
/* -------------------------------------------------------------------------- */

export const ISLAND_CONCEPTS: IslandConcept[] = [
  {
    id: 'saomiguel-only',
    title: 'São Miguel only',
    islands: ['São Miguel'],
    summary: 'Maximum activity variety with the least transfer friction.',
    bestFor: 'Groups who want depth without inter-island travel days.',
    tradeoff: 'No Terceira caves, Sanjoaninas, or Pico summit.',
  },
  {
    id: 'saomiguel-terceira',
    title: 'São Miguel + Terceira',
    islands: ['São Miguel', 'Terceira'],
    summary: 'Adds caves, historic Angra do Heroísmo, and the Sanjoaninas festival.',
    bestFor: 'Caves + culture + festival lovers.',
    tradeoff: 'One transfer day; festival crowds if late June.',
  },
  {
    id: 'saomiguel-faialpico',
    title: 'São Miguel + Faial/Pico',
    islands: ['São Miguel', 'Faial', 'Pico'],
    summary: 'Adds Capelinhos, UNESCO vineyards, and Mount Pico.',
    bestFor: 'Volcanoes + vineyards + a committed summit subgroup.',
    tradeoff: 'More transfers; Pico summit needs weather buffer and recovery.',
  },
  {
    id: 'maximum-expedition',
    title: 'Maximum expedition',
    islands: ['São Miguel', 'Terceira', 'Faial', 'Pico'],
    summary: 'São Miguel + Terceira + Faial/Pico — the most ambitious itinerary.',
    bestFor: 'A highly motivated group on the longer trip.',
    tradeoff: 'Only responsible for 13 nights; multiple transfer days.',
    minNights: 'Requires 13 nights',
  },
]

/* -------------------------------------------------------------------------- */
/*  Activities                                                                */
/* -------------------------------------------------------------------------- */

export const ACTIVITIES: Activity[] = [
  // WATER
  {
    id: 'whale-watching',
    name: 'Whale watching',
    category: 'water',
    islands: ['São Miguel', 'Faial', 'Pico', 'Terceira'],
    groupFit: 'Whole group',
    fitNote: 'Use a stable catamaran for younger children.',
    intensity: 'Easy',
    notes:
      'Schedule early enough to allow a weather rebooking. June is strong for migratory baleen whales.',
    urgency: 'Book early',
    status: 'Confirmed research',
    link: 'https://dolphinandwhaleconnection.com/faqs/',
  },
  {
    id: 'dolphin-swim',
    name: 'Dolphin swim',
    category: 'water',
    islands: ['São Miguel'],
    groupFit: 'Split group',
    fitNote: 'Confident swimmers only; operator age rules apply.',
    intensity: 'Moderate',
    notes:
      'Swimming with whales is prohibited. Dolphin swims are regulated and weather dependent.',
    urgency: 'Confirm before booking',
    status: 'Confirmed research',
    link: 'https://azores.com/azores-fauna-and-flora/watching-and-swimming-with-dolphins-in-the-azores-islands-a-comprehensive-guide/',
  },
  {
    id: 'vila-franca',
    name: 'Vila Franca crater islet',
    category: 'water',
    islands: ['São Miguel'],
    groupFit: 'Whole group if age-qualified',
    fitNote: 'Whole group if swimming confident; split group otherwise.',
    intensity: 'Moderate',
    notes:
      'Seasonal protected reserve with visitor caps. Confirm exact 2027 operating dates and tickets as soon as announced.',
    urgency: 'Book early',
    status: 'Needs 2027 confirmation',
    link: 'https://bilheteira.cnvfc.net/',
  },
  {
    id: 'surf-lessons',
    name: 'Surf lessons',
    category: 'water',
    islands: ['São Miguel'],
    groupFit: 'Split group',
    fitNote: 'Depends on swimming confidence and child-age rules.',
    intensity: 'Moderate',
    notes:
      'Depends on swimming confidence, instructor ratio, wetsuit fit, surf conditions and child-age rules.',
    urgency: 'Confirm before booking',
    status: 'Confirmed research',
    link: 'https://www.visitazores.com/en',
  },
  {
    id: 'crater-lake-kayaking',
    name: 'Crater-lake kayaking',
    category: 'water',
    islands: ['São Miguel'],
    groupFit: 'Whole group if age-qualified',
    fitNote: 'Use Furnas or Sete Cidades.',
    intensity: 'Easy',
    notes:
      'Use Furnas or Sete Cidades. Better weather backup than ocean kayaking but wind can still matter.',
    urgency: 'Flexible',
    status: 'Confirmed research',
    link: 'https://www.getyourguide.com/sete-cidades-l128268/canoe-kayak-tours-tc61/',
  },
  {
    id: 'lava-pools',
    name: 'Natural lava pools',
    category: 'water',
    islands: ['São Miguel', 'Terceira', 'Faial', 'Pico'],
    groupFit: 'Whole group',
    fitNote: 'Suitable for the whole group in calm conditions.',
    intensity: 'Easy',
    notes: 'Ocean conditions determine whether entry ladders and pools are safe.',
    urgency: 'Weather dependent',
    status: 'Confirmed research',
    link: 'https://www.visitazores.com/en',
  },
  {
    id: 'coasteering',
    name: 'Coasteering',
    category: 'water',
    islands: ['São Miguel'],
    groupFit: 'Adults/older kids',
    fitNote: 'Do not treat as an all-13 activity.',
    intensity: 'High',
    notes:
      'Sea caves, scrambling, swimming and optional jumps. Do not treat as an all-13 activity.',
    urgency: 'Confirm before booking',
    status: 'Confirmed research',
    link: 'https://azoresadventureislands.com/all-activities/',
  },

  // VOLCANO & GEOLOGY
  {
    id: 'furnas-geothermal-lunch',
    name: 'Furnas geothermal lunch',
    category: 'volcano',
    islands: ['São Miguel'],
    groupFit: 'Whole group',
    fitNote: 'Reserve a large table in advance.',
    intensity: 'Easy',
    notes: 'Underground-cooked cozido. Reserve a large table in advance.',
    urgency: 'Book early',
    status: 'Confirmed research',
    link: 'https://www.visitazores.com/en',
  },
  {
    id: 'terra-nostra',
    name: 'Terra Nostra thermal pool',
    category: 'volcano',
    islands: ['São Miguel'],
    groupFit: 'Whole group',
    fitNote: 'Large iron-rich pool inside a botanical garden — easy for all ages.',
    intensity: 'Easy',
    notes:
      'Large 35–40°C iron-rich thermal pool set in an elaborate botanical garden — a full-day Furnas cultural and geothermal stop. The iron water stains swimwear, so bring older suits.',
    urgency: 'Confirm before booking',
    status: 'Confirmed research',
    link: 'https://parquesnaturais.azores.gov.pt/en/',
  },
  {
    id: 'gruta-do-carvao',
    name: 'Gruta do Carvão lava tube',
    category: 'volcano',
    islands: ['São Miguel'],
    groupFit: 'Whole group if age-qualified',
    fitNote: 'Children under 7 cannot enter; stairs and irregular terrain.',
    intensity: 'Easy',
    notes:
      'Short guided tour takes 30–45 minutes and has capacity for 16. Current operator guidance says children under 7 cannot enter; access includes stairs and irregular terrain.',
    urgency: 'Book early',
    status: 'Confirmed research',
    link: 'https://grutadocarvao.pt/en/',
  },
  {
    id: 'algar-do-carvao',
    name: 'Algar do Carvão',
    category: 'volcano',
    islands: ['Terceira'],
    groupFit: 'Whole group if age-qualified',
    fitNote: 'Roughly 338 steps, no lift; damp and dark.',
    intensity: 'Moderate',
    notes:
      'Dramatic volcanic chimney with roughly 338 steps. No lift; damp, dark conditions. Confirm 2027 operating status after visitor-center works.',
    urgency: 'Confirm before booking',
    status: 'Needs 2027 confirmation',
    link: 'https://www.montanheiros.com/en/novo-faq/',
  },
  {
    id: 'gruta-do-natal',
    name: 'Gruta do Natal',
    category: 'volcano',
    islands: ['Terceira'],
    groupFit: 'Whole group if age-qualified',
    fitNote: 'Uneven terrain; pair with Biscoitos lava pools.',
    intensity: 'Easy',
    notes:
      'More horizontal lava-tube experience than Algar do Carvão. Uneven terrain; pair with Biscoitos lava pools.',
    urgency: 'Confirm before booking',
    status: 'Needs 2027 confirmation',
    link: 'https://travel-azores.com/en/magazine/grutas-vulcanicas-dos-acores-guia-completo-do-algar-do-carvao-e-gruta-do-natal',
  },
  {
    id: 'capelinhos',
    name: 'Capelinhos volcano',
    category: 'volcano',
    islands: ['Faial'],
    groupFit: 'Whole group',
    fitNote: 'Add the interpretation center for a high-value family day.',
    intensity: 'Easy',
    notes:
      'Otherworldly ash-and-lava landscape. Add the interpretation center to make it a high-value family geology day.',
    urgency: 'Flexible',
    status: 'Confirmed research',
    link: 'https://www.visitazores.com/en',
  },
  {
    id: 'lagoa-do-fogo',
    name: 'Lagoa do Fogo',
    category: 'volcano',
    islands: ['São Miguel'],
    groupFit: 'Whole group',
    fitNote: 'Whole group for views, or split for the hike.',
    intensity: 'Moderate',
    notes: 'Crater views are fog-sensitive; maintain a flexible alternate plan.',
    urgency: 'Weather dependent',
    status: 'Confirmed research',
    link: 'https://trails.visitazores.com/en/islands/sao-miguel',
  },
  {
    id: 'mount-pico',
    name: 'Mount Pico climb',
    category: 'volcano',
    islands: ['Pico'],
    groupFit: 'Adults/older kids',
    fitNote: 'Adults / older teens only.',
    intensity: 'High',
    notes:
      'Serious 2,351-metre summit day. Official reservation, weather buffer, mountain fitness and next-day recovery are mandatory planning elements.',
    urgency: 'Book early',
    status: 'Confirmed research',
    link: 'https://montanhapico.azores.gov.pt/?lang=en',
  },
  {
    id: 'gruta-das-torres',
    name: 'Gruta das Torres lava tube',
    category: 'volcano',
    islands: ['Pico'],
    groupFit: 'Adults/older kids',
    fitNote: 'On hold — cave descents currently suspended.',
    intensity: 'Moderate',
    notes:
      'Cave descents are currently suspended for safety reasons. Do not use this activity to justify a Pico itinerary unless official reopening is confirmed.',
    urgency: 'Confirm before booking',
    status: 'Hold / unavailable',
    link: 'https://parquesnaturais.azores.gov.pt/en/parques/5/centro/8/bilheteira',
  },

  // LAND & ADVENTURE
  {
    id: 'furnas-zipline',
    name: 'Furnas forest zipline',
    category: 'land',
    islands: ['São Miguel'],
    groupFit: 'Whole group if age-qualified',
    fitNote: 'Age/weight-qualified; one listing uses a 35 kg minimum.',
    intensity: 'Moderate',
    notes:
      'Private large-group pricing has been published for 11–20 guests, but confirm 2027 age, height and weight rules. One listing uses a 35 kg minimum.',
    urgency: 'Confirm before booking',
    status: 'Confirmed research',
    link: 'https://azoresadventureislands.com/all-activities/furnas-lake-adventure-park-zipline-rentals/',
  },
  {
    id: 'treetop-park',
    name: 'Azores Treetop Park',
    category: 'land',
    islands: ['São Miguel'],
    groupFit: 'Weather-flexible',
    fitNote: 'Height-qualified courses; remains open in rain.',
    intensity: 'Moderate',
    notes:
      'Children’s courses begin around age 5 / 105 cm; junior zipline around 125 cm; adult course around 140 cm. It remains open in rain.',
    urgency: 'Book early',
    status: 'Confirmed research',
    link: 'https://www.azorestreetop.com/faqs/',
  },
  {
    id: 'canyoning-caldeiroes',
    name: 'Intro canyoning at Ribeira dos Caldeirões',
    category: 'land',
    islands: ['São Miguel'],
    groupFit: 'Split group',
    fitNote: 'Age 6+, 120 cm+, 20 kg+, swimming ability; 14-person cap.',
    intensity: 'High',
    notes:
      'Current examples cite age 6+, 120 cm+, 20 kg+, swimming ability and a 14-person group cap. Confirm exact 2027 operator policy.',
    urgency: 'Book early',
    status: 'Confirmed research',
    link: 'https://www.manawa.com/en-GB/activity/azores/sao-miguel/canyoning/discover-canyoning-at-ribeira-dos-caldeiroes-in-sao-miguel-azo',
  },
  {
    id: 'canyoning-cabrito',
    name: 'Salto do Cabrito canyoning',
    category: 'land',
    islands: ['São Miguel'],
    groupFit: 'Adults/older kids',
    fitNote: 'Some operators use age 12 minimums.',
    intensity: 'High',
    notes:
      'Around four hours, rappels up to roughly 16 metres, optional zipline and optional jump. Some operators use age 12 minimums.',
    urgency: 'Book early',
    status: 'Confirmed research',
    link: 'https://www.azoreanblueberry.com/en/experience/canyoning-adventure-salto-do-cabrito',
  },
  {
    id: 'janela-do-inferno',
    name: 'Janela do Inferno hike',
    category: 'land',
    islands: ['São Miguel'],
    groupFit: 'Whole group if age-qualified',
    fitNote: 'School-age and up; bring headlamps and traction.',
    intensity: 'Moderate',
    notes:
      '7.6 km circular route, around 2.5 hours. Forest, old aqueduct tunnels and a waterfall. Bring headlamps and shoes with traction.',
    urgency: 'Weather dependent',
    status: 'Confirmed research',
    link: 'https://trails.visitazores.com/en/trails-azores/sao-miguel/rota-da-agua-janela-do-inferno',
  },
  {
    id: 'salto-do-prego',
    name: 'Salto do Prego and Sanguinho',
    category: 'land',
    islands: ['São Miguel'],
    groupFit: 'Whole group if age-qualified',
    fitNote: 'School-age and up; can be muddy.',
    intensity: 'Moderate',
    notes:
      'Forest, waterfall, possible swim and restored village. Can be muddy; confirm official trail status shortly before departure.',
    urgency: 'Weather dependent',
    status: 'Confirmed research',
    link: 'https://www.saomiguelguide.com/en/salto-do-prego',
  },
  {
    id: 'gorreana-tea',
    name: 'Gorreana tea walk and factory',
    category: 'land',
    islands: ['São Miguel'],
    groupFit: 'Weather-flexible',
    fitNote: 'Easy trail and indoor factory tasting — good lower-energy day.',
    intensity: 'Easy',
    notes: 'Easy 3.3 km / 1.5-hour trail and tea tasting. Good lower-energy day.',
    urgency: 'Flexible',
    status: 'Confirmed research',
    link: 'https://trails.visitazores.com/en/trails-azores/sao-miguel/ch%C3%A1-gorreana',
  },
  {
    id: 'pineapple-plantation',
    name: 'Pineapple plantation',
    category: 'land',
    islands: ['São Miguel'],
    groupFit: 'Weather-flexible',
    fitNote: 'Weather-friendly, low-effort, ideal on arrival/departure day.',
    intensity: 'Easy',
    notes: 'Weather-friendly, low-effort and ideal on arrival/departure day.',
    urgency: 'Flexible',
    status: 'Confirmed research',
    link: 'https://www.visitazores.com/en',
  },
  {
    id: 'e-biking',
    name: 'E-biking',
    category: 'land',
    islands: ['São Miguel', 'Pico'],
    groupFit: 'Whole group if age-qualified',
    fitNote: 'Guided routes with e-bikes suit mixed fitness; confirm age/height rules.',
    intensity: 'Moderate',
    notes:
      'Guided e-bike routes make coastal and vineyard rides accessible for mixed fitness levels. Confirm 2027 minimum age, height and helmet requirements with the operator.',
    urgency: 'Flexible',
    status: 'Needs 2027 confirmation',
    link: 'https://www.visitazores.com/en',
  },
  {
    id: 'sailing-cruise',
    name: 'Private coastal sailing cruise',
    category: 'water',
    islands: ['São Miguel', 'Faial', 'Pico'],
    groupFit: 'Whole group',
    fitNote: 'Whole group only if a licensed vessel fits everyone safely.',
    intensity: 'Easy',
    notes:
      'A less rushed, more celebratory alternative to a standard whale-watch boat. For 13, confirm licensed vessel capacity and the weather-cancellation policy before booking.',
    urgency: 'Book early',
    status: 'Needs 2027 confirmation',
    link: 'https://www.visitazores.com/en/explore/picos-de-aventura-animacao-e-lazer',
  },
  {
    id: 'fishing-charter',
    name: 'Family fishing charter',
    category: 'water',
    islands: ['São Miguel', 'Faial', 'Pico'],
    groupFit: 'Adults/older kids',
    fitNote: 'Gives non-surfers and non-swimmers a distinctive water option.',
    intensity: 'Moderate',
    notes:
      'A distinctive water outing for those who skip surfing or dolphin swims. Review motion-sickness, catch-and-release and charter rules; avoid full-day big-game fishing for a mixed-age group.',
    urgency: 'Confirm before booking',
    status: 'Needs 2027 confirmation',
    link: 'https://www.visitazores.com/en/explore/picos-de-aventura-animacao-e-lazer',
  },
  {
    id: 'four-by-four',
    name: 'Guided 4x4 / van adventure',
    category: 'land',
    islands: ['São Miguel'],
    groupFit: 'Whole group',
    fitNote: 'Good mixed-age day; lets hikers and non-drivers see remote areas together.',
    intensity: 'Easy',
    notes:
      'Lets hikers, young children and non-drivers reach remote Nordeste, Furnas or Sete Cidades together. A strong weather fallback — not necessarily a replacement for every hike.',
    urgency: 'Flexible',
    status: 'Needs 2027 confirmation',
    link: 'https://www.visitazores.com/en/explore/azores-islands-experience',
  },

  // OPTIONAL ADVENTURES — adults & older teens only, should not drive island choice
  {
    id: 'paragliding',
    name: 'Tandem paragliding flight',
    category: 'land',
    collection: 'optional',
    theme: 'Aerial',
    islands: ['São Miguel'],
    groupFit: 'Adults/older kids',
    fitNote: 'Not a whole-group requirement; licensed tandem operators only.',
    intensity: 'High',
    notes:
      'The strongest "we did something wild" aerial option, with crater-lake and coastline views. Weather-dependent; use licensed tandem operators only.',
    urgency: 'Weather dependent',
    status: 'Needs 2027 confirmation',
    link: 'https://www.visitazores.com/en/the-azores/sao-miguel',
  },
  {
    id: 'rock-climbing',
    name: 'Rock climbing / guided abseiling',
    category: 'land',
    collection: 'optional',
    theme: 'Technical land',
    islands: ['São Miguel'],
    groupFit: 'Adults/older kids',
    fitNote: 'Confident older kids and adults; reserve as a split group.',
    intensity: 'High',
    notes:
      'A more technical land adventure than hiking, ziplining or canyoning. Age, height and fitness restrictions vary sharply between operators.',
    urgency: 'Confirm before booking',
    status: 'Needs 2027 confirmation',
    link: 'https://www.visitazores.com/en/explore/azores-adventure-islands',
  },
  {
    id: 'scuba-discover',
    name: 'Scuba "discover" dive',
    category: 'water',
    collection: 'optional',
    theme: 'Underwater',
    islands: ['São Miguel', 'Faial', 'Pico'],
    groupFit: 'Adults/older kids',
    fitNote: 'Confident swimmers and older kids; age-appropriate operator products.',
    intensity: 'Moderate',
    notes:
      'A true underwater option beyond dolphin swimming and open-ocean whale watching. Use age-appropriate operator products; weather and sea state matter. Skip deep technical certifications.',
    urgency: 'Confirm before booking',
    status: 'Needs 2027 confirmation',
    link: 'https://www.visitazores.com/en/explore',
  },
  {
    id: 'freediving-snorkel',
    name: 'Freediving / snorkeling excursion',
    category: 'water',
    collection: 'optional',
    theme: 'Underwater',
    islands: ['São Miguel'],
    groupFit: 'Adults/older kids',
    fitNote: 'Simpler and more flexible than scuba; good for confident swimmers.',
    intensity: 'Moderate',
    notes:
      'Usually simpler and more flexible than scuba and a good add-on for confident swimmers. Do not treat it as a substitute for the Vila Franca islet if the islet is closed.',
    urgency: 'Confirm before booking',
    status: 'Needs 2027 confirmation',
    link: 'https://www.visitazores.com/en/explore/azores-islands-experience',
  },

  // FAMILY RECOVERY & DISCOVERY — quieter, lower-energy days between big adventures
  {
    id: 'caldeira-velha',
    name: 'Caldeira Velha thermal waterfall',
    category: 'water',
    collection: 'recovery',
    islands: ['São Miguel'],
    groupFit: 'Whole group',
    fitNote: 'Timed entry; a kid-friendly recovery stop near Lagoa do Fogo.',
    intensity: 'Easy',
    notes:
      'A jungle-like thermal waterfall and warm pools — not simply "another hot spring." Book or confirm timed entry; an active-family day near Ribeira Grande and Lagoa do Fogo.',
    urgency: 'Confirm before booking',
    status: 'Confirmed research',
    link: 'https://www.visitazores.com/en',
  },
  {
    id: 'poca-dona-beija',
    name: 'Poça da Dona Beija night soak',
    category: 'volcano',
    collection: 'recovery',
    islands: ['São Miguel'],
    groupFit: 'Whole group',
    fitNote: 'Go in staggered waves; particularly atmospheric at night.',
    intensity: 'Easy',
    notes:
      'Multiple smaller warm pools in Furnas, especially good after dark as a post-hike or post-canyoning reset. Confirm time-slot, child and swimwear rules.',
    urgency: 'Confirm before booking',
    status: 'Confirmed research',
    link: 'https://www.visitazores.com/en',
  },
  {
    id: 'ferraria',
    name: 'Ponta da Ferraria geothermal ocean swim',
    category: 'water',
    collection: 'recovery',
    islands: ['São Miguel'],
    groupFit: 'Whole group',
    fitNote: 'Whole group only if the sea is calm; best around low tide.',
    intensity: 'Moderate',
    notes:
      'A rare ocean cove heated by geothermal activity — one of the more unusual family stories of the trip. Best around low tide; swell and current can make it unsuitable.',
    urgency: 'Weather dependent',
    status: 'Confirmed research',
    link: 'https://travel-azores.com/en/magazine/azores-for-families-best-activities-with-kids',
  },
  {
    id: 'geology-field-day',
    name: 'Guided geology / volcano field day',
    category: 'volcano',
    collection: 'recovery',
    islands: ['São Miguel', 'Terceira', 'Faial', 'Pico'],
    groupFit: 'Whole group',
    fitNote: 'Ties caves, fumaroles, lava walls and crater lakes into one story.',
    intensity: 'Easy',
    notes:
      'Turns Capelinhos, caves, fumaroles, lava walls and crater lakes into one coherent "how the islands formed" story. Use this instead of stacking too many unguided volcanic stops.',
    urgency: 'Flexible',
    status: 'Needs 2027 confirmation',
    link: 'https://www.visitazores.com/en/experience-the-azores/geotourism',
  },
  {
    id: 'birdwatching-walk',
    name: 'Birdwatching / naturalist walk',
    category: 'land',
    collection: 'recovery',
    islands: ['São Miguel', 'Faial', 'Pico'],
    groupFit: 'Whole group',
    fitNote: 'Especially good for younger children who like spotting over swimming.',
    intensity: 'Easy',
    notes:
      'A quieter nature option between high-intensity days, useful for kids who enjoy spotting rather than swimming. Best with a guide or a self-guided checklist / scavenger format.',
    urgency: 'Flexible',
    status: 'Needs 2027 confirmation',
    link: 'https://www.visitazores.com/en/explore/azores-islands-experience',
  },
  {
    id: 'horta-scavenger',
    name: 'Horta marina scavenger hunt',
    category: 'land',
    collection: 'recovery',
    islands: ['Faial'],
    groupFit: 'Whole group',
    fitNote: 'A participatory activity for children, not another harbor stroll.',
    intensity: 'Easy',
    notes:
      'The painted-wall marina makes a great scavenger hunt or painted-wall walk that gives children something to do rather than another adult-oriented harbor stroll.',
    urgency: 'Flexible',
    status: 'Needs 2027 confirmation',
    link: 'https://www.visitazores.com/en',
  },
  {
    id: 'whale-museum',
    name: 'Whaling & maritime museum, Pico',
    category: 'land',
    collection: 'recovery',
    islands: ['Pico'],
    groupFit: 'Whole group',
    fitNote: "A companion activity for non-climbers on Mount Pico summit day.",
    intensity: 'Easy',
    notes:
      'A whale-museum and maritime-history stop, particularly useful as the non-climbers\u2019 activity while a committed subset climbs Mount Pico.',
    urgency: 'Flexible',
    status: 'Needs 2027 confirmation',
    link: 'https://www.visitazores.com/en',
  },
  {
    id: 'market-chef-evening',
    name: 'Market visit & chef evening',
    category: 'land',
    collection: 'recovery',
    islands: ['São Miguel'],
    groupFit: 'Whole group',
    fitNote: 'A relaxed evening the whole group can share.',
    intensity: 'Easy',
    notes:
      'A low-energy cultural evening — a local market visit paired with a shared, hands-on chef dinner. A gentle celebratory alternative to another full day out.',
    urgency: 'Flexible',
    status: 'Needs 2027 confirmation',
    link: 'https://www.visitazores.com/en',
  },
]

/* -------------------------------------------------------------------------- */
/*  Id helpers for the vote/comment store                                     */
/* -------------------------------------------------------------------------- */

export const activityVoteId = (id: string) => `act:${id}`
export const activityThreadId = (id: string) => `act:${id}`
export const decisionOptionVoteId = (decisionId: string, optionId: string) =>
  `dec:${decisionId}:${optionId}`
export const decisionThreadId = (decisionId: string) => `dec:${decisionId}`
export const conceptVoteId = (id: string) => `concept:${id}`
export const conceptThreadId = (id: string) => `concept:${id}`
