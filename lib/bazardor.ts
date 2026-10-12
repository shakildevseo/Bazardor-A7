const API_BASE_URL = "https://openapi.programming-hero.com/api/bazardor";

export type BazaarCategory = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

export type BazaarProduct = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets: {
    market: string;
    division: string;
    min: number;
    max: number;
  }[];
};

const numberFormatter = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 1,
});

const percentFormatter = new Intl.NumberFormat("bn-BD", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function requireString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string") {
    throw new Error(`Invalid Bazaar Dor API response: "${key}" must be a string.`);
  }
  return value;
}

function requireNumber(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Invalid Bazaar Dor API response: "${key}" must be a number.`);
  }
  return value;
}

function parseCategory(value: unknown): BazaarCategory {
  if (!isRecord(value)) {
    throw new Error("Invalid Bazaar Dor API response: category must be an object.");
  }

  return {
    id: requireString(value, "id"),
    slug: requireString(value, "slug"),
    nameBn: requireString(value, "nameBn"),
    icon: requireString(value, "icon"),
  };
}

function parseProduct(value: unknown): BazaarProduct {
  if (!isRecord(value) || !isRecord(value.change)) {
    throw new Error("Invalid Bazaar Dor API response: product data is malformed.");
  }
  if (!Array.isArray(value.markets)) {
    throw new Error("Invalid Bazaar Dor API response: product markets must be an array.");
  }

  const direction = value.change.dir;
  if (direction !== "up" && direction !== "down" && direction !== "flat") {
    throw new Error("Invalid Bazaar Dor API response: product change direction is invalid.");
  }

  return {
    id: requireNumber(value, "id"),
    slug: requireString(value, "slug"),
    nameBn: requireString(value, "nameBn"),
    category: requireString(value, "category"),
    categoryNameBn: requireString(value, "categoryNameBn"),
    categoryIcon: requireString(value, "categoryIcon"),
    unit: requireString(value, "unit"),
    image: requireString(value, "image"),
    today: requireNumber(value, "today"),
    yesterday: requireNumber(value, "yesterday"),
    change: {
      dir: direction,
      pct: requireNumber(value.change, "pct"),
    },
    markets: value.markets.map((market) => {
      if (!isRecord(market)) {
        throw new Error("Invalid Bazaar Dor API response: market data is malformed.");
      }

      return {
        market: requireString(market, "market"),
        division: requireString(market, "division"),
        min: requireNumber(market, "min"),
        max: requireNumber(market, "max"),
      };
    }),
  };
}

async function fetchApi(path: string): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(
      `Bazaar Dor API request failed (${response.status} ${response.statusText}) for ${path}.`,
    );
  }

  return response.json();
}

export async function getBazaarCategories(): Promise<BazaarCategory[]> {
  const payload = await fetchApi("/categories");
  if (!Array.isArray(payload)) {
    throw new Error("Invalid Bazaar Dor API response: categories must be an array.");
  }

  return payload.map(parseCategory);
}

export async function getBazaarProducts(category?: string): Promise<BazaarProduct[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const payload = await fetchApi(`/products${query}`);
  if (!Array.isArray(payload)) {
    throw new Error("Invalid Bazaar Dor API response: products must be an array.");
  }

  return payload.map(parseProduct);
}

export function getBangladeshDateLabel(): string {
  return new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "long",
    timeZone: "Asia/Dhaka",
  }).format(new Date());
}

export function formatTaka(price: number): string {
  return numberFormatter.format(price);
}

export function formatChangePercent(change: number): string {
  return percentFormatter.format(change);
}

export function getUnitLabel(unit: string): string {
  const unitLabels: Record<string, string> = {
    kg: "কেজি",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "টি",
  };

  return unitLabels[unit] ?? unit;
}

export async function getProductBySlug(
  slug: string,
): Promise<BazaarProduct | null> {
  const products = await getBazaarProducts();
  return products.find((product) => product.slug === slug) ?? null;
}