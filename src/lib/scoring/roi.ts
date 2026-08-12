import { RoiAssumptions, RoiResult } from "@/types";

export function computeRoi(a: RoiAssumptions): RoiResult {
  const briefsPerYear = a.briefsPerMonth * 12;
  const currentAnnualLaborCostUsd = briefsPerYear * a.currentPrepHours * a.blendedHourlyCostUsd;

  const reducedHours = a.currentPrepHours * (1 - a.targetTimeReductionPct);
  const reviewHours = a.humanReviewMinutesRetained / 60;
  const projectedHoursPerBrief = Math.max(reducedHours, reviewHours);
  const projectedAnnualLaborCostUsd = briefsPerYear * projectedHoursPerBrief * a.blendedHourlyCostUsd;

  const annualGrossSavingsUsd = currentAnnualLaborCostUsd - projectedAnnualLaborCostUsd;
  const annualInferenceCostUsd = briefsPerYear * a.agentRunCostUsd;
  const netAnnualRecurringSavingsUsd = annualGrossSavingsUsd - annualInferenceCostUsd;
  const netYearOneSavingsUsd = netAnnualRecurringSavingsUsd - a.implementationCostUsd;
  const paybackMonths =
    netAnnualRecurringSavingsUsd > 0
      ? (a.implementationCostUsd / netAnnualRecurringSavingsUsd) * 12
      : Infinity;

  return {
    currentAnnualLaborCostUsd,
    projectedAnnualLaborCostUsd,
    annualGrossSavingsUsd,
    annualInferenceCostUsd,
    netYearOneSavingsUsd,
    paybackMonths,
  };
}
