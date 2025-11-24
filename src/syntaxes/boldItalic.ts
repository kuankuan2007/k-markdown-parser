import {
  KMarkdownSyntax,
  KMarkdownSyntaxMatchResult,
  KMarkdownSyntaxMatchResultContent,
} from '../types.js';

// const KMarkdownBoldSyntax: KMarkdownSyntax = {
//   name: 'bold',
//   matcher(text) {
//     return [...text.matchAll(matcher)].map((value) => {
//       return {
//         startIndex: value.index,
//         length: value[0].length,
//         node: {
//           name: 'bold',
//           content: [value[1] || value[2]],
//         },
//       };
//     });
//   },
// };
// const KMarkdownItalicSyntax: KMarkdownSyntax = {
//   name: 'italic',
//   matcher(text) {
//     const matcher = /\*(\**(?:(?!\*).)+\**)\*|_(_*(?:(?!_).)+_*)_/gms;
//     return [...text.matchAll(matcher)].map((value) => {
//       return {
//         startIndex: value.index,
//         length: value[0].length,
//         node: {
//           name: 'italic',
//           content: [value[1] || value[2]],
//         },
//       };
//     });
//   },
// };
// const KMarkdownBoldItalicSyntax: KMarkdownSyntax = {
//   name: 'bold-italic',
//   matcher(text) {
//     const italicMatcher = /\*(\**(?:(?!\*).)+\**)\*|_(_*(?:(?!_).)+_*)_/gms;
//     const boldMatcher = /\*\*(\**(?:(?!\*\*).)+\**)\*\*|__(_*(?:(?!__).)+_*)__/gms;

//     const boldResults = [...text.matchAll(boldMatcher)];
//     const italicResults = [...text.matchAll(italicMatcher)];
//     const result: KMarkdownSyntaxMatchResult[] = [];
//     while (boldResults.length && italicResults.length) {
//       if (boldResults[0].index < italicResults[0].index || (boldResults[0].index === italicResults[0].index && boldResults[0][0].length >= italicResults[0][0].length)) {
//         const value = boldResults.shift()!;
//         result.push({
//           startIndex: value.index,
//           length: value[0].length,
//           node: {
//             name: 'bold',
//             content: [value[1] || value[2]],
//           },
//         });
//         const end = value.index + value[0].length;
//         while (italicResults.length && italicResults[0].index <= end) {
//           italicResults.shift();
//         }
//       } else {
//         const value = italicResults.shift()!;
//         result.push({
//           startIndex: value.index,
//           length: value[0].length,
//           node: {
//             name: 'italic',
//             content: [value[1] || value[2]],
//           },
//         });
//         const end = value.index + value[0].length;
//         while (boldResults.length && boldResults[0].index <= end) {
//           boldResults.shift();
//         }
//       }
//     }
//     for (const value of boldResults) {
//       result.push({
//         startIndex: value.index,
//         length: value[0].length,
//         node: {
//           name: 'bold',
//           content: [value[1] || value[2]],
//         },
//       });
//     }
//     for (const value of italicResults) {
//       result.push({
//         startIndex: value.index,
//         length: value[0].length,
//         node: {
//           name: 'italic',
//           content: [value[1] || value[2]],
//         },
//       });
//     }
//     return result;
//   },
// };
type StackItemType = 'a' | 'aa' | 'u' | 'uu';
type NodeType = 'italic' | 'bold';
const typeMap: { [key in StackItemType]: NodeType } = {
  a: 'italic',
  aa: 'bold',
  u: 'italic',
  uu: 'bold',
};
const typeTagLengthMap: { [key in StackItemType]: 0 | 1 | 2 } = {
  a: 1,
  aa: 2,
  u: 1,
  uu: 2,
};
const typeCharMap: { [key in StackItemType]: string } = {
  a: '*',
  aa: '*',
  u: '_',
  uu: '_',
};
const rootRangeType = Symbol();
type StackItem = {
  start: number;
  end: number;
};
type Stack = {
  u: StackItem[];
  uu: StackItem[];
  a: StackItem[];
  aa: StackItem[];
};
type Item = {
  start: number;
  end: number;
  type: StackItemType;
};
type Pair = {
  start: Item;
  end: Item;
};
type RangeItem = {
  start: number;
  end: number;
  tagLength: 0 | 1 | 2;
  type: 'bold' | 'italic' | typeof rootRangeType;
  subRanges: RangeItem[];
};
function tryMatch(now: Item, stack: Stack, text: string): Pair | void {
  if (stack[now.type].length === 0) {
    return;
  }
  const last = stack[now.type][stack[now.type].length - 1];
  const inner = text.substring(last.start, now.start);
  if (inner.match(new RegExp(`^\\${typeCharMap[now.type]}*$`))) {
    return;
  }
  const result: Pair = {
    start: { ...last, type: now.type },
    end: now,
  };
  stack[now.type].pop();
  for (const key in stack) {
    stack[key as StackItemType] = stack[key as StackItemType].filter(
      (i) => i.end < result.start.start || i.start > result.end.end
    );
  }
  return result;
}
function buildRange(now: RangeItem, pairs: Pair[]) {
  if (pairs.length === 0) {
    return;
  }
  pairs = pairs.filter((i) => i.start.start >= now.start && i.end.end <= now.end);
  let last: {
    item: Pair;
    range: RangeItem;
    pairs: Pair[];
  } = null!;
  function enterNext(target: Pair) {
    last = {
      item: target,
      range: {
        start: target.start.start,
        end: target.end.end,
        type: typeMap[target.start.type],
        tagLength: typeTagLengthMap[target.end.type],
        subRanges: [],
      },
      pairs: [],
    };
    now.subRanges.push(last.range);
  }
  enterNext(pairs[0]);
  for (let i = 1; i < pairs.length; i++) {
    if (pairs[i].end.end <= last.item.end.end) {
      last.pairs.push(pairs[i]);
    } else {
      buildRange(last.range, last.pairs);
      enterNext(pairs[i]);
    }
  }
  buildRange(last.range, last.pairs);
}
function buildContentFromRange(text: string, now: RangeItem): KMarkdownSyntaxMatchResultContent {
  const result: KMarkdownSyntaxMatchResultContent = [];
  now.subRanges.sort((a, b) => a.start - b.start);
  let lastIndex = now.start + now.tagLength;
  for (const item of now.subRanges) {
    if (item.start - 1 > lastIndex) {
      result.push(text.substring(lastIndex, item.start));
    }
    result.push({
      name: item.type as string,
      content: buildContentFromRange(text, item),
    });
    lastIndex = item.end + 1;
  }
  if (lastIndex < now.end - now.tagLength + 1) {
    result.push(text.substring(lastIndex, now.end - now.tagLength + 1));
  }
  return result;
}

function buildSyntaxMatchResult(text: string, pairs: Pair[]): KMarkdownSyntaxMatchResult[] {
  pairs.sort((a, b) => a.start.start - b.start.start);

  const root: RangeItem = {
    start: 0,
    end: text.length - 1,
    type: rootRangeType,
    tagLength: 0,
    subRanges: [],
  };

  buildRange(root, pairs);

  const result = root.subRanges.map(
    (i) =>
      ({
        startIndex: i.start,
        length: i.end - i.start + 1,
        node: {
          name: i.type,
          content: buildContentFromRange(text, i),
        },
      } as KMarkdownSyntaxMatchResult)
  );

  return result;
}

const KMarkdownBoldItalicSyntax: KMarkdownSyntax = {
  name: 'bold-italic',
  matcher(text) {
    const pairs: Pair[] = [];

    const stack: Stack = {
      u: [],
      uu: [],
      a: [],
      aa: [],
    };
    let i = 0;
    while (i < text.length) {
      if (text[i] === '*') {
        if (i + 1 < text.length && text[i + 1] === '*') {
          const res = tryMatch({ start: i, end: i + 1, type: 'aa' }, stack, text);
          if (res) {
            pairs.push(res);
            i += 2;
            continue;
          }
        }
        const res = tryMatch({ start: i, end: i, type: 'a' }, stack, text);
        if (res) {
          pairs.push(res);
          i += 1;
          continue;
        }
        if (i + 1 < text.length && text[i + 1] === '*') {
          stack.aa.push({ start: i, end: i + 1 });
        }
        stack.a.push({ start: i, end: i });
        i += 1;
        continue;
      }
      if (text[i] === '_') {
        if (i + 1 < text.length && text[i + 1] === '_') {
          const res = tryMatch({ start: i, end: i + 1, type: 'uu' }, stack, text);
          if (res) {
            pairs.push(res);
            i += 2;
            continue;
          }
        }
        const res = tryMatch({ start: i, end: i, type: 'u' }, stack, text);
        if (res) {
          pairs.push(res);
          i += 1;
          continue;
        }
        if (i + 1 < text.length && text[i + 1] === '_') {
          stack.uu.push({ start: i, end: i + 1 });
        }
        stack.u.push({ start: i, end: i });
        i++;
        continue;
      } else {
        i++;
      }
    }
    if (pairs.length === 0) {
      return [];
    }
    return buildSyntaxMatchResult(text, pairs);
  },
};

export { KMarkdownBoldItalicSyntax };
