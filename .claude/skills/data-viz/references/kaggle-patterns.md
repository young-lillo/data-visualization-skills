# Kaggle Patterns

> Content added in Phase 3 (eda-and-cleaning).

Instructions for authenticating, downloading, and using Kaggle datasets.

## Authentication Setup

### Option 1: API Token File
1. Go to [kaggle.com/settings](https://www.kaggle.com/settings) → API → "Create New Token"
2. Download `kaggle.json` (contains `username` + `key`)
3. Place at `~/.kaggle/kaggle.json` (Linux/Mac) or `%USERPROFILE%\.kaggle\kaggle.json` (Windows)
4. Set permissions: `chmod 600 ~/.kaggle/kaggle.json`

### Option 2: Environment Variables
```bash
export KAGGLE_USERNAME="your_username"
export KAGGLE_KEY="your_api_key"
```

### Option 3: Streamlit Secrets
```toml
# .streamlit/secrets.toml
KAGGLE_USERNAME = "your_username"
KAGGLE_KEY = "your_api_key"
```

```python
import os
import streamlit as st
os.environ["KAGGLE_USERNAME"] = st.secrets["KAGGLE_USERNAME"]
os.environ["KAGGLE_KEY"] = st.secrets["KAGGLE_KEY"]
```

## Dataset Slug Format

Kaggle dataset slug: `owner/dataset-name`

Examples:
- `olistbr/brazilian-ecommerce`
- `mlg-ulb/creditcardfraud`
- `CooperUnion/pharmacies`

URL format: `https://www.kaggle.com/datasets/{owner}/{dataset-name}`
Slug = `{owner}/{dataset-name}` (everything after `/datasets/`)

## Download Commands

```bash
# Download and unzip to ./data directory
kaggle datasets download -d owner/dataset-name -p ./data --unzip

# List files in a dataset (before downloading)
kaggle datasets files owner/dataset-name

# Check authentication
kaggle datasets list --search "ecommerce" --max-size 100
```

## Python Download Script

```python
import os
import subprocess
from pathlib import Path

def download_kaggle_dataset(slug: str, output_dir: str = "./data/raw") -> Path:
    """Download Kaggle dataset. Returns path to first CSV found."""
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    # Verify auth
    result = subprocess.run(["kaggle", "datasets", "files", slug], capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"Kaggle auth failed or dataset not found: {slug}\n{result.stderr}")

    # Download + unzip
    subprocess.run(
        ["kaggle", "datasets", "download", "-d", slug, "-p", output_dir, "--unzip"],
        check=True
    )

    # Find first CSV
    csvs = list(Path(output_dir).glob("**/*.csv"))
    if not csvs:
        raise FileNotFoundError(f"No CSV files found after downloading {slug}")
    return csvs[0]
```

## Common Public Datasets by Industry

| Industry | Dataset | Slug |
|----------|---------|------|
| Ecommerce | Brazilian E-Commerce (Olist) | `olistbr/brazilian-ecommerce` |
| Banking | Bank Marketing | `henriqueyamahata/bank-marketing` |
| Healthcare | Hospital 30-Day Readmissions | `cms/hospital-general-information` |
| Credit | Credit Card Fraud Detection | `mlg-ulb/creditcardfraud` |
| Logistics | Supply Chain Shipment | `divyeshardeshana/supply-chain-shipment-pricing-data` |
| HR | IBM HR Analytics Attrition | `pavansubhasht/ibm-hr-analytics-attrition-dataset` |
| Marketing | Marketing Campaign | `jackdaoud/marketing-data` |
| Real Estate | House Prices (Ames Iowa) | `prevek18/ames-housing-dataset` |
