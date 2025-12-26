# Stripe Integration Setup Guide

This guide will help you set up Stripe payments for the NCA LMS application.

## Prerequisites

- A Stripe account (create one at [stripe.com](https://stripe.com))
- Stripe CLI installed (for local webhook testing)

## Step 1: Get Your Stripe API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy your **Publishable key** and **Secret key**
   - Use **Test mode** keys for development
   - Use **Live mode** keys for production

## Step 2: Configure Environment Variables

Update your `.env.local` file with the following Stripe environment variables:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# App URLs (required for Stripe redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 3: Set Up Webhooks

Webhooks are essential for Stripe integration as they notify your application about payment events.

### For Local Development

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)

2. Login to Stripe CLI:
   ```bash
   stripe login
   ```

3. Forward webhook events to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret from the output (starts with `whsec_`)

5. Add it to your `.env.local` file:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
   ```

### For Production

1. Go to **Developers** → **Webhooks** in your Stripe Dashboard
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** and add it to your production environment variables

## Step 4: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. In a separate terminal, start the Stripe webhook listener:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. Navigate to the cart page in your application
4. Add items to cart and proceed to checkout
5. Use Stripe's test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - Use any future expiry date and any CVC

6. Complete the checkout and verify:
   - Payment is successful
   - User is redirected to success page
   - Purchase is recorded in database
   - User access is granted
   - Cart is cleared

## Webhook Events Handled

The application handles the following Stripe webhook events:

- **checkout.session.completed**: Fired when a checkout session is successfully completed
  - Creates purchase records
  - Grants user access to purchased content
  - Clears the user's cart

- **payment_intent.succeeded**: Fired when a payment is successful
  - Logged for tracking purposes

- **payment_intent.payment_failed**: Fired when a payment fails
  - Updates purchase status to "failed"

## Security Best Practices

1. **Never commit** your Stripe secret keys to version control
2. Always **verify webhook signatures** (already implemented)
3. Use **test mode** keys during development
4. Keep your webhook signing secret secure
5. Use **HTTPS** in production (required by Stripe)

## Troubleshooting

### Webhook signature verification failed

- Ensure `STRIPE_WEBHOOK_SECRET` is correctly set in your environment variables
- Check that you're using the correct webhook secret for your environment (test vs. live)
- Verify that the Stripe CLI is forwarding to the correct URL

### Checkout session not creating

- Check that `NEXT_PUBLIC_APP_URL` is correctly set
- Verify Stripe API keys are valid
- Check browser console and server logs for errors

### Payment successful but access not granted

- Check webhook logs in Stripe Dashboard
- Verify webhook endpoint is receiving events
- Check application logs for webhook processing errors

## Testing Checklist

- [ ] Checkout session creates successfully
- [ ] Stripe Checkout page loads correctly
- [ ] Payment with test card succeeds
- [ ] Webhook receives `checkout.session.completed` event
- [ ] Purchase record is created in database
- [ ] User access is granted
- [ ] Cart is cleared after successful payment
- [ ] User is redirected to success page
- [ ] Payment failure is handled correctly

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Cards](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
