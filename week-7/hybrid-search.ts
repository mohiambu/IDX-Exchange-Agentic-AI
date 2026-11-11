
import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Load Gemini API key
config({
  path: fileURLToPath(new URL("../week-6/.env", import.meta.url))
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

type Property = {
  id: number;
  L_ListingID: string;
  L_City: string;
  L_Type_: string;
  L_SystemPrice: number;
  L_Remarks: string;
  embedding: number[];
};

type SearchOptions = {
  city?: string;
  maxPrice?: number;
  type?: string;
  preferences: string;
  limit?: number;
};

// Load Week 6 embeddings
const embeddingsPath = fileURLToPath(
  new URL("../week-6/property-embeddings.json", import.meta.url)
);

const properties: Property[] = JSON.parse(
  readFileSync(embeddingsPath, "utf-8")
);

// Treat "Any" and empty values as no filter
function isAny(value?: string): boolean {
  return !value || value.trim().toLowerCase() === "any";
}

// Structured filtering
function filterProperties(options: SearchOptions): Property[] {
  return properties.filter((property) => {
    const matchesCity =
      isAny(options.city) ||
      property.L_City?.trim().toLowerCase() ===
        options.city!.trim().toLowerCase();

    const matchesPrice =
      options.maxPrice === undefined ||
      Number(property.L_SystemPrice) <= options.maxPrice;

    const matchesType =
      isAny(options.type) ||
      property.L_Type_?.trim().toLowerCase() ===
        options.type!.trim().toLowerCase();

    return matchesCity && matchesPrice && matchesType;
  });
}

// Cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length || a.length === 0) {
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

  if (normA === 0 || normB === 0) return 0;

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Hybrid search
export async function hybridSearch(options: SearchOptions) {
  const matches = filterProperties(options);

  console.log(`Filtered properties: ${matches.length}`);

  if (matches.length === 0) return [];

  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: options.preferences,
    config: {
      taskType: "RETRIEVAL_QUERY"
    }
  });

  const queryEmbedding = response.embeddings?.[0]?.values;

  if (!queryEmbedding) {
    throw new Error("Gemini did not return an embedding");
  }

  return matches
    .map((property) => ({
      listingId: property.L_ListingID,
      city: property.L_City,
      type: property.L_Type_,
      price: property.L_SystemPrice,
      description: property.L_Remarks,
      similarity: cosineSimilarity(
        queryEmbedding,
        property.embedding
      )
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, options.limit ?? 5);
}

// Command-line interface
async function main() {
  const city = process.argv[2] || "Any";
  const priceArg = process.argv[3] || "Any";
  const preferences =
    process.argv[4] ||
    "A modern home with beautiful views and a spacious kitchen";
  const type = process.argv[5] || "Any";

  const maxPrice = isAny(priceArg)
    ? undefined
    : Number(priceArg);

  if (
    maxPrice !== undefined &&
    (!Number.isFinite(maxPrice) || maxPrice <= 0)
  ) {
    throw new Error("Maximum price must be a positive number");
  }

  console.log("Week 7: Hybrid Property Recommendations");
  console.log(`Indexed properties: ${properties.length}`);
  console.log(`City: ${city}`);
  console.log(`Maximum price: ${maxPrice ?? "Any"}`);
  console.log(`Property type: ${type}`);
  console.log(`Preferences: ${preferences}`);

  const results = await hybridSearch({
    city,
    maxPrice,
    type,
    preferences,
    limit: 5
  });

  if (results.length === 0) {
    console.log(
      "\nNo matches in the current 100-property embedding index."
    );
    return;
  }

  console.log("\nTop 5 Hybrid Recommendations:");

  results.forEach((property, index) => {
    console.log(`\n${index + 1}. ${property.city}`);
    console.log(`Listing ID: ${property.listingId}`);
    console.log(`Type: ${property.type}`);
    console.log(
      `Price: $${Number(property.price).toLocaleString()}`
    );
    console.log(`Similarity: ${property.similarity.toFixed(4)}`);
    console.log(
      `Description: ${property.description?.slice(0, 250)}...`
    );
  });
}

// Run CLI only when this file is executed directly
const isDirectRun =
  process.argv[1]?.replace(/\\/g, "/").toLowerCase().endsWith(
    "/week-7/hybrid-search.ts"
  );

if (isDirectRun) {
  main().catch((error) => {
    console.error("Hybrid search failed:", error);
    process.exitCode = 1;
  });
}

