import { Experiment, EvalCase } from "@/types";
import { evalCases, verifiers } from "./evals";
import { engagement } from "./engagement";
import {
  generateEvalResults,
  computeVerifierAverages,
  computeWeightedScore,
  VerifierBaseRates,
} from "@/lib/scoring/eval";

const TOOLS = ["Salesforce", "Zendesk", "Product Analytics", "Meeting Notes Repository"];

// Configuration C has not yet been run against the full committed benchmark — only a
// screening subset, weighted toward the case categories tied to the three open blockers
// (conflicting evidence, critical support risk, adversarial severity-taxonomy conflicts),
// plus a broad sample of standard/ambiguous/missing/stale cases. This is a real, computed
// subset (not a hand-typed "16/24" label) — see lib/derive/pilot.ts's fullSuiteRun gate.
const SCREENING_CASE_IDS = [
  "ec-01", "ec-02", "ec-06", "ec-07", "ec-10", "ec-13", "ec-14",
  "ec-15", "ec-16", "ec-17", "ec-18", "ec-19", "ec-20", "ec-21", "ec-22", "ec-23",
];

function buildExperiment(
  id: string,
  label: string,
  status: Experiment["status"],
  agentVersion: number,
  config: Experiment["config"],
  costPerTaskUsd: number,
  latencySeconds: number,
  evalSuiteVersion: string,
  runDate: string,
  caseSet: EvalCase[],
  baseRates: VerifierBaseRates,
  strengths: string[],
  weaknesses: string[],
  recommendation: string
): Experiment {
  const results = generateEvalResults(caseSet, verifiers, baseRates);
  const verifierAverages = computeVerifierAverages(results);
  const score = computeWeightedScore(verifierAverages, verifiers);
  const verifierBreakdown = verifiers.map((v) => ({
    verifierId: v.id,
    score: Number((verifierAverages[v.id] ?? 0).toFixed(2)),
  }));

  return {
    id,
    label,
    status,
    agentVersion,
    config,
    score: Number(score.toFixed(3)),
    costPerTaskUsd,
    latencySeconds,
    evalSuiteVersion,
    casesEvaluated: caseSet.length,
    runDate,
    verifierBreakdown,
    results,
    strengths,
    weaknesses,
    recommendation,
    passedPilotThreshold: score >= engagement.qualityThreshold,
  };
}

const screeningCases = evalCases.filter((c) => SCREENING_CASE_IDS.includes(c.id));

export const experiments: Experiment[] = [
  buildExperiment(
    "exp-baseline",
    "Baseline — Frontier Model A · Prompt v3",
    "baseline",
    1,
    { model: "Frontier Model A", promptVersion: "v3", tools: TOOLS, reasoning: "medium" },
    0.38,
    35,
    "v1",
    "2026-07-20",
    evalCases,
    {
      "ver-source-grounding": 0.9,
      "ver-strategic-prioritization": 0.55,
      "ver-critical-support-risk": 0.7,
      "ver-contradiction-handling": 0.55,
      "ver-executive-concision": 0.75,
      "ver-actionability": 0.7,
      "ver-tool-efficiency": 0.75,
      "ver-format-compliance": 0.95,
    },
    ["Format compliance is solid.", "Source grounding mostly holds on standard cases."],
    ["Strategic prioritization is weak.", "Contradiction handling fails on most conflicting-evidence cases.", "Support risk retrieval misses recurring low-count-but-high-severity issues."],
    "Do not ship. Useful only as a cost/quality floor for comparison.",
  ),
  buildExperiment(
    "exp-config-a",
    "Configuration A — Frontier Model A · Prompt v4",
    "rejected",
    2,
    { model: "Frontier Model A", promptVersion: "v4", tools: TOOLS, reasoning: "medium" },
    0.44,
    39,
    "v2",
    "2026-07-28",
    evalCases,
    {
      "ver-source-grounding": 0.95,
      "ver-strategic-prioritization": 0.62,
      "ver-critical-support-risk": 0.78,
      "ver-contradiction-handling": 0.6,
      "ver-executive-concision": 0.78,
      "ver-actionability": 0.74,
      "ver-tool-efficiency": 0.77,
      "ver-format-compliance": 0.97,
    },
    ["Source grounding improved meaningfully over baseline.", "Format compliance near-perfect."],
    ["Strategic prioritization still below the 0.80 bar.", "Contradiction handling remains unreliable on conflicting-source cases."],
    "Do not ship. Prompt v4 helped grounding but did not fix the two blocking weaknesses.",
  ),
  buildExperiment(
    "exp-config-b",
    "Configuration B — Frontier Model B · Prompt v4",
    "committed",
    3,
    { model: "Frontier Model B", promptVersion: "v4", tools: TOOLS, reasoning: "high" },
    0.89,
    64,
    "v3",
    "2026-08-05",
    evalCases,
    {
      "ver-source-grounding": 0.98,
      "ver-strategic-prioritization": 0.71,
      "ver-critical-support-risk": 0.8,
      "ver-contradiction-handling": 0.74,
      "ver-executive-concision": 0.8,
      "ver-actionability": 0.8,
      "ver-tool-efficiency": 0.78,
      "ver-format-compliance": 1.0,
    },
    ["Source grounding 98%.", "Format compliance 100%."],
    ["Strategic prioritization 71% — below the 80% bar.", "Contradiction handling 74% — below the blocking 100% bar on several conflicting-evidence cases."],
    "This is the current committed configuration. It clears the release bar on grounding and format compliance but remains blocked on contradiction handling and critical support risk — see Pilot for the full blocker list.",
  ),
  buildExperiment(
    "exp-config-c",
    "Configuration C — Frontier Model C · Prompt v5",
    "candidate",
    4,
    { model: "Frontier Model C", promptVersion: "v5", tools: TOOLS, reasoning: "medium" },
    0.51,
    47,
    "v3",
    "2026-08-09",
    screeningCases,
    {
      "ver-source-grounding": 0.99,
      "ver-strategic-prioritization": 0.82,
      "ver-critical-support-risk": 0.85,
      "ver-contradiction-handling": 0.85,
      "ver-executive-concision": 0.85,
      "ver-actionability": 0.84,
      "ver-tool-efficiency": 0.9,
      "ver-format-compliance": 1.0,
    },
    ["Clears every blocking verifier on its screening set.", "Strategic prioritization and contradiction handling both cross their thresholds.", "Lowest cost of any configuration evaluated so far."],
    ["Has not yet run the full 24-case committed benchmark — only a 16-case screening subset weighted toward the current blockers.", "Cannot become committed until it clears the same full suite Configuration B was measured against."],
    "Promising candidate, not yet pilot-ready. Prompt v5 plus a more targeted reasoning strategy — not just a bigger model — closed the gap on its screening run. Re-run against the full 24-case suite before this can replace Configuration B as committed.",
  ),
];

export const currentCommittedExperimentId = experiments.find((e) => e.status === "committed")!.id;
export const recommendedExperimentId = experiments.find((e) => e.status === "candidate")!.id;
