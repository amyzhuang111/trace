import { DriverContribution } from "@/types";
import { colorForIndex } from "@/lib/chartPalette";

export function DriverContributionBar({ data, source }: { data: DriverContribution[]; source?: string }) {
  return (
    <div>
      <div className="flex h-6 w-full gap-0.5 overflow-hidden rounded-md">
        {data.map((d, i) => (
          <div
            key={d.label}
            style={{
              width: `${d.pct}%`,
              background: d.label === "Unexplained" ? "var(--border-strong)" : colorForIndex(i),
            }}
            title={`${d.label}: ${d.pct}%`}
          />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-1.5 text-[12px]">
            <span
              className="h-2 w-2 shrink-0 rounded-sm"
              style={{ background: d.label === "Unexplained" ? "var(--border-strong)" : colorForIndex(i) }}
            />
            <span className="text-muted">{d.label}</span>
            <span className="ml-auto font-medium tabular-nums text-foreground">{d.pct}%</span>
          </div>
        ))}
      </div>
      {source && <p className="mt-2 text-[10.5px] text-muted-2">{source}</p>}
    </div>
  );
}
