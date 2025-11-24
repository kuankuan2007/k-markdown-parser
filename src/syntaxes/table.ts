import {
  KMarkdownSyntax,
  KMarkdownSyntaxMatchResult,
} from '../types.js';

export const KMarkdownTableSyntax: KMarkdownSyntax = {
  name: 'table',
  matcher(text) {
    const matcher = /^\|(?:[^|]+\|)+\n\|(?:\s*:?-{3,}:?\s*\|)+\n(?:\|(?:[^|]+\|)+(?:\n|$))+/gms;
    return [...text.matchAll(matcher)]
      .map((value) => {
        const lines = value[0]
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line)
          .map((line) => line.split('|').map((cell) => cell.trim()));
        if (lines.length < 2) {
          return void 0;
        }
        for (const i of lines) {
          i.shift();
          i.pop();
        }
        const aligns = lines[1].map((cell) => {
          if (cell.startsWith(':') && cell.endsWith(':')) {
            return 'center';
          } else if (cell.startsWith(':')) {
            return 'left';
          } else if (cell.endsWith(':')) {
            return 'right';
          } else {
            return void 0;
          }
        });
        return {
          startIndex: value.index,
          length: value[0].length,
          node: {
            name: 'table',
            content: [
              {
                name: 'table-row',
                content: lines[0].map((cell, index) => ({
                  name: 'table-cell',
                  content: [cell],
                  option: {
                    align: aligns[index],
                  },
                })),
                option: {
                  isHeader: true,
                },
              },
              ...lines.slice(2).map((line) => ({
                name: 'table-row',
                content: line.map((cell, index) => ({
                  name: 'table-cell',
                  content: [cell],
                  option: {
                    align: aligns[index],
                  },
                })),
                option: {
                  isHeader: false,
                },
              })),
            ],
            option: {},
          },
        };
      })
      .filter((value) => value) as KMarkdownSyntaxMatchResult[];
  },
};
