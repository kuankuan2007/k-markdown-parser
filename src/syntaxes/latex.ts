import { KMarkdownSyntax } from '@/types.js';

const KMarkdownLatexBlockSyntax: KMarkdownSyntax = {
  name: 'latex-block',
  matcher(text) {
    const matcher = /^\$\$\s*((?:(?!\$\$).)*)\$\$/gms;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'latex-block',
          content: [value[1]],
        },
      };
    });
  },
};
const KMarkdownLatexInlineSyntax: KMarkdownSyntax = {
  name: 'latex-inline',
  matcher(text) {
    const matcher = /\$([^$]+)\$/gm;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'latex-inline',
          content: [value[1]],
        },
      };
    });
  },
};
export { KMarkdownLatexBlockSyntax, KMarkdownLatexInlineSyntax };
