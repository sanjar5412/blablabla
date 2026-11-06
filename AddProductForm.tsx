"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { productInputSchema, type ProductInput } from "@/lib/schema";
import { suggest, toISODate } from "@/lib/presets";

const QUICK = [3, 7, 14];

export function AddProductForm({ onAdd }: { onAdd: (p: ProductInput) => void }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState(() => toISODate(7));
  const [touchedDate, setTouchedDate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onName = (v: string) => {
    setName(v);
    const hit = suggest(v);
    if (hit && !touchedDate) setDate(toISODate(hit.days));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = productInputSchema.safeParse({
      name,
      expiresAt: date,
      category: suggest(name)?.category,
    });
    if (!res.success) return setError(res.error.issues[0].message);
    onAdd(res.data);
    setName("");
    setError(null);
    setTouchedDate(false);
    setDate(toISODate(7));
  };

  const field =
    "h-10 rounded-control border border-line bg-surface px-3 text-[15px] outline-none transition-colors focus:border-brand";

  return (
    <form onSubmit={submit} className="rounded-card border border-line bg-surface p-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={name}
          onChange={(e) => onName(e.target.value)}
          placeholder="Что купили? Например, молоко"
          aria-label="Название продукта"
          aria-invalid={!!error}
          className={`${field} flex-1`}
        />
        <input
          type="date"
          value={date}
          aria-label="Срок годности"
          onChange={(e) => {
            setDate(e.target.value);
            setTouchedDate(true);
          }}
          className={field}
        />
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-control bg-brand px-4 text-[15px] font-medium text-white transition-opacity hover:opacity-90 active:opacity-80"
        >
          <Plus size={16} /> Добавить
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[13px] text-muted">
        <span>Срок через</span>
        {QUICK.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => {
              setDate(toISODate(d));
              setTouchedDate(true);
            }}
            className="rounded-full border border-line px-2.5 py-1 transition-colors hover:border-brand hover:text-brand"
          >
            {d} д
          </button>
        ))}
        {error && (
          <span role="alert" className="ml-auto text-expired">
            {error}
          </span>
        )}
      </div>
    </form>
  );
}
