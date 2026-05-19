'use strict';

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════ */
const RATE_MULTIDAY = 70;
const RATE_ONEDAY   = 40;
const DEPOSIT_PCT   = 0.20;

/* ═══════════════════════════════════════════════════════════
   TOUR DATA
═══════════════════════════════════════════════════════════ */
const tours = [
  {
    id: 'dalat-loop',
    name: 'Dalat Loop',
    tag: 'Most Popular',
    tagline: 'The Classic Central Highlands Circuit',
    days: 3, nights: 2,
    rateType: 'daily',
    emoji: '🏔️',
    accentColor: '#4ade80',
    heroGradient: 'linear-gradient(135deg, #0D1B10 0%, #1a3a1c 50%, #2d4a1e 100%)',
    shortDesc: 'The classic Central Highlands circuit. Pine forests, hidden waterfalls, coffee plantations, and silk worm farms — all within a stunning 3-day loop that begins and ends in Dalat.',
    longDesc: 'The Dalat Loop is the perfect introduction to Vietnam\'s spectacular Central Highlands. You\'ll spend three days weaving through pine-scented mountain roads, visiting cascading waterfalls tucked into jungle gorges, stopping at working silk farms and coffee plantations, and sleeping in guesthouses where you\'re often the only foreign guest.\n\nUnlike the crowded tourist trails, these roads are quiet and genuine. You\'ll pass through ethnic minority villages, wave at farmers working their fields, and stop wherever catches your eye. There are no rigid schedules — if something looks interesting, we stop.\n\nThis loop is also perfect if you\'re short on time but want a real taste of highland Vietnam. Three days feels like a week.',
    highlights: ['Pine Forests', 'Elephant Waterfall', 'Coffee Farm', 'Silk Worm Village', 'Lang Biang Mountain', 'Crazy House'],
    itinerary: [
      {
        day: 1,
        title: 'Dalat → Elephant Waterfall → Lang Biang',
        km: '~65 km',
        riding: '3–4 hours in the saddle',
        description: 'After meeting your guide over a strong Vietnamese coffee, you leave Dalat and drop into the highlands. The first major stop is Elephant Waterfall (Thác Voi) — a powerful cascade hidden at the end of a jungle path where mist hangs in the air even in dry season. Then it\'s on to the Chicken Village (Làng Dinh An), an ethnic K\'Ho minority settlement where life moves at a very different pace. In the late afternoon you ride to the base of Lang Biang Mountain for sweeping views across the Dalat plateau before checking into a local guesthouse.',
        stops: ['Departure from Dalat city centre', 'Elephant Waterfall (Thác Voi)', 'Linh An Pagoda', 'Chicken Village — K\'Ho ethnic minority', 'Lang Biang Mountain viewpoint'],
        overnight: 'Local guesthouse near Lang Biang',
      },
      {
        day: 2,
        title: 'Waterfalls, Lakes & the Valley of Love',
        km: '~80 km',
        riding: '4–5 hours',
        description: 'Morning starts at the local market before heading to Datanla Falls — one of the most dramatic in the region, accessible via a short jungle hike or a thrilling alpine coaster. Then the Valley of Love, a highland meadow with some of the freshest air in Vietnam. The afternoon is spent at the shores of Xuan Huong Lake in the heart of Dalat, the perfect place to watch the city come alive as the sun drops. Dinner at a local restaurant well off the tourist map.',
        stops: ['Local morning market', 'Prenn Waterfall', 'Datanla Falls — jungle hike', 'Valley of Love', 'Xuan Huong Lake sunset stroll'],
        overnight: 'Guesthouse in central Dalat',
      },
      {
        day: 3,
        title: 'Crazy House, Silk & Coffee — Return to Dalat',
        km: '~45 km',
        riding: '2–3 hours',
        description: 'The final day is a slower, more exploratory ride through Dalat\'s surroundings. Start at the Crazy House (Hang Nga) — a mind-bending architectural masterpiece built into the trees by the daughter of former president Hồ Chí Minh. Then visit a working silk worm farm to see how Vietnam\'s famous silk is produced from cocoon to cloth. Lunch at a coffee plantation with views across the hills. Final stop: Bao Dai Summer Palace, where the last Vietnamese emperor once escaped the heat of Saigon.',
        stops: ['Crazy House (Hang Nga Guesthouse)', 'Dalat Flower Garden', 'Silk worm farm & weaving demo', 'Coffee plantation lunch & tasting', 'Bao Dai Summer Palace', 'Return to Dalat centre'],
        overnight: null,
      },
    ],
    included: ['2 nights accommodation (guesthouses & homestays)', 'All sightseeing entrance tickets', 'Full motorcycle insurance', 'Expert English-speaking guide', 'Motorbike & petrol (self-drive option)', 'Helmet'],
    notIncluded: ['Meals (budget €5–10/day at local spots)', 'Personal travel insurance (recommended)', 'Tips for guide (optional)', 'Alcoholic drinks'],
    bestFor: ['First-time visitors to Vietnam', 'Riders short on time', 'Anyone who loves highland scenery', 'Couples & solo travellers'],
    difficulty: 'Easy – Moderate',
    difficultyNote: 'Paved roads throughout. A few steep sections but nothing technical. Suitable for beginners.',
    note: null,
    relatedTours: ['dalat-hoian-express', 'local-dalat'],
  },
  {
    id: 'dalat-hoian-express',
    name: 'Dalat → Hoi An (Express)',
    tag: '3 Days',
    tagline: 'Mountain Roads North to the Ancient Town',
    days: 3, nights: 2,
    rateType: 'daily',
    emoji: '🌊',
    accentColor: '#60a5fa',
    heroGradient: 'linear-gradient(135deg, #0a1628 0%, #0f2d4a 50%, #0a2020 100%)',
    shortDesc: 'The fast route north along breathtaking coastal mountain roads. The tour ends perfectly timed for the 5 PM sleeping bus directly to Hội An.',
    longDesc: 'This is Vietnam\'s great road trip condensed into three days. You start in the cool mountain air of Dalat and finish with your wheels pointing north, arriving just in time to board the sleeper bus to Hội An — where you\'ll wake up in one of the most beautiful ancient towns in Southeast Asia.\n\nThe roads on this route are almost entirely unknown to foreign tourists. You\'ll pass through tea and coffee regions, drop into river valleys, cross mountain passes with views to the coast, and stop in towns where the arrival of a motorbike with foreign riders is still a genuine curiosity.\n\nTiming on Day 3 is precise: we arrive by 4:30pm, giving you time to eat and board the 5pm sleeping bus. Your guide sees you safely to the bus.',
    highlights: ['Tea Plantations', 'Mountain Passes', 'Dambri Falls', 'Coastal Descent', 'Sleeping Bus to Hội An', 'Zero Tourist Crowds'],
    itinerary: [
      {
        day: 1,
        title: 'Dalat → Tea Country → Bảo Lộc',
        km: '~120 km',
        riding: '5–6 hours',
        description: 'Leaving Dalat heading north-west, the road drops through pine forests before entering the tea and coffee heartland around Di Linh. Stop at a roadside tea farm to see the terraced fields and taste fresh-brewed highland green tea. Continue to Bảo Lộc — Vietnam\'s silk capital — where an afternoon at a traditional silk weaving workshop is unlike anything on the tourist trail.',
        stops: ['Dalat departure', 'Di Linh coffee region', 'Highland tea farm visit & tasting', 'Bảo Lộc silk weaving workshop', 'Dambri Falls (time permitting)'],
        overnight: 'Guesthouse in Bảo Lộc',
      },
      {
        day: 2,
        title: 'Bảo Lộc → Dak Nong Province',
        km: '~160 km',
        riding: '6–7 hours',
        description: 'The longest day on the bike, but the most rewarding. The road winds into Dak Nong province — a region of volcanic soil, coffee plantations, and rivers that carve deep gorges through the plateau. Stop at the dramatic Dray Sap waterfall system, where multiple falls cascade into a single river gorge draped in mist. This region sees almost no foreign tourists.',
        stops: ['Bảo Lộc departure', 'Lâm Đồng plateau back-roads', 'Dray Sap waterfall system', 'Local lunch stop', 'Overnight in Gia Nghĩa'],
        overnight: 'Guesthouse in Gia Nghĩa',
      },
      {
        day: 3,
        title: 'Gia Nghĩa → Coast → Sleeping Bus to Hội An',
        km: '~180 km',
        riding: '7–8 hours',
        description: 'The final day is a long but spectacular push to the coast. The road descends from the highlands through increasingly tropical terrain — bamboo forests give way to rice paddies, then the sea appears on the horizon. Arrive by 4:30pm. Your guide walks you to the bus station and sees you onto the 5pm sleeper to Hội An. You\'ll wake up in one of Vietnam\'s most magical towns.',
        stops: ['Gia Nghĩa departure', 'Highland-to-coast descent', 'Quảng Ngãi city arrival', 'Bus station — 5pm sleeping bus to Hội An'],
        overnight: 'Sleeping bus (arrives Hội An ~10pm)',
        note: 'Sleeping bus ticket NOT included in tour price (approx €8–12). Your guide helps you purchase it on arrival.',
      },
    ],
    included: ['2 nights accommodation', 'All sightseeing tickets', 'Full motorcycle insurance', 'Expert English-speaking guide', 'Motorbike & petrol (self-drive)', 'Helmet', 'Guide assistance at bus station'],
    notIncluded: ['Sleeping bus ticket to Hội An (€8–12)', 'Meals', 'Personal travel insurance', 'Tips'],
    bestFor: ['Travellers heading to Hội An', 'Those wanting to see the real Central Highlands', 'Riders who love point-to-point adventures'],
    difficulty: 'Moderate',
    difficultyNote: 'Longer riding days. Mix of highland and coastal roads, all paved.',
    note: 'Ends with the 5 PM sleeping bus to Hội An — perfectly timed.',
    relatedTours: ['dalat-hoian-hcm', 'dalat-loop'],
  },
  {
    id: 'dalat-hoian-hcm',
    name: 'Dalat → Hoi An (Hồ Chí Minh Trail)',
    tag: '5 Days · Epic',
    tagline: 'The Ultimate Vietnam Ride Along the Historic Trail',
    days: 5, nights: 4,
    rateType: 'daily',
    emoji: '🌿',
    accentColor: '#a3e635',
    heroGradient: 'linear-gradient(135deg, #0a1f0a 0%, #1a3a0a 50%, #0f280f 100%)',
    shortDesc: 'The ultimate Vietnam ride. Follow the historic Hồ Chí Minh Trail through remote jungles, ethnic minority villages, and passes most Vietnamese have never heard of.',
    longDesc: 'This is it. The ride that changes how you see Vietnam.\n\nThe Hồ Chí Minh Trail — the network of jungle roads used to supply the south during the war — has been partially converted into a modern highway, but the real trail still exists. We ride those old roads: narrow, winding, sometimes unpaved, cutting through jungle that swallows sound and light.\n\nFive days north through a Vietnam that even most Vietnamese don\'t know. Ethnic Bahnar villages in Kon Tum where animist traditions are still very much alive. National parks where the road disappears into morning mist for 10km at a time. Coffee and pepper farms run by the same families for three generations.\n\nThis tour is for riders who want more than scenery. It\'s for people who want to understand a country.',
    highlights: ['Hồ Chí Minh Trail', 'Jungle Roads', 'Kon Tum Ethnic Villages', 'Mang Den National Park', 'Mountain Passes', 'Zero Foreign Tourists'],
    itinerary: [
      {
        day: 1,
        title: 'Dalat → Bảo Lộc (Tea & Silk)',
        km: '~120 km',
        riding: '5 hours',
        description: 'The first day eases you in. Drop from Dalat through the coffee belt, passing the red-soil farms of Di Linh before arriving in Bảo Lộc — Vietnam\'s silk capital. Afternoon at a silk factory, evening in a local guesthouse over rice wine and conversation.',
        stops: ['Dalat departure', 'Di Linh coffee belt', 'Bảo Lộc silk factory', 'Local market evening walk'],
        overnight: 'Guesthouse in Bảo Lộc',
      },
      {
        day: 2,
        title: 'Into the Trail — Bảo Lộc → Đắk Nông',
        km: '~140 km',
        riding: '6 hours',
        description: 'This is where the Hồ Chí Minh Trail begins in earnest. The road narrows and the landscape shifts — coffee gives way to denser jungle. The Dray Sap waterfall system is one of the few tourist sights on the entire route. Everything else is pure road and pure Vietnam.',
        stops: ['Enter Hồ Chí Minh Trail corridor', 'Dray Sap waterfall system', 'Local market lunch', 'Đắk Nông overnight'],
        overnight: 'Guesthouse in Gia Nghĩa / Đắk Nông',
      },
      {
        day: 3,
        title: 'Deep Trail — Đắk Nông → Kon Tum',
        km: '~160 km',
        riding: '7 hours',
        description: 'The heart of the trail. Long stretches of empty road through primary jungle, passes with views over valleys that seem to go on forever. Arrive in Kon Tum late afternoon. An evening walk through the Bahnar village on the Dakbla River to see the remarkable communal Rông house is one of the highlights of the entire tour.',
        stops: ['Deep HCM Trail roads', 'Jungle mountain passes', 'Bahnar village (Làng Kon Kơ Tu)', 'Rông communal house'],
        overnight: 'Guesthouse in Kon Tum city',
      },
      {
        day: 4,
        title: 'Kon Tum → Mang Den → Quảng Ngãi',
        km: '~150 km',
        riding: '6–7 hours',
        description: 'Leave Kon Tum through highland coffee farms and enter the cool pine forests of Mang Den — sometimes called the second Dalat. The air smells of pine needles and the road winds through a national park with almost no traffic. Descend towards the coast through dramatic river gorges.',
        stops: ['Kon Tum morning market', 'Mang Den National Park pine forests', 'River gorge descent', 'Quảng Ngãi overnight'],
        overnight: 'Guesthouse in Quảng Ngãi',
      },
      {
        day: 5,
        title: 'Quảng Ngãi → Coastal Road → Hội An',
        km: '~90 km',
        riding: '3–4 hours',
        description: 'The final day is almost a celebration. The hard riding is done, and the coastal road north to Hội An is one of the most beautiful in Vietnam — the sea on your left, green hills on your right, fishing villages in every bay. Arrive in Hội An early afternoon with time to explore the ancient town before sunset.',
        stops: ['Quảng Ngãi departure', 'Coastal highway north', 'Fishing village stops', 'Hội An ancient town arrival'],
        overnight: null,
      },
    ],
    included: ['4 nights accommodation', 'All sightseeing tickets', 'Full motorcycle insurance', 'Expert English-speaking guide', 'Motorbike & petrol (self-drive)', 'Helmet'],
    notIncluded: ['Meals (€5–10/day)', 'Personal travel insurance', 'Tips'],
    bestFor: ['Experienced riders wanting the real thing', 'History & culture enthusiasts', 'Anyone heading north who has time to do it properly'],
    difficulty: 'Moderate – Challenging',
    difficultyNote: 'Some unpaved sections on the trail. Long riding days. Not recommended for complete beginners on self-drive.',
    note: null,
    relatedTours: ['dalat-hoian-express', 'dalat-loop'],
  },
  {
    id: 'dalat-muine',
    name: 'Dalat → Mũi Né Beach',
    tag: '2 Days',
    tagline: 'From Cool Mountains to Warm White Sand',
    days: 2, nights: 1,
    rateType: 'daily',
    emoji: '🏖️',
    accentColor: '#fb923c',
    heroGradient: 'linear-gradient(135deg, #1f0a00 0%, #3a1a00 50%, #2a1500 100%)',
    shortDesc: 'Ride down from the cool highlands to the warm coast. Pass sand dunes, red canyons, and fishing villages before arriving at Mũi Né\'s famous white sand beach.',
    longDesc: 'Two days, two completely different worlds.\n\nYou leave Dalat at elevation, in the pine-scented cool of the highlands. By the time you arrive in Mũi Né, you\'re in a tropical resort town on the South China Sea, warm air on your skin and the smell of the ocean everywhere.\n\nThe descent is spectacular. The road from Phan Rang drops you through dramatic scenery — first the rocky, almost lunar landscape of Ninh Thuận (Vietnam\'s driest province), then the red and white sand dunes that appear like a desert mirage before the blue of the ocean.\n\nPerfect as a two-day add-on from Dalat, or as the start of a beach holiday.',
    highlights: ['Phan Rang Cham Towers', 'Red Sand Dunes', 'White Sand Dunes Sunrise', 'Fairy Stream', 'Fishing Village', 'Mũi Né Beach'],
    itinerary: [
      {
        day: 1,
        title: 'Dalat → Phan Rang → Mũi Né',
        km: '~160 km',
        riding: '6–7 hours',
        description: 'An early start gets you out of Dalat before the heat builds. The road descends sharply — in two hours you drop from 1,500m to sea level and feel the temperature rise with every kilometre. Stop at the Cham towers at Phan Rang — some of the best-preserved Cham architecture in Vietnam, sitting in a dramatic rocky landscape. Continue south along the coast to the Red Sand Dunes at dusk, arriving Mũi Né for dinner by the sea.',
        stops: ['Dalat early departure', 'Highland descent road', 'Cham Towers at Phan Rang (Tháp Chàm)', 'Red Sand Dunes at dusk', 'Mũi Né beach arrival'],
        overnight: 'Guesthouse in Mũi Né',
      },
      {
        day: 2,
        title: 'White Dunes, Fairy Stream & the Fishing Village',
        km: '~30 km local',
        riding: '1–2 hours total',
        description: 'A lazy morning — this day is for exploring Mũi Né at your own pace. Early risers catch sunrise at the White Sand Dunes (worth the 5am alarm). Then wade through the Fairy Stream — a shallow red-rock river winding between dunes and jungle. Visit the fishing village at the Mũi Né peninsula tip, where hundreds of round bamboo boats bob in the bay. Afternoon is yours for the beach.',
        stops: ['White Sand Dunes sunrise (optional early)', 'Fairy Stream wade', 'Mũi Né fishing village', 'Free afternoon at the beach'],
        overnight: null,
      },
    ],
    included: ['1 night accommodation', 'All sightseeing tickets', 'Full motorcycle insurance', 'Expert English-speaking guide', 'Motorbike & petrol (self-drive)', 'Helmet'],
    notIncluded: ['Meals', 'Personal travel insurance', 'Tips', 'Onward transport from Mũi Né'],
    bestFor: ['Beach lovers', 'Short breaks from Dalat', 'Those heading south to Saigon via the coast'],
    difficulty: 'Easy',
    difficultyNote: 'Mostly flat and coastal on Day 2. The Dalat descent has some winding mountain sections.',
    note: null,
    relatedTours: ['dalat-saigon', 'local-dalat'],
  },
  {
    id: 'dalat-saigon',
    name: 'Dalat → Saigon',
    tag: '4 Days',
    tagline: 'From Mountain Serenity to Megacity Energy',
    days: 4, nights: 3,
    rateType: 'daily',
    emoji: '🏙️',
    accentColor: '#f472b6',
    heroGradient: 'linear-gradient(135deg, #1a0a28 0%, #2d1040 50%, #1a0020 100%)',
    shortDesc: 'From mountain city to megacity. An unforgettable ride through the southern highlands, past ancient temples and rubber plantations, finishing in Ho Chi Minh City.',
    longDesc: 'This tour is the perfect way to arrive in Saigon.\n\nInstead of a bus or plane that drops you into the chaos of Ho Chi Minh City with no context, you ride in from the countryside — over four days through a Vietnam that tourists almost never see. By the time you hit the streets of District 1, you\'ll have a completely different understanding of the country you\'ve just ridden through.\n\nThe southern highlands between Dalat and Saigon are remarkable: lush, green, and almost entirely off the tourist map. You\'ll pass through rubber plantations that stretch to the horizon, sleep in provincial towns where the guesthouses are run by families who\'ve never hosted a foreigner, and arrive at Cu Chi Tunnels from the north — the direction the tunnels were actually defending.',
    highlights: ['Southern Highlands', 'Rubber Plantations', 'Ancient Cao Dai Temple', 'Cu Chi Tunnels', 'Saigon Arrival', 'Authentic Province Towns'],
    itinerary: [
      {
        day: 1,
        title: 'Dalat → Bảo Lộc',
        km: '~120 km',
        riding: '5 hours',
        description: 'The classic first day out of Dalat: down through the coffee belt into the tea and silk region around Bảo Lộc. Visit a tea farm perched on a hillside, watch the silk process at a local weaving workshop, and settle into a provincial town where dinner is at a restaurant with plastic chairs and no English menu — the best kind.',
        stops: ['Dalat departure', 'Di Linh coffee road', 'Tea farm visit & tasting', 'Bảo Lộc silk workshop', 'Overnight Bảo Lộc'],
        overnight: 'Guesthouse in Bảo Lộc',
      },
      {
        day: 2,
        title: 'Bảo Lộc → Di Linh → Gia Ray',
        km: '~140 km',
        riding: '6 hours',
        description: 'Today follows the old road south — not the highway, but the route that follows the contours of the land through pepper and coffee farms. Stop at a riverside market, eat lunch at a roadside stall that probably hasn\'t changed in 30 years. The afternoon brings you into the lowland forests east of the route.',
        stops: ['Bảo Lộc departure', 'Old road south (not the highway)', 'Riverside morning market', 'Pepper & coffee farm roads', 'Local lunch stop', 'Gia Ray / Xuân Lộc overnight'],
        overnight: 'Guesthouse in Gia Ray',
      },
      {
        day: 3,
        title: 'Rubber Country → Near Saigon',
        km: '~130 km',
        riding: '5–6 hours',
        description: 'The rubber plantations south of Đồng Nai province are something out of a dream — row upon row of straight white trees receding to the horizon, pale latex cups attached to their trunks. Ride through them for 40km. Stop at an ancient Cao Dai temple in Biên Hòa, then push west to overnight just outside the city limits.',
        stops: ['Gia Ray departure', 'Đồng Nai rubber plantation roads', 'Cao Dai temple (Biên Hòa)', 'Overnight near Saigon outskirts'],
        overnight: 'Guesthouse near HCMC (Thủ Đức / Bình Dương)',
      },
      {
        day: 4,
        title: 'Cu Chi Tunnels → Saigon',
        km: '~80 km',
        riding: '3 hours',
        description: 'The final day starts at Cu Chi Tunnels — the extraordinary underground network that allowed Vietnamese fighters to operate for years under American forces. Arriving from the north, as the tunnel defenders once did, gives it an entirely different weight. Then the final ride into Saigon: the city grows around you gradually, motorbikes multiply, the air changes. You arrive.',
        stops: ['Cu Chi Tunnels (2 hour visit)', 'Hóc Môn market (optional)', 'Ho Chi Minh City centre — arrival'],
        overnight: null,
      },
    ],
    included: ['3 nights accommodation', 'All sightseeing tickets', 'Full motorcycle insurance', 'Expert English-speaking guide', 'Motorbike & petrol (self-drive)', 'Helmet'],
    notIncluded: ['Meals', 'Personal travel insurance', 'Tips', 'Onward transport from Saigon'],
    bestFor: ['Anyone finishing their trip in Saigon', 'History & culture riders', 'Those who want the full south Vietnam experience'],
    difficulty: 'Easy – Moderate',
    difficultyNote: 'Mostly flat once out of the highlands. Traffic increases significantly on Day 4 approaching Saigon.',
    note: null,
    relatedTours: ['dalat-loop', 'dalat-muine'],
  },
  {
    id: 'local-dalat',
    name: 'Local Dalat Day Tour',
    tag: '1 Day · Great Intro',
    tagline: 'The Best of Dalat in One Epic Day',
    days: 1, nights: 0,
    rateType: 'flat',
    emoji: '🌸',
    accentColor: '#e879f9',
    heroGradient: 'linear-gradient(135deg, #1a0a28 0%, #280f2a 50%, #1a0828 100%)',
    shortDesc: 'Discover Dalat\'s hidden corners in a single epic day. Markets at dawn, highland villages, viewpoints only locals know, and the best phở you\'ll eat in Vietnam.',
    longDesc: 'If you only have one day in Dalat — or if you want to get your bearings before a longer tour — this is the day.\n\nYour guide knows Dalat the way only someone born and raised here can. The hidden market stalls that open at 6am. The viewpoint that every guidebook misses. The phở place that has had the same broth recipe for 40 years.\n\nThis isn\'t a tick-the-landmarks tour. It\'s a day spent actually living in Dalat, from the cold blue of early morning at the market to the last light on Xuan Huong Lake in the afternoon.',
    highlights: ['Dawn Market', 'Xuan Huong Lake', 'Crazy House', 'Silk Worm Farm', 'Local Phở Lunch', 'Flower Gardens', 'Elephant Waterfall'],
    itinerary: [
      {
        day: 1,
        title: 'A Full Day in Dalat — Dawn to Dusk',
        km: '~40 km local',
        riding: '2–3 hours total (short rides between stops)',
        description: 'The day starts before the tourists are awake. No two days are exactly the same — your guide adapts the route to you. Here\'s what a typical day looks like:',
        stops: [
          '6:00 am — Đà Lạt Central Market: the real market before tourist stalls open. Vendors selling highland vegetables, strawberries, artichokes, and fresh-ground coffee direct from farms.',
          '8:00 am — Xuan Huong Lake & Dalat Railway Station: the lake in morning mist, and the beautiful French-colonial station.',
          '9:30 am — Hang Nga Crazy House: the architectural masterpiece built to look like a living tree.',
          '11:00 am — Silk worm farm: full production process from cocoon to finished fabric.',
          '12:30 pm — Lunch at a local phở restaurant (your guide\'s personal favourite — not a tourist trap).',
          '2:00 pm — Elephant Waterfall: the most spectacular waterfall near Dalat, 45 minutes from the city.',
          '3:30 pm — Coffee plantation: fresh-ground highland coffee with a view across the hills.',
          '5:00 pm — Dalat Flower Garden: 300 species on the shores of the lake as the light turns golden.',
        ],
        overnight: null,
      },
    ],
    included: ['All sightseeing entrance tickets', 'Full motorcycle insurance', 'Expert English-speaking guide', 'Motorbike & petrol (self-drive)', 'Helmet'],
    notIncluded: ['Meals (approx €5–8)', 'Personal travel insurance', 'Tips'],
    bestFor: ['First-timers in Dalat', 'Travellers with only one day', 'Anyone wanting a genuine local perspective'],
    difficulty: 'Easy',
    difficultyNote: 'Short riding distances. Suitable for all experience levels including complete beginners.',
    note: null,
    relatedTours: ['dalat-loop', 'dalat-muine'],
  },
];

/* ═══════════════════════════════════════════════════════════
   PRICING HELPERS
═══════════════════════════════════════════════════════════ */
function getTourPricePerPerson(tour) {
  return tour.rateType === 'flat' ? RATE_ONEDAY : RATE_MULTIDAY * tour.days;
}

function formatEUR(amount) {
  return `€${amount.toLocaleString('en-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function calcPricing(tour, groupSize) {
  const perPerson  = getTourPricePerPerson(tour);
  const total      = perPerson * groupSize;
  const deposit    = Math.ceil(total * DEPOSIT_PCT);
  const remainder  = total - deposit;
  const rateLabel  = tour.rateType === 'flat'
    ? `${formatEUR(RATE_ONEDAY)} flat / person`
    : `${formatEUR(RATE_MULTIDAY)}/person/day × ${tour.days} days`;
  return { perPerson, total, deposit, remainder, rateLabel };
}

/* ═══════════════════════════════════════════════════════════
   BOOKING — SAVE TO LOCALSTORAGE
═══════════════════════════════════════════════════════════ */
function saveBooking({ name, tourId, date, groupSize, rideStyle, total, deposit, remainder }) {
  try {
    const existing = JSON.parse(localStorage.getItem('erv_bookings') || '[]');
    const tour     = tours.find(t => t.id === tourId);
    const booking  = {
      id:         'BK' + Date.now(),
      name,
      tourId,
      tourName:   tour ? tour.name : tourId,
      date,
      groupSize,
      rideStyle,
      total,
      deposit,
      remainder,
      status:     'pending',
      createdAt:  new Date().toISOString(),
    };
    existing.unshift(booking);
    localStorage.setItem('erv_bookings', JSON.stringify(existing));
  } catch (e) {
    // localStorage may be unavailable in some contexts
  }
}

/* ═══════════════════════════════════════════════════════════
   RENDER TOUR CARDS (homepage grid)
═══════════════════════════════════════════════════════════ */
function renderTours() {
  const grid = document.getElementById('toursGrid');
  if (!grid) return;

  grid.innerHTML = tours.map(tour => {
    const pricePerPerson = getTourPricePerPerson(tour);
    const durationStr    = tour.nights > 0
      ? `${tour.days} Days / ${tour.nights} Night${tour.nights > 1 ? 's' : ''}`
      : `${tour.days} Day`;
    const priceNote      = tour.rateType === 'flat'
      ? 'per person (flat rate)'
      : `per person (${formatEUR(RATE_MULTIDAY)}/day × ${tour.days} days)`;

    return `
      <article class="tour-card">
        <div class="tour-card-header">
          <span class="tour-tag">${tour.tag}</span>
          <h3 class="tour-name">${tour.name}</h3>
          <p class="tour-duration">⏱ ${durationStr}</p>
        </div>
        <div class="tour-card-body">
          <p class="tour-desc">${tour.shortDesc}</p>
          <div class="tour-highlights">
            ${tour.highlights.slice(0,5).map(h => `<span class="tour-highlight">${h}</span>`).join('')}
          </div>
          ${tour.note ? `<p style="font-size:12px;color:var(--orange);font-weight:600;margin-top:6px">ℹ️ ${tour.note}</p>` : ''}
        </div>
        <div class="tour-card-footer">
          <div class="tour-price">
            <span class="tour-price-amount">${formatEUR(pricePerPerson)}</span>
            <span class="tour-price-note">${priceNote}</span>
          </div>
          <div style="display:flex;gap:8px;flex-direction:column;align-items:flex-end">
            <a href="tour.html?id=${tour.id}" class="btn btn-ghost tour-detail-btn">Details</a>
            <a href="tour.html?id=${tour.id}#book" class="btn btn-primary tour-book-btn" onclick="prefillTour('${tour.id}')">Book This</a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/* ═══════════════════════════════════════════════════════════
   POPULATE BOOKING FORM SELECT
═══════════════════════════════════════════════════════════ */
function populateTourSelect(preselect) {
  const sel = document.getElementById('tourSelect');
  if (!sel) return;
  while (sel.options.length > 1) sel.remove(1);
  tours.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    const dur = t.nights > 0 ? `${t.days}D/${t.nights}N` : '1 Day';
    opt.textContent = `${t.name} (${dur})`;
    if (preselect && preselect === t.id) opt.selected = true;
    sel.appendChild(opt);
  });
  if (preselect) updatePriceSummary();
}

/* ═══════════════════════════════════════════════════════════
   PRICE SUMMARY
═══════════════════════════════════════════════════════════ */
function updatePriceSummary() {
  const tourId    = document.getElementById('tourSelect')?.value;
  const groupSize = parseInt(document.getElementById('groupSize')?.value, 10);
  const summary   = document.getElementById('priceSummary');
  const submitBtn = document.getElementById('submitBtn');

  if (!tourId || !groupSize || !summary) {
    if (summary) summary.style.display = 'none';
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  const tour = tours.find(t => t.id === tourId);
  if (!tour) return;

  const { total, deposit, remainder, rateLabel } = calcPricing(tour, groupSize);

  document.getElementById('priceLabel').textContent    = rateLabel;
  document.getElementById('priceBase').textContent     = formatEUR(getTourPricePerPerson(tour));
  document.getElementById('priceGroup').textContent    = `× ${groupSize} ${groupSize === 1 ? 'person' : 'people'}`;
  document.getElementById('priceTotal').textContent    = formatEUR(total);
  document.getElementById('priceDeposit').textContent  = formatEUR(deposit);
  document.getElementById('priceRemainder').textContent = formatEUR(remainder);

  summary.style.display = 'flex';
  if (submitBtn) submitBtn.disabled = false;
}

/* ═══════════════════════════════════════════════════════════
   GROUP STEPPER
═══════════════════════════════════════════════════════════ */
const MAX_GROUP = 10;
let groupCount = 1;

function setGroupCount(n) {
  groupCount = Math.max(1, Math.min(MAX_GROUP, n));
  const disp = document.getElementById('groupDisplay');
  const inp  = document.getElementById('groupSize');
  const dec  = document.getElementById('decreaseGroup');
  const inc  = document.getElementById('increaseGroup');
  if (disp) disp.textContent = groupCount;
  if (inp)  inp.value        = groupCount;
  if (dec)  dec.style.opacity = groupCount === 1        ? '0.35' : '1';
  if (inc)  inc.style.opacity = groupCount === MAX_GROUP ? '0.35' : '1';
  updatePriceSummary();
}

/* ═══════════════════════════════════════════════════════════
   PREFILL FROM TOUR CARD OR URL
═══════════════════════════════════════════════════════════ */
function prefillTour(tourId) {
  const sel = document.getElementById('tourSelect');
  if (sel) { sel.value = tourId; updatePriceSummary(); }
}

/* ═══════════════════════════════════════════════════════════
   SET MIN DATE
═══════════════════════════════════════════════════════════ */
function setMinDate() {
  const d = document.getElementById('startDate');
  if (!d) return;
  const t = new Date();
  d.min = `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`;
}

/* ═══════════════════════════════════════════════════════════
   FORM VALIDATION
═══════════════════════════════════════════════════════════ */
function clearErrors() {
  ['nameError','tourError','dateError','groupError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

function validateForm() {
  clearErrors();
  let valid = true;
  if (!document.getElementById('name')?.value.trim())         { document.getElementById('nameError').textContent  = 'Please enter your name.';         valid = false; }
  if (!document.getElementById('tourSelect')?.value)          { document.getElementById('tourError').textContent  = 'Please select a tour.';            valid = false; }
  if (!document.getElementById('startDate')?.value)           { document.getElementById('dateError').textContent  = 'Please choose a start date.';      valid = false; }
  const g = parseInt(document.getElementById('groupSize')?.value, 10);
  if (!g || g < 1 || g > MAX_GROUP)                           { document.getElementById('groupError').textContent = `Group size must be 1–${MAX_GROUP}.`; valid = false; }
  return valid;
}

/* ═══════════════════════════════════════════════════════════
   WHATSAPP MESSAGE BUILDER
═══════════════════════════════════════════════════════════ */
function buildWhatsAppMessage() {
  const name      = document.getElementById('name').value.trim();
  const tourId    = document.getElementById('tourSelect').value;
  const dateVal   = document.getElementById('startDate').value;
  const groupSize = parseInt(document.getElementById('groupSize').value, 10);
  const rideStyle = document.querySelector('input[name="rideStyle"]:checked').value;

  const tour = tours.find(t => t.id === tourId);
  if (!tour) return null;

  const { total, deposit, remainder } = calcPricing(tour, groupSize);

  const dateStr   = new Date(dateVal + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const rideLabel = rideStyle === 'self' ? 'Self-drive (motorbike + fuel included)' : 'Guide-driven';
  const durStr    = tour.nights > 0 ? `${tour.days} Days / ${tour.nights} Night${tour.nights > 1 ? 's' : ''}` : '1 Day';

  saveBooking({ name, tourId, date: dateVal, groupSize, rideStyle, total, deposit, remainder });

  const msg = [
    `🏍️ *EASY RIDER VIETNAM LOOPS — BOOKING REQUEST*`,
    ``,
    `👤 *Name:* ${name}`,
    `🗺️ *Tour:* ${tour.name}`,
    `📅 *Start Date:* ${dateStr}`,
    `⏱️ *Duration:* ${durStr}`,
    `👥 *Group Size:* ${groupSize} ${groupSize === 1 ? 'person' : 'people'}`,
    `🏍️ *Riding Style:* ${rideLabel}`,
    ``,
    `💶 *PRICING SUMMARY*`,
    `Total: ${formatEUR(total)}`,
    `20% Deposit (online now): ${formatEUR(deposit)}`,
    `80% on arrival (cash/card to guide): ${formatEUR(remainder)}`,
    ``,
    `✅ *Full insurance included.*`,
    ``,
    `Please confirm my booking. Thank you! 🙏`,
  ].join('\n');

  const phoneNumber = '84000000000'; // ← replace with real WhatsApp number
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
}

/* ═══════════════════════════════════════════════════════════
   FORM SUBMIT
═══════════════════════════════════════════════════════════ */
function handleFormSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;
  const url = buildWhatsAppMessage();
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
}

/* ═══════════════════════════════════════════════════════════
   NAV HAMBURGER
═══════════════════════════════════════════════════════════ */
function closeMenu() {
  document.getElementById('navLinks')?.classList.remove('open');
  document.getElementById('hamburger')?.classList.remove('open');
}

/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  // Homepage tour grid
  renderTours();

  // Booking form
  const preselect = new URLSearchParams(window.location.search).get('tour');
  populateTourSelect(preselect);
  setMinDate();
  setGroupCount(1);

  document.getElementById('tourSelect')?.addEventListener('change', updatePriceSummary);
  document.getElementById('decreaseGroup')?.addEventListener('click', () => setGroupCount(groupCount - 1));
  document.getElementById('increaseGroup')?.addEventListener('click', () => setGroupCount(groupCount + 1));
  document.querySelectorAll('input[name="rideStyle"]').forEach(r => r.addEventListener('change', updatePriceSummary));
  document.getElementById('bookingForm')?.addEventListener('submit', handleFormSubmit);

  // Hamburger nav
  document.getElementById('hamburger')?.addEventListener('click', function () {
    this.classList.toggle('open');
    document.getElementById('navLinks')?.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    const h = document.getElementById('hamburger');
    const n = document.getElementById('navLinks');
    if (h && n && !h.contains(e.target) && !n.contains(e.target)) closeMenu();
  });

  // Scroll-active nav highlight
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
});
