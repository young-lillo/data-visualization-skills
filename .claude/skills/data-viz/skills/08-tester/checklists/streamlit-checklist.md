# Streamlit Deploy Checklist

Complete before pushing to Streamlit Cloud.

## Code Quality
- [ ] `streamlit run app.py` runs without errors locally
- [ ] No `{placeholder}` strings remain in `app.py`
- [ ] No hardcoded local file paths (use relative paths only)
- [ ] No credentials, API keys, or tokens in any Python file

## Data & Charts
- [ ] All charts render with real data (not empty figures)
- [ ] Sidebar filters update charts reactively on change
- [ ] KPI metrics display correct computed values
- [ ] Dates are parsed correctly (not showing as strings in time series)

## Configuration
- [ ] `requirements.txt` is present at repo root with all imported libraries
- [ ] `.streamlit/config.toml` is present
- [ ] `.streamlit/secrets.toml` is gitignored (check `.gitignore`)
- [ ] `data/processed/clean_dataset.csv` is present (or loaded from URL/BQ)

## Performance
- [ ] `@st.cache_data` applied to all data loading functions
- [ ] App loads in < 10s for dataset under 100k rows
- [ ] No `st.write(df)` on full dataset (use `.head(100)` for display)

## Streamlit Cloud
- [ ] Repo is public (or Streamlit Cloud has access to private repo)
- [ ] `app.py` is at repo root (not in a subdirectory)
- [ ] Secrets added at share.streamlit.io → App Settings → Secrets
- [ ] App URL shared and accessible after deploy
