"use client";

import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ValidationCheck } from "@/types";
import { cn } from "@/lib/utils";

export function ValidationChecklist({
  checks,
  onToggle,
}: {
  checks: ValidationCheck[];
  onToggle?: (id: string) => void;
}) {
  const completed = checks.filter((c) => c.completed).length;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-[12px] text-muted">
        <span>Validation checklist</span>
        <span className="font-medium text-foreground">
          {completed} / {checks.length} complete
        </span>
      </div>
      <Progress value={completed} max={checks.length} className="mb-3" />
      <div className="flex flex-col gap-1.5">
        {checks.map((c) => (
          <button
            key={c.id}
            onClick={() => onToggle?.(c.id)}
            disabled={!onToggle}
            className={cn(
              "flex items-start gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors",
              onToggle && "hover:bg-black/[0.02]",
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                c.completed ? "border-success bg-success text-white" : "border-border-strong bg-transparent",
              )}
            >
              {c.completed && <Check size={11} strokeWidth={3} />}
            </span>
            <span>
              <span className={cn("text-[12.5px]", c.completed ? "text-foreground" : "text-muted")}>{c.label}</span>
              {c.result && <span className="block text-[11.5px] text-muted-2">{c.result}</span>}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
