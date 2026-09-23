import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { dataHealthMetrics, dataSources, dataHealthIssues } from "@/lib/mock-data/data-health";

const SOURCE_STATUS_TONE = { Healthy: "success", Degraded: "warning", Failing: "danger" } as const;
const SEVERITY_TONE = { Low: "neutral", Medium: "warning", High: "danger" } as const;
const ISSUE_STATUS_TONE = { Open: "warning", Monitoring: "accent", Resolved: "success" } as const;

export default function DataHealthPage() {
  return (
    <div>
      <PageHeader title="Data Health" description="Distinguish business signal from data artifact before trusting a finding." />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {dataHealthMetrics.map((m) => (
          <StatCard key={m.label} label={m.label} value={`${m.value}%`} tone={m.value >= 98 ? "success" : m.value >= 95 ? "warning" : "danger"} />
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Data sources</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Freshness</TableHead>
                <TableHead className="text-right">Completeness</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataSources.map((s) => (
                <TableRow key={s.source}>
                  <TableCell className="font-medium">{s.source}</TableCell>
                  <TableCell className="text-muted">{s.freshness}</TableCell>
                  <TableCell className="text-right tabular-nums">{s.completeness}%</TableCell>
                  <TableCell>
                    <Badge tone={SOURCE_STATUS_TONE[s.status]}>{s.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-[13.5px] font-semibold text-foreground">Known issues</h2>
        <div className="flex flex-col gap-3">
          {dataHealthIssues.map((issue) => (
            <Card key={issue.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[13px] font-medium text-foreground">{issue.description}</span>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Badge tone={SEVERITY_TONE[issue.severity]}>{issue.severity}</Badge>
                  <Badge tone={ISSUE_STATUS_TONE[issue.status]}>{issue.status}</Badge>
                </div>
              </div>
              <p className="mt-1.5 text-[12px] text-muted">
                <span className="font-medium text-foreground">Affected analyses:</span> {issue.affectedAnalyses.join(", ")}
              </p>
              <p className="mt-1 text-[12px] text-muted">
                <span className="font-medium text-foreground">Workaround:</span> {issue.workaround}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
