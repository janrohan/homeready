from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
from pathlib import Path

# load model & preprocessor



ROOT = Path(__file__).resolve().parents[2]   # go from api/ → ml-services/ → project root
MODEL_PATH = ROOT / "ml-services" / "models" / "mortgage_model.pkl"

print("Loading model from:", MODEL_PATH)

model = joblib.load(MODEL_PATH)

app = FastAPI(title="ML Mortgage Prediction API")

# ==== 1. Define Request Schema ====
class AvatarInput(BaseModel):
    age: int
    region: str
    education_level: str
    education_field: str
    occupation_category: str
    starting_income: float
    income_growth_rate: float
    current_savings: float
    savings_rate: float
    debt_level: float
    property_price: float
    price_per_sqm: float
    property_type: str
    property_region: str


# ==== 2. Predict Endpoint ====
@app.post("/predict")
def predict(input: AvatarInput):
    # Convert pydantic → dict → DataFrame
    df = pd.DataFrame([input.dict()])

    # The pipeline handles preprocessing internally
    pred = model.predict(df)[0]

    return {"years_to_readiness": float(pred)}
