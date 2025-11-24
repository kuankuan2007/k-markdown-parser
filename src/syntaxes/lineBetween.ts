import { KMarkdownSyntax } from '../types.js';

const KMarkdownLineBetweenSyntax: KMarkdownSyntax = {
  name: 'line-between',
  matcher(text) {
    const matcher = /^(?:\*{3,}|-{3,}|_{3,})$/gm;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'line-between',
          content: [],
        },
      };
    });
  },
};
export default KMarkdownLineBetweenSyntax;
