import { KMarkdownCodeBlockSyntax } from './syntaxes/code.js';
import KMarkdownSegmentationSyntax from './syntaxes/segmentation.js';
import KMarkdownQuoteSyntax from './syntaxes/quote.js';
import KMarkdownTitleSyntax from './syntaxes/title.js';
import { FullOption, Option } from './types.js';
import KMarkdownParagraphSyntax from './syntaxes/paragraph.js';
import KMarkdownBoldSyntax from './syntaxes/bold.js';
import { KMarkdownUnorderedListSyntax, KMarkdownOrderedListSyntax } from './syntaxes/list.js';
import KMarkdownXMLBlockSyntax from './syntaxes/xml.js';

export const tagStarterSelfReplaceName = Symbol('tagStarterSelfReplaceName');
export type TagStarterSelfReplaceName = typeof tagStarterSelfReplaceName;
export const defaultSyntaxes = [
  KMarkdownCodeBlockSyntax,
  KMarkdownXMLBlockSyntax,
  KMarkdownTitleSyntax,
  KMarkdownSegmentationSyntax,
  KMarkdownUnorderedListSyntax,
  KMarkdownOrderedListSyntax,
  KMarkdownQuoteSyntax,
  KMarkdownParagraphSyntax,
  KMarkdownBoldSyntax,
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
const coreNodes = await import('./nodes/core.js');
const defaultNodeMap = {
  root: coreNodes.KMarkdownRootNode,
  title: coreNodes.KMarkdownTitleNode,
  'code-block': coreNodes.KMarkdownCodeBlockNode,
  'quote-block': coreNodes.KMarkdownQuoteBlockNode,
  bold: coreNodes.KMarkdownBoldNode,
  paragraph: coreNodes.KMarkdownParagraphNode,
  'unordered-list': coreNodes.KMarkdownUnorderedListNode,
  'unordered-list-item': coreNodes.KMarkdownUnorderedListItemNode,
  'ordered-list': coreNodes.KMarkdownOrderedListNode,
  'ordered-list-item': coreNodes.KMarkdownOrderedListItemNode,
  xml: coreNodes.KMarkdownXMLNode,
} as const;
export const defaultOptions: FullOption = {
  syntaxes: defaultSyntaxes,
  replacerTagStart: '¨',
  replacerTagMap: defaultReplacerTagMap,
  nodeMap: defaultNodeMap,
} as const;
export function createFullOptions(options: Option): FullOption {
  return {
    ...defaultOptions,
    ...options,
  };
}
