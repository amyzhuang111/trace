"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OperatorStatusBadge } from "@/components/operator/OperatorStatusBadge";
import { HilbertConfidenceBadge } from "@/components/analysis/ConfidenceBadge";
import { useHilbertStore } from "@/store/useHilbertStore";
import { cn, formatDate, formatUsd } from "@/lib/utils";
import { InvestigationCategory, InvestigationStatus } from "@/types";

const CATEGORIES: InvestigationCategory[] = [
  "Acquisition",
  "Retention",
  "Basket",
  "Loyalty",
  "Promotions",
  "Assortment",
  "Channel",
  "Pricing",
];

const STATUSES: InvestigationStatus[] = [
  "new",
  "testing",
  "validated",
  "rejected",
  "waiting_for_data",
  "ready_for_customer",
  "closed",
];

const STATUS_LABELS: Record<InvestigationStatus, string> = {
  new: "New",
  testing: "Testing",
  validated: "Validated",
  rejected: "Rejected",
  waiting_for_data: "Waiting for data",
  ready_for_customer: "Ready for customer",
  closed: "Closed",
};

export default function InvestigationsPage() {
  const router = useRouter();
  const investigations = useHilbertStore((s) => s.investigations);
  const [category, setCategory] = useState<InvestigationCategory | "All">("All");
  const [status, setStatus] = useState<InvestigationStatus | "All">("All");

  const filtered = useMemo(
    () =>
      investigations.filter(
        (i) =>
          (category === "All" || i.category === category || i.additionalCategories?.includes(category)) &&
          (status === "All" || i.operatorStatus === status),
      ),
    [investigations, category, status],
  );

  return (
    <div>
      <PageHeader title="Investigations" description="Structured growth questions — each one an analytical case, not an alert." />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FilterPill active={category === "All"} onClick={() => setCategory("All")}>
          All categories
        </FilterPill>
        {CATEGORIES.map((c) => (
          <FilterPill key={c} active={category === c} onClick={() => setCategory(c)}>
            {c}
          </FilterPill>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FilterPill active={status === "All"} onClick={() => setStatus("All")}>
          All statuses
        </FilterPill>
        {STATUSES.map((s) => (
          <FilterPill key={s} active={status === s} onClick={() => setStatus(s)}>
            {STATUS_LABELS[s]}
          </FilterPill>
        ))}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Trigger</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Impact</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Operator status</TableHead>
              <TableHead>Customer status</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell className="py-8 text-center text-muted">No investigations match this filter.</TableCell>
              </TableRow>
            ) : null}
            {filtered.map((inv) => (
              <TableRow key={inv.id} onClick={() => router.push(`/investigations/${inv.slug}`)}>
                <TableCell className="max-w-[260px] font-medium">{inv.question}</TableCell>
                <TableCell className="max-w-[180px] text-muted">{inv.trigger}</TableCell>
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
                <TableCell className="capitalize text-muted">{inv.customerStatus.replace(/_/g, " ")}</TableCell>
                <TableCell className="whitespace-nowrap text-muted-2">{formatDate(inv.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-sm border px-2.5 py-1 text-[11.5px] font-medium transition-colors",
        active ? "border-accent bg-accent-soft text-accent" : "border-border text-muted hover:border-border-strong",
      )}
    >
      {children}
    </button>
  );
}
