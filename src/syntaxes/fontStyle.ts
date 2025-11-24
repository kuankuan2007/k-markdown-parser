import {
  KMarkdownSyntax,
} from '../types.js';

const KMarkdownDeleteLineSyntax: KMarkdownSyntax = {
  name: 'delete-line',
  matcher(text) {
    const matcher = /~~((?:(?!~~).)+)~~/gms;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'delete-line',
          content: [value[1]],
        },
      };
    });
  },
};
const KMarkdownSuperscriptSyntax: KMarkdownSyntax = {
  name: 'superscript',
  matcher(text) {
    const matcher = /\^((?:(?!\^).)+)\^/gms;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'superscript',
          content: [value[1]],
        },
      };
    });
  },
};
const KMarkdownSubscriptSyntax: KMarkdownSyntax = {
  name: 'superscript',
  matcher(text) {
    const matcher = /~((?:(?!~).)+)~/gms;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'subscript',
          content: [value[1]],
        },
      };
    });
  },
};
export {
  KMarkdownDeleteLineSyntax,
  KMarkdownSuperscriptSyntax,
  KMarkdownSubscriptSyntax,
};
