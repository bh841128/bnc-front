const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export async function api<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data as T;
}

export type I18nMap = { zh?: string; en?: string; id?: string };

export function pickI18n(obj: I18nMap | undefined, lang: string): string {
  if (!obj) return "";
  return (obj as Record<string, string>)[lang] || obj.en || obj.zh || obj.id || "";
}

export type Product = {
  id: number;
  sku: string;
  price_cents: number;
  stock: number;
  category: string;
  is_active: boolean;
  name_i18n: I18nMap;
  description_i18n: I18nMap;
  image_url?: string | null;
};

export type CartItem = {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
};

export type Order = {
  id: number;
  order_no: string;
  status: string;
  total_cents: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  items: Array<{
    id: number;
    product_id: number;
    product_name_snapshot: string;
    unit_price_cents: number;
    quantity: number;
  }>;
};

export type Payment = {
  id: number;
  payment_no: string;
  order_id: number;
  amount_cents: number;
  status: string;
  provider: string;
};

export function formatMoney(cents: number, lang: string): string {
  const amount = cents / 100;
  if (lang === "zh") return `¥${amount.toFixed(2)}`;
  if (lang === "id") return `Rp${amount.toFixed(0)}`;
  return `$${amount.toFixed(2)}`;
}
