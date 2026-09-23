"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SqlResultSet } from "@/types";
import { formatUsd } from "@/lib/utils";

export function PriceNormalizedTrend({ result }: { result: SqlResultSet }) {
  const monthIdx = result.columns.indexOf("month");
  const revenueIdx = result.columns.indexOf("net_revenue");
  const unitsPerCustomerIdx = result.columns.indexOf("units_per_customer");
  const data = result.rows.map((r) => ({
    month: String(r[monthIdx]),
    net_revenue: Number(r[revenueIdx]),
    units_per_customer: Number(r[unitsPerCustomerIdx]),
  }));

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="mb-1.5 text-[11.5px] font-medium text-foreground">Nominal new-customer revenue</div>
        <div className="h-[160px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10.5, fill: "var(--muted-2)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis
                tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`}
                tick={{ fontSize: 10.5, fill: "var(--muted-2)" }}
                axisLine={false}
                tickLine={false}
                width={34}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-md border border-border bg-surface px-3 py-2 text-[11.5px] shadow-sm">
                      {formatUsd(payload[0].value as number)}
                    </div>
                  );
                }}
              />
              <Bar dataKey="net_revenue" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <div className="mb-1.5 text-[11.5px] font-medium text-foreground">Price-normalized units / customer</div>
        <div className="h-[160px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10.5, fill: "var(--muted-2)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 10.5, fill: "var(--muted-2)" }} axisLine={false} tickLine={false} width={34} domain={["dataMin - 1", "dataMax + 1"]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-md border border-border bg-surface px-3 py-2 text-[11.5px] shadow-sm">
                      {payload[0].value} units / customer
                    </div>
                  );
                }}
              />
              <Line type="monotone" dataKey="units_per_customer" stroke="var(--danger)" strokeWidth={2.25} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <p className="col-span-2 text-[10.5px] text-muted-2">Source: order_items · price-normalized</p>
    </div>
  );
}
