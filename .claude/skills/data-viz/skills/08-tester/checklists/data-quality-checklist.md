# Data Quality Checklist

Complete after running `02-eda` and `03-sql-cleaner`.

## Completeness
- [ ] No null values in key/ID columns
- [ ] Columns with >5% nulls have been filled or documented
- [ ] Columns with >30% nulls reviewed — drop or keep with justification
- [ ] Row count matches expected (within 5% of raw dataset)

## Uniqueness
- [ ] No exact duplicate rows
- [ ] ID columns are unique (no repeated IDs unless intentional)
- [ ] Primary key constraint verified if SQL source

## Consistency
- [ ] Date formats consistent (all ISO 8601: YYYY-MM-DD preferred)
- [ ] Numeric columns have no currency symbols or comma separators
- [ ] Categorical columns use consistent casing (all lower or title case)
- [ ] Units consistent within numeric columns (e.g., all USD, not mixed)

## Validity
- [ ] Numeric ranges are reasonable (no negative ages, prices > 0)
- [ ] No infinite or NaN values in numeric columns
- [ ] Date ranges are plausible (not year 1900 or year 9999)
- [ ] Categorical values match expected enum (e.g., country codes are valid)

## Accuracy
- [ ] Sample of raw vs cleaned data spot-checked manually
- [ ] Cleaning transformations documented (what was changed and why)
- [ ] Pandera schema test passes: `pytest tests/test-data-quality.py -v`

## EDA Report
- [ ] `reports/eda_report.html` generated and reviewed
- [ ] Key distributions reviewed for outliers
- [ ] Correlation matrix checked for unexpected relationships
