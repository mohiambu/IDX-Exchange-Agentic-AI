
import { searchSoldComps } from "./sold-comps";
import { pool } from "./db";

async function main() {
  try {
    const results = await searchSoldComps({
      city: "Irvine"
    }, 5);

    console.log("Recently sold property search:");
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error("Sold search failed:", error);
  } finally {
    await pool.end();
  }
}

main();
