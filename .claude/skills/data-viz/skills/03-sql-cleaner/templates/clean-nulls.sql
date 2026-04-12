-- Clean Nulls Template
-- Variables: {table}, {numeric_cols}, {key_cols}, {categorical_cols}
-- Usage: Replace variables with actual column/table names before running

-- 1. Drop rows where KEY columns are null (non-negotiable nulls)
DELETE FROM {table}
WHERE {key_col_1} IS NULL
   OR {key_col_2} IS NULL;

-- 2. Fill numeric columns with median (use subquery for each col)
-- For each numeric column with >5% nulls:
UPDATE {table}
SET {numeric_col} = (
    SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY {numeric_col})
    FROM {table}
    WHERE {numeric_col} IS NOT NULL
)
WHERE {numeric_col} IS NULL;

-- 3. Fill categorical columns with mode (most frequent value)
UPDATE {table}
SET {categorical_col} = (
    SELECT {categorical_col}
    FROM {table}
    WHERE {categorical_col} IS NOT NULL
    GROUP BY {categorical_col}
    ORDER BY COUNT(*) DESC
    LIMIT 1
)
WHERE {categorical_col} IS NULL;

-- 4. Fill string columns with placeholder
UPDATE {table}
SET {string_col} = 'Unknown'
WHERE {string_col} IS NULL OR TRIM({string_col}) = '';

-- 5. Verify: count remaining nulls per column
SELECT
    COUNT(*) - COUNT({col_1}) AS nulls_{col_1},
    COUNT(*) - COUNT({col_2}) AS nulls_{col_2}
FROM {table};
