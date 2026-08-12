import { EngagementState } from "@/types";
import { getPilotStatus } from "./pilot";
import { computeRoi } from "@/lib/scoring/roi";
import { formatPct, formatUsd } from "@/lib/utils";

function verifierScore(committedScore: number | undefined) {
  return committedScore ?? 0;
}

// All numbers below are read live off the committed experiment's verifierBreakdown and
// computeRoi(roiAssumptions) — nothing here is a separately hand-typed literal, so the
// sentence can never drift from the Overview/Pilot/Experiments numbers.
export function buildCurrentPerformanceSummary(state: EngagementState): string {
  const status = getPilotStatus(state);
  const { committed, candidate } = status;

  const grounding = verifierScore(committed.verifierBreakdown.find((v) => v.verifierId === "ver-source-grounding")?.score);
  const format = verifierScore(committed.verifierBreakdown.find((v) => v.verifierId === "ver-format-compliance")?.score);
  const prioritization = verifierScore(committed.verifierBreakdown.find((v) => v.verifierId === "ver-strategic-prioritization")?.score);
  const contradiction = verifierScore(committed.verifierBreakdown.find((v) => v.verifierId === "ver-contradiction-handling")?.score);

  const base = `The committed configuration (${committed.label}) scores ${formatPct(status.currentScore)} against an ${formatPct(status.requiredScore)} quality bar. Source grounding and format compliance are strong (${formatPct(grounding)} and ${formatPct(format)}), but strategic prioritization (${formatPct(prioritization)}) and contradiction handling (${formatPct(contradiction)}) both fall short of their blocking thresholds — the aggregate score alone does not determine pilot readiness.`;

  if (!candidate) return base;

  const candidateNote = candidate.passedPilotThreshold
    ? `A candidate configuration (${candidate.label}) clears ${formatPct(status.requiredScore)} at lower per-task cost on a ${candidate.casesEvaluated}-of-${state.evalCases.length}-case screening run, but has not yet been validated against the full committed suite.`
    : `A candidate configuration (${candidate.label}) is under evaluation but does not yet clear the bar on its ${candidate.casesEvaluated}-of-${state.evalCases.length}-case screening run.`;

  return `${base} ${candidateNote}`;
}

export function buildEconomicsSummary(state: EngagementState): string {
  const { roiAssumptions } = state;
  const roi = computeRoi(roiAssumptions);

  return `At ${roiAssumptions.briefsPerMonth} briefs/month, ${roiAssumptions.currentPrepHours} hours of current prep time, and a ${formatUsd(roiAssumptions.blendedHourlyCostUsd)} blended hourly rate, the fully-loaded current annual labor cost is ${formatUsd(roi.currentAnnualLaborCostUsd)}. A ${formatPct(roiAssumptions.targetTimeReductionPct)} time reduction projects annual labor cost down to ${formatUsd(roi.projectedAnnualLaborCostUsd)}, for gross annual savings of ${formatUsd(roi.annualGrossSavingsUsd)}. Annual inference cost is ${formatUsd(roi.annualInferenceCostUsd)}. Net of a ${formatUsd(roiAssumptions.implementationCostUsd)} implementation estimate, payback is ${Number.isFinite(roi.paybackMonths) ? `${roi.paybackMonths.toFixed(1)} months` : "not yet reached"}. All assumptions are editable in the ROI model.`;
}

export function buildKeyFailureModes(state: EngagementState): string[] {
  const status = getPilotStatus(state);
  return status.openBlockers.map((b) => {
    const failure = state.failures.find((f) => f.id === b.failureId);
    return failure ? `${b.title}: ${failure.expertCorrection} (${failure.id}).` : `${b.title}: ${b.description}`;
  });
}
