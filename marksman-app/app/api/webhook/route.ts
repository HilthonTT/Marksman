import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { fetchMutation } from "convex/nextjs";

import { stripe } from "@/lib/stripe";
import { api } from "@/convex/_generated/api";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.log("[WEBHOOK_ERROR]", error);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.orgId) {
      return new NextResponse("Org Id is required", { status: 400 });
    }

    await fetchMutation(api.subscriptions.create, {
      orgId: session?.metadata?.orgId,
      stripeSubscriptionId: subscription?.id,
      stripeCustomerId: subscription?.customer as string,
      stripePriceId: subscription?.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(
        subscription.current_period_end * 1000
      ).getTime(),
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await fetchMutation(api.subscriptions.update, {
      stripeSubscriptionId: subscription?.id,
      stripePriceId: subscription?.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(
        subscription.current_period_end * 1000
      ).getTime(),
    });
  }

  return new NextResponse(null, { status: 200 });
}
