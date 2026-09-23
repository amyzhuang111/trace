"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueBridge } from "@/components/charts/RevenueBridge";
import { customer, economics, revenueBridge, customerQuestions } from "@/lib/mock-data/customer";
import { formatCompact, formatUsd, formatPct } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

const LEVERS = [
  {
    key: "active",
    label: "Active Customers",
    formula: "New Customers + Retained Customers + Reactivated Customers",
    detail: "648K active customers this period — customers with ≥1 purchase in the selected window.",
  },
  {
    key: "frequency",
    label: "Purchase Frequency",
    formula: "Orders / Active Customer",
    detail: "1.67 orders per active customer. Frequency is the primary lever behind the new-cohort-quality investigation.",
  },
  {
    key: "basket",
    label: "Average Basket Value",
    formula: "Revenue / Orders",
    detail: "$42.78 AOV. Higher effective pricing has been inflating AOV even as units per basket softened.",
  },
];

export default function CustomerOverviewPage() {
  const [activeLever, setActiveLever] = useState<string | null>(null);

  return (
    <div>
      <PageHeader title="Customer Overview" description="Commercial context for Northstar Market before analysis." />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Business model</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-1.5 text-[12.5px] text-muted">
              {customer.attributes.map((a) => (
                <li key={a} className="flex items-center gap-2">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-muted-2" />
                  {a}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Growth equation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 rounded-md bg-black/[0.02] px-3 py-2.5 text-center text-[13px] font-medium text-foreground">
              Revenue = Active Customers × Purchase Frequency × Average Basket Value
            </div>
            <div className="grid grid-cols-3 gap-2">
              {LEVERS.map((lever) => (
                <button
                  key={lever.key}
                  onClick={() => setActiveLever(activeLever === lever.key ? null : lever.key)}
                  className={`rounded-md border px-3 py-2 text-left text-[12px] font-medium transition-colors ${
                    activeLever === lever.key
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border text-foreground hover:border-border-strong"
                  }`}
                >
                  {lever.label}
                </button>
              ))}
            </div>
            {activeLever && (
              <div className="mt-3 rounded-md border border-accent/20 bg-accent-soft/40 px-3 py-2.5 text-[12.5px] text-foreground">
                <div className="font-mono text-[11px] text-muted">{LEVERS.find((l) => l.key === activeLever)!.formula}</div>
                <div className="mt-1 leading-relaxed">{LEVERS.find((l) => l.key === activeLever)!.detail}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-[13.5px] font-semibold text-foreground">Current economics</h2>
        <div className="grid grid-cols-5 gap-3">
          <StatCard label="Active customers" value={formatCompact(economics.activeCustomers)} />
          <StatCard label="Monthly revenue" value={formatUsd(economics.monthlyRevenue)} />
          <StatCard label="Orders" value={formatCompact(economics.monthlyOrders)} />
          <StatCard label="AOV" value={`$${economics.aov.toFixed(2)}`} />
          <StatCard label="Orders / active customer" value={economics.ordersPerActiveCustomer.toFixed(2)} />
          <StatCard label="90-day repeat" value={formatPct(economics.repeat90d / 100)} />
          <StatCard label="Blended CAC" value={`$${economics.blendedCac.toFixed(2)}`} />
          <StatCard label="p180 LTV" value={`$${economics.p180Ltv}`} sublabel="180-day horizon" />
          <StatCard label="Loyalty penetration" value={formatPct(economics.loyaltyPenetration / 100)} />
          <StatCard label="Promo share of orders" value={formatPct(economics.promoOrderShare / 100)} />
        </div>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue bridge</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueBridge items={revenueBridge} />
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-[13.5px] font-semibold text-foreground">Customer questions</h2>
        <Card>
          <CardContent className="divide-y divide-border/60 py-0">
            {customerQuestions.map((q) => (
              <Link
                key={q.id}
                href={q.investigationId ? `/investigations/${q.investigationId}` : "/investigations"}
                className="flex items-center justify-between gap-3 py-3 text-[13px] text-foreground hover:text-accent"
              >
                {q.question}
                <ChevronRight size={14} className="shrink-0 text-muted-2" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
