
import { pool } from "../week-3/db";

async function main() {
  const [rows] = await pool.query(`
    SHOW COLUMNS FROM rets_property
  `);

  const columns = rows as { Field: string }[];

  console.log(
    columns
      .map((column) => column.Field)
      .filter((name) =>
        /id|status|price|bed|bath|sqft|type|remarks/i.test(name)
      )
  );

  await pool.end();
}

main().catch(console.error);
