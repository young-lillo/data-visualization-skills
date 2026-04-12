# Ecommerce Analysis Template

## Expected Columns
order_id, customer_id, product, category, price, quantity, date, region, payment_method

## Questions
1. What are the top 10 products by revenue? → Bar chart (horizontal)
2. How does monthly revenue trend over time? → Line chart
3. Which customer segments drive repeat purchases? → Scatter / heatmap
4. What is the average order value by region? → Bar chart
5. How does payment method distribution vary by region? → Grouped bar / pie
6. What is the return rate trend by product category? → Line chart
7. Which day of week / hour generates most orders? → Heatmap
8. What is the customer acquisition trend (new vs returning)? → Stacked bar

## KPIs
- **Revenue**: SUM(price × quantity)
- **AOV** (Avg Order Value): Total Revenue / Number of Orders
- **CLV** (Customer Lifetime Value): AOV × Purchase Frequency × Avg Customer Lifespan
- **Conversion Rate**: Orders / Sessions × 100
- **Repeat Purchase Rate**: Customers with >1 order / Total Customers × 100
- **Cart Abandonment Rate**: Abandoned Carts / Total Initiated Carts × 100

## Chart Recommendations
- Revenue trends: line chart (x=date, y=revenue, group by month)
- Product ranking: horizontal bar (x=revenue, y=product_name, sorted desc)
- Customer segments: scatter (x=order_count, y=total_spent, color=segment)
- Regional performance: choropleth map or bar (x=region, y=revenue)
- Payment mix: pie or donut (values=payment_method, size=order_count)
- Order heatmap: heatmap (x=day_of_week, y=hour, z=order_count)
