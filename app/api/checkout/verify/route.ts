import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { resolveCreditsFromMetadata } from "@/lib/credits";
import { getPolarCheckoutSession } from "@/lib/polar";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const checkoutId = searchParams.get("checkout_id") || searchParams.get("session_id");

    if (!checkoutId) {
      return NextResponse.json({ error: "Missing checkout_id" }, { status: 400 });
    }

    // 1. Retrieve checkout from Polar
    const checkout = await getPolarCheckoutSession(checkoutId);

    // 2. Validate checkout belongs to the user and is paid
    if (checkout.status !== "succeeded") {
      return NextResponse.json({ status: "unpaid" });
    }

    const checkoutClerkId = checkout.external_customer_id || checkout.metadata?.clerkId;
    if (checkoutClerkId !== clerkId) {
      console.error("Mismatch in clerkId between checkout and auth", { checkoutClerkId, clerkId });
      return NextResponse.json({ error: "Unauthorized session" }, { status: 403 });
    }

    // 3. Check if already fulfilled (idempotency guard)
    const existing = await prisma.creditTransaction.findFirst({
      where: { polarCheckoutId: checkout.id }
    });

    if (existing) {
      // Already fulfilled by webhook or previous verify call
      return NextResponse.json({ status: "already_fulfilled" });
    }

    // 4. Resolve tier and credits
    const totalAmount = checkout.total_amount ?? checkout.amount ?? 0;
    const { credits: creditsToAdd, tierId } = resolveCreditsFromMetadata(checkout.metadata, totalAmount);

    if (creditsToAdd <= 0) {
      return NextResponse.json({ error: "Could not resolve credits" }, { status: 400 });
    }

    // 5. Idempotent fulfillment in transaction
    await prisma.$transaction(async (tx) => {
      // Re-check inside transaction for safety
      const txExisting = await tx.creditTransaction.findFirst({
        where: { polarCheckoutId: checkout.id }
      });
      
      if (txExisting) return;
      
      const user = await tx.user.findUnique({
        where: { clerkId }
      });

      if (!user) throw new Error("User not found");

      await tx.creditTransaction.create({
        data: {
          userId: user.id,
          polarCheckoutId: checkout.id,
          amount: creditsToAdd,
          pricePaidCents: totalAmount,
          tier: tierId,
          status: "completed"
        }
      });

      await tx.user.update({
        where: { id: user.id },
        data: { credits: { increment: creditsToAdd } },
      });
    });

    return NextResponse.json({ status: "fulfilled", creditsAdded: creditsToAdd });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
