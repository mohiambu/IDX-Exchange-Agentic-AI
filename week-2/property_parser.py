import re
from warnings import filters


def parse_property_search(query):
    filters = {}
    query = query.lower()

    # City
    if "irvine" in query:
        filters["city"] = "Irvine"

    # Bedrooms
    bedroom_match = re.search(r"(\d+)[-\s]?bedroom",query)
    if bedroom_match:
        filters["bedrooms"] = int(bedroom_match.group(1))

    # Property type
    if "condo" in query:
        filters["property_type"] = "Condo"

    # Pool
    if "pool" in query:
        filters["pool"] = True

    # Maximum price
    # Maximum price
    price_match = re.search(r"(?<!hoa )under \$?([\d.]+)\s*(m|million|k|thousand)?",query)

    if price_match:
        price = float(price_match.group(1))
        unit = price_match.group(2)

        if unit in ["m", "million"]:
            price *= 1_000_000
        elif unit in ["k", "thousand"]:
            price *= 1_000

        filters["max_price"] = int(price)



    # Bathrooms
    bathroom_match = re.search(r"(\d+)[-\s]?bathroom", query)
    if bathroom_match:
        filters["bathrooms"] = int(bathroom_match.group(1))


    # Square footage
    sqft_match = re.search(r"(\d+)\s*(sqft|sq ft|square feet)", query)
    if sqft_match:
        filters["min_sqft"] = int(sqft_match.group(1))



    # View
    if "ocean view" in query:
        filters["view"] = "Ocean"
    elif "mountain view" in query:
        filters["view"] = "Mountain"
    elif "city view" in query:
        filters["view"] = "City"   


    # HOA
    hoa_match = re.search(r"hoa\s*(under|below)?\s*\$?(\d+)", query)

    if hoa_match:
        filters["max_hoa"] = int(hoa_match.group(2))


    return filters

# query = "Show me 3-bedroom 2-bathroom condos in Irvine under $1.5M with a pool, 1800 sqft, and an ocean view"

# result = parse_property_search(query)

# print(result)


# Test searches
queries = [
    "Show me 3-bedroom 2-bathroom condos in Irvine under $1.5M with a pool",
    "Find a 2-bedroom condo in Irvine under $800k",
    "I want a 4-bedroom 3-bathroom condo with an ocean view",
    "Find a condo in Irvine with HOA under $400"
]

for query in queries:
    print("\nSearch:", query)
    print("Filters:", parse_property_search(query))