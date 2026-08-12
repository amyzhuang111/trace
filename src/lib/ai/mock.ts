import { AIProvider, JudgeInput, JudgeOutput } from "./provider";
import { EngagementState, WorkflowExtraction, TacitRule, WorkflowStep, Confidence } from "@/types";
import { interviews } from "@/lib/data/experts";
import { workflowSteps, tacitRules } from "@/lib/data/workflow";
import { getPilotStatus } from "@/lib/derive/pilot";

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const JUDGMENT_MARKERS = ["but ", "only if", "should", "never", "context", "matter", "unless", "instead of"];

function splitSentences(transcript: string): string[] {
  return transcript
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
}

function heuristicExtract(transcript: string): WorkflowExtraction {
  const sentences = splitSentences(transcript);
  const steps: WorkflowStep[] = [];
  const rules: TacitRule[] = [];

  sentences.forEach((sentence, i) => {
    const lower = sentence.toLowerCase();
    const isJudgment = JUDGMENT_MARKERS.some((m) => lower.includes(m));
    if (isJudgment) {
      const confidenceRoll = hashStr(sentence) % 3;
      const confidence: Confidence = confidenceRoll === 0 ? "high" : confidenceRoll === 1 ? "medium" : "low";
      rules.push({
        id: `tr-auto-${i}`,
        rule: sentence,
        rationale: "Extracted from interview transcript — review and refine before relying on this rule.",
        evidenceIds: [],
        confidence,
        category: "data-handling",
      });
    } else {
      steps.push({
        id: `ws-auto-${i}`,
        order: steps.length + 1,
        label: sentence.length > 70 ? `${sentence.slice(0, 67)}...` : sentence,
        description: sentence,
        actor: "human",
        systems: [],
        judgmentRequired: false,
        evidenceIds: [],
      });
    }
  });

  return { steps, tacitRules: rules, extractedAt: "generated" };
}

export const mockProvider: AIProvider = {
  name: "mock",

  async extractWorkflow(transcript) {
    const known = interviews.find((i) => i.transcript.trim() === transcript.trim());
    if (known) {
      return {
        steps: workflowSteps.filter((s) => s.evidenceIds.includes(known.id)),
        tacitRules: tacitRules.filter((r) => r.evidenceIds.includes(known.id)),
        extractedAt: "generated",
      };
    }
    return heuristicExtract(transcript);
  },

  async generateAgentSpec(context) {
    const extraction = await mockProvider.extractWorkflow(context.transcript);
    const nextVersion = (context.existingSpec?.version ?? 0) + 1;
    return {
      version: nextVersion,
      rules: extraction.tacitRules.map((r) => ({
        id: `asr-auto-${r.id}`,
        rule: r.rule,
        evidence: [],
      })),
      changelog: `Regenerated from ${extraction.tacitRules.length} tacit rule(s) extracted from the supplied transcript.`,
    };
  },

  async generateEvalCases(spec, count = 4) {
    return spec.rules.slice(0, count).map((rule, i) => ({
      id: `ec-auto-${i}`,
      name: `Verify: ${rule.rule.slice(0, 48)}${rule.rule.length > 48 ? "..." : ""}`,
      task: `Construct a scenario that would fail unless the agent follows: "${rule.rule}"`,
      verifierIds: [],
      tags: ["generated"],
      difficulty: "edge" as const,
    }));
  },

  async judgeOutput(input: JudgeInput): Promise<JudgeOutput> {
    const roll = hashStr(`${input.evalCaseId}:${input.verifierId}:${input.outputSummary}`) % 100;
    const score = Math.round(roll) / 100;
    return {
      verifierId: input.verifierId,
      score,
      passed: score >= 0.8,
      rationale: "Deterministic mock judgment — replace with a live provider for real grading.",
    };
  },

  async generateReadout(state: EngagementState) {
    const { engagement } = state;
    const status = getPilotStatus(state);
    return [
      `${engagement.companyName} — ${engagement.useCase}`,
      "",
      status.recommendation === "go"
        ? "The agent clears the quality bar and is ready for a scoped pilot."
        : `The agent is not yet ready for pilot. Current score ${(status.currentScore * 100).toFixed(0)}% vs. a ${(status.requiredScore * 100).toFixed(0)}% requirement.`,
      "",
      "Blocking issues:",
      ...status.openBlockers.map((b) => `- ${b.title}: ${b.description}`),
    ].join("\n");
  },
};
