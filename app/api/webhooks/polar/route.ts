import { NextResponse } from "next/server";
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";
import { prisma } from "@/lib/prisma";
import { resolveCreditsFromMetadata } from "@/lib/credits";

export const runtime = "nodejs";

type PolarWebhookEvent = {
  type: string;
  data: Record<string, any>;
};

export async function POST(req: Request) {
  const body = await req.text();

  let event: PolarWebhookEvent;
  try {
    event = validateEvent(
      body,
      Object.fromEntries(req.headers),
      process.env.POLAR_WEBHOOK_SECRET ?? ""
    ) as PolarWebhookEvent;
  } catch (error: unknown) {
    if (error instanceof WebhookVerificationError) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 403 });
    }

    console.error("Polar webhook validation failed:", error);
    return NextResponse.json({ error: "Webhook validation failed" }, { status: 400 });
  }

  if (event.type === "order.paid") {
    const order = event.data || {};
    const orderId = order.id;
    const checkoutId = order.checkout_id || order.checkoutId || null;
    const metadata = order.metadata || {};
    const clerkId = metadata.clerkId || order.customer?.external_id || order.customer?.externalId;

    if (!orderId || !clerkId) {
      console.error("Missing order id or clerkId in Polar webhook", {
        orderId,
        clerkId,
      });
      return NextResponse.json({ received: true });
    }

    const totalAmount = order.total_amount ?? order.totalAmount ?? 0;
    const { credits: creditsToAdd, tierId } = resolveCreditsFromMetadata(metadata, totalAmount);

    if (creditsToAdd <= 0) {
      console.error("Could not resolve credits for order", {
        orderId,
        metadata,
        totalAmount,
      });
      return NextResponse.json({ received: true });
    }

    const existing = await prisma.creditTransaction.findFirst({
      where: {
        OR: [
          { polarOrderId: orderId },
          ...(checkoutId ? [{ polarCheckoutId: checkoutId }] : []),
        ],
      },
    });

    if (existing) {
      return NextResponse.json({ received: true });
    }

    await prisma.$transaction(async (tx) => {
      const txExisting = await tx.creditTransaction.findFirst({
        where: {
          OR: [
            { polarOrderId: orderId },
            ...(checkoutId ? [{ polarCheckoutId: checkoutId }] : []),
          ],
        },
      });

      if (txExisting) return;

      const user = await tx.user.findUnique({
        where: { clerkId },
      });

      if (!user) {
        throw new Error(`User not found for clerkId: ${clerkId}`);
      }

      await tx.creditTransaction.create({
        data: {
          userId: user.id,
          polarOrderId: orderId,
          polarCheckoutId: checkoutId,
          amount: creditsToAdd,
          pricePaidCents: totalAmount,
          tier: tierId,
          status: "completed",
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { credits: { increment: creditsToAdd } },
      });
    });
  }

  return NextResponse.json({ received: true });
}
