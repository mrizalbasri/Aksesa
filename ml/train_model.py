# Aksesa - ML Training Script
# Credit Scoring Model for Indonesian SMEs

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

# Sample dataset for training (placeholder - replace with real data)
def create_sample_data():
    """Create sample dataset for training"""
    np.random.seed(42)
    n_samples = 500
    
    data = {
        # Business profile
        'business_age_years': np.random.randint(1, 20, n_samples),
        'num_employees': np.random.randint(1, 50, n_samples),
        'business_type': np.random.randint(0, 3, n_samples),  # 0=retail, 1=service, 2=manufacturing
        
        # Transaction patterns
        'monthly_revenue': np.random.randint(5000000, 100000000, n_samples),
        'transaction_count': np.random.randint(10, 500, n_samples),
        'avg_transaction_value': np.random.randint(50000, 5000000, n_samples),
        
        # Payment behavior
        'on_time_ratio': np.random.uniform(0.5, 1.0, n_samples),
        'late_payment_days': np.random.randint(0, 30, n_samples),
        
        # Revenue stability
        'revenue_std': np.random.randint(1000000, 20000000, n_samples),
        'revenue_trend': np.random.uniform(-0.2, 0.3, n_samples),
        
        # Market presence
        'has_marketplace': np.random.randint(0, 2, n_samples),
        'marketplace_sales_ratio': np.random.uniform(0, 0.5, n_samples),
    }
    
    df = pd.DataFrame(data)
    
    # Create target variable (credit score 0-100)
    # Based on weighted factors
    def calculate_score(row):
        score = 50  # base score
        
        # Business age (+0-10)
        score += min(row['business_age_years'], 10) * 1.5
        
        # Employees (+0-10)
        score += min(row['num_employees'] / 5, 10) * 1.5
        
        # Revenue (+0-15)
        score += min(row['monthly_revenue'] / 10000000, 15) * 1.5
        
        # On-time payment (+0-20)
        score += row['on_time_ratio'] * 20
        
        # Late payments (-0-15)
        score -= row['late_payment_days'] * 0.5
        
        # Revenue stability (+0-10)
        stability = 1 - (row['revenue_std'] / row['monthly_revenue'])
        score += stability * 10
        
        # Trend (+0-10)
        score += (row['revenue_trend'] + 0.2) * 25
        
        # Marketplace (+0-5)
        if row['has_marketplace']:
            score += row['marketplace_sales_ratio'] * 10
        
        # Normalize to 0-100
        return max(0, min(100, int(score)))
    
    df['credit_score'] = df.apply(calculate_score, axis=1)
    
    return df


def train_model():
    """Train credit scoring model"""
    print("Creating sample dataset...")
    df = create_sample_data()
    
    print(f"Dataset shape: {df.shape}")
    print(f"Score distribution:\n{df['credit_score'].describe()}")
    
    # Features and target
    X = df.drop('credit_score', axis=1)
    y = df['credit_score']
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    print("Training Random Forest model...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nModel Accuracy: {accuracy:.2%}")
    print("\nFeature Importance:")
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    print(feature_importance.to_string(index=False))
    
    # Save model and scaler
    output_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(output_dir, exist_ok=True)
    
    joblib.dump(model, os.path.join(output_dir, 'credit_model.pkl'))
    joblib.dump(scaler, os.path.join(output_dir, 'scaler.pkl'))
    
    print("\n[OK] Model saved to ml/models/")
    
    return model, scaler


def load_model():
    """Load pre-trained credit scoring model"""
    model_path = os.path.join(os.path.dirname(__file__), 'models', 'credit_model.pkl')
    scaler_path = os.path.join(os.path.dirname(__file__), 'models', 'scaler.pkl')
    
    try:
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        return model, scaler
    except FileNotFoundError:
        print("Model not found. Training new model...")
        return train_model()


def predict_score(features: dict) -> int:
    """
    Predict credit score from features
    Args:
        features: dict with keys matching training features
    Returns:
        score (0-100)
    """
    model, scaler = load_model()
    
    # Ensure feature order matches training
    feature_order = [
        'business_age_years', 'num_employees', 'business_type',
        'monthly_revenue', 'transaction_count', 'avg_transaction_value',
        'on_time_ratio', 'late_payment_days', 'revenue_std', 'revenue_trend',
        'has_marketplace', 'marketplace_sales_ratio'
    ]
    
    feature_array = np.array([[features.get(f, 0) for f in feature_order]])
    feature_scaled = scaler.transform(feature_array)
    
    prediction = model.predict(feature_scaled)[0]
    return int(prediction)


if __name__ == "__main__":
    train_model()