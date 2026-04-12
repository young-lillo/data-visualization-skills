# Industry Question Patterns

> Content added in Phase 4 (analysis-planner).

Cross-industry analytical question patterns. Use these when dataset columns don't
match a specific industry template — map the pattern to available columns.

## Universal Patterns (Any Industry)

### Time Trends
- "How does {metric} change over time?" → Line chart (x=date, y=metric)
- "What is the month-over-month growth rate?" → Line with annotations
- "Are there seasonal patterns?" → Line with year-over-year overlay

### Rankings & Comparisons
- "What are the top 10 {entities} by {metric}?" → Horizontal bar chart
- "How do {groupA} and {groupB} compare on {metric}?" → Grouped bar chart
- "Which {category} performs best/worst?" → Sorted bar chart

### Distributions
- "What is the distribution of {numeric_col}?" → Histogram / box plot
- "Are there outliers in {numeric_col}?" → Box plot with jitter
- "What percentage falls in each {bucket}?" → Histogram with bins

### Correlations
- "Does {colA} predict {colB}?" → Scatter plot with trend line
- "Which features correlate with {target}?" → Heatmap (correlation matrix)
- "How do {colA} and {colB} interact across {group}?" → Scatter with color

### Compositions
- "What percentage of total does each {category} represent?" → Pie / donut
- "How does composition change over time?" → Stacked area / bar chart
- "What is the breakdown within each {group}?" → 100% stacked bar

## Industry-Specific KPI Formulas

### Revenue Metrics
- **AOV** (Average Order Value) = Total Revenue / Number of Orders
- **CLV** (Customer Lifetime Value) = AOV × Purchase Frequency × Avg Lifespan
- **MoM Growth** = (Current Month − Previous Month) / Previous Month × 100

### Engagement Metrics
- **Conversion Rate** = Conversions / Total Visitors × 100
- **Churn Rate** = Lost Customers / Total Customers at Start × 100
- **Retention Rate** = (End − New) / Start × 100

### Operational Metrics
- **On-Time Rate** = On-Time Deliveries / Total Deliveries × 100
- **Utilization Rate** = Actual / Capacity × 100
- **Error Rate** = Errors / Total Events × 100

## Column Name Fuzzy Matching Guide

When dataset column names differ from template expectations, use these mappings:

| Template Expects | Common Variants |
|-----------------|-----------------|
| `date` | order_date, created_at, timestamp, purchase_date, sale_date |
| `revenue` | sales, amount, total, price × quantity, gmv |
| `customer_id` | user_id, client_id, buyer_id, account_id |
| `category` | product_type, segment, class, group, dept |
| `region` | country, state, city, location, territory, zone |
| `quantity` | qty, units, count, volume, items |
