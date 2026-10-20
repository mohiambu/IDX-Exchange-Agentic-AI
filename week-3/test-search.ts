import { searchActiveListings } from "./property-search";
import { formatListings } from "./format-listings";
import { pool } from "./db";

async function main() {
  try {
    const results = await searchActiveListings({
      city: "Irvine"
    });

    console.log("Matching properties:\n");
    console.log(formatListings(results as any[]));
  } catch (error) {
    console.error("Search failed:", error);
  } finally {
    await pool.end();
  }
}

main();
