
import { createInterface } from "node:readline";
import { parsePropertyQuery } from "../week-2/property-search/scripts/property-search";
import { searchActiveListings } from "../week-3/property-search";
import { formatListings } from "../week-3/format-listings";
import {
  getSession,
  updateSession,
  clearSession
} from "./session-memory";

async function handleMessage(
  userId: string,
  message: string
): Promise<string> {
  const input = message.trim();

  if (/^(reset|start over|clear)$/i.test(input)) {
    clearSession(userId);
    return "Search reset. Which city are you interested in?";
  }

  const parsed = await parsePropertyQuery(input);
  // Correct a known city parsing issue.
  const irvineMatch = input.match(/\b(?:irvine|urvine)\b/i);
  if (irvineMatch) {
    parsed.city = "Irvine";}
  const previous = getSession(userId);

  // Keep previous filters unless the user supplies new ones.
  const updates = Object.fromEntries(
    Object.entries(parsed).filter(
      ([, value]) => value !== null && value !== undefined
    )
  );

  const session = updateSession(userId, {
    ...updates,
    conversationStep: previous.conversationStep + 1
  });

  if (!session.city) {
    return "Which California city are you interested in?";
  }

  if (!session.maxPrice) {
    return `What is your maximum budget for ${session.city}?`;
  }

  if (!session.type) {
    return "Do you prefer a condo, townhome, or single family home?";
  }

  const listings = await searchActiveListings({
    city: session.city,
    maxPrice: session.maxPrice,
    beds: session.beds,
    baths: session.baths,
    sqft: session.sqft,
    type: session.type,
    pool: session.pool,
    hasView: session.hasView,
    maxHOA: session.maxHOA
  });

  updateSession(userId, { lastResults: listings });

  if (listings.length === 0) {
    return "No matching properties found. Try changing your filters.";
  }

  return formatListings(listings);
}

async function main() {
  const userId = "demo-user";
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "You: "
  });

  console.log("Property Search Agent");
  console.log("Type 'reset' to start over, or 'exit' to quit.");
  rl.prompt();

  rl.on("line", async (message) => {
    if (message.trim().toLowerCase() === "exit") {
      rl.close();
      return;
    }

    rl.pause();

    try {
      const response = await handleMessage(userId, message);
      console.log("\nAgent:", response, "\n");
    } catch (error) {
      console.error("Search error:", error);
    }

    rl.resume();
    rl.prompt();
  });
}

main();
