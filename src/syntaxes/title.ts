import { KMarkdownSyntax } from '@/types.js';

const KMarkdownTitleSyntax: KMarkdownSyntax = {
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
export default KMarkdownTitleSyntax;
