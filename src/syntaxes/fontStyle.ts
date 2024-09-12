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
const KMarkdownItalicSyntax: KMarkdownSyntax = {
  name: 'italic',
  matcher(text) {
    const matcher = /\*((?:(?!\*).)+)\*|_((?:(?!_).)+)_/gms;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'italic',
          content: [value[1]||value[2]],
        },
      };
    });
  },
};
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
  KMarkdownBoldSyntax,
  KMarkdownItalicSyntax,
  KMarkdownDeleteLineSyntax,
  KMarkdownSuperscriptSyntax,
  KMarkdownSubscriptSyntax,
};
