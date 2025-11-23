import pandas as pd
import numpy as np
from pathlib import Path
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# ------------------------------
# Load data
# ------------------------------

root = Path(__file__).resolve().parents[2]
data_path = root / "ml-services" / "data" / "synthetic_data.csv"

print(f"Loading dataset from: {data_path}")
df = pd.read_csv(data_path)

# ------------------------------
# Split features & target
# ------------------------------

TARGET = "years_to_readiness"

X = df.drop(columns=[TARGET])
y = df[TARGET]

# ------------------------------
# Feature types
# ------------------------------

categorical_cols = [
    "region",
    "education_level",
    "education_field",
    "occupation_category",
    "property_type",
    "property_region",
]

numeric_cols = [
    "age",
    "income",
    "income_growth_rate",
    "savings",
    "savings_rate",
    "debt",
    "property_price",
    "price_per_sqm"
]

# ------------------------------
# Preprocessing pipeline
# ------------------------------

categorical_transformer = OneHotEncoder(handle_unknown="ignore")
numeric_transformer = StandardScaler()

preprocessor = ColumnTransformer(
    transformers=[
        ("categorical", categorical_transformer, categorical_cols),
        ("numeric", numeric_transformer, numeric_cols),
    ]
)

# ------------------------------
# Models to train
# ------------------------------

models = {
    "LinearRegression": LinearRegression(),
    "RandomForest": RandomForestRegressor(
        n_estimators=250,
        max_depth=12,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42
    )
}

results = {}

# ------------------------------
# Train/Test split
# ------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ------------------------------
# Train + evaluate each model
# ------------------------------

for name, model in models.items():
    print(f"\n=== Training {name} ===")

    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ])

    pipeline.fit(X_train, y_train)
    preds = pipeline.predict(X_test)

    mae = mean_absolute_error(y_test, preds)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    r2 = r2_score(y_test, preds)

    results[name] = (mae, rmse, r2)

    print(f"{name} Results:")
    print(f"  MAE:  {mae:.3f}")
    print(f"  RMSE: {rmse:.3f}")
    print(f"  R²:   {r2:.3f}")

# ------------------------------
# Select best model
# ------------------------------

best_model_name = max(results, key=lambda m: results[m][2])  # best R²
best_mae, best_rmse, best_r2 = results[best_model_name]

print(f"\n=== Best model: {best_model_name} ===")
print(f"MAE={best_mae:.3f}, RMSE={best_rmse:.3f}, R²={best_r2:.3f}")

# Retrain full pipeline on all data
best_pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("model", models[best_model_name])
])

best_pipeline.fit(X, y)

# ------------------------------
# Save model and preprocessor
# ------------------------------

models_dir = root / "ml-services" / "models"
models_dir.mkdir(parents=True, exist_ok=True)

model_path = models_dir / "mortgage_model.pkl"
joblib.dump(best_pipeline, model_path)

print(f"\n✔ Saved final model to: {model_path}")
