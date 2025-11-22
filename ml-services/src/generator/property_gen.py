import json
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LISTING_FILE = ROOT / "data" / "real_estate_clean.json"

# Load once
if LISTING_FILE.exists():
    REAL_LISTINGS = json.loads(LISTING_FILE.read_text(encoding="utf-8"))
else:
    REAL_LISTINGS = []


def get_property():
    if REAL_LISTINGS:
        return random.choice(REAL_LISTINGS)

    # fallback synthetic
    price = random.randint(150000, 800000)
    sqm = random.randint(30, 120)
    return {
        "property_price": price,
        "price_per_sqm": price / sqm,
        "property_type": random.choice(["Apartment", "Loft", "Maisonette", "Penthouse"]),
        "property_region": random.choice(["BY", "BE", "NW", "HB", "HH", "NI", "unknown"]),
    }