import { KMarkdownNodeCreateOptions, KMarkdownSyntax } from '../types.js';

const KMarkdownXMLBlockSyntax: KMarkdownSyntax = {
  name: 'xml-block',
  matcher(text) {
    const matcher =
      /<(\/?)([a-zA-Z0-9-]+)\s*((?:[a-zA-Z0-9-]+(?:\s*=\s*(?:(?:"[^"\n]*")|[^\s\n"]+)?\s*)?)*)(\/)?>/gms;
    const tagMatches = [...text.matchAll(matcher)];

    if (tagMatches.length) {
      type TagTreeNode = {
        subTags: TagTreeNode[];
        parentNode: TagTreeNode | null;
        pair?: RegExpMatchArray | null;
        name: string | null;
        attributes: Record<string, string | boolean>;
        match: RegExpMatchArray;
      };
      const treeRoot: TagTreeNode = {
        subTags: [],
        parentNode: null,
        name: null,
        attributes: {},
        match: null as unknown as RegExpMatchArray,
      };
      let nowNode = treeRoot;
      tagMatches.sort((a, b) => a.index - b.index);
      function dfsSearchPair(name: string, node: TagTreeNode): TagTreeNode | null {
        if (node.pair === void 0 && node.name === name) {
          return node;
        }
        if (node.parentNode) {
          return dfsSearchPair(name, node.parentNode);
        }
        return null;
      }
      function parseAttrs(text: string) {
        const returnValue: Record<string, string | boolean> = Object.create(null);
        for (const i of text.matchAll(
          /([a-zA-Z0-9-]+)(?:\s*=\s*((?:(?:"[^"\n]*")|[^\s\n"]+))?\s*)?/gms
        )) {
          if (i[2]) {
            returnValue[i[1]] = i[2].replace(/^"|"$/g, '');
          } else {
            returnValue[i[1]] = true;
          }
        }
        return returnValue;
      }
      tagSearch: for (const tagMatch of tagMatches) {
        const info = {
          name: tagMatch[2],
          isCloseTag: !!tagMatch[1],
          attributes: parseAttrs(tagMatch[3]),
          isSelfClosing: !!tagMatch[4],
        };
        if (info.isCloseTag) {
          const result = dfsSearchPair(info.name, nowNode);
          if (result) {
            result.pair = tagMatch;
            nowNode = result.parentNode as TagTreeNode;
            continue tagSearch;
          } else {
            info.isSelfClosing = true;
          }
        }
        if (info.isSelfClosing) {
          nowNode.subTags.push({
            subTags: [],
            parentNode: nowNode,
            name: info.name,
            attributes: info.attributes,
            pair: null,
            match: tagMatch,
          });
          continue tagSearch;
        }
        nowNode = {
          subTags: [],
          parentNode: nowNode,
          name: info.name,
          attributes: info.attributes,
          pair: void 0,
          match: tagMatch,
        };
        nowNode.parentNode?.subTags.push(nowNode);
      }
      function buildNodeTree(node: TagTreeNode) {
        function _buildNodeTree(node: TagTreeNode): KMarkdownNodeCreateOptions {
          if (!node.pair) {
            return {
              name: 'xml',
              content: [],
              option: {
                name: node.name,
                attributes: node.attributes,
              },
            };
          }
          const content: KMarkdownNodeCreateOptions['content'] = [];
          let nowIndex = (node.match.index || 0) + node.match[0].length;

          for (const i of node.subTags) {
            content.push(
              text.substring(nowIndex, i.match.index || nowIndex).replace(/^[\s\n]*|[\s\n]*$/gs, '')
            );
            content.push(_buildNodeTree(i));
            nowIndex = i.pair
              ? (i.pair.index || 0) + i.pair[0].length
              : (i.match.index || 0) + i.match[0].length;
          }
          content.push(
            text.substring(nowIndex, node.pair.index || nowIndex).replace(/^[\s\n]*|[\s\n]*$/gs, '')
          );
          return {
            name: 'xml',
            content,
            option: {
              name: node.name,
              attributes: node.attributes,
            },
          };
        }
        return {
          startIndex: node.match.index || 0,
          length: node.pair
            ? (node.pair.index || 0) + node.pair[0].length - (node.match.index || 0)
            : node.match[0].length,
          node: _buildNodeTree(node),
        };
      }
      return treeRoot.subTags.map(buildNodeTree);
    } else {
      return [];
    }
  },
};
export default KMarkdownXMLBlockSyntax;
