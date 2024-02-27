"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import { absoluteUrl } from "@/lib/utils";
import { stripe } from "@/lib/stripe";

export const redirectStripe = async (): Promise<string> => {
  const { userId, orgId } = auth();
  const user = await currentUser();

  if (!userId || !orgId || !user) {
    throw new Error("Unauthorized");
  }

  const redirectUrl = absoluteUrl(`/organizations/${orgId}`);

  let url: string = "";

  try {
    const subscription = await fetchQuery(api.subscriptions.get, { orgId });

    if (subscription && subscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: redirectUrl,
      });

      url = stripeSession.url;
    } else {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: redirectUrl,
        cancel_url: redirectUrl,
        payment_method_types: ["card", "paypal"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user?.emailAddresses[0].emailAddress,
        line_items: [
          {
            price_data: {
              currency: "USD",
              product_data: {
                name: "Marksman Pro",
                description:
                  "Unlimited boards for your organization & Voice calls!",
              },
              unit_amount: 500,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          orgId,
        },
      });

      url = stripeSession.url || "";
    }
  } catch (error) {
    console.log("[STRIPE_ERROR]", error);
    throw new Error("Something went wrong");
  }

  return url;
};
