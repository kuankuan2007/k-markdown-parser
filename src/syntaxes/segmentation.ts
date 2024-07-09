import { KMarkdownSyntax } from '@/types.js';

const KMarkdownSegmentationSyntax: KMarkdownSyntax = {
  name: 'segmentation',
  matcher(text) {
    const matcher = /[^\n](?:.(?!\n\n))+[^\n]/gms;
    return [...text.matchAll(matcher)].map((value) => {
      return {
        startIndex: value.index,
        length: value[0].length,
      };
    });
  },
};
export default KMarkdownSegmentationSyntax;
