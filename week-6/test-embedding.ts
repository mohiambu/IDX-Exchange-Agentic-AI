
import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";

config({ path: new URL("./.env", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1") });

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log("GEMINI_API_KEY is missing.");
    return;
  }

  const ai = new GoogleGenAI({ apiKey });

  const result = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: "A beautiful house with a swimming pool in Irvine",
  });

  const vector = result.embeddings?.[0]?.values;

  console.log("Embedding generated:", !!vector);
  console.log("Vector dimensions:", vector?.length);
  console.log("First 5 values:", vector?.slice(0, 5));
}

main().catch((error) => {
  console.error("Embedding test failed:", error.message);
});
