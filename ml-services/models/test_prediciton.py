import joblib
import pandas as pd
from pathlib import Path

# Load your saved model

ROOT = Path(__file__).resolve().parents[2]
model = joblib.load(ROOT / "ml-services/models/mortgage_model.pkl")

# Define your avatar
sample = {
    "age": 18,
    "region": "NW",                           # North Rhine-Westphalia (common + balanced)
    "education_level": "master",
    "education_field": "social_sciences",
    "occupation_category": "SocialCare",         # common white-collar job
    "starting_income": 30000,                 # typical for 27yo Bachelor in Germany
    "income_growth_rate": 0.04,               # 4% yearly growth (normal)
    "current_savings": 5000,                 # modest but realistic savings
    "savings_rate": 0.06,                     # saves ~12% of salary
    "debt_level": 3000,                       # small loan
    "property_price": 350000,                 # average-ish property
    "price_per_sqm": 5500,                    # NRW apartment typical
    "property_type": "Apartment",
    "property_region": "NW"
}

df = pd.DataFrame([sample])

prediction = model.predict(df)[0]

print(f"Predicted years to readiness: {prediction:.2f}")
