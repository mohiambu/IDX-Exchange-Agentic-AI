
import { createInterface } from "node:readline";
import { getMarketStats } from "./market-stats";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "You: "
});

console.log("California Market Statistics Agent");
console.log("Ask about a city's housing market. Type exit to quit.");
rl.prompt();

rl.on("line", async (message) => {
  if (message.trim().toLowerCase() === "exit") {
    rl.close();
    return;
  }

  rl.pause();

  try {
    const match = message.match(
      /\b(?:in|for|of)\s+([a-z]+(?:\s+[a-z]+)?)\??$/i
    );

    if (!match) {
      console.log("\nAgent: Please include a city, such as 'What is the median price in Irvine?'\n");
    } else {
      const city = match[1].trim();
      const stats = await getMarketStats(city);

      if (!stats) {
        console.log(`\nAgent: No sales data found for ${city}.\n`);
      } else {
        const money = (n: number | null) =>
          n == null ? "N/A" : "$" + Math.round(n).toLocaleString();

        const number = (n: number | null) =>
          n == null ? "N/A" : n.toFixed(1);

        const period = new Date(stats.latestDate).toLocaleDateString();

        console.log(`\nAgent: ${city} market statistics (through ${period})`);
        console.log(`Sales: ${stats.soldCount}`);
        console.log(`Median price: ${money(stats.medianPrice)}`);
        console.log(`Average price: ${money(stats.averagePrice)}`);
        console.log(`Price per sqft: ${money(stats.averagePricePerSqft)}`);
        console.log(`Days on market: ${number(stats.averageDaysOnMarket)}`);
        console.log(`List-to-close ratio: ${number(stats.listToClosePercent)}%`);

        console.log("\nMonthly trend:");
        for (const month of stats.monthlyTrend) {
          console.log(
            `${month.month}: ${month.soldCount} sales, avg ${money(month.averagePrice)}`
          );
        }
        console.log();
      }
    }
  } catch (error) {
    console.error("Agent error:", error);
  }

  rl.resume();
  rl.prompt();
});
