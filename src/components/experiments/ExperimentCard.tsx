import { Experiment, Verifier, ExperimentStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatPct, formatUsd, formatDate } from "@/lib/utils";
import { Check, X } from "lucide-react";

const STATUS_LABEL: Record<ExperimentStatus, string> = {
  committed: "Committed",
  candidate: "Candidate",
  rejected: "Rejected",
  baseline: "Baseline",
};

const STATUS_TONE: Record<ExperimentStatus, "success" | "accent" | "danger" | "neutral"> = {
  committed: "success",
  candidate: "accent",
  rejected: "danger",
  baseline: "neutral",
};

export function ExperimentCard({
  experiment,
  verifiers,
  color,
  totalCases,
}: {
  experiment: Experiment;
  verifiers: Verifier[];
  color: string;
  totalCases: number;
}) {
  const failedCases = experiment.results.filter((r) => !r.passed);

  return (
    <div className="rounded-md border border-border bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />
          <div>
            <div className="text-[13px] font-semibold text-foreground">{experiment.label}</div>
            <div className="text-[11.5px] text-muted">
              spec v{experiment.agentVersion} · {experiment.config.tools.length} tools · reasoning: {experiment.config.reasoning} · prompt {experiment.config.promptVersion}
            </div>
            <div className="mt-0.5 text-[11px] text-muted-2">
              {experiment.casesEvaluated}/{totalCases} cases · {experiment.evalSuiteVersion} · {formatDate(experiment.runDate)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={STATUS_TONE[experiment.status]}>{STATUS_LABEL[experiment.status]}</Badge>
          <Badge tone={experiment.passedPilotThreshold ? "success" : "danger"}>
            {experiment.passedPilotThreshold ? "Clears bar" : "Below bar"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 px-4 py-3 border-b border-border">
        <Metric label="Overall Score" value={formatPct(experiment.score)} />
        <Metric label="Cost / Task" value={formatUsd(experiment.costPerTaskUsd)} />
        <Metric label="Latency" value={`${experiment.latencySeconds}s`} />
      </div>

      <div className="px-4 py-3 border-b border-border">
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">Per-verifier score</div>
        <div className="space-y-1.5">
          {experiment.verifierBreakdown.map((vb) => {
            const v = verifiers.find((x) => x.id === vb.verifierId);
            if (!v) return null;
            const passed = vb.score >= v.threshold;
            return (
              <div key={vb.verifierId} className="flex items-center gap-2 text-[11.5px]">
                <span className="w-40 shrink-0 truncate text-muted">{v.name}</span>
                <div className="h-1.5 flex-1 rounded-full bg-black/[0.06]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${vb.score * 100}%`, background: passed ? "#0ca30c" : "#d03b3b" }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right tabular-nums text-foreground">{formatPct(vb.score)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 px-4 py-3">
        <div>
          <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
            <Check size={12} className="text-success" /> Strengths
          </div>
          <ul className="space-y-0.5">
            {experiment.strengths.map((s, i) => (
              <li key={i} className="text-[11.5px] text-foreground">{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
            <X size={12} className="text-danger" /> Weaknesses
          </div>
          <ul className="space-y-0.5">
            {experiment.weaknesses.map((s, i) => (
              <li key={i} className="text-[11.5px] text-foreground">{s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-border bg-black/[0.012]">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted mb-1">Recommendation</div>
        <p className="text-[12.5px] text-foreground leading-relaxed">{experiment.recommendation}</p>
        <p className="mt-1.5 text-[11px] text-muted-2">
          {failedCases.length} of {experiment.results.length} eval cases failed.
        </p>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10.5px] font-medium uppercase tracking-wide text-muted-2">{label}</div>
      <div className="text-[15px] font-semibold tabular-nums text-foreground">{value}</div>
    </div>
  );
}
