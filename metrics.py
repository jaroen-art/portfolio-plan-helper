"""
metrics.py - Financial Metrics Calculation Module
Step 2: Risk & Return Metrics (pandas / numpy only)
"""
import pandas as pd
import numpy as np

def total_return(r: pd.Series) -> float:
    """Calculates cumulative total return over the period."""
    return float((1 + r).prod() - 1)

def annual_return(r: pd.Series, periods_per_year: int = 252) -> float:
    """Calculates annualized compounding return."""
    compounded = (1 + r).prod()
    n_years = len(r) / periods_per_year
    if n_years <= 0:
        return 0.0
    return float(compounded ** (1 / n_years) - 1)

def max_drawdown(r: pd.Series) -> float:
    """Calculates maximum peak-to-trough drawdown."""
    cum_returns = (1 + r).cumprod()
    peak = cum_returns.cummax()
    drawdown = (cum_returns - peak) / peak
    return float(drawdown.min())

def return_per_risk(r: pd.Series, risk_free_rate: float = 0.02, periods_per_year: int = 252) -> float:
    """Calculates Sharpe-like return-per-risk ratio."""
    ann_ret = annual_return(r, periods_per_year)
    ann_vol = float(r.std() * np.sqrt(periods_per_year))
    if ann_vol == 0:
        return 0.0
    return float((ann_ret - risk_free_rate) / ann_vol)

def yearly_return(r: pd.Series) -> pd.Series:
    """Calculates returns aggregated by year."""
    return r.groupby(r.index.year).apply(lambda x: (1 + x).prod() - 1)

def monthly_return(r: pd.Series) -> pd.Series:
    """Calculates returns aggregated by month."""
    return r.groupby([r.index.year, r.index.month]).apply(lambda x: (1 + x).prod() - 1)

def summary(r: pd.Series) -> pd.Series:
    """Generates a summary of key metrics as a pandas Series."""
    return pd.Series({
        'Total Return': f"{total_return(r):.2%}",
        'Annual Return': f"{annual_return(r):.2%}",
        'Max Drawdown': f"{max_drawdown(r):.2%}",
        'Return per Risk (Sharpe)': f"{return_per_risk(r):.2f}"
    })
