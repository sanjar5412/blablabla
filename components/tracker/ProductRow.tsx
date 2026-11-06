import { X } from "lucide-react";
import { daysLeft, formatDaysLeft, getStatus, remainingRatio, type Status } from "@/lib/freshness";
import type { Product } from "@/lib/schema";
import { FreshnessBar } from "./FreshnessBar";

const BADGE: Record<Status, { label: string; cls: string }> = {
  fresh: { label: "Свежее", cls: "bg-fresh-bg text-fresh" },
  soon: { label: "Скоро испортится", cls: "bg-soon-bg text-soon" },
  expired: { label: "Испорчено", cls: "bg-expired-bg text-expired" },
};

export function ProductRow({
  product,
  onRemove,
}: {
  product: Product;
  onRemove: (id: string) => void;
}) {
  const status = getStatus(product);
  const badge = BADGE[status];
  return (
    <li className="rounded-card border border-line bg-surface p-4 transition-colors hover:border-brand/30">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-medium">{product.name}</p>
          <p className="mt-0.5 text-[13px] text-muted">{formatDaysLeft(daysLeft(product))}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[13px] font-medium ${badge.cls}`}>
            {badge.label}
          </span>
          <button
            onClick={() => onRemove(product.id)}
            aria-label={`Удалить ${product.name}`}
            className="grid size-8 place-items-center rounded-control text-muted transition-colors hover:bg-canvas hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="mt-3">
        <FreshnessBar ratio={remainingRatio(product)} status={status} />
      </div>
    </li>
  );
}
