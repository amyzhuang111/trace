import { PilotChecklistItem } from "@/types";
import { Badge, toneForStatus } from "@/components/ui/badge";

const CATEGORY_LABEL: Record<PilotChecklistItem["category"], string> = {
  business: "Business",
  data: "Data",
  agent: "Agent",
  evaluation: "Evaluation",
  security: "Security",
};

export function ChecklistSection({ category, items }: { category: PilotChecklistItem["category"]; items: PilotChecklistItem[] }) {
  const doneCount = items.filter((i) => i.status === "done").length;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">{CATEGORY_LABEL[category]}</div>
        <span className="text-[11px] text-muted-2">
          {doneCount}/{items.length}
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id} className="rounded-md border border-border bg-surface px-2.5 py-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12.5px] font-medium text-foreground">{item.label}</span>
              <Badge tone={toneForStatus(item.status)}>{item.status}</Badge>
            </div>
            <p className="mt-0.5 text-[11.5px] text-muted">{item.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
