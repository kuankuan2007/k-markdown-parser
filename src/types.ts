export interface KMarkdownSyntax {
  name: string;
  matcher: (
    text: string,
    option: FullOption,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parentNode: KMarkdownNode<Record<string, any>>
  ) => {
    startIndex: number;
    length: number;
    node?: KMarkdownNodeCreateOptions;
  }[];
}
export interface KMarkdownNodeCreateOptions {
  content: (string | KMarkdownNodeCreateOptions)[];
  name: string;
  option?: Record<string, unknown>;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class KMarkdownNode<T extends Record<string, any>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: symbol]: any;
  content: KMarkdownNodeContent;
  args: T;
  _canParseSubContent: boolean = true;
  constructor(content: KMarkdownNodeContent, args: T) {
    this.content = content;
    this.args = args;
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KMarkdownNodeContent = (string | KMarkdownNode<Record<string, any>>)[];

export type Option = Readonly<{
  syntaxes?: Readonly<Readonly<KMarkdownSyntax[]>[]>;
  replacerTagStart?: string;
  replacerTagMap?: Readonly<{
    [key: symbol]: string;
    '\\': string;
    [key: string]: string;
  }>;
  nodeMap?: Readonly<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: typeof KMarkdownNode<Record<string, any>>;
  }>;
  autoParseLink?: boolean;
}>;
export type FullOption = Required<Option>;
