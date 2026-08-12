import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Tag = "fact" | "inference" | "fiction";

const TAG_META: Record<Tag, { label: string; tone: "success" | "accent" | "warning" }> = {
  fact: { label: "Public Fact", tone: "success" },
  inference: { label: "Project Inference", tone: "accent" },
  fiction: { label: "Fictional Demo Data", tone: "warning" },
};

function Item({ tag, children }: { tag: Tag; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 rounded-md border border-border bg-surface px-3 py-2.5">
      <Badge tone={TAG_META[tag].tone} className="mt-0.5 shrink-0">{TAG_META[tag].label}</Badge>
      <span className="text-[13px] text-foreground leading-relaxed">{children}</span>
    </li>
  );
}

const SOURCES = [
  ["Mercor Enterprise AI", "https://www.mercor.com/enterprise/"],
  ["Introducing Mercor Enterprise AI", "https://www.mercor.com/blog/introducing-mercor-enterprise-ai/"],
  ["Mercor Enterprise Evals", "https://www.mercor.com/enterprise-evals/"],
  ["Agent Eval Systems", "https://www.mercor.com/blog/agent-eval-systems/"],
  ["Mercor APEX", "https://www.mercor.com/apex/"],
  ["APEX-Accounting", "https://www.mercor.com/apex/apex-accounting-leaderboard/"],
  ["APEX-SWE", "https://www.mercor.com/apex/apex-swe-leaderboard/"],
  ["Introducing APEX-Agents", "https://www.mercor.com/blog/introducing-apex-agents/"],
  ["Mercor to acquire Deeptune", "https://www.mercor.com/blog/mercor-to-acquire-deeptune/"],
  ["Mercor AI Due Diligence Framework", "https://www.mercor.com/blog/ai-due-diligence-framework/"],
  ["Mercor AI Due Diligence Case Study", "https://www.mercor.com/blog/ai-due-diligence-case-study/"],
  ["Mercor Data", "https://www.mercor.com/data/"],
];

export default function ResearchPage() {
  return (
    <div>
      <PageHeader
        title="Research Notes"
        description="Trace is an independent portfolio project informed by publicly documented enterprise-AI workflows. No Mercor branding, and no fictional data is ever presented as real."
      />

      <Card className="mb-4">
        <CardHeader>
          <div>
            <CardTitle>Mercor Enterprise Lifecycle</CardTitle>
            <CardDescription>Publicly described four-stage model this project&apos;s information architecture follows</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <Item tag="fact">
              Mercor publicly describes its enterprise offering as a four-stage lifecycle: Discover (Agent Diagnostics) → Deploy
              (Agent Deployment) → Improve (Agent Optimization) → Monetize (Data Monetization).
            </Item>
            <Item tag="inference">
              Trace&apos;s own navigation and workflow (Discovery → Agent Spec → Eval Suite → Experiments → Pilot → Failures) is
              this project&apos;s interpretation of that lifecycle applied to one concrete use case, not a reproduction of Mercor&apos;s
              internal tooling.
            </Item>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <div>
            <CardTitle>Enterprise Evaluation Philosophy</CardTitle>
            <CardDescription>Evals as specification, not a scoreboard</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <Item tag="fact">
              Mercor explicitly frames evaluations as the effective product specification for agents, built from tasks,
              realistic environments, and verifiers — deterministic, LLM-judged, and agent/trajectory-based.
            </Item>
            <Item tag="fact">
              After its announced acquisition of Deeptune, Mercor&apos;s public framing emphasizes realistic training/evaluation
              environments — the Environment / Task / Verifier mental model used throughout this project.
            </Item>
            <Item tag="inference">
              The specific verifier set, weights, and thresholds on the Eval Suite page are this project&apos;s construction —
              illustrative of the pattern, not copied from an actual Mercor customer eval suite.
            </Item>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Public Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <Item tag="fact">
              Ramp — Mercor publicly features Ramp in its Enterprise Evals material: finance-agent evaluation, expense /
              accounting / approval workflows, 160 expert-built tasks, a six-week build, and a reported 3× faster model
              iteration. Mercor also built APEX-Accounting in partnership with Ramp.
            </Item>
            <Item tag="fact">
              Cognition — Mercor publicly features Cognition in its Enterprise Evals material: coding-agent evaluation over
              real pull requests, bug fixes, and refactors; 200 expert-built tasks; a five-week reusable benchmark; a reported
              2× faster model iteration. Mercor also built APEX-SWE in partnership with Cognition.
            </Item>
            <Item tag="fact">
              An anonymous private-equity engagement reports $7–9M upside run-rate savings identified via workflow mapping,
              benchmarked models on company data, and an implementation roadmap. A related published due-diligence case study
              (market-intelligence target) reports ~$4M net value realizable within six months and ~$20M annual run-rate
              impact by 2031.
            </Item>
            <Item tag="fact">
              An anonymous technology engagement reports a 50%+ reduction in median time-to-mitigation from an AI
              incident-response agent evaluated against historical incidents with engineer-defined success criteria.
            </Item>
            <Item tag="fact">
              Mercor&apos;s own customer support system is publicly described as handling roughly 12,000 requests/week, evaluating
              every response against company policy and converting failures into improvement signals.
            </Item>
            <Item tag="inference">
              Box collaborated with Mercor on the realism of file-system environments used in APEX-Agents; Harvey AI gave
              early feedback on APEX-Agents corporate-law environment design. Neither is described as a confirmed Mercor
              Enterprise deployment customer from these collaborations alone.
            </Item>
            <Item tag="inference">
              Mercor&apos;s association with frontier AI labs (OpenAI, Anthropic, Google, Meta) is primarily tied to its expert
              network, post-training, human-data, and model-evaluation business — not automatically evidence of an Enterprise
              deployment relationship.
            </Item>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <div>
            <CardTitle>Fictional Demo Data</CardTitle>
            <CardDescription>Everything below is invented for this portfolio project</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <Item tag="fiction">
              Meridian Systems, all five interview subjects, every transcript, every named customer account (Atlas Health,
              Northwind Corp, Solace Health, and others), every failure case, experiment result, and dollar figure in the ROI
              model are entirely fictional and constructed for this demo. None of it represents a real Mercor customer,
              engagement, or dataset.
            </Item>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Public Research Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-2 gap-1.5">
            {SOURCES.map(([label, url]) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer" className="text-[12.5px] text-accent hover:underline">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
