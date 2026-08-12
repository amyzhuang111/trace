"use client";

import { Verifier } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useEngagementStore } from "@/store/useEngagementStore";
import { formatPct } from "@/lib/utils";

const TYPE_TONE: Record<Verifier["type"], "neutral" | "accent" | "warning"> = {
  deterministic: "neutral",
  llm: "accent",
  agent: "warning",
};

export function VerifierTable({ verifiers }: { verifiers: Verifier[] }) {
  const updateVerifier = useEngagementStore((s) => s.updateVerifier);
  const totalWeight = verifiers.reduce((sum, v) => sum + v.weight, 0);

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted">
            <th className="py-2 pr-4 font-medium">Verifier</th>
            <th className="py-2 pr-4 font-medium">Weight</th>
            <th className="py-2 pr-4 font-medium">Type</th>
            <th className="py-2 pr-4 font-medium">Blocking</th>
            <th className="py-2 pr-4 font-medium">Threshold</th>
          </tr>
        </thead>
        <tbody>
          {verifiers.map((v) => (
            <tr key={v.id} className="border-b border-border last:border-0 align-top">
              <td className="py-2.5 pr-4">
                <div className="font-medium text-foreground">{v.name}</div>
                <div className="mt-0.5 max-w-md text-muted">{v.description}</div>
              </td>
              <td className="py-2.5 pr-4 tabular-nums text-foreground">{formatPct(v.weight)}</td>
              <td className="py-2.5 pr-4">
                <Badge tone={TYPE_TONE[v.type]}>{v.type}</Badge>
              </td>
              <td className="py-2.5 pr-4">
                <button
                  onClick={() => updateVerifier(v.id, { blocking: !v.blocking })}
                  className="cursor-pointer"
                  title="Click to toggle"
                >
                  <Badge tone={v.blocking ? "danger" : "neutral"}>{v.blocking ? "Yes" : "No"}</Badge>
                </button>
              </td>
              <td className="py-2.5 pr-4 tabular-nums text-foreground">{formatPct(v.threshold)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="pt-2 text-[11.5px] text-muted-2" colSpan={5}>
              Weights sum to {formatPct(totalWeight)}. Click a Blocking badge to toggle it.
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
