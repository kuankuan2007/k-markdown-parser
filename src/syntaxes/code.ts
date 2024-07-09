import { KMarkdownSyntax } from '@/types.js';

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
const KMarkdownInlineCodeSyntax: KMarkdownSyntax = {
  name: 'title',
  matcher(text) {
    const matcher = /^(#+)\s*([^{\n#]+)[\s#]*(?:\{([^}\n]+)\})?\s*\n$/gm;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'title',
          content: [value[2]],
          option: {
            level: value[1].length,
            id: value[3],
          },
        },
      };
    });
  },
};
export { KMarkdownCodeBlockSyntax, KMarkdownInlineCodeSyntax };
