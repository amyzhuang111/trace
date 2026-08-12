import { ContextGap } from "@/types";
import { Badge, toneForSeverity, toneForStatus } from "@/components/ui/badge";

export function ContextGapsTable({ gaps }: { gaps: ContextGap[] }) {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted">
            <th className="py-2 pr-4 font-medium">Gap</th>
            <th className="py-2 pr-4 font-medium">Severity</th>
            <th className="py-2 pr-4 font-medium">Owner</th>
            <th className="py-2 pr-4 font-medium">Impact on Agent</th>
            <th className="py-2 pr-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {gaps.map((gap) => (
            <tr key={gap.id} className="border-b border-border last:border-0 align-top">
              <td className="py-2.5 pr-4">
                <div className="font-medium text-foreground">{gap.title}</div>
                <div className="mt-0.5 max-w-md text-muted">{gap.description}</div>
                <div className="mt-1 text-[11.5px] text-muted-2">Resolution: {gap.resolution}</div>
              </td>
              <td className="py-2.5 pr-4">
                <Badge tone={toneForSeverity(gap.severity)}>{gap.severity}</Badge>
              </td>
              <td className="py-2.5 pr-4 text-foreground whitespace-nowrap">{gap.owner}</td>
              <td className="py-2.5 pr-4 max-w-xs text-muted">{gap.impactOnAgent}</td>
              <td className="py-2.5 pr-4">
                <Badge tone={toneForStatus(gap.status)}>{gap.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
