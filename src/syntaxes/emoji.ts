import { KMarkdownSyntax } from '@/types.js';

const KMarkdownEmojiSyntax: KMarkdownSyntax = {
  name: 'emoji',
  matcher(text) {
    const matcher = /:([a-zA-Z0-9_]+)/g;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'emoji',
          content: [],
          option: {
            name: value[1],
          },
        },
      };
    });
  },
};
export default KMarkdownEmojiSyntax;
