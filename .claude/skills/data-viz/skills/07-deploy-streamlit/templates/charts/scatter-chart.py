"""Scatter chart template — replace {x_col}, {y_col}, {color_col}, {title}."""
import plotly.express as px
import pandas as pd


def create_scatter_chart(
    df: pd.DataFrame,
    x: str = "{x_col}",
    y: str = "{y_col}",
    title: str = "{title}",
    color: str = None,
    size: str = None,
    trendline: bool = False
) -> "px.Figure":
    """
    Create an interactive scatter plot for correlation analysis.

    Args:
        df: Source DataFrame
        x: Column for x-axis (numeric)
        y: Column for y-axis (numeric)
        title: Chart title (use the business question)
        color: Optional column for color grouping (categorical)
        size: Optional column for bubble size (numeric)
        trendline: Add OLS trendline if True
    """
    kwargs = {
        "x": x, "y": y, "title": title, "color": color,
        "hover_data": df.columns[:5].tolist()
    }
    if size:
        kwargs["size"] = size
    if trendline:
        kwargs["trendline"] = "ols"

    fig = px.scatter(df, **kwargs)
    fig.update_layout(
        xaxis_title=x,
        yaxis_title=y,
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)"
    )
    fig.update_traces(marker={"opacity": 0.7, "size": 6})
    return fig
