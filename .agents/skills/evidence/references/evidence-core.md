# Evidence Core

## Project Structure

Typical Evidence.dev project layout:

```text
evidence/
  package.json
  pages/
  sources/
    <source-name>/
  components/
```

- `pages/` holds `.md` pages and presentation flow
- `sources/<name>/` holds SQL definitions and source-specific logic
- `components/` holds reusable UI fragments when markdown alone is not enough
- `package.json` defines Evidence scripts and dependencies

## Source Definition

- define SQL in `sources/<name>/`
- keep one logical dataset per source area
- use native DuckDB-friendly SQL patterns

## Page Authoring

- author pages as `.md`
- embed SQL fences for page-local queries
- reference components directly in markdown

Example:

```markdown
~~~sql orders
SELECT month, sum(revenue) AS revenue
FROM sales
GROUP BY month
~~~

<BarChart data={orders} x=month y=revenue />
```

## DuckDB SQL Patterns

```sql
-- Read CSV
SELECT * FROM read_csv_auto('sources/data/sales.csv');

-- Read Parquet
SELECT * FROM 'sources/data/sales.parquet';
```

## Built-In Components

- `BarChart`
- `LineChart`
- `ScatterPlot`
- `DataTable`
- `BigValue`
- `AreaChart`
- `FunnelChart`
- `Histogram`

## Input Components

- `Dropdown`
- `DatePicker`
- `Slider`
- `Checkbox`

## Credential Pattern

- use `connection.options.yaml` for local development only when needed
- use environment variables in production
- never hardcode credentials in source files
