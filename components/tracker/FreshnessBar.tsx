import type { Status } from "@/lib/freshness";

const FILL: Record<Status, string> = {
  fresh: "bg-fresh",
  soon: "bg-soon",
  expired: "bg-expired",
};

export function FreshnessBar({ ratio, status }: { ratio: number; status: Status }) {
  const width = status === "expired" ? 0 : Math.max(4, ratio * 100);
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line" aria-hidden>
      <div
        className={`h-full rounded-full transition-[width] duration-500 ease-out ${FILL[status]}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
