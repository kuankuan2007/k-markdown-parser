import { KMarkdownSyntax } from '../types.js';

const KMarkdownUnorderedListSyntax: KMarkdownSyntax = {
  name: 'unordered-list',
  matcher(text) {
    const matcher = /^(\s*)(-|\+)[^-+]+.+/gms;
    return [...text.matchAll(matcher)].map((value) => {
      const indent = value[1];
      const usedTags = value[2];
      const content = [
        ...text.matchAll(
          new RegExp(`^${indent}\\${usedTags}(?:(?!^${indent}\\${usedTags}).)+`, 'gms')
        ),
      ].map((itemValue) => {
        return {
          name: 'unordered-list-item',
          content: [itemValue[0].replace(new RegExp(`^${indent}\\${usedTags}\\s*`), '')],
        };
      });
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'unordered-list',
          content,
        },
      };
    });
  },
};
const KMarkdownOrderedListSyntax: KMarkdownSyntax = {
  name: 'ordered-list',
  matcher(text) {
    const matcher = /^(\s*)(\d+)\..+/gms;
    return [...text.matchAll(matcher)].map((value) => {
      const indent = value[1];

      const content = [
        ...text.matchAll(new RegExp(`^${indent}(\\d+)\\.(?:(?!^${indent}\\d+\\.).)+`, 'gms')),
      ].map((itemValue) => {
        return {
          name: 'ordered-list-item',
          content: [itemValue[0].replace(new RegExp(`^${indent}${itemValue[1]}\\.\\s*`), '')],
          option: {
            indexInWriting: Number(itemValue[1]),
          },
        };
      });
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'ordered-list',
          content,
        },
      };
    });
  },
};
export { KMarkdownUnorderedListSyntax, KMarkdownOrderedListSyntax };
