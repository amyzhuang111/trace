import { EngagementState, Interview, WorkflowExtraction } from "@/types";
import { engagement } from "./engagement";
import { experts, interviews as rawInterviews } from "./experts";
import { workflowSteps, tacitRules } from "./workflow";
import { systems, people, objects, edges, contextGaps } from "./context";
import { opportunities } from "./opportunity";
import { agentSpecs } from "./agentSpec";
import { verifiers, environments, evalCases } from "./evals";
import { experiments } from "./experiments";
import { failures } from "./failures";
import { blockers } from "./blockers";
import { pilotWorkstreams } from "./workstreams";
import { pilotMetrics } from "./pilotMetrics";
import { roiAssumptions } from "./roi";
import { pilotDecision } from "./pilot";
import { readout } from "./readout";

function extractionFor(interviewId: string, extractedAt: string): WorkflowExtraction {
  return {
    steps: workflowSteps.filter((s) => s.evidenceIds.includes(interviewId)),
    tacitRules: tacitRules.filter((r) => r.evidenceIds.includes(interviewId)),
    extractedAt,
  };
}

const EXTRACTED_INTERVIEW_DATES: Record<string, string> = {
  "int-sam": "2026-07-16",
  "int-vp-cs": "2026-07-15",
  "int-support": "2026-07-21",
};

const interviews: Interview[] = rawInterviews.map((interview) => {
  const extractedAt = EXTRACTED_INTERVIEW_DATES[interview.id];
  if (!extractedAt) return interview;
  return { ...interview, extraction: extractionFor(interview.id, extractedAt) };
});

export function getInitialState(): EngagementState {
  return {
    engagement,
    experts,
    interviews,
    systems,
    people,
    objects,
    edges,
    contextGaps,
    opportunities,
    agentSpecs,
    verifiers,
    environments,
    evalCases,
    experiments,
    failures,
    blockers,
    pilotWorkstreams,
    pilotMetrics,
    pilotDecision,
    roiAssumptions,
    readout,
  };
}
