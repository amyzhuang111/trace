import { EngagementState } from "@/types";
import { computeRoi } from "@/lib/scoring/roi";
import { getPilotStatus } from "@/lib/derive/pilot";
import { buildCurrentPerformanceSummary, buildEconomicsSummary, buildKeyFailureModes } from "@/lib/derive/readout";
import { formatUsd, formatPct } from "@/lib/utils";

export function buildReadoutMarkdown(state: EngagementState): string {
  const { engagement, readout, roiAssumptions } = state;
  const roi = computeRoi(roiAssumptions);
  const status = getPilotStatus(state);

  const lines: string[] = [];
  lines.push(`# ${readout.headline}`);
  lines.push("");
  lines.push(`**${engagement.companyName}** · ${engagement.useCase} · ${engagement.businessFunction}`);
  lines.push("");
  lines.push(`> ${readout.recommendation}`);
  lines.push("");

  lines.push("## Why This Workflow");
  readout.whyThisWorkflow.forEach((w) => lines.push(`- ${w}`));
  lines.push("");

  lines.push("## Current Performance");
  lines.push(
    `Current: ${formatPct(status.currentScore)} · Required: ${formatPct(status.requiredScore)}`
  );
  lines.push("");
  lines.push(buildCurrentPerformanceSummary(state));
  lines.push("");

  lines.push("## Economics");
  lines.push(buildEconomicsSummary(state));
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---|");
  lines.push(`| Current annual labor cost | ${formatUsd(roi.currentAnnualLaborCostUsd)} |`);
  lines.push(`| Projected annual labor cost | ${formatUsd(roi.projectedAnnualLaborCostUsd)} |`);
  lines.push(`| Gross annual savings | ${formatUsd(roi.annualGrossSavingsUsd)} |`);
  lines.push(`| Annual inference cost | ${formatUsd(roi.annualInferenceCostUsd)} |`);
  lines.push(`| Net year-one savings | ${formatUsd(roi.netYearOneSavingsUsd)} |`);
  lines.push(
    `| Payback period | ${Number.isFinite(roi.paybackMonths) ? `${roi.paybackMonths.toFixed(1)} months` : "—"} |`
  );
  lines.push("");

  lines.push("## Key Failure Modes");
  buildKeyFailureModes(state).forEach((f) => lines.push(`- ${f}`));
  lines.push("");

  lines.push("## Pilot Requirements");
  readout.pilotRequirements.forEach((p) => lines.push(`- ${p}`));
  lines.push("");

  lines.push("## Decisions Needed");
  readout.decisionsNeeded.forEach((d) => lines.push(`- ${d}`));
  lines.push("");

  lines.push("---");
  lines.push(`_Generated ${readout.generatedAt} · Trace — Enterprise Agent Diagnostic_`);

  return lines.join("\n");
}

export function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
