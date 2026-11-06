import type { Category } from "./schema";

export const PRESETS: { match: RegExp; days: number; category: Category }[] = [
  { match: /молок|кефир|йогурт|сметан/i, days: 7, category: "dairy" },
  { match: /сыр|творог/i, days: 10, category: "dairy" },
  { match: /кур|мяс|фарш|говяд|рыб/i, days: 3, category: "meat" },
  { match: /хлеб|батон|булк/i, days: 4, category: "bakery" },
  { match: /помидор|огур|салат|зелень/i, days: 6, category: "veg" },
  { match: /яблок|банан|груш|ягод/i, days: 7, category: "fruit" },
];

export const suggest = (name: string) => PRESETS.find((p) => p.match.test(name));

export const toISODate = (offsetDays: number, from = new Date()) => {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + offsetDays);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
};
