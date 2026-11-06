"""
plans.py - Portfolio Allocation & Growth Simulation Module
Step 4: Portfolio Simulation
"""
import pandas as pd
import numpy as np

def check_plan(weights: dict) -> bool:
    """
    Validates if portfolio weights sum to exactly 1.0 (100%).
    Raises ValueError if weights sum != 1.0 (e.g., 1.2 or 120%).
    """
    total = sum(weights.values())
    if not np.isclose(total, 1.0, atol=1e-4):
        raise ValueError(f"พอร์ตการลงทุนต้องรวมได้ 100% (1.0) แต่ได้รับ {total*100:.1f}%")
    return True

def portfolio_returns(weights: dict, returns_df: pd.DataFrame) -> pd.Series:
    """Calculates portfolio daily returns based on weight dictionary."""
    check_plan(weights)
    weighted_rets = pd.Series(0.0, index=returns_df.index)
    for asset, weight in weights.items():
        if asset in returns_df.columns:
            weighted_rets += returns_df[asset] * weight
    return weighted_rets

def all_plan_returns(plans_dict: dict, returns_df: pd.DataFrame) -> pd.DataFrame:
    """Computes daily returns for multiple plans simultaneously."""
    result = pd.DataFrame(index=returns_df.index)
    for plan_name, weights in plans_dict.items():
        result[plan_name] = portfolio_returns(weights, returns_df)
    return result

def money_growth(initial_amount: float, returns: pd.Series) -> pd.Series:
    """Simulates portfolio growth over time from an initial capital amount."""
    cum_returns = (1 + returns).cumprod()
    return initial_amount * cum_returns
