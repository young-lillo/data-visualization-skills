# Banking Analysis Template

## Expected Columns
account_id, customer_id, transaction_date, amount, transaction_type, balance, branch, product_type, age, loan_status

## Questions
1. What is the monthly transaction volume trend? → Line chart
2. What is the distribution of account balances? → Histogram
3. Which transaction types are most common by value? → Bar chart
4. What is the loan approval vs rejection rate by product type? → Grouped bar
5. How does customer age correlate with account balance? → Scatter
6. Which branches have the highest transaction volumes? → Bar chart
7. What is the fraud detection rate over time? → Line chart
8. What is the default rate by loan product type? → Bar chart

## KPIs
- **Default Rate**: Defaulted Loans / Total Loans × 100
- **Approval Rate**: Approved Applications / Total Applications × 100
- **Avg Balance**: MEAN(balance) by segment
- **NPA Ratio** (Non-Performing Assets): Non-Performing Loans / Total Loans
- **Transaction Volume**: SUM(amount) per period
- **Customer Acquisition Cost**: Total Marketing Spend / New Customers

## Chart Recommendations
- Transaction trends: line chart (x=date, y=amount, color=transaction_type)
- Balance distribution: histogram (x=balance, bins=20)
- Loan performance: grouped bar (x=product_type, y=count, color=status)
- Age vs balance: scatter (x=age, y=balance, color=product_type)
- Branch performance: bar (x=branch, y=transaction_volume, sorted)
- Default rates: bar or line over time (x=period, y=default_rate)
