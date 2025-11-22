# ml-service/src/generator/synthetic_generator.py
import pandas as pd
from pathlib import Path
from profiles import generate_avatar
from property_gen import generate_property
from simulation import simulate_readiness

def generate_sample():
    avatar = generate_avatar()
    prop = generate_property()

    years_to_readiness = simulate_readiness(
        starting_income=avatar["starting_income"],
        income_growth_rate=avatar["income_growth_rate"],
        current_savings=avatar["current_savings"],
        savings_rate=avatar["savings_rate"],
        debt_level=avatar["debt_level"],
        property_price=prop["property_price"],
        max_years=40,
        label_noise_std=1.5,
        return_timeline=False  # training: just need label
    )

    return {
        "age": avatar["age"],
        "region": avatar["region"],
        "education_level": avatar["education_level"],
        "education_field": avatar["education_field"],
        "occupation_category": avatar["occupation_category"],
        "starting_income": avatar["starting_income"],
        "income_growth_rate": avatar["income_growth_rate"],
        "current_savings": avatar["current_savings"],
        "savings_rate": avatar["savings_rate"],
        "debt_level": avatar["debt_level"],
        "property_price": prop["property_price"],
        "price_per_sqm": prop["price_per_sqm"],
        "property_type": prop["property_type"],
        "property_region": prop["property_region"],
        "years_to_readiness": years_to_readiness,
    }


def generate_dataset(n=10000):
    rows = [generate_sample() for _ in range(n)]

    root = Path(__file__).resolve().parents[2]
    out_dir = root / "data"
    out_dir.mkdir(parents=True, exist_ok=True)

    out_path = out_dir / "synthetic_data.csv"
    pd.DataFrame(rows).to_csv(out_path, index=False)

    print(f"Generated {n} synthetic samples → {out_path}")


if __name__ == "__main__":
    generate_dataset(100)
