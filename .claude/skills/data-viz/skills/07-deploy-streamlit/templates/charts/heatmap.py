"""Heatmap template — replace {x_col}, {y_col}, {z_col}, {title}."""
import plotly.express as px
import pandas as pd


def create_heatmap(
    df: pd.DataFrame,
    x: str = "{x_col}",
    y: str = "{y_col}",
    z: str = "{z_col}",
    title: str = "{title}",
    aggfunc: str = "mean"
) -> "px.Figure":
    """
    Create a heatmap via pivot table aggregation.

    Args:
        df: Source DataFrame
        x: Column for x-axis (categorical — becomes columns in pivot)
        y: Column for y-axis (categorical — becomes rows in pivot)
        z: Column for cell values (numeric — aggregated by aggfunc)
        title: Chart title (use the business question)
        aggfunc: Aggregation: 'mean', 'sum', 'count', 'median'
    """
    pivot = df.pivot_table(values=z, index=y, columns=x, aggfunc=aggfunc)

    fig = px.imshow(
        pivot,
        title=title,
        aspect="auto",
        color_continuous_scale="Viridis",
        text_auto=".1f"
    )
    fig.update_layout(
        xaxis_title=x,
        yaxis_title=y,
        paper_bgcolor="rgba(0,0,0,0)"
    )
    return fig


def create_correlation_heatmap(df: pd.DataFrame, title: str = "Correlation Matrix") -> "px.Figure":
    """Create a correlation heatmap from all numeric columns."""
    corr = df.select_dtypes(include="number").corr().round(2)
    fig = px.imshow(
        corr,
        title=title,
        color_continuous_scale="RdBu_r",
        color_continuous_midpoint=0,
        text_auto=True,
        aspect="auto"
    )
    fig.update_layout(paper_bgcolor="rgba(0,0,0,0)")
    return fig
