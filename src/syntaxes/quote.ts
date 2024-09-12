import { KMarkdownSyntax } from '@/types.js';

const KMarkdownQuoteSyntax: KMarkdownSyntax = {
  name: 'quote',
  matcher(text) {
    const matcher = /^\s*>\s*.+/gms;
    return [...text.matchAll(matcher)].map((value) => {
      const content = value[0]
        .replaceAll(/^\s*>[^\S\n]*/gm, '')
        .replaceAll(/^\s*$/gm, '')
        .split(/\n\n|\s{2,}\n/gm);
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'quote-block',
          content: content.map((value) => {
            return {
              name: 'quote-item',
              content: [value],
            };
          }),
        },
      };
    });
  },
};
export default KMarkdownQuoteSyntax;
