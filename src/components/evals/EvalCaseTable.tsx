"use client";

import { useMemo, useState } from "react";
import { EvalCase, EnvironmentFixture, Verifier } from "@/types";
import { Badge } from "@/components/ui/badge";

const DIFFICULTY_TONE: Record<EvalCase["difficulty"], "neutral" | "warning" | "danger"> = {
  standard: "neutral",
  edge: "warning",
  adversarial: "danger",
};

function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-7 rounded-md border border-border-strong bg-surface px-2 text-[12px] text-foreground"
    >
      <option value="">{label}: All</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function EvalCaseTable({
  cases,
  environments,
  verifiers,
}: {
  cases: EvalCase[];
  environments: EnvironmentFixture[];
  verifiers: Verifier[];
}) {
  const [difficulty, setDifficulty] = useState("");
  const [requestType, setRequestType] = useState("");
  const [accountCondition, setAccountCondition] = useState("");

  const envById = useMemo(() => new Map(environments.map((e) => [e.id, e])), [environments]);
  const verifierById = useMemo(() => new Map(verifiers.map((v) => [v.id, v])), [verifiers]);

  const filtered = cases.filter(
    (c) =>
      (!difficulty || c.difficulty === difficulty) &&
      (!requestType || c.requestType === requestType) &&
      (!accountCondition || c.accountCondition === accountCondition)
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Select
          label="Difficulty"
          value={difficulty}
          onChange={setDifficulty}
          options={["standard", "edge", "adversarial"].map((v) => ({ value: v, label: v }))}
        />
        <Select
          label="Request type"
          value={requestType}
          onChange={setRequestType}
          options={["qbr", "renewal-meeting", "executive-escalation", "expansion-conversation"].map((v) => ({
            value: v,
            label: v.replace("-", " "),
          }))}
        />
        <Select
          label="Account condition"
          value={accountCondition}
          onChange={setAccountCondition}
          options={["healthy", "renewal-risk", "expansion", "major-escalation", "low-usage", "new-implementation"].map((v) => ({
            value: v,
            label: v.replace("-", " "),
          }))}
        />
        <span className="text-[11.5px] text-muted-2">
          {filtered.length} of {cases.length} cases
        </span>
      </div>

      <div className="overflow-x-auto scrollbar-thin max-h-[480px] overflow-y-auto">
        <table className="w-full text-[12.5px]">
          <thead className="sticky top-0 bg-surface">
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted">
              <th className="py-2 pr-3 font-medium">Case</th>
              <th className="py-2 pr-3 font-medium">Environment</th>
              <th className="py-2 pr-3 font-medium">Account</th>
              <th className="py-2 pr-3 font-medium">Request</th>
              <th className="py-2 pr-3 font-medium">Difficulty</th>
              <th className="py-2 pr-3 font-medium">Verifiers</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const env = envById.get(c.environmentId);
              return (
                <tr key={c.id} className="border-b border-border last:border-0 align-top">
                  <td className="py-2.5 pr-3">
                    <div className="font-medium text-foreground">{c.name}</div>
                    <div className="mt-0.5 max-w-sm text-muted">{c.task}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {c.tags.map((t) => (
                        <Badge key={t} tone="neutral">{t}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 pr-3 whitespace-nowrap text-muted">{env?.dataCondition}</td>
                  <td className="py-2.5 pr-3 whitespace-nowrap text-foreground">{c.accountCondition.replace("-", " ")}</td>
                  <td className="py-2.5 pr-3 whitespace-nowrap text-foreground">{c.requestType.replace("-", " ")}</td>
                  <td className="py-2.5 pr-3">
                    <Badge tone={DIFFICULTY_TONE[c.difficulty]}>{c.difficulty}</Badge>
                  </td>
                  <td className="py-2.5 pr-3">
                    <div className="flex flex-wrap gap-1 max-w-[220px]">
                      {c.verifierIds.map((vid) => (
                        <span key={vid} className="text-[10.5px] text-muted-2" title={verifierById.get(vid)?.description}>
                          {verifierById.get(vid)?.name}
                          {vid !== c.verifierIds[c.verifierIds.length - 1] ? "," : ""}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
