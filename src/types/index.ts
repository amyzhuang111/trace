// Core domain types for Trace — Enterprise Agent Diagnostic

export type Confidence = "high" | "medium" | "low";
export type Actor = "human" | "system" | "agent";
export type Severity = "low" | "medium" | "high" | "critical";
export type Difficulty = "standard" | "edge" | "adversarial";
export type VerifierType = "deterministic" | "llm" | "agent";
export type VerifierScope = "trajectory" | "output" | "both";

export type Expert = {
  id: string;
  name: string;
  role: string;
  domain: string;
  tenureYears: number;
  avatarInitials: string;
};

export type Interview = {
  id: string;
  expertId: string;
  date: string;
  durationMinutes: number;
  transcript: string;
  systemsReferenced: string[];
  painPoints: string[];
  openQuestions: string[];
  qualityCriteria: string[];
  edgeCasesNoted: string[];
  objectives: string[];
  signals: string[];
  decisionRules: string[];
  exceptions: string[];
  constraints: string[];
  metrics: string[];
  extraction?: WorkflowExtraction;
};

export type WorkflowExtraction = {
  steps: WorkflowStep[];
  tacitRules: TacitRule[];
  extractedAt: string;
};

export type WorkflowStep = {
  id: string;
  order: number;
  label: string;
  description: string;
  actor: Actor;
  systems: string[];
  judgmentRequired: boolean;
  evidenceIds: string[];
};

export type TacitRule = {
  id: string;
  rule: string;
  rationale: string;
  evidenceIds: string[];
  confidence: Confidence;
  category: "risk-judgment" | "prioritization" | "data-handling" | "escalation" | "output-quality";
};

export type FreshnessTag = "stale" | "incomplete" | "unreliable" | "access-restricted";

export type SystemNode = {
  id: string;
  name: string;
  kind: "system";
  owner: string;
  freshness: string;
  freshnessTags: FreshnessTag[];
  reliability: "high" | "medium" | "low";
  accessScope: string;
  knownGaps: string[];
};

export type PersonNode = {
  id: string;
  name: string;
  kind: "person";
  role: string;
};

export type ObjectNode = {
  id: string;
  name: string;
  kind: "object";
  description: string;
  sourceSystemIds: string[];
};

export type GraphNode = SystemNode | PersonNode | ObjectNode;

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
};

export type ContextGap = {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  owner: string;
  resolution: string;
  impactOnAgent: string;
  status: "open" | "in-progress" | "resolved";
};

export type OpportunityScore = {
  businessValue: number;
  aiSuitability: number;
  dataReadiness: number;
  executionFeasibility: number;
  evaluationReadiness: number;
  deploymentSafety: number;
  timeToValue: number;
};

export type OpportunityCandidate = {
  id: string;
  workflowName: string;
  oneLiner: string;
  scores: OpportunityScore;
  whyScoreNotes?: Partial<Record<keyof OpportunityScore, string>>;
  whyThisWorkflow?: string[];
  whyNotFullyAutonomous?: string;
  recommendedMaturity?: string;
  selected: boolean;
};

export type EvidenceRef = {
  id: string;
  interviewId: string;
  tacitRuleId?: string;
  label: string;
};

export type AgentSpecRule = {
  id: string;
  rule: string;
  evidence: EvidenceRef[];
};

export type AgentSpec = {
  id: string;
  version: number;
  name: string;
  objective: string;
  trigger: string;
  users: string[];
  environmentSystemIds: string[];
  inputs: string[];
  requiredOutputs: string[];
  allowedActions: string[];
  prohibitedActions: string[];
  approvalGates: string[];
  escalationRules: string[];
  rules: AgentSpecRule[];
  architecture: {
    integrations: string[];
    skills: { name: string; tools: string[] }[];
    subagents?: { name: string; scope: string }[];
  };
  changelog: string;
  createdAt: string;
};

export type Verifier = {
  id: string;
  name: string;
  description: string;
  type: VerifierType;
  scope: VerifierScope;
  weight: number;
  blocking: boolean;
  threshold: number;
};

export type EnvironmentFixture = {
  id: string;
  name: string;
  description: string;
  dataCondition: "complete" | "missing" | "stale" | "contradictory";
};

export type EvalCase = {
  id: string;
  name: string;
  task: string;
  environmentId: string;
  verifierIds: string[];
  tags: string[];
  difficulty: Difficulty;
  accountCondition:
    | "healthy"
    | "renewal-risk"
    | "expansion"
    | "major-escalation"
    | "low-usage"
    | "new-implementation";
  requestType: "qbr" | "renewal-meeting" | "executive-escalation" | "expansion-conversation";
};

export type VerifierResult = {
  verifierId: string;
  score: number;
  passed: boolean;
};

export type EvalResult = {
  evalCaseId: string;
  passed: boolean;
  verifierResults: VerifierResult[];
};

export type ExperimentConfig = {
  model: string;
  promptVersion: string;
  tools: string[];
  reasoning: "low" | "medium" | "high";
};

export type ExperimentStatus = "baseline" | "rejected" | "candidate" | "committed";

export type Experiment = {
  id: string;
  label: string;
  status: ExperimentStatus;
  agentVersion: number;
  config: ExperimentConfig;
  score: number;
  costPerTaskUsd: number;
  latencySeconds: number;
  evalSuiteVersion: string;
  casesEvaluated: number;
  runDate: string;
  verifierBreakdown: { verifierId: string; score: number }[];
  results: EvalResult[];
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
  passedPilotThreshold: boolean;
};

export type Failure = {
  id: string;
  evalCaseId: string;
  experimentId: string;
  title: string;
  taskDescription: string;
  observedBehavior: string;
  expectedBehavior: string;
  problem: string;
  rootCause: string;
  expertCorrection: string;
  remediation: string;
  action: "context-update" | "agent-spec-update" | "verifier-update";
  regressionAdded: boolean;
  status: "open" | "regression-added" | "resolved";
};

export type PilotChecklistItem = {
  id: string;
  category: "business" | "data" | "agent" | "evaluation" | "security";
  label: string;
  status: "done" | "pending" | "blocked";
  detail: string;
};

export type PilotDecision = {
  id: string;
  requiredActions: string[];
  checklist: PilotChecklistItem[];
};

export type Blocker = {
  id: string;
  title: string;
  description: string;
  verifierId?: string;
  failureId: string;
  owner: string;
  remediation: string;
  status: "open" | "resolved";
};

export type PilotWorkstream = {
  id: string;
  name: string;
  owner: string;
  status: "not-started" | "in-progress" | "blocked" | "done";
  nextMilestone: string;
  blockerIds: string[];
};

export type PilotMetric = {
  id: string;
  category: "business" | "quality" | "trust" | "operational" | "safety";
  label: string;
  target: string;
  status: "tracking" | "not-started";
};

export type RoiAssumptions = {
  briefsPerMonth: number;
  currentPrepHours: number;
  blendedHourlyCostUsd: number;
  targetTimeReductionPct: number;
  humanReviewMinutesRetained: number;
  agentRunCostUsd: number;
  implementationCostUsd: number;
};

export type RoiResult = {
  currentAnnualLaborCostUsd: number;
  projectedAnnualLaborCostUsd: number;
  annualGrossSavingsUsd: number;
  annualInferenceCostUsd: number;
  netYearOneSavingsUsd: number;
  paybackMonths: number;
};

export type ExecutiveReadout = {
  id: string;
  headline: string;
  recommendation: string;
  whyThisWorkflow: string[];
  pilotRequirements: string[];
  decisionsNeeded: string[];
  generatedAt: string;
};

export type EngagementStatus = "discover" | "specify" | "evaluate" | "pilot" | "improve";

export type Engagement = {
  id: string;
  companyName: string;
  companySize: string;
  businessFunction: string;
  useCase: string;
  objective: string;
  status: EngagementStatus;
  lastUpdated: string;
  qualityThreshold: number;
};

export type EngagementState = {
  engagement: Engagement;
  experts: Expert[];
  interviews: Interview[];
  systems: SystemNode[];
  people: PersonNode[];
  objects: ObjectNode[];
  edges: GraphEdge[];
  contextGaps: ContextGap[];
  opportunities: OpportunityCandidate[];
  agentSpecs: AgentSpec[];
  verifiers: Verifier[];
  environments: EnvironmentFixture[];
  evalCases: EvalCase[];
  experiments: Experiment[];
  failures: Failure[];
  blockers: Blocker[];
  pilotWorkstreams: PilotWorkstream[];
  pilotMetrics: PilotMetric[];
  pilotDecision: PilotDecision;
  roiAssumptions: RoiAssumptions;
  readout: ExecutiveReadout;
};
