"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useHilbertStore } from "@/store/useHilbertStore";
import { formatDate } from "@/lib/utils";

export default function DecisionLogPage() {
  const decisionLog = useHilbertStore((s) => s.decisionLog);
  const investigations = useHilbertStore((s) => s.investigations);

  return (
    <div>
      <PageHeader title="Decision Log" description="What was learned, what we did about it, and what happened after." />

      <div className="flex flex-col gap-4">
        {decisionLog.map((entry) => {
          const inv = entry.investigationId ? investigations.find((i) => i.id === entry.investigationId) : undefined;
          return (
            <Card key={entry.id} className="p-5">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                <Step label="Finding" text={entry.finding} />
                <Step label="Judgment" text={entry.judgment} />
                <Step label="Action" text={entry.action} sublabel={formatDate(entry.actionDate)} />
                <div>
                  <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-2">Result</div>
                  {entry.result ? (
                    <div className="mt-1 flex flex-col gap-1">
                      {entry.result.metrics.map((m) => (
                        <div key={m.label} className="flex items-center justify-between gap-2 text-[12px]">
                          <span className="text-muted">{m.label}</span>
                          <span className={m.tone === "positive" ? "font-medium text-success" : m.tone === "negative" ? "font-medium text-danger" : "font-medium text-foreground"}>
                            {m.value}
                          </span>
                        </div>
                      ))}
                      <span className="mt-0.5 text-[10.5px] text-muted-2">Measured {formatDate(entry.result.measuredAt)}</span>
                    </div>
                  ) : (
                    <p className="mt-1 text-[12px] text-muted-2">Not yet measured.</p>
                  )}
                </div>
                <Step label="Learning" text={entry.learning ?? "Pending — action outcome not yet measured."} />
              </div>
              {inv && (
                <Link href={`/investigations/${inv.slug}`} className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:underline">
                  View investigation <ArrowRight size={12} />
                </Link>
              )}
              {!entry.result && <Badge tone="warning" className="mt-3">Awaiting result</Badge>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Step({ label, text, sublabel }: { label: string; text: string; sublabel?: string }) {
  return (
    <div>
      <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-2">{label}</div>
      <p className="mt-1 text-[12.5px] leading-relaxed text-foreground">{text}</p>
      {sublabel && <span className="mt-0.5 block text-[10.5px] text-muted-2">{sublabel}</span>}
    </div>
  );
}
