"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PromoIncrementalityPanel } from "@/components/analysis/PromoIncrementalityPanel";
import { promoSummary, promotions, promoIncrementality } from "@/lib/mock-data/promotions";
import { cn, formatUsd } from "@/lib/utils";

const INCREMENTALITY_TONE = { Low: "danger", Medium: "warning", High: "success" } as const;

export default function PromotionsPage() {
  const [selected, setSelected] = useState(promotions[0].id);
  const selectedIncrementality = promoIncrementality[selected];
  const selectedOffer = promotions.find((p) => p.id === selected)!;

  return (
    <div>
      <PageHeader title="Promotions" description="Which promotions change future behavior? Redemption is not the same as lift." />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Promo spend" value={formatUsd(promoSummary.promoSpend)} />
        <StatCard label="Orders with promo" value={`${promoSummary.ordersWithPromoPct}%`} />
        <StatCard label="Incremental revenue estimate" value={formatUsd(promoSummary.incrementalRevenueEstimate)} tone="success" />
        <StatCard label="One-time-buyer leakage" value={formatUsd(promoSummary.oneTimeBuyerLeakage)} tone="danger" />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Promotion performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offer</TableHead>
                <TableHead className="text-right">Customers</TableHead>
                <TableHead className="text-right">Redemption</TableHead>
                <TableHead className="text-right">Incremental conversion</TableHead>
                <TableHead className="text-right">30D repeat</TableHead>
                <TableHead className="text-right">Incremental margin</TableHead>
                <TableHead className="text-right">p180 LTV</TableHead>
                <TableHead>Likely incrementality</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((p) => (
                <TableRow key={p.id} onClick={() => setSelected(p.id)} className={cn(selected === p.id && "bg-accent-soft/40")}>
                  <TableCell className="font-medium">{p.offer}</TableCell>
                  <TableCell className="text-right tabular-nums">{p.customers.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{(p.redemption * 100).toFixed(0)}%</TableCell>
                  <TableCell className="text-right tabular-nums">{(p.incrementalConversion * 100).toFixed(0)}%</TableCell>
                  <TableCell className="text-right tabular-nums">{p.repeat30d}%</TableCell>
                  <TableCell className={cn("text-right tabular-nums", p.incrementalMargin < 0 ? "text-danger" : "text-success")}>
                    {p.incrementalMargin > 0 ? "+" : ""}
                    {p.incrementalMargin}%
                  </TableCell>
                  <TableCell className="text-right tabular-nums">${p.p180Ltv}</TableCell>
                  <TableCell>
                    <Badge tone={INCREMENTALITY_TONE[p.likelyIncrementality]}>{p.likelyIncrementality}</Badge>
                  </TableCell>
                  <TableCell className="text-muted">{p.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-3 text-[11.5px] italic text-muted">
            Redemption measures who used an offer. It does not measure whether the offer changed their behavior.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-[13.5px] font-semibold text-foreground">Incrementality — {selectedOffer.offer}</h2>
        {selectedIncrementality ? (
          <PromoIncrementalityPanel data={selectedIncrementality} />
        ) : (
          <Card className="p-5 text-[13px] text-muted">
            No matched-cohort incrementality test has been run for this offer yet. Select &ldquo;20% first order&rdquo; or &ldquo;Free
            delivery&rdquo; to see a completed test.
          </Card>
        )}
      </div>
    </div>
  );
}
