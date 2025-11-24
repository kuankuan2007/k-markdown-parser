import { KMarkdownCodeBlockSyntax, KMarkdownCodeInlineSyntax } from './syntaxes/code.js';
import KMarkdownSegmentationSyntax from './syntaxes/segmentation.js';
import KMarkdownQuoteSyntax from './syntaxes/quote.js';
import { KMarkdownWellTitleSyntax, KMarkdownGaplineTitleSyntax } from './syntaxes/title.js';
import { FullOption, Option } from './types.js';
import { KMarkdownUnorderedListSyntax, KMarkdownOrderedListSyntax } from './syntaxes/list.js';
import KMarkdownXMLBlockSyntax from './syntaxes/xml.js';
import KMarkdownImageSyntax from './syntaxes/image.js';
import { KMarkdownLinkSyntax, KMarkdownAutoLinkSyntax, KMarkdownRawLinkSyntax } from './syntaxes/link.js';
import type { KMarkdownNode } from './types.js';
import * as coreNodes from './nodes/core.js';

import {
  KMarkdownDeleteLineSyntax,
  KMarkdownSubscriptSyntax,
  KMarkdownSuperscriptSyntax,
} from './syntaxes/fontStyle.js';
import KMarkdownLineBetweenSyntax from './syntaxes/lineBetween.js';
import { KMarkdownLatexBlockSyntax, KMarkdownLatexInlineSyntax } from './syntaxes/latex.js';
import KMarkdownEmojiSyntax from './syntaxes/emoji.js';
import KMarkdownParagraphSyntax from './syntaxes/paragraph.js';
import KMarkdownTaskListSyntax from './syntaxes/task-list.js';
import { KMarkdownTableSyntax } from './syntaxes/table.js';
import { KMarkdownBoldItalicSyntax } from './syntaxes/boldItalic.js';
import { KMarkdownAutoEmailSyntax, KMarkdownRawEmailSyntax } from './syntaxes/email.js';

export const tagStarterSelfReplaceName = Symbol('tagStarterSelfReplaceName');
export type TagStarterSelfReplaceName = typeof tagStarterSelfReplaceName;
export const defaultSyntaxes = [
  [KMarkdownCodeBlockSyntax, KMarkdownLatexBlockSyntax, KMarkdownXMLBlockSyntax],
  [
    KMarkdownWellTitleSyntax,
    KMarkdownGaplineTitleSyntax,
    KMarkdownLineBetweenSyntax,
    KMarkdownSegmentationSyntax,
  ],
  [
    KMarkdownQuoteSyntax,
    KMarkdownTableSyntax,
    KMarkdownTaskListSyntax,
    KMarkdownUnorderedListSyntax,
    KMarkdownOrderedListSyntax,
    KMarkdownParagraphSyntax,
  ],
  [
    KMarkdownCodeInlineSyntax,
    KMarkdownLatexInlineSyntax,
    KMarkdownBoldItalicSyntax,
    KMarkdownDeleteLineSyntax,
    KMarkdownSubscriptSyntax,
    KMarkdownSuperscriptSyntax,
    KMarkdownImageSyntax,
    KMarkdownLinkSyntax,
    KMarkdownRawEmailSyntax,
    KMarkdownRawLinkSyntax,
    KMarkdownAutoEmailSyntax,
    KMarkdownAutoLinkSyntax,
    KMarkdownEmojiSyntax,
  ],
] as const;
export const defaultReplacerTagMap = {
  [tagStarterSelfReplaceName]: 'SE',
  '*': 'AS',
  '#': 'WE',
  _: 'UN',
  '~': 'TI',
  '+': 'AD',
  '-': 'DI',
  '|': 'TA',
  '>': 'AR',
  '<': 'AL',
  '\\': 'SL',
  '`': 'FL',
  '!': 'IM',
  '[': 'LB',
  ']': 'RB',
  '(': 'LP',
  ')': 'RP',
  '{': 'LC',
  '}': 'RC',
  $: 'DL',
  '?': 'QU',
  '@': 'AT',
  '^': 'HO',
  '&': 'AN',
  '=': 'EQ',
  ';': 'SC',
  ':': 'CO',
  '.': 'DO',
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const defaultNodeMap: Record<string, typeof KMarkdownNode<Record<string, any>>> = {
  root: coreNodes.KMarkdownRootNode,
  title: coreNodes.KMarkdownTitleNode,
  'code-block': coreNodes.KMarkdownCodeBlockNode,
  'quote-block': coreNodes.KMarkdownQuoteBlockNode,
  paragraph: coreNodes.KMarkdownParagraphNode,
  'unordered-list': coreNodes.KMarkdownUnorderedListNode,
  'unordered-list-item': coreNodes.KMarkdownUnorderedListItemNode,
  'ordered-list': coreNodes.KMarkdownOrderedListNode,
  'ordered-list-item': coreNodes.KMarkdownOrderedListItemNode,
  xml: coreNodes.KMarkdownXMLNode,
  image: coreNodes.KMarkdownImageNode,
  link: coreNodes.KMarkdownLinkNode,
  email: coreNodes.KMarkdownEmailNode,
  bold: coreNodes.KMarkdownBoldNode,
  italic: coreNodes.KMarkdownItalicNode,
  subscript: coreNodes.KMarkdownSubscriptNode,
  superscript: coreNodes.KMarkdownSuperscriptNode,
  'delete-line': coreNodes.KMarkdownDeleteLineNode,
  'code-inline': coreNodes.KMarkdownCodeInlineNode,
  'line-between': coreNodes.KMarkdownLineBetweenNode,
  'latex-block': coreNodes.KMarkdownLatexBlockNode,
  'latex-inline': coreNodes.KMarkdownLatexInlineNode,
  emoji: coreNodes.KMarkdownEmojiNode,
  'task-list': coreNodes.KMarkdownTaskListNode,
  'task-list-item': coreNodes.KMarkdownTaskListItemNode,
  table: coreNodes.KMarkdownTableNode,
  'table-row': coreNodes.KMarkdownTableRowNode,
  'table-cell': coreNodes.KMarkdownTableCellNode,
};

export const defaultOptions: FullOption = {
  syntaxes: defaultSyntaxes,
  replacerTagStart: '¨',
  replacerTagMap: defaultReplacerTagMap,
  nodeMap: defaultNodeMap,
  autoParseLink: true,
} as const;
export function createFullOptions(options: Option): FullOption {
  return {
    ...defaultOptions,
    ...options,
  };
}
