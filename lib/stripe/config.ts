import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover" as any,
  typescript: true,
});

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// Currency configuration
export const CURRENCY = "CAD"; // Canadian Dollar for NCA/Ontario Bar

// Stripe configuration constants
export const STRIPE_CONFIG = {
  mode: "payment" as const,
  currency: CURRENCY,
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/learner/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/learner/cart`,
} as const;
