"use client";

import { useEngagementStore } from "@/store/useEngagementStore";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { computeRoi } from "@/lib/scoring/roi";
import { getPilotStatus } from "@/lib/derive/pilot";
import { buildCurrentPerformanceSummary, buildEconomicsSummary, buildKeyFailureModes } from "@/lib/derive/readout";
import { buildReadoutMarkdown, downloadMarkdown } from "@/lib/export/markdown";
import { formatPct, formatUsd } from "@/lib/utils";
import { Download } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-[13px] text-foreground">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function ReadoutPage() {
  const state = useEngagementStore((s) => s);
  const { readout, roiAssumptions, engagement } = state;
  const roi = computeRoi(roiAssumptions);
  const status = getPilotStatus(state);
  const currentPerformanceSummary = buildCurrentPerformanceSummary(state);
  const economicsSummary = buildEconomicsSummary(state);
  const keyFailureModes = buildKeyFailureModes(state);

  function handleExport() {
    const md = buildReadoutMarkdown(state);
    downloadMarkdown(`trace-readout-${engagement.companyName.toLowerCase().replace(/\s+/g, "-")}.md`, md);
  }

  return (
    <div>
      <PageHeader
        title="Executive Readout"
        description="A one-page engagement memo — the artifact an enterprise AI engagement ships to a customer executive."
        actions={
          <Button variant="primary" size="sm" onClick={handleExport}>
            <Download size={13} /> Export Markdown
          </Button>
        }
      />

      <Card className="mb-6">
        <CardContent className="pt-4">
          <div className="text-[15px] font-semibold text-foreground">{readout.headline}</div>
          <p className="mt-2 text-[13.5px] leading-relaxed text-foreground">{readout.recommendation}</p>
        </CardContent>
      </Card>

      <Section title="Why This Workflow">
        <BulletList items={readout.whyThisWorkflow} />
      </Section>

      <Section title="Current Performance">
        <div className="mb-2 text-[12.5px] text-muted">
          Current <span className="font-semibold text-foreground">{formatPct(status.currentScore)}</span> · Required{" "}
          <span className="font-semibold text-foreground">{formatPct(status.requiredScore)}</span>
        </div>
        <p className="text-[13px] leading-relaxed text-foreground">{currentPerformanceSummary}</p>
      </Section>

      <Section title="Economics">
        <p className="mb-3 text-[13px] leading-relaxed text-foreground">{economicsSummary}</p>
        <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-[12.5px]">
          <EconRow label="Current annual labor cost" value={formatUsd(roi.currentAnnualLaborCostUsd)} />
          <EconRow label="Projected annual labor cost" value={formatUsd(roi.projectedAnnualLaborCostUsd)} />
          <EconRow label="Gross annual savings" value={formatUsd(roi.annualGrossSavingsUsd)} />
          <EconRow label="Annual inference cost" value={formatUsd(roi.annualInferenceCostUsd)} />
          <EconRow label="Net year-one savings" value={formatUsd(roi.netYearOneSavingsUsd)} />
          <EconRow
            label="Payback period"
            value={Number.isFinite(roi.paybackMonths) ? `${roi.paybackMonths.toFixed(1)} months` : "—"}
          />
        </div>
      </Section>

      <Section title="Key Failure Modes">
        <BulletList items={keyFailureModes} />
      </Section>

      <div className="grid grid-cols-2 gap-6">
        <Section title="Pilot Requirements">
          <BulletList items={readout.pilotRequirements} />
        </Section>
        <Section title="Decisions Needed">
          <BulletList items={readout.decisionsNeeded} />
        </Section>
      </div>
    </div>
  );
}

function EconRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border px-2.5 py-2">
      <span className="text-muted">{label}</span>
      <span className="font-semibold tabular-nums text-foreground">{value}</span>
    </div>
  );
}
