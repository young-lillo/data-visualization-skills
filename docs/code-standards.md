# Code Standards & Conventions

## Core Principles

All code in this project follows three principles:

1. **YAGNI** (You Aren't Gonna Need It) — Avoid over-engineering
2. **KISS** (Keep It Simple, Stupid) — Prefer simplicity over complexity
3. **DRY** (Don't Repeat Yourself) — Eliminate code duplication

## File Naming Conventions

### Markdown & Documentation Files
- Use lowercase with hyphens (kebab-case)
- Descriptive names that explain purpose
- Examples:
  - `project-overview-pdr.md`
  - `system-architecture.md`
  - `code-standards.md`
  - `crisp-dm-framework.md`

### Python Scripts
- Use lowercase with hyphens (kebab-case)
- Descriptive names for LLM tool discovery
- Examples:
  - `clean-nulls.sql` (SQL template)
  - `bigquery-connect.py` (BigQuery integration)
  - `pandera-schema.py` (Data validation)

### Skill Directories
- Use lowercase with hyphens (kebab-case)
- Include sequence prefix for ordered skills: `01-intake`, `02-eda`, `03-sql-cleaner`, etc.
- Example structure:
  ```
  .claude/skills/data-viz/skills/
  ├── 01-intake/
  ├── 02-eda/
  ├── 03-sql-cleaner/
  └── 04-analysis-planner/
  ```

### Configuration Files
- YAML: `.yaml` extension (not `.yml`)
- TOML: `.toml` extension
- JSON: `.json` extension
- Examples:
  - `openai.yaml`
  - `streamlit-config.toml`
  - `docker-compose.yml`

### Template Files
- Descriptive names indicating purpose and technology
- Examples:
  - `app-base.py` (Streamlit app boilerplate)
  - `bar-chart.py` (Chart component)
  - `clean-nulls.sql` (SQL template)

## Code Quality Standards

### General Guidelines
- **Readability first** — Code is read more often than written
- **Self-documenting** — Function/variable names should be clear
- **Error handling** — Use try-catch, proper exception types
- **No syntax errors** — All code must compile/run without errors
- **Pragmatism over perfection** — Don't over-lint; focus on functionality

### Python Conventions

#### Imports
```python
# Standard library first
import os
import sys
from pathlib import Path

# Third-party packages
import pandas as pd
import numpy as np
from pydantic import BaseModel

# Local imports last
from config import settings
from utils import helpers
```

#### Function/Variable Naming
```python
# Good: descriptive, lowercase with underscores
def load_dataset_from_csv(file_path: str) -> pd.DataFrame:
    """Load CSV file and return DataFrame."""
    return pd.read_csv(file_path)

# Good: clear intent
analysis_results = run_rfm_analysis(clean_data)
top_customers = get_top_n_customers(analysis_results, n=100)

# Avoid: unclear, single letters (except loop indices)
def proc(d):  # Bad: unclear what 'd' is
    return d.sum()
```

#### Class Naming (PascalCase)
```python
# Good: class names in PascalCase
class CustomerSegmentation:
    def __init__(self, data: pd.DataFrame):
        self.data = data
    
    def segment_by_value(self) -> dict:
        """Segment customers by purchase value."""
        pass

# Good: dataclass for structured data
from dataclasses import dataclass

@dataclass
class AnalysisMetrics:
    total_customers: int
    avg_purchase_value: float
    churn_rate: float
```

#### Constants
```python
# Good: UPPERCASE for module-level constants
MAX_DATASET_ROWS = 1_000_000
DEFAULT_INDUSTRY_VERTICAL = "ecommerce"
STREAMLIT_CACHE_TTL = 3600  # seconds
```

#### Type Hints
```python
# Good: use type hints for clarity
from typing import Optional, Dict, List

def process_data(
    input_file: str,
    output_file: Optional[str] = None,
    config: Dict[str, str] = None
) -> pd.DataFrame:
    """Process dataset and return cleaned DataFrame."""
    pass

def analyze_industries(industries: List[str]) -> Dict[str, float]:
    """Analyze multiple industries, return results."""
    pass
```

#### Docstrings
```python
# Good: clear docstring for every function
def calculate_rfm_score(
    transactions: pd.DataFrame,
    reference_date: str = None
) -> pd.DataFrame:
    """
    Calculate RFM (Recency, Frequency, Monetary) scores.
    
    Args:
        transactions: DataFrame with columns [customer_id, date, amount]
        reference_date: Reference date for recency (YYYY-MM-DD). Defaults to today.
    
    Returns:
        DataFrame with RFM scores and segment assignments.
    
    Raises:
        ValueError: If required columns missing.
    """
    if not all(col in transactions.columns for col in ['customer_id', 'date', 'amount']):
        raise ValueError("Missing required columns: customer_id, date, amount")
    
    # Implementation
    pass
```

#### Error Handling
```python
# Good: specific exception types, informative messages
def load_dataset(file_path: str) -> pd.DataFrame:
    """Load dataset with error handling."""
    try:
        if not Path(file_path).exists():
            raise FileNotFoundError(f"Dataset not found: {file_path}")
        
        data = pd.read_csv(file_path)
        
        if data.empty:
            raise ValueError(f"Dataset is empty: {file_path}")
        
        return data
    
    except pd.errors.ParserError as e:
        raise ValueError(f"Failed to parse CSV: {str(e)}") from e
    except Exception as e:
        print(f"Unexpected error loading {file_path}: {str(e)}")
        raise
```

### SQL Conventions

#### Style
```sql
-- Good: keywords uppercase, readable formatting
SELECT 
    customer_id,
    SUM(amount) AS total_spent,
    COUNT(*) AS purchase_count,
    MAX(purchase_date) AS last_purchase_date
FROM orders
WHERE status = 'completed'
    AND purchase_date >= '2025-01-01'
GROUP BY customer_id
ORDER BY total_spent DESC
LIMIT 100;
```

#### Naming
```sql
-- Good: snake_case for identifiers, clear intent
SELECT 
    c.customer_id,
    c.customer_name,
    COUNT(o.order_id) AS total_orders,
    SUM(o.order_amount) AS lifetime_value
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.country_code = 'US'
GROUP BY c.customer_id, c.customer_name;
```

#### Comments
```sql
-- Deduplication: keep only latest transaction per customer per day
SELECT DISTINCT ON (customer_id, transaction_date)
    customer_id,
    transaction_date,
    amount,
    status
FROM transactions
ORDER BY customer_id, transaction_date DESC;
```

### YAML/Configuration Conventions

```yaml
# Good: clear hierarchy, descriptive keys
data_viz_skill:
  name: ck:data-viz
  version: "1.0.0"
  
  phases:
    intake:
      description: "Collect project metadata"
      duration_minutes: 5
      requires_user_approval: true
    
    cook:
      description: "Automated analysis pipeline"
      duration_minutes: 15
      sub_skills:
        - 02-eda
        - 03-sql-cleaner
        - 04-analysis-planner
    
    deploy:
      description: "Test and deploy to production"
      targets:
        - streamlit
        - metabase
```

## Testing Standards

### Unit Tests
```python
# Good: clear test structure, one assertion per concept
import pytest
from unittest.mock import Mock, patch

def test_rfm_score_calculation():
    """Test RFM score calculation with sample data."""
    # Arrange: set up test data
    transactions = pd.DataFrame({
        'customer_id': [1, 1, 2, 2],
        'date': ['2025-01-01', '2025-02-01', '2025-01-15', '2025-02-15'],
        'amount': [100, 150, 200, 250]
    })
    
    # Act: execute function
    result = calculate_rfm_score(transactions)
    
    # Assert: verify results
    assert len(result) == 2, "Should have 2 unique customers"
    assert result[result['customer_id'] == 1]['segment'].values[0] == 'VIP'
    assert result[result['customer_id'] == 2]['segment'].values[0] == 'High Value'

def test_empty_dataset_raises_error():
    """Test that empty dataset raises ValueError."""
    empty_df = pd.DataFrame()
    
    with pytest.raises(ValueError, match="Dataset is empty"):
        calculate_rfm_score(empty_df)
```

### Data Quality Tests (Pandera)
```python
from pandera import Column, DataFrameSchema, Check

# Good: schema-based validation
clean_dataset_schema = DataFrameSchema({
    'customer_id': Column(int, checks=Check.greater_than(0)),
    'purchase_amount': Column(float, checks=Check.greater_than_equal(0)),
    'purchase_date': Column('datetime64[ns]'),
    'status': Column(str, checks=Check.isin(['completed', 'pending', 'cancelled'])),
})

# Use in tests
def test_data_quality():
    """Verify clean dataset meets schema."""
    clean_data = load_dataset('clean_dataset.csv')
    clean_dataset_schema.validate(clean_data)  # Raises if invalid
```

### Test Organization
```
project/
├── src/
│   ├── analysis.py
│   ├── data_loader.py
│   └── utils.py
├── tests/
│   ├── test_analysis.py        # Tests for analysis.py
│   ├── test_data_loader.py     # Tests for data_loader.py
│   ├── fixtures/               # Shared test data
│   │   ├── sample_data.csv
│   │   └── test_schemas.py
│   └── conftest.py             # Pytest configuration
└── README.md
```

## Security Standards

### Credential Management
- **NEVER** hardcode API keys, passwords, or tokens
- Use environment variables: `os.getenv('API_KEY')`
- Use `.env` files (gitignored) for local development
- Document required env vars in `.env.example`

```python
# Good: use environment variables
import os

BIGQUERY_PROJECT_ID = os.getenv('BIGQUERY_PROJECT_ID')
KAGGLE_USERNAME = os.getenv('KAGGLE_USERNAME')
KAGGLE_KEY = os.getenv('KAGGLE_KEY')

if not all([BIGQUERY_PROJECT_ID, KAGGLE_USERNAME, KAGGLE_KEY]):
    raise ValueError("Missing required environment variables")
```

### Data Privacy
- Assume user data is sensitive
- Don't log passwords, tokens, or PII
- Sanitize error messages (don't expose file paths in production)
- Document data retention policies

### Input Validation
```python
# Good: validate all user inputs
from pathlib import Path

def validate_dataset_path(file_path: str) -> Path:
    """Validate dataset path for security and accessibility."""
    path = Path(file_path).resolve()  # Resolve to absolute path
    
    # Prevent directory traversal
    if not path.is_relative_to(Path.cwd()):
        raise ValueError(f"Path outside project directory: {file_path}")
    
    if not path.exists():
        raise FileNotFoundError(f"Dataset not found: {path}")
    
    if path.suffix.lower() not in ['.csv', '.xlsx', '.parquet']:
        raise ValueError(f"Unsupported format: {path.suffix}")
    
    return path
```

## Documentation Standards

### README Files
Each major component should have a README.md:
- Brief description (1-3 sentences)
- Quick start example
- Key files and their purposes
- Links to detailed documentation

```markdown
# 04-Analysis-Planner Skill

Generate industry-specific analysis questions from dataset metadata.

## Quick Start

```python
from skills.04_analysis_planner import generate_analysis_plan

plan = generate_analysis_plan(
    industry='ecommerce',
    dataset_summary={'rows': 50000, 'columns': 8}
)
print(plan['questions'])  # List of 10-15 questions
```

## Key Files

- `SKILL.md` — Skill interface and activation
- `templates/` — Industry-specific question sets

## Documentation

See [analysis-planner.md](references/analysis-planner.md) for details.
```

### Inline Comments
```python
# Good: explain WHY, not WHAT
def calculate_customer_lifetime_value(transactions: pd.DataFrame) -> pd.Series:
    """Calculate CLV for each customer."""
    
    # Filter to completed transactions only (refunds handled separately)
    completed = transactions[transactions['status'] == 'completed']
    
    # Group by customer and sum (including refunds as negative values)
    clv = completed.groupby('customer_id')['amount'].sum()
    
    return clv
```

### API Documentation (Docstrings)
```python
def deploy_streamlit_app(
    app_code: str,
    requirements: List[str],
    github_token: str,
    repo_name: str
) -> str:
    """
    Deploy Streamlit app to Streamlit Cloud.
    
    This function handles authentication with GitHub, creates a repo secret
    for deployment, and monitors the deployment status.
    
    Args:
        app_code: Python source code (app.py contents)
        requirements: List of pip package requirements
        github_token: GitHub personal access token (env var: GITHUB_TOKEN)
        repo_name: Repository name (format: owner/repo)
    
    Returns:
        Live Streamlit app URL (format: https://owner-repo.streamlit.app)
    
    Raises:
        ValueError: If GitHub token invalid or repo not found
        TimeoutError: If deployment takes > 10 minutes
    
    Example:
        >>> url = deploy_streamlit_app(
        ...     app_code=open('app.py').read(),
        ...     requirements=['pandas', 'plotly', 'streamlit'],
        ...     github_token='ghp_...',
        ...     repo_name='owner/ecommerce-dashboard'
        ... )
        >>> print(url)
        'https://owner-ecommerce-dashboard.streamlit.app'
    """
    pass
```

## Git & Commit Standards

### Commit Message Format
Follow conventional commits:
```
feat: add RFM segmentation analysis
fix: handle null values in purchase dates
docs: update deployment guide for Metabase
test: add unit tests for data cleaner
refactor: extract SQL template generation to utility
chore: update dependencies in requirements.txt
```

**Structure:**
- Type: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`
- Scope: optional, e.g., `(api)` or `(data-viz)`
- Subject: imperative, lowercase, no period
- Body: explain why, not what (if needed)

**Examples:**
```
feat(data-viz): add ecommerce industry template

Add analysis questions and metrics for ecommerce datasets.
Includes RFM segmentation, product affinity, and churn prediction.

fix(cleaner): handle datetime parsing for BigQuery exports

Cast timestamp columns to datetime64[ns] before processing.
Prevents "object" dtype errors downstream.
```

### Branch Naming
- `feat/{feature-name}` — New features
- `fix/{issue-name}` — Bug fixes
- `docs/{doc-name}` — Documentation updates
- `refactor/{component}` — Code refactoring

Examples:
- `feat/add-metabase-deployment`
- `fix/null-value-handling`
- `docs/update-architecture-diagram`

## Code Review Checklist

Before submitting code for review:

- [ ] Code follows naming conventions (kebab-case files, snake_case functions)
- [ ] All functions have type hints and docstrings
- [ ] Error handling includes specific exception types
- [ ] No hardcoded secrets or API keys
- [ ] Unit tests written and passing
- [ ] No debug print statements or TODO comments
- [ ] Documentation updated (README, inline comments)
- [ ] Commit messages follow conventional format
- [ ] Code runs without syntax errors

## Modularization Guidelines

### When to Split Files
- Single Python file exceeds 200 lines of code
- Multiple unrelated functions grouped together
- Complex class with 10+ methods
- Data processing and presentation intermingled

### How to Split
```
# Before: monolithic file (250 lines)
data_analysis.py

# After: modular structure
data_analysis/
├── __init__.py
├── loader.py          # Data loading functions
├── cleaner.py         # Data cleaning logic
├── analyzer.py        # Analysis functions
└── utils.py           # Shared utilities
```

### Import Style (After Modularization)
```python
# In __init__.py
from .loader import load_dataset
from .cleaner import clean_dataset
from .analyzer import calculate_rfm_score

__all__ = ['load_dataset', 'clean_dataset', 'calculate_rfm_score']

# Usage
from data_analysis import load_dataset, calculate_rfm_score
```

---

**Last updated:** 2026-04-12
**Maintained by:** docs-manager subagent
