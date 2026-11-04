
import { pool } from "../week-3/db";

async function main() {
  const [rows] = await pool.query(`
    SELECT
      L_City,
      L_Remarks
    FROM rets_property
    WHERE L_Remarks IS NOT NULL
      AND TRIM(L_Remarks) <> ''
    LIMIT 3
  `);

  console.log(rows);
  await pool.end();
}

main().catch(console.error);
