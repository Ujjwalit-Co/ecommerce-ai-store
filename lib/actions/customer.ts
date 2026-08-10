"use server";

import Stripe from "stripe";
import { client, writeClient } from "@/sanity/lib/client";
import { CUSTOMER_BY_EMAIL_QUERY } from "@/sanity/queries/customers";

function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-02-25.clover",
  });
}

/**
 * Gets or creates a Stripe customer by email
 * Also syncs the customer to Sanity database
 * Gracefully handles a missing STRIPE_SECRET_KEY by only syncing to Sanity
 */
export async function getOrCreateStripeCustomer(
  email: string,
  name: string,
  clerkUserId: string,
): Promise<{ stripeCustomerId: string; sanityCustomerId: string }> {
  const stripe = getStripe();

  // First, check if customer already exists in Sanity
  const existingCustomer = await client.fetch(CUSTOMER_BY_EMAIL_QUERY, {
    email,
  });

  let stripeCustomerId = existingCustomer?.stripeCustomerId ?? "";

  if (stripe && !stripeCustomerId) {
    // Check if customer exists in Stripe by email
    const existingStripeCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingStripeCustomers.data.length > 0) {
      // Customer exists in Stripe
      stripeCustomerId = existingStripeCustomers.data[0].id;
    } else {
      // Create new Stripe customer
      const newStripeCustomer = await stripe.customers.create({
        email,
        name,
        metadata: {
          clerkUserId,
        },
      });
      stripeCustomerId = newStripeCustomer.id;
    }
  }

  // Create or update customer in Sanity
  if (existingCustomer) {
    // Update existing Sanity customer with Stripe ID
    await writeClient
      .patch(existingCustomer._id)
      .set({ stripeCustomerId, clerkUserId, name })
      .commit();
    return {
      stripeCustomerId,
      sanityCustomerId: existingCustomer._id,
    };
  }

  // Create new customer in Sanity
  const newSanityCustomer = await writeClient.create({
    _type: "customer",
    email,
    name,
    clerkUserId,
    stripeCustomerId,
    createdAt: new Date().toISOString(),
  });

  return {
    stripeCustomerId,
    sanityCustomerId: newSanityCustomer._id,
  };
}
