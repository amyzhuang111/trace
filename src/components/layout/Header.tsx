import { Search } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-surface px-8">
      <div className="flex items-center gap-2 text-[12.5px] text-muted">
        <span className="font-semibold text-foreground">Northstar Market</span>
        <span className="text-border-strong">·</span>
        <span>Growth operator workspace</span>
        <span className="text-border-strong">·</span>
        <span className="text-muted-2">Synthetic demo data</span>
      </div>
      <button
        type="button"
        className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-[12px] text-muted-2 hover:border-border-strong hover:text-muted transition-colors"
      >
        <Search size={13} strokeWidth={2} />
        Ask Hilbert
        <kbd className="rounded border border-border bg-background px-1 py-0.5 text-[10px] font-medium">⌘K</kbd>
      </button>
    </header>
  );
}
