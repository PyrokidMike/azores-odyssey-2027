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
    id: 'headcount',
    title: 'Headcount',
    question: 'How many travelers do we plan around?',
    notes:
      '13 requires scarce large villas, likely 3 vehicles, early restaurant reservations, and more careful group-capacity planning. 9 makes multi-island logistics much easier.',
    options: [
      { id: '9', label: '9 travelers', detail: 'Easier multi-island logistics and lodging' },
      { id: '13', label: '13 travelers', detail: 'Full group — needs scarce large villas and 3 vehicles' },
    ],
  },
  {
    id: 'timing',
    title: 'Timing',
    question: 'Which part of June works best?',
    notes:
      'Early June usually means lighter crowds and strong whale season. Mid-June may align with Vila Franca seasonal opening. Late June is needed for Terceira’s Sanjoaninas festival but brings more crowds and festival traffic.',
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
      '5–7 nights keep us on a single island (São Miguel). 11 nights should prioritize São Miguel or São Miguel + one second island. 13 nights can responsibly support a deeper second island, or a more ambitious expedition.',
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
      'Mount Pico is a serious summit day requiring official reservation, weather flexibility, high fitness, and a recovery day. It should only drive the itinerary if there is a committed subgroup.',
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
      'This is the itinerary’s backbone — it sets how many transfer days we accept and which signature experiences are on the table. See the Island Concepts page for the full detail; votes here and there are the same.',
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
      'This tradeoff shapes island choice and pacing. It is the single most useful signal for narrowing the itinerary.',
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
    id: 'thermal-pools',
    name: 'Thermal pools',
    category: 'volcano',
    islands: ['São Miguel'],
    groupFit: 'Whole group',
    fitNote: 'Excellent recovery activity.',
    intensity: 'Easy',
    notes:
      'Excellent recovery activity. Check timed-entry, age, swimsuit and pool rules for the chosen venue.',
    urgency: 'Confirm before booking',
    status: 'Confirmed research',
    link: 'https://www.visitazores.com/en',
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
