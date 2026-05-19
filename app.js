'use strict';

const RATE_MULTIDAY = 70;
const RATE_ONEDAY   = 40;
const DEPOSIT_PCT   = 0.20;

const tours = [
  {
    id: 'dalat-loop',
    name: 'Dalat Loop',
    tag: 'Most Popular',
    days: 3, nights: 2,
    rateType: 'daily',
    description: 'The classic Central Highlands circuit. Pine forests, hidden waterfalls, coffee plantations, and silk worm farms — all within a stunning 3-day loop that begins and ends in Dalat.',
    highlights: ['Pine Forests', 'Waterfall Hike', 'Coffee Farm', 'Silk Worm Village', 'Local Market'],
  },
  {
    id: 'dalat-hoian-express',
    name: 'Dalat → Hoi An (Express)',
    tag: '3 Days',
    days: 3, nights: 2,
    rateType: 'daily',
    description: 'The fast route north along breathtaking coastal mountain roads. The tour ends perfectly timed for the 5 PM sleeping bus directly to Hội An.',
    highlights: ['Coastal Roads', 'Mountain Passes', 'Sleeping Bus to Hội An', 'Sea Views', 'Local Lunch Stops'],
    note: 'Ends with the 5 PM sleeping bus to Hội An — perfectly timed.',
  },
  {
    id: 'dalat-hoian-hcm',
    name: 'Dalat → Hoi An (Hồ Chí Minh Trail)',
    tag: '5 Days · Epic',
    days: 5, nights: 4,
    rateType: 'daily',
    description: 'The ultimate Vietnam ride. Follow the historic Hồ Chí Minh Trail through remote jungles, ethnic minority villages, and passes most Vietnamese have never heard of.',
    highlights: ['Hồ Chí Minh Trail', 'Jungle Roads', 'Ethnic Villages', 'Mountain Passes', 'Zero Tourists'],
  },
  {
    id: 'dalat-muine',
    name: 'Dalat → Mũi Né Beach',
    tag: '2 Days',
    days: 2, nights: 1,
    rateType: 'daily',
    description: 'Ride down from the cool highlands to the warm coast. Pass sand dunes, red canyons, and fishing villages before arriving at Mũi Né’s famous white sand beach.',
    highlights: ['Sand Dunes', 'Red Canyon', 'Coastal Descent', 'Fishing Villages', 'Beach Finish'],
  },
  {
    id: 'dalat-saigon',
    name: 'Dalat → Saigon',
    tag: '4 Days',
    days: 4, nights: 3,
    rateType: 'daily',
    description: 'From mountain city to megacity. An unforgettable ride through the southern highlands, past ancient temples and rubber plantations, finishing in Ho Chi Minh City.',
    highlights: ['Southern Highlands', 'Ancient Temples', 'Rubber Plantations', 'Country Roads', 'Saigon Arrival'],
  },
  {
    id: 'local-dalat',
    name: 'Local Dalat Day Tour',
    tag: '1 Day · Great Intro',
    days: 1, nights: 0,
    rateType: 'flat',
    description: 'Discover Dalat’s hidden corners in a single epic day. Markets at dawn, highland villages, viewpoints only locals know, and the best phở you’ll eat in Vietnam.',
    highlights: ['Dawn Market', 'Highland Villages', 'Secret Viewpoints', 'Local Pho', 'Flower Farms'],
  },
];

function getTourPricePerPerson(tour) {
  return tour.rateType === 'flat' ? RATE_ONEDAY : RATE_MULTIDAY * tour.days;
}

function formatEUR(amount) {
  return `€${amount.toLocaleString('en-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function calcPricing(tour, groupSize) {
  const perPerson = getTourPricePerPerson(tour);
  const total     = perPerson * groupSize;
  const deposit   = Math.ceil(total * DEPOSIT_PCT);
  const remainder = total - deposit;
  const rateLabel = tour.rateType === 'flat'
    ? `${formatEUR(RATE_ONEDAY)} flat / person`
    : `${formatEUR(RATE_MULTIDAY)}/person/day × ${tour.days} days`;
  return { perPerson, total, deposit, remainder, rateLabel };
}

function renderTours() {
  const grid = document.getElementById('toursGrid');
  if (!grid) return;
  grid.innerHTML = tours.map(tour => {
    const pricePerPerson = getTourPricePerPerson(tour);
    const durationStr    = tour.nights > 0
      ? `${tour.days} Days / ${tour.nights} Night${tour.nights > 1 ? 's' : ''}`
      : `${tour.days} Day`;
    const priceNote = tour.rateType === 'flat'
      ? 'per person (flat)'
      : `per person (${formatEUR(RATE_MULTIDAY)}/day × ${tour.days} days)`;
    return `
      <article class="tour-card">
        <div class="tour-card-header">
          <span class="tour-tag">${tour.tag}</span>
          <h3 class="tour-name">${tour.name}</h3>
          <p class="tour-duration">⏱ ${durationStr}</p>
        </div>
        <div class="tour-card-body">
          <p class="tour-desc">${tour.description}</p>
          <div class="tour-highlights">${tour.highlights.map(h => `<span class="tour-highlight">${h}</span>`).join('')}</div>
          ${tour.note ? `<p style="font-size:12px;color:var(--orange);font-weight:600;margin-top:4px">ℹ️ ${tour.note}</p>` : ''}
        </div>
        <div class="tour-card-footer">
          <div class="tour-price">
            <span class="tour-price-amount">${formatEUR(pricePerPerson)}</span>
            <span class="tour-price-note">${priceNote}</span>
          </div>
          <a href="#book" class="btn btn-primary tour-book-btn" onclick="prefillTour('${tour.id}')">Book This</a>
        </div>
      </article>`;
  }).join('');
}

function populateTourSelect() {
  const sel = document.getElementById('tourSelect');
  if (!sel) return;
  tours.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    const dur = t.nights > 0 ? `${t.days}D/${t.nights}N` : '1 Day';
    opt.textContent = `${t.name} (${dur})`;
    sel.appendChild(opt);
  });
}

function updatePriceSummary() {
  const tourId    = document.getElementById('tourSelect').value;
  const groupSize = parseInt(document.getElementById('groupSize').value, 10);
  const summary   = document.getElementById('priceSummary');
  const submitBtn = document.getElementById('submitBtn');
  if (!tourId || !groupSize) { summary.style.display = 'none'; submitBtn.disabled = true; return; }
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
  submitBtn.disabled = false;
}

const MAX_GROUP = 10;
let groupCount = 1;

function setGroupCount(n) {
  groupCount = Math.max(1, Math.min(MAX_GROUP, n));
  document.getElementById('groupDisplay').textContent = groupCount;
  document.getElementById('groupSize').value = groupCount;
  document.getElementById('decreaseGroup').style.opacity = groupCount === 1 ? '0.35' : '1';
  document.getElementById('increaseGroup').style.opacity = groupCount === MAX_GROUP ? '0.35' : '1';
  updatePriceSummary();
}

function prefillTour(tourId) {
  const sel = document.getElementById('tourSelect');
  if (sel) { sel.value = tourId; updatePriceSummary(); }
}

function setMinDate() {
  const d = document.getElementById('startDate');
  if (!d) return;
  const today = new Date();
  d.min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
}

function clearErrors() {
  ['nameError','tourError','dateError','groupError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

function validateForm() {
  clearErrors();
  let valid = true;
  if (!document.getElementById('name').value.trim()) { document.getElementById('nameError').textContent = 'Please enter your name.'; valid = false; }
  if (!document.getElementById('tourSelect').value) { document.getElementById('tourError').textContent = 'Please select a tour.'; valid = false; }
  if (!document.getElementById('startDate').value) { document.getElementById('dateError').textContent = 'Please choose a start date.'; valid = false; }
  const g = parseInt(document.getElementById('groupSize').value, 10);
  if (!g || g < 1 || g > MAX_GROUP) { document.getElementById('groupError').textContent = `Group size must be between 1 and ${MAX_GROUP}.`; valid = false; }
  return valid;
}

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
  const phoneNumber = '84000000000';
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
}

function handleFormSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;
  const url = buildWhatsAppMessage();
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
}

function closeMenu() {
  document.getElementById('navLinks')?.classList.remove('open');
  document.getElementById('hamburger')?.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  renderTours();
  populateTourSelect();
  setMinDate();
  setGroupCount(1);

  document.getElementById('tourSelect')?.addEventListener('change', updatePriceSummary);
  document.getElementById('decreaseGroup')?.addEventListener('click', () => setGroupCount(groupCount - 1));
  document.getElementById('increaseGroup')?.addEventListener('click', () => setGroupCount(groupCount + 1));
  document.querySelectorAll('input[name="rideStyle"]').forEach(r => r.addEventListener('change', updatePriceSummary));
  document.getElementById('bookingForm')?.addEventListener('submit', handleFormSubmit);

  document.getElementById('hamburger')?.addEventListener('click', function () {
    this.classList.toggle('open');
    document.getElementById('navLinks')?.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    const h = document.getElementById('hamburger');
    const n = document.getElementById('navLinks');
    if (h && n && !h.contains(e.target) && !n.contains(e.target)) closeMenu();
  });

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
