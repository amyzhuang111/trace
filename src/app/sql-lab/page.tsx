"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, Check } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SavedQueryList } from "@/components/sql/SavedQueryList";
import { SchemaExplorer } from "@/components/sql/SchemaExplorer";
import { SqlEditor } from "@/components/sql/SqlEditor";
import { QueryResult } from "@/components/sql/QueryResult";
import { savedQueries, sqlResults, schema } from "@/lib/mock-data/sql-results";
import { SqlResultSet } from "@/types";

function SqlLabInner() {
  const searchParams = useSearchParams();
  const initial = savedQueries.find((q) => q.id === searchParams.get("q"))?.id ?? savedQueries[0].id;

  const [selectedId, setSelectedId] = useState(initial);
  const [sql, setSql] = useState(savedQueries.find((q) => q.id === initial)!.sql);
  const [result, setResult] = useState<SqlResultSet | null>(sqlResults[savedQueries.find((q) => q.id === initial)!.resultId] ?? null);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  function selectQuery(id: string) {
    const q = savedQueries.find((sq) => sq.id === id);
    if (!q) return;
    setSelectedId(id);
    setSql(q.sql);
    setResult(null);
  }

  function runQuery() {
    setRunning(true);
    const q = savedQueries.find((sq) => sq.id === selectedId);
    setTimeout(() => {
      setResult(q ? sqlResults[q.resultId] ?? null : null);
      setRunning(false);
    }, 450);
  }

  async function copySql() {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div>
      <PageHeader title="SQL Lab" description="Go beneath Hilbert's answer. Deterministic mock results — no live database connection." />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved analyses</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <SavedQueryList queries={savedQueries} selectedId={selectedId} onSelect={selectQuery} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Schema</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <SchemaExplorer schema={schema} />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-9 flex flex-col gap-4">
          <SqlEditor value={sql} onChange={setSql} onRun={runQuery} running={running} />
          <div>
            <Button size="sm" variant="ghost" onClick={copySql}>
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy query"}
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              <QueryResult result={result} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SqlLabPage() {
  return (
    <Suspense fallback={null}>
      <SqlLabInner />
    </Suspense>
  );
}
