"use client";

import { useEngagementStore } from "@/store/useEngagementStore";
import { formatDate } from "@/lib/utils";

const STAGE_LABELS: Record<string, string> = {
  discover: "Discover",
  deploy: "Deploy — Evaluation Design",
  improve: "Improve",
  monetize: "Monetize",
};

export function Header() {
  const engagement = useEngagementStore((s) => s.engagement);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-surface px-8">
      <div className="flex items-center gap-2 text-[13px] text-muted">
        <span className="font-semibold text-foreground">{engagement.companyName}</span>
        <span className="text-border-strong">·</span>
        <span>{engagement.useCase}</span>
        <span className="text-border-strong">·</span>
        <span>
          Stage: <span className="text-foreground font-medium">{STAGE_LABELS[engagement.status]}</span>
        </span>
      </div>
      <div className="text-[12px] text-muted-2">Last updated {formatDate(engagement.lastUpdated)}</div>
    </header>
  );
}
