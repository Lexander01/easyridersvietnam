'use strict';

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════ */
const RATE_MULTIDAY   = 70;
const RATE_ONEDAY     = 40;
const DEPOSIT_PCT     = 0.20;
const TOTAL_SCOOTERS  = 10;
const GUIDE_WHATSAPP  = '84000000000'; // ← replace with real guide WhatsApp number

/* ═══════════════════════════════════════════════════════════
   TOUR DATA
═══════════════════════════════════════════════════════════ */
const tours = [
  { id: 'highlight-1',       name: 'Dalat to Hoi An',                   days: 5, nights: 4, rateType: 'daily', startsOutsideDalat: false },
  { id: 'highlight-3',       name: 'Dalat Loop',                         days: 3, nights: 2, rateType: 'daily', startsOutsideDalat: false },
  { id: 'alt-3day',          name: 'Alternative 3-Day Trip',             days: 3, nights: 2, rateType: 'daily', startsOutsideDalat: false },
  { id: 'highlight-4',       name: 'Hoi An to Dalat',                    days: 5, nights: 4, rateType: 'daily', startsOutsideDalat: true  },
  { id: 'highlight-5',       name: 'Dalat to Mui Ne Beach',              days: 2, nights: 1, rateType: 'daily', startsOutsideDalat: false },
  { id: 'saigon-from-dalat', name: 'Dalat to Ho Chi Minh City',          days: 4, nights: 3, rateType: 'daily', startsOutsideDalat: false },
  { id: 'saigon-from-hcmc',  name: 'Ho Chi Minh City to Dalat',          days: 4, nights: 3, rateType: 'daily', startsOutsideDalat: true  },
  { id: 'local',             name: 'One-Day Local Dalat Tour',           days: 1, nights: 0, rateType: 'flat',  startsOutsideDalat: false },
  // legacy ID kept for backward-compatible Firestore lookups
  { id: 'saigon',            name: 'Dalat to Ho Chi Minh City (Saigon)', days: 4, nights: 3, rateType: 'daily', startsOutsideDalat: false },
];

/* ═══════════════════════════════════════════════════════════
   AVAILABILITY DATA  (populated by Firebase listeners)
═══════════════════════════════════════════════════════════ */
let _allBookings      = [];
let _blockedDates     = [];
let _availabilityLoaded = false;

function loadAvailabilityData() {
  if (!window.db) return;

  window.db.collection('bookings')
    .where('status', 'in', ['pending', 'approved'])
    .onSnapshot(snap => {
      _allBookings = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      _availabilityLoaded = true;
      revalidateDateIfSelected();
    }, err => console.warn('Bookings listener error:', err));

  window.db.collection('blockedDates').onSnapshot(snap => {
    _blockedDates = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    revalidateDateIfSelected();
  }, err => console.warn('BlockedDates listener error:', err));
}

function isDayInRange(dayStr, startStr, duration) {
  const day   = new Date(dayStr   + 'T00:00:00');
  const start = new Date(startStr + 'T00:00:00');
  const end   = new Date(startStr + 'T00:00:00');
  end.setDate(end.getDate() + duration - 1);
  return day >= start && day <= end;
}

function getOccupiedCountForDay(dateStr) {
  if (_blockedDates.some(b => b.date === dateStr && b.scooterId === 'all')) return TOTAL_SCOOTERS;
  const individualBlocks = _blockedDates.filter(b => b.date === dateStr && b.scooterId !== 'all').length;
  const bookingsOnDay    = _allBookings.filter(b => isDayInRange(dateStr, b.date, b.duration)).length;
  return Math.min(TOTAL_SCOOTERS, individualBlocks + bookingsOnDay);
}

function isDateRangeAvailable(startStr, duration) {
  for (let i = 0; i < duration; i++) {
    const d = new Date(startStr + 'T00:00:00');
    d.setDate(d.getDate() + i);
    if (getOccupiedCountForDay(fmtYMD(d)) >= TOTAL_SCOOTERS) return false;
  }
  return true;
}

function fmtYMD(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

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
  const perPerson = getTourPricePerPerson(tour);
  const total     = perPerson * groupSize;
  const deposit   = Math.ceil(total * DEPOSIT_PCT);
  const remainder = total - deposit;
  const rateLabel = tour.rateType === 'flat'
    ? `${formatEUR(RATE_ONEDAY)} flat / person`
    : `${formatEUR(RATE_MULTIDAY)}/person/day × ${tour.days} days`;
  return { perPerson, total, deposit, remainder, rateLabel };
}

/* ═══════════════════════════════════════════════════════════
   BOOKING — SAVE TO FIRESTORE + localStorage backup
═══════════════════════════════════════════════════════════ */
async function saveBooking({ name, phone, tourId, date, groupSize, rideStyle, total, deposit, remainder }) {
  const tour = tours.find(t => t.id === tourId);
  const booking = {
    name,
    phone: phone || '',
    tourId,
    tourName: tour ? tour.name : tourId,
    date,
    duration: tour ? tour.days : 1,
    groupSize,
    rideStyle,
    total,
    deposit,
    remainder,
    status: 'pending',
    scooterId: null,
    createdAt: new Date().toISOString(),
  };

  let firestoreId = null;
  if (window.db) {
    try {
      const firestorePromise = window.db.collection('bookings').add(booking);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firestore timeout')), 5000)
      );
      
      // Forces the request to fail if it takes longer than 5 seconds
      const ref = await Promise.race([firestorePromise, timeoutPromise]);
      firestoreId = ref.id;
    } catch (e) {
      console.error('Firestore save failed or timed out:', e);
    }
  }

  try {
    const existing = JSON.parse(localStorage.getItem('erv_bookings') || '[]');
    existing.unshift({ ...booking, id: firestoreId || ('BK' + Date.now()) });
    localStorage.setItem('erv_bookings', JSON.stringify(existing));
  } catch (e) { /* localStorage unavailable */ }
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
    return;
  }

  const tour = tours.find(t => t.id === tourId);
  if (!tour) return;

  const { total, deposit, remainder, rateLabel } = calcPricing(tour, groupSize);

  document.getElementById('priceLabel').textContent     = rateLabel;
  document.getElementById('priceBase').textContent      = formatEUR(getTourPricePerPerson(tour));
  document.getElementById('priceGroup').textContent     = `× ${groupSize} ${groupSize === 1 ? 'person' : 'people'}`;
  document.getElementById('priceTotal').textContent     = formatEUR(total);
  document.getElementById('priceDeposit').textContent   = formatEUR(deposit);
  document.getElementById('priceRemainder').textContent = formatEUR(remainder);

  summary.style.display = 'flex';
  if (submitBtn) submitBtn.disabled = false;
  checkDateAvailability();
}

/* ═══════════════════════════════════════════════════════════
   DATE AVAILABILITY CHECK
═══════════════════════════════════════════════════════════ */
function checkDateAvailability() {
  const dateVal   = document.getElementById('startDate')?.value;
  const tourId    = document.getElementById('tourSelect')?.value;
  const dateErr   = document.getElementById('dateError');
  const submitBtn = document.getElementById('submitBtn');

  if (!dateVal || !tourId) return;

  const tour = tours.find(t => t.id === tourId);
  if (!tour) return;

  // 2-day advance rule for tours starting outside Dalat
  if (tour.startsOutsideDalat) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 2);
    const selected = new Date(dateVal + 'T00:00:00');
    if (selected < minDate) {
      if (dateErr)   dateErr.textContent = 'This tour starts outside Dalat. Please book at least 2 days in advance so your guide has time to travel there.';
      if (submitBtn) submitBtn.disabled  = true;
      return;
    }
    // Date is valid for 2-day rule — clear any previous error and re-enable
    if (dateErr) dateErr.textContent = '';
    if (submitBtn) submitBtn.disabled = false;
  }

  if (!_availabilityLoaded) return;

  if (!isDateRangeAvailable(dateVal, tour.days)) {
    if (dateErr)   dateErr.textContent   = 'Sorry, one or more days in this range are fully booked. Please choose a different start date.';
    if (submitBtn) submitBtn.disabled    = true;
  } else {
    if (dateErr)   dateErr.textContent   = '';
    if (submitBtn) submitBtn.disabled    = false;
  }
}

function revalidateDateIfSelected() {
  if (document.getElementById('startDate')?.value) checkDateAvailability();
}

/* ═══════════════════════════════════════════════════════════
   GROUP STEPPER
═══════════════════════════════════════════════════════════ */
const MAX_GROUP = 10;
let groupCount  = 1;

function setGroupCount(n) {
  groupCount = Math.max(1, Math.min(MAX_GROUP, n));
  const disp = document.getElementById('groupDisplay');
  const inp  = document.getElementById('groupSize');
  const dec  = document.getElementById('decreaseGroup');
  const inc  = document.getElementById('increaseGroup');
  if (disp) disp.textContent  = groupCount;
  if (inp)  inp.value         = groupCount;
  if (dec)  dec.style.opacity = groupCount === 1        ? '0.35' : '1';
  if (inc)  inc.style.opacity = groupCount === MAX_GROUP ? '0.35' : '1';
  updatePriceSummary();
}

/* ═══════════════════════════════════════════════════════════
   PREFILL TOUR FROM URL PARAMETER
═══════════════════════════════════════════════════════════ */
function prefillTour(tourId) {
  const sel = document.getElementById('tourSelect');
  if (sel) { sel.value = tourId; updatePriceSummary(); }
}

/* ═══════════════════════════════════════════════════════════
   SET MIN DATE (tour-aware: +2 days for tours starting outside Dalat)
═══════════════════════════════════════════════════════════ */
function updateMinDate() {
  const d = document.getElementById('startDate');
  if (!d) return;
  const tourId = document.getElementById('tourSelect')?.value;
  const tour   = tours.find(t => t.id === tourId);
  const today  = new Date();
  today.setHours(0, 0, 0, 0);
  if (tour && tour.startsOutsideDalat) {
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 2);
    d.min = fmtYMD(minDate);
    // Clear the current value if it's now too early
    if (d.value && d.value < d.min) d.value = '';
  } else {
    d.min = fmtYMD(today);
  }
}

/* ═══════════════════════════════════════════════════════════
   FORM VALIDATION
═══════════════════════════════════════════════════════════ */
function clearErrors() {
  ['nameError','phoneError','tourError','dateError','groupError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

function validateForm() {
  clearErrors();
  let valid = true;

  const nameEl = document.getElementById('name');
  if (!nameEl?.value.trim()) {
    document.getElementById('nameError').textContent = 'Please enter your name.';
    nameEl?.classList.add('input-error');
    valid = false;
  }

  const phoneEl = document.getElementById('phone');
  if (phoneEl && !phoneEl.value.trim()) {
    document.getElementById('phoneError').textContent = 'Please enter your WhatsApp number.';
    phoneEl.classList.add('input-error');
    valid = false;
  }

  const tourEl = document.getElementById('tourSelect');
  if (!tourEl?.value) {
    document.getElementById('tourError').textContent = 'Please select a tour.';
    tourEl?.classList.add('input-error');
    valid = false;
  }

  const dateEl = document.getElementById('startDate');
  if (!dateEl?.value) {
    document.getElementById('dateError').textContent = 'Please choose a start date.';
    dateEl?.classList.add('input-error');
    valid = false;
  }

  const g = parseInt(document.getElementById('groupSize')?.value, 10);
  if (!g || g < 1 || g > MAX_GROUP) {
    document.getElementById('groupError').textContent = `Group size must be 1–${MAX_GROUP}.`;
    valid = false;
  }

  const tourId  = tourEl?.value;
  const dateVal = dateEl?.value;
  if (valid && tourId && dateVal) {
    const tour = tours.find(t => t.id === tourId);
    if (tour && tour.startsOutsideDalat) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const minDate = new Date(today);
      minDate.setDate(minDate.getDate() + 2);
      if (new Date(dateVal + 'T00:00:00') < minDate) {
        document.getElementById('dateError').textContent = 'This tour starts outside Dalat. Please book at least 2 days in advance.';
        dateEl?.classList.add('input-error');
        valid = false;
      }
    }
    if (valid && _availabilityLoaded) {
      const tour2 = tours.find(t => t.id === tourId);
      if (tour2 && !isDateRangeAvailable(dateVal, tour2.days)) {
        document.getElementById('dateError').textContent = 'Sorry, one or more days in this range are fully booked. Please choose a different start date.';
        dateEl?.classList.add('input-error');
        valid = false;
      }
    }
  }
  return valid;
}

/* ═══════════════════════════════════════════════════════════
   BUTTON FILL PROGRESS
═══════════════════════════════════════════════════════════ */
let _progressInterval = null;

function startButtonFill(btn) {
  if (!btn) return;
  let pct = 0;
  btn.style.setProperty('--bp', '0');
  btn.classList.add('btn-fill-progress');
  _progressInterval = setInterval(() => {
    pct += (88 - pct) * 0.07;
    btn.style.setProperty('--bp', (pct / 100).toFixed(3));
  }, 150);
}

function completeButtonFill(btn, origHTML) {
  clearInterval(_progressInterval);
  _progressInterval = null;
  if (!btn) return;
  btn.style.setProperty('--bp', '1');
  setTimeout(() => {
    btn.classList.remove('btn-fill-progress');
    btn.style.removeProperty('--bp');
    btn.disabled = false;
    if (origHTML !== undefined) btn.innerHTML = origHTML;
  }, 250);
}

/* ═══════════════════════════════════════════════════════════
   PAYMENT MODAL
═══════════════════════════════════════════════════════════ */
let _pendingDeposit = 0;

function showPaymentModal(deposit) {
  _pendingDeposit = deposit;
  const modal    = document.getElementById('paymentModal');
  const amountEl = document.getElementById('paymentAmount');
  if (amountEl) amountEl.textContent = formatEUR(deposit);
  if (modal)    modal.classList.add('active');
  document.body.classList.add('no-scroll');
}

function closePaymentModal() {
  document.getElementById('paymentModal')?.classList.remove('active');
  document.body.classList.remove('no-scroll');
}

function handlePaymentSuccess() {
  closePaymentModal();
  const successModal = document.getElementById('successModal');
  if (successModal) {
    const waLink = document.getElementById('guideWaLink');
    const waNum  = document.getElementById('guideWaNumber');
    if (waLink) waLink.href        = `https://wa.me/${GUIDE_WHATSAPP}`;
    if (waNum)  waNum.textContent  = `+${GUIDE_WHATSAPP}`;
    successModal.classList.add('active');
    document.body.classList.add('no-scroll');
  }
}

function closeSuccessModal() {
  document.getElementById('successModal')?.classList.remove('active');
  document.body.classList.remove('no-scroll');
}

/* ═══════════════════════════════════════════════════════════
   FORM SUBMIT
═══════════════════════════════════════════════════════════ */
async function handleFormSubmit(e) {
  e.preventDefault();
  if (!validateForm()) {
    // Scroll to the section heading so the user can see all error messages
    const scrollTarget = document.getElementById('book')
      || document.querySelector('.bookings-hero')
      || document.getElementById('bookingForm');
    scrollTarget?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const submitBtn = document.getElementById('submitBtn');
  const origHTML = submitBtn?.innerHTML || '';
  
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving…';
  }
  startButtonFill(submitBtn);

  try {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone')?.value.trim() || '';
    const tourId = document.getElementById('tourSelect').value;
    const dateVal = document.getElementById('startDate').value;
    const groupSize = parseInt(document.getElementById('groupSize').value, 10);
    const rideStyle = document.querySelector('input[name="rideStyle"]:checked').value;
    const tour = tours.find(t => t.id === tourId);
    const { total, deposit, remainder } = calcPricing(tour, groupSize);

    // Re-check right before saving (race condition guard)
    if (_availabilityLoaded && !isDateRangeAvailable(dateVal, tour.days)) {
      document.getElementById('dateError').textContent = 'These dates just became unavailable. Please choose different dates.';
      return; // The finally block will handle resetting the button
    }

    await saveBooking({ name, phone, tourId, date: dateVal, groupSize, rideStyle, total, deposit, remainder });

    document.getElementById('bookingForm')?.reset();
    setGroupCount(1);
    const ps = document.getElementById('priceSummary');
    if (ps) ps.style.display = 'none';

    showPaymentModal(deposit);
  } catch (error) {
    console.error("Booking submission error:", error);
    alert("An unexpected error occurred. Please try again.");
  } finally {
    completeButtonFill(submitBtn, origHTML);
  }
}

/* ═══════════════════════════════════════════════════════════
   NAV HAMBURGER
═══════════════════════════════════════════════════════════ */
function closeMenu() {
  document.getElementById('navLinks')?.classList.remove('open');
  document.getElementById('hamburger')?.classList.remove('open');
  document.body.classList.remove('no-scroll');
}

/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  updateMinDate();
  setGroupCount(1);
  loadAvailabilityData();

  const preselect = new URLSearchParams(window.location.search).get('tour');
  if (preselect) {
    const sel = document.getElementById('tourSelect');
    if (sel) { sel.value = preselect; updateMinDate(); updatePriceSummary(); }
  }

  document.getElementById('tourSelect')?.addEventListener('change', () => { updateMinDate(); updatePriceSummary(); document.getElementById('tourSelect')?.classList.remove('input-error'); });
  document.getElementById('startDate')?.addEventListener('change', () => { checkDateAvailability(); document.getElementById('startDate')?.classList.remove('input-error'); });
  document.getElementById('decreaseGroup')?.addEventListener('click', () => setGroupCount(groupCount - 1));
  document.getElementById('increaseGroup')?.addEventListener('click', () => setGroupCount(groupCount + 1));
  document.querySelectorAll('input[name="rideStyle"]').forEach(r => r.addEventListener('change', updatePriceSummary));
  document.getElementById('bookingForm')?.addEventListener('submit', handleFormSubmit);

  // Clear red border as soon as the user starts correcting a field
  document.getElementById('name')?.addEventListener('input', () => document.getElementById('name')?.classList.remove('input-error'));
  document.getElementById('phone')?.addEventListener('input', () => document.getElementById('phone')?.classList.remove('input-error'));

  document.getElementById('hamburger')?.addEventListener('click', function () {
    this.classList.toggle('open');
    const navLinks = document.getElementById('navLinks');
    navLinks?.classList.toggle('open');
    document.body.classList.toggle('no-scroll', navLinks?.classList.contains('open') ?? false);
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
