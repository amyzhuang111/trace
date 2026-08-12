import { EvalCase, Verifier, EvalResult, VerifierResult } from "@/types";

// Deterministic string hash so seeded results never differ between server and
// client render passes (Math.random()/Date.now() would cause hydration mismatches).
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pseudoFraction(seed: string): number {
  return (hashStr(seed) % 997) / 997;
}

export type VerifierBaseRates = Record<string, number>;

const DIFFICULTY_DELTA: Record<EvalCase["difficulty"], number> = {
  standard: 0.03,
  edge: -0.04,
  adversarial: -0.09,
};

export function generateEvalResults(
  evalCases: EvalCase[],
  verifiers: Verifier[],
  baseRates: VerifierBaseRates
): EvalResult[] {
  const verifierById = new Map(verifiers.map((v) => [v.id, v]));

  return evalCases.map((c): EvalResult => {
    const delta = DIFFICULTY_DELTA[c.difficulty];
    const verifierResults: VerifierResult[] = c.verifierIds.map((vid): VerifierResult => {
      const verifier = verifierById.get(vid);
      if (!verifier) return { verifierId: vid, score: 0, passed: false };
      const base = baseRates[vid] ?? 0.8;
      const wobble = (pseudoFraction(`${c.id}:${vid}`) - 0.5) * 0.16;

      if (verifier.threshold >= 1) {
        // Binary-style verifier: deterministically "passes" at roughly the base rate.
        const passed = pseudoFraction(`bin:${c.id}:${vid}`) < Math.max(0, Math.min(1, base + delta));
        return { verifierId: vid, score: passed ? 1 : 0.4, passed };
      }

      const score = Math.max(0, Math.min(1, base + delta + wobble));
      return { verifierId: vid, score: Number(score.toFixed(2)), passed: score >= verifier.threshold };
    });

    const passed = verifierResults.every((r) => r.passed);
    return { evalCaseId: c.id, passed, verifierResults };
  });
}

export function computeVerifierAverages(results: EvalResult[]): Record<string, number> {
  const sums: Record<string, { sum: number; count: number }> = {};
  for (const r of results) {
    for (const vr of r.verifierResults) {
      sums[vr.verifierId] ??= { sum: 0, count: 0 };
      sums[vr.verifierId].sum += vr.score;
      sums[vr.verifierId].count += 1;
    }
  }
  return Object.fromEntries(Object.entries(sums).map(([k, v]) => [k, v.sum / v.count]));
}

export function computeWeightedScore(
  verifierAverages: Record<string, number>,
  verifiers: Verifier[]
): number {
  let total = 0;
  let weightSum = 0;
  for (const v of verifiers) {
    const avg = verifierAverages[v.id];
    if (avg === undefined) continue;
    total += avg * v.weight;
    weightSum += v.weight;
  }
  return weightSum ? total / weightSum : 0;
}

export function passRate(results: EvalResult[]): number {
  if (results.length === 0) return 0;
  return results.filter((r) => r.passed).length / results.length;
}
