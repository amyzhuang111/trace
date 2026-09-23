"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, ArrowRight, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/StatCard";
import { OperatorStatusBadge } from "@/components/operator/OperatorStatusBadge";
import { OperatorNote } from "@/components/operator/OperatorNote";
import { ValidationChecklist } from "@/components/operator/ValidationChecklist";
import { HilbertConfidenceBadge, OperatorConfidenceBadge } from "@/components/analysis/ConfidenceBadge";
import { HypothesisCard } from "@/components/analysis/HypothesisCard";
import { EvidenceCard } from "@/components/analysis/EvidenceCard";
import { DriverDecomposition } from "@/components/analysis/DriverDecomposition";
import { UnknownsPanel } from "@/components/analysis/UnknownsPanel";
import { RetentionCurve } from "@/components/charts/RetentionCurve";
import { PriceNormalizedTrend } from "@/components/charts/PriceNormalizedTrend";
import { PromoScatter } from "@/components/charts/PromoScatter";
import { useHilbertStore } from "@/store/useHilbertStore";
import { cohortSeries } from "@/lib/mock-data/cohorts";
import { promoScatter } from "@/lib/mock-data/promotions";
import { channels } from "@/lib/mock-data/channels";
import { sqlResults, savedQueries } from "@/lib/mock-data/sql-results";
import { cn, formatDate, formatUsd } from "@/lib/utils";
import { InvestigationStatus } from "@/types";

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

const CANVAS_STEPS = ["Observation", "Competing hypotheses", "Evidence", "Tests", "Conclusion", "Action"];

const CORE_METRICS = [
  { label: "New-customer revenue", value: "+11.8%", tone: "neutral" as const },
  { label: "30-day repeat", value: "-7.4 pp", tone: "danger" as const },
  { label: "60-day frequency", value: "-12.1%", tone: "danger" as const },
  { label: "p180 LTV", value: "-9.6%", tone: "danger" as const },
  { label: "Revenue at risk", value: formatUsd(1_180_000), tone: "danger" as const },
];

export default function InvestigationDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const investigations = useHilbertStore((s) => s.investigations);
  const setOperatorStatus = useHilbertStore((s) => s.setOperatorStatus);
  const toggleValidationCheck = useHilbertStore((s) => s.toggleValidationCheck);
  const updateDriverDecomposition = useHilbertStore((s) => s.updateDriverDecomposition);
  const addToReadout = useHilbertStore((s) => s.addToReadout);
  const addDecisionLogEntry = useHilbertStore((s) => s.addDecisionLogEntry);

  const [promotionSelected, setPromotionSelected] = useState(false);
  const [testRun, setTestRun] = useState(false);
  const [readoutAdded, setReadoutAdded] = useState(false);
  const [decisionLogged, setDecisionLogged] = useState(false);
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);

  const inv = investigations.find((i) => i.slug === params.slug);

  if (!inv) {
    return (
      <div>
        <p className="text-[13px] text-muted">Investigation not found.</p>
        <Link href="/investigations" className="text-[13px] font-medium text-accent hover:underline">
          Back to investigations
        </Link>
      </div>
    );
  }

  const isCore = inv.slug === "new-cohort-quality";
  const checksComplete = inv.validationChecks.filter((c) => c.completed).length;
  const checksRatio = inv.validationChecks.length ? checksComplete / inv.validationChecks.length : 1;
  const canBeCustomerReady = checksRatio >= 0.7 && !!inv.operatorConclusion && inv.recommendedActions.length > 0;

  function handleStatusChange(next: InvestigationStatus) {
    if (next === "ready_for_customer" && !canBeCustomerReady) {
      const needed = Math.max(0, Math.ceil(inv!.validationChecks.length * 0.7) - checksComplete);
      alert(
        needed > 0
          ? `${needed} validation check${needed === 1 ? "" : "s"} remain before this is customer-ready.`
          : "An operator conclusion and at least one recommended action are required before this is customer-ready.",
      );
      return;
    }
    setOperatorStatus(inv!.id, next);
  }

  function runMatchedTest() {
    setTestRun(true);
    updateDriverDecomposition(inv!.id, 51, 27);
  }

  function handleAddToReadout() {
    addToReadout({
      investigationId: inv!.id,
      finding: inv!.operatorConclusion ?? inv!.hilbertAnswer,
      moneyAtStake: inv!.economicImpact > 0 ? `${formatUsd(inv!.economicImpact)} ${inv!.impactHorizon}` : "No direct revenue at risk",
      action: inv!.recommendedActions[0]?.description ?? "No action recommended yet.",
      caveat: inv!.unknowns[0]?.statement ?? "Synthetic demo data.",
    });
    setReadoutAdded(true);
  }

  function handleSendToDecisionLog() {
    addDecisionLogEntry({
      id: `dl-${inv!.id}-${Date.now()}`,
      investigationId: inv!.id,
      finding: inv!.trigger,
      judgment: inv!.operatorConclusion ?? "Judgment pending further validation.",
      action: inv!.recommendedActions.find((a) => a.recommended)?.description ?? inv!.recommendedActions[0]?.description ?? "No action selected.",
      actionDate: new Date().toISOString().slice(0, 10),
    });
    setDecisionLogged(true);
  }

  async function copyQuery(id: string, sql: string) {
    try {
      await navigator.clipboard.writeText(sql);
      setCopiedQuery(id);
      setTimeout(() => setCopiedQuery(null), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  const impactTone = inv.economicImpact >= 500_000 ? "danger" : inv.economicImpact > 0 ? "warning" : "neutral";
  const impactLabel = inv.economicImpact >= 500_000 ? "High impact" : inv.economicImpact > 0 ? "Medium impact" : "Informational";

  return (
    <div>
      <div className="mb-2 flex items-center gap-1 text-[12px] text-muted-2">
        <Link href="/" className="hover:text-foreground">Northstar</Link>
        <ChevronRight size={12} />
        <Link href="/investigations" className="hover:text-foreground">Investigations</Link>
        <ChevronRight size={12} />
        <span className="text-foreground">{inv.title}</span>
      </div>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-[22px] font-semibold tracking-tight text-foreground">{inv.question}</h1>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">
            Hilbert detected this from: {inv.trigger}.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone={impactTone}>{impactLabel}</Badge>
            <OperatorStatusBadge status={inv.operatorStatus} />
            <HilbertConfidenceBadge pct={inv.hilbertConfidence} />
            <Link href="/data-health" className="text-[11.5px] font-medium text-muted-2 hover:text-accent hover:underline">
              Check data health
            </Link>
          </div>
        </div>
        <select
          value={inv.operatorStatus}
          onChange={(e) => handleStatusChange(e.target.value as InvestigationStatus)}
          className="h-8 shrink-0 rounded-md border border-border-strong bg-surface px-2.5 text-[12.5px] font-medium text-foreground"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {isCore ? (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {CORE_METRICS.map((m) => (
            <StatCard key={m.label} label={m.label} value={m.value} tone={m.tone} />
          ))}
        </div>
      ) : (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Economic impact" value={inv.economicImpact > 0 ? formatUsd(inv.economicImpact) : "—"} sublabel={inv.impactHorizon} tone={impactTone} />
          <StatCard label="Hilbert confidence" value={`${inv.hilbertConfidence}%`} />
          <StatCard label="Category" value={inv.category} />
          <StatCard label="Updated" value={formatDate(inv.updatedAt)} />
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Hilbert hypothesis</CardTitle>
          {inv.operatorConfidence && <OperatorConfidenceBadge level={inv.operatorConfidence} />}
        </CardHeader>
        <CardContent>
          <p className="text-[13px] leading-relaxed text-foreground">{inv.hilbertAnswer}</p>
          {(inv.hilbertPrimaryDriver || inv.hilbertSecondaryDriver || inv.hilbertLeadingIndicator) && (
            <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border/60 pt-4 sm:grid-cols-3">
              {inv.hilbertPrimaryDriver && (
                <div>
                  <div className="text-[10.5px] uppercase tracking-wide text-muted-2">Primary driver</div>
                  <div className="mt-0.5 text-[12.5px] font-medium text-foreground">{inv.hilbertPrimaryDriver}</div>
                </div>
              )}
              {inv.hilbertSecondaryDriver && (
                <div>
                  <div className="text-[10.5px] uppercase tracking-wide text-muted-2">Secondary driver</div>
                  <div className="mt-0.5 text-[12.5px] font-medium text-foreground">{inv.hilbertSecondaryDriver}</div>
                </div>
              )}
              {inv.hilbertLeadingIndicator && (
                <div>
                  <div className="text-[10.5px] uppercase tracking-wide text-muted-2">Leading indicator</div>
                  <div className="mt-0.5 text-[12.5px] font-medium text-foreground">{inv.hilbertLeadingIndicator}</div>
                </div>
              )}
            </div>
          )}
          {inv.operatorNote && (
            <div className="mt-4">
              <OperatorNote note={inv.operatorNote} />
            </div>
          )}

          {isCore && (
            <div className="mt-4 border-t border-border/60 pt-4">
              <div className="mb-2 text-[12px] font-semibold text-foreground">Challenge conclusion</div>
              {!promotionSelected ? (
                <div>
                  <p className="mb-2 text-[12px] text-muted">Which alternative explanation do you want to test?</p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setPromotionSelected(true)}>
                      Promotion depth
                    </Button>
                    <Button size="sm" variant="ghost" disabled title="Ruled out — see H4 in competing hypotheses">
                      Fulfillment quality
                    </Button>
                    <Button size="sm" variant="ghost" disabled title="Ruled out — see H5 in competing hypotheses">
                      Seasonality
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-[12px] text-foreground">
                    Promotion depth changed +8.5 pp at the same time as the channel-mix shift.
                  </p>
                  {!testRun ? (
                    <Button size="sm" variant="primary" className="mt-2" onClick={runMatchedTest}>
                      Run matched-cohort test
                    </Button>
                  ) : (
                    <div className="mt-2 rounded-md border border-accent/20 bg-accent-soft/40 px-3 py-2.5">
                      <p className="text-[12.5px] font-medium text-foreground">
                        Promotion remains associated with -5.1 pp repeat after observable controls.
                      </p>
                      <p className="mt-1 text-[11.5px] text-muted">Confidence interval [-6.2, -4.0] pp.</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[11.5px] font-medium text-accent">
                        <RefreshCw size={12} />
                        Conclusion updated — channel mix 61% → 51%, promotion 17% → 27%
                      </div>
                      <Link
                        href="/product-feedback"
                        className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:underline"
                      >
                        Send reasoning feedback to Product <ArrowRight size={12} />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mb-6 flex items-center gap-1 overflow-x-auto rounded-lg border border-border/60 bg-surface px-4 py-3">
        {CANVAS_STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <span className={cn("whitespace-nowrap text-[12px] font-medium", s === "Tests" ? "text-accent" : "text-muted")}>{s}</span>
            {i < CANVAS_STEPS.length - 1 && <ChevronRight size={13} className="mx-2 shrink-0 text-muted-2" />}
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-[13.5px] font-semibold text-foreground">Competing hypotheses</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {inv.hypotheses.map((h) => (
            <HypothesisCard key={h.id} hypothesis={h} />
          ))}
        </div>
      </div>

      {inv.evidence.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-[13.5px] font-semibold text-foreground">Evidence</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {inv.evidence.map((e) => (
              <EvidenceCard key={e.id} evidence={e} />
            ))}
          </div>
        </div>
      )}

      {isCore && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cohort evidence</CardTitle>
          </CardHeader>
          <CardContent>
            <RetentionCurve series={cohortSeries} highlightChannel="Paid Social" highlightRange={["May", "Jul"]} />
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border/60 pt-4 sm:grid-cols-4">
              <MiniStat label="Paid-social new users" value="+24%" />
              <MiniStat label="Paid-social 30-day repeat" value="-9.8 pp" tone="danger" />
              <MiniStat label="Other channels" value="-1.2 pp" />
              <MiniStat label="After city + basket controls" value="Gap remains" />
            </div>
          </CardContent>
        </Card>
      )}

      {isCore && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Is higher AOV hiding weaker behavior?</CardTitle>
          </CardHeader>
          <CardContent>
            <PriceNormalizedTrend result={sqlResults["r-price-normalized"]} />
            <p className="mt-4 border-t border-border/60 pt-4 text-[12.5px] leading-relaxed text-foreground">
              Nominal revenue increased, but units purchased per customer declined. Price explains most of the AOV
              increase and makes acquisition performance look healthier than underlying behavior.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="warning">Pricing artifact present</Badge>
              <Badge tone="neutral">Does not explain repeat decline</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {isCore && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Did deeper discounts create low-quality acquisition?</CardTitle>
          </CardHeader>
          <CardContent>
            <PromoScatter points={promoScatter} />
            <p className="mt-3 text-[11.5px] italic text-muted">
              This is observational. Promotion depth is correlated with channel and campaign targeting.
            </p>
          </CardContent>
        </Card>
      )}

      {isCore && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Which channels drove the quality shift?</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Channel</TableHead>
                  <TableHead className="text-right">New users</TableHead>
                  <TableHead className="text-right">Mix Δ</TableHead>
                  <TableHead className="text-right">CAC</TableHead>
                  <TableHead className="text-right">30D repeat</TableHead>
                  <TableHead className="text-right">p180 LTV</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channels.slice(0, 5).map((c) => (
                  <TableRow key={c.channel} className={c.channel === "Meta Broad" ? "bg-danger-soft/30" : undefined}>
                    <TableCell className="font-medium">{c.channel}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.customers.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.mixChangePP > 0 ? "+" : ""}{c.mixChangePP} pp</TableCell>
                    <TableCell className="text-right tabular-nums">${c.cac.toFixed(0)}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.repeat30d}%</TableCell>
                    <TableCell className="text-right tabular-nums">${c.p180Ltv}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Link href="/channels" className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:underline">
              Open Channels <ArrowRight size={12} />
            </Link>
          </CardContent>
        </Card>
      )}

      {inv.driverDecomposition && (
        <div className="mb-6">
          <DriverDecomposition data={inv.driverDecomposition} />
        </div>
      )}

      {inv.validationChecks.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Validation checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <ValidationChecklist checks={inv.validationChecks} onToggle={(id) => toggleValidationCheck(inv.id, id)} />
          </CardContent>
        </Card>
      )}

      {isCore && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>SQL evidence</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {["q-cohort-repeat", "q-promo-depth"].map((qid) => {
              const q = savedQueries.find((sq) => sq.id === qid);
              if (!q) return null;
              return (
                <div key={qid} className="overflow-hidden rounded-md border border-border/60">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-black/[0.015] px-3 py-2">
                    <span className="text-[12.5px] font-medium text-foreground">{q.title}</span>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => copyQuery(qid, q.sql)}>
                        {copiedQuery === qid ? "Copied" : "Copy query"}
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => router.push(`/sql-lab?q=${qid}`)}>
                        Open in SQL Lab
                      </Button>
                    </div>
                  </div>
                  <pre className="mono overflow-x-auto px-3 py-2.5 text-[11px] leading-relaxed text-muted">{q.sql}</pre>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current conclusion</CardTitle>
        </CardHeader>
        <CardContent>
          {inv.operatorConclusion ? (
            <>
              <p className="text-[13px] leading-relaxed text-foreground">{inv.operatorConclusion}</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <MiniStat label="Confidence" value={inv.operatorConfidence ?? "—"} />
                <MiniStat label="Economic impact" value={inv.economicImpact > 0 ? `${formatUsd(inv.economicImpact)} · ${inv.impactHorizon}` : "—"} />
                <MiniStat label="Unknowns" value={String(inv.unknowns.length)} />
              </div>
            </>
          ) : (
            <p className="text-[13px] text-muted">No operator conclusion yet — complete validation checks to form one.</p>
          )}
        </CardContent>
      </Card>

      {inv.recommendedActions.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-[13.5px] font-semibold text-foreground">Action options</h2>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {inv.recommendedActions.map((a) => (
              <Card key={a.id} className="p-4">
                {a.recommended && <Badge tone="accent" className="mb-2">Recommended</Badge>}
                <div className="text-[13px] font-semibold text-foreground">{a.title}</div>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">{a.description}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11.5px]">
                  <div>
                    <span className="text-muted-2">Expected impact</span>
                    <div className="font-medium text-foreground">
                      {a.expectedImpact > 0 ? `${formatUsd(a.expectedImpact)} · ${a.impactHorizon}` : "Qualitative"}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-2">Time to signal</span>
                    <div className="font-medium text-foreground">{a.timeToSignal}</div>
                  </div>
                  <div>
                    <span className="text-muted-2">Risk</span>
                    <div className="font-medium capitalize text-foreground">{a.risk}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button variant="primary" onClick={handleAddToReadout} disabled={readoutAdded}>
              {readoutAdded ? "Added to readout" : "Add to customer readout"}
            </Button>
            <Button variant="secondary" onClick={handleSendToDecisionLog} disabled={decisionLogged}>
              {decisionLogged ? "Sent to decision log" : "Send to decision log"}
            </Button>
          </div>
        </div>
      )}

      <UnknownsPanel unknowns={inv.unknowns} />
    </div>
  );
}

function MiniStat({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "danger" }) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-wide text-muted-2">{label}</div>
      <div className={cn("mt-1 text-[14px] font-semibold tabular-nums", tone === "danger" ? "text-danger" : "text-foreground")}>{value}</div>
    </div>
  );
}
