# Data App: React + FastAPI Hello World

A demo data application showcasing React (Vite) frontend with FastAPI backend, similar to Streamlit's "hello" example. Built for deployment in Keboola's python-js-base Docker image.

## Features

- **Plotting Demo**: Interactive line and bar charts displaying stock prices and sales data
- **DataFrame Demo**: Sortable, filterable, paginated data table with summary statistics

## Project Structure

```
data-app-python-js-hello-world/
├── keboola-config/          # Keboola deployment configuration
│   ├── nginx/sites/         # Nginx reverse proxy config
│   ├── supervisord/services/# Process management configs
│   └── setup.sh             # Dependency installation script
├── backend/                 # FastAPI application
│   ├── app.py               # API endpoints
│   ├── pyproject.toml       # Python dependencies (uv)
│   └── data/                # Sample data generators
└── frontend/                # React application
    ├── src/
    │   ├── pages/           # Demo pages
    │   └── components/      # Shared components
    ├── package.json         # Node dependencies
    └── vite.config.js       # Vite configuration
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- [uv](https://github.com/astral-sh/uv) (Python package manager)

## Local Development

### 1. Start the Backend

```bash
cd backend
uv sync
uv run uvicorn app:app --reload --port 8050
```

The API will be available at http://localhost:8050

### 2. Start the Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at http://localhost:5173

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check |
| `GET /api/plotting/line-data` | Stock price time series data |
| `GET /api/plotting/bar-data` | Sales by category data |
| `GET /api/dataframe/data` | Paginated employee records |
| `GET /api/dataframe/stats` | Summary statistics |

### Query Parameters

**Line Data:**
- `company` - Filter by company name
- `days` - Number of days (7-365, default: 90)

**Bar Data:**
- `region` - Filter by region (North, South, East, West)

**DataFrame Data:**
- `page` - Page number (default: 1)
- `page_size` - Items per page (5-50, default: 10)
- `sort_by` - Column to sort by
- `sort_order` - asc or desc
- `department` - Filter by department
- `search` - Search in name or email

## Production Build

```bash
cd frontend
npm run build
npm run preview  # Serves on port 3000
```

## Keboola Deployment

The app is configured for deployment in Keboola's python-js-base Docker image:

1. Nginx listens on port 8888
2. Routes `/api/*` to FastAPI backend (port 8050)
3. Routes `/` to Vite preview server (port 3000)

## Tech Stack

- **Frontend**: React 18, Vite, Recharts, TanStack Table
- **Backend**: FastAPI, Pandas, NumPy
- **Infrastructure**: Nginx, Supervisord
