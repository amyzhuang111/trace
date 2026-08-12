import { EngagementState, Experiment, Verifier, Blocker } from "@/types";

export type PilotStatus = {
  committed: Experiment;
  candidate?: Experiment;
  currentScore: number;
  requiredScore: number;
  scoreGap: number;
  blockingVerifierResults: { verifier: Verifier; score: number; passed: boolean }[];
  openBlockers: Blocker[];
  fullSuiteRun: boolean;
  ready: boolean;
  recommendation: "go" | "conditional-no-go" | "no-go";
};

// The single place that decides whether the engagement is pilot-ready. A high aggregate
// score cannot compensate for a serious enterprise failure: readiness requires the score
// to clear the bar AND every blocking verifier to pass AND no open blocker AND the
// committed configuration to have actually run the full committed eval suite.
export function getPilotStatus(state: EngagementState): PilotStatus {
  const { engagement, experiments, evalCases, verifiers, blockers } = state;

  const committed = experiments.find((e) => e.status === "committed") ?? experiments[0];
  const candidate = experiments.find((e) => e.status === "candidate");

  const currentScore = committed.score;
  const requiredScore = engagement.qualityThreshold;
  const scoreGap = requiredScore - currentScore;

  const blockingVerifierResults = verifiers
    .filter((v) => v.blocking)
    .map((verifier) => {
      const vb = committed.verifierBreakdown.find((b) => b.verifierId === verifier.id);
      const score = vb?.score ?? 0;
      return { verifier, score, passed: score >= verifier.threshold };
    });

  const openBlockers = blockers.filter((b) => b.status === "open");
  const fullSuiteRun = committed.casesEvaluated === evalCases.length;

  const ready =
    currentScore >= requiredScore &&
    blockingVerifierResults.every((r) => r.passed) &&
    openBlockers.length === 0 &&
    fullSuiteRun;

  const recommendation: PilotStatus["recommendation"] = ready
    ? "go"
    : currentScore >= requiredScore - 0.1
      ? "conditional-no-go"
      : "no-go";

  return {
    committed,
    candidate,
    currentScore,
    requiredScore,
    scoreGap,
    blockingVerifierResults,
    openBlockers,
    fullSuiteRun,
    ready,
    recommendation,
  };
}
