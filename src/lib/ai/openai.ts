import { AIProvider } from "./provider";
import { WorkflowExtraction } from "@/types";
import { mockProvider } from "./mock";

const EXTRACTION_SYSTEM_PROMPT = `You extract structured workflow knowledge from an expert interview transcript for an enterprise AI agent project.
Return ONLY valid JSON matching this shape, no prose:
{
  "steps": [{ "id": string, "order": number, "label": string, "description": string, "actor": "human", "systems": string[], "judgmentRequired": boolean, "evidenceIds": [] }],
  "tacitRules": [{ "id": string, "rule": string, "rationale": string, "evidenceIds": [], "confidence": "high"|"medium"|"low", "category": "risk-judgment"|"prioritization"|"data-handling"|"escalation"|"output-quality" }]
}
Identify concrete process steps as "steps" and undocumented judgment calls / heuristics as "tacitRules".`;

async function callOpenAI(apiKey: string, transcript: string): Promise<WorkflowExtraction> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
        { role: "user", content: transcript },
      ],
    }),
  });

  if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(text);
  return {
    steps: parsed.steps ?? [],
    tacitRules: parsed.tacitRules ?? [],
    extractedAt: "generated",
  };
}

export function createOpenAIProvider(apiKey: string): AIProvider {
  return {
    name: "openai",
    async extractWorkflow(transcript) {
      try {
        return await callOpenAI(apiKey, transcript);
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
