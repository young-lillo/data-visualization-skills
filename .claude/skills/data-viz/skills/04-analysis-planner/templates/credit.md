# Credit Analysis Template

## Expected Columns
application_id, customer_id, credit_score, loan_amount, income, employment_status, loan_purpose, default, approval_status, interest_rate, age, debt_to_income

## Questions
1. What is the distribution of credit scores among applicants? → Histogram
2. How does default rate vary by credit score band? → Bar chart
3. What is the approval rate by loan purpose? → Bar chart
4. How does income correlate with loan amount requested? → Scatter
5. What is the debt-to-income ratio distribution? → Histogram / box plot
6. Which employment status has the lowest default rate? → Bar chart
7. How does interest rate vary by credit score band? → Box plot / line
8. What is the approval trend over time by loan purpose? → Line chart

## KPIs
- **Default Rate**: Defaults / Total Loans × 100
- **Approval Rate**: Approved / Total Applications × 100
- **Avg Credit Score**: MEAN(credit_score) by segment
- **Avg Loan Amount**: MEAN(loan_amount) by purpose
- **Debt-to-Income Ratio**: Total Debt / Annual Income
- **Loss Given Default (LGD)**: Amount Lost / Loan Amount at Default

## Chart Recommendations
- Score distribution: histogram (x=credit_score, bins=20, color=default)
- Default by score band: bar (x=score_band, y=default_rate)
- Approval by purpose: bar (x=loan_purpose, y=approval_rate)
- Income vs loan: scatter (x=income, y=loan_amount, color=approval_status)
- DTI distribution: box plot (x=employment_status, y=debt_to_income)
- Interest rate by score: line (x=credit_score_band, y=avg_interest_rate)
