
import { pool } from "./db";

export interface SoldFilters {
  city: string;
  beds?: number;
  maxPrice?: number;
  type?: string;
}

export async function searchSoldComps(
  filters: SoldFilters,
  limit = 10
) {
  let sql = `
    SELECT
      ListingKey,
      UnparsedAddress AS address,
      City AS city,
      ClosePrice AS price,
      CloseDate AS soldDate,
      BedroomsTotal AS beds,
      BathroomsTotalInteger AS baths,
      LivingArea AS sqft,
      PropertySubType AS type,
      DaysOnMarket AS daysOnMarket
    FROM california_sold
    WHERE City = ?
      AND ClosePrice IS NOT NULL
  `;

  const params: (string | number)[] = [filters.city];

  if (filters.beds != null) {
    sql += " AND BedroomsTotal >= ?";
    params.push(filters.beds);
  }

  if (filters.maxPrice != null) {
    sql += " AND ClosePrice <= ?";
    params.push(filters.maxPrice);
  }

  if (filters.type) {
    sql += " AND PropertySubType = ?";
    params.push(filters.type);
  }

  sql += " ORDER BY CloseDate DESC LIMIT ?";
  params.push(Math.min(50, Math.max(1, Math.floor(limit))));

  const [rows] = await pool.query(sql, params);
  return rows;
}
