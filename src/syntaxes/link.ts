import { KMarkdownSyntax } from '@/types.js';

const KMarkdownLinkSyntax: KMarkdownSyntax = {
  name: 'link',
  matcher(text) {
    const matcher = /\[\s*([^\]]+)\s*\]\s*\(([^")]+)\s*(?:"([^"]+)")?\s*\)/g;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'link',
          content: [value[1]],
          option: {
            href: value[2],
            title: value[3],
          },
        },
      };
    });
  },
};
export default KMarkdownLinkSyntax;
