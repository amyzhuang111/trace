import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UnknownItem } from "@/types";

export function UnknownsPanel({ unknowns }: { unknowns: UnknownItem[] }) {
  if (unknowns.length === 0) return null;
  return (
    <div>
      <h3 className="mb-3 text-[13.5px] font-semibold text-foreground">Where Hilbert may still be wrong</h3>
      <div className="flex flex-col gap-2.5">
        {unknowns.map((u) => (
          <Card key={u.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="text-[13px] font-medium text-foreground">{u.statement}</span>
              <Badge tone={u.changesRecommendation ? "warning" : "neutral"} className="shrink-0">
                {u.changesRecommendation ? "Could change recommendation" : "Doesn't change recommendation"}
              </Badge>
            </div>
            <p className="mt-1.5 text-[12px] text-muted">
              <span className="font-medium text-foreground">Potential impact:</span> {u.potentialImpact}
            </p>
            <p className="mt-1 text-[12px] text-muted">
              <span className="font-medium text-foreground">Follow-up:</span> {u.followUpRequired}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
