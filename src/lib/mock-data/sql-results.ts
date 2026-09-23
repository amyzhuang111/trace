import { SavedQuery, SqlResultSet, SqlTableSchema } from "@/types";

export const schema: SqlTableSchema[] = [
  {
    table: "customers",
    columns: [
      { name: "customer_id", type: "text" },
      { name: "created_at", type: "timestamp" },
      { name: "home_market", type: "text" },
      { name: "loyalty_member", type: "boolean" },
      { name: "loyalty_join_date", type: "date" },
      { name: "household_id", type: "text" },
    ],
  },
  {
    table: "orders",
    columns: [
      { name: "order_id", type: "text" },
      { name: "customer_id", type: "text" },
      { name: "order_date", type: "date" },
      { name: "gross_revenue", type: "numeric" },
      { name: "net_revenue", type: "numeric" },
      { name: "discount_amount", type: "numeric" },
      { name: "delivery_fee", type: "numeric" },
      { name: "fulfillment_type", type: "text" },
      { name: "location_id", type: "text" },
      { name: "canceled", type: "boolean" },
      { name: "on_time", type: "boolean" },
    ],
  },
  {
    table: "order_items",
    columns: [
      { name: "order_id", type: "text" },
      { name: "sku_id", type: "text" },
      { name: "quantity", type: "integer" },
      { name: "list_price", type: "numeric" },
      { name: "net_price", type: "numeric" },
      { name: "category", type: "text" },
    ],
  },
  {
    table: "acquisition",
    columns: [
      { name: "customer_id", type: "text" },
      { name: "channel", type: "text" },
      { name: "subchannel", type: "text" },
      { name: "campaign_id", type: "text" },
      { name: "acquisition_date", type: "date" },
      { name: "spend_allocated", type: "numeric" },
    ],
  },
  {
    table: "promotions",
    columns: [
      { name: "order_id", type: "text" },
      { name: "promotion_id", type: "text" },
      { name: "promotion_type", type: "text" },
      { name: "discount_amount", type: "numeric" },
      { name: "discount_pct", type: "numeric" },
    ],
  },
  {
    table: "loyalty",
    columns: [
      { name: "customer_id", type: "text" },
      { name: "status", type: "text" },
      { name: "join_date", type: "date" },
      { name: "renewal_count", type: "integer" },
    ],
  },
  {
    table: "sessions",
    columns: [
      { name: "customer_id", type: "text" },
      { name: "session_date", type: "date" },
      { name: "platform", type: "text" },
      { name: "add_to_cart", type: "boolean" },
      { name: "checkout_started", type: "boolean" },
    ],
  },
  {
    table: "product_catalog",
    columns: [
      { name: "sku_id", type: "text" },
      { name: "category", type: "text" },
      { name: "subcategory", type: "text" },
      { name: "brand", type: "text" },
      { name: "private_label", type: "boolean" },
    ],
  },
  {
    table: "fulfillment_events",
    columns: [
      { name: "order_id", type: "text" },
      { name: "promised_minutes", type: "integer" },
      { name: "actual_minutes", type: "integer" },
      { name: "substitution_count", type: "integer" },
      { name: "refund_amount", type: "numeric" },
    ],
  },
];

const COHORT_REPEAT_SQL = `WITH first_orders AS (
  SELECT
    customer_id,
    MIN(order_date) AS first_order_date
  FROM orders
  GROUP BY 1
),
cohorts AS (
  SELECT
    f.customer_id,
    DATE_TRUNC('month', f.first_order_date) AS cohort_month,
    a.channel AS acquisition_channel,
    f.first_order_date
  FROM first_orders f
  LEFT JOIN acquisition a USING (customer_id)
),
second_orders AS (
  SELECT
    customer_id,
    MIN(order_date) AS second_order_date
  FROM orders o
  WHERE EXISTS (
    SELECT 1 FROM first_orders f
    WHERE f.customer_id = o.customer_id AND o.order_date > f.first_order_date
  )
  GROUP BY 1
)
SELECT
  c.cohort_month,
  c.acquisition_channel,
  COUNT(DISTINCT c.customer_id) AS customers,
  AVG(
    CASE WHEN s.second_order_date <= c.first_order_date + INTERVAL '30 day'
    THEN 1 ELSE 0 END
  ) AS repeat_30d
FROM cohorts c
LEFT JOIN second_orders s USING (customer_id)
GROUP BY 1, 2
ORDER BY 1, 2;`;

const PROMO_DEPTH_SQL = `WITH first_orders AS (
  SELECT customer_id, order_id, order_date, discount_amount, gross_revenue
  FROM orders o
  WHERE order_date = (SELECT MIN(order_date) FROM orders WHERE customer_id = o.customer_id)
),
depth_buckets AS (
  SELECT
    customer_id,
    order_date AS first_order_date,
    CASE
      WHEN discount_amount / NULLIF(gross_revenue, 0) < 0.10 THEN '0-10%'
      WHEN discount_amount / NULLIF(gross_revenue, 0) < 0.20 THEN '10-20%'
      WHEN discount_amount / NULLIF(gross_revenue, 0) < 0.30 THEN '20-30%'
      ELSE '30%+'
    END AS discount_bucket
  FROM first_orders
),
repeat_90 AS (
  SELECT
    d.customer_id,
    MAX(CASE WHEN o.order_date <= d.first_order_date + INTERVAL '90 day' AND o.order_date > d.first_order_date THEN 1 ELSE 0 END) AS repeated
  FROM depth_buckets d
  LEFT JOIN orders o USING (customer_id)
  GROUP BY 1
)
SELECT
  d.discount_bucket,
  COUNT(DISTINCT d.customer_id) AS customers,
  AVG(r.repeated) AS repeat_90d
FROM depth_buckets d
JOIN repeat_90 r USING (customer_id)
GROUP BY 1
ORDER BY 1;`;

const FREQUENCY_BY_LOYALTY_SQL = `SELECT
  DATE_TRUNC('month', o.order_date) AS month,
  CASE WHEN l.status = 'active' THEN 'member' ELSE 'non-member' END AS loyalty_status,
  COUNT(DISTINCT o.order_id)::FLOAT / COUNT(DISTINCT o.customer_id) AS orders_per_household
FROM orders o
LEFT JOIN loyalty l USING (customer_id)
GROUP BY 1, 2
ORDER BY 1, 2;`;

const PRICE_NORMALIZED_SQL = `WITH monthly AS (
  SELECT
    DATE_TRUNC('month', o.order_date) AS month,
    SUM(oi.net_price * oi.quantity) AS net_revenue,
    SUM(oi.quantity) AS units,
    COUNT(DISTINCT o.customer_id) AS customers
  FROM orders o
  JOIN order_items oi USING (order_id)
  GROUP BY 1
)
SELECT
  month,
  net_revenue,
  units,
  net_revenue / NULLIF(units, 0) AS effective_price_per_unit,
  units::FLOAT / NULLIF(customers, 0) AS units_per_customer
FROM monthly
ORDER BY month;`;

const WIN_BACK_SQL = `WITH last_order AS (
  SELECT customer_id, MAX(order_date) AS last_order_date
  FROM orders
  GROUP BY 1
),
p180 AS (
  SELECT customer_id, AVG(net_revenue) * 4.5 AS estimated_p180_ltv
  FROM orders
  GROUP BY 1
)
SELECT COUNT(*) AS eligible_customers
FROM last_order lo
JOIN p180 USING (customer_id)
WHERE p180.estimated_p180_ltv > 220
  AND lo.last_order_date < CURRENT_DATE - INTERVAL '21 day'
  AND lo.last_order_date > CURRENT_DATE - INTERVAL '120 day';`;

const CHANNEL_LTV_CAC_SQL = `SELECT
  a.channel,
  SUM(a.spend_allocated) / COUNT(DISTINCT a.customer_id) AS cac,
  AVG(p.estimated_p180_ltv) AS avg_p180_ltv,
  AVG(p.estimated_p180_ltv) / NULLIF(SUM(a.spend_allocated) / COUNT(DISTINCT a.customer_id), 0) AS ltv_to_cac
FROM acquisition a
JOIN (
  SELECT customer_id, AVG(net_revenue) * 4.5 AS estimated_p180_ltv
  FROM orders GROUP BY 1
) p USING (customer_id)
GROUP BY 1
ORDER BY 4 DESC;`;

const PREPARED_FOODS_SQL = `WITH exposed AS (
  SELECT DISTINCT customer_id
  FROM order_items oi
  JOIN orders o USING (order_id)
  WHERE oi.category = 'Prepared Foods'
)
SELECT
  CASE WHEN e.customer_id IS NOT NULL THEN 'exposed' ELSE 'unexposed' END AS segment,
  COUNT(DISTINCT o.customer_id) AS customers,
  COUNT(DISTINCT o.order_id)::FLOAT / COUNT(DISTINCT o.customer_id) AS orders_per_customer
FROM orders o
LEFT JOIN exposed e USING (customer_id)
GROUP BY 1;`;

const DELIVERY_SLA_SQL = `SELECT
  CASE WHEN fe.actual_minutes <= fe.promised_minutes THEN 'on_time' ELSE 'late' END AS sla_bucket,
  COUNT(DISTINCT o.customer_id) AS customers,
  AVG(CASE WHEN second.order_id IS NOT NULL THEN 1 ELSE 0 END) AS repeat_rate
FROM orders o
JOIN fulfillment_events fe USING (order_id)
LEFT JOIN orders second ON second.customer_id = o.customer_id AND second.order_date > o.order_date
GROUP BY 1;`;

export const savedQueries: SavedQuery[] = [
  { id: "q-cohort-repeat", title: "30D repeat by acquisition cohort", description: "Monthly cohort × channel 30-day second-purchase rate.", sql: COHORT_REPEAT_SQL, resultId: "r-cohort-repeat" },
  { id: "q-promo-depth", title: "First-order promo depth vs 90D behavior", description: "Bucket first-order discount depth and measure 90-day repeat.", sql: PROMO_DEPTH_SQL, resultId: "r-promo-depth" },
  { id: "q-frequency-loyalty", title: "Visit frequency by loyalty tenure", description: "Monthly orders per household, split by loyalty status.", sql: FREQUENCY_BY_LOYALTY_SQL, resultId: "r-frequency-loyalty" },
  { id: "q-price-normalized", title: "Price-normalized basket trend", description: "Decompose revenue into units and effective price per unit.", sql: PRICE_NORMALIZED_SQL, resultId: "r-price-normalized" },
  { id: "q-winback", title: "Win-back eligible high-LTV households", description: "Households meeting the win-back targeting rule.", sql: WIN_BACK_SQL, resultId: "r-winback" },
  { id: "q-channel-ltv-cac", title: "Channel p180 LTV:CAC", description: "Estimated 180-day LTV to CAC ratio by acquisition channel.", sql: CHANNEL_LTV_CAC_SQL, resultId: "r-channel-ltv-cac" },
  { id: "q-prepared-foods", title: "Prepared-food attach rate", description: "Compare order frequency for prepared-food-exposed vs. unexposed customers.", sql: PREPARED_FOODS_SQL, resultId: "r-prepared-foods" },
  { id: "q-delivery-sla", title: "Delivery SLA vs repeat", description: "Compare repeat purchase rate for on-time vs. late deliveries.", sql: DELIVERY_SLA_SQL, resultId: "r-delivery-sla" },
];

export const sqlResults: Record<string, SqlResultSet> = {
  "r-cohort-repeat": {
    columns: ["cohort_month", "acquisition_channel", "customers", "repeat_30d"],
    rows: [
      ["2026-01", "paid_social", 8214, 0.362],
      ["2026-02", "paid_social", 8590, 0.358],
      ["2026-03", "paid_social", 9102, 0.351],
      ["2026-04", "paid_social", 9884, 0.347],
      ["2026-05", "paid_social", 11230, 0.303],
      ["2026-06", "paid_social", 12406, 0.278],
      ["2026-07", "paid_social", 13118, 0.254],
      ["2026-07", "paid_search", 5904, 0.343],
      ["2026-07", "organic", 8720, 0.439],
      ["2026-07", "referral", 1980, 0.474],
    ],
    rowsScanned: 18342,
    durationMs: 1420,
    chartHint: "line",
  },
  "r-promo-depth": {
    columns: ["discount_bucket", "customers", "repeat_90d"],
    rows: [
      ["0-10%", 61_400, 0.439],
      ["10-20%", 84_200, 0.362],
      ["20-30%", 52_100, 0.284],
      ["30%+", 18_900, 0.221],
    ],
    rowsScanned: 216_600,
    durationMs: 980,
    chartHint: "bar",
  },
  "r-frequency-loyalty": {
    columns: ["month", "loyalty_status", "orders_per_household"],
    rows: [
      ["2026-02", "member", 3.35],
      ["2026-02", "non-member", 2.18],
      ["2026-05", "member", 3.24],
      ["2026-05", "non-member", 2.09],
      ["2026-07", "member", 3.2],
      ["2026-07", "non-member", 2.1],
    ],
    rowsScanned: 1_080_000,
    durationMs: 2210,
    chartHint: "line",
  },
  "r-price-normalized": {
    columns: ["month", "net_revenue", "units", "effective_price_per_unit", "units_per_customer"],
    rows: [
      ["2026-02", 41_800_000, 15_240_000, 2.74, 24.1],
      ["2026-05", 44_100_000, 14_980_000, 2.94, 22.9],
      ["2026-07", 46_200_000, 14_620_000, 3.16, 21.5],
    ],
    rowsScanned: 3_240_000,
    durationMs: 1860,
    chartHint: "line",
  },
  "r-winback": {
    columns: ["eligible_customers"],
    rows: [[84_318]],
    rowsScanned: 1_700_000,
    durationMs: 640,
  },
  "r-channel-ltv-cac": {
    columns: ["channel", "cac", "avg_p180_ltv", "ltv_to_cac"],
    rows: [
      ["referral", 15.0, 196, 13.1],
      ["google_brand", 29.0, 161, 5.6],
      ["google_nonbrand", 33.9, 154, 4.5],
      ["meta_lookalike", 37.1, 167, 4.5],
      ["meta_broad", 32.1, 118, 3.7],
    ],
    rowsScanned: 267_000,
    durationMs: 890,
    chartHint: "bar",
  },
  "r-prepared-foods": {
    columns: ["segment", "customers", "orders_per_customer"],
    rows: [
      ["exposed", 181_000, 2.04],
      ["unexposed", 467_000, 1.55],
    ],
    rowsScanned: 1_080_000,
    durationMs: 1120,
    chartHint: "bar",
  },
  "r-delivery-sla": {
    columns: ["sla_bucket", "customers", "repeat_rate"],
    rows: [
      ["on_time", 601_200, 0.418],
      ["late", 46_800, 0.402],
    ],
    rowsScanned: 1_080_000,
    durationMs: 760,
    chartHint: "bar",
  },
};
