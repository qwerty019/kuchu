export function normalizeQuery(query: string): string {
  // Convert query to lowercase and split by whitespace.
  const tokens = query.toLowerCase().split(/\s+/);
  const normalizedTokens: string[] = [];

  // Allowed vitamin numbers for vitamin B.
  const allowedVitaminNumbers = new Set([
    "1",
    "2",
    "3",
    "5",
    "6",
    "7",
    "9",
    "12",
  ]);

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];

    // Normalize vitamin B tokens written together, e.g., "б12", "в12", or "b12"
    const vitaminMatch = token.match(/^([бвb])(\d{1,2})$/);
    if (vitaminMatch) {
      const vitaminNumber = vitaminMatch[2];
      if (allowedVitaminNumbers.has(vitaminNumber)) {
        normalizedTokens.push("b" + vitaminNumber);
        continue;
      }
    }

    // Normalize vitamin B tokens written as separate tokens, e.g. "б 12" or "b 12"
    if (
      (token === "б" || token === "в" || token === "b") &&
      i < tokens.length - 1
    ) {
      const nextToken = tokens[i + 1];
      if (/^\d{1,2}$/.test(nextToken) && allowedVitaminNumbers.has(nextToken)) {
        normalizedTokens.push("b" + nextToken);
        i++; // Skip the next token as it's combined now.
        continue;
      }
    }

    // Normalize variations for "ношпа" (with or without hyphen).
    if (token === "ношпа" || token === "но-шпа") {
      normalizedTokens.push("но-шпа");
      continue;
    }

    if (token === "денол" || token === "де-нол") {
      normalizedTokens.push("де-нол");
      continue;
    }

    if (token === "витапос" || token === "вита-пос") {
      normalizedTokens.push("вита-пос");
      continue;
    }

    if (token === "умифиновир") {
      normalizedTokens.push("умифеновир");
      continue;
    }

    if (token === "сени") {
      normalizedTokens.push("seni");
      continue;
    }

    // Normalize variations for "кашель".
    if (token === "кашель" || token === "кашля" || token === "кашел") {
      normalizedTokens.push("кашл");
      continue;
    }

    // Normalize "л-карнитин" written as two tokens (like "л карнитин" or "l карнитин").
    if ((token === "л" || token === "l") && tokens[i + 1] === "карнитин") {
      normalizedTokens.push("l-карнитин");
      i++; // Skip the next token.
      continue;
    }

    // If no special case applies, push the token as-is.
    normalizedTokens.push(token);
  }

  // Rejoin tokens with a space.
  return normalizedTokens.filter(Boolean).join(" ");
}
