export function formatListings(properties: any[]): string {
  if (properties.length === 0) {
    return "No matching properties found.";
  }

  return properties.map((p, i) => [
    `Property ${i + 1}`,
    `Address: ${p.L_Address}, ${p.L_City}`,
    `Price: $${Number(p.price).toLocaleString("en-US")}`,
    `Beds: ${p.beds} | Baths: ${p.baths}`,
    `Size: ${p.sqft} sq ft`,
    `Type: ${p.type}`,
    `Photos: ${p.PhotoCount}`,
    `Listing ID: ${p.L_ListingID}`
  ].join("\n")).join("\n\n--------------------\n\n");
}
