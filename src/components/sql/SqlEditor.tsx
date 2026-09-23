import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function SqlEditor({
  value,
  onChange,
  onRun,
  running,
}: {
  value: string;
  onChange: (v: string) => void;
  onRun: () => void;
  running?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/60 bg-surface">
      <div className="flex items-center justify-between border-b border-border/60 bg-black/[0.015] px-3 py-2">
        <span className="text-[11.5px] font-medium text-muted">Query editor</span>
        <Button size="sm" variant="primary" onClick={onRun} disabled={running}>
          <Play size={11} />
          {running ? "Running…" : "Run"}
        </Button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="mono h-[260px] w-full resize-none bg-transparent px-3 py-2.5 text-[12px] leading-relaxed text-foreground outline-none"
      />
    </div>
  );
}
