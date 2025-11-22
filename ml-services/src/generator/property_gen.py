# ml-service/src/generator/property_gen.py
import random
import numpy as np
from config import (
    PROPERTY_TYPES,
    PROPERTY_TYPE_WEIGHTS,
    PROPERTY_REGION_WEIGHTS,
    REGION_PRICE_FACTORS,
    PROPERTY_TYPE_FACTORS,
)

def weighted_choice(keys, weights):
    return random.choices(keys, weights=weights, k=1)[0]


def generate_property():
    property_type = weighted_choice(PROPERTY_TYPES, PROPERTY_TYPE_WEIGHTS)
    regions = list(PROPERTY_REGION_WEIGHTS.keys())
    region_weights = list(PROPERTY_REGION_WEIGHTS.values())
    property_region = weighted_choice(regions, region_weights)

    # Base price per sqm via lognormal distribution (skewed)
    # mean around ~3500, some heavy tail
    base_price_sqm = np.random.lognormal(mean=8.2, sigma=0.35)  # ~3600 avg

    # apply region & type multipliers
    price_per_sqm = base_price_sqm \
        * REGION_PRICE_FACTORS[property_region] \
        * PROPERTY_TYPE_FACTORS[property_type]

    # add some noise
    price_per_sqm *= np.random.normal(1.0, 0.15)
    price_per_sqm = int(max(1500, min(price_per_sqm, 15000)))

    # size (sqm)
    if property_type == "Apartment":
        sqm = random.randint(35, 90)
    elif property_type == "Maisonette":
        sqm = random.randint(60, 130)
    elif property_type == "Loft":
        sqm = random.randint(50, 120)
    else:  # Penthouse
        sqm = random.randint(60, 160)

    property_price = int(price_per_sqm * sqm)

    # occasional extreme expensive outliers
    if random.random() < 0.02:
        property_price *= random.uniform(1.3, 2.0)

    return {
        "property_price": int(property_price),
        "price_per_sqm": int(price_per_sqm),
        "property_type": property_type,
        "property_region": property_region,
    }
