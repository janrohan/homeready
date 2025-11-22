# ml-service/src/generator/profiles.py
import random
import numpy as np
from config import (
    REGIONS,
    EDUCATION_FIELDS,
    FIELD_TO_OCC,
    OCCUPATION_INCOME_RANGES,
    DEBT_RANGE,
)

def choose_education_level():
    return random.choices(
        ["none", "apprenticeship", "bachelor", "master"],
        weights=[0.25, 0.25, 0.25, 0.25],
        k=1
    )[0]


def choose_education_field(level):
    return random.choice(EDUCATION_FIELDS[level])


def derive_occupation(education_level, education_field):
    # no degree, sometimes can be TechSelfTaught or Sales
    if education_level == "none":
        return random.choices(
            ["Service", "Sales", "SkilledTrade", "TechSelfTaught"],
            weights=[0.45, 0.25, 0.15, 0.15],
            k=1
        )[0]
    # apprenticeship fields map to themselves
    if education_level == "apprenticeship":
        return FIELD_TO_OCC.get(education_field, "SkilledTrade")
    # academic
    return FIELD_TO_OCC.get(education_field, "Service")


def generate_financial_profile(age, education_level, education_field, occupation_category, region):
    # Base income from occupation
    base_low, base_high = OCCUPATION_INCOME_RANGES[occupation_category]
    starting_income = random.randint(base_low, base_high)

    # Add realistic income noise (irregularity / luck)
    noise_factor = np.random.normal(1.0, 0.20)  # ±20%
    starting_income = int(max(15000, starting_income * noise_factor))

    # Growth rates with noise
    # Higher potential for STEM/Finance, lower for Service
    if occupation_category in ["STEM", "Finance", "TechSelfTaught"]:
        growth_base = (0.03, 0.08)
    elif occupation_category in ["Healthcare", "Education", "SocialCare"]:
        growth_base = (0.02, 0.05)
    else:
        growth_base = (0.01, 0.05)

    income_growth_rate = round(random.uniform(*growth_base), 3)
    income_growth_rate *= np.random.normal(1.0, 0.25)  # noisy
    income_growth_rate = max(0.0, min(income_growth_rate, 0.12))

    # Savings rate influenced by occupation + noise
    if occupation_category in ["Finance", "STEM"]:
        s_base = (0.10, 0.25)
    elif occupation_category in ["Healthcare", "Education", "SkilledTrade"]:
        s_base = (0.06, 0.18)
    else:
        s_base = (0.03, 0.15)

    savings_rate = round(random.uniform(*s_base), 3)
    savings_rate *= np.random.normal(1.0, 0.25)
    savings_rate = max(0.01, min(savings_rate, 0.35))

    # Current savings: depends heavily on age, income & randomness
    typical_max = age * random.randint(800, 3000)
    current_savings = random.randint(0, max(0, typical_max))
    # occasional savings shock (unexpected expenses)
    if random.random() < 0.1:
        current_savings = int(current_savings * random.uniform(0.2, 0.8))

    # Debt
    debt_level = random.randint(*DEBT_RANGE)
    # some people take more loans
    if random.random() < 0.1:
        debt_level += random.randint(5000, 20000)

    return {
        "starting_income": starting_income,
        "income_growth_rate": income_growth_rate,
        "current_savings": current_savings,
        "savings_rate": savings_rate,
        "debt_level": debt_level,
    }


def generate_avatar():
    age = random.randint(18, 40)
    region = random.choice(REGIONS)

    education_level = choose_education_level()
    education_field = choose_education_field(education_level)
    occupation_category = derive_occupation(education_level, education_field)

    financials = generate_financial_profile(
        age, education_level, education_field, occupation_category, region
    )

    return {
        "age": age,
        "region": region,
        "education_level": education_level,
        "education_field": education_field,
        "occupation_category": occupation_category,
        **financials,
    }
