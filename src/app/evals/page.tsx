"use client";

import { useEngagementStore } from "@/store/useEngagementStore";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { VerifierTable } from "@/components/evals/VerifierTable";
import { EvalCaseTable } from "@/components/evals/EvalCaseTable";
import { CoverageHeatmap } from "@/components/charts/CoverageHeatmap";
import { EvalCase } from "@/types";

const ACCOUNT_CONDITIONS: EvalCase["accountCondition"][] = [
  "healthy",
  "renewal-risk",
  "expansion",
  "major-escalation",
  "low-usage",
  "new-implementation",
];
const REQUEST_TYPES: EvalCase["requestType"][] = ["qbr", "renewal-meeting", "executive-escalation", "expansion-conversation"];
const DIFFICULTIES: EvalCase["difficulty"][] = ["standard", "edge", "adversarial"];
const DATA_CONDITIONS = ["complete", "missing", "stale", "contradictory"] as const;

export default function EvalsPage() {
  const evalCases = useEngagementStore((s) => s.evalCases);
  const verifiers = useEngagementStore((s) => s.verifiers);
  const environments = useEngagementStore((s) => s.environments);

  const envById = new Map(environments.map((e) => [e.id, e]));

  const accountByRequestMatrix = ACCOUNT_CONDITIONS.map((acc) =>
    REQUEST_TYPES.map((req) => evalCases.filter((c) => c.accountCondition === acc && c.requestType === req).length)
  );

  const difficultyByDataMatrix = DIFFICULTIES.map((diff) =>
    DATA_CONDITIONS.map(
      (dc) => evalCases.filter((c) => c.difficulty === diff && envById.get(c.environmentId)?.dataCondition === dc).length
    )
  );

  return (
    <div>
      <PageHeader
        title="Eval Suite"
        description="You have not fully specified an agent until you have specified how its work will be judged. Every case pairs a task with weighted, thresholded verifiers."
      />

      <Card className="mb-4">
        <CardHeader>
          <div>
            <CardTitle>Verifiers</CardTitle>
            <CardDescription>Deterministic, LLM-judged, and agent/trajectory checks — weighted and thresholded</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <VerifierTable verifiers={verifiers} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Coverage — Account × Request Type</CardTitle>
              <CardDescription>Where testing is thin across real meeting scenarios</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <CoverageHeatmap
              rowLabels={ACCOUNT_CONDITIONS.map((a) => a.replace("-", " "))}
              colLabels={REQUEST_TYPES.map((r) => r.replace("-", " "))}
              matrix={accountByRequestMatrix}
              rowHeading="Account"
              colHeading="Request"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Coverage — Difficulty × Data Condition</CardTitle>
              <CardDescription>Where adversarial and stale/contradictory coverage is thin</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <CoverageHeatmap
              rowLabels={DIFFICULTIES}
              colLabels={DATA_CONDITIONS}
              matrix={difficultyByDataMatrix}
              rowHeading="Difficulty"
              colHeading="Data"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Eval Cases ({evalCases.length})</CardTitle>
            <CardDescription>Standard, ambiguous, missing-context, stale, conflicting, tool-failure, high-risk, injection, and noise cases</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <EvalCaseTable cases={evalCases} environments={environments} verifiers={verifiers} />
        </CardContent>
      </Card>
    </div>
  );
}
