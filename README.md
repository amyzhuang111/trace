# Trace — Enterprise AI Engagement Simulator

> Trace explores the operating layer between enterprise expertise and production AI: discovering how work actually happens, identifying high-value workflows, translating expert judgment into agent requirements, defining customer-specific evaluation criteria, benchmarking candidate configurations, and making an evidence-backed deployment decision.

## The Problem

Enterprise agent projects often jump from "we should automate this workflow" straight to "let's choose a model and write a prompt." The harder work sits between those two steps: understanding how the work actually happens, surfacing the judgment senior employees apply that never made it into documentation, and defining what "good" means well enough to measure it.

## The Product

```text
Expert Interview
      ↓
Workflow + Tacit Knowledge
      ↓
Context Graph
      ↓
Opportunity Ranking
      ↓
Agent Specification
      ↓
Eval Tasks + Verifiers
      ↓
Model Experiments
      ↓
Pilot Decision
      ↓
Failure → Learning Loop
```

The demo engagement is a fictional B2B technology company, **Meridian Systems** (~8,000 employees), evaluating an **Executive Account Brief Agent** for its Strategic Accounts / Customer Success org. Account teams spend hours preparing for executive customer meetings, pulling context from Salesforce, Zendesk, product analytics, and meeting notes. Senior account managers know how to tell a real renewal risk from noise — but that judgment is mostly tacit. Trace walks through discovering that judgment, ranking it against four other candidate workflows, specifying the agent, evaluating it, and deciding whether it's ready to pilot.

## Why I Built It

Enterprise AI deployment is not simply a model-selection problem. The difficult work often sits between customer conversations, undocumented domain expertise, product requirements, engineering implementation, evaluation, and operational rollout. I built Trace to model that translation layer end-to-end — capturing expert judgment, turning it into measurable agent behavior, and making deployment decisions based on evidence rather than demos.

## Product Principles

1. **Start with work, not models.** Understand the workflow before choosing the technology.
2. **Tacit knowledge is part of the system.** The best employees' judgment is often absent from formal documentation.
3. **Evals are the specification.** An agent is not fully specified until success and failure are measurable.
4. **Human authority should be explicit.** Define what AI can do, what requires approval, and what it must never do.
5. **Failures should compound into learning.** Every meaningful failure should become a corrected rule, a new verifier, or a regression test.
6. **Optimize against the business quality bar.** The best model is not always the most capable one — use the lowest-cost setup that reliably clears the required standard. A high aggregate score can never compensate for a single serious enterprise failure.

## Modules

| Route | What it shows |
|---|---|
| `/` | Engagement command center — KPIs, current recommendation, timeline |
| `/discovery` | Five stakeholder interviews with transcripts, extracted workflow steps, tacit judgment, and structured discovery notes (objectives, signals, decision rules, exceptions, constraints, metrics) |
| `/context` | Organizational context graph (people, systems, objects) and open context gaps |
| `/opportunity` | Five candidate workflows scored and ranked on the same criteria, with a "why this score" rationale for each |
| `/agent-spec` | The agent specification and architecture (integrations, skills, tools), with every rule traced back to interview evidence, plus a worked customer-evidence-to-eval-case example |
| `/evals` | 24 eval cases, 8 weighted verifiers, and a coverage matrix across data/account/request conditions |
| `/experiments` | Four configurations — baseline, rejected, committed, and candidate — compared on quality × cost × latency against the committed quality bar |
| `/failures` | Structured failure analysis feeding a failure → learning loop |
| `/pilot` | Go/no-go recommendation, pilot workstreams (owner, status, next milestone, blockers), a readiness checklist, target pilot success metrics, and an editable ROI model |
| `/readout` | One-page executive engagement memo, exportable to Markdown |
| `/research` | Public-fact / project-inference / fictional-data sourcing notes |

Every number that appears more than once in the product — the committed score, the quality threshold, the open blocker list, the ROI figures — is computed once (`src/lib/derive/`, `src/lib/scoring/`) and read everywhere else, rather than typed separately per page.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app is fully seeded and runs with no API keys — all AI-shaped operations (workflow extraction, spec generation, judging) use deterministic mock providers by default.

Optional live providers:

```bash
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
```

## Stack

Next.js, TypeScript, React, Tailwind CSS, shadcn/ui, Zustand, Zod, Recharts, React Flow.

## What Trace Demonstrates

**Customer Discovery** — Turns stakeholder interviews into structured workflow knowledge, and reconciles conflicting definitions and priorities across stakeholders rather than deferring to a single voice.

**Structured Problem Solving** — Ranks five candidate AI opportunities against the same explicit decision criteria and shows the reasoning behind each score, not just the number.

**Product Translation** — Converts a specific line of customer feedback into a product requirement, an agent behavior, a verifier, and eval cases — a traceable chain from what was said to what gets tested.

**AI Evaluation** — Defines business-specific verifiers, blocking thresholds, and test coverage, and treats evaluation as the control point for model selection and release decisions, not a score shown at the end.

**Engagement Delivery** — Tracks workstreams, owners, blockers, and next milestones from discovery through a pilot decision.

**Commercial Judgment** — Connects deployment decisions to an editable, auditable ROI model with assumptions and projections clearly separated from anything measured.

**Executive Communication** — Produces a concise, evidence-backed recommendation a non-technical stakeholder can act on.

## A Note on Sourcing

This project is informed by publicly documented Mercor Enterprise AI workflows and evaluation philosophy (Discover → Deploy → Improve → Monetize; evals as specification; environment/task/verifier). It does not use real Mercor customer data, is not affiliated with or presented as a Mercor product, and no fictional data is ever presented as real. See `/research` in the running app for a full breakdown of what's public fact, project inference, or fictional demo data.
