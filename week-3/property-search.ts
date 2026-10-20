
import { pool } from "./db";

export interface PropertyFilters {
  city?: string | null;
  maxPrice?: number | null;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  type?: string | null;
  pool?: string | null;
  hasView?: string | null;
  maxHOA?: number | null;
}

export async function searchActiveListings(
  filters: PropertyFilters,
  page = 1,
  limit = 10
) {
  const safePage = Math.max(1, Math.floor(page));
  const safeLimit = Math.min(50, Math.max(1, Math.floor(limit)));
  const offset = (safePage - 1) * safeLimit;

  let sql = `
    SELECT
      L_ListingID,
      L_Address,
      L_City,
      L_SystemPrice AS price,
      L_Keyword2 AS beds,
      LM_Dec_3 AS baths,
      LM_Int2_3 AS sqft,
      L_Type_ AS type,
      PhotoCount
    FROM rets_property
    WHERE L_Status = 'Active'
  `;

  const params: (string | number)[] = [];

  if (filters.city) {
    sql += " AND L_City = ?";
    params.push(filters.city);
  }

  if (filters.maxPrice != null) {
    sql += " AND L_SystemPrice <= ?";
    params.push(filters.maxPrice);
  }

  if (filters.beds != null) {
    sql += " AND L_Keyword2 >= ?";
    params.push(filters.beds);
  }

  if (filters.baths != null) {
    sql += " AND LM_Dec_3 >= ?";
    params.push(filters.baths);
  }

  if (filters.sqft != null) {
    sql += " AND LM_Int2_3 >= ?";
    params.push(filters.sqft);
  }

  if (filters.type) {
    sql += " AND L_Type_ = ?";
    params.push(filters.type);
  }

  if (filters.pool) {
    sql += " AND PoolPrivateYN = ?";
    params.push(filters.pool);
  }

  if (filters.hasView) {
    sql += " AND ViewYN = ?";
    params.push(filters.hasView);
  }

  if (filters.maxHOA != null) {
    sql += " AND AssociationFee <= ?";
    params.push(filters.maxHOA);
  }

  sql += " ORDER BY L_SystemPrice ASC LIMIT ? OFFSET ?";
  params.push(safeLimit, offset);

  const [rows] = await pool.query(sql, params);

  return rows;
}

