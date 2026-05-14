export type CreditTier = {
  id: string;
  name: string;
  credits: number;
  priceAmount: number; // in cents
};

export const CREDIT_TIERS: Record<string, CreditTier> = {
  "tier-1": {
    id: "tier-1",
    name: "50 Credits",
    credits: 50,
    priceAmount: 499,
  },
  "tier-2": {
    id: "tier-2",
    name: "150 Credits",
    credits: 150,
    priceAmount: 1299,
  },
  "tier-3": {
    id: "tier-3",
    name: "500 Credits",
    credits: 500,
    priceAmount: 3999,
  },
};

export type CheckoutMetadata = Record<string, unknown>;

export function findTierByAmountCents(amountCents: number): CreditTier | undefined {
  return Object.values(CREDIT_TIERS).find((tier) => tier.priceAmount === amountCents);
}

export function resolveCreditsFromMetadata(metadata: CheckoutMetadata | null | undefined, fallbackAmountCents: number) {
  const safeMetadata = metadata && typeof metadata === "object" ? metadata : {};
  const tierId = typeof safeMetadata.tierId === "string" ? safeMetadata.tierId : undefined;
  const tierFromMetadata = tierId ? CREDIT_TIERS[tierId] : undefined;

  if (tierFromMetadata) {
    return { credits: tierFromMetadata.credits, tierId: tierFromMetadata.id };
  }

  const rawCredits = safeMetadata.credits;
  const creditsValue = typeof rawCredits === "number"
    ? rawCredits
    : typeof rawCredits === "string"
      ? parseInt(rawCredits, 10)
      : 0;

  if (Number.isFinite(creditsValue) && creditsValue > 0) {
    return { credits: creditsValue, tierId: "custom" };
  }

  const tier = findTierByAmountCents(fallbackAmountCents);
  if (tier) {
    return { credits: tier.credits, tierId: tier.id };
  }

  return { credits: 0, tierId: "unknown" };
}
