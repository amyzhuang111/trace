import { AgentSpec, EngagementState, WorkflowExtraction } from "@/types";

async function callAiRoute<T>(action: string, payload: unknown): Promise<{ provider: string; result: T }> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });
  if (!res.ok) throw new Error(`AI route error: ${res.status}`);
  return res.json();
}

export function extractWorkflow(transcript: string) {
  return callAiRoute<WorkflowExtraction>("extractWorkflow", { transcript });
}

export function generateAgentSpec(context: { transcript: string; existingSpec?: AgentSpec }) {
  return callAiRoute<Partial<AgentSpec>>("generateAgentSpec", context);
}

export function generateReadoutText(state: EngagementState) {
  return callAiRoute<string>("generateReadout", { state });
}
