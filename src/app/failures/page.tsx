"use client";

import { useState } from "react";
import { useEngagementStore } from "@/store/useEngagementStore";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FailureCard } from "@/components/failures/FailureCard";
import { LearningLoop } from "@/components/failures/LearningLoop";
import { cn } from "@/lib/utils";

const FILTERS = ["all", "open", "regression-added", "resolved"] as const;

export default function FailuresPage() {
  const failures = useEngagementStore((s) => s.failures);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  const filtered = filter === "all" ? failures : failures.filter((f) => f.status === filter);
  const openCount = failures.filter((f) => f.status === "open").length;

  return (
    <div>
      <PageHeader
        title="Failure Analysis"
        description="Failures should not disappear into logs. Every meaningful failure becomes a corrected rule, a new verifier, or a regression test."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Failure → Learning Loop</CardTitle>
        </CardHeader>
        <CardContent>
          <LearningLoop />
        </CardContent>
      </Card>

      <div className="mb-3 flex items-center gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1 text-[12px] font-medium transition-colors",
              filter === f ? "border-accent bg-accent-soft text-accent" : "border-border-strong text-muted hover:text-foreground"
            )}
          >
            {f === "all" ? `All (${failures.length})` : `${f.replace("-", " ")} (${failures.filter((x) => x.status === f).length})`}
          </button>
        ))}
        {openCount > 0 && filter === "all" && (
          <span className="ml-1 text-[11.5px] text-danger">{openCount} still open — active pilot blockers</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map((f) => (
          <FailureCard key={f.id} failure={f} />
        ))}
      </div>
    </div>
  );
}
