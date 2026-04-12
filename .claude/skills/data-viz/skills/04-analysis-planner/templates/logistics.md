# Logistics Analysis Template

## Expected Columns
shipment_id, order_date, ship_date, delivery_date, origin, destination, carrier, weight, cost, status, product_category, customer_id

## Questions
1. What is the on-time delivery rate trend by month? → Line chart
2. Which routes have the highest average delivery time? → Bar chart
3. How does shipping cost vary by carrier and weight? → Scatter / bar
4. What is the shipment volume trend by product category? → Stacked area
5. Which destinations have the most delayed deliveries? → Bar chart (sorted)
6. How does carrier performance compare on on-time rate? → Bar chart
7. What is the cost per kg by carrier? → Bar / box plot
8. What is the damage/loss rate by product category? → Bar chart

## KPIs
- **On-Time Delivery Rate**: On-Time / Total Deliveries × 100
- **Avg Transit Time**: MEAN(delivery_date − ship_date) in days
- **Cost per Unit Shipped**: Total Cost / Total Units
- **Perfect Order Rate**: Orders with no issues / Total Orders × 100
- **Return Rate**: Returned Shipments / Total Shipments × 100
- **Carrier Performance Score**: Composite of on-time, damage, cost

## Chart Recommendations
- On-time trend: line (x=month, y=on_time_rate, color=carrier)
- Route performance: bar (x=route, y=avg_delivery_days, sorted desc)
- Cost vs weight: scatter (x=weight, y=cost, color=carrier)
- Volume trend: stacked area (x=month, y=shipment_count, color=category)
- Delay hotspots: bar (x=destination, y=delay_rate, sorted desc)
- Carrier comparison: grouped bar (x=carrier, y=[on_time_rate, cost_per_kg])
