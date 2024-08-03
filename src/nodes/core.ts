import { FullOption, KMarkdownNode } from '@/types.js';

export class KMarkdownRootNode extends KMarkdownNode<{ createOption: FullOption }> {}
export class KMarkdownTitleNode extends KMarkdownNode<{
  id?: string;
  level: number;
}> {}
export class KMarkdownCodeBlockNode extends KMarkdownNode<{
  language?: string;
}> {
  _canParseSubContent = false;
}
export class KMarkdownCodeInlineNode extends KMarkdownNode<Record<string, never>> {
  _canParseSubContent = false;
}
export class KMarkdownQuoteBlockNode extends KMarkdownNode<Record<string, never>> {}
export class KMarkdownBoldNode extends KMarkdownNode<Record<string, never>> {}
export class KMarkdownParagraphNode extends KMarkdownNode<Record<string, never>> {}
export class KMarkdownUnorderedListNode extends KMarkdownNode<Record<string, never>> {}
export class KMarkdownUnorderedListItemNode extends KMarkdownNode<Record<string, never>> {}
export class KMarkdownOrderedListNode extends KMarkdownNode<Record<string, never>> {}
export class KMarkdownOrderedListItemNode extends KMarkdownNode<{
  indexInWriting: number;
}> {}
export class KMarkdownXMLNode extends KMarkdownNode<{
  name: string;
  attributes: Record<string, string>;
}> {}
export class KMarkdownImageNode extends KMarkdownNode<{
  src: string;
  alt: string;
  title?: string;
}> {}
export class KMarkdownLinkNode extends KMarkdownNode<{
  src: string;
  alt: string;
}> {}
export class KMarkdownItalicNode extends KMarkdownNode<Record<string, never>> {}
export class KMarkdownSuperscriptNode extends KMarkdownNode<Record<string, never>> {}
export class KMarkdownSubscriptNode extends KMarkdownNode<Record<string, never>> {}
export class KMarkdownDeleteLineNode extends KMarkdownNode<Record<string, never>> {}
export class KMarkdownLineBetweenNode extends KMarkdownNode<Record<string, never>> {
  _canParseSubContent = false;
}
