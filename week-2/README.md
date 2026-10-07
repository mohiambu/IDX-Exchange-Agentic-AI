# Week 2 : Natural Language Property Search

## Goal

The goal of Week 2 is to build a simple natural language parser for property searches.The parser takes a user's property search and converts it into structured filters.

## Example

User search:

"Show me 3-bedroom 2-bathroom condos in Irvine under $1.5M with a pool."

Output:

{
  "city": "Irvine",
  "bedrooms": 3,
  "bathrooms": 2,
  "property_type": "Condo",
  "pool": true,
  "max_price": 1500000
}

## Filters

The parser can right now identify these:

- City
- Bedrooms
- Bathrooms
- Property type
- Maximum price
- Pool
- Square footage
- View
- HOA

## Testing

I tested the parser using different property search sentences to make sure it can extract different combinations of filters.
