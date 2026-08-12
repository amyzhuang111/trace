import { AgentSpec, EvalCase, EngagementState, WorkflowExtraction } from "@/types";

export type JudgeInput = {
  evalCaseId: string;
  verifierId: string;
  outputSummary: string;
};

export type JudgeOutput = {
  verifierId: string;
  score: number;
  passed: boolean;
  rationale: string;
};

export interface AIProvider {
  name: string;
  extractWorkflow(transcript: string): Promise<WorkflowExtraction>;
  generateAgentSpec(context: { transcript: string; existingSpec?: AgentSpec }): Promise<Partial<AgentSpec>>;
  generateEvalCases(spec: AgentSpec, count?: number): Promise<Partial<EvalCase>[]>;
  judgeOutput(input: JudgeInput): Promise<JudgeOutput>;
  generateReadout(state: EngagementState): Promise<string>;
}
