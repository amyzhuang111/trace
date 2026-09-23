"use client";

import { CohortEconomics, AcquisitionChannel } from "@/types";

const COLUMNS = ["M1 (30d)", "M2 (60d)", "M3", "M4", "M5", "M6"];
const DECAY = 0.93;

function buildGrid(rows: CohortEconomics[], channel: AcquisitionChannel) {
  const byMonth = rows.filter((r) => r.channel === channel);
  return byMonth.map((r) => {
    const values = [r.day30Repeat, r.day60Repeat];
    let last = r.day60Repeat;
    for (let i = 2; i < COLUMNS.length; i++) {
      last = Math.round(last * DECAY * 10) / 10;
      values.push(last);
    }
    return { cohortMonth: r.cohortMonth, values };
  });
}

function bg(value: number, min: number, max: number) {
  const alpha = 0.12 + 0.78 * ((value - min) / Math.max(1, max - min));
  return `rgba(42, 120, 214, ${alpha.toFixed(2)})`;
}

export function CohortRetentionHeatmap({
  rows,
  channel,
}: {
  rows: CohortEconomics[];
  channel: AcquisitionChannel;
}) {
  const grid = buildGrid(rows, channel);
  const allValues = grid.flatMap((g) => g.values);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11.5px]">
          <thead>
            <tr>
              <th className="px-2 py-1.5 text-left text-[10.5px] font-semibold uppercase tracking-wide text-muted-2">
                Cohort
              </th>
              {COLUMNS.map((c) => (
                <th key={c} className="px-2 py-1.5 text-center text-[10.5px] font-semibold uppercase tracking-wide text-muted-2">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row) => (
              <tr key={row.cohortMonth}>
                <td className="px-2 py-1 text-[11.5px] font-medium text-foreground">{row.cohortMonth}</td>
                {row.values.map((v, i) => {
                  const alpha = 0.12 + 0.78 * ((v - min) / Math.max(1, max - min));
                  return (
                    <td key={i} className="p-0.5">
                      <div
                        className="flex h-8 items-center justify-center rounded text-[11px] font-medium tabular-nums"
                        style={{ background: bg(v, min, max), color: alpha > 0.55 ? "#ffffff" : "var(--foreground)" }}
                      >
                        {v}%
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[10.5px] text-muted-2">
        Source: orders + acquisition · {channel} repeat rate by cohort month. M3–M6 modeled from a fitted decay off day-60 repeat — illustrative, not raw weekly data.
      </p>
    </div>
  );
}
