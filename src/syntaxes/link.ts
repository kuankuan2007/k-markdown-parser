import { KMarkdownSyntax, KMarkdownSyntaxMatchResult } from '../types.js';
import { matchPairs } from '../util/matchPairs.js';

const KMarkdownLinkSyntax: KMarkdownSyntax = {
  name: 'link',
  matcher(text) {
    const results: KMarkdownSyntaxMatchResult[] = [];
    const matches = matchPairs(text, '[', ']');

    for (const match of matches) {
      const remainingText = text.substring(match.end + 1);
      const urlMatcher = /^\s*\(([^<][^")]*|<[^>]+>)\s*(?:"([^"]+)")?\s*\)/;
      const urlMatch = remainingText.match(urlMatcher);

      if (urlMatch) {
        results.push({
          startIndex: match.start,
          length: match.end + 1 - match.start + urlMatch[0].length,
          node: {
            name: 'link',
            content: [match.innerValue],
            option: {
              href: urlMatch[1].startsWith('<')
                ? urlMatch[1].substring(1, urlMatch[1].length - 1)
                : urlMatch[1],
              title: urlMatch[2],
            },
          },
        });
      }
    }
    return results;
  },
};
const KMarkdownAutoLinkSyntax: KMarkdownSyntax = {
  name: 'auto-link',
  matcher(text, option) {
    if (!option.autoParseLink) {
      return [];
    }
    const matcher =
      /(((ht|f)tps?):\/\/)([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/g;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'link',
          content: [value[0]],
          canParseSubContent: false,
          option: {
            href: value[0],
          },
        },
      };
    });
  },
};
const KMarkdownRawLinkSyntax: KMarkdownSyntax = {
  name: 'raw-link',
  matcher(text) {
    const matcher =
      /<((((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?)>/g;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'link',
          content: [value[1]],
          option: {
            href: value[1],
          },
        },
      };
    });
  },
};
export { KMarkdownLinkSyntax, KMarkdownRawLinkSyntax, KMarkdownAutoLinkSyntax };
