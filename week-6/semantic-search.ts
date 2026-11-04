
import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
import { readFileSync } from "node:fs";

config({ path: new URL("./.env", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1") });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!
});

type Listing = {
  id: number;
  L_ListingID: string;
  L_City: string;
  L_Type_: string;
  L_SystemPrice: number;
  L_Remarks: string;
  embedding: number[];
};

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) {
    throw new Error("Invalid embedding dimensions");
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] ** 2;
    normB += b[i] ** 2;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function main() {
  const query = process.argv.slice(2).join(" ").trim();

  if (!query) {
    console.log('Usage: npx.cmd tsx .\\semantic-search.ts "your description"');
    return;
  }

  const listings: Listing[] = JSON.parse(
    readFileSync(new URL("./property-embeddings.json", import.meta.url), "utf8")
  );

  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: query,
    config: { taskType: "RETRIEVAL_QUERY" }
  });

  const queryVector = response.embeddings?.[0]?.values;

  if (!queryVector) {
    throw new Error("Failed to generate query embedding");
  }

  const matches = listings
    .filter(listing => Array.isArray(listing.embedding))
    .map(listing => ({
      ...listing,
      similarity: cosineSimilarity(queryVector, listing.embedding)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);

  console.log(`\nTop 5 matches for: "${query}"\n`);

  matches.forEach((listing, index) => {
    console.log(`${index + 1}. ${listing.L_City} — ${listing.L_Type_}`);
    console.log(`   Price: $${Number(listing.L_SystemPrice).toLocaleString()}`);
    console.log(`   Similarity: ${listing.similarity.toFixed(4)}`);
    console.log(`   Listing ID: ${listing.L_ListingID}`);
    console.log(`   Description: ${listing.L_Remarks.slice(0, 180)}...\n`);
  });
}

main().catch(error => console.error("Search failed:", error.message));
