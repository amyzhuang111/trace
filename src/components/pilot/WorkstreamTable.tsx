import { PilotWorkstream, Blocker } from "@/types";
import { Badge, toneForStatus } from "@/components/ui/badge";

export function WorkstreamTable({ workstreams, blockers }: { workstreams: PilotWorkstream[]; blockers: Blocker[] }) {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted">
            <th className="py-2 pr-4 font-medium">Workstream</th>
            <th className="py-2 pr-4 font-medium">Owner</th>
            <th className="py-2 pr-4 font-medium">Status</th>
            <th className="py-2 pr-4 font-medium">Next Milestone</th>
            <th className="py-2 pr-4 font-medium">Blocked By</th>
          </tr>
        </thead>
        <tbody>
          {workstreams.map((ws) => {
            const linkedBlockers = ws.blockerIds
              .map((id) => blockers.find((b) => b.id === id))
              .filter((b): b is Blocker => Boolean(b));
            return (
              <tr key={ws.id} className="border-b border-border last:border-0 align-top">
                <td className="py-2.5 pr-4 font-medium text-foreground whitespace-nowrap">{ws.name}</td>
                <td className="py-2.5 pr-4 text-muted whitespace-nowrap">{ws.owner}</td>
                <td className="py-2.5 pr-4">
                  <Badge tone={toneForStatus(ws.status)}>{ws.status.replace("-", " ")}</Badge>
                </td>
                <td className="py-2.5 pr-4 max-w-sm text-foreground">{ws.nextMilestone}</td>
                <td className="py-2.5 pr-4">
                  {linkedBlockers.length === 0 ? (
                    <span className="text-muted-2">—</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {linkedBlockers.map((b) => (
                        <Badge key={b.id} tone="danger">{b.title}</Badge>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
