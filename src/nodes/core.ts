import { FullOption, KMarkdownNode } from '@/types.js';

export class KMarkdownRootNode extends KMarkdownNode<{ createOption: FullOption }> {
  id = 'root';
}
export class KMarkdownTitleNode extends KMarkdownNode<{
  id?: string;
  level: number;
}> {
  id = 'title';
}
export class KMarkdownCodeBlockNode extends KMarkdownNode<{
  language?: string;
}> {
  _canParseSubContent = false;
  id = 'code-block';
}
export class KMarkdownCodeInlineNode extends KMarkdownNode<Record<string, never>> {
  _canParseSubContent = false;
  id = 'code-inline';
}
export class KMarkdownQuoteBlockNode extends KMarkdownNode<Record<string, never>> {
  id = 'quote-block';
}
export class KMarkdownBoldNode extends KMarkdownNode<Record<string, never>> {
  id = 'bold';
}
export class KMarkdownParagraphNode extends KMarkdownNode<Record<string, never>> {
  id = 'paragraph';
}
export class KMarkdownUnorderedListNode extends KMarkdownNode<Record<string, never>> {
  id = 'unordered-list';
}
export class KMarkdownUnorderedListItemNode extends KMarkdownNode<Record<string, never>> {
  id = 'unordered-list-item';
}
export class KMarkdownOrderedListNode extends KMarkdownNode<Record<string, never>> {
  id = 'ordered-list';
}
export class KMarkdownOrderedListItemNode extends KMarkdownNode<{
  indexInWriting: number;
}> {
  id = 'ordered-list-item';
}
export class KMarkdownXMLNode extends KMarkdownNode<{
  name: string;
  attributes: Record<string, string>;
}> {
  id = 'xml';
}
export class KMarkdownImageNode extends KMarkdownNode<{
  src: string;
  alt: string;
  title?: string;
}> {
  id = 'image';
}
export class KMarkdownLinkNode extends KMarkdownNode<{
  href: string;
  alt: string;
}> {
  _canParseSubContent = false;
  id = 'link';
}
export class KMarkdownItalicNode extends KMarkdownNode<Record<string, never>> {
  id = 'italic';
}
export class KMarkdownSuperscriptNode extends KMarkdownNode<Record<string, never>> {
  id = 'superscript';
}
export class KMarkdownSubscriptNode extends KMarkdownNode<Record<string, never>> {
  id = 'subscript';
}
export class KMarkdownDeleteLineNode extends KMarkdownNode<Record<string, never>> {
  id = 'delete-line';
}
export class KMarkdownLineBetweenNode extends KMarkdownNode<Record<string, never>> {
  id = 'line-between';
  _canParseSubContent = false;
}
