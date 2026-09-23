"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BasketTrend } from "@/components/charts/BasketTrend";
import { FrequencyBasketMatrix } from "@/components/charts/FrequencyBasketMatrix";
import { BehaviorVsPriceDecomposition } from "@/components/analysis/BehaviorVsPriceDecomposition";
import { frequencyTrend, basketComposition, categoryAttach, frequencyBasketQuadrant } from "@/lib/mock-data/baskets";
import { behaviorVsPrice } from "@/lib/mock-data/customer";

const CONFIDENCE_TONE = { Low: "neutral", Medium: "warning", High: "success" } as const;

export default function BasketFrequencyPage() {
  return (
    <div>
      <PageHeader title="Basket & Frequency" description="Separate higher ticket from healthier customer behavior." />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Growth decomposition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 rounded-md bg-black/[0.02] px-3 py-2.5 text-center text-[13px] font-medium text-foreground">
            Revenue / Customer = Visits / Customer × Basket Value
          </div>
          <div className="rounded-md bg-black/[0.02] px-3 py-2.5 text-center text-[13px] font-medium text-foreground">
            Basket Value = Units / Basket × Effective Price / Unit
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <BehaviorVsPriceDecomposition {...behaviorVsPrice} />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Frequency trend</CardTitle>
        </CardHeader>
        <CardContent>
          <BasketTrend points={frequencyTrend} />
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="mb-3 text-[13.5px] font-semibold text-foreground">Basket composition</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Basket value" value={`$${basketComposition.basketValue.toFixed(2)}`} />
          <StatCard label="Items / basket" value={basketComposition.itemsPerBasket.toFixed(1)} />
          <StatCard label="Effective price / item" value={`$${basketComposition.effectivePricePerItem.toFixed(2)}`} />
          <StatCard label="Category breadth" value={basketComposition.categoryBreadth.toFixed(1)} />
          <StatCard label="Private-label share" value={`${basketComposition.privateLabelShare}%`} />
          <StatCard label="Promoted-item share" value={`${basketComposition.promotedItemShare}%`} />
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Frequency vs. basket matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <FrequencyBasketMatrix points={frequencyBasketQuadrant} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category attach analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Penetration</TableHead>
                <TableHead className="text-right">Attach rate</TableHead>
                <TableHead className="text-right">Frequency lift</TableHead>
                <TableHead className="text-right">Margin</TableHead>
                <TableHead className="text-right">Repeat association</TableHead>
                <TableHead>Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryAttach.map((c) => (
                <TableRow key={c.category} className={c.category === "Prepared foods" ? "bg-accent-soft/40" : undefined}>
                  <TableCell className="font-medium">{c.category}</TableCell>
                  <TableCell className="text-right tabular-nums">{c.penetration}%</TableCell>
                  <TableCell className="text-right tabular-nums">{c.attachRate}%</TableCell>
                  <TableCell className="text-right tabular-nums">+{c.frequencyLift}%</TableCell>
                  <TableCell className="text-right tabular-nums">{c.margin}%</TableCell>
                  <TableCell className="text-right tabular-nums">{c.repeatAssociation.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge tone={CONFIDENCE_TONE[c.confidence]}>{c.confidence}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-3 text-[11.5px] italic text-muted">
            Prepared foods shows the strongest frequency association — but this may reflect customer self-selection rather than a causal
            effect of assortment.
          </p>
          <Link
            href="/investigations/prepared-foods-frequency"
            className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:underline"
          >
            Create validation investigation <ArrowRight size={12} />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
