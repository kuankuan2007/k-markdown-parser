import { KMarkdownSyntax } from '../types.js';

const KMarkdownWellTitleSyntax: KMarkdownSyntax = {
  name: 'well-title',
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
const KMarkdownGaplineTitleSyntax: KMarkdownSyntax = {
  name: 'gapline-title',
  matcher(text) {
    const matcher = /^(.+)\n(-{3,}|={3,})/gm;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'title',
          content: [value[1]],
          option: {
            level: value[2][0] === '=' ? 1 : 2,
          },
        },
      };
    });
  },
};
export { KMarkdownWellTitleSyntax, KMarkdownGaplineTitleSyntax };
