'use strict';

/* ════════════════════════════════════════════════════════════════
   Easy Rider Vietnam — Stripe deposit payments (Cloud Functions v2)

   Two functions:
     • createCheckoutSession  — callable from the booking page. Looks up
       the booking, RE-COMPUTES the deposit server-side (never trusts the
       client), creates a Stripe Checkout Session in EUR, returns its URL.
     • stripeWebhook          — Stripe calls this after payment. Verifies
       the signature and marks the booking as deposit-paid in Firestore.

   Secrets (set once, see SETUP-PAYMENTS.md):
     firebase functions:secrets:set STRIPE_SECRET_KEY
     firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
   ════════════════════════════════════════════════════════════════ */

const { onCall, onRequest, HttpsError } = require('firebase-functions/v2/https');
const { setGlobalOptions } = require('firebase-functions/v2');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const Stripe = require('stripe');

admin.initializeApp();
const db = admin.firestore();

// Run in the EU (closer to the Dutch entity + EU customers).
setGlobalOptions({ region: 'europe-west1', maxInstances: 10 });

const STRIPE_SECRET_KEY = defineSecret('STRIPE_SECRET_KEY');
const STRIPE_WEBHOOK_SECRET = defineSecret('STRIPE_WEBHOOK_SECRET');

/* ── Pricing (authoritative copy — keep in sync with app.js) ──────── */
const RATE_MULTIDAY = 70;   // EUR / person / day
const RATE_ONEDAY   = 40;   // EUR flat (1-day tour)
const DEPOSIT_PCT   = 0.20;

const TOUR_DAYS = {
  dalatloop3day: 3, dalathoian5day: 5, hoiandalat5day: 5,
  dalatsaigon4day: 4, saigondalat4day: 4, dalatmuine2day: 2,
  alternative3day: 3, dalattour1day: 1,
};
const FLAT_TOURS = new Set(['dalattour1day']);

function computeDepositEUR(tourId, groupSize) {
  const days = TOUR_DAYS[tourId];
  if (!days) return null;
  if (!Number.isInteger(groupSize) || groupSize < 1 || groupSize > 10) return null;
  const perPerson = FLAT_TOURS.has(tourId) ? RATE_ONEDAY : RATE_MULTIDAY * days;
  const total = perPerson * groupSize;
  return Math.ceil(total * DEPOSIT_PCT); // whole EUR
}

/* ── Only redirect back to origins we control ────────────────────── */
const ALLOWED_ORIGINS = [
  'https://lexander01.github.io',
  'http://localhost:8000',
  'http://localhost:3000',
  // 'https://your-custom-domain.com',  // ← add your live domain here
];
const FALLBACK_RETURN = 'https://lexander01.github.io/easyridersvietnam/bookings.html';

function safeReturnBase(returnUrl) {
  try {
    const u = new URL(returnUrl);
    if (ALLOWED_ORIGINS.includes(u.origin)) return u.origin + u.pathname;
  } catch (_) { /* ignore */ }
  return FALLBACK_RETURN;
}

/* ════════════════════════════════════════════════════════════════
   createCheckoutSession
   ════════════════════════════════════════════════════════════════ */
exports.createCheckoutSession = onCall(
  { secrets: [STRIPE_SECRET_KEY] },
  async (request) => {
    const bookingId = request.data && request.data.bookingId;
    const returnUrl = request.data && request.data.returnUrl;
    if (!bookingId || typeof bookingId !== 'string') {
      throw new HttpsError('invalid-argument', 'Missing bookingId.');
    }

    const snap = await db.collection('bookings').doc(bookingId).get();
    if (!snap.exists) throw new HttpsError('not-found', 'Booking not found.');
    const booking = snap.data();

    if (booking.depositPaid === true) {
      throw new HttpsError('failed-precondition', 'Deposit already paid.');
    }

    // Re-derive the amount from the booking's tour + group size.
    const depositEUR = computeDepositEUR(booking.tourId, booking.groupSize);
    if (depositEUR == null) {
      throw new HttpsError('failed-precondition', 'Cannot price this booking.');
    }

    const base = safeReturnBase(returnUrl);
    const stripe = new Stripe(STRIPE_SECRET_KEY.value());

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: depositEUR * 100, // cents
          product_data: {
            name: `Tour deposit — ${booking.tourName || booking.tourId}`,
            description: `${booking.groupSize} rider(s) · start ${booking.date}`,
          },
        },
      }],
      metadata: { bookingId },
      // Reflect the deposit on the customer's card statement.
      payment_intent_data: { description: `Easy Rider deposit · ${bookingId}` },
      success_url: `${base}?payment=success`,
      cancel_url: `${base}?payment=cancelled`,
    });

    await snap.ref.update({
      stripeSessionId: session.id,
      depositAmountEUR: depositEUR,
    });

    return { url: session.url };
  }
);

/* ════════════════════════════════════════════════════════════════
   stripeWebhook  — Stripe → us, after payment. Source of truth.
   ════════════════════════════════════════════════════════════════ */
exports.stripeWebhook = onRequest(
  { secrets: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET] },
  async (req, res) => {
    const stripe = new Stripe(STRIPE_SECRET_KEY.value());
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        req.headers['stripe-signature'],
        STRIPE_WEBHOOK_SECRET.value()
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const bookingId = session.metadata && session.metadata.bookingId;
      if (bookingId) {
        try {
          await db.collection('bookings').doc(bookingId).update({
            depositPaid: true,
            depositPaidAt: admin.firestore.FieldValue.serverTimestamp(),
            stripePaymentIntent: session.payment_intent || null,
            amountPaidEUR: (session.amount_total || 0) / 100,
          });
        } catch (e) {
          console.error('Failed to mark booking paid:', bookingId, e);
        }
      }
    }

    res.json({ received: true });
  }
);
