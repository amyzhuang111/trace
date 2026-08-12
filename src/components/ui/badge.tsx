import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-black/[0.04] text-foreground border-border-strong",
  accent: "bg-accent-soft text-accent border-accent/20",
  success: "bg-success-soft text-success border-success/20",
  warning: "bg-warning-soft text-warning border-warning/20",
  danger: "bg-danger-soft text-danger border-danger/20",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none whitespace-nowrap",
        TONE_CLASSES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function toneForSeverity(sev: "low" | "medium" | "high" | "critical"): BadgeTone {
  if (sev === "critical" || sev === "high") return "danger";
  if (sev === "medium") return "warning";
  return "neutral";
}

export function toneForConfidence(c: "high" | "medium" | "low"): BadgeTone {
  if (c === "high") return "success";
  if (c === "medium") return "warning";
  return "neutral";
}

export function toneForStatus(s: string): BadgeTone {
  if (["done", "resolved", "regression-added", "go"].includes(s)) return "success";
  if (["pending", "in-progress", "open", "conditional-no-go"].includes(s)) return "warning";
  if (["blocked", "no-go"].includes(s)) return "danger";
  return "neutral";
}
