import { createFullOptions } from './options.js';
import { inner2Markdown, markdown2Inner, inner2Plant } from './textConverter.js';
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
    text = this.markdown2Inner(text);
    const root = this.createNode({
      name: 'root',
      content: [text],
      option: {
        createOption: this.options,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dfsParse = (node: KMarkdownNode<Record<string, any>>, startSyntaxLevel: number = 0) => {
      const isParsedTag = Symbol('isParsedTag');
      for (
        let syntaxLevel = startSyntaxLevel;
        syntaxLevel < this.options.syntaxes.length;
        syntaxLevel++
      ) {
        for (const syntax of this.options.syntaxes[syntaxLevel]) {
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
          node.content = newContent
            .filter((i) => {
              if (typeof i === 'string') {
                return /\S/.test(i);
              } else {
                if (i._canParseSubContent && !i[isParsedTag]) {
                  i[isParsedTag] = true;
                  dfsParse(i, syntaxLevel);
                }
                return true;
              }
            })
            .map((i) => {
              if (typeof i === 'string') {
                return i.replace(/^\n*/g, '');
              } else {
                return i;
              }
            });
        }
      }
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
  markdown2Inner(text: string) {
    return markdown2Inner(text, this.options);
  }
  inner2Markdown(text: string) {
    return inner2Markdown(text, this.options);
  }
  inner2Plant(text: string) {
    return inner2Plant(text, this.options);
  }
}
export default KMarkdownParser;

export * from './types.js';
