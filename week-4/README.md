
# Week 4 — Conversational Property Search Agent

## Overview
Built a multi-turn property search agent using TypeScript and MySQL.

The agent remembers user preferences across messages and updates property search filters as the conversation continues.

## Features
- Session memory using a Map
- Natural-language property search
- Follow-up questions for missing preferences
- MySQL property searches
- Property results with address, price, bedrooms, bathrooms, size, and photo count
- Reset conversation command

## Example Conversation
User: Find homes in Irvine

Agent: What is your maximum budget for Irvine?

User: Under 800k

Agent: Do you prefer a condo, townhome, or single family home?

User: Condo with 2 bedrooms

Agent: Displays matching property listings.

User: With a pool

Agent: Searches again using the updated filters.

## How to Run
From the project root:

    npx.cmd tsx week-4/conversational-agent.ts

## Technologies
TypeScript, Node.js, MySQL, mysql2

## Status
Working command-line prototype.

WhatsApp integration is not yet implemented.
