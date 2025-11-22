import requests
import json
from pathlib import Path

API_URL = "https://thinkimmo-api.mgraetz.de/thinkimmo"

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_FILE = ROOT / "data" / "real_estate_clean.json"


def fetch_thinkimmo(size=150):
    payload = {
        "active": True,
        "type": "APARTMENTBUY",
        "sortBy": "desc",
        "sortKey": "pricePerSqm",
        "from": 0,
        "size": size,
        "geoSearches": {
            "geoSearchQuery": "München",
            "geoSearchType": "town",
            "region": "Bayern"
        }
    }

    print("📡 Fetching ThinkImmo listings...")
    resp = requests.post(API_URL, json=payload, timeout=15)
    resp.raise_for_status()

    data = resp.json()
    return data.get("results", [])


def normalize_listing(listing: dict):
    """
    Extract the exact fields our ML model expects.
    """
    price = listing.get("buyingPrice")
    sqm = listing.get("squareMeter") or 0
    title = (listing.get("title") or "").lower()

    # price per sqm fallback
    if sqm <= 0:
        sqm = 50  # default fallback
    price_per_sqm = price / sqm if price else 0

    # property type heuristic
    if "penthouse" in title:
        ptype = "Penthouse"
    elif "loft" in title:
        ptype = "Loft"
    elif "maisonette" in title:
        ptype = "Maisonette"
    else:
        ptype = "Apartment"

    addr = listing.get("address", {})
    city = addr.get("_normalized_city") or addr.get("city") or "unknown"

    # property_region = Bundesland
    state_code = addr.get("state_code", "unknown")

    return {
        "property_price": price or 0,
        "price_per_sqm": price_per_sqm,
        "property_type": ptype,
        "property_region": state_code,  # e.g. "BY"
    }


def save_clean_listings(clean_list):
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text(
        json.dumps(clean_list, indent=2, ensure_ascii=False),
        encoding="utf-8"
    )
    print(f"💾 Saved {len(clean_list)} cleaned listings → {OUTPUT_FILE}")


def main():
    raw = fetch_thinkimmo(size=150)
    clean = [normalize_listing(x) for x in raw]
    save_clean_listings(clean)


if __name__ == "__main__":
    main()

"""import requests
import json

# API endpoint
API_URL = "https://thinkimmo-api.mgraetz.de/thinkimmo"

# Build request payload
request_data = {
    "active": True,
    "type": "APARTMENTBUY",
    "sortBy": "desc",
    "sortKey": "pricePerSqm",
    "from": 0,
    "size": 10,
    "geoSearches": {
        "geoSearchQuery": "München",
        "geoSearchType": "town",
        "region": "Bayern"
    }
}

print("Searching for apartments in Munich...\n")
# Print HTTP request details
print("="*70)
print("HTTP REQUEST")
print("="*70)
print(f"POST {API_URL}")
print("Content-Type: application/json")
print("\nRequest Body:")
print(json.dumps(request_data, indent=2))
print()

try:
    # Make the API request
    response = requests.post(
        API_URL,
        json=request_data,
        headers={"Content-Type": "application/json"},
        timeout=30,
    )

    print("="*70)
    print("HTTP RESPONSE")
    print("="*70)
    print(f"Status Code: {response.status_code}")
    print(f"Content-Type: {response.headers.get('Content-Type', 'N/A')}")
    print()

    # Check if request was successful
    response.raise_for_status()

    # Parse JSON response
    data = response.json()

    # Print the full response
    print("="*70)
    print("API RESPONSE DATA")
    print("="*70)
    print(json.dumps(data, indent=2, ensure_ascii=False))

    # Print a summary
    print("\n" + "="*70)
    print("SUMMARY")
    print("="*70)
    print(f"Total listings: {data.get('total', 0)}")
    print(f"Results returned: {len(data.get('results', []))}")

    if data.get('results'):
        print("\nFirst listing:")
        first = data['results'][0]
        print(f"  Title: {first.get('title')}")
        print(f"  Price: €{first.get('buyingPrice', 0):,}")
        print(f"  Size: {first.get('squareMeter', 0)} m²")
        print(f"  Location: {first.get('address', {}).get('displayName', 'N/A')}")

except requests.exceptions.HTTPError as e:
    print(f"HTTP Error: {e}")
    if 'response' in locals():
        print(f"Response: {response.text[:500]}")
except requests.exceptions.RequestException as e:
    print(f"Request Error: {e}")
except Exception as e:
    print(f"Error: {e}")"""
