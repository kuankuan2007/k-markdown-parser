import { KMarkdownCodeBlockSyntax, KMarkdownCodeInlineSyntax } from './syntaxes/code.js';
import KMarkdownSegmentationSyntax from './syntaxes/segmentation.js';
import KMarkdownQuoteSyntax from './syntaxes/quote.js';
import { KMarkdownWellTitleSyntax, KMarkdownGaplineTitleSyntax } from './syntaxes/title.js';
import { FullOption, Option } from './types.js';
import KMarkdownParagraphSyntax from './syntaxes/paragraph.js';
import { KMarkdownUnorderedListSyntax, KMarkdownOrderedListSyntax } from './syntaxes/list.js';
import KMarkdownXMLBlockSyntax from './syntaxes/xml.js';
import KMarkdownImageSyntax from './syntaxes/image.js';
import { KMarkdownLinkSyntax, KMarkdownAutoLinkSyntax } from './syntaxes/link.js';
import type { KMarkdownNode } from './types.js';
import * as coreNodes from './nodes/core.js';

import {
  KMarkdownBoldSyntax,
  KMarkdownDeleteLineSyntax,
  KMarkdownItalicSyntax,
  KMarkdownSubscriptSyntax,
  KMarkdownSuperscriptSyntax,
} from './syntaxes/fontStyle.js';
import KMarkdownLineBetweenSyntax from './syntaxes/lineBetween.js';

export const tagStarterSelfReplaceName = Symbol('tagStarterSelfReplaceName');
export type TagStarterSelfReplaceName = typeof tagStarterSelfReplaceName;
export const defaultSyntaxes = [
  [KMarkdownCodeBlockSyntax, KMarkdownXMLBlockSyntax],
  [KMarkdownWellTitleSyntax, KMarkdownGaplineTitleSyntax, KMarkdownSegmentationSyntax],
  [
    KMarkdownLineBetweenSyntax,
    KMarkdownUnorderedListSyntax,
    KMarkdownOrderedListSyntax,
    KMarkdownQuoteSyntax,
    KMarkdownParagraphSyntax,
  ],
  [
    KMarkdownBoldSyntax,
    KMarkdownDeleteLineSyntax,
    KMarkdownItalicSyntax,
    KMarkdownSubscriptSyntax,
    KMarkdownSuperscriptSyntax,
    KMarkdownCodeInlineSyntax,
    KMarkdownImageSyntax,
    KMarkdownLinkSyntax,
    KMarkdownAutoLinkSyntax,
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
  bold: coreNodes.KMarkdownBoldNode,
  italic: coreNodes.KMarkdownItalicNode,
  subscript: coreNodes.KMarkdownSubscriptNode,
  superscript: coreNodes.KMarkdownSuperscriptNode,
  'delete-line': coreNodes.KMarkdownDeleteLineNode,
  'code-inline': coreNodes.KMarkdownCodeInlineNode,
  'line-between': coreNodes.KMarkdownLineBetweenNode,
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
