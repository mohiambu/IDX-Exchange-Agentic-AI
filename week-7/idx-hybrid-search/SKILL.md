---
name: idx-hybrid-search
description: Recommend California properties using structured filters and Gemini semantic similarity.
---

# IDX Hybrid Property Search

Use this skill when users request California property recommendations.

## Execution

Run the Week 7 script:

    cd C:\Users\M7MDA\OneDrive\Desktop\IDX-Exchange-Agentic-AI\week-7
    npx.cmd tsx .\hybrid-search.ts Any 1000000 "A cozy cabin with mountain views and a fireplace"

Arguments:
1. City or Any
2. Maximum price or Any
3. Natural-language preferences
4. Property type or Any (optional)

Replace example arguments with the user's requirements.

Return up to five matching listings with city, price, property type, and listing ID.

Only 100 properties are indexed. Never invent results.
