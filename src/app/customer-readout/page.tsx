"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Printer, Maximize2, Minimize2, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RetentionCurve } from "@/components/charts/RetentionCurve";
import { PromoScatter } from "@/components/charts/PromoScatter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useHilbertStore } from "@/store/useHilbertStore";
import { cohortSeries } from "@/lib/mock-data/cohorts";
import { promoScatter } from "@/lib/mock-data/promotions";
import { channels } from "@/lib/mock-data/channels";
import { cn, formatDate } from "@/lib/utils";

const NEEDS_FROM_CUSTOMER = [
  "Confirm May campaign targeting changes",
  "Confirm first-order promotion policy",
  "Provide creative metadata if available",
];

const NEXT_MEASUREMENT = ["14-day activation", "Second-purchase conversion", "p180 LTV", "Contribution margin"];

export default function CustomerReadoutPage() {
  const investigations = useHilbertStore((s) => s.investigations);
  const readoutEntries = useHilbertStore((s) => s.readoutEntries);
  const [appendix, setAppendix] = useState<"executive" | "analytical">("executive");
  const [presenting, setPresenting] = useState(false);
  const [copied, setCopied] = useState(false);

  const core = investigations.find((i) => i.slug === "new-cohort-quality")!;
  const coreEntry = readoutEntries.find((r) => r.investigationId === "new-cohort-quality");
  const extraEntries = readoutEntries.filter((r) => r.investigationId !== "new-cohort-quality");
  const ruledOut = core.hypotheses.filter((h) => h.status === "ruled_out");

  async function copyTalkingPoints() {
    const lines = [
      `Weekly Growth Readout — Northstar Market · ${formatDate(new Date().toISOString())}`,
      "",
      "What changed:",
      "- New-customer revenue grew 11.8%, but 30-day repeat fell 7.4 pp.",
      "- The deterioration is concentrated in broad paid social.",
      "- Higher prices explain most AOV growth; they do not explain weaker repeat behavior.",
      "",
      `Why it matters: ${coreEntry?.moneyAtStake ?? "$1.18M estimated 180-day revenue at risk"}`,
      "",
      `What we believe: ${core.operatorConclusion}`,
      "",
      `What we recommend: ${core.recommendedActions.map((a) => a.title).join("; ")}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(lines);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className={cn(presenting && "mx-auto max-w-3xl")}>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-[22px] font-semibold tracking-tight text-foreground">Weekly Growth Readout</h1>
          <p className="mt-2 text-[13.5px] text-muted">Northstar Market · {formatDate(new Date().toISOString())} · Synthetic demo data</p>
        </div>
        {!presenting && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
              <button
                onClick={() => setAppendix("executive")}
                className={cn("rounded px-2.5 py-1 text-[11.5px] font-medium transition-colors", appendix === "executive" ? "bg-accent-fill text-accent-fill-foreground" : "text-muted hover:text-foreground")}
              >
                Executive
              </button>
              <button
                onClick={() => setAppendix("analytical")}
                className={cn("rounded px-2.5 py-1 text-[11.5px] font-medium transition-colors", appendix === "analytical" ? "bg-accent-fill text-accent-fill-foreground" : "text-muted hover:text-foreground")}
              >
                Analytical appendix
              </button>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setPresenting(true)}>
              <Maximize2 size={12} />
              Present mode
            </Button>
            <Button size="sm" variant="secondary" onClick={() => window.print()}>
              <Printer size={12} />
              Export summary
            </Button>
            <Button size="sm" variant="secondary" onClick={copyTalkingPoints}>
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy talking points"}
            </Button>
          </div>
        )}
        {presenting && (
          <Button size="sm" variant="secondary" onClick={() => setPresenting(false)}>
            <Minimize2 size={12} />
            Exit present mode
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <Section title="1. What changed">
          <ul className="list-disc space-y-1.5 pl-4 text-[13.5px] leading-relaxed text-foreground">
            <li>New-customer revenue grew 11.8%, but 30-day repeat fell 7.4 pp.</li>
            <li>The deterioration is concentrated in broad paid social.</li>
            <li>Higher prices explain most AOV growth; they do not explain weaker repeat behavior.</li>
          </ul>
        </Section>

        <Section title="2. Why it matters">
          <p className="text-[15px] font-semibold text-danger">{coreEntry?.moneyAtStake ?? "$1.18M estimated 180-day revenue at risk"}</p>
        </Section>

        <Section title="3. What we believe">
          <p className="text-[13.5px] leading-relaxed text-foreground">{core.operatorConclusion}</p>
          <div className="mt-2 flex items-center gap-2 text-[12px] text-muted">
            Confidence: <Badge tone="success">{core.operatorConfidence}</Badge>
          </div>
        </Section>

        <Section title="4. What we ruled out">
          <ul className="list-disc space-y-1.5 pl-4 text-[13.5px] leading-relaxed text-foreground">
            {ruledOut.map((h) => (
              <li key={h.id}>{h.statement}</li>
            ))}
          </ul>
        </Section>

        <Section title="5. What we recommend">
          <div className="flex flex-col gap-2">
            {core.recommendedActions.map((a, i) => (
              <div key={a.id} className="flex items-baseline gap-2 text-[13.5px] text-foreground">
                <span className="font-semibold text-muted-2">{i + 1}.</span>
                <span>
                  <span className="font-medium">{a.title}.</span> {a.description}
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="6. What we need from Northstar">
          <ul className="list-disc space-y-1.5 pl-4 text-[13.5px] leading-relaxed text-foreground">
            {NEEDS_FROM_CUSTOMER.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </Section>

        <Section title="7. Next measurement">
          <div className="flex flex-wrap gap-2">
            {NEXT_MEASUREMENT.map((m) => (
              <Badge key={m} tone="neutral">{m}</Badge>
            ))}
          </div>
        </Section>

        {appendix === "analytical" && !presenting && (
          <div className="border-t border-border/60 pt-6">
            <h2 className="mb-4 text-[15px] font-semibold text-foreground">Analytical appendix</h2>
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader><CardTitle>Cohort retention by channel</CardTitle></CardHeader>
                <CardContent><RetentionCurve series={cohortSeries} highlightChannel="Paid Social" highlightRange={["May", "Jul"]} /></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Promotion depth vs. repeat</CardTitle></CardHeader>
                <CardContent><PromoScatter points={promoScatter} /></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Channel table</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Channel</TableHead>
                        <TableHead className="text-right">30D repeat</TableHead>
                        <TableHead className="text-right">p180 LTV</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {channels.map((c) => (
                        <TableRow key={c.channel}>
                          <TableCell className="font-medium">{c.channel}</TableCell>
                          <TableCell className="text-right tabular-nums">{c.repeat30d}%</TableCell>
                          <TableCell className="text-right tabular-nums">${c.p180Ltv}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card className="p-4">
                <div className="mb-2 text-[12.5px] font-semibold text-foreground">Assumptions</div>
                <ul className="list-disc space-y-1 pl-4 text-[12px] text-muted">
                  {core.unknowns.map((u) => (
                    <li key={u.id}>{u.statement}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        )}

        {!presenting && extraEntries.length > 0 && (
          <div className="border-t border-border/60 pt-6">
            <h2 className="mb-3 text-[15px] font-semibold text-foreground">Additional readout items</h2>
            <div className="flex flex-col gap-3">
              {extraEntries.map((e) => {
                const inv = investigations.find((i) => i.id === e.investigationId);
                return (
                  <Card key={e.investigationId} className="p-4">
                    <p className="text-[13px] leading-relaxed text-foreground">{e.finding}</p>
                    <p className="mt-1.5 text-[12px] text-muted"><span className="font-medium text-foreground">Money at stake:</span> {e.moneyAtStake}</p>
                    <p className="mt-1 text-[12px] text-muted"><span className="font-medium text-foreground">Action:</span> {e.action}</p>
                    <p className="mt-1 text-[11.5px] italic text-muted-2">{e.caveat}</p>
                    {inv && (
                      <Link href={`/investigations/${inv.slug}`} className="mt-2 inline-block text-[12px] font-medium text-accent hover:underline">
                        View investigation
                      </Link>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-2">{title}</h2>
      {children}
    </div>
  );
}
