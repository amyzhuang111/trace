"use client";

import { useMemo, useState } from "react";
import ReactFlow, { Background, Controls, Node, Edge, MarkerType, NodeMouseHandler } from "reactflow";
import "reactflow/dist/style.css";
import { SystemNode, PersonNode, ObjectNode, GraphEdge } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, User, Box, X } from "lucide-react";

type Props = {
  systems: SystemNode[];
  people: PersonNode[];
  objects: ObjectNode[];
  edges: GraphEdge[];
};

const COLUMN_X = { people: 40, systems: 40, objects: 40 };

function layout(systems: SystemNode[], people: PersonNode[], objects: ObjectNode[]): Node[] {
  const nodes: Node[] = [];
  const gapY = 140;
  people.forEach((p, i) => {
    nodes.push({
      id: p.id,
      position: { x: COLUMN_X.people + i * 190, y: 20 },
      data: { label: p.name, kind: "person" },
      type: "default",
      style: nodeStyle("person"),
    });
  });
  systems.forEach((s, i) => {
    nodes.push({
      id: s.id,
      position: { x: COLUMN_X.systems + i * 190, y: 20 + gapY },
      data: { label: s.name, kind: "system" },
      type: "default",
      style: nodeStyle("system"),
    });
  });
  objects.forEach((o, i) => {
    nodes.push({
      id: o.id,
      position: { x: COLUMN_X.objects + i * 145, y: 20 + gapY * 2 },
      data: { label: o.name, kind: "object" },
      type: "default",
      style: nodeStyle("object"),
    });
  });
  return nodes;
}

function nodeStyle(kind: "person" | "system" | "object"): React.CSSProperties {
  const base: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 500,
    borderRadius: 6,
    padding: "6px 10px",
    width: "auto",
  };
  if (kind === "person") return { ...base, background: "#eef2ff", border: "1px solid #c7d2fe", color: "#4f46e5" };
  if (kind === "system") return { ...base, background: "#ffffff", border: "1px solid #d4d4d8", color: "#16181d" };
  return { ...base, background: "#f7f7f8", border: "1px dashed #b8bac2", color: "#4d5057" };
}

export function ContextGraph({ systems, people, objects, edges }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const nodes = useMemo(() => layout(systems, people, objects), [systems, people, objects]);
  const flowEdges: Edge[] = useMemo(
    () =>
      edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        labelStyle: { fontSize: 10, fill: "#8a8f98" },
        style: { stroke: "#d4d4d8" },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#d4d4d8", width: 14, height: 14 },
      })),
    [edges]
  );

  const allNodes = useMemo(
    () => [...systems, ...people, ...objects],
    [systems, people, objects]
  );
  const selected = allNodes.find((n) => n.id === selectedId);

  const onNodeClick: NodeMouseHandler = (_, node) => setSelectedId(node.id);

  return (
    <div className="grid grid-cols-[1fr_300px] gap-4">
      <Card className="h-[520px] overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={flowEdges}
          onNodeClick={onNodeClick}
          fitView
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
        >
          <Background gap={18} size={1} color="#eaeaec" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </Card>

      <Card className="h-[520px] overflow-y-auto scrollbar-thin">
        {!selected && (
          <CardContent className="text-[12.5px] text-muted">
            Click a node in the graph to inspect what the agent would see: information available, ownership, freshness,
            reliability, access scope, and known gaps.
          </CardContent>
        )}
        {selected && (
          <CardContent>
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                {selected.kind === "system" && <Database size={15} className="text-accent" />}
                {selected.kind === "person" && <User size={15} className="text-accent" />}
                {selected.kind === "object" && <Box size={15} className="text-muted" />}
                <div className="text-[13.5px] font-semibold text-foreground">{selected.name}</div>
              </div>
              <button onClick={() => setSelectedId(null)} className="text-muted-2 hover:text-foreground">
                <X size={14} />
              </button>
            </div>

            {selected.kind === "system" && <SystemDetail node={selected} />}
            {selected.kind === "person" && <div className="text-[12.5px] text-muted">{selected.role}</div>}
            {selected.kind === "object" && (
              <div>
                <p className="text-[12.5px] text-muted">{selected.description}</p>
                <div className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-muted">Sourced from</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selected.sourceSystemIds.map((id) => {
                    const sys = systems.find((s) => s.id === id);
                    return <Badge key={id} tone="neutral">{sys?.name ?? id}</Badge>;
                  })}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}

const FRESHNESS_TAG_LABEL: Record<SystemNode["freshnessTags"][number], string> = {
  stale: "Stale",
  incomplete: "Incomplete",
  unreliable: "Unreliable",
  "access-restricted": "Access Restricted",
};

function SystemDetail({ node }: { node: SystemNode }) {
  return (
    <div className="space-y-2.5 text-[12.5px]">
      <Row label="Owner" value={node.owner} />
      <Row label="Freshness" value={node.freshness} />
      {node.freshnessTags.length > 0 && (
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted mb-1">Known Issue Types</div>
          <div className="flex flex-wrap gap-1">
            {node.freshnessTags.map((tag) => (
              <Badge key={tag} tone="warning">{FRESHNESS_TAG_LABEL[tag]}</Badge>
            ))}
          </div>
        </div>
      )}
      <Row
        label="Reliability"
        value={<Badge tone={node.reliability === "high" ? "success" : node.reliability === "medium" ? "warning" : "danger"}>{node.reliability}</Badge>}
      />
      <Row label="Access scope" value={node.accessScope} />
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted mb-1">Known gaps</div>
        {node.knownGaps.length === 0 ? (
          <div className="text-muted-2">None noted.</div>
        ) : (
          <ul className="space-y-1">
            {node.knownGaps.map((g, i) => (
              <li key={i} className="text-foreground before:mr-1.5 before:text-muted-2 before:content-['—']">
                {g}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted-2">{label}</span>
      <span className="text-right text-foreground">{value}</span>
    </div>
  );
}
