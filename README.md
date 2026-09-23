# Hilbert — Growth Operator Workbench

https://trace-swart.vercel.app/engagements/meridian

> Trace explores the operating layer between enterprise expertise and production AI: discovering how work actually happens, identifying high-value workflows, translating expert judgment into agent requirements, defining customer-specific evaluation criteria, benchmarking candidate configurations, and making an evidence-backed deployment decision.

This is not another executive KPI dashboard. It is built around one workflow: **question → hypothesis → evidence → falsification → judgment → customer action → product learning.** A conventional dashboard says "Revenue +4.8%." This workbench says revenue is up because price rose while volume fell, walks through the competing explanations, lets the operator run a matched-cohort test to update Hilbert's own attribution, and turns the result into a customer-ready narrative and a product-feedback item.

## Core demo case

New-customer revenue is up 11.8%, but 30-day repeat purchase fell 7.4 points — concentrated in broad paid-social cohorts acquired after a first-order discount policy change. The workbench walks through six competing hypotheses (acquisition mix, promotion depth, pricing, fulfillment, seasonality, data quality), price-normalizes the AOV gain, runs a matched-cohort promotion test, and arrives at a decomposed, non-single-factor conclusion with a $1.18M revenue-at-risk estimate and three ranked actions.

## Pages

| Route | Purpose |
|---|---|
| `/` | Operator home — today's investigation queue and Hilbert reasoning checks |
| `/customer` | Customer Overview — growth equation, revenue bridge, current economics |
| `/investigations` | Filterable list of open growth questions |
| `/investigations/[slug]` | Investigation detail — hypotheses, evidence, the "Challenge Hilbert" matched-test flow, driver decomposition, validation checklist, action options |
| `/cohorts` | Retention heatmap, cohort curves, cohort economics, cohort-vs-cohort decomposition |
| `/basket-frequency` | Frequency × basket decomposition, category attach analysis |
| `/promotions` | Redemption vs. incrementality, matched-test panel |
| `/channels` | Acquisition vs. customer-economics view toggle, budget reallocation simulator |
| `/sql-lab` | Query editor with deterministic mock results over a fictional schema |
| `/customer-readout` | Executive / analytical customer narrative, present mode |
| `/product-feedback` | Where Hilbert's reasoning needs improvement, fed back from real investigations |
| `/decision-log` | Finding → judgment → action → result → learning |
| `/data-health` | Data source freshness/completeness — context for how much to trust a finding |

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Radix primitives · Recharts · Zustand (persisted client state)

## Running locally

```bash
npm install
npm run dev
```

All data in `src/lib/mock-data/` is synthetic and deterministic — there is no live database or AI backend. Interactive state (investigation status, validation checks, the matched-cohort-test driver-decomposition update, product-feedback status, decision log entries) is held in a persisted Zustand store; use **Demo Reset** in the sidebar to restore the seeded state.
