import { KMarkdownSyntax } from '../types.js';

const KMarkdownCodeBlockSyntax: KMarkdownSyntax = {
  name: 'code-block',
  matcher(text) {
    const matcher = /^```\s*([^\n]*)?\n((?:(?!```).)*)```/gms;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'code-block',
          content: [value[2]],
          option: {
            language: value[1],
          },
        },
      };
    });
  },
};
const KMarkdownCodeInlineSyntax: KMarkdownSyntax = {
  name: 'code-inline',
  matcher(text) {
    const matcher = /`([^`]+)`/gm;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'code-inline',
          content: [value[1]],
        },
      };
    });
  },
};
export { KMarkdownCodeBlockSyntax, KMarkdownCodeInlineSyntax };
