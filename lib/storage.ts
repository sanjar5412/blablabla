import { z } from "zod";
import { productInputSchema, type Product } from "./schema";

export interface ProductRepository {
  load(): Product[];
  save(items: Product[]): void;
}

const stored = productInputSchema.extend({ id: z.string(), addedAt: z.string() });
const KEY = "freshly:v1";

export const localRepo: ProductRepository = {
  load() {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = z.array(stored).safeParse(raw ? JSON.parse(raw) : []);
      return parsed.success ? parsed.data : [];
    } catch {
      return [];
    }
  },
  save(items) {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* квота или приватный режим */
    }
  },
};
