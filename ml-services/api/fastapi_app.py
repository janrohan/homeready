from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd

# load model & preprocessor
model = joblib.load("ml-services/models/mortgage_model.pkl")

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
