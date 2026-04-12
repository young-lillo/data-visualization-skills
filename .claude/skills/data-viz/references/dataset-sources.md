# Dataset Sources

> Content added in Phase 2 (intake-skill).

Instructions for loading data from all supported source types.

## Source Type Detection

Auto-detect source type from intake input:

| Input Pattern | Source Type |
|--------------|-------------|
| Starts with `./`, `/`, `C:\`, `D:\` | Local CSV |
| Starts with `http://` or `https://` | URL CSV |
| Format `owner/dataset-name` (one slash) | Kaggle dataset |
| Format `project.dataset.table` (two dots) | BigQuery table |

## Local CSV

```python
import pandas as pd

# Standard load
df = pd.read_csv("./data/raw/dataset.csv")

# With encoding fallback (non-UTF8 files)
try:
    df = pd.read_csv(path)
except UnicodeDecodeError:
    df = pd.read_csv(path, encoding="latin-1")

# Large files — load subset for EDA
df = pd.read_csv(path, nrows=50_000)
```

Accepted formats: `.csv`, `.tsv` (use `sep="\t"`), `.csv.gz` (auto-decompressed by pandas)

## URL CSV

```python
import pandas as pd

url = "https://example.com/data/orders.csv"
df = pd.read_csv(url)
```

Common public CSV sources:
- GitHub raw: `https://raw.githubusercontent.com/user/repo/main/data.csv`
- Google Sheets: File → Share → Publish as CSV → copy link

## Kaggle Dataset

Requires kaggle CLI authenticated. See [kaggle-patterns.md](kaggle-patterns.md).

```bash
# Download slug: owner/dataset-name
kaggle datasets download -d olistbr/brazilian-ecommerce -p ./data/raw --unzip
```

Validate slug format: must match `^[a-z0-9-]+/[a-z0-9-]+$`

## BigQuery Table

Format: `project_id.dataset_id.table_id` (two dots)

Requires `pandas-gbq` installed and Google credentials configured.
See [bigquery-patterns.md](bigquery-patterns.md).

```python
import pandas_gbq

df = pandas_gbq.read_gbq(
    "SELECT * FROM `project.dataset.table` LIMIT 10000",
    project_id="your-project-id"
)
```

## Awesome Public Datasets (by Industry)

| Industry | Dataset | Source | Size |
|----------|---------|--------|------|
| Ecommerce | Olist Brazilian E-Commerce | Kaggle: `olistbr/brazilian-ecommerce` | 100k orders |
| Ecommerce | Online Retail (UCI) | [UCI ML](https://archive.ics.uci.edu/dataset/352/online+retail) | 541k rows |
| Banking | Bank Marketing (UCI) | Kaggle: `henriqueyamahata/bank-marketing` | 45k rows |
| Healthcare | Diabetes Readmission | Kaggle: `brandao/diabetes` | 100k rows |
| Education | Student Performance | Kaggle: `spscientist/students-performance-in-exams` | 1k rows |
| Credit | Credit Card Fraud | Kaggle: `mlg-ulb/creditcardfraud` | 284k rows |
| Logistics | Supply Chain Pricing | Kaggle: `divyeshardeshana/supply-chain-shipment-pricing-data` | 10k rows |
| HR | IBM Attrition | Kaggle: `pavansubhasht/ibm-hr-analytics-attrition-dataset` | 1.5k rows |
| Marketing | Marketing Campaigns | Kaggle: `jackdaoud/marketing-data` | 2.2k rows |
| Real Estate | Ames Housing | Kaggle: `prevek18/ames-housing-dataset` | 2.9k rows |
