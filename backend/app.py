from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from backend.data.sample_data import (
    generate_stock_data,
    generate_sales_data,
    generate_employee_data,
    get_employee_stats
)

app = FastAPI(
    title="Data App API",
    description="Backend API for React + FastAPI Hello World demo",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cache generated data
_stock_data = None
_sales_data = None
_employee_data = None


def get_stock_data():
    global _stock_data
    if _stock_data is None:
        _stock_data = generate_stock_data()
    return _stock_data


def get_sales_data():
    global _sales_data
    if _sales_data is None:
        _sales_data = generate_sales_data()
    return _sales_data


def get_employee_data():
    global _employee_data
    if _employee_data is None:
        _employee_data = generate_employee_data()
    return _employee_data


@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "data-app-backend"}


@app.get("/api/plotting/line-data")
def get_line_data(
    company: Optional[str] = Query(None, description="Filter by company name"),
    days: int = Query(90, ge=7, le=365, description="Number of days to return")
):
    """Get time series data for line charts (stock prices)."""
    df = get_stock_data()

    # Get the most recent N days
    unique_dates = df['date'].unique()
    recent_dates = sorted(unique_dates)[-days:]
    df = df[df['date'].isin(recent_dates)]

    if company:
        df = df[df['company'] == company]

    return {
        "data": df.to_dict('records'),
        "companies": get_stock_data()['company'].unique().tolist(),
        "date_range": {
            "start": min(recent_dates),
            "end": max(recent_dates)
        }
    }


@app.get("/api/plotting/bar-data")
def get_bar_data(
    region: Optional[str] = Query(None, description="Filter by region")
):
    """Get categorical data for bar charts (sales by category)."""
    df = get_sales_data()

    if region:
        df = df[df['region'] == region]
        # Return per-category data for the region
        result = df.groupby('category').agg({
            'sales': 'sum',
            'units': 'sum'
        }).reset_index()
    else:
        # Return aggregated data by category across all regions
        result = df.groupby('category').agg({
            'sales': 'sum',
            'units': 'sum'
        }).reset_index()

    return {
        "data": result.to_dict('records'),
        "regions": get_sales_data()['region'].unique().tolist()
    }


@app.get("/api/dataframe/data")
def get_dataframe_data(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=5, le=50, description="Items per page"),
    sort_by: Optional[str] = Query(None, description="Column to sort by"),
    sort_order: str = Query("asc", pattern="^(asc|desc)$", description="Sort order"),
    department: Optional[str] = Query(None, description="Filter by department"),
    search: Optional[str] = Query(None, description="Search in name or email")
):
    """Get paginated employee data for data table."""
    df = get_employee_data()

    # Apply filters
    if department:
        df = df[df['department'] == department]

    if search:
        search_lower = search.lower()
        df = df[
            df['name'].str.lower().str.contains(search_lower) |
            df['email'].str.lower().str.contains(search_lower)
        ]

    # Apply sorting
    if sort_by and sort_by in df.columns:
        ascending = sort_order == "asc"
        df = df.sort_values(by=sort_by, ascending=ascending)

    # Calculate pagination
    total_items = len(df)
    total_pages = (total_items + page_size - 1) // page_size
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size

    page_data = df.iloc[start_idx:end_idx]

    return {
        "data": page_data.to_dict('records'),
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total_items": total_items,
            "total_pages": total_pages
        },
        "filters": {
            "departments": get_employee_data()['department'].unique().tolist(),
            "positions": get_employee_data()['position'].unique().tolist()
        }
    }


@app.get("/api/dataframe/stats")
def get_dataframe_stats():
    """Get summary statistics for employee data."""
    df = get_employee_data()
    return get_employee_stats(df)
