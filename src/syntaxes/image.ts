import { KMarkdownSyntax } from '../types.js';

const KMarkdownImageSyntax: KMarkdownSyntax = {
  name: 'image',
  matcher(text) {
    const matcher = /!\[\s*([^\]]+)\s*\]\s*\(([^")]+)\s*(?:"([^"]+)")?\s*\)/g;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'image',
          content: [],
          option: {
            src: value[2],
            alt: value[1],
            title: value[3],
          },
        },
      };
    });
  },
};
export default KMarkdownImageSyntax;
