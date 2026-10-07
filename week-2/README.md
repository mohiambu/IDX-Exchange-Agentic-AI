# Week 2 - Natural Language Property Search

## Goal

The goal of Week 2 is to create an OpenClaw skill that converts free-text real estate searches into structured filters that can later be used to query `rets_property`.

## Example

User query:

"Show me 3-bedroom condos in Irvine under $1.5M with a pool."

Output:

```json
{
  "city": "Irvine",
  "maxPrice": 1500000,
  "beds": 3,
  "baths": null,
  "sqft": null,
  "type": "Condominium",
  "pool": "True",
  "hasView": null,
  "maxHOA": null
}