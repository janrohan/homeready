# ml-service/src/generator/config.py
import random

REGIONS = ["BW", "BY", "HE", "BE", "NW", "HH"]

# Property type distribution (more realistic)
PROPERTY_TYPES = ["Apartment", "Maisonette", "Loft", "Penthouse"]
PROPERTY_TYPE_WEIGHTS = [0.82, 0.08, 0.07, 0.03]

# Region distribution (roughly even)
PROPERTY_REGION_WEIGHTS = {
    "BW": 0.19,
    "HE": 0.18,
    "BY": 0.18,
    "NW": 0.17,
    "HH": 0.15,
    "BE": 0.13,
}

# Region-level price factors (rough idea)
REGION_PRICE_FACTORS = {
    "BY": 1.35,   # Munich
    "HH": 1.30,   # Hamburg
    "HE": 1.25,   # Frankfurt
    "BW": 1.20,
    "NW": 1.05,
    "BE": 1.00,
}

# Property type factors
PROPERTY_TYPE_FACTORS = {
    "Apartment": 1.00,
    "Maisonette": 1.10,
    "Loft": 1.20,
    "Penthouse": 1.40,
}

# Education → possible fields
EDUCATION_FIELDS = {
    "none": ["none"],
    "apprenticeship": ["Retail", "OfficeAdmin", "Logistics", "SkilledTrade", "Mechatronics"],
    "bachelor": [
        "business", "economics", "psychology", "education", "engineering",
        "data_science", "computer_science", "mathematics", "healthcare",
        "social_sciences", "arts_humanities"
    ],
    "master": [
        "business", "economics", "psychology", "education", "engineering",
        "data_science", "computer_science", "mathematics", "healthcare",
        "social_sciences", "arts_humanities"
    ],
}

# Map field → occupation category
FIELD_TO_OCC = {
    "computer_science": "STEM",
    "engineering": "STEM",
    "mathematics": "STEM",
    "data_science": "STEM",
    "economics": "Finance",
    "business": "Finance",
    "healthcare": "Healthcare",
    "education": "Education",
    "psychology": "SocialCare",
    "social_sciences": "SocialCare",
    "arts_humanities": "Arts",
    "Retail": "Retail",
    "OfficeAdmin": "OfficeAdmin",
    "Logistics": "Logistics",
    "SkilledTrade": "SkilledTrade",
    "Mechatronics": "Mechatronics",
    "none": "Service",
}

# Base salary ranges by occupation (before noise)
OCCUPATION_INCOME_RANGES = {
    "STEM": (50000, 90000),
    "Finance": (45000, 85000),
    "Healthcare": (35000, 55000),
    "Education": (30000, 45000),
    "SocialCare": (30000, 42000),
    "Arts": (28000, 38000),
    "Service": (22000, 34000),
    "Sales": (28000, 60000),
    "Retail": (24000, 36000),
    "OfficeAdmin": (26000, 38000),
    "Logistics": (26000, 38000),
    "SkilledTrade": (30000, 45000),
    "Mechatronics": (32000, 46000),
    "TechSelfTaught": (35000, 55000),
}

DEBT_RANGE = (0, 50000)


def weighted_choice(weight_dict):
    return random.choices(
        population=list(weight_dict.keys()),
        weights=list(weight_dict.values()),
        k=1
    )[0]
