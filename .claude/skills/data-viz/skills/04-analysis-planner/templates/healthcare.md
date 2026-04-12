# Healthcare Analysis Template

## Expected Columns
patient_id, admission_date, discharge_date, diagnosis, department, age, gender, cost, readmitted, length_of_stay, treatment

## Questions
1. What are the most common diagnoses by admission count? → Bar chart
2. How does average length of stay vary by department? → Bar chart
3. What is the 30-day readmission rate trend over time? → Line chart
4. How does patient age distribute across departments? → Box plot / histogram
5. What is the average treatment cost by diagnosis? → Bar chart
6. Which departments have the highest cost per patient? → Bar chart
7. What is the correlation between length of stay and cost? → Scatter
8. How does readmission rate vary by age group? → Bar / line

## KPIs
- **30-Day Readmission Rate**: Readmissions within 30 days / Total Discharges × 100
- **Avg Length of Stay (LOS)**: MEAN(discharge_date − admission_date)
- **Cost per Patient**: SUM(cost) / COUNT(patient_id)
- **Bed Occupancy Rate**: Occupied Beds / Total Beds × 100
- **Mortality Rate**: Deaths / Total Admissions × 100
- **Patient Satisfaction Score**: MEAN(satisfaction_rating)

## Chart Recommendations
- Top diagnoses: horizontal bar (x=count, y=diagnosis, sorted desc)
- LOS by dept: bar chart (x=department, y=avg_los, error bars for std)
- Readmission trend: line chart (x=month, y=readmission_rate)
- Age distribution: histogram per department or box plot (x=dept, y=age)
- Cost analysis: bar (x=diagnosis, y=avg_cost, sorted desc)
- LOS vs cost: scatter (x=length_of_stay, y=cost, color=department)
