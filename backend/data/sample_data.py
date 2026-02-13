import numpy as np
import pandas as pd
from datetime import datetime, timedelta


def generate_stock_data(days: int = 365, seed: int = 42) -> pd.DataFrame:
    """Generate sample stock price data for multiple companies."""
    np.random.seed(seed)

    date_range = pd.date_range(
        end=datetime.now(),
        periods=days,
        freq='D'
    )

    companies = ['ACME Corp', 'TechGiant', 'GreenEnergy', 'HealthPlus']
    base_prices = [100, 250, 75, 150]

    data = []
    for company, base_price in zip(companies, base_prices):
        prices = [base_price]
        for _ in range(days - 1):
            change = np.random.normal(0.001, 0.02)
            new_price = prices[-1] * (1 + change)
            prices.append(max(new_price, 1))

        for date, price in zip(date_range, prices):
            data.append({
                'date': date.strftime('%Y-%m-%d'),
                'company': company,
                'price': round(price, 2),
                'volume': int(np.random.uniform(100000, 1000000))
            })

    return pd.DataFrame(data)


def generate_sales_data(seed: int = 42) -> pd.DataFrame:
    """Generate sample sales data by category."""
    np.random.seed(seed)

    categories = ['Electronics', 'Clothing', 'Food & Beverage', 'Home & Garden', 'Sports', 'Books']
    regions = ['North', 'South', 'East', 'West']

    data = []
    for category in categories:
        for region in regions:
            sales = int(np.random.uniform(50000, 500000))
            units = int(np.random.uniform(1000, 10000))
            data.append({
                'category': category,
                'region': region,
                'sales': sales,
                'units': units,
                'avg_price': round(sales / units, 2)
            })

    return pd.DataFrame(data)


def generate_employee_data(n_employees: int = 100, seed: int = 42) -> pd.DataFrame:
    """Generate sample employee data for DataFrame demo."""
    np.random.seed(seed)

    first_names = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer',
                   'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara',
                   'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah']
    last_names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia',
                  'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez']
    departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations']
    positions = ['Junior', 'Mid-level', 'Senior', 'Lead', 'Manager', 'Director']

    data = []
    for i in range(n_employees):
        first = np.random.choice(first_names)
        last = np.random.choice(last_names)
        dept = np.random.choice(departments)
        position = np.random.choice(positions, p=[0.2, 0.3, 0.25, 0.12, 0.08, 0.05])

        base_salary = {
            'Junior': 50000,
            'Mid-level': 70000,
            'Senior': 90000,
            'Lead': 110000,
            'Manager': 130000,
            'Director': 160000
        }[position]

        salary = int(base_salary * np.random.uniform(0.9, 1.2))
        years = max(0, int(np.random.normal(5, 3)))
        performance = round(np.random.uniform(2.5, 5.0), 1)

        hire_date = datetime.now() - timedelta(days=years * 365 + np.random.randint(0, 365))

        data.append({
            'id': i + 1,
            'name': f'{first} {last}',
            'email': f'{first.lower()}.{last.lower()}{i}@company.com',
            'department': dept,
            'position': position,
            'salary': salary,
            'hire_date': hire_date.strftime('%Y-%m-%d'),
            'years_employed': years,
            'performance_rating': performance
        })

    return pd.DataFrame(data)


def get_employee_stats(df: pd.DataFrame) -> dict:
    """Calculate summary statistics for employee data."""
    return {
        'total_employees': len(df),
        'avg_salary': round(df['salary'].mean(), 2),
        'median_salary': round(df['salary'].median(), 2),
        'avg_years_employed': round(df['years_employed'].mean(), 1),
        'avg_performance': round(df['performance_rating'].mean(), 2),
        'by_department': df.groupby('department').agg({
            'id': 'count',
            'salary': 'mean',
            'performance_rating': 'mean'
        }).round(2).rename(columns={'id': 'count'}).to_dict('index'),
        'by_position': df.groupby('position')['id'].count().to_dict()
    }
