import { stripe } from "./config";
import Stripe from "stripe";

/**
 * Creates a Stripe checkout session for cart items
 */
export async function createCheckoutSession(
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  metadata: {
    userId: string;
    cartItemIds: string[];
    [key: string]: string | string[];
  }
): Promise<Stripe.Checkout.Session> {
  // Build metadata object, converting arrays to JSON strings
  const stripeMetadata: Record<string, string> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (Array.isArray(value)) {
      stripeMetadata[key] = JSON.stringify(value);
    } else {
      stripeMetadata[key] = value;
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/learner/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/learner/cart`,
    metadata: stripeMetadata,
    allow_promotion_codes: true,
    billing_address_collection: "required",
  });

  return session;
}

/**
 * Retrieves a checkout session by ID
 */
export async function getCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "payment_intent"],
  });

  return session;
}

/**
 * Verifies Stripe webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

/**
 * Formats amount to cents for Stripe (Stripe expects amounts in cents)
 */
export function formatAmountForStripe(
  amount: number,
  currency: string
): number {
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });

  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;

  for (const part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
      break;
    }
  }

  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}

/**
 * Formats amount from Stripe cents to decimal
 */
export function formatAmountFromStripe(
  amount: number,
  currency: string
): number {
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });

  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;

  for (const part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
      break;
    }
  }

  return zeroDecimalCurrency ? amount : amount / 100;
}
