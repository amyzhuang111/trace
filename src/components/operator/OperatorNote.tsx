export function OperatorNote({ note, label = "Operator note" }: { note: string; label?: string }) {
  return (
    <div className="rounded-md border-l-2 border-accent bg-accent-soft/30 py-2 pl-3 pr-3">
      <div className="text-[10.5px] font-semibold uppercase tracking-wide text-accent">{label}</div>
      <p className="mt-1 text-[12.5px] italic leading-relaxed text-foreground">{note}</p>
    </div>
  );
}
