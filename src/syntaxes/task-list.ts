import { KMarkdownSyntax } from '../types.js';

const KMarkdownTaskListSyntax: KMarkdownSyntax = {
  name: 'task-list',
  matcher(text) {
    const matcher = /^(\s*)-\s*\[\s*x?\s*\].+/gms;
    return [...text.matchAll(matcher)].map((value) => {
      const indent = value[1];

      const content = [
        ...text.matchAll(
          new RegExp(
            `^${indent}-\\s*\\[\\s*(x?)\\s*\\](?:(?!^${indent}-\\s*\\[\\s*x?\\s*\\]).)+`,
            'gms'
          )
        ),
      ].map((itemValue) => {
        return {
          name: 'task-list-item',
          content: [itemValue[0].replace(new RegExp(`^${indent}-\\s*\\[\\s*x?\\s*\\]\\s*`), '')],
          option: {
            finished: itemValue[1] === 'x',
          },
        };
      });
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'task-list',
          content,
        },
      };
    });
  },
};
export default KMarkdownTaskListSyntax;
