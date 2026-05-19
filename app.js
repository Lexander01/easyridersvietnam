'use strict';

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════ */
const RATE_MULTIDAY = 70;
const RATE_ONEDAY   = 40;
const DEPOSIT_PCT   = 0.20;

/* ═══════════════════════════════════════════════════════════
   TOUR DATA (Stripped for Pricing & Logic Only)
═══════════════════════════════════════════════════════════ */
const tours = [
  { id: 'highlight-1', name: 'Dalat to Hoi An', days: 5, nights: 4, rateType: 'daily' },
  { id: 'highlight-3', name: 'Dalat Loop', days: 3, nights: 2, rateType: 'daily' },
  { id: 'alt-3day', name: 'Alternative 3-Day Trip', days: 3, nights: 2, rateType: 'daily' },
  { id: 'highlight-4', name: 'Hoi An to Dalat', days: 5, nights: 4, rateType: 'daily' },
  { id: 'highlight-5', name: 'Dalat to Mui Ne Beach', days: 2, nights: 1, rateType: 'daily' },
  { id: 'saigon', name: 'Dalat to Ho Chi Minh City (Saigon)', days: 4, nights: 3, rateType: 'daily' },
  { id: 'local', name: 'One-Day Local Dalat Tour', days: 1, nights: 0, rateType: 'flat' },
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
    `🏍️ *EASY RIDER VIETNAM LOOPS - BOOKING REQUEST*`,
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

  // Booking form init
  setMinDate();
  setGroupCount(1);
  
  // Preselect tour if URL parameter exists
  const preselect = new URLSearchParams(window.location.search).get('tour');
  if (preselect) {
    const sel = document.getElementById('tourSelect');
    if (sel) sel.value = preselect;
    updatePriceSummary();
  }

  // Event Listeners
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
