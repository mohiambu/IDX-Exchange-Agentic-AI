
import { pool } from "../week-3/db";

async function main() {
  const [rows] = await pool.query(`
    SELECT
      L_Status,
      StandardStatus,
      COUNT(*) AS total
    FROM rets_property
    GROUP BY L_Status, StandardStatus
    ORDER BY total DESC
    LIMIT 15
  `);

  console.table(rows);
  await pool.end();
}

main().catch(console.error);
