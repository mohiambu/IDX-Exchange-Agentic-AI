import { parsePropertyQuery } from "../week-2/property-search/scripts/property-search";
import { searchActiveListings } from "./property-search";
import { formatListings } from "./format-listings";
import { pool } from "./db";

async function main() {
  const query = process.argv.slice(2).join(" ");

  if (!query) {
    console.log('Usage: npx.cmd tsx week-3/agent-search.ts "Show me condos in Irvine"');
    return;
  }

  try {
    console.log("\nUser request:", query);

    const filters = await parsePropertyQuery(query);

    console.log("\nExtracted filters:");
    console.log(JSON.stringify(filters, null, 2));

    if (!filters.city) {
      console.log("\nPlease specify a city.");
      return;
    }

    const results = await searchActiveListings(filters);

    console.log("\nMatching properties:\n");
    console.log(formatListings(results as any[]));
  } catch (error) {
    console.error("Agent search failed:", error);
  } finally {
    await pool.end();
  }
}

main();
