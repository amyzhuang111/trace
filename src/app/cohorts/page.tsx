"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RetentionCurve } from "@/components/charts/RetentionCurve";
import { CohortRetentionHeatmap } from "@/components/charts/CohortRetentionHeatmap";
import { CohortComparison } from "@/components/analysis/CohortComparison";
import { cohortSeries, cohortEconomics, cohortDiffs, cohortDivergenceExplanation } from "@/lib/mock-data/cohorts";
import { CHANNEL_COLORS } from "@/lib/chartPalette";
import { cn } from "@/lib/utils";
import { AcquisitionChannel } from "@/types";

const CHANNELS: AcquisitionChannel[] = ["Paid Social", "Paid Search", "Organic", "Referral"];

export default function CohortsPage() {
  const [channel, setChannel] = useState<AcquisitionChannel>("Paid Social");
  const [explained, setExplained] = useState(false);

  const rows = useMemo(() => cohortEconomics.filter((r) => r.channel === channel), [channel]);

  return (
    <div>
      <PageHeader
        title="Cohorts"
        description="Deep cohort diagnostics — retention by cohort month and channel, unit economics, and what separates a strong cohort from a weak one."
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-[11.5px] font-medium text-muted-2">Acquisition channel</span>
        {CHANNELS.map((c) => (
          <button
            key={c}
            onClick={() => setChannel(c)}
            className={cn(
              "flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-[11.5px] font-medium transition-colors",
              channel === c ? "border-accent bg-accent-soft text-accent" : "border-border text-muted hover:border-border-strong",
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: CHANNEL_COLORS[c] }} />
            {c}
          </button>
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Retention heatmap — {channel}</CardTitle>
        </CardHeader>
        <CardContent>
          <CohortRetentionHeatmap rows={cohortEconomics} channel={channel} />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cohort curve — 30-day repeat, all channels</CardTitle>
        </CardHeader>
        <CardContent>
          <RetentionCurve series={cohortSeries} highlightChannel={channel} />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cohort economics — {channel}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cohort month</TableHead>
                <TableHead className="text-right">Customers</TableHead>
                <TableHead className="text-right">CAC</TableHead>
                <TableHead className="text-right">First-order revenue</TableHead>
                <TableHead className="text-right">Day-30 repeat</TableHead>
                <TableHead className="text-right">Day-60 repeat</TableHead>
                <TableHead className="text-right">p180 LTV</TableHead>
                <TableHead className="text-right">Contribution</TableHead>
                <TableHead className="text-right">Payback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.cohortMonth}>
                  <TableCell className="font-medium">{r.cohortMonth}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.customers.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.cac > 0 ? `$${r.cac}` : "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">${r.firstOrderRevenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.day30Repeat}%</TableCell>
                  <TableCell className="text-right tabular-nums">{r.day60Repeat}%</TableCell>
                  <TableCell className="text-right tabular-nums">${r.p180Ltv}</TableCell>
                  <TableCell className="text-right tabular-nums">${r.contributionMargin}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.paybackDays > 0 ? `${r.paybackDays}d` : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[13.5px] font-semibold text-foreground">Why did these cohorts diverge?</h2>
          {!explained && (
            <Button size="sm" variant="secondary" onClick={() => setExplained(true)}>
              <Sparkles size={12} />
              Ask Hilbert why these cohorts diverged
            </Button>
          )}
        </div>
        <CohortComparison diff={cohortDiffs[0]} explanation={explained ? cohortDivergenceExplanation : undefined} />
      </div>
    </div>
  );
}
