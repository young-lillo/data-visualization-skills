-- Deduplication Template
-- Variables: {table}, {partition_cols}, {order_col}
-- Usage: Replace variables with actual column/table names before running

-- 1. Preview duplicates (run first to understand scope)
SELECT {partition_col_1}, {partition_col_2}, COUNT(*) AS duplicate_count
FROM {table}
GROUP BY {partition_col_1}, {partition_col_2}
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC
LIMIT 20;

-- 2. Remove exact duplicates — keep first occurrence (SQLite / PostgreSQL)
-- Option A: Using ROW_NUMBER (recommended for PostgreSQL / BigQuery)
DELETE FROM {table}
WHERE ctid NOT IN (
    SELECT MIN(ctid)
    FROM {table}
    GROUP BY {partition_col_1}, {partition_col_2}
);

-- Option B: Using CTE with ROW_NUMBER (PostgreSQL / BigQuery)
WITH ranked AS (
    SELECT *,
           ROW_NUMBER() OVER (
               PARTITION BY {partition_col_1}, {partition_col_2}
               ORDER BY {order_col} ASC
           ) AS rn
    FROM {table}
)
DELETE FROM {table}
WHERE ctid IN (
    SELECT ctid FROM ranked WHERE rn > 1
);

-- BigQuery version (create new table, no in-place delete):
-- CREATE OR REPLACE TABLE {table}_deduped AS
-- SELECT * EXCEPT(rn) FROM (
--     SELECT *, ROW_NUMBER() OVER (
--         PARTITION BY {partition_col_1}, {partition_col_2}
--         ORDER BY {order_col}
--     ) AS rn
--     FROM {table}
-- ) WHERE rn = 1;

-- 3. Verify: confirm no duplicates remain
SELECT COUNT(*) AS total_rows,
       COUNT(DISTINCT {partition_col_1}, {partition_col_2}) AS unique_rows
FROM {table};
