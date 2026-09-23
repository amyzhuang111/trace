import { Badge, toneForStatus } from "@/components/ui/badge";
import { InvestigationStatus } from "@/types";

const LABELS: Record<InvestigationStatus, string> = {
  new: "New",
  testing: "Testing",
  validated: "Validated",
  rejected: "Rejected",
  waiting_for_data: "Waiting for data",
  ready_for_customer: "Ready for customer",
  closed: "Closed",
};

export function OperatorStatusBadge({ status }: { status: InvestigationStatus }) {
  return <Badge tone={toneForStatus(status)}>{LABELS[status]}</Badge>;
}
