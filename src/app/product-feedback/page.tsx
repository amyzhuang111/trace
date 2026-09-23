"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, toneForSeverity } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useHilbertStore } from "@/store/useHilbertStore";
import { cn } from "@/lib/utils";
import { FeedbackStatus } from "@/types";

const TYPE_LABELS: Record<string, string> = {
  reasoning: "Reasoning",
  metric_semantics: "Metric semantics",
  data_quality: "Data quality",
  causal_reasoning: "Causal reasoning",
  segment_definition: "Segment definition",
};

const STATUS_TONE: Record<FeedbackStatus, "warning" | "accent" | "success"> = {
  open: "warning",
  triaged: "accent",
  accepted: "success",
  shipped: "success",
};

const NEXT_STATUS: Record<FeedbackStatus, { next: FeedbackStatus; label: string } | null> = {
  open: { next: "triaged", label: "Mark ready for Product" },
  triaged: { next: "accepted", label: "Mark accepted" },
  accepted: { next: "shipped", label: "Mark shipped" },
  shipped: null,
};

export default function ProductFeedbackPage() {
  const productFeedback = useHilbertStore((s) => s.productFeedback);
  const setFeedbackStatus = useHilbertStore((s) => s.setFeedbackStatus);
  const investigations = useHilbertStore((s) => s.investigations);
  const [selectedId, setSelectedId] = useState<string | null>(productFeedback[0]?.id ?? null);

  const openCount = productFeedback.filter((f) => f.status === "open").length;
  const highCount = productFeedback.filter((f) => f.severity === "high").length;
  const acceptedCount = productFeedback.filter((f) => f.status === "accepted").length;
  const shippedCount = productFeedback.filter((f) => f.status === "shipped").length;

  const selected = productFeedback.find((f) => f.id === selectedId) ?? null;
  const selectedInvestigation = selected?.investigationId ? investigations.find((i) => i.id === selected.investigationId) : undefined;

  return (
    <div>
      <PageHeader title="Product Feedback" description="Where Hilbert's product reasoning needs improvement — captured from real investigations." />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Open feedback" value={String(openCount)} tone={openCount > 0 ? "warning" : "neutral"} />
        <StatCard label="High priority" value={String(highCount)} tone={highCount > 0 ? "danger" : "neutral"} />
        <StatCard label="Accepted" value={String(acceptedCount)} tone="success" />
        <StatCard label="Shipped" value={String(shippedCount)} tone="success" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Reproducible</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productFeedback.map((f) => (
                  <TableRow key={f.id} onClick={() => setSelectedId(f.id)} className={cn(selectedId === f.id && "bg-accent-soft/40")}>
                    <TableCell className="max-w-[280px] font-medium">{f.title}</TableCell>
                    <TableCell className="text-muted">{TYPE_LABELS[f.type]}</TableCell>
                    <TableCell>
                      <Badge tone={toneForSeverity(f.severity)}>{f.severity}</Badge>
                    </TableCell>
                    <TableCell className="text-muted">{f.reproducible ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <Badge tone={STATUS_TONE[f.status]}>{f.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4">
          {selected ? (
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>{selected.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-[12.5px]">
                <Field label="Hilbert output (observed)" value={selected.hilbertOutput} />
                <Field label="Operator finding" value={selected.operatorFinding} />
                {selected.businessConsequence && <Field label="Business consequence" value={selected.businessConsequence} />}
                {selected.reproSteps && <Field label="Reproducible steps" value={selected.reproSteps} mono />}
                {selected.relevantQuery && (
                  <Field
                    label="Relevant query"
                    value={
                      <Link href={`/sql-lab?q=${selected.relevantQuery}`} className="text-accent hover:underline">
                        {selected.relevantQuery}
                      </Link>
                    }
                  />
                )}
                <Field label="Recommended fix" value={selected.recommendedFix} />
                {selected.affectedCustomers && <Field label="Affected customers" value={selected.affectedCustomers} />}
                {selected.urgency && <Field label="Urgency" value={<span className="capitalize">{selected.urgency}</span>} />}
                {selectedInvestigation && (
                  <Field
                    label="Source investigation"
                    value={
                      <Link href={`/investigations/${selectedInvestigation.slug}`} className="text-accent hover:underline">
                        {selectedInvestigation.title}
                      </Link>
                    }
                  />
                )}
                <div className="rounded-md border border-dashed border-border-strong px-3 py-4 text-center text-[11px] text-muted-2">
                  No screenshot attached (synthetic demo)
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-3">
                  <Badge tone={STATUS_TONE[selected.status]}>{selected.status}</Badge>
                  {NEXT_STATUS[selected.status] && (
                    <Button size="sm" variant="primary" onClick={() => setFeedbackStatus(selected.id, NEXT_STATUS[selected.status]!.next)}>
                      {NEXT_STATUS[selected.status]!.label}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-5 text-[13px] text-muted">Select a feedback item to see detail.</Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10.5px] font-medium uppercase tracking-wide text-muted-2">{label}</div>
      <div className={cn("mt-0.5 leading-relaxed text-foreground", mono && "mono text-[11.5px]")}>{value}</div>
    </div>
  );
}
