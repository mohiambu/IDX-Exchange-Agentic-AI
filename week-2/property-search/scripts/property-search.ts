export async function parsePropertyQuery(query: string) {

  // City
  const cityMatch = query.match(
    /in ([A-Za-z\s]+?)(?:\s+under|\s+with|\s+at|$)/i
  );

  // Maximum price
  const priceMatch = query.match(
    /(?<!hoa )under \$?([\d,.]+)(k|m)?/i
  );

  // Bedrooms
  const bedsMatch = query.match(
    /(\d+)[\s-]*(bed|beds|bedroom|bedrooms)/i
  );

  // Bathrooms
  const bathsMatch = query.match(
    /(\d+(?:\.5)?)[\s-]*(bath|baths|bathroom|bathrooms)/i
  );

  // Square footage
  const sqftMatch = query.match(
    /(\d+)[\s,]*(sqft|sq ft|square feet)/i
  );

  // Pool
  const poolMatch = /pool/i.test(query);

  // View
  const viewMatch = /view/i.test(query);

  // HOA
  const hoaMatch = query.match(
    /hoa\s*(?:under|below)?\s*\$?(\d+)/i
  );

  // Property type
  const typeMap: Record<string, string> = {
    condo: "Condominium",
    townhome: "Townhouse",
    "single family": "SingleFamilyResidence",
    land: "UnimprovedLand"
  };

  const typeKey = Object.keys(typeMap).find(key =>
    query.toLowerCase().includes(key)
  );

  // Convert price
  let maxPrice = null;

  if (priceMatch) {
    maxPrice = Number(
      priceMatch[1].replace(/,/g, "")
    );

    if (priceMatch[2]?.toLowerCase() === "k") {
      maxPrice *= 1000;
    }

    if (priceMatch[2]?.toLowerCase() === "m") {
      maxPrice *= 1_000_000;
    }
  }

  // Convert HOA
  const maxHOA = hoaMatch
    ? Number(hoaMatch[1])
    : null;

  // Structured filters
  return {
    city: cityMatch?.[1]?.trim() || null,
    maxPrice,
    beds: bedsMatch ? Number(bedsMatch[1]) : null,
    baths: bathsMatch ? Number(bathsMatch[1]) : null,
    sqft: sqftMatch ? Number(sqftMatch[1]) : null,
    type: typeKey ? typeMap[typeKey] : null,
    pool: poolMatch ? "True" : null,
    hasView: viewMatch ? "True" : null,
    maxHOA
  };
}


declare const process: any;

const query = process.argv.slice(2).join(" ");

if (query) {
  parsePropertyQuery(query).then((filters) => {
    console.log(JSON.stringify(filters, null, 2));
  });
}