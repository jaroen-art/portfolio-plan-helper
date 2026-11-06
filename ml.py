"""
ml.py - Machine Learning Module (Supervised & Unsupervised Learning)
Step 5: Supervised Models (Baseline, Logistic Regression, Random Forest) & K-Means Clustering
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.dummy import DummyClassifier
from sklearn.cluster import KMeans
from sklearn.metrics import accuracy_score, confusion_matrix, silhouette_score

def make_features(df: pd.DataFrame) -> tuple:
    """Extracts features (X) and target (y) for model training."""
    features = ['age', 'income', 'risk_score', 'investment_horizon', 'loss_tolerance']
    X = df[features]
    y = df['recommended_plan']
    return X, y

def split(X: pd.DataFrame, y: pd.Series):
    """Splits data into train/test (80/20) with stratification."""
    return train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

def train_models(X_train, y_train):
    """Trains Baseline, Logistic Regression, and Random Forest classifiers."""
    models = {
        'Baseline': DummyClassifier(strategy='most_frequent'),
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'Random Forest': RandomForestClassifier(n_estimators=100, max_depth=3, random_state=42)
    }
    for name, model in models.items():
        model.fit(X_train, y_train)
    return models

def evaluate(models: dict, X_test, y_test) -> pd.DataFrame:
    """Evaluates model accuracy on the test dataset."""
    results = []
    for name, model in models.items():
        y_pred = model.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        results.append({'Model': name, 'Accuracy': f"{acc * 100:.2f}%"})
    return pd.DataFrame(results)

def confusion_matrix_table(model, X_test, y_test, labels) -> pd.DataFrame:
    """Generates a structured Confusion Matrix DataFrame."""
    y_pred = model.predict(X_test)
    cm = confusion_matrix(y_test, y_pred, labels=labels)
    return pd.DataFrame(cm, index=[f"Actual {l}" for l in labels], columns=[f"Pred {l}" for l in labels])

def kmeans_clustering(df: pd.DataFrame, n_clusters: int = 4):
    """Performs Unsupervised K-Means Clustering for client segmentation."""
    features = ['age', 'risk_score']
    X = df[features]
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    df['cluster'] = kmeans.fit_predict(X)
    score = silhouette_score(X, df['cluster'])
    return df, kmeans.cluster_centers_, score, kmeans.inertia_
