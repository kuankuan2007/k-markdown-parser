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
export class KMarkdownQuoteBlockNode extends KMarkdownNode<Record<string, never>> {}
export class KMarkdownBoldNode extends KMarkdownNode<Record<string, never>> {}
export class KMarkdownParagraphNode extends KMarkdownNode<Record<string, never>> {}
export class KMarkdownUnorderedListNode extends KMarkdownNode<Record<string, never>> {}
export class KMarkdownUnorderedListItemNode extends KMarkdownNode<Record<string, never>> {}
export class KMarkdownOrderedListNode extends KMarkdownNode<Record<string, never>> {}
export class KMarkdownOrderedListItemNode extends KMarkdownNode<{
  indexInWriting: number;
}> {}
