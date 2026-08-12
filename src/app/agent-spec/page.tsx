"use client";

import { useState } from "react";
import { useEngagementStore } from "@/store/useEngagementStore";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentSpecView } from "@/components/agent/AgentSpecView";
import { EvidenceChain } from "@/components/agent/EvidenceChain";
import { formatDate, cn } from "@/lib/utils";

export default function AgentSpecPage() {
  const agentSpecs = useEngagementStore((s) => s.agentSpecs);
  const systems = useEngagementStore((s) => s.systems);
  const latestVersion = agentSpecs[agentSpecs.length - 1].version;
  const [selectedVersion, setSelectedVersion] = useState(latestVersion);

  const spec = agentSpecs.find((s) => s.version === selectedVersion) ?? agentSpecs[agentSpecs.length - 1];

  return (
    <div>
      <PageHeader
        title="Agent Specification"
        description="The bridge between customer discovery and engineering. Every rule links back to an interview, a workflow observation, or a failure review — not a guess."
        actions={<Badge tone="accent">v{spec.version}{spec.version === latestVersion ? " · current" : ""}</Badge>}
      />

      <div className="grid grid-cols-[1fr_260px] gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{spec.name} — v{spec.version}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <AgentSpecView spec={spec} systems={systems} />
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Version History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {agentSpecs
              .slice()
              .reverse()
              .map((s) => {
                const active = s.version === selectedVersion;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedVersion(s.version)}
                    className={cn(
                      "w-full rounded-md border px-2.5 py-2 text-left transition-colors",
                      active ? "border-accent bg-accent-soft" : "border-border hover:border-border-strong"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] font-semibold text-foreground">v{s.version}</span>
                      <span className="text-[11px] text-muted-2">{formatDate(s.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-[11.5px] text-muted leading-snug">{s.changelog}</p>
                    <div className="mt-1 text-[11px] text-muted-2">{s.rules.length} rules</div>
                  </button>
                );
              })}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Customer Evidence → Eval Case</CardTitle>
          </CardHeader>
          <CardContent>
            <EvidenceChain />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
