
import { pool } from "./db";

async function main() {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS total FROM rets_property"
    );

    console.log("Database connected successfully!");
    console.log("Total properties:", rows);
  } catch (error) {
    console.error("Database error:", error);
  } finally {
    await pool.end();
  }
}

main();
