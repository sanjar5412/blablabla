"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { byExpiry, getStatus, type Status } from "@/lib/freshness";
import { AddProductForm } from "@/components/tracker/AddProductForm";
import { ProductRow } from "@/components/tracker/ProductRow";

type Filter = "all" | Status;

const TABS: { id: Filter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "soon", label: "Скоро испортятся" },
  { id: "fresh", label: "Свежие" },
  { id: "expired", label: "Испорченные" },
];

export default function Page() {
  const { items, ready, add, remove, undo } = useProducts();
  const [filter, setFilter] = useState<Filter>("all");
  const [undoVisible, setUndoVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const sorted = useMemo(() => [...items].sort(byExpiry), [items]);
  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: items.length, fresh: 0, soon: 0, expired: 0 };
    items.forEach((p) => {
      c[getStatus(p)]++;
    });
    return c;
  }, [items]);
  const visible = filter === "all" ? sorted : sorted.filter((p) => getStatus(p) === filter);

  const handleRemove = (id: string) => {
    remove(id);
    setUndoVisible(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setUndoVisible(false), 5000);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
      <h1 className="text-[28px] font-semibold tracking-tight">Холодильник</h1>
      <p className="mt-1 text-[15px] text-muted">
        {counts.soon > 0
          ? `Скоро испортятся: ${counts.soon}. Лучше съесть их в ближайшие дни`
          : "Всё под контролем"}
      </p>

      <div className="mt-8">
        <AddProductForm onAdd={add} />
      </div>

      <div role="tablist" className="mt-8 flex flex-wrap gap-1 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={filter === t.id}
            onClick={() => setFilter(t.id)}
            className={`-mb-px border-b-2 px-3 py-2 text-[14px] transition-colors ${
              filter === t.id
                ? "border-brand font-medium text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t.label} <span className="ml-1 text-muted">{counts[t.id]}</span>
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {ready && visible.map((p) => <ProductRow key={p.id} product={p} onRemove={handleRemove} />)}
      </ul>

      {ready && visible.length === 0 && (
        <p className="mt-10 text-center text-[15px] text-muted">
          {items.length === 0
            ? "Добавьте первый продукт: достаточно названия, срок подставится сам."
            : "В этой категории пусто."}
        </p>
      )}

      {undoVisible && (
        <div
          role="status"
          className="fixed inset-x-0 bottom-6 mx-auto flex w-fit items-center gap-4 rounded-control bg-ink px-4 py-2.5 text-[14px] text-white"
        >
          Продукт удалён
          <button
            onClick={() => {
              undo();
              setUndoVisible(false);
            }}
            className="font-medium underline underline-offset-2"
          >
            Вернуть
          </button>
        </div>
      )}
    </main>
  );
}
