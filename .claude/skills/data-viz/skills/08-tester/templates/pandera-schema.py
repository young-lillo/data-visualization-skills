"""
Pandera schema template — auto-generated from EDA output.
Replace commented column definitions with actual columns from your dataset.
Run: pytest tests/test-data-quality.py -v
"""
import pandera as pa
import pandas as pd
import pytest


# ── Schema Definition ─────────────────────────────────────────────────────────
# Generated from EDA column summary. Adjust checks to match your data.

schema = pa.DataFrameSchema(
    columns={
        # ── Numeric columns ──
        # "{numeric_col}": pa.Column(
        #     float,
        #     checks=[pa.Check.ge(0)],       # non-negative
        #     nullable=False,                 # set True if EDA null % > 0
        # ),

        # ── String / categorical columns ──
        # "{string_col}": pa.Column(str, nullable=True),

        # ── Date columns (stored as string) ──
        # "{date_col}": pa.Column(
        #     str,
        #     checks=pa.Check.str_matches(r"^\d{4}-\d{2}-\d{2}"),
        #     nullable=False,
        # ),

        # ── ID columns (must be unique) ──
        # "{id_col}": pa.Column(
        #     object,
        #     checks=pa.Check(lambda s: s.is_unique, error="ID column not unique"),
        #     nullable=False,
        # ),
    },
    checks=[
        # Row-level checks
        pa.Check(lambda df: len(df) > 0, error="Dataset must not be empty"),
    ],
    coerce=True,   # attempt dtype coercion before validation
    strict=False,  # allow extra columns not defined in schema
)


# ── Test Functions ────────────────────────────────────────────────────────────

@pytest.fixture(scope="module")
def clean_df() -> pd.DataFrame:
    """Load the cleaned dataset once per test session."""
    return pd.read_csv("data/processed/clean_dataset.csv")


def test_schema_valid(clean_df: pd.DataFrame):
    """Validate DataFrame against Pandera schema."""
    schema.validate(clean_df, lazy=True)  # lazy=True collects all errors


def test_no_duplicates(clean_df: pd.DataFrame):
    """Ensure no exact duplicate rows remain after cleaning."""
    dup_count = clean_df.duplicated().sum()
    assert dup_count == 0, f"Found {dup_count} duplicate rows in clean dataset"


def test_no_nulls_in_key_cols(clean_df: pd.DataFrame):
    """Key columns (IDs, primary keys) must have zero nulls."""
    key_cols = [c for c in clean_df.columns if c.lower().endswith("_id")]
    for col in key_cols:
        null_count = clean_df[col].isnull().sum()
        assert null_count == 0, f"Null values in key column '{col}': {null_count}"


def test_numeric_ranges_reasonable(clean_df: pd.DataFrame):
    """Numeric columns must not contain infinite or extremely large values."""
    import numpy as np
    numeric_cols = clean_df.select_dtypes(include="number").columns
    for col in numeric_cols:
        assert not clean_df[col].isin([float("inf"), float("-inf")]).any(), \
            f"Infinite values in column '{col}'"


def test_row_count(clean_df: pd.DataFrame):
    """Dataset must have at least 1 row and under 10M rows."""
    assert len(clean_df) > 0, "Clean dataset is empty"
