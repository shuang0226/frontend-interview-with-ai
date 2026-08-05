const CONTENT_WIDTH_IN_ADDRESS_UNITS = 17.8;
const TAG_TEXT_SCALE = 0.8125;
const TAG_CHROME_UNITS = 0.75;

function characterUnits(character: string): number {
  if (/\s/.test(character)) return 0.32;
  return /[\u0000-\u00ff]/.test(character) ? 0.55 : 1;
}

export function estimateTextUnits(text: string): number {
  return Array.from(text).reduce((total, character) => total + characterUnits(character), 0);
}

export function splitAddressForTrailingTag(address: string, leadingTagTexts: string[]): {
  firstLine: string;
  secondLine: string;
} {
  const firstLineBudget = getFirstLineBudget(leadingTagTexts);
  let usedUnits = 0;
  let splitIndex = 0;

  for (const character of Array.from(address)) {
    const nextUnits = characterUnits(character);
    if (usedUnits + nextUnits > firstLineBudget) break;
    usedUnits += nextUnits;
    splitIndex += character.length;
  }

  return {
    firstLine: address.slice(0, splitIndex),
    secondLine: address.slice(splitIndex)
  };
}

export function isAddressSingleLine(address: string, leadingTagTexts: string[]): boolean {
  return estimateTextUnits(address) <= getFirstLineBudget(leadingTagTexts);
}

function getFirstLineBudget(leadingTagTexts: string[]): number {
  const leadingTagUnits = leadingTagTexts.reduce(
    (total, tagText) => total + estimateTextUnits(tagText) * TAG_TEXT_SCALE + TAG_CHROME_UNITS,
    0
  );

  return Math.max(2, CONTENT_WIDTH_IN_ADDRESS_UNITS - leadingTagUnits);
}
