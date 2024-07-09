import { KMarkdownSyntax } from '@/types.js';

const KMarkdownBoldSyntax: KMarkdownSyntax = {
  name: 'bold',
  matcher(text) {
    const matcher = /\*\*((?:(?!\*\*).)+)\*\*|__((?:(?!__).)+)__/gms;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'bold',
          content: [value[1]],
        },
      };
    });
  },
};
export default KMarkdownBoldSyntax;
