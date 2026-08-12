"use client";

import Link from "next/link";
import { useEngagementStore } from "@/store/useEngagementStore";
import { StatCard } from "@/components/common/StatCard";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPct } from "@/lib/utils";
import { getPilotStatus } from "@/lib/derive/pilot";
import { ArrowRight, CircleDot } from "lucide-react";

const TIMELINE = [
  { key: "discover", label: "Discover" },
  { key: "specify", label: "Specify" },
  { key: "evaluate", label: "Evaluate" },
  { key: "pilot", label: "Pilot" },
  { key: "improve", label: "Improve" },
];

const RECOMMENDATION_LABEL: Record<string, string> = {
  go: "Pilot-ready",
  "conditional-no-go": "Not yet pilot-ready",
  "no-go": "Not pilot-ready",
};

export default function OverviewPage() {
  const state = useEngagementStore((s) => s);
  const { engagement, interviews, contextGaps, evalCases, verifiers } = state;
  const status = getPilotStatus(state);

  const extractedInterviews = interviews.filter((i) => i.extraction);
  const mappedStepIds = new Set(extractedInterviews.flatMap((i) => i.extraction!.steps.map((s) => s.id)));
  const openGaps = contextGaps.filter((g) => g.status === "open");
  const prioritizationVerifier = verifiers.find((v) => v.id === "ver-strategic-prioritization");
  const prioritizationScore = status.committed.verifierBreakdown.find((v) => v.verifierId === "ver-strategic-prioritization")?.score ?? 0;

  const currentStageIndex = TIMELINE.findIndex((t) => t.key === engagement.status);

  return (
    <div>
      <PageHeader
        title="Engagement Overview"
        description={engagement.objective}
      />

      <div className="grid grid-cols-4 gap-3 mb-6 lg:grid-cols-7">
        <StatCard label="Expert Interviews" value={String(interviews.length)} sublabel="completed" />
        <StatCard label="Workflow Steps" value={String(mappedStepIds.size)} sublabel="mapped" />
        <StatCard
          label="Context Gaps"
          value={`${openGaps.length}`}
          sublabel={`open of ${contextGaps.length} identified`}
          tone={openGaps.length > 0 ? "warning" : "success"}
        />
        <StatCard label="Eval Tasks" value={String(evalCases.length)} sublabel="authored" />
        <StatCard
          label="Committed Eval Score"
          value={formatPct(status.currentScore)}
          sublabel={status.committed.label}
          tone={status.ready ? "success" : "warning"}
        />
        <StatCard label="Quality Threshold" value={formatPct(status.requiredScore)} sublabel={`${formatPct(status.scoreGap, 0)} gap remaining`} />
        <StatCard
          label="Pilot Blockers"
          value={String(status.openBlockers.length)}
          sublabel="must clear before pilot"
          tone={status.openBlockers.length > 0 ? "danger" : "success"}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Current Recommendation</CardTitle>
              <CardDescription>Based on the committed configuration&apos;s latest full-suite run</CardDescription>
            </div>
            <Badge tone={status.recommendation === "go" ? "success" : "warning"}>
              {RECOMMENDATION_LABEL[status.recommendation]}
            </Badge>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-[13px] text-foreground">
              <li className="flex gap-2">
                <CircleDot size={14} className="mt-0.5 shrink-0 text-success" />
                Source grounding is strong ({formatPct(status.committed.verifierBreakdown.find((v) => v.verifierId === "ver-source-grounding")?.score ?? 0)}).
              </li>
              {prioritizationVerifier && (
                <li className="flex gap-2">
                  <CircleDot size={14} className="mt-0.5 shrink-0 text-warning" />
                  Executive prioritization remains inconsistent ({formatPct(prioritizationScore)} vs. {formatPct(prioritizationVerifier.threshold)} bar).
                </li>
              )}
              {status.openBlockers.map((b) => (
                <li key={b.id} className="flex gap-2">
                  <CircleDot size={14} className="mt-0.5 shrink-0 text-danger" />
                  {b.description}
                </li>
              ))}
              {!status.ready && (
                <li className="flex gap-2">
                  <CircleDot size={14} className="mt-0.5 shrink-0 text-danger" />
                  Performance remains below the {formatPct(status.requiredScore)} release threshold.
                </li>
              )}
            </ul>
            <div className="mt-4 flex gap-2">
              <Link href="/pilot" className="inline-flex items-center gap-1 text-[12.5px] font-medium text-accent hover:underline">
                View full pilot readiness <ArrowRight size={13} />
              </Link>
              <span className="text-border-strong">·</span>
              <Link href="/experiments" className="inline-flex items-center gap-1 text-[12.5px] font-medium text-accent hover:underline">
                Compare experiments <ArrowRight size={13} />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-0">
              {TIMELINE.map((stage, i) => {
                const done = i < currentStageIndex;
                const active = i === currentStageIndex;
                return (
                  <li key={stage.key} className="flex items-start gap-3 pb-4 last:pb-0 relative">
                    {i < TIMELINE.length - 1 && (
                      <span className="absolute left-[7px] top-4 h-full w-px bg-border" />
                    )}
                    <span
                      className={
                        "z-10 mt-0.5 h-[15px] w-[15px] shrink-0 rounded-full border-2 " +
                        (active
                          ? "border-accent bg-accent-soft"
                          : done
                          ? "border-success bg-success"
                          : "border-border-strong bg-surface")
                      }
                    />
                    <div className="text-[13px]">
                      <div className={active ? "font-semibold text-foreground" : done ? "text-foreground" : "text-muted"}>
                        {stage.label}
                      </div>
                      {active && <div className="text-[12px] text-muted mt-0.5">Current stage</div>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <div>
            <CardTitle>The Core Flow</CardTitle>
            <CardDescription>How this engagement moves from tacit knowledge to a deployment decision</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
            {[
              ["Interview an expert", "/discovery"],
              ["Extract the workflow", "/discovery"],
              ["Map systems + judgment", "/context"],
              ["Score the opportunity", "/opportunity"],
              ["Generate the agent spec", "/agent-spec"],
              ["Convert standards to evals", "/evals"],
              ["Run model experiments", "/experiments"],
              ["Compare quality × cost × latency", "/experiments"],
              ["Decide pilot readiness", "/pilot"],
              ["Turn failures into eval cases", "/failures"],
            ].map(([label, href], i, arr) => (
              <span key={label} className="flex items-center gap-2">
                <Link href={href} className="rounded-full border border-border-strong bg-black/[0.02] px-2.5 py-1 text-foreground hover:border-accent hover:text-accent transition-colors">
                  {label}
                </Link>
                {i < arr.length - 1 && <ArrowRight size={12} className="text-muted-2 shrink-0" />}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
