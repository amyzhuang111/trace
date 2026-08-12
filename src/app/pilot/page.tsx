"use client";

import { useEngagementStore } from "@/store/useEngagementStore";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChecklistSection } from "@/components/pilot/ChecklistSection";
import { RoiCalculator } from "@/components/pilot/RoiCalculator";
import { Progress } from "@/components/ui/progress";
import { formatPct } from "@/lib/utils";
import { getPilotStatus } from "@/lib/derive/pilot";
import { PilotChecklistItem } from "@/types";

const CATEGORIES: PilotChecklistItem["category"][] = ["business", "data", "agent", "evaluation", "security"];

const RECOMMENDATION_LABEL: Record<string, string> = {
  go: "Go",
  "conditional-no-go": "Conditional No-Go",
  "no-go": "No-Go",
};

export default function PilotPage() {
  const state = useEngagementStore((s) => s);
  const { pilotDecision } = state;
  const status = getPilotStatus(state);

  return (
    <div>
      <PageHeader
        title="Pilot Readiness"
        description="A structured go / no-go checklist across business, data, agent, evaluation, and security readiness."
      />

      <Card className="mb-6">
        <CardHeader>
          <div>
            <CardTitle>Pilot Recommendation</CardTitle>
            <CardDescription>Evidence-based, not aspirational</CardDescription>
          </div>
          <Badge tone={status.recommendation === "go" ? "success" : "warning"} className="text-[13px] px-3 py-1">
            {RECOMMENDATION_LABEL[status.recommendation]}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex items-center gap-3">
            <span className="text-[12.5px] text-muted whitespace-nowrap">
              Current {formatPct(status.currentScore)} · Required {formatPct(status.requiredScore)}
            </span>
            <Progress
              value={status.currentScore}
              max={1}
              className="flex-1"
              markers={[{ at: status.requiredScore, label: "Required threshold" }]}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">Blocking Issues</div>
              <ul className="space-y-1">
                {status.openBlockers.map((b) => (
                  <li key={b.id} className="text-[12.5px] text-foreground before:mr-1.5 before:text-danger before:content-['●']">
                    <span className="font-medium">{b.title}:</span> {b.description}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">Required Actions</div>
              <ul className="space-y-1">
                {pilotDecision.requiredActions.map((a, i) => (
                  <li key={i} className="text-[12.5px] text-foreground before:mr-1.5 before:text-accent before:content-['→']">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Readiness Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-6">
            {CATEGORIES.map((cat) => (
              <ChecklistSection key={cat} category={cat} items={pilotDecision.checklist.filter((c) => c.category === cat)} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>ROI Model</CardTitle>
            <CardDescription>All assumptions are editable — the numbers recompute live</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <RoiCalculator />
        </CardContent>
      </Card>
    </div>
  );
}
