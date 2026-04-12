# Marketing Analysis Template

## Expected Columns
campaign_id, campaign_name, channel, start_date, end_date, impressions, clicks, conversions, spend, revenue, audience_segment

## Questions
1. Which marketing channels drive the highest ROI? → Bar chart
2. How does conversion rate vary by campaign and channel? → Grouped bar
3. What is the cost per acquisition (CPA) trend over time? → Line chart
4. How do impressions, clicks, and conversions funnel by channel? → Funnel chart
5. Which audience segments respond best to each channel? → Heatmap
6. What is the ROAS (Return on Ad Spend) by campaign? → Bar chart
7. How does CTR vary by day of week or time period? → Heatmap / line
8. What is the budget allocation vs revenue contribution by channel? → Bar (dual axis)

## KPIs
- **CTR** (Click-Through Rate): Clicks / Impressions × 100
- **CVR** (Conversion Rate): Conversions / Clicks × 100
- **CPA** (Cost per Acquisition): Total Spend / Conversions
- **ROAS** (Return on Ad Spend): Revenue / Ad Spend
- **CPM** (Cost per Mille): Spend / Impressions × 1000
- **LTV:CAC Ratio**: Customer Lifetime Value / Customer Acquisition Cost

## Chart Recommendations
- ROI by channel: bar (x=channel, y=roi, sorted desc)
- Conversion funnel: funnel chart (stages=impressions→clicks→conversions, color=channel)
- CPA trend: line (x=month, y=cpa, color=channel)
- Audience heatmap: heatmap (x=channel, y=audience_segment, z=conversion_rate)
- ROAS comparison: horizontal bar (x=roas, y=campaign_name, sorted)
- CTR heatmap: heatmap (x=day_of_week, y=channel, z=ctr)
