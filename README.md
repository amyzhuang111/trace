# Trace — Enterprise AI Engagement Simulator

https://trace-swart.vercel.app/engagements/meridian

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

Each module produces one of the deliverables enterprise AI engagements are actually judged on:

| Route | What it shows | Deliverable it produces |
|---|---|---|
| `/` | Engagement command center — KPIs, current recommendation, timeline against the Discover → Deploy → Improve → Monetize lifecycle | — |
| `/discovery` | Five stakeholder interviews with transcripts, extracted workflow steps, tacit judgment, and structured discovery notes (objectives, signals, decision rules, exceptions, constraints, metrics) | Structured workflow knowledge |
| `/context` | Organizational context graph (people, systems, objects) and open context gaps | Workflow + context map |
| `/opportunity` | Five candidate workflows scored and ranked on the same criteria, with a "why this score" rationale for each | Ranked list of agent opportunities + prioritized roadmap |
| `/agent-spec` | The agent specification and architecture (integrations, skills, tools), with every rule traced back to interview evidence, plus a worked customer-evidence-to-eval-case example | Production-ready agent spec |
| `/evals` | 24 eval cases, 8 weighted verifiers, and a coverage matrix across data/account/request conditions | Custom evaluation suite |
| `/experiments` | Four configurations — baseline, rejected, committed, and candidate — compared on quality × cost × latency against the committed quality bar | Model selection / optimization |
| `/failures` | Structured failure analysis feeding a failure → learning loop | Evaluation monitoring |
| `/pilot` | Go/no-go recommendation, a readiness checklist, and an editable ROI model | ROI estimates + execution plan |
| `/readout` | One-page executive engagement memo, exportable to Markdown | Executive-ready recommendation |

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

## How This Maps to Mercor Enterprise

Trace's engagement lifecycle (`/` timeline) uses Mercor Enterprise's own four stages, not an invented one, and each module targets a specific deliverable from that stage:

**Discover (Agent Diagnostics)** — `/discovery`, `/context`, `/opportunity` produce exactly Mercor's named Discover deliverables: a workflow + context map and a ranked list of agent opportunities with a prioritized roadmap.

**Deploy (Agent Deployment)** — `/agent-spec` and `/evals` produce a production-ready agent spec and a custom evaluation suite; `/pilot` is the go/no-go gate before anything ships.

**Improve (Agent Optimization)** — `/experiments` is model selection and prompt/tool optimization; `/failures` is evaluation monitoring that feeds back into the spec and eval suite.

**Monetize (Data Monetization)** — not applicable to this engagement. Meridian's Executive Account Brief workflow is an internal efficiency gain, not a data-licensing candidate, and Trace says so explicitly on the Overview timeline rather than pretending every engagement reaches every stage.

This project is informed by publicly documented Mercor Enterprise AI workflows and evaluation philosophy. It does not use real Mercor customer data, and is not affiliated with or presented as a Mercor product — Meridian Systems and its data are entirely fictional.
