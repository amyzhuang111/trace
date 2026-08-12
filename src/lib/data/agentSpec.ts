import { AgentSpec, AgentSpecRule } from "@/types";

const ev = (interviewId: string, label: string, tacitRuleId?: string) => ({
  id: `${interviewId}-${tacitRuleId ?? "note"}`,
  interviewId,
  tacitRuleId,
  label,
});

const ruleUsageContext: AgentSpecRule = {
  id: "asr-usage-context",
  rule: "Do not classify usage decline as renewal risk without accounting for rollout stage, seasonality, or baseline.",
  evidence: [ev("int-sam", "Senior Strategic Account Manager Interview → Tacit Rule: usage decline severity is contextual", "tr-01")],
};

const rulePrioritize: AgentSpecRule = {
  id: "asr-prioritize",
  rule: "Select the top three most decision-relevant findings; do not exhaustively report all available data.",
  evidence: [ev("int-sam", "Senior Strategic Account Manager Interview → Tacit Rule: executive output should prioritize, not summarize", "tr-03")],
};

const ruleSupportSeverity: AgentSpecRule = {
  id: "asr-support-severity",
  rule: "Weight support risk by unresolved severity and issue repetition, not raw ticket count.",
  evidence: [ev("int-support", "Support Operations Lead Interview → Tacit Rule: ticket volume is a weaker signal than issue severity", "tr-02")],
};

const ruleConflict: AgentSpecRule = {
  id: "asr-conflict",
  rule: "When source systems disagree, flag the conflict explicitly instead of silently choosing one.",
  evidence: [ev("int-vp-cs", "VP Customer Success Interview → Tacit Rule: conflicting evidence must be flagged, not silently resolved", "tr-04")],
};

const ruleSponsor: AgentSpecRule = {
  id: "asr-sponsor",
  rule: "Treat executive sponsor changes as a required risk signal whenever detected.",
  evidence: [ev("int-vp-cs", "VP Customer Success Interview → Tacit Rule: executive sponsor turnover is a high-signal renewal risk", "tr-06")],
};

const ruleNewImplementation: AgentSpecRule = {
  id: "asr-new-implementation",
  rule: "Do not apply usage-based risk scoring to accounts within 60 days of go-live.",
  evidence: [ev("int-csm", "Enterprise CSM Interview → Tacit Rule: low usage in the first 60 days is expected, not risk", "tr-09")],
};

const ruleEscalation: AgentSpecRule = {
  id: "asr-escalation",
  rule: "Escalate to human review immediately if an executive sponsor has been pulled into a support escalation.",
  evidence: [ev("int-support", "Support Operations Lead Interview → Tacit Rule: executive-level support escalations should always trigger human review", "tr-12")],
};

const ruleExpansionCorroboration: AgentSpecRule = {
  id: "asr-expansion-corroboration",
  rule: "Require corroboration across usage and CSM notes before surfacing an expansion opportunity.",
  evidence: [ev("int-csm", "Enterprise CSM Interview → Tacit Rule: expansion signals should be corroborated before being surfaced", "tr-15")],
};

const baseFields = {
  name: "Executive Account Brief Agent",
  objective: "Produce a concise, evidence-grounded executive account brief before a senior customer meeting.",
  trigger: "User requests a brief for a named account and meeting.",
  users: ["Strategic Account Managers", "Customer Success leaders", "Sales executives"],
  environmentSystemIds: ["sys-salesforce", "sys-zendesk", "sys-analytics", "sys-drive", "sys-notes"],
  inputs: ["Account ID", "Meeting date", "Meeting objective", "Optional user instructions"],
  requiredOutputs: [
    "Executive summary",
    "Top 3 strategic risks",
    "Top 3 expansion opportunities",
    "Recent unresolved issues",
    "Recommended meeting actions",
    "Source citations",
  ],
  allowedActions: ["Retrieve information", "Reconcile sources", "Calculate trends", "Summarize", "Rank risks", "Draft brief"],
  prohibitedActions: [
    "Modify Salesforce",
    "Contact the customer",
    "Close support tickets",
    "Change account health status",
    "Create opportunities",
    "State unsupported facts",
  ],
  approvalGates: ["A human must approve the final brief before it is shared with an executive."],
  architecture: {
    integrations: ["Salesforce", "Zendesk", "Product Analytics", "Google Drive", "Meeting Notes Repository"],
    skills: [
      { name: "Account-context retrieval", tools: ["Salesforce", "Google Drive"] },
      { name: "Usage analysis", tools: ["Product Analytics"] },
      { name: "Support-risk analysis", tools: ["Zendesk"] },
      { name: "Expansion-signal analysis", tools: ["Product Analytics", "Meeting Notes Repository"] },
      { name: "Contradiction detection", tools: ["Salesforce", "Zendesk", "Meeting Notes Repository"] },
      { name: "Evidence grounding", tools: ["Salesforce", "Zendesk", "Product Analytics", "Meeting Notes Repository"] },
      { name: "Strategic prioritization", tools: [] },
      { name: "Executive summarization", tools: [] },
    ],
  },
};

export const agentSpecs: AgentSpec[] = [
  {
    id: "spec-v1",
    version: 1,
    ...baseFields,
    escalationRules: ["Escalate when required source data is missing."],
    rules: [ruleUsageContext, rulePrioritize],
    changelog: "Initial draft, based solely on the Senior Strategic Account Manager interview.",
    createdAt: "2026-07-18",
  },
  {
    id: "spec-v2",
    version: 2,
    ...baseFields,
    escalationRules: [
      "Escalate when required source data is missing.",
      "Escalate when core systems disagree on a material fact.",
    ],
    rules: [ruleUsageContext, rulePrioritize, ruleSupportSeverity, ruleConflict],
    changelog: "Added contradiction-handling and support-severity rules after the Support Operations and VP Customer Success interviews.",
    createdAt: "2026-07-25",
  },
  {
    id: "spec-v3",
    version: 3,
    ...baseFields,
    escalationRules: [
      "Escalate when required source data is missing.",
      "Escalate when core systems disagree on a material fact.",
      "Escalate when a high-severity customer issue lacks a recent status update.",
    ],
    rules: [ruleUsageContext, rulePrioritize, ruleSupportSeverity, ruleConflict, ruleSponsor, ruleNewImplementation],
    changelog: "Added sponsor-change and new-implementation exemption rules following the Atlas Health and Bramwell Foods failure reviews.",
    createdAt: "2026-08-02",
  },
  {
    id: "spec-v4",
    version: 4,
    ...baseFields,
    escalationRules: [
      "Escalate when core systems disagree.",
      "Escalate when required source data is missing.",
      "Escalate when a high-severity customer issue lacks a recent status update.",
      "Escalate when confidence on a top-3 recommendation is below threshold.",
    ],
    rules: [
      ruleUsageContext,
      rulePrioritize,
      ruleSupportSeverity,
      ruleConflict,
      ruleSponsor,
      ruleNewImplementation,
      ruleEscalation,
      ruleExpansionCorroboration,
    ],
    changelog: "Added executive-escalation and expansion-corroboration rules. Current version under active evaluation.",
    createdAt: "2026-08-08",
  },
];

export const currentAgentSpec = agentSpecs[agentSpecs.length - 1];
