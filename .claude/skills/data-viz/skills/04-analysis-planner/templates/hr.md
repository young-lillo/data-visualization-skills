# HR Analytics Template

## Expected Columns
employee_id, hire_date, termination_date, department, job_role, salary, performance_score, satisfaction_score, age, gender, attrition, years_at_company

## Questions
1. What is the employee attrition rate by department? → Bar chart
2. How does salary distribution vary across job roles? → Box plot
3. What factors correlate most with attrition? → Heatmap (correlation)
4. How does performance score distribute by department? → Box plot / histogram
5. What is the hiring trend by department over time? → Stacked area
6. How does satisfaction score vary by years at company? → Line / scatter
7. What is the gender pay gap by department? → Grouped bar
8. Which departments have the highest average tenure? → Bar chart

## KPIs
- **Turnover Rate**: Terminations / Avg Headcount × 100
- **Avg Tenure**: MEAN(termination_date − hire_date) for terminated employees
- **Attrition Rate**: Attrited / Total Employees × 100
- **Salary Equity Ratio**: Avg Female Salary / Avg Male Salary
- **Avg Performance Score**: MEAN(performance_score) by department
- **Employee Satisfaction Index**: MEAN(satisfaction_score)
- **Headcount Growth**: (End Headcount − Start) / Start × 100

## Chart Recommendations
- Attrition by dept: bar (x=department, y=attrition_rate, sorted desc)
- Salary distribution: box plot (x=job_role, y=salary, sorted by median)
- Correlation heatmap: heatmap of numeric columns vs attrition
- Performance dist: violin or box (x=department, y=performance_score)
- Hiring trend: stacked area (x=quarter, y=new_hires, color=department)
- Satisfaction vs tenure: scatter (x=years_at_company, y=satisfaction_score)
