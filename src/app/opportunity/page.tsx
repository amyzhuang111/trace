"use client";

import { useEngagementStore } from "@/store/useEngagementStore";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OpportunityBarChart } from "@/components/charts/OpportunityBarChart";
import { OpportunityCandidateList } from "@/components/opportunity/OpportunityCandidateList";

export default function OpportunityPage() {
  const opportunities = useEngagementStore((s) => s.opportunities);
  const selected = opportunities.find((o) => o.selected) ?? opportunities[0];

  return (
    <div>
      <PageHeader
        title="Opportunity Assessment"
        description="Five candidate workflows were scored on the same criteria. Here's why this one was selected — and not a generic list of dozens of AI use cases."
      />

      <Card className="mb-4">
        <CardHeader>
          <div>
            <CardTitle>Candidate Opportunities, Ranked</CardTitle>
            <CardDescription>Scored 1–5 per dimension, higher is always better, sorted by total score</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <OpportunityCandidateList candidates={opportunities} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Scoring — {selected.workflowName}</CardTitle>
              <CardDescription>Each dimension scored 1–5, transparently</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <OpportunityBarChart scores={selected.scores} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Deployment Maturity</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge tone="accent" className="text-[13px] px-3 py-1">{selected.recommendedMaturity}</Badge>
            <p className="mt-3 text-[12.5px] text-muted leading-relaxed">
              <span className="font-medium text-foreground">Why not fully autonomous? </span>
              {selected.whyNotFullyAutonomous}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Why This Workflow?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px] text-foreground">
            {(selected.whyThisWorkflow ?? []).map((reason, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {reason}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
