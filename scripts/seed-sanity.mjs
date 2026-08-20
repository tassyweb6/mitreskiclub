#!/usr/bin/env node
/**
 * Seed a Sanity dataset with the site's original hand-written content.
 *
 *   SANITY_WRITE_TOKEN=sk... node scripts/seed-sanity.mjs staging
 *   SANITY_WRITE_TOKEN=sk... node scripts/seed-sanity.mjs staging --force
 *
 * Without --force the script refuses to run if the dataset already holds
 * documents of the types it creates, so it can't silently duplicate content.
 */
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const PROJECT_ID = process.env.SANITY_PROJECT_ID || '3c10guha'
const TOKEN = process.env.SANITY_WRITE_TOKEN
const DATASET = process.argv[2]
const FORCE = process.argv.includes('--force')

if (!TOKEN) {
  console.error('Missing SANITY_WRITE_TOKEN environment variable.')
  process.exit(1)
}
if (!DATASET) {
  console.error('Usage: node scripts/seed-sanity.mjs <dataset> [--force]')
  process.exit(1)
}

const API = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01`
const AUTH = {Authorization: `Bearer ${TOKEN}`}

const key = () => Math.random().toString(36).slice(2, 12)

/** paragraphs -> Portable Text blocks */
const toBlocks = (paragraphs) =>
  paragraphs.map((text) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: key(), text, marks: []}],
  }))

const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10)

const MIME = {'.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp'}

const uploaded = new Map()
async function uploadImage(relPath) {
  if (uploaded.has(relPath)) return uploaded.get(relPath)
  const abs = path.join(ROOT, relPath)
  const body = fs.readFileSync(abs)
  const ext = path.extname(abs).toLowerCase()
  const filename = path.basename(abs)
  const res = await fetch(`${API}/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}`, {
    method: 'POST',
    headers: {...AUTH, 'Content-Type': MIME[ext] || 'application/octet-stream'},
    body,
  })
  const json = await res.json()
  if (!res.ok || !json.document) throw new Error(`Upload failed for ${relPath}: ${JSON.stringify(json)}`)
  const id = json.document._id
  uploaded.set(relPath, id)
  console.log(`  uploaded ${filename} -> ${id}`)
  return id
}

const imageField = (assetId, alt) => ({
  _type: 'image',
  asset: {_type: 'reference', _ref: assetId},
  alt,
})

/* ── source content (the site's original hardcoded arrays) ─────────── */

const IMG = {
  crowd: 'assets/photo-resort-crowd.jpg',
  pov: 'assets/photo-snowboarder-pov.jpg',
  blueSky: 'assets/photo-blue-sky-resort.jpg',
  chairlift: 'assets/photo-chairlift-golden.jpg',
  peak: 'assets/photo-mt-buller-peak.jpg',
  mountain: 'assets/mountain.png',
}

const POSTS = [
  {
    slug: 'first-snow',
    category: 'Snow report',
    image: IMG.crowd,
    alt: 'Skiers on a busy Mt Buller slope',
    publishedAt: '2026-05-12',
    readingTimeMinutes: 3,
    title: 'First proper dump of the season blankets Buller',
    excerpt:
      'Thirty centimetres overnight, with another front due Friday. The lodge manager has the boot room ready.',
    body: [
      "If you've been watching the radar, you'll already know — the first real front of the season rolled through Buller on Tuesday night, dropping just over thirty centimetres on Bourke Street and a touch more up on the summit.",
      "It's the earliest decent fall we've seen since 2021. Bourke Street is open with two lifts spinning; Standard is still patchy in places but skiable end-to-end.",
      "We've had the lodge manager Anna up since the weekend. The boot room is sorted, the kitchen restocked, and there's firewood under the eaves. A second front is forecast for Friday — twenty to forty centimetres possible.",
    ],
  },
  {
    slug: 'agm-2026',
    category: 'Notice',
    image: IMG.pov,
    alt: "Snowboarder's point of view heading down a run",
    publishedAt: '2026-04-28',
    readingTimeMinutes: 2,
    title: '2026 AGM — Saturday 7 June, online & in person',
    excerpt:
      'Voting opens for two committee positions; agenda and proxy forms now available in the member portal.',
    body: [
      "The 2026 Annual General Meeting will be held on Saturday 7 June at 10am, in person at the lodge with a Zoom link for members who can't make it up the hill.",
      'Two committee positions are open — Treasurer and Bookings Secretary. Nominations close Friday 30 May.',
    ],
  },
  {
    slug: 'working-bee',
    category: 'Working bee',
    image: IMG.blueSky,
    alt: 'Blue sky over the Mt Buller village',
    publishedAt: '2026-04-14',
    readingTimeMinutes: 4,
    title: 'Working bee weekend — May 17–18',
    excerpt:
      'Two days, food provided, a couple of beds available for those travelling up. Sign up via the portal.',
    body: [
      'Our annual pre-season working bee is Saturday 17 and Sunday 18 May. The to-do list is mostly maintenance — check the heating, sweep the chimney, scrub the drying room, plus the usual spring clean of the kitchen.',
      "Food and drinks are on the club. If you're driving from Melbourne and want a bed Friday or Saturday night, sign up early.",
    ],
  },
  {
    slug: 'used-skis',
    category: 'Used gear',
    image: IMG.chairlift,
    alt: 'Chairlift at golden hour',
    publishedAt: '2026-04-08',
    readingTimeMinutes: 1,
    title: 'Used gear: members selling skis, boots & jackets',
    excerpt:
      "Six listings this week — Volkl Mantras, a like-new Arc'teryx shell, and two pairs of kids' boots.",
    body: [
      "The pre-season used-gear listings are up. Six items this week including a pair of Volkl Mantra M6 (172cm), an Arc'teryx Sabre LT shell in size M, and two pairs of kids' Salomon QSTs.",
      'Listings are members-only; log in to the portal to see prices. Head to the used gear shop to browse listings.',
    ],
  },
  {
    slug: 'season-pass',
    category: 'Season',
    image: IMG.mountain,
    alt: 'Mt Buller mountain profile',
    publishedAt: '2026-03-22',
    readingTimeMinutes: 2,
    title: 'Season pass deadline — Friday 26 April',
    excerpt:
      "Buller's early-bird pricing closes end of April. Group rates available for parties of six or more.",
    body: [
      "Mt Buller's early-bird season pass pricing closes on Friday 26 April. After that, you'll pay the standard rate — usually a difference of around $200 per adult.",
      "If you're skiing with five or more friends or family, the group rate brings the per-pass price down further.",
    ],
  },
  {
    slug: 'buller-bike',
    category: 'Off-season',
    image: IMG.peak,
    alt: 'Mt Buller peak above the clouds',
    publishedAt: '2026-03-05',
    readingTimeMinutes: 3,
    title: 'Lodge bookings now open for summer & autumn',
    excerpt:
      'Mountain biking, walking, family weekends — the lodge is yours outside the snow season too.',
    body: [
      'The lodge is available for individual and group bookings outside the ski season. Mountain biking is in full swing through summer and autumn.',
      "There's no lodge manager in residence between October and June — we'll send you the keys, the codes, and a walkthrough of opening, closing and security.",
    ],
  },
]

const GEAR = [
  {
    title: 'Volkl Mantra M6',
    category: 'Skis',
    size: '172 cm',
    price: 380,
    status: 'available',
    seller: 'Tim B.',
    postedDaysAgo: 2,
    image: IMG.chairlift,
    alt: 'Volkl Mantra M6 skis',
    description:
      '2022 season, excellent condition. One edge repair near tip, otherwise clean. Marker bindings not included.',
  },
  {
    title: "Arc'teryx Sabre LT Shell",
    category: 'Jacket',
    size: 'Medium',
    price: 450,
    status: 'available',
    seller: 'Sarah K.',
    postedDaysAgo: 5,
    image: IMG.pov,
    alt: "Arc'teryx Sabre LT shell jacket",
    description:
      'Worn one season. Gore-Tex, all seams intact, no damage. Navy blue. DWR treatment still active.',
  },
  {
    title: 'Salomon QST Jr. (pair)',
    category: 'Kids skis',
    size: '130 cm',
    price: 120,
    status: 'available',
    seller: 'The Hendersons',
    postedDaysAgo: 7,
    image: IMG.blueSky,
    alt: 'Salomon QST junior skis',
    description:
      "Two seasons' use by a 9-year-old. Edges good, no major base damage. Bindings set for 23 BSL.",
  },
  {
    title: 'Nordica Strider 130',
    category: 'Boots',
    size: '27.5 (EU 42)',
    price: 160,
    status: 'reserved',
    seller: 'Marcus W.',
    postedDaysAgo: 3,
    image: IMG.crowd,
    alt: 'Nordica Strider 130 ski boots',
    description:
      'One full season. Soles in great shape, liner fresh. Stiff enough for advanced skiing, walkable sole.',
  },
  {
    title: 'Smith Vantage MIPS',
    category: 'Helmet',
    size: 'Medium (55–59 cm)',
    price: 180,
    status: 'available',
    seller: 'Priya S.',
    postedDaysAgo: 4,
    image: IMG.peak,
    alt: 'Smith Vantage MIPS helmet',
    description:
      "2023 model, two seasons' use, no impact. All vents working, MIPS liner clean and intact. Matte black.",
  },
  {
    title: 'Dynastar Legend 88 W',
    category: 'Skis',
    size: '164 cm',
    price: 290,
    status: 'sold',
    seller: 'Anna R.',
    postedDaysAgo: 14,
    image: IMG.chairlift,
    alt: 'Dynastar Legend 88 W skis',
    description:
      "Three seasons' use. Solid all-mountain ski, good edge hold. Selling because I moved up to a wider waist.",
  },
]

const GALLERY = [
  {image: IMG.crowd, caption: 'Opening weekend 2024', context: 'Lodge crew', category: 'lodge'},
  {image: IMG.chairlift, caption: 'Golden hour on the lift', context: 'July 2025', category: 'mountain'},
  {image: IMG.pov, caption: 'Powder day POV', context: 'First light off Standard', category: 'mountain'},
  {image: IMG.blueSky, caption: 'Perfect blue sky', context: 'Summit view, 2023', category: 'mountain'},
  {image: IMG.peak, caption: 'Above the clouds', context: 'Mt Buller peak', category: 'mountain'},
  {image: IMG.crowd, caption: 'Working bee weekend', context: 'May 2024 — all hands', category: 'bee'},
  {image: IMG.chairlift, caption: 'Pre-dinner drinks', context: 'Lodge lounge, 2024', category: 'lodge'},
  {image: IMG.blueSky, caption: 'Sunday departure run', context: 'Last turns of the trip', category: 'mountain'},
  {image: IMG.pov, caption: 'Mitre crew out early', context: 'Bourke St, 7am', category: 'mountain'},
  {image: IMG.peak, caption: 'Summer mountain bike trip', context: 'March 2025', category: 'summer'},
  {image: IMG.crowd, caption: 'AGM dinner at the lodge', context: 'June 2025', category: 'lodge'},
  {image: IMG.chairlift, caption: 'New members weekend', context: 'September 2024', category: 'lodge'},
]

/* ── run ───────────────────────────────────────────────────────────── */

async function query(groq) {
  const res = await fetch(`${API}/data/query/${DATASET}?query=${encodeURIComponent(groq)}`, {headers: AUTH})
  const json = await res.json()
  return json.result
}

async function mutate(mutations) {
  const res = await fetch(`${API}/data/mutate/${DATASET}`, {
    method: 'POST',
    headers: {...AUTH, 'Content-Type': 'application/json'},
    body: JSON.stringify({mutations}),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`Mutation failed: ${JSON.stringify(json)}`)
  return json
}

async function main() {
  console.log(`Seeding project ${PROJECT_ID}, dataset "${DATASET}"\n`)

  const existing = await query('count(*[_type in ["post","gearListing","galleryPhoto"]])')
  if (existing > 0 && !FORCE) {
    console.error(
      `Dataset "${DATASET}" already has ${existing} document(s) of these types.\n` +
        `Re-run with --force to seed anyway (this will ADD duplicates, not replace).`
    )
    process.exit(1)
  }

  console.log('Uploading images…')
  const assets = {}
  for (const rel of Object.values(IMG)) assets[rel] = await uploadImage(rel)

  console.log('\nBuilding documents…')
  const docs = []

  for (const p of POSTS) {
    docs.push({
      _type: 'post',
      title: p.title,
      slug: {_type: 'slug', current: p.slug},
      category: p.category,
      publishedAt: p.publishedAt,
      readingTimeMinutes: p.readingTimeMinutes,
      excerpt: p.excerpt,
      mainImage: imageField(assets[p.image], p.alt),
      body: toBlocks(p.body),
    })
  }

  for (const g of GEAR) {
    docs.push({
      _type: 'gearListing',
      title: g.title,
      category: g.category,
      size: g.size,
      price: g.price,
      status: g.status,
      seller: g.seller,
      postedAt: daysAgo(g.postedDaysAgo),
      image: imageField(assets[g.image], g.alt),
      description: g.description,
    })
  }

  for (const g of GALLERY) {
    docs.push({
      _type: 'galleryPhoto',
      caption: g.caption,
      context: g.context,
      category: g.category,
      image: imageField(assets[g.image], g.caption),
    })
  }

  console.log(`Creating ${docs.length} documents…`)
  await mutate(docs.map((doc) => ({create: doc})))

  const counts = await query(
    '{"posts":count(*[_type=="post"]),"gear":count(*[_type=="gearListing"]),"gallery":count(*[_type=="galleryPhoto"])}'
  )
  console.log('\nDone. Dataset now contains:')
  console.log(`  post:         ${counts.posts}`)
  console.log(`  gearListing:  ${counts.gear}`)
  console.log(`  galleryPhoto: ${counts.gallery}`)
}

main().catch((err) => {
  console.error('\nSeed failed:', err.message)
  process.exit(1)
})
