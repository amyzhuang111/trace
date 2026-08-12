import { NextRequest, NextResponse } from "next/server";
import { mockProvider } from "@/lib/ai/mock";
import { createAnthropicProvider } from "@/lib/ai/anthropic";
import { createOpenAIProvider } from "@/lib/ai/openai";
import { AIProvider } from "@/lib/ai/provider";

function resolveProvider(): AIProvider {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  if (anthropicKey) return createAnthropicProvider(anthropicKey);
  if (openaiKey) return createOpenAIProvider(openaiKey);
  return mockProvider;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, payload } = body ?? {};
  const provider = resolveProvider();

  try {
    switch (action) {
      case "extractWorkflow":
        return NextResponse.json({
          provider: provider.name,
          result: await provider.extractWorkflow(payload.transcript),
        });
      case "generateAgentSpec":
        return NextResponse.json({
          provider: provider.name,
          result: await provider.generateAgentSpec(payload),
        });
      case "generateEvalCases":
        return NextResponse.json({
          provider: provider.name,
          result: await provider.generateEvalCases(payload.spec, payload.count),
        });
      case "generateReadout":
        return NextResponse.json({
          provider: provider.name,
          result: await provider.generateReadout(payload.state),
        });
      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
