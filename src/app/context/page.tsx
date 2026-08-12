"use client";

import { useEngagementStore } from "@/store/useEngagementStore";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ContextGraph } from "@/components/context/ContextGraph";
import { ContextGapsTable } from "@/components/context/ContextGapsTable";

export default function ContextPage() {
  const systems = useEngagementStore((s) => s.systems);
  const people = useEngagementStore((s) => s.people);
  const objects = useEngagementStore((s) => s.objects);
  const edges = useEngagementStore((s) => s.edges);
  const contextGaps = useEngagementStore((s) => s.contextGaps);

  return (
    <div>
      <PageHeader
        title="Organizational Context Graph"
        description="What the agent can actually see: the people who hold context, the systems that store it, and the objects those systems own — plus what's still missing."
      />

      <ContextGraph systems={systems} people={people} objects={objects} edges={edges} />

      <Card className="mt-6">
        <CardHeader>
          <div>
            <CardTitle>Context Gap Detection</CardTitle>
            <CardDescription>Missing information the agent spec and eval suite must account for</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ContextGapsTable gaps={contextGaps} />
        </CardContent>
      </Card>
    </div>
  );
}
