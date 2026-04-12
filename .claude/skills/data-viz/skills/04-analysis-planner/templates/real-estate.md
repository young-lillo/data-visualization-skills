# Real Estate Analysis Template

## Expected Columns
property_id, listing_date, sale_date, price, bedrooms, bathrooms, sqft, location, neighborhood, property_type, days_on_market, price_per_sqft

## Questions
1. How does average price per sqft vary by neighborhood? → Bar / choropleth
2. What is the price trend over time by property type? → Line chart
3. How does number of bedrooms affect sale price? → Box plot
4. What is the average days-on-market by neighborhood? → Bar chart
5. How does property size (sqft) correlate with price? → Scatter
6. What is the price distribution by property type? → Histogram / violin
7. Which neighborhoods have the fastest sales velocity? → Bar chart
8. How does listing price vs sale price vary (price reduction trend)? → Line / scatter

## KPIs
- **Median Sale Price**: MEDIAN(sale_price) by period or area
- **Price per Sqft**: sale_price / sqft
- **Days on Market (DOM)**: MEAN(sale_date − listing_date)
- **List-to-Sale Ratio**: sale_price / list_price × 100
- **Absorption Rate**: Sold Properties / Total Listed × 100
- **Price Appreciation**: (Current Median − Prior Median) / Prior Median × 100

## Chart Recommendations
- Price by neighborhood: bar (x=neighborhood, y=avg_price_per_sqft, sorted desc)
- Price trend: line (x=month, y=median_price, color=property_type)
- Bedrooms vs price: box plot (x=bedrooms, y=sale_price)
- DOM by area: bar (x=neighborhood, y=avg_days_on_market, sorted desc)
- Size vs price: scatter (x=sqft, y=sale_price, color=property_type, size=bedrooms)
- Price distribution: histogram (x=price, bins=25, color=property_type)
