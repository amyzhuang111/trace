"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OperatorStatusBadge } from "@/components/operator/OperatorStatusBadge";
import { HilbertConfidenceBadge } from "@/components/analysis/ConfidenceBadge";
import { useHilbertStore } from "@/store/useHilbertStore";
import { customerMoments } from "@/lib/mock-data/readout";
import { formatUsd } from "@/lib/utils";

export default function OperatorHome() {
  const investigations = useHilbertStore((s) => s.investigations);
  const productFeedback = useHilbertStore((s) => s.productFeedback);

  const revenueAtRisk = investigations
    .filter((i) => ["testing", "new", "waiting_for_data"].includes(i.operatorStatus))
    .reduce((sum, i) => sum + i.economicImpact, 0);
  const validatedUpside = investigations
    .filter((i) => i.operatorStatus === "validated" || i.operatorStatus === "ready_for_customer")
    .reduce((sum, i) => sum + i.economicImpact, 0);
  const openInvestigations = investigations.filter((i) =>
    ["new", "testing", "waiting_for_data"].includes(i.operatorStatus),
  ).length;
  const openFeedback = productFeedback.filter((f) => f.status === "open").length;

  const reasoningChecks = investigations.filter((i) => i.operatorNote);

  return (
    <div>
      <PageHeader title="Northstar Market" description="Growth operator workspace · Updated 11 min ago" />

      <Card className="mb-6">
        <CardContent className="py-5">
          <h2 className="text-[15px] font-semibold text-foreground">{openInvestigations} findings need judgment</h2>
          <p className="mt-1.5 max-w-3xl text-[13px] leading-relaxed text-muted">
            Topline remains healthy, but Hilbert detected a material deterioration in the newest paid-acquisition
            cohorts. AOV is masking weaker repeat behavior. Two additional opportunities are ready for validation,
            and {openFeedback} product-feedback item{openFeedback === 1 ? "" : "s"} remain{openFeedback === 1 ? "s" : ""} unresolved.
          </p>
          <div className="mt-5 grid grid-cols-4 gap-3">
            <StatCard label="Revenue at risk" value={formatUsd(revenueAtRisk)} tone="danger" />
            <StatCard label="Validated upside" value={formatUsd(validatedUpside)} tone="success" />
            <StatCard label="Open investigations" value={String(openInvestigations)} />
            <StatCard label="Product feedback" value={`${openFeedback} open`} tone={openFeedback > 0 ? "warning" : "neutral"} />
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="mb-3 text-[13.5px] font-semibold text-foreground">Investigation queue</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Finding</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Economic impact</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next step</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {investigations.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="max-w-[280px]">
                    <Link href={`/investigations/${inv.slug}`} className="font-medium hover:text-accent">
                      {inv.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted">{inv.category}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {inv.economicImpact > 0 ? formatUsd(inv.economicImpact) : "—"}
                  </TableCell>
                  <TableCell>
                    <HilbertConfidenceBadge pct={inv.hilbertConfidence} />
                  </TableCell>
                  <TableCell>
                    <OperatorStatusBadge status={inv.operatorStatus} />
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate text-muted">
                    {inv.validationChecks.some((c) => !c.completed)
                      ? "Complete remaining validation checks"
                      : inv.operatorStatus === "ready_for_customer"
                        ? "Add to customer readout"
                        : "Review evidence"}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/investigations/${inv.slug}`}
                      className="flex items-center gap-1 text-[12px] font-medium text-accent hover:underline"
                    >
                      Open investigation <ArrowRight size={12} />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <h2 className="mb-3 text-[13.5px] font-semibold text-foreground">Customer moments</h2>
          <div className="flex flex-col gap-3">
            {customerMoments.map((m) => (
              <Card key={m.title} className="p-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] font-medium text-foreground">{m.title}</span>
                  <span className="text-[11.5px] text-muted-2">{m.when}</span>
                </div>
                <p className="mt-1.5 text-[12px] text-muted">
                  <span className="font-medium text-foreground">Needs ready:</span> {m.needsReady}
                </p>
                <p className="mt-0.5 text-[12px] text-muted">
                  <span className="font-medium text-foreground">Outstanding:</span> {m.outstandingAnalysis}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-[13.5px] font-semibold text-foreground">Hilbert reasoning checks</h2>
          <div className="flex flex-col gap-3">
            {reasoningChecks.map((inv) => (
              <Card key={inv.id} className="p-4">
                <p className="text-[13px] text-foreground">
                  Hilbert attributes {inv.driverDecomposition?.[0]?.pct ? `${inv.driverDecomposition[0].pct}%` : "a majority"} of{" "}
                  {inv.title.toLowerCase()} to {inv.hilbertPrimaryDriver?.toLowerCase() ?? "a single driver"}.
                </p>
                <p className="mt-1.5 text-[12px] italic text-muted">{inv.operatorNote}</p>
                <Link
                  href={`/investigations/${inv.slug}`}
                  className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:underline"
                >
                  Test reasoning <ArrowRight size={12} />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
