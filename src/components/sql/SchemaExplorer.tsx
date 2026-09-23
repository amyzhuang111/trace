import { SqlTableSchema } from "@/types";

export function SchemaExplorer({ schema }: { schema: SqlTableSchema[] }) {
  return (
    <div className="flex flex-col gap-1">
      {schema.map((t) => (
        <details key={t.table} className="group rounded-md">
          <summary className="cursor-pointer list-none rounded-md px-2.5 py-1.5 text-[12px] font-medium text-foreground hover:bg-black/[0.03]">
            <span className="mono">{t.table}</span>
            <span className="ml-1.5 text-[10.5px] font-normal text-muted-2">{t.columns.length} cols</span>
          </summary>
          <div className="ml-2.5 border-l border-border/60 pl-2.5">
            {t.columns.map((c) => (
              <div key={c.name} className="flex items-center justify-between py-0.5 text-[11px]">
                <span className="mono text-muted">{c.name}</span>
                <span className="text-muted-2">{c.type}</span>
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
