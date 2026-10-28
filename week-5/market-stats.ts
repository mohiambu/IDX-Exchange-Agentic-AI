
import { pool } from "../week-3/db";
import type { RowDataPacket } from "mysql2";

interface MarketRow extends RowDataPacket {
  ClosePrice: number;
  LivingArea: number | null;
  ListPrice: number | null;
  DaysOnMarket: number | null;
  CloseDate: Date | string;
}

export async function getMarketStats(city: string) {
  // Anchor the 12-month period to the latest sale in our dataset.
  const [dateRows] = await pool.query<RowDataPacket[]>(
    `SELECT MAX(CloseDate) AS latestDate
     FROM california_sold
     WHERE City = ? AND ClosePrice > 0`,
    [city]
  );

  const latestDate = dateRows[0]?.latestDate;

  if (!latestDate) {
    return null;
  }

  const [rows] = await pool.query<MarketRow[]>(
    `SELECT ClosePrice, LivingArea, ListPrice,
            DaysOnMarket, CloseDate
     FROM california_sold
     WHERE City = ?
       AND ClosePrice > 0
       AND CloseDate > DATE_SUB(?, INTERVAL 12 MONTH)
       AND CloseDate <= ?
     ORDER BY ClosePrice`,
    [city, latestDate, latestDate]
  );

  if (rows.length === 0) return null;

  const prices = rows.map(r => Number(r.ClosePrice));
  const middle = Math.floor(prices.length / 2);

  const medianPrice = prices.length % 2
    ? prices[middle]
    : (prices[middle - 1] + prices[middle]) / 2;

  const average = (values: number[]) =>
    values.length
      ? values.reduce((a, b) => a + b, 0) / values.length
      : null;

  const pricePerSqft = rows
    .filter(r => Number(r.LivingArea) > 0)
    .map(r => Number(r.ClosePrice) / Number(r.LivingArea));

  const daysOnMarket = rows
    .filter(r => r.DaysOnMarket != null)
    .map(r => Number(r.DaysOnMarket));

  const listToClose = rows
    .filter(r => Number(r.ListPrice) > 0)
    .map(r => Number(r.ClosePrice) / Number(r.ListPrice) * 100);

  const monthly = new Map<string, number[]>();

  for (const row of rows) {
    const date = new Date(row.CloseDate);
    const month = date.toISOString().slice(0, 7);
    const values = monthly.get(month) ?? [];
    values.push(Number(row.ClosePrice));
    monthly.set(month, values);
  }

  return {
    city,
    latestDate,
    soldCount: rows.length,
    averagePrice: average(prices),
    medianPrice,
    averagePricePerSqft: average(pricePerSqft),
    averageDaysOnMarket: average(daysOnMarket),
    listToClosePercent: average(listToClose),
    monthlyTrend: [...monthly.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, values]) => ({
        month,
        soldCount: values.length,
        averagePrice: average(values)
      }))
  };
}

async function main() {
  const city = process.argv.slice(2).join(" ") || "Irvine";
  const stats = await getMarketStats(city);

  if (!stats) {
    console.log(`No sold-property data found for ${city}.`);
    return;
  }

  const money = (value: number | null) =>
    value == null ? "N/A" : "$" + Math.round(value).toLocaleString();

  const number = (value: number | null) =>
    value == null ? "N/A" : value.toFixed(1);

  console.log(`\nMarket Statistics: ${stats.city}`);
  console.log(`Latest sale date: ${new Date(stats.latestDate).toLocaleDateString()}`);
  console.log("Period: 12 months ending on latest available sale");
  console.log("--------------------------------");
  console.log("Properties sold:", stats.soldCount);
  console.log("Average sale price:", money(stats.averagePrice));
  console.log("Median sale price:", money(stats.medianPrice));
  console.log("Average price/sqft:", money(stats.averagePricePerSqft));
  console.log("Average days on market:", number(stats.averageDaysOnMarket));
  console.log("List-to-close ratio:", number(stats.listToClosePercent) + "%");

  console.log("\nMonthly trend:");
  for (const month of stats.monthlyTrend) {
    console.log(
      `${month.month}: ${month.soldCount} sales, average ${money(month.averagePrice)}`
    );
  }
}

if (process.argv[1]?.includes("market-stats")) {
  main().catch(console.error);
}
