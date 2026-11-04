
import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
import { pool } from "../week-3/db";
import { writeFileSync } from "node:fs";

config({
  path: new URL("./.env", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!
});

async function main() {
  const [rows] = await pool.query(`
    SELECT id, L_ListingID, L_City, L_Type_,
           L_SystemPrice, L_Remarks
    FROM rets_property
    WHERE L_Status = 'Active'
      AND L_Remarks IS NOT NULL
      AND TRIM(L_Remarks) <> ''
    ORDER BY id
    LIMIT 100
  `);

  const listings = rows as any[];
  const results = [];

  try {
    for (const listing of listings) {
      const text = [
        listing.L_Type_,
        listing.L_City,
        listing.L_Remarks
      ].filter(Boolean).join(". ").slice(0, 8000);

      const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: text,
        config: { taskType: "RETRIEVAL_DOCUMENT" }
      });

      results.push({
        ...listing,
        embedding: response.embeddings?.[0]?.values
      });

      console.log(`Embedded ${results.length}/${listings.length}`);
    }
  } finally {
    writeFileSync(
      "property-embeddings.json",
      JSON.stringify(results, null, 2)
    );
    await pool.end();
  }

  console.log("Saved property-embeddings.json");
}

main().catch(error => {
  console.error("Error:", error.message);
});
