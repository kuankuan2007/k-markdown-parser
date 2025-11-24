import { KMarkdownSyntax } from '@/types.js';

const KMarkdownAutoEmailSyntax: KMarkdownSyntax = {
  name: 'auto-email',
  matcher(text: string) {
    const matcher =
      /(?:mailto:)?((([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))/g;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'email',
          content: [value[1]],
          option: {
            email: value[1],
          },
        },
      };
    });
  },
};
const KMarkdownRawEmailSyntax: KMarkdownSyntax = {
  name: 'raw-email',
  matcher(text: string) {
    const matcher =
      /<(?:mailto:)?((([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))>/g;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
        node: {
          name: 'email',
          content: [value[1]],
          option: {
            email: value[1],
          },
        },
      };
    });
  },
};

export { KMarkdownRawEmailSyntax, KMarkdownAutoEmailSyntax };
