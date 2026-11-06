"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { localRepo } from "@/lib/storage";
import { toISODate } from "@/lib/presets";
import type { Product, ProductInput } from "@/lib/schema";

export function useProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);
  const removed = useRef<Product | null>(null);

  useEffect(() => {
    setItems(localRepo.load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localRepo.save(items);
  }, [items, ready]);

  const add = useCallback((input: ProductInput) => {
    setItems((prev) => [...prev, { ...input, id: crypto.randomUUID(), addedAt: toISODate(0) }]);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      removed.current = prev.find((p) => p.id === id) ?? null;
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const undo = useCallback(() => {
    const back = removed.current;
    if (back) setItems((prev) => [...prev, back]);
    removed.current = null;
  }, []);

  return { items, ready, add, remove, undo };
}
