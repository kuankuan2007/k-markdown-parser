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
const KMarkdownAutoLinkSyntax: KMarkdownSyntax = {
  name: 'link',
  matcher(text, option) {
    if (!option.autoParseLink) {
      return [];
    }
    const matcher =
      /(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/g;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'link',
          content: [value[0]],
          option: {
            href: value[0],
          },
        },
      };
    });
  },
};
export { KMarkdownLinkSyntax, KMarkdownAutoLinkSyntax };
