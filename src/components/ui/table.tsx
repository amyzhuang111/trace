import { cn } from "@/lib/utils";

export function Table({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className={cn("w-full border-collapse text-[12.5px]", className)}>{children}</table>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="border-b border-border">{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-border/60">{children}</tbody>;
}

export function TableRow({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(onClick && "cursor-pointer hover:bg-black/[0.015] transition-colors", className)}
    >
      {children}
    </tr>
  );
}

export function TableHead({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <th
      className={cn(
        "px-3 py-2 text-left text-[10.5px] font-semibold uppercase tracking-wide text-muted-2 whitespace-nowrap",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function TableCell({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <td className={cn("px-3 py-2.5 align-middle text-foreground", className)}>{children}</td>;
}
