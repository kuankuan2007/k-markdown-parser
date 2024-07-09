import { createFullOptions } from './options.js';
import { markdown2Inner } from './textConverter.js';
import {
  FullOption,
  KMarkdownNode,
  KMarkdownNodeContent,
  KMarkdownNodeCreateOptions,
  Option,
} from './types.js';

class KMarkdownParser {
  private options: FullOption;
  constructor(options?: Option) {
    this.options = createFullOptions(options || {});
  }
  parse(text: string) {
    text = markdown2Inner(text, this.options);
    const root = this.createNode({
      name: 'root',
      content: [text],
      option: {
        createOption: this.options,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dfsParse = (node: KMarkdownNode<Record<string, any>>) => {
      for (const syntax of this.options.syntaxes) {
        const newContent: KMarkdownNodeContent = [];
        for (const i of node.content) {
          if (typeof i !== 'string') {
            newContent.push(i);
            continue;
          }
          const result = syntax.matcher(i, this.options, node);
          result.sort((a, b) => a.startIndex - b.startIndex);
          let lastIndex = 0;
          for (const match of result) {
            if (match.startIndex < lastIndex) {
              throw new Error('Syntax parse error, there is overlap in the nodes being matched');
            }
            newContent.push(i.substring(lastIndex, match.startIndex));
            if (match.node) {
              newContent.push(this.createNode(match.node));
            } else {
              newContent.push(i.substring(match.startIndex, match.startIndex + match.length));
            }
            lastIndex = match.startIndex + match.length;
          }
          newContent.push(i.substring(lastIndex));
        }
        node.content = newContent.filter((i) => {
          if (typeof i === 'string') {
            return /\S/.test(i);
          } else {
            return true;
          }
        });
      }
      const newContent: KMarkdownNodeContent = [];
      node.content.forEach((content) => {
        if (typeof content === 'string') {
          newContent.push(content);
        } else {
          if (content._canParseSubContent) {
            dfsParse(content);
          }
          newContent.push(content);
        }
      });
      node.content = newContent;
    };
    dfsParse(root);
    return root;
  }
  private createNode(option: KMarkdownNodeCreateOptions) {
    const nodeContent: KMarkdownNodeContent = [];
    for (const i of option.content) {
      if (typeof i === 'string') {
        nodeContent.push(i);
      } else {
        nodeContent.push(this.createNode(i));
      }
    }
    return new this.options.nodeMap[option.name](nodeContent, option.option || {});
  }
}
export default KMarkdownParser;
