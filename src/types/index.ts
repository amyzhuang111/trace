/**
 * Hilbert Growth Operator Workbench — data model.
 *
 * Everything rendered here is a synthetic demo dataset built around a
 * fictional customer, Northstar Market. It is a portfolio artifact, not
 * real Hilbert or customer data.
 */

// ---------------------------------------------------------------------------
// Investigations
// ---------------------------------------------------------------------------

export type InvestigationStatus =
  | "new"
  | "testing"
  | "validated"
  | "rejected"
  | "waiting_for_data"
  | "ready_for_customer"
  | "closed";

export type InvestigationCategory =
  | "Acquisition"
  | "Retention"
  | "Basket"
  | "Loyalty"
  | "Promotions"
  | "Assortment"
  | "Channel"
  | "Pricing";

export type HypothesisStatus = "untested" | "supported" | "partially_supported" | "ruled_out" | "inconclusive";

export type EvidenceType = "descriptive" | "predictive" | "matched" | "experimental" | "causal";

export interface Hypothesis {
  id: string;
  label: string;
  statement: string;
  status: HypothesisStatus;
  evidenceFor: string[];
  evidenceAgainst: string[];
  confidence: number;
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: EvidenceType;
  metric?: string;
  result: string;
  source: string;
  caveat?: string;
}

export interface ValidationCheck {
  id: string;
  label: string;
  completed: boolean;
  result?: string;
}

export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  expectedImpact: number;
  impactHorizon: string;
  timeToSignal: string;
  risk: "low" | "medium" | "high";
  measurementPlan: string[];
  recommended?: boolean;
}

export interface DriverContribution {
  label: string;
  pct: number;
}

export interface UnknownItem {
  id: string;
  statement: string;
  potentialImpact: string;
  changesRecommendation: boolean;
  followUpRequired: string;
}

export interface Investigation {
  id: string;
  slug: string;
  title: string;
  question: string;
  trigger: string;
  category: InvestigationCategory;
  additionalCategories?: InvestigationCategory[];
  economicImpact: number;
  impactHorizon: string;
  hilbertConfidence: number;
  operatorStatus: InvestigationStatus;
  operatorConfidence?: "Low" | "Medium" | "High";
  customerStatus: "not_shared" | "draft" | "shared";
  hilbertAnswer: string;
  hilbertPrimaryDriver?: string;
  hilbertSecondaryDriver?: string;
  hilbertLeadingIndicator?: string;
  operatorNote?: string;
  operatorConclusion?: string;
  hypotheses: Hypothesis[];
  evidence: EvidenceItem[];
  validationChecks: ValidationCheck[];
  recommendedActions: RecommendedAction[];
  driverDecomposition?: DriverContribution[];
  unknowns: UnknownItem[];
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Product feedback
// ---------------------------------------------------------------------------

export type FeedbackType = "reasoning" | "metric_semantics" | "data_quality" | "causal_reasoning" | "segment_definition";
export type FeedbackStatus = "open" | "triaged" | "accepted" | "shipped";

export interface ProductFeedback {
  id: string;
  customer: string;
  investigationId?: string;
  title: string;
  hilbertOutput: string;
  operatorFinding: string;
  businessConsequence?: string;
  type: FeedbackType;
  severity: "low" | "medium" | "high";
  reproducible: boolean;
  reproSteps?: string;
  relevantQuery?: string;
  recommendedFix: string;
  affectedCustomers?: string;
  urgency?: "low" | "medium" | "high";
  status: FeedbackStatus;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Decision log
// ---------------------------------------------------------------------------

export interface DecisionLogEntry {
  id: string;
  investigationId?: string;
  finding: string;
  judgment: string;
  action: string;
  actionDate: string;
  result?: {
    measuredAt: string;
    metrics: { label: string; value: string; tone: "positive" | "negative" | "neutral" }[];
  };
  learning?: string;
}

// ---------------------------------------------------------------------------
// Customer
// ---------------------------------------------------------------------------

export interface CustomerProfile {
  name: string;
  synthetic: true;
  businessType: string;
  market: string;
  knownCustomers: number;
  locations: number;
  channels: string[];
  attributes: string[];
}

export interface CustomerEconomics {
  activeCustomers: number;
  monthlyRevenue: number;
  monthlyOrders: number;
  aov: number;
  ordersPerActiveCustomer: number;
  repeat90d: number;
  blendedCac: number;
  p180Ltv: number;
  loyaltyPenetration: number;
  promoOrderShare: number;
}

export interface RevenueBridgeItem {
  label: string;
  value: number;
}

export interface CustomerQuestion {
  id: string;
  question: string;
  investigationId?: string;
}

// ---------------------------------------------------------------------------
// Cohorts
// ---------------------------------------------------------------------------

export type AcquisitionChannel = "Paid Social" | "Paid Search" | "Organic" | "Referral";

export interface CohortMonthPoint {
  month: string;
  repeat30d: number;
}

export interface CohortSeries {
  channel: AcquisitionChannel;
  points: CohortMonthPoint[];
}

export interface CohortEconomics {
  cohortMonth: string;
  channel: AcquisitionChannel;
  customers: number;
  cac: number;
  firstOrderRevenue: number;
  day30Repeat: number;
  day60Repeat: number;
  p180Ltv: number;
  contributionMargin: number;
  paybackDays: number;
}

export interface CohortDiff {
  label: string;
  cohortA: string;
  cohortB: string;
  deltas: { metric: string; value: number; unit: "pp" | "pct" }[];
}

// ---------------------------------------------------------------------------
// Basket & frequency
// ---------------------------------------------------------------------------

export interface FrequencyPoint {
  period: string;
  visitsPerHousehold: number;
  segment: string;
}

export interface BasketComposition {
  basketValue: number;
  itemsPerBasket: number;
  effectivePricePerItem: number;
  categoryBreadth: number;
  privateLabelShare: number;
  promotedItemShare: number;
}

export interface CategoryAttach {
  category: string;
  penetration: number;
  attachRate: number;
  frequencyLift: number;
  margin: number;
  repeatAssociation: number;
  confidence: "Low" | "Medium" | "High";
}

export interface FrequencyBasketQuadrantPoint {
  segment: string;
  frequency: number;
  basket: number;
  customers: number;
}

// ---------------------------------------------------------------------------
// Promotions
// ---------------------------------------------------------------------------

export interface PromotionRow {
  id: string;
  offer: string;
  customers: number;
  redemption: number;
  incrementalConversion: number;
  repeat30d: number;
  incrementalMargin: number;
  p180Ltv: number;
  likelyIncrementality: "Low" | "Medium" | "High";
  status: "Active" | "Testing" | "Retired";
}

export interface PromoIncrementality {
  offer: string;
  observedConversionLift: number;
  matchedIncrementalConversion: number;
  firstOrderMarginDelta: number;
  repeat90dDelta: number;
  p180Contribution: number;
}

export interface PromoScatterPoint {
  customerId: string;
  discountPct: number;
  repeat90d: number;
  customers: number;
  channel: AcquisitionChannel;
}

// ---------------------------------------------------------------------------
// Channels
// ---------------------------------------------------------------------------

export interface ChannelRow {
  channel: string;
  spend: number;
  customers: number;
  mixChangePP: number;
  cac: number;
  firstOrderRoas: number | null;
  repeat30d: number;
  p180Ltv: number;
  contributionPerCustomer: number;
  qualityTrend: number;
}

// ---------------------------------------------------------------------------
// Loyalty
// ---------------------------------------------------------------------------

export interface LoyaltyComparisonRow {
  group: "Members" | "Matched non-members" | "Raw non-members";
  frequency: number;
  basket: number;
  retention: number;
  p180Ltv: number;
  contribution: number;
}

// ---------------------------------------------------------------------------
// Win-back / assortment
// ---------------------------------------------------------------------------

export interface WinBackSummary {
  eligibleCustomers: number;
  expectedReactivationRate: number;
  recoveredContribution: number;
  criteria: string[];
}

// ---------------------------------------------------------------------------
// SQL Lab
// ---------------------------------------------------------------------------

export interface SqlColumn {
  name: string;
  type: string;
}

export interface SqlTableSchema {
  table: string;
  columns: SqlColumn[];
}

export interface SavedQuery {
  id: string;
  title: string;
  description: string;
  sql: string;
  resultId: string;
}

export interface SqlResultSet {
  columns: string[];
  rows: (string | number | null)[][];
  rowsScanned: number;
  durationMs: number;
  chartHint?: "bar" | "line" | "scatter";
}

// ---------------------------------------------------------------------------
// Data health
// ---------------------------------------------------------------------------

export interface DataHealthMetric {
  label: string;
  value: number;
}

export interface DataSourceRow {
  source: string;
  freshness: string;
  completeness: number;
  status: "Healthy" | "Degraded" | "Failing";
}

export interface DataHealthIssue {
  id: string;
  description: string;
  affectedAnalyses: string[];
  severity: "Low" | "Medium" | "High";
  workaround: string;
  status: "Open" | "Monitoring" | "Resolved";
}

// ---------------------------------------------------------------------------
// Readout
// ---------------------------------------------------------------------------

export interface ReadoutEntry {
  investigationId: string;
  finding: string;
  chartHint?: string;
  moneyAtStake: string;
  action: string;
  caveat: string;
}

export interface CustomerMoment {
  title: string;
  when: string;
  needsReady: string;
  outstandingAnalysis: string;
  owner: string;
}
