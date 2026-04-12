# Education Analysis Template

## Expected Columns
student_id, enrollment_date, graduation_date, course, grade, department, attendance, scholarship, gender, age, dropout

## Questions
1. What is the grade distribution across departments? → Histogram / box plot
2. How does attendance correlate with final grade? → Scatter
3. What is the dropout rate trend by semester? → Line chart
4. Which courses have the highest failure rates? → Bar chart
5. How does scholarship status affect GPA? → Bar / box plot
6. What is the enrollment trend by department over time? → Stacked area
7. How does gender distribution vary across departments? → Grouped bar
8. What is the on-time graduation rate by cohort year? → Bar chart

## KPIs
- **GPA**: MEAN(grade) per student
- **Dropout Rate**: Dropouts / Total Enrolled × 100
- **On-Time Graduation Rate**: Graduated on time / Total Enrolled × 100
- **Attendance Rate**: MEAN(attendance %) across students
- **Pass Rate**: Students with grade ≥ 60 / Total Students × 100
- **Scholarship Coverage**: Scholarship Students / Total Students × 100

## Chart Recommendations
- Grade distribution: histogram (x=grade, color=department)
- Attendance vs grade: scatter (x=attendance, y=grade, color=scholarship)
- Dropout trend: line (x=semester, y=dropout_rate)
- Failure rates: bar (x=course, y=failure_rate, sorted desc)
- Enrollment trend: stacked area (x=year, y=students, color=department)
- Gender by dept: grouped bar (x=department, y=count, color=gender)
