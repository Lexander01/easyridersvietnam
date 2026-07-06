# Stripe deposit payments — setup

This wires the 20% booking deposit to **Stripe Checkout** (hosted page), billed
through your **Dutch company**, in **EUR**. The secret key lives only in a Cloud
Function — never in the website.

## How it works
1. Customer fills the booking form → booking saved to Firestore (`bookings`).
2. Site calls the `createCheckoutSession` function, which **re-computes the
   deposit server-side** (so the amount can't be tampered with) and returns a
   Stripe Checkout URL.
3. Customer pays on Stripe's hosted page (cards, Apple/Google Pay, iDEAL…).
4. Stripe calls `stripeWebhook`, which marks the booking `depositPaid: true`.
5. Customer is redirected back to `bookings.html?payment=success` → WhatsApp reveal.

---

## One-time setup

### 1. Stripe account
- Create/confirm a Stripe account **registered to the Dutch company** (KvK + IBAN).
- Stay in **Test mode** until you've tested end-to-end.
- Copy your **Secret key** from Developers → API keys (starts `sk_test_…`).

### 2. Firebase: upgrade to Blaze
Cloud Functions need the pay-as-you-go **Blaze** plan (≈€0 at your volume):
https://console.firebase.google.com/project/easyridersvietnam-a559e/usage/details

### 3. Install tools + dependencies
```bash
npm i -g firebase-tools
firebase login
cd "functions" && npm install && cd ..
```

### 4. Store the secrets (not in code)
```bash
firebase functions:secrets:set STRIPE_SECRET_KEY      # paste sk_test_…
# (set the webhook secret in step 6, after the endpoint exists)
```

### 5. Edit two values in the code
- `functions/index.js` → `ALLOWED_ORIGINS` / `FALLBACK_RETURN`: add your live
  site URL (e.g. your GitHub Pages URL or custom domain).
- `app.js` → `GUIDE_WHATSAPP`: set the real guide WhatsApp number (used on the
  success screen). It's currently a placeholder `84000000000`.

### 6. Deploy + register the webhook
```bash
firebase deploy --only functions
```
The deploy prints the **stripeWebhook URL**. In Stripe → Developers → Webhooks →
**Add endpoint**, paste that URL, and select event **`checkout.session.completed`**.
Copy the endpoint's **Signing secret** (`whsec_…`), then:
```bash
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET   # paste whsec_…
firebase deploy --only functions                       # redeploy so it picks up the secret
```

### 7. Test (Test mode)
- Open the live `bookings.html`, make a booking.
- On Stripe Checkout use test card `4242 4242 4242 4242`, any future date, any CVC.
- Confirm: you land back on `?payment=success`, and the booking shows
  `depositPaid: true` in Firestore.

### 8. Go live
- In Stripe, flip to **Live mode**, grab the **live** `sk_live_…` and a **new**
  live webhook signing secret, and re-run the two `secrets:set` commands +
  `firebase deploy --only functions`.

---

## Notes
- **Pricing lives in two places** — `functions/index.js` (authoritative, used to
  charge) and `app.js` (display only). If you change rates, update both.
- The deposit is charged in **EUR**; the site still shows VND ≈ EUR.
- The webhook is the source of truth for "paid" — the success redirect alone is
  never trusted.
