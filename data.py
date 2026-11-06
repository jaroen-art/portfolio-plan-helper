"""
data.py - Module for Cleaning Customer and Asset Price Datasets
Step 1: Data Cleaning (pandas only)
"""
import pandas as pd
import numpy as np

def clean_customers(customers_df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans customer profiles dataset:
    - Drops duplicate rows
    - Filters out invalid age values (valid range: 18 - 100)
    - Fills missing income values with median by risk group
    """
    df = customers_df.copy().drop_duplicates()
    df = df[(df['age'] >= 18) & (df['age'] <= 100)]
    df['income'] = df.groupby('risk_level')['income'].transform(lambda x: x.fillna(x.median()))
    return df

def clean_prices(prices_df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans daily asset price time-series dataset:
    - Drops duplicate records
    - Fills missing prices per ticker group (ffill / bfill)
    - Fixes 10x typo price spikes using median filter
    """
    df = prices_df.copy().drop_duplicates()
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values(['ticker', 'date'])
    
    # Forward fill missing values within each ticker group
    df['close'] = df.groupby('ticker')['close'].ffill().bfill()
    
    # Correct 10x typo outliers using rolling median
    def fix_outliers(group):
        rolling_med = group['close'].rolling(5, center=True, min_periods=1).median()
        is_typo = (group['close'] / rolling_med > 5.0) | (group['close'] / rolling_med < 0.2)
        group.loc[is_typo, 'close'] = rolling_med[is_typo]
        return group

    df = df.groupby('ticker', group_keys=False).apply(fix_outliers)
    return df
