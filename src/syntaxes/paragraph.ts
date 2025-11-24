import { KMarkdownRootNode } from '../nodes/core.js';
import { KMarkdownSyntax } from '../types.js';

const KMarkdownParagraphSyntax: KMarkdownSyntax = {
  name: 'paragraph',
  matcher(text, _option, parentNode) {
    if (parentNode instanceof KMarkdownRootNode) {
      return [
        {
          startIndex: 0,
          length: text.length,
          node: {
            name: 'paragraph',
            content: [text],
          },
        },
      ];
    }
    return [];
  },
};
export default KMarkdownParagraphSyntax;
