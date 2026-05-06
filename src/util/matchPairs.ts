export function matchPairs(
  text: string,
  startChar: string,
  endChar: string
): { start: number; end: number; innerValue: string }[] {
  const results: { start: number; end: number; innerValue: string }[] = [];
  let depth = 0;
  let startIndex = -1;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === startChar) {
      if (depth === 0) {
        startIndex = i;
      }
      depth++;
    } else if (text[i] === endChar) {
      if (depth > 0) {
        depth--;
        if (depth === 0 && startIndex !== -1) {
          results.push({
            start: startIndex,
            end: i,
            innerValue: text.substring(startIndex + 1, i),
          });
          startIndex = -1;
        }
      }
    }
  }

  return results;
}
