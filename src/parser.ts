import { buildSyntaxesGroup, createFullOptions } from './options.js';
import { isParsedTag, nodeCanParseSubContent, syntaxCanParseSubContent } from './symbols.js';
import { inner2Markdown, markdown2Inner, inner2Plant } from './textConverter.js';
import {
  BuiltSyntaxesGroup,
  FullOption,
  KMarkdownNode,
  KMarkdownNodeContent,
  KMarkdownNodeCreateOptions,
  KMarkdownSyntax,
  KMarkdownSyntaxMatchResult,
  Option,
} from './types.js';

export class KMarkdownParser {
  private readonly options: Readonly<FullOption>;
  private readonly builtSyntaxGroups: readonly BuiltSyntaxesGroup[] = [];
  constructor(options?: Option) {
    this.options = createFullOptions(options || {});
    this.builtSyntaxGroups = buildSyntaxesGroup(this.options.syntaxes);
  }
  parse(text: string) {
    text = this.markdown2Inner(text);
    const root = this.createNode(
      {
        name: 'root',
        content: [text],
        option: {
          createOption: this.options,
        },
      },
      null
    );
    const dfsParse = (node: KMarkdownNode, syntaxGroups: readonly BuiltSyntaxesGroup[]) => {
      for (const syntaxGroup of syntaxGroups) {
        const newContent: KMarkdownNodeContent = [];
        for (const now of node.content) {
          if (typeof now !== 'string') {
            newContent.push(now);
            continue;
          }
          type ResultRecord = { result: KMarkdownSyntaxMatchResult; syntax: KMarkdownSyntax };
          const results: ResultRecord[][] = [];
          for (const syntax of syntaxGroup.syntaxes) {
            results.push(
              syntax.matcher(now, this.options, node).map((result) => ({
                result,
                syntax,
                str: now.substring(result.startIndex, result.startIndex + result.length),
              }))
            );
          }

          const sortedResults = results
            .flat()
            .sort((a, b) => a.result.startIndex - b.result.startIndex);
          let nowStart: undefined | number = undefined,
            nowEnd = 0,
            selectedResult: undefined | ResultRecord = void 0;
          const selectedResults: ResultRecord[] = [];
          for (const nowResult of sortedResults) {
            if (nowStart === undefined) {
              nowStart = nowResult.result.startIndex;
              nowEnd = nowResult.result.startIndex + nowResult.result.length;
              selectedResult = nowResult;
              continue;
            }
            if (nowResult.result.startIndex > nowEnd) {
              if (selectedResult) {
                selectedResults.push(selectedResult);
              }
              nowStart = nowResult.result.startIndex;
              nowEnd = nowResult.result.startIndex + nowResult.result.length;
              selectedResult = nowResult;
              continue;
            }
            if (nowResult.result.startIndex + nowResult.result.length > nowEnd) {
              if (nowResult.result.startIndex === nowStart) {
                nowEnd = nowResult.result.startIndex + nowResult.result.length;
                selectedResult = nowResult;
              }
            }
          }
          if (selectedResult) {
            selectedResults.push(selectedResult);
          }
          console.log(selectedResults);
          let lastIndex = 0;
          for (const record of selectedResults) {
            newContent.push(now.substring(lastIndex, record.result.startIndex));
            if (record.result.node) {
              newContent.push(this.createNode(record.result.node, record.syntax.name));
            } else {
              newContent.push(
                now.substring(
                  record.result.startIndex,
                  record.result.startIndex + record.result.length
                )
              );
            }
            lastIndex = record.result.startIndex + record.result.length;
          }
          newContent.push(now.substring(lastIndex));
        }
        node.content = newContent
          .filter((i) => {
            if (typeof i === 'string') {
              return /\S/.test(i);
            } else {
              if (
                (i[syntaxCanParseSubContent] === void 0
                  ? i[nodeCanParseSubContent]
                  : i[syntaxCanParseSubContent]) &&
                !i[isParsedTag]
              ) {
                i[isParsedTag] = true;
                dfsParse(i, syntaxGroup.nextGroups);
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
    };
    dfsParse(root, this.builtSyntaxGroups);
    return root;
  }
  private createNode(option: KMarkdownNodeCreateOptions, createBy: string | null) {
    const nodeContent: KMarkdownNodeContent = [];
    for (const i of option.content) {
      if (typeof i === 'string') {
        nodeContent.push(i);
      } else {
        nodeContent.push(this.createNode(i, createBy));
      }
    }
    return new this.options.nodeMap[option.name](
      nodeContent,
      option.option || {},
      createBy,
      option.canParseSubContent
    );
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
