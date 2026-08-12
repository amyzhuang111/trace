"use client";

import { useState } from "react";
import { useEngagementStore } from "@/store/useEngagementStore";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QualityCostScatter, EXPERIMENT_COLORS } from "@/components/charts/QualityCostScatter";
import { ExperimentCard } from "@/components/experiments/ExperimentCard";
import { getPilotStatus } from "@/lib/derive/pilot";
import { formatPct } from "@/lib/utils";

export default function ExperimentsPage() {
  const state = useEngagementStore((s) => s);
  const { experiments, verifiers, evalCases } = state;
  const status = getPilotStatus(state);
  const [selectedId, setSelectedId] = useState(status.candidate?.id ?? status.committed.id);

  const cheapestPassing = experiments
    .filter((e) => e.passedPilotThreshold)
    .sort((a, b) => a.costPerTaskUsd - b.costPerTaskUsd)[0];

  return (
    <div>
      <PageHeader
        title="Experiment Runner"
        description="Pick the lowest-cost configuration that reliably clears the business quality bar — not the most capable model by default."
      />

      <Card className="mb-6">
        <CardHeader>
          <div>
            <CardTitle>Quality × Cost × Latency</CardTitle>
            <CardDescription>Bubble size is latency. Dashed line is the pilot quality bar.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex flex-wrap gap-3">
            {experiments.map((e, i) => (
              <button
                key={e.id}
                onClick={() => setSelectedId(e.id)}
                className="flex items-center gap-1.5 text-[11.5px]"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: EXPERIMENT_COLORS[i % EXPERIMENT_COLORS.length],
                    outline: selectedId === e.id ? "2px solid currentColor" : "none",
                  }}
                />
                <span className={selectedId === e.id ? "font-semibold text-foreground" : "text-muted"}>{e.label}</span>
              </button>
            ))}
          </div>
          <QualityCostScatter experiments={experiments} threshold={status.requiredScore} />
          {cheapestPassing && (
            <p className="mt-2 text-[12.5px] text-foreground">
              <span className="font-medium">{cheapestPassing.label}</span> is the lowest-cost configuration that clears the{" "}
              {formatPct(status.requiredScore)} bar.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {experiments.map((e, i) => (
          <div key={e.id} onClick={() => setSelectedId(e.id)} className="cursor-pointer">
            <ExperimentCard
              experiment={e}
              verifiers={verifiers}
              color={EXPERIMENT_COLORS[i % EXPERIMENT_COLORS.length]}
              totalCases={evalCases.length}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
