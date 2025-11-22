import json
from pathlib import Path
import random

REGIONS = ["BY", "BW", "NW", "BE", "HH", "HE"]
APARTMENT_TYPES = ["Apartment", "Penthouse", "Loft", "Maisonette"]

def generate_fake_listing():
    sqm = random.randint(25, 120)
    price_sqm = random.randint(2500, 12000)
    price = price_sqm * sqm

    return {
        "id": f"fake-{random.randint(100000, 999999)}",
        "title": "Sample Apartment",
        "buyingPrice": price,
        "pricePerSqm": price_sqm,
        "squareMeter": sqm,
        "region": random.choice(REGIONS),
        "apartmentType": random.choice(APARTMENT_TYPES),

        # extra fields we ignore but included for realism
        "rooms": random.randint(1, 5),
        "constructionYear": random.randint(1950, 2023),
        "energyEfficiencyClass": random.choice(list("ABCDEFG")),
        "active": True,
        "locationFactor": {
            "population": random.randint(50000, 3000000),
            "unemploymentRate": round(random.uniform(2.0, 10.0), 1)
        }
    }


def create_fake_dataset(n=200):
    listings = [generate_fake_listing() for _ in range(n)]

    root = Path(__file__).resolve().parents[2]
    output_path = root / "ml-services" / "data" / "real_estate_raw.json"

    with open(output_path, "w") as f:
        json.dump(listings, f, indent=2)

    print(f"Generated {n} fake listings → {output_path}")


if __name__ == "__main__":
    create_fake_dataset(200)




"""import requests
import json
from pathlib import Path

URL = "https://thinkimmo-api.mgaetz.de/thinkimmo"

payload = {
    "active": True,
    "type": "APPARTMENTBUY",
    "sortBy": "desc",
    "sortKey": "pricePerSqm",
    "from": 0,
    "size": 500,                # GET MANY LISTINGS
    "geoSearches": {
        "geoSearchQuery": "Germany",
        "geoSearchType": "state",
        "region": "DE"
    }
}

headers = {
    "Content-Type": "application/json"
}

def fetch_data():
    r = requests.post(URL, json=payload, headers=headers)
    print("Status:", r.status_code)

    data = r.json()   # returns { total: X, results: [...], aggregations: {...} }

    # Save raw JSON file for synthetic generator
    path = Path(__file__).resolve().parents[2] / "data" / "real_estate_raw.json"

    with open(path, "w") as f:
        json.dump(data["results"], f, indent=2)

    print(f"Saved {len(data['results'])} listings to {path}")

if __name__ == "__main__":
    fetch_data()"""
