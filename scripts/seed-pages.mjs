#!/usr/bin/env node
/**
 * Seed a Sanity dataset with the site's pages, navigation and settings —
 * a 1:1 map of the hand-built site into the page-builder schema.
 *
 *   SANITY_WRITE_TOKEN=sk... node scripts/seed-pages.mjs staging
 *
 * Re-running replaces the same documents (fixed IDs), so it is safe to repeat.
 */
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const PROJECT_ID = process.env.SANITY_PROJECT_ID || '3c10guha'
const TOKEN = process.env.SANITY_WRITE_TOKEN
const DATASET = process.argv[2]

if (!TOKEN) {
  console.error('Missing SANITY_WRITE_TOKEN environment variable.')
  process.exit(1)
}
if (!DATASET) {
  console.error('Usage: node scripts/seed-pages.mjs <dataset>')
  process.exit(1)
}

const API = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01`
const AUTH = {Authorization: `Bearer ${TOKEN}`}

const key = () => Math.random().toString(36).slice(2, 12)
const k = (obj) => ({_key: key(), ...obj})

const toBlocks = (paragraphs) =>
  paragraphs.map((text) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: key(), text, marks: []}],
  }))

const MIME = {'.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp'}
const uploaded = new Map()

async function uploadImage(relPath) {
  if (uploaded.has(relPath)) return uploaded.get(relPath)
  const abs = path.join(ROOT, relPath)
  const body = fs.readFileSync(abs)
  const filename = path.basename(abs)
  const res = await fetch(`${API}/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}`, {
    method: 'POST',
    headers: {...AUTH, 'Content-Type': MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream'},
    body,
  })
  const json = await res.json()
  if (!res.ok || !json.document) throw new Error(`Upload failed for ${relPath}: ${JSON.stringify(json)}`)
  uploaded.set(relPath, json.document._id)
  console.log(`  uploaded ${filename}`)
  return json.document._id
}

const img = (assetId, alt) => ({_type: 'figure', asset: {_type: 'reference', _ref: assetId}, alt})

const IMG = {
  crowd: 'assets/photo-resort-crowd.jpg',
  pov: 'assets/photo-snowboarder-pov.jpg',
  blueSky: 'assets/photo-blue-sky-resort.jpg',
  chairlift: 'assets/photo-chairlift-golden.jpg',
  peak: 'assets/photo-mt-buller-peak.jpg',
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
  console.log(`Seeding pages into project ${PROJECT_ID}, dataset "${DATASET}"\n`)
  console.log('Uploading images…')
  const A = {}
  for (const [name, rel] of Object.entries(IMG)) A[name] = await uploadImage(rel)

  const conditionsStrip = k({
    _type: 'conditionsStripBlock',
    updatedLabel: 'Updated 7 min ago · 5 May 2026, 7:42 AM',
    showLiveChip: true,
    stats: [
      k({_type: 'conditionStat', icon: 'snow', value: '142 cm', label: 'Base depth', detail: 'Bourke Street'}),
      k({_type: 'conditionStat', icon: 'cloud-snow', value: '32 cm', label: 'Last 24 h', detail: 'fresh, light'}),
      k({_type: 'conditionStat', icon: 'thermometer', value: '−4°', label: 'Temperature', detail: 'feels like −9°'}),
      k({_type: 'conditionStat', icon: 'mountain', value: '14 / 22', label: 'Lifts open', detail: 'wind-hold Summit'}),
    ],
    reportLink: {
      _type: 'link',
      label: 'Full snow report',
      href: 'https://www.mtbuller.com.au/winter/the-mountain/snow-report',
      newTab: true,
      icon: 'external',
    },
  })

  /* ── HOME ── */
  const home = {
    _id: 'page-index',
    _type: 'page',
    title: 'Home',
    slug: {_type: 'slug', current: 'index'},
    headerStyle: 'none',
    showConditionsStrip: false,
    showMemberBand: true,
    content: [
      conditionsStrip,
      k({
        _type: 'heroBlock',
        eyebrow: 'Mt Buller · Est. 1962',
        heading: 'Your home',
        headingEmphasis: 'on the mountain.',
        lead: 'A members’ lodge at the end of The Avenue. Ski straight in off Standard, walk five minutes to the lifts, and meet everyone over dinner.',
        backgroundVideoUrl: 'assets/hero1-opt.mp4',
        posterImage: img(A.crowd, 'Skiers at Mt Buller'),
        sideImage: img(A.pov, "Snowboarder's view at Mt Buller"),
        sideImageTitle: '14 The Avenue',
        sideImageSubtitle: 'Mt Buller · Last lodge on the road',
        ctas: [
          k({_type: 'cta', label: 'Member login', href: 'login.html', style: 'cta', icon: 'lock'}),
          k({_type: 'cta', label: 'Become a member', href: 'enquiries.html', style: 'ghost-light'}),
        ],
        stats: [
          k({_type: 'statItem', value: '1962', label: 'Founded'}),
          k({_type: 'statItem', value: '40+', label: 'Beds · 12 rooms'}),
          k({_type: 'statItem', value: '5 min', label: 'Walk to lifts'}),
          k({_type: 'statItem', value: '60+', label: 'Winters on Buller'}),
        ],
      }),
      k({
        _type: 'quoteBlock',
        eyebrow: 'Sixty winters in',
        quote: '"Last lodge on the Avenue.\nSki straight in off Standard."',
        attribution: '— Mitre Ski Club · Est. 1962',
        backgroundImage: img(A.crowd, 'Mt Buller resort'),
      }),
      k({
        _type: 'featureGridBlock',
        heading: {
          _type: 'sectionHeading',
          eyebrow: 'Why members stay',
          heading: 'A small lodge, run by its members.',
          intro:
            'Sixty-odd years of working bees, dinners, snow days and Sunday departures. Mitre is a club, not a hotel — and it shows.',
        },
        features: [
          k({
            _type: 'feature',
            icon: 'mountain',
            title: 'Ski-in, ski-out',
            body: "The last lodge on The Avenue, with Standard at the front door and the beginner area five minutes' walk away.",
          }),
          k({
            _type: 'feature',
            icon: 'users',
            title: 'Communal by design',
            body: 'Twelve rooms, shared kitchen, big drying room, and a TV room that gets loud after a powder day.',
          }),
          k({
            _type: 'feature',
            icon: 'calendar',
            title: 'Open year-round',
            body: 'Winter is the big show, but the lodge is also available for groups in summer — mountain biking, walking, the family.',
          }),
        ],
      }),
      k({
        _type: 'newsListBlock',
        heading: {
          _type: 'sectionHeading',
          eyebrow: 'Latest from the lodge',
          heading: "What's happening on the mountain",
        },
        layout: 'rail',
        limit: 3,
        tintedBackground: true,
        viewAllLink: {_type: 'link', label: 'All news', href: 'news.html', icon: 'arrow'},
      }),
      k({
        _type: 'reviewsBlock',
        heading: {
          _type: 'sectionHeading',
          eyebrow: 'What members & guests say',
          heading: 'Sixty winters of happy skiers.',
        },
        score: '4.8',
        scoreCaption: 'Based on Google reviews',
        allReviewsLink: {
          _type: 'link',
          label: 'View all reviews',
          href: 'https://www.google.com/maps/place/Mitre+Ski+Club/data=!4m2!3m1!1s0x0:0xf93f066352e269fc',
          newTab: true,
        },
        reviews: [
          k({_type: 'review', name: 'James T.', initials: 'JT', rating: 5, date: 'March 2026', attribution: 'Verified member', text: "The perfect alpine club. Small enough that everyone knows each other, big enough to have everything you need. We've been coming for six seasons and it just gets better."}),
          k({_type: 'review', name: 'Priya S.', initials: 'PS', rating: 5, date: 'August 2025', attribution: 'Verified member', text: "Ski-in, ski-out from Standard was everything. The drying room is brilliant — gear's always ready next morning. Warm, welcoming crew and the best positioned lodge on The Avenue."}),
          k({_type: 'review', name: 'Marcus H.', initials: 'MH', rating: 5, date: 'July 2025', attribution: 'Verified member', text: "As a family of four we were worried a club lodge might feel unwelcoming, but it was the opposite. Kids loved the TV room after dinner; we loved the fact that it wasn't a hotel."}),
          k({_type: 'review', name: 'Anna W.', initials: 'AW', rating: 5, date: 'June 2025', attribution: 'Verified member', text: 'Did the working bee weekend in May and stayed for a ski trip in July. This is what skiing should feel like — communal, affordable, and a great laugh at the end of the day.'}),
          k({_type: 'review', name: 'Daniel C.', initials: 'DC', rating: 5, date: 'September 2024', attribution: 'Verified member', text: "Brilliant value compared to resort accommodation. The lodge manager Anna runs an incredibly tight ship. Allocation system is fair, kitchen is well equipped. Can't fault it."}),
          k({_type: 'review', name: 'Sophie R.', initials: 'SR', rating: 4, date: 'August 2024', attribution: 'Verified member', text: 'Excellent location at the end of The Avenue. Rooms are cosy — not luxury but totally comfortable. The view from the lounge on a clear morning is worth it alone.'}),
        ],
      }),
    ],
  }

  /* ── LODGE ── */
  const lodge = {
    _id: 'page-lodge',
    _type: 'page',
    title: 'The Lodge',
    slug: {_type: 'slug', current: 'lodge'},
    headerStyle: 'banner',
    breadcrumb: 'The Lodge',
    showMemberBand: true,
    header: {
      _type: 'pageHeader',
      eyebrow: 'A guide for members & guests',
      heading: 'The Lodge.',
      lead: 'Last lodge on The Avenue. Ski straight in, walk five minutes to the lifts.',
      backgroundImage: img(A.crowd, 'Mt Buller resort'),
      facts: [
        k({_type: 'fact', value: '12 rooms', detail: '2–5 berths'}),
        k({_type: 'fact', value: '~40 beds', detail: 'doonas supplied'}),
        k({_type: 'fact', value: 'Bus stop 9', detail: 'two lodges away'}),
        k({_type: 'fact', value: 'Wi-Fi', detail: 'browsing only'}),
      ],
    },
    content: [
      k({
        _type: 'infoSectionsBlock',
        sidebarTitle: 'On this page',
        sections: [
          k({
            _type: 'infoSection',
            title: 'About the lodge',
            anchor: {_type: 'slug', current: 'about'},
            content: toBlocks([
              "Mitre Lodge has been on Mt Buller since 1962. We're a small, friendly club run by its members. The lodge holds about forty across twelve rooms — a mix of doubles, singles and bunks, with shared bathrooms and a big communal kitchen.",
            ]),
            image: img(A.chairlift, 'Mt Buller lifts'),
          }),
          k({
            _type: 'infoSection',
            title: 'Community spirit',
            anchor: {_type: 'slug', current: 'community'},
            content: toBlocks([
              'Mitre is communal by design. Members get involved with meetings and working bees; the lodge manager and members give a warm welcome as new guests arrive. There are smiles in the morning and stories at the end of the day.',
            ]),
          }),
          k({
            _type: 'infoSection',
            title: 'Ski-in / Ski-out location',
            anchor: {_type: 'slug', current: 'location'},
            content: toBlocks([
              'Mitre is at the end of The Avenue, next to the Navy Lodge. Being the last lodge on the road, the views are excellent and access is straight onto Standard (intermediate). Bus Stop No. 9 is two lodges down.',
            ]),
          }),
          k({
            _type: 'infoSection',
            title: 'Facilities',
            anchor: {_type: 'slug', current: 'facilities'},
            content: toBlocks([
              'Communal lounge rooms, TV rooms, dining and a large drying room. Twelve bedrooms — 2 to 5-berth, with combinations of doubles, singles and bunks. Each bedroom has a hand basin. The kitchen has a large fridge, gas and electric stoves, ovens, microwaves, dishwashers.',
            ]),
            cards: [
              k({_type: 'infoCard', title: '12 bedrooms', detail: '2–5 berths · all with hand basins'}),
              k({_type: 'infoCard', title: 'Shared kitchen', detail: 'Allocated fridge & pantry shelves'}),
              k({_type: 'infoCard', title: 'Drying room', detail: 'Boots off in the foyer, please'}),
            ],
          }),
          k({
            _type: 'infoSection',
            title: 'Check-in',
            anchor: {_type: 'slug', current: 'check-in'},
            content: toBlocks([
              'Ring the doorbell or use the security code in your booking confirmation email. Ski boots go in the drying room before heading into the lodge. Your room allocation will be on the whiteboard in the foyer. Changeover is by 5pm.',
            ]),
          }),
          k({
            _type: 'infoSection',
            title: 'Check-out',
            anchor: {_type: 'slug', current: 'check-out'},
            content: toBlocks([
              "You're responsible for cleaning your room — wipe the basin and tiles, vacuum the carpet. Clear your pantry and fridge shelves. All done by 5pm. Taxi: (03) 5777 6070.",
            ]),
          }),
          k({
            _type: 'infoSection',
            title: 'What to bring',
            anchor: {_type: 'slug', current: 'bring'},
            content: toBlocks([
              "Doonas and pillows are supplied. Linen isn't — please bring a bottom sheet, top sheet (or sleeping bag), pillow case and a towel.",
              'Tea, coffee, sugar, jam, honey, sauces and mustards are provided. Bring your own food and drinks. Mansfield IGA delivers: (03) 5775 2014.',
            ]),
          }),
          k({
            _type: 'infoSection',
            title: 'Getting there',
            anchor: {_type: 'slug', current: 'getting-there'},
            content: toBlocks([
              'Drive up and park, or take the bus from Mansfield/Merrijig. Fees are paid at the Merrijig gate. Chains must be carried until end of season — hire them in Mansfield.',
              "Oversnow taxis: Mon–Thu 7am–midnight, Fri 7am–3am, Sat 7am–2am, Sun 7am–midnight. Tell the driver it's next to Navy at the end of The Avenue.",
            ]),
            button: k({_type: 'cta', label: 'Full directions & map', href: 'directions.html', style: 'ghost', icon: 'map-pin'}),
          }),
          k({
            _type: 'infoSection',
            title: 'Outside ski season',
            anchor: {_type: 'slug', current: 'summer'},
            content: toBlocks([
              "Mountain biking, bushwalking, horse riding, scenic chairlift rides, summer events. The lodge is available for individuals or group bookings out of season. We'll send keys and walk you through opening and security.",
            ]),
          }),
        ],
      }),
    ],
  }

  /* ── MT BULLER ── */
  const buller = {
    _id: 'page-buller',
    _type: 'page',
    title: 'Mt Buller',
    slug: {_type: 'slug', current: 'buller'},
    headerStyle: 'banner',
    breadcrumb: 'Mt Buller',
    showConditionsStrip: true,
    showMemberBand: true,
    header: {
      _type: 'pageHeader',
      eyebrow: 'The mountain · Resort info',
      heading: 'Mt Buller.',
      lead: "Everything you'll want bookmarked before you drive up.",
      backgroundImage: img(A.blueSky, 'Blue sky over Mt Buller'),
    },
    content: [
      k({
        _type: 'forecastBlock',
        heading: {_type: 'sectionHeading', eyebrow: '7-day outlook', heading: 'Snow & weather forecast'},
        days: [
          k({_type: 'forecastDay', day: 'Tue', date: '5', icon: 'cloud-snow', high: '−2', low: '−8', snowCm: '12'}),
          k({_type: 'forecastDay', day: 'Wed', date: '6', icon: 'cloud-snow', high: '0', low: '−6', snowCm: '4'}),
          k({_type: 'forecastDay', day: 'Thu', date: '7', icon: 'sun', high: '2', low: '−4', snowCm: '0'}),
          k({_type: 'forecastDay', day: 'Fri', date: '8', icon: 'cloud-snow', high: '−1', low: '−7', snowCm: '8'}),
          k({_type: 'forecastDay', day: 'Sat', date: '9', icon: 'snow', high: '−3', low: '−10', snowCm: '22'}),
          k({_type: 'forecastDay', day: 'Sun', date: '10', icon: 'snow', high: '−4', low: '−11', snowCm: '18'}),
          k({_type: 'forecastDay', day: 'Mon', date: '11', icon: 'cloud-snow', high: '−2', low: '−9', snowCm: '6'}),
        ],
      }),
      k({
        _type: 'youtubeBlock',
        heading: {
          _type: 'sectionHeading',
          eyebrow: 'Live from the mountain',
          heading: 'Snow cams',
          intro: 'Check current conditions on the slopes before you head up.',
        },
        url: 'https://www.youtube.com/live/0OtVlfDj2w8',
        title: 'Mt Buller live snow cam',
        height: 520,
        tintedBackground: true,
        moreLink: {
          _type: 'link',
          label: 'More cams on mtbuller.com.au',
          href: 'https://www.mtbuller.com.au/winter/weather/web-cams',
          newTab: true,
          icon: 'external',
        },
      }),
      k({
        _type: 'contactListBlock',
        heading: {
          _type: 'sectionHeading',
          heading: 'Contact numbers',
          intro: 'The list members usually want when something needs sorting.',
        },
        contacts: [
          k({_type: 'contactItem', label: 'Lift tickets, Ski & Snowboard School', value: '(03) 5777 7800'}),
          k({_type: 'contactItem', label: 'Mt Buller taxis', value: '(03) 5777 6070'}),
          k({_type: 'contactItem', label: 'Resort Management (gate, parking)', value: '(03) 5777 6077'}),
          k({_type: 'contactItem', label: 'Towing & chain fitting', value: '0427 077 572'}),
          k({_type: 'contactItem', label: 'Ski Patrol', value: '(03) 5777 7808'}),
          k({_type: 'contactItem', label: 'Emergencies (Fire / Ambo / Police)', value: '000'}),
          k({_type: 'contactItem', label: 'Buller Medical Centre (winter)', value: '(03) 5777 6185'}),
          k({_type: 'contactItem', label: 'Mansfield IGA (delivers to Mitre)', value: '(03) 5775 2014'}),
        ],
      }),
      k({
        _type: 'linkListBlock',
        heading: {
          _type: 'sectionHeading',
          heading: 'Useful links',
          intro: 'Resort information, bookings and reports.',
        },
        links: [
          k({_type: 'link', label: 'Mt Buller website', href: 'https://www.mtbuller.com.au/', newTab: true}),
          k({_type: 'link', label: 'Resort entry & taxis', href: 'https://www.mtbuller.com.au/winter/plan-your-trip/getting-here', newTab: true}),
          k({_type: 'link', label: 'Lift passes', href: 'https://www.mtbuller.com.au/winter/tickets-passes/lift-passes', newTab: true}),
          k({_type: 'link', label: 'Snow cams', href: 'https://www.mtbuller.com.au/winter/weather/web-cams', newTab: true}),
          k({_type: 'link', label: 'Full snow report', href: 'https://www.mtbuller.com.au/winter/the-mountain/snow-report', newTab: true}),
          k({_type: 'link', label: 'BoM forecast', href: 'https://www.bom.gov.au/vic/forecasts/alpine.shtml', newTab: true}),
          k({_type: 'link', label: 'Resort maps', href: 'https://www.mtbuller.com.au/winter/the-mountain/trail-map', newTab: true}),
          k({_type: 'link', label: 'Race results', href: 'https://www.mtbuller.com.au/winter/on-the-mountain/ski-race', newTab: true}),
        ],
      }),
      k({
        _type: 'featureGridBlock',
        heading: {
          _type: 'sectionHeading',
          eyebrow: 'On the mountain this season',
          heading: 'Events to plan around',
        },
        features: [
          k({_type: 'feature', badge: '14 Jun', title: 'Opening Weekend', body: 'King of the Mountain race plus fireworks Saturday night.'}),
          k({_type: 'feature', badge: '12 Jul', title: 'Buller Mardi Gras', body: 'Costume parade down Bourke Street; lodge dinner pre-game.'}),
          k({_type: 'feature', badge: '23 Aug', title: 'Telemark Festival', body: 'Free-heel classes, demo skis, end-of-day at Kooroora.'}),
        ],
      }),
    ],
  }

  /* ── NEWS ── */
  const news = {
    _id: 'page-news',
    _type: 'page',
    title: 'News',
    slug: {_type: 'slug', current: 'news'},
    headerStyle: 'banner',
    breadcrumb: 'News',
    showMemberBand: true,
    header: {
      _type: 'pageHeader',
      eyebrow: 'News, notices & used gear',
      heading: 'From the lodge.',
      lead: 'Snow reports, season notices, working bee dates, and the occasional pair of skis going to a new home.',
      backgroundImage: img(A.crowd, 'Mt Buller resort'),
    },
    content: [k({_type: 'newsListBlock', layout: 'archive', showFilters: true, tintedBackground: false})],
  }

  /* ── GALLERY ── */
  const gallery = {
    _id: 'page-gallery',
    _type: 'page',
    title: 'Gallery',
    slug: {_type: 'slug', current: 'gallery'},
    headerStyle: 'banner',
    breadcrumb: 'Gallery',
    showMemberBand: false,
    header: {
      _type: 'pageHeader',
      eyebrow: "Members' gallery",
      heading: 'Sixty winters of moments.',
      lead: 'Powder days, working bees, golden hours and the last ski of the season.',
      backgroundImage: img(A.crowd, 'Mt Buller resort'),
    },
    content: [
      k({
        _type: 'galleryGridBlock',
        showFilters: true,
        filters: [
          k({_type: 'galleryFilter', label: 'All photos', category: 'all'}),
          k({_type: 'galleryFilter', label: 'On the mountain', category: 'mountain'}),
          k({_type: 'galleryFilter', label: 'Lodge life', category: 'lodge'}),
          k({_type: 'galleryFilter', label: 'Working bees', category: 'bee'}),
          k({_type: 'galleryFilter', label: 'Off-season', category: 'summer'}),
        ],
      }),
      k({
        _type: 'instagramBlock',
        heading: 'Follow us on Instagram',
        body: 'Members sharing the season in real time — powder alerts, working bee photos, and the occasional après ski.',
        handle: 'mitreskiclub',
        footnote: toBlocks([
          'Got photos from Mitre? Send them to secretary@mitreskiclub.com to be featured.',
        ]),
      }),
    ],
  }

  /* ── SHOP ── */
  const shop = {
    _id: 'page-shop',
    _type: 'page',
    title: 'Used gear shop',
    slug: {_type: 'slug', current: 'shop'},
    headerStyle: 'banner',
    breadcrumb: 'Used gear shop',
    showMemberBand: true,
    header: {
      _type: 'pageHeader',
      eyebrow: "Members' classifieds",
      heading: 'Used ski gear.',
      lead: 'Skis, boots, jackets and helmets from fellow members. Good gear, fair prices.',
      backgroundImage: img(A.pov, 'Snowboarder at Mt Buller'),
    },
    content: [
      k({
        _type: 'noticeBlock',
        icon: 'info',
        content: toBlocks([
          'Members-only listings. Contact the seller directly using the details in the member portal. To list your own gear, email secretary@mitreskiclub.com with photos, price and description. All sales are between members — the club takes no commission.',
        ]),
      }),
      k({
        _type: 'gearGridBlock',
        showFilters: true,
        filters: ['All', 'Skis', 'Boots', 'Jacket', 'Helmet', 'Kids skis'],
        hideSold: false,
        contactButtonLabel: 'Contact seller',
        contactButtonHref: 'login.html',
      }),
    ],
  }

  /* ── DIRECTIONS ── */
  const directions = {
    _id: 'page-directions',
    _type: 'page',
    title: 'Directions',
    slug: {_type: 'slug', current: 'directions'},
    headerStyle: 'banner',
    breadcrumb: 'Directions',
    showMemberBand: false,
    header: {
      _type: 'pageHeader',
      eyebrow: 'Getting here',
      heading: 'Find us on the mountain.',
      lead: '14 The Avenue, Mt Buller VIC 3723. Last lodge on the road.',
      backgroundImage: img(A.peak, 'Mt Buller peak'),
    },
    content: [
      k({
        _type: 'mapBlock',
        embedUrl:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1561.2!2d146.4375!3d-37.1527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xf93f066352e269fc!2sMitre%20Ski%20Club!5e0!3m2!1sen!2sau!4v1',
        title: 'Mitre Ski Club location',
        grayscale: true,
      }),
      k({
        _type: 'stepsBlock',
        heading: {_type: 'sectionHeading', heading: 'Step-by-step directions'},
        tabs: [
          k({
            _type: 'stepTab',
            label: 'By car',
            icon: 'car',
            steps: [
              k({_type: 'step', title: 'Leave Melbourne via the Hume Freeway', body: 'Head northeast on the Hume Freeway (M31). Take the Seymour exit and continue towards Mansfield on the Maroondah Highway.'}),
              k({_type: 'step', title: 'Through Mansfield — chains available here', body: 'Mansfield is 190 km from Melbourne CBD (about 2.5 hrs). Hire or buy snow chains at any of the service stations or gear shops on the main street. Chains must be carried from the gate.'}),
              k({_type: 'step', title: 'Pay resort entry at the Merrijig gate', body: "The entry gate is at Merrijig, 9 km before the village. Staff will collect resort entry fees. Keep your receipt — you'll need it for parking."}),
              k({_type: 'step', title: 'Drive to the top — follow signs to The Avenue', body: 'Drive up the mountain road (about 16 km, allow 30–40 min in ski season). At the top, follow signs to The Avenue. Mitre is the last lodge — number 14.'}),
              k({_type: 'step', title: 'Park in the designated guest parking area', body: 'There is allocated parking behind the lodge. The lodge number is 14 The Avenue. Ring the bell or use the code from your booking confirmation.'}),
            ],
          }),
          k({
            _type: 'stepTab',
            label: 'By bus / train',
            icon: 'bus',
            steps: [
              k({_type: 'step', title: 'Book the Mansfield–Mt Buller bus', body: 'The Mansfield–Mt Buller Snowball Express bus runs daily during ski season from the Mansfield Bus Terminal. Bookings via Mount Buller Resort Management: (03) 5777 6077.'}),
              k({_type: 'step', title: 'Take the train to Seymour or Shepparton', body: 'V/Line trains run from Southern Cross Station to Seymour (1.5 hrs). From Seymour you can connect to the coach service to Mansfield.'}),
              k({_type: 'step', title: 'Coach from Mansfield to Mt Buller', body: 'The resort bus drops passengers at the village plaza. From there, the oversnow taxi service (03) 5777 6070 runs to all lodge addresses. Tell the driver 14 The Avenue.'}),
            ],
          }),
        ],
      }),
      k({
        _type: 'linkCardsBlock',
        heading: {
          _type: 'sectionHeading',
          heading: 'Useful links',
          intro: 'Everything you need before heading up.',
        },
        cards: [
          k({_type: 'linkCard', icon: 'external', title: 'Mt Buller resort entry', subtitle: 'Fees, permits & conditions', href: 'https://www.mtbuller.com.au/winter/plan-your-trip/getting-here'}),
          k({_type: 'linkCard', icon: 'external', title: 'Oversnow taxi service', subtitle: 'Book: (03) 5777 6070', href: 'tel:0357776070'}),
          k({_type: 'linkCard', icon: 'map-pin', title: 'Google Maps', subtitle: '14 The Avenue, Mt Buller VIC', href: 'https://www.google.com/maps/place/Mitre+Ski+Club/data=!4m2!3m1!1s0x0:0xf93f066352e269fc'}),
          k({_type: 'linkCard', icon: 'external', title: 'VicRoads traffic info', subtitle: 'Road conditions & alerts', href: 'https://traffic.vicroads.vic.gov.au/'}),
          k({_type: 'linkCard', icon: 'external', title: 'Snow chains info', subtitle: 'When & how to fit chains', href: 'https://www.mtbuller.com.au/winter/plan-your-trip/getting-here#chains'}),
          k({_type: 'linkCard', icon: 'external', title: 'V/Line trains', subtitle: 'Melbourne → Seymour / Shepparton', href: 'https://www.vline.com.au/'}),
        ],
      }),
      k({
        _type: 'addressBlock',
        heading: 'Address',
        content: toBlocks([
          'Mitre Ski Club, 14 The Avenue, Mt Buller VIC 3723',
          'Lodge phone (winter only): ask at resort reception.',
        ]),
      }),
    ],
  }

  /* ── ENQUIRIES ── */
  const enquiries = {
    _id: 'page-enquiries',
    _type: 'page',
    title: 'Enquiries',
    slug: {_type: 'slug', current: 'enquiries'},
    headerStyle: 'banner',
    breadcrumb: 'Enquiries',
    showMemberBand: false,
    header: {
      _type: 'pageHeader',
      eyebrow: 'Get in touch',
      heading: 'Say hello.',
      lead: "Whether you're thinking about joining, after a group booking, or just have a question — drop us a line.",
      backgroundImage: img(A.crowd, 'Mt Buller resort'),
    },
    content: [
      k({
        _type: 'enquiryFormBlock',
        heading: 'Send us a note',
        intro: '* required',
        topics: [
          k({_type: 'topic', label: 'Becoming a member', value: 'membership'}),
          k({_type: 'topic', label: "Staying as a member's guest", value: 'guest'}),
          k({_type: 'topic', label: 'Group booking (off-season)', value: 'group'}),
          k({_type: 'topic', label: 'Something else', value: 'other'}),
        ],
        messagePlaceholder:
          "A short note about what you're after, your skiing/snowboarding history, or who put you onto Mitre…",
        consentLabel: "I'm happy for the committee to contact me.",
        submitLabel: 'Send enquiry',
        successHeading: 'Thanks — your message is on its way.',
        successBody: "We'll be in touch within a week.",
        sidebar: {
          heading: 'How membership works',
          intro:
            'Mitre is a small, member-run club. New memberships open when existing members move on.',
          steps: [
            k({_type: 'formStep', title: 'Get in touch.', body: 'Use the form, or email the secretary.'}),
            k({_type: 'formStep', title: 'Visit the lodge.', body: "Stay a weekend or two as a member's guest."}),
            k({_type: 'formStep', title: 'Submit a nomination.', body: 'A current member proposes; another seconds.'}),
            k({_type: 'formStep', title: 'Committee review.', body: 'Decisions are made monthly during winter.'}),
          ],
          contactsHeading: 'Direct contacts',
          contacts: [
            k({_type: 'formContact', label: 'Secretary', value: 'secretary@mitreskiclub.com'}),
            k({_type: 'formContact', label: 'Bookings', value: 'bookings@mitreskiclub.com'}),
            k({_type: 'formContact', label: 'President', value: 'president@mitreskiclub.com'}),
            k({_type: 'formContact', label: 'Treasurer', value: 'treasurer@mitreskiclub.com'}),
          ],
        },
      }),
    ],
  }

  /* ── LOGIN ── */
  const login = {
    _id: 'page-login',
    _type: 'page',
    title: 'Member login',
    slug: {_type: 'slug', current: 'login'},
    headerStyle: 'none',
    showMemberBand: false,
    content: [
      k({
        _type: 'loginFormBlock',
        eyebrow: 'Members',
        heading: 'Log in to bookings.',
        intro: 'Use the email you registered with the club.',
        submitLabel: 'Log in',
        successMessage: 'Sending you to bookings.mitreskiclub.com…',
        joinPrompt: 'Not a member?',
        joinLink: {_type: 'link', label: 'Enquire about joining', href: 'enquiries.html'},
        art: {
          backgroundImage: img(A.crowd, 'Mt Buller resort'),
          welcomeHeading: 'Welcome back',
          welcomeEmphasis: 'to the mountain.',
          welcomeBody:
            "Bookings, season dates, members' notices and used-gear listings — all yours.",
          quote: '"Last lodge on the Avenue. Ski straight in off Standard."',
          quoteAttribution: '— Mitre Ski Club, est. 1962',
        },
      }),
    ],
  }

  /* ── Global singletons ── */
  const settings = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'Mitre Ski Club',
    tagline:
      "A members' lodge on Mt Buller, Victoria. Skiing, eating and arguing over dinner since 1962.",
    memberLoginLabel: 'Member login',
    memberLoginHref: 'login.html',
    organisationName: 'Mitre Lodge',
    address: '14 The Avenue\nMt Buller VIC 3723',
    email: 'secretary@mitreskiclub.com',
    copyright: '© 2026 Mitre Ski Club Inc.',
    socialLinks: [
      k({_type: 'link', label: 'Instagram', href: 'https://www.instagram.com/mitreskiclub/', newTab: true, icon: 'instagram'}),
      k({_type: 'link', label: 'Facebook', href: 'https://www.facebook.com/mitreskiclub/', newTab: true, icon: 'facebook'}),
    ],
  }

  const nav = {
    _id: 'navigation',
    _type: 'navigation',
    mainNav: [
      k({_type: 'link', label: 'Home', href: 'index.html'}),
      k({_type: 'link', label: 'The Lodge', href: 'lodge.html'}),
      k({_type: 'link', label: 'Mt Buller', href: 'buller.html'}),
      k({_type: 'link', label: 'News', href: 'news.html'}),
      k({_type: 'link', label: 'Gallery', href: 'gallery.html'}),
      k({_type: 'link', label: 'Enquiries', href: 'enquiries.html'}),
    ],
    mobileExtras: [k({_type: 'link', label: 'Used gear shop', href: 'shop.html'})],
    footerGroups: [
      k({
        _type: 'footerGroup',
        heading: 'Visit',
        links: [
          k({_type: 'link', label: 'Home', href: 'index.html'}),
          k({_type: 'link', label: 'The Lodge', href: 'lodge.html'}),
          k({_type: 'link', label: 'Mt Buller', href: 'buller.html'}),
          k({_type: 'link', label: 'Directions', href: 'directions.html'}),
          k({_type: 'link', label: 'Snow cams', href: 'https://www.mtbuller.com.au/winter/weather/web-cams', newTab: true, icon: 'external'}),
        ],
      }),
      k({
        _type: 'footerGroup',
        heading: 'Members',
        links: [
          k({_type: 'link', label: 'Login to bookings', href: 'login.html'}),
          k({_type: 'link', label: "Members' gallery", href: 'gallery.html'}),
          k({_type: 'link', label: 'Used gear shop', href: 'shop.html'}),
        ],
      }),
      k({
        _type: 'footerGroup',
        heading: 'Join',
        links: [
          k({_type: 'link', label: 'News & notices', href: 'news.html'}),
          k({_type: 'link', label: 'Become a member', href: 'enquiries.html'}),
          k({_type: 'link', label: 'Make an enquiry', href: 'enquiries.html'}),
        ],
      }),
    ],
    legalLinks: [
      k({_type: 'link', label: 'Privacy', href: '#'}),
      k({_type: 'link', label: 'Terms', href: '#'}),
    ],
    builtByLine: 'Built by the Web Committee',
  }

  const band = {
    _id: 'memberBand',
    _type: 'memberBand',
    eyebrow: 'Members',
    heading: 'Already a Mitre member?',
    body: "Skip ahead. Bookings, season dates, members' notices — all in the portal.",
    button: {_type: 'cta', label: 'Login to bookings', href: 'login.html', style: 'cta', icon: 'lock'},
    footnote: 'bookings.mitreskiclub.com',
  }

  const docs = [home, lodge, buller, news, gallery, shop, directions, enquiries, login, settings, nav, band]

  console.log(`\nCreating ${docs.length} documents…`)
  await mutate(docs.map((doc) => ({createOrReplace: doc})))

  console.log('\nDone. Pages in this dataset:')
  const res = await fetch(
    `${API}/data/query/${DATASET}?query=${encodeURIComponent('*[_type=="page"]|order(title asc){title,"slug":slug.current,"blocks":count(content)}')}`,
    {headers: AUTH}
  )
  const {result} = await res.json()
  for (const p of result) console.log(`  ${p.slug}.html — ${p.title} (${p.blocks} block(s))`)
}

main().catch((err) => {
  console.error('\nSeed failed:', err.message)
  process.exit(1)
})
