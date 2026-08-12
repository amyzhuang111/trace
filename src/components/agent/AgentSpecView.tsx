import { AgentSpec, SystemNode } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Check, X, ShieldAlert, ArrowUpRight, Link2 } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">{title}</div>
      {children}
    </div>
  );
}

function ChipList({ items, tone = "neutral" as const }: { items: string[]; tone?: "neutral" | "accent" }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <Badge key={item} tone={tone}>{item}</Badge>
      ))}
    </div>
  );
}

export function AgentSpecView({ spec, systems }: { spec: AgentSpec; systems: SystemNode[] }) {
  const envSystems = spec.environmentSystemIds.map((id) => systems.find((s) => s.id === id)?.name ?? id);

  return (
    <div>
      <Section title="Objective">
        <p className="text-[13.5px] text-foreground leading-relaxed">{spec.objective}</p>
      </Section>

      <div className="grid grid-cols-2 gap-x-6">
        <Section title="Trigger">
          <p className="text-[13px] text-foreground">{spec.trigger}</p>
        </Section>
        <Section title="Users">
          <ChipList items={spec.users} />
        </Section>
      </div>

      <Section title="Environment">
        <ChipList items={envSystems} tone="accent" />
      </Section>

      <Section title="Agent Architecture">
        <div className="mb-2.5 text-[11.5px] text-muted">
          <span className="font-medium text-foreground">Integrations: </span>
          <ChipList items={spec.architecture.integrations} />
        </div>
        <div className="space-y-1.5">
          {spec.architecture.skills.map((skill) => (
            <div key={skill.name} className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5">
              <span className="text-[12.5px] font-medium text-foreground">{skill.name}</span>
              {skill.tools.length > 0 && (
                <span className="flex flex-wrap gap-1">
                  {skill.tools.map((t) => (
                    <Badge key={t} tone="neutral">{t}</Badge>
                  ))}
                </span>
              )}
            </div>
          ))}
        </div>
        {spec.architecture.subagents && spec.architecture.subagents.length > 0 && (
          <div className="mt-2.5">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">Subagents</div>
            <ul className="space-y-1">
              {spec.architecture.subagents.map((s) => (
                <li key={s.name} className="text-[12.5px] text-foreground">
                  <span className="font-medium">{s.name}:</span> {s.scope}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <div className="grid grid-cols-2 gap-x-6">
        <Section title="Inputs">
          <ul className="space-y-1 text-[13px] text-foreground">
            {spec.inputs.map((i) => (
              <li key={i} className="flex gap-1.5"><span className="text-muted-2">—</span>{i}</li>
            ))}
          </ul>
        </Section>
        <Section title="Required Output">
          <ul className="space-y-1 text-[13px] text-foreground">
            {spec.requiredOutputs.map((o, i) => (
              <li key={o} className="flex gap-1.5">
                <span className="text-muted-2">{i + 1}.</span>{o}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="grid grid-cols-2 gap-x-6">
        <Section title="Allowed Actions">
          <ul className="space-y-1 text-[13px]">
            {spec.allowedActions.map((a) => (
              <li key={a} className="flex gap-1.5 text-foreground">
                <Check size={14} className="mt-0.5 shrink-0 text-success" /> {a}
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Prohibited Actions">
          <ul className="space-y-1 text-[13px]">
            {spec.prohibitedActions.map((a) => (
              <li key={a} className="flex gap-1.5 text-foreground">
                <X size={14} className="mt-0.5 shrink-0 text-danger" /> {a}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="grid grid-cols-2 gap-x-6">
        <Section title="Human Approval Gate">
          <ul className="space-y-1 text-[13px] text-foreground">
            {spec.approvalGates.map((g) => (
              <li key={g} className="flex gap-1.5"><ShieldAlert size={14} className="mt-0.5 shrink-0 text-accent" />{g}</li>
            ))}
          </ul>
        </Section>
        <Section title="Escalation Rules">
          <ul className="space-y-1 text-[13px] text-foreground">
            {spec.escalationRules.map((r) => (
              <li key={r} className="flex gap-1.5"><ArrowUpRight size={14} className="mt-0.5 shrink-0 text-warning" />{r}</li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title={`Rules Linked to Evidence (${spec.rules.length})`}>
        <ul className="space-y-2">
          {spec.rules.map((rule) => (
            <li key={rule.id} className="rounded-md border border-border bg-surface px-3 py-2.5">
              <div className="text-[13px] font-medium text-foreground">{rule.rule}</div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {rule.evidence.map((e) => (
                  <span
                    key={e.id}
                    className="inline-flex items-center gap-1 rounded border border-border-strong bg-black/[0.02] px-1.5 py-0.5 text-[11px] text-muted"
                  >
                    <Link2 size={10} /> {e.label}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
