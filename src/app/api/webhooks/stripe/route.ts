import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { setPremiumByStripeSubscriptionId, setPremiumByUserId } from "@/lib/actions/subscription";

export async function POST(req: Request): Promise<Response> {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("[stripe-webhook]", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription" || !session.subscription) break;

      const sub = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const userId = session.client_reference_id ?? sub.metadata?.userId;
      if (!userId) {
        console.error("[stripe-webhook] No userId in checkout.session.completed");
        break;
      }

      const periodEnd = (sub as { current_period_end?: number }).current_period_end;
      const endsAt = periodEnd ? new Date(periodEnd * 1000) : null;
      await setPremiumByUserId(
        userId,
        sub.id,
        sub.status,
        endsAt
      );
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription & { current_period_end?: number };
      const periodEnd = sub.current_period_end;
      const endsAt = periodEnd ? new Date(periodEnd * 1000) : null;
      await setPremiumByStripeSubscriptionId(sub.id, sub.status, endsAt);
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
