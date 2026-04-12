"""Bar chart template — replace {x_col}, {y_col}, {color_col}, {title}."""
import plotly.express as px
import pandas as pd


def create_bar_chart(
    df: pd.DataFrame,
    x: str = "{x_col}",
    y: str = "{y_col}",
    title: str = "{title}",
    color: str = None,
    orientation: str = "v"
) -> "px.Figure":
    """
    Create an interactive bar chart.

    Args:
        df: Source DataFrame
        x: Column for x-axis (categorical for vertical, numeric for horizontal)
        y: Column for y-axis (numeric)
        title: Chart title (use the business question)
        color: Optional column for color grouping
        orientation: 'v' (vertical) or 'h' (horizontal — swap x/y for ranking charts)
    """
    if orientation == "h":
        # Horizontal bar — better for long category names / rankings
        fig = px.bar(df, x=y, y=x, title=title, color=color, orientation="h")
        fig.update_layout(yaxis={"categoryorder": "total ascending"})
    else:
        fig = px.bar(df, x=x, y=y, title=title, color=color)
        fig.update_layout(xaxis_title=x, yaxis_title=y)

    fig.update_layout(
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
        showlegend=color is not None
    )
    return fig
