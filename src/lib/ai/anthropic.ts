import { AIProvider } from "./provider";
import { WorkflowExtraction } from "@/types";
import { mockProvider } from "./mock";

const EXTRACTION_SYSTEM_PROMPT = `You extract structured workflow knowledge from an expert interview transcript for an enterprise AI agent project.
Return ONLY valid JSON matching this shape, no prose, no markdown fences:
{
  "steps": [{ "id": string, "order": number, "label": string, "description": string, "actor": "human", "systems": string[], "judgmentRequired": boolean, "evidenceIds": [] }],
  "tacitRules": [{ "id": string, "rule": string, "rationale": string, "evidenceIds": [], "confidence": "high"|"medium"|"low", "category": "risk-judgment"|"prioritization"|"data-handling"|"escalation"|"output-quality" }]
}
Identify concrete process steps as "steps" and undocumented judgment calls / heuristics as "tacitRules".`;

async function callAnthropic(apiKey: string, transcript: string): Promise<WorkflowExtraction> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 2048,
      system: EXTRACTION_SYSTEM_PROMPT,
      messages: [{ role: "user", content: transcript }],
    }),
  });

  if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`);
  const data = await res.json();
  const text = data?.content?.[0]?.text ?? "{}";
  const parsed = JSON.parse(text);
  return {
    steps: parsed.steps ?? [],
    tacitRules: parsed.tacitRules ?? [],
    extractedAt: "generated",
  };
}

export function createAnthropicProvider(apiKey: string): AIProvider {
  return {
    name: "anthropic",
    async extractWorkflow(transcript) {
      try {
        return await callAnthropic(apiKey, transcript);
      } catch {
        return mockProvider.extractWorkflow(transcript);
      }
    },
    generateAgentSpec: mockProvider.generateAgentSpec,
    generateEvalCases: mockProvider.generateEvalCases,
    judgeOutput: mockProvider.judgeOutput,
    generateReadout: mockProvider.generateReadout,
  };
}
