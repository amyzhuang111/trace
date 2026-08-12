"use client";

import { RoiAssumptions } from "@/types";
import { useEngagementStore } from "@/store/useEngagementStore";
import { computeRoi } from "@/lib/scoring/roi";
import { formatUsd } from "@/lib/utils";
import { StatCard } from "@/components/common/StatCard";

const FIELDS: { key: keyof RoiAssumptions; label: string; step?: number; suffix?: string }[] = [
  { key: "briefsPerMonth", label: "Briefs / month" },
  { key: "currentPrepHours", label: "Current prep hours / brief", step: 0.1 },
  { key: "blendedHourlyCostUsd", label: "Blended hourly cost", suffix: "$" },
  { key: "targetTimeReductionPct", label: "Target time reduction", step: 0.01, suffix: "×100%" },
  { key: "humanReviewMinutesRetained", label: "Human review retained (min)" },
  { key: "agentRunCostUsd", label: "Agent run cost / task", step: 0.01, suffix: "$" },
  { key: "implementationCostUsd", label: "Implementation cost (one-time)", suffix: "$" },
];

export function RoiCalculator() {
  const assumptions = useEngagementStore((s) => s.roiAssumptions);
  const updateRoiAssumptions = useEngagementStore((s) => s.updateRoiAssumptions);
  const result = computeRoi(assumptions);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">Assumptions (editable)</div>
        <div className="space-y-2">
          {FIELDS.map((f) => (
            <label key={f.key} className="flex items-center justify-between gap-3 text-[12.5px]">
              <span className="text-muted">{f.label}</span>
              <input
                type="number"
                step={f.step ?? 1}
                value={assumptions[f.key]}
                onChange={(e) => updateRoiAssumptions({ [f.key]: Number(e.target.value) } as Partial<RoiAssumptions>)}
                className="h-7 w-28 rounded-md border border-border-strong bg-surface px-2 text-right text-[12.5px] tabular-nums text-foreground"
              />
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">Result</div>
        <div className="grid grid-cols-2 gap-2">
          <StatCard label="Current Annual Cost" value={formatUsd(result.currentAnnualLaborCostUsd)} />
          <StatCard label="Projected Annual Cost" value={formatUsd(result.projectedAnnualLaborCostUsd)} />
          <StatCard label="Gross Annual Savings" value={formatUsd(result.annualGrossSavingsUsd)} tone="success" />
          <StatCard label="Annual Inference Cost" value={formatUsd(result.annualInferenceCostUsd)} />
          <StatCard label="Net Year-One Savings" value={formatUsd(result.netYearOneSavingsUsd)} tone="success" />
          <StatCard
            label="Payback Period"
            value={Number.isFinite(result.paybackMonths) ? `${result.paybackMonths.toFixed(1)} mo` : "—"}
          />
        </div>
      </div>
    </div>
  );
}
