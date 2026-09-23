import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoyaltyComparisonRow } from "@/types";

export function LoyaltyEconomicsPanel({
  comparison,
  rawAdvantagePct,
  matchedAdvantagePct,
  narrative,
}: {
  comparison: LoyaltyComparisonRow[];
  rawAdvantagePct: number;
  matchedAdvantagePct: number;
  narrative: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loyalty economics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group</TableHead>
              <TableHead className="text-right">Frequency</TableHead>
              <TableHead className="text-right">Basket</TableHead>
              <TableHead className="text-right">Retention</TableHead>
              <TableHead className="text-right">p180 LTV</TableHead>
              <TableHead className="text-right">Contribution</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparison.map((row) => (
              <TableRow key={row.group}>
                <TableCell className="font-medium">{row.group}</TableCell>
                <TableCell className="text-right tabular-nums">{row.frequency}/mo</TableCell>
                <TableCell className="text-right tabular-nums">${row.basket}</TableCell>
                <TableCell className="text-right tabular-nums">{row.retention}%</TableCell>
                <TableCell className="text-right tabular-nums">${row.p180Ltv}</TableCell>
                <TableCell className="text-right tabular-nums">${row.contribution}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-md border border-border/60 bg-black/[0.015] px-3 py-2.5">
            <div className="text-[10.5px] uppercase tracking-wide text-muted-2">Raw member LTV advantage</div>
            <div className="mt-1 text-[18px] font-semibold tabular-nums text-foreground">+{rawAdvantagePct}%</div>
          </div>
          <div className="rounded-md border border-accent/20 bg-accent-soft/40 px-3 py-2.5">
            <div className="text-[10.5px] uppercase tracking-wide text-muted-2">Matched estimate</div>
            <div className="mt-1 text-[18px] font-semibold tabular-nums text-accent">+{matchedAdvantagePct}%</div>
          </div>
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-foreground">{narrative}</p>
        <p className="mt-2 text-[10.5px] text-muted-2">Source: loyalty + orders · matched observational comparison</p>
      </CardContent>
    </Card>
  );
}
