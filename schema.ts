import { z } from "zod";

export const CATEGORIES = ["dairy", "meat", "veg", "fruit", "bakery", "other"] as const;
export type Category = (typeof CATEGORIES)[number];

export const productInputSchema = z.object({
  name: z.string().trim().min(2, "Минимум 2 символа").max(40, "Слишком длинное название"),
  category: z.enum(CATEGORIES).default("other"),
  expiresAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Укажите дату"),
});

export type ProductInput = z.infer<typeof productInputSchema>;
export type Product = ProductInput & { id: string; addedAt: string };
