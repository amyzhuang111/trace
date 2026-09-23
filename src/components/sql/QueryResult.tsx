"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SqlResultSet } from "@/types";

export function QueryResult({ result }: { result: SqlResultSet | null }) {
  if (!result) {
    return <div className="flex h-[300px] items-center justify-center text-[12.5px] text-muted-2">Run a query to see results.</div>;
  }

  const numericColIdx = result.columns.findIndex((_, i) => typeof result.rows[0]?.[i] === "number");
  const labelColIdx = result.columns.findIndex((_, i) => typeof result.rows[0]?.[i] !== "number");
  const chartData =
    result.chartHint && numericColIdx >= 0 && labelColIdx >= 0
      ? result.rows.map((r) => ({ label: String(r[labelColIdx]), value: Number(r[numericColIdx]) }))
      : null;

  return (
    <div>
      <div className="mb-3 text-[11px] text-muted-2">
        Query completed in {(result.durationMs / 1000).toFixed(1)}s · {result.rowsScanned.toLocaleString()} rows scanned
      </div>

      {chartData && (
        <div className="mb-4 h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {result.chartHint === "line" ? (
              <LineChart data={chartData} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--muted-2)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-2)" }} axisLine={false} tickLine={false} width={36} />
                <Tooltip
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <div className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-[11px] shadow-sm">{payload[0].value}</div>
                    ) : null
                  }
                />
                <Line type="monotone" dataKey="value" stroke="var(--chart-1)" strokeWidth={2.25} dot={{ r: 2.5 }} />
              </LineChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--muted-2)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-2)" }} axisLine={false} tickLine={false} width={36} />
                <Tooltip
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <div className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-[11px] shadow-sm">{payload[0].value}</div>
                    ) : null
                  }
                />
                <Bar dataKey="value" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {result.columns.map((c) => (
              <TableHead key={c} className="mono">{c}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((v, j) => (
                <TableCell key={j} className="mono tabular-nums">
                  {v === null ? "—" : String(v)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
