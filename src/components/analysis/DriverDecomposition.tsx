import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DriverContributionBar } from "@/components/charts/DriverContributionBar";
import { DriverContribution } from "@/types";

export function DriverDecomposition({ data, title = "Driver decomposition" }: { data: DriverContribution[]; title?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <span
          className="text-[11px] text-muted-2"
          title="Contribution is a modeled decomposition, not proof of causal effect."
        >
          Modeled decomposition
        </span>
      </CardHeader>
      <CardContent>
        <DriverContributionBar data={data} source="Estimated contribution to p180 LTV deterioration · not proof of causal effect" />
      </CardContent>
    </Card>
  );
}
