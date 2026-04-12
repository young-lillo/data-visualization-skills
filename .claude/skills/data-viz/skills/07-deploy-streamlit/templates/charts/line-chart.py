"""Line chart template — replace {x_col}, {y_col}, {color_col}, {title}."""
import plotly.express as px
import pandas as pd


def create_line_chart(
    df: pd.DataFrame,
    x: str = "{x_col}",
    y: str = "{y_col}",
    title: str = "{title}",
    color: str = None,
    markers: bool = True
) -> "px.Figure":
    """
    Create an interactive line chart for trends over time or ordered categories.

    Args:
        df: Source DataFrame (should be sorted by x before passing)
        x: Column for x-axis (typically date/time or ordered category)
        y: Column for y-axis (numeric metric)
        title: Chart title (use the business question)
        color: Optional column for multiple lines (e.g., region, category)
        markers: Show data point markers on the line
    """
    # Ensure sorted by x for clean line rendering
    df = df.sort_values(x)

    fig = px.line(df, x=x, y=y, title=title, color=color, markers=markers)
    fig.update_layout(
        xaxis_title=x,
        yaxis_title=y,
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
        hovermode="x unified"
    )
    fig.update_traces(line={"width": 2})
    return fig
