import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { CREDIT_TIERS } from "@/lib/credits";
import { createPolarCheckoutSession, ensurePolarProductForTier } from "@/lib/polar";
import { DICTIONARY } from "@/lib/dictionary";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tierId, lang = "en" } = await req.json();

    if (!tierId || !CREDIT_TIERS[tierId]) {
      return NextResponse.json({ error: "Invalid tier selected" }, { status: 400 });
    }

    const tier = CREDIT_TIERS[tierId];
    const language = lang === "ar" ? "ar" : "en";
    const t = (DICTIONARY as any)[language] || DICTIONARY.en;

    const product = await ensurePolarProductForTier(tier);

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}${process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}?purchase=success&checkout_id={CHECKOUT_ID}`;
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}${process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}`;

    const checkout = await createPolarCheckoutSession({
      products: [product.id],
      success_url: successUrl,
      return_url: returnUrl,
      locale: language,
      external_customer_id: clerkId,
      metadata: {
        credits: tier.credits,
        tierId: tier.id,
        clerkId: clerkId,
        tierName: t.credits.tiers[tier.id] || tier.name,
      },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error: any) {
    console.error("Polar Checkout Error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while creating checkout session" },
      { status: 500 }
    );
  }
}
