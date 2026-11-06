import type { Product } from "./schema";

export type Status = "fresh" | "soon" | "expired";
export const SOON_THRESHOLD_DAYS = 3;
const DAY = 86_400_000;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const parse = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d).getTime();
};

export function daysLeft(p: Product, now = new Date()): number {
  return Math.round((parse(p.expiresAt) - startOfDay(now)) / DAY);
}

export function getStatus(p: Product, now = new Date()): Status {
  const d = daysLeft(p, now);
  if (d < 0) return "expired";
  return d <= SOON_THRESHOLD_DAYS ? "soon" : "fresh";
}

/** Доля оставшегося срока: 1 — только купили, 0 — срок вышел */
export function remainingRatio(p: Product, now = new Date()): number {
  const total = Math.max(1, (parse(p.expiresAt) - parse(p.addedAt)) / DAY);
  return Math.min(1, Math.max(0, daysLeft(p, now) / total));
}

function plural(n: number) {
  const m10 = n % 10;
  const m100 = n % 100;
  const w =
    m10 === 1 && m100 !== 11
      ? "день"
      : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)
        ? "дня"
        : "дней";
  return `${n} ${w}`;
}

export function formatDaysLeft(d: number): string {
  if (d < 0) return `Просрочено на ${plural(-d)}`;
  if (d === 0) return "Сегодня последний день";
  if (d === 1) return "Остался 1 день";
  return `Осталось ${plural(d)}`;
}

export const byExpiry = (a: Product, b: Product) => parse(a.expiresAt) - parse(b.expiresAt);
