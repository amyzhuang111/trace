"use client";

import { useMemo, useState } from "react";
import { useEngagementStore } from "@/store/useEngagementStore";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ExtractionView } from "@/components/discovery/ExtractionView";
import { extractWorkflow } from "@/lib/ai/client";
import { formatDate, cn } from "@/lib/utils";
import { Sparkles, Loader2 } from "lucide-react";

export default function DiscoveryPage() {
  const experts = useEngagementStore((s) => s.experts);
  const interviews = useEngagementStore((s) => s.interviews);
  const setInterviewExtraction = useEngagementStore((s) => s.setInterviewExtraction);
  const [selectedId, setSelectedId] = useState(interviews[1]?.id ?? interviews[0]?.id);
  const [extracting, setExtracting] = useState(false);

  const selected = interviews.find((i) => i.id === selectedId) ?? interviews[0];
  const expert = experts.find((e) => e.id === selected?.expertId);

  const expertById = useMemo(() => new Map(experts.map((e) => [e.id, e])), [experts]);

  async function handleExtract() {
    if (!selected) return;
    setExtracting(true);
    try {
      const { result } = await extractWorkflow(selected.transcript);
      setInterviewExtraction(selected.id, result);
    } finally {
      setExtracting(false);
    }
  }

  if (!selected || !expert) return null;

  return (
    <div>
      <PageHeader
        title="Expert Discovery"
        description="Stakeholder interviews are the raw material. Every downstream artifact — workflow steps, tacit rules, the agent spec, even eval cases — should trace back to something said here."
      />

      <div className="grid grid-cols-[260px_1fr] gap-4">
        <div className="space-y-1.5">
          {interviews.map((interview) => {
            const e = expertById.get(interview.expertId);
            if (!e) return null;
            const active = interview.id === selectedId;
            return (
              <button
                key={interview.id}
                onClick={() => setSelectedId(interview.id)}
                className={cn(
                  "w-full rounded-md border px-3 py-2.5 text-left transition-colors",
                  active ? "border-accent bg-accent-soft" : "border-border bg-surface hover:border-border-strong"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-white">
                    {e.avatarInitials}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[12.5px] font-medium text-foreground">{e.name}</div>
                    <div className="truncate text-[11px] text-muted">{e.role}</div>
                  </div>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[11px] text-muted-2">{formatDate(interview.date)}</span>
                  {interview.extraction ? (
                    <Badge tone="success">extracted</Badge>
                  ) : (
                    <Badge tone="neutral">not yet analyzed</Badge>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <Card>
          <CardContent className="pt-4">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="text-[14px] font-semibold text-foreground">{expert.name}</div>
                <div className="text-[12.5px] text-muted">
                  {expert.role} · {expert.domain} · {expert.tenureYears} years tenure
                </div>
                <div className="mt-1 text-[11px] text-muted-2">
                  Interviewed {formatDate(selected.date)} · {selected.durationMinutes} min
                </div>
              </div>
              <Button variant="primary" size="sm" onClick={handleExtract} disabled={extracting}>
                {extracting ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                {selected.extraction ? "Re-extract Workflow Knowledge" : "Extract Workflow Knowledge"}
              </Button>
            </div>

            <Tabs defaultValue="transcript">
              <TabsList>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="extraction">
                  Extraction {selected.extraction && `(${selected.extraction.steps.length + selected.extraction.tacitRules.length})`}
                </TabsTrigger>
                <TabsTrigger value="meta">Discovery Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="transcript" className="pt-4">
                <div className="whitespace-pre-line rounded-md border border-border bg-black/[0.015] px-4 py-3 text-[13px] leading-relaxed text-foreground">
                  {selected.transcript}
                </div>
              </TabsContent>

              <TabsContent value="extraction" className="pt-4">
                {selected.extraction ? (
                  <ExtractionView extraction={selected.extraction} />
                ) : (
                  <div className="rounded-md border border-dashed border-border-strong px-4 py-8 text-center text-[13px] text-muted">
                    No structured extraction yet. Click <span className="font-medium text-foreground">Extract Workflow Knowledge</span> to
                    generate workflow steps and tacit rules from this transcript.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="meta" className="pt-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <div className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-widest text-accent">What the stakeholder wants</div>
                    <div className="space-y-4">
                      <MetaList title="Objectives" items={selected.objectives} />
                      <MetaList title="Pain Points" items={selected.painPoints} />
                      <MetaList title="Quality Criteria" items={selected.qualityCriteria} />
                      <MetaList title="Metrics" items={selected.metrics} />
                      <MetaList title="Systems Referenced" items={selected.systemsReferenced} />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-widest text-accent">How the work actually breaks</div>
                    <div className="space-y-4">
                      <MetaList title="Signals" items={selected.signals} />
                      <MetaList title="Decision Rules" items={selected.decisionRules} />
                      <MetaList title="Exceptions" items={selected.exceptions} />
                      <MetaList title="Edge Cases Noted" items={selected.edgeCasesNoted} />
                      <MetaList title="Open Questions" items={selected.openQuestions} />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetaList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">{title}</div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-[12.5px] text-foreground before:mr-1.5 before:text-muted-2 before:content-['—']">
            {item}
          </li>
        ))}
        {items.length === 0 && <li className="text-[12px] text-muted-2">None noted.</li>}
      </ul>
    </div>
  );
}
