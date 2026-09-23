"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChannelEconomicsChart } from "@/components/charts/ChannelEconomicsChart";
import { channels } from "@/lib/mock-data/channels";
import { cn, formatCompact, formatUsd } from "@/lib/utils";

const PAID_CHANNELS = channels.filter((c) => c.spend > 0);

export default function ChannelsPage() {
  const [view, setView] = useState<"acquisition" | "economics">("acquisition");
  const [deltas, setDeltas] = useState<Record<string, number>>(() =>
    Object.fromEntries(PAID_CHANNELS.map((c) => [c.channel, 0])),
  );

  const simulated = useMemo(() => {
    let totalSpend = 0;
    let totalCustomers = 0;
    let totalContribution = 0;
    for (const c of channels) {
      const delta = deltas[c.channel] ?? 0;
      const mult = 1 + delta / 100;
      const newCustomers = c.customers * mult;
      totalSpend += c.spend * mult;
      totalCustomers += newCustomers;
      totalContribution += newCustomers * c.contributionPerCustomer;
    }
    const blendedCac = totalCustomers > 0 ? totalSpend / totalCustomers : 0;
    const weightedLtv =
      totalCustomers > 0
        ? channels.reduce((sum, c) => sum + c.customers * (1 + (deltas[c.channel] ?? 0) / 100) * c.p180Ltv, 0) / totalCustomers
        : 0;
    return { totalSpend, totalCustomers, totalContribution, blendedCac, weightedLtv };
  }, [deltas]);

  const anyChanged = Object.values(deltas).some((d) => d !== 0);

  return (
    <div>
      <PageHeader title="Channels" description="Connect paid acquisition to downstream economics — don't optimize on CAC alone." />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Channel performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Spend</TableHead>
                <TableHead className="text-right">Customers</TableHead>
                <TableHead className="text-right">CAC</TableHead>
                <TableHead className="text-right">First-order ROAS</TableHead>
                <TableHead className="text-right">30D repeat</TableHead>
                <TableHead className="text-right">p180 LTV</TableHead>
                <TableHead className="text-right">Contribution / customer</TableHead>
                <TableHead className="text-right">Quality trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channels.map((c) => (
                <TableRow key={c.channel} className={c.channel === "Meta Broad" ? "bg-danger-soft/30" : undefined}>
                  <TableCell className="font-medium">{c.channel}</TableCell>
                  <TableCell className="text-right tabular-nums">{c.spend > 0 ? formatUsd(c.spend) : "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatCompact(c.customers)}</TableCell>
                  <TableCell className="text-right tabular-nums">{c.cac > 0 ? `$${c.cac.toFixed(1)}` : "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">{c.firstOrderRoas ? `${c.firstOrderRoas}x` : "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">{c.repeat30d}%</TableCell>
                  <TableCell className="text-right tabular-nums">${c.p180Ltv}</TableCell>
                  <TableCell className="text-right tabular-nums">${c.contributionPerCustomer}</TableCell>
                  <TableCell className={cn("text-right tabular-nums", c.qualityTrend < 0 ? "text-danger" : "text-success")}>
                    {c.qualityTrend > 0 ? "+" : ""}
                    {c.qualityTrend} pp
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Acquisition view vs. customer economics view</CardTitle>
          <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
            <button
              onClick={() => setView("acquisition")}
              className={cn(
                "rounded px-2.5 py-1 text-[11.5px] font-medium transition-colors",
                view === "acquisition" ? "bg-accent-fill text-accent-fill-foreground" : "text-muted hover:text-foreground",
              )}
            >
              Acquisition
            </button>
            <button
              onClick={() => setView("economics")}
              className={cn(
                "rounded px-2.5 py-1 text-[11.5px] font-medium transition-colors",
                view === "economics" ? "bg-accent-fill text-accent-fill-foreground" : "text-muted hover:text-foreground",
              )}
            >
              Customer economics
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <ChannelEconomicsChart channels={channels} view={view} />
          <p className="mt-2 text-[12px] text-foreground">
            {view === "acquisition"
              ? "Meta Broad looks strong on first-order ROAS — the ranking flips once you switch to p180 LTV."
              : "On p180 LTV, Referral and Organic lead despite low or zero paid volume; Meta Broad falls to the bottom."}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget reallocation simulator</CardTitle>
          {anyChanged && (
            <Button size="sm" variant="ghost" onClick={() => setDeltas(Object.fromEntries(PAID_CHANNELS.map((c) => [c.channel, 0])))}>
              Reset
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="mb-5 flex flex-col gap-4">
            {PAID_CHANNELS.map((c) => (
              <div key={c.channel}>
                <div className="mb-1 flex items-center justify-between text-[12px]">
                  <span className="font-medium text-foreground">{c.channel}</span>
                  <span className="tabular-nums text-muted">
                    {deltas[c.channel] > 0 ? "+" : ""}
                    {deltas[c.channel]}% · {formatUsd(c.spend * (1 + deltas[c.channel] / 100))}
                  </span>
                </div>
                <input
                  type="range"
                  min={-30}
                  max={30}
                  step={5}
                  value={deltas[c.channel]}
                  onChange={(e) => setDeltas((d) => ({ ...d, [c.channel]: Number(e.target.value) }))}
                  className="w-full accent-[var(--accent)]"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-4 sm:grid-cols-4">
            <StatCard label="Expected new customers" value={`~${formatCompact(Math.round(simulated.totalCustomers))}`} />
            <StatCard label="Blended CAC" value={`~$${simulated.blendedCac.toFixed(1)}`} />
            <StatCard label="Predicted p180 LTV" value={`~$${Math.round(simulated.weightedLtv)}`} />
            <StatCard label="Total contribution" value={`~${formatUsd(simulated.totalContribution)}`} tone={anyChanged ? "success" : "neutral"} />
          </div>
          <p className="mt-3 text-[11px] text-muted-2">
            Directional estimate assuming linear response to spend change — actual elasticity varies by channel and audience saturation. Not
            a precise forecast.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
