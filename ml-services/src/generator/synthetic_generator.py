import pandas as pd
import numpy as np
import random
from pathlib import Path

# ---------------------------------------------------------
# EDUCATION + OCCUPATION CONFIG
# ---------------------------------------------------------

EDUCATION_LEVELS = ["none", "apprenticeship", "bachelor", "master"]

EDUCATION_FIELDS = [
    "mathematics",
    "computer_science",
    "engineering",
    "business",
    "economics",
    "data_science",
    "healthcare",
    "education",
    "psychology",
    "social_sciences",
    "arts_humanities",
]

FIELD_TO_OCCUPATION = {
    "mathematics": "STEM",
    "computer_science": "STEM",
    "engineering": "STEM",
    "business": "Finance",
    "economics": "Finance",
    "data_science": "STEM",
    "healthcare": "Healthcare",
    "education": "Education",
    "psychology": "SocialCare",
    "social_sciences": "SocialCare",
    "arts_humanities": "Arts",
}

REGIONS = ["BY", "BW", "NW", "BE", "HH", "HE"]

# ---------------------------------------------------------
# NO-DEGREE (education_level = "none") CAREER OPTIONS
# ---------------------------------------------------------

NO_DEGREE_PATHS = {
    "Service": {
        "income": (23000, 33000),
        "growth": (0.01, 0.03),
        "savings": (0.03, 0.12)
    },
    "SkilledTrade": {
        "income": (30000, 45000),
        "growth": (0.02, 0.04),
        "savings": (0.05, 0.15)
    },
    "Sales": {
        "income": (30000, 50000),
        "growth": (0.03, 0.06),
        "savings": (0.05, 0.18)
    },
    "TechSelfTaught": {
        "income": (35000, 55000),
        "growth": (0.04, 0.07),
        "savings": (0.08, 0.20)
    }
}

# ---------------------------------------------------------
# DEGREE-BASED SALARY TABLES
# ---------------------------------------------------------

BACHELOR_INCOME = {
    "mathematics": (48000, 60000),
    "computer_science": (50000, 65000),
    "engineering": (48000, 62000),
    "business": (40000, 55000),
    "economics": (42000, 57000),
    "data_science": (52000, 68000),
    "healthcare": (32000, 45000),
    "education": (35000, 45000),
    "psychology": (32000, 45000),
    "social_sciences": (30000, 42000),
    "arts_humanities": (28000, 40000),
}

MASTER_INCOME = {
    "mathematics": (55000, 75000),
    "computer_science": (55000, 80000),
    "engineering": (55000, 75000),
    "business": (48000, 65000),
    "economics": (50000, 68000),
    "data_science": (60000, 85000),
    "healthcare": (38000, 55000),
    "education": (40000, 52000),
    "psychology": (35000, 50000),
    "social_sciences": (33000, 48000),
    "arts_humanities": (30000, 45000),
}

APPRENTICESHIP_INCOME = {
    "SkilledTrade": (30000, 45000),
    "Mechatronics": (32000, 45000),
    "Retail": (22000, 32000),
    "Logistics": (26000, 36000),
    "OfficeAdmin": (30000, 40000),
}

APPRENTICESHIP_FIELDS = [
    "SkilledTrade", "Mechatronics", "Retail", "Logistics", "OfficeAdmin"
]

# ---------------------------------------------------------
# OCCUPATION GROWTH (DEGREE-BASED)
# ---------------------------------------------------------

OCCUPATION_GROWTH = {
    "STEM": (0.05, 0.08),
    "Finance": (0.04, 0.07),
    "Healthcare": (0.02, 0.04),
    "Education": (0.02, 0.03),
    "SocialCare": (0.02, 0.03),
    "Arts": (0.01, 0.03),
}

OCCUPATION_SAVINGS_RATE = {
    "STEM": (0.10, 0.25),
    "Finance": (0.12, 0.25),
    "Healthcare": (0.06, 0.15),
    "Education": (0.05, 0.12),
    "SocialCare": (0.05, 0.10),
    "Arts": (0.03, 0.08),
}

DEBT_RANGE = (0, 50000)

# ---------------------------------------------------------
# Real estate cleaning (luxury allowed now)
# ---------------------------------------------------------

def clean_real_estate(df):
    df = df[df["buyingPrice"] > 50000]   # keep everything above 50k
    df = df[df["squareMeter"] >= 20]
    df = df[df["pricePerSqm"] > 300]
    df = df.dropna(subset=["buyingPrice", "pricePerSqm", "region"])
    return df

# ---------------------------------------------------------
# Mortgage readiness simulation
# ---------------------------------------------------------

def simulate_years_to_readiness(
    age, starting_income, income_growth_rate,
    current_savings, savings_rate,
    property_price, debt_level
):
    down_payment_required = property_price * 0.20
    annual_income = starting_income
    savings = current_savings

    year = 0
    MAX_YEARS = 40

    while year < MAX_YEARS:

        # CONDITION 1: DOWN PAYMENT READY
        if savings >= down_payment_required:

            # CONDITION 2: DEBT-TO-INCOME CHECK
            monthly_income = annual_income / 12
            monthly_mortgage = (property_price * 0.03 / 12) + (property_price * 0.02 / 12)
            dti = monthly_mortgage / monthly_income

            if dti < 0.40:
                return year

        # SIMULATE NEXT YEAR
        annual_income *= (1 + income_growth_rate)
        savings += annual_income * savings_rate
        year += 1

    return MAX_YEARS

# ---------------------------------------------------------
# Avatar generator (with Option B logic)
# ---------------------------------------------------------

def generate_avatar():
    age = random.randint(18, 30)
    region = random.choice(REGIONS)

    education_level = random.choice(EDUCATION_LEVELS)

    # -----------------------------------------------------
    # NO EDUCATION → choose one of 4 job types
    # -----------------------------------------------------
    if education_level == "none":
        job_path = random.choice(list(NO_DEGREE_PATHS.keys()))
        cfg = NO_DEGREE_PATHS[job_path]

        starting_income = random.randint(*cfg["income"])
        growth_min, growth_max = cfg["growth"]
        savings_min, savings_max = cfg["savings"]

        occupation_category = job_path
        education_field = "none"

    # -----------------------------------------------------
    # Apprenticeship
    # -----------------------------------------------------
    elif education_level == "apprenticeship":
        field = random.choice(APPRENTICESHIP_FIELDS)
        salary_min, salary_max = APPRENTICESHIP_INCOME[field]

        starting_income = random.randint(salary_min, salary_max)
        growth_min, growth_max = (0.01, 0.04)
        savings_min, savings_max = (0.05, 0.15)

        occupation_category = field
        education_field = field

    # -----------------------------------------------------
    # Bachelor / Master
    # -----------------------------------------------------
    else:
        education_field = random.choice(EDUCATION_FIELDS)
        occupation_category = FIELD_TO_OCCUPATION[education_field]

        if education_level == "bachelor":
            salary_min, salary_max = BACHELOR_INCOME[education_field]
        else:
            salary_min, salary_max = MASTER_INCOME[education_field]

        starting_income = random.randint(salary_min, salary_max)
        growth_min, growth_max = OCCUPATION_GROWTH[occupation_category]
        savings_min, savings_max = OCCUPATION_SAVINGS_RATE[occupation_category]

    income_growth_rate = round(random.uniform(growth_min, growth_max), 3)
    savings_rate = round(random.uniform(savings_min, savings_max), 3)
    debt_level = random.randint(*DEBT_RANGE)

    # Age-dependent savings realism
    max_savings = age * 2500
    current_savings = random.randint(0, max_savings)

    return {
        "age": age,
        "region": region,
        "education_level": education_level,
        "education_field": education_field,
        "occupation_category": occupation_category,
        "starting_income": starting_income,
        "income_growth_rate": income_growth_rate,
        "current_savings": current_savings,
        "savings_rate": savings_rate,
        "debt_level": debt_level,
    }

# ---------------------------------------------------------
# Generate full synthetic dataset
# ---------------------------------------------------------

def generate_synthetic_dataset(real_estate_path, output_path, n_samples=1500):

    df_real = pd.read_json(real_estate_path)
    df_real = clean_real_estate(df_real)

    samples = []

    for _ in range(n_samples):
        avatar = generate_avatar()

        prop = df_real.sample(1).iloc[0]
        price = prop["buyingPrice"]
        price_sqm = prop["pricePerSqm"]
        prop_type = prop.get("apartmentType", "Unknown")
        prop_region = prop["region"]

        years = simulate_years_to_readiness(
            age=avatar["age"],
            starting_income=avatar["starting_income"],
            income_growth_rate=avatar["income_growth_rate"],
            current_savings=avatar["current_savings"],
            savings_rate=avatar["savings_rate"],
            property_price=price,
            debt_level=avatar["debt_level"],
        )

        samples.append({
            **avatar,
            "property_price": price,
            "price_per_sqm": price_sqm,
            "property_type": prop_type,
            "property_region": prop_region,
            "years_to_readiness": years,
        })

    df = pd.DataFrame(samples)

    # Clean unrealistic data
    df = df[df["current_savings"] <= df["age"] * 3000]
    df = df[df["starting_income"] <= 200000]
    df = df[df["years_to_readiness"].between(0, 40)]

    df.to_csv(output_path, index=False)
    print(f"Created synthetic dataset with {len(df)} rows → {output_path}")

# ---------------------------------------------------------
# Run script manually
# ---------------------------------------------------------

if __name__ == "__main__":
    ROOT = Path(__file__).resolve().parents[2]
    real_estate_path = ROOT / "data" / "real_estate_raw.json"
    output_path = ROOT / "data" / "synthetic_data.csv"

    generate_synthetic_dataset(real_estate_path, output_path, n_samples=10000)
