---
name: property-search
description: Parse free-text real estate searches into structured property filters for rets_property.
---

# Property Search

## Overview

Parse a user's natural-language real estate query into structured filters that can be used to query `rets_property`.

Use this skill when a user asks to search for properties using criteria such as city, price, bedrooms, bathrooms, square footage, property type, pool, view, or HOA fee.

## Supported filters

- City
- Maximum price
- Minimum bedrooms
- Minimum bathrooms
- Minimum square footage
- Property type
- Pool
- View
- Maximum HOA fee

## Example

Input:

`Show me 3-bedroom condos in Irvine under $1.5M with a pool.`

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

```

## Usage

Run the parser with:

`node {baseDir}/scripts/property-search.js "<free-text property query>"`

Example:

`node {baseDir}/scripts/property-search.js "Show me 3-bedroom condos in Irvine under $1.5M with a pool"`

Return the JSON output as the structured property filter object.