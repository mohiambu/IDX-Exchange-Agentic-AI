
# Week 5 — Market Statistics Agent

## Overview
Built a market statistics agent that answers questions about California housing markets using historical property sales data.

## Features
- City-based market statistics
- Average sale price
- Median sale price
- Average price per square foot
- Average days on market
- List-to-close price ratio
- Monthly sales volume and average sale price
- Uses the latest available sale date as the reporting-period anchor

## Database
Uses the california_sold table in MySQL.

## Example Questions
- What is the median price in Irvine?
- What is the median price in Los Angeles?

## How to Run

    npx.cmd tsx week-5/market-agent.ts

To run statistics directly:

    npx.cmd tsx week-5/market-stats.ts Irvine

## Technologies
TypeScript, Node.js, MySQL, mysql2

## Testing
Successfully tested Irvine and Los Angeles market queries.

## Status
Working command-line prototype.

OpenClaw skill registration and WhatsApp integration are not yet implemented.
