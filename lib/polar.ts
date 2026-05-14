import "server-only";

import type { CreditTier } from "@/lib/credits";

const POLAR_SANDBOX_BASE_URL = "https://sandbox-api.polar.sh/v1";
const POLAR_PRODUCTION_BASE_URL = "https://api.polar.sh/v1";

type PolarListResponse<TItem> = {
  items: TItem[];
  pagination?: {
    total_count: number;
    max_page: number;
  };
};

type PolarProduct = {
  id: string;
  name: string;
  metadata?: Record<string, unknown>;
};

type PolarCheckout = {
  id: string;
  url: string;
  status: string;
  amount: number;
  total_amount: number;
  metadata?: Record<string, unknown>;
  external_customer_id?: string | null;
};

type PolarCheckoutCreate = {
  products: string[];
  success_url?: string;
  return_url?: string;
  locale?: string;
  external_customer_id?: string;
  metadata?: Record<string, string | number | boolean>;
};

function getPolarBaseUrl() {
  const server = (process.env.POLAR_SERVER || "sandbox").toLowerCase();
  return server === "production" ? POLAR_PRODUCTION_BASE_URL : POLAR_SANDBOX_BASE_URL;
}

function getPolarAccessToken() {
  const token = process.env.POLAR_ACCESS_TOKEN;
  if (!token) {
    throw new Error("POLAR_ACCESS_TOKEN is not set");
  }
  return token;
}

async function polarRequest<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  const url = `${getPolarBaseUrl()}/${path.replace(/^\/+/, "")}`;
  const headers = new Headers(init?.headers);

  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${getPolarAccessToken()}`);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.detail?.[0]?.msg || data?.error || response.statusText;
    throw new Error(`Polar API error: ${message}`);
  }

  return data as TResponse;
}

async function findPolarProductByTierId(tierId: string): Promise<PolarProduct | null> {
  const params = new URLSearchParams({
    "metadata[tierId]": tierId,
    is_recurring: "false",
    limit: "1",
  });

  const response = await polarRequest<PolarListResponse<PolarProduct>>(
    `products?${params.toString()}`,
    { method: "GET" }
  );

  return response.items?.[0] ?? null;
}

export async function ensurePolarProductForTier(tier: CreditTier): Promise<PolarProduct> {
  const existing = await findPolarProductByTierId(tier.id);
  if (existing) return existing;

  const payload = {
    name: tier.name,
    description: `One-time purchase of ${tier.credits} AI credits for ProposliGo`,
    prices: [
      {
        amount_type: "fixed",
        price_amount: tier.priceAmount,
        price_currency: "usd",
      },
    ],
    metadata: {
      tierId: tier.id,
      credits: tier.credits,
      app: "ProposliGo",
    },
  };

  try {
    return await polarRequest<PolarProduct>("products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    const retry = await findPolarProductByTierId(tier.id);
    if (retry) return retry;
    throw error;
  }
}

export async function createPolarCheckoutSession(payload: PolarCheckoutCreate): Promise<PolarCheckout> {
  return await polarRequest<PolarCheckout>("checkouts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getPolarCheckoutSession(checkoutId: string): Promise<PolarCheckout> {
  return await polarRequest<PolarCheckout>(`checkouts/${checkoutId}`, { method: "GET" });
}
