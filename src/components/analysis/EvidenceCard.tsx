import { Card } from "@/components/ui/card";
import { CausalEvidenceBadge } from "@/components/analysis/CausalEvidenceBadge";
import { EvidenceItem } from "@/types";

export function EvidenceCard({ evidence }: { evidence: EvidenceItem }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="text-[13px] font-medium text-foreground">{evidence.title}</span>
        <CausalEvidenceBadge type={evidence.type} />
      </div>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-foreground">{evidence.result}</p>
      {evidence.caveat && <p className="mt-1.5 text-[11.5px] italic text-muted">{evidence.caveat}</p>}
      <p className="mt-2 text-[10.5px] text-muted-2">Source: {evidence.source}</p>
    </Card>
  );
}
