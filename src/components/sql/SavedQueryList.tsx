import { SavedQuery } from "@/types";
import { cn } from "@/lib/utils";

export function SavedQueryList({
  queries,
  selectedId,
  onSelect,
}: {
  queries: SavedQuery[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {queries.map((q) => (
        <button
          key={q.id}
          onClick={() => onSelect(q.id)}
          className={cn(
            "rounded-md px-2.5 py-2 text-left transition-colors",
            selectedId === q.id ? "bg-accent-soft text-accent" : "text-foreground hover:bg-black/[0.03]",
          )}
        >
          <div className="text-[12.5px] font-medium">{q.title}</div>
          <div className={cn("mt-0.5 text-[11px] leading-snug", selectedId === q.id ? "text-accent/70" : "text-muted-2")}>
            {q.description}
          </div>
        </button>
      ))}
    </div>
  );
}
