# k-markdown-parser

[![npm version](https://img.shields.io/npm/v/@kuankuan/k-markdown-parser)](https://www.npmjs.com/package/@kuankuan/k-markdown-parser)
[![license](https://img.shields.io/badge/license-MulanPSL--2.0-blue)](./LICENSE)
[![Github](https://img.shields.io/badge/GitHub-black?logo=github)](https://github.com/kuankuan2007/k-markdown-parser)

An independent, lightweight, and fast Markdown parser developed and maintained by [kuankuan](https://www.kuankuan.site/ "Kuankuan's Little Corner"). It converts Markdown text into a structured syntax tree (AST), runs on any JavaScript platform without relying on any runtime environment or external dependencies, and is heavily powered by regular expressions.

## Features

- **Zero dependencies** — pure JavaScript/TypeScript, works in any environment
- **Lightweight** — IIFE bundle is only ~28 KB
- **Fast** — performance comparable to Showdown
- **Fully extensible** — syntaxes, node types, and the entire parsing pipeline are all customizable
- **Regex-powered** — the core parsing logic is driven by regular expressions for flexibility and performance
- **Multiple module formats** — ships as ESM, CJS, and IIFE

## Installation

```bash
npm install @kuankuan/k-markdown-parser
```

Or use via CDN (IIFE, global variable `KMarkdownParser`):

```html
<script src="https://cdn.jsdelivr.net/npm/@kuankuan/k-markdown-parser/dist/index.iife.min.js"></script>
```

## Quick Start

```js
import KMarkdownParser from '@kuankuan/k-markdown-parser';

const parser = new KMarkdownParser(/* options */);
const root = parser.parse('# Hello World\n\nThis is **bold** text.');

console.log(root);         // KMarkdownRootNode
console.log(root.content); // array of child nodes / strings
```

`root` is a `KMarkdownRootNode` — the root of the syntax tree. Every node in the tree is an instance of `KMarkdownNode`.

## Syntax Tree

### `KMarkdownNode`

Every parsed node extends `KMarkdownNode<T>` and exposes the following properties:

| Property | Type | Description |
|---|---|---|
| `id` | `string` | Node type identifier (e.g. `"bold"`, `"title"`) |
| `content` | `(string \| KMarkdownNode)[]` | Child content of this node |
| `args` | `T` | Node-specific arguments (e.g. `{ level: 2 }` for a title) |
| `createBy` | `string \| null` | Name of the syntax group that produced this node |

### Built-in Node Types

| Node ID | Class | `args` |
|---|---|---|
| `root` | `KMarkdownRootNode` | `{ createOption: FullOption }` |
| `title` | `KMarkdownTitleNode` | `{ level: number, id?: string }` |
| `paragraph` | `KMarkdownParagraphNode` | — |
| `quote-block` | `KMarkdownQuoteBlockNode` | — |
| `code-block` | `KMarkdownCodeBlockNode` | `{ language?: string }` |
| `code-inline` | `KMarkdownCodeInlineNode` | — |
| `latex-block` | `KMarkdownLatexBlockNode` | — |
| `latex-inline` | `KMarkdownLatexInlineNode` | — |
| `line-between` | `KMarkdownLineBetweenNode` | — |
| `bold` | `KMarkdownBoldNode` | — |
| `italic` | `KMarkdownItalicNode` | — |
| `delete-line` | `KMarkdownDeleteLineNode` | — |
| `subscript` | `KMarkdownSubscriptNode` | — |
| `superscript` | `KMarkdownSuperscriptNode` | — |
| `image` | `KMarkdownImageNode` | `{ src: string, alt: string, title?: string }` |
| `link` | `KMarkdownLinkNode` | `{ href: string, alt: string }` |
| `email` | `KMarkdownEmailNode` | `{ email: string }` |
| `emoji` | `KMarkdownEmojiNode` | `{ name: string }` |
| `unordered-list` | `KMarkdownUnorderedListNode` | — |
| `unordered-list-item` | `KMarkdownUnorderedListItemNode` | — |
| `ordered-list` | `KMarkdownOrderedListNode` | — |
| `ordered-list-item` | `KMarkdownOrderedListItemNode` | `{ indexInWriting: number }` |
| `task-list` | `KMarkdownTaskListNode` | — |
| `task-list-item` | `KMarkdownTaskListItemNode` | `{ finished: boolean }` |
| `table` | `KMarkdownTableNode` | — |
| `table-row` | `KMarkdownTableRowNode` | `{ isHeader: boolean }` |
| `table-cell` | `KMarkdownTableCellNode` | `{ align?: 'left' \| 'center' \| 'right' }` |
| `xml` | `KMarkdownXMLNode` | `{ name: string, attributes: Record<string, string> }` |

## `KMarkdownParser` API

### `new KMarkdownParser(options?)`

Creates a new parser instance. See [Options](#options) for available configuration.

### `parser.parse(text: string): KMarkdownRootNode`

Parses a Markdown string and returns the root node of the syntax tree.

### `parser.markdown2Inner(text: string): string`

Converts raw Markdown text into the parser's internal escape representation. Useful for low-level customization.

### `parser.inner2Markdown(text: string): string`

Converts the parser's internal representation back to Markdown (with escape sequences restored). Use this to process text content stored inside nodes when you need the original Markdown form.

### `parser.inner2Plant(text: string): string`

Converts the parser's internal representation to plain text (escape characters are stripped). Use this to extract clean readable text from node content.

## Options

```ts
type Option = Readonly<{
  syntaxes?: SyntaxesGroup[];
  replacerTagStart?: string;
  replacerTagMap?: {
    [key: symbol]: string;
    '\\': string;
    [key: string]: string;
  };
  nodeMap?: {
    [key: string]: typeof KMarkdownNode;
  };
  autoParseLink?: boolean;
}>;
```

All options are optional. The defaults are exported from `@kuankuan/k-markdown-parser/options`:

```js
import {
  defaultOptions,
  defaultSyntaxes,
  defaultNodeMap,
  defaultReplacerTagMap,
} from '@kuankuan/k-markdown-parser/options';
```

---

### `syntaxes`

Defines the parsing pipeline as an array of **named syntax groups** (`SyntaxesGroup[]`).

```ts
type SyntaxesGroup = {
  name: string;
  syntaxes: KMarkdownSyntax[];
  next?: string | null | (string | null)[];
};
```

- `name` — unique identifier for this group
- `syntaxes` — list of syntax rules applied in this pass
- `next` — which group(s) a node produced by this group will be recursively parsed with:
  - `undefined` (default) — all groups from this one onward
  - `string` — start from the named group onward
  - `null` — no further sub-parsing
  - `(string | null)[]` — explicit list; a `null` entry expands to "all remaining groups after the last named one"

The default pipeline:

| Group | Syntaxes | Sub-parsing starts at |
|---|---|---|
| `block` | code-block, latex-block | (none) |
| `post-block` | `#` title, `---` title, line-between | `inline` |
| `pre-paragraph` | segmentation | (default) |
| `paragraph` | quote, table, task-list, unordered-list, ordered-list, paragraph | (default) |
| `post-paragraph` | paragraph | (default) |
| `inline` | code-inline, latex-inline, bold/italic, delete-line, subscript, superscript, image, link, email, emoji, xml | (default) |

---

### `replacerTagStart` & `replacerTagMap`

Before parsing, special characters and escape sequences are replaced with internal placeholder tokens to prevent interference between syntax rules.

- `replacerTagStart` — the prefix character for all placeholders (default: `'¨'`)
- `replacerTagMap` — maps each special character to a short unique tag string

For example, with the defaults, the Markdown escape `\\` becomes the internal token `¨SL`, and a literal `(` becomes `¨LP`.

---

### `nodeMap`

Maps node ID strings to their `KMarkdownNode` subclasses. Override entries here to substitute built-in nodes with custom implementations:

```js
import { defaultNodeMap } from '@kuankuan/k-markdown-parser/options';
import { KMarkdownNode } from '@kuankuan/k-markdown-parser';

class MyBoldNode extends KMarkdownNode {
  id = 'bold';
  toHTML() {
    return `<strong>...</strong>`;
  }
}

const parser = new KMarkdownParser({
  nodeMap: { ...defaultNodeMap, bold: MyBoldNode },
});
```

---

### `autoParseLink`

When `true` (default), bare URLs in text are automatically parsed as `link` nodes.

---

## Custom Syntax

Implement the `KMarkdownSyntax` interface to define your own syntax rules:

```ts
interface KMarkdownSyntax {
  name: string;
  matcher: (
    text: string,
    option: FullOption,
    parentNode: KMarkdownNode
  ) => KMarkdownSyntaxMatchResult[];
}

type KMarkdownSyntaxMatchResult = {
  startIndex: number;  // where the match starts
  length: number;      // total length of matched text
  node?: {             // omit to keep the matched text as-is
    name: string;
    content: (string | KMarkdownNodeCreateOptions)[];
    option?: Record<string, unknown>;
    canParseSubContent?: boolean;
  };
};
```

Example — adding a custom `==highlight==` syntax:

```js
import KMarkdownParser from '@kuankuan/k-markdown-parser';
import { defaultSyntaxes, defaultNodeMap } from '@kuankuan/k-markdown-parser/options';
import { KMarkdownNode } from '@kuankuan/k-markdown-parser';

class KMarkdownHighlightNode extends KMarkdownNode {
  id = 'highlight';
}

const highlightSyntax = {
  name: 'highlight',
  matcher(text) {
    return [...text.matchAll(/==(.+?)==/gs)].map((m) => ({
      startIndex: m.index,
      length: m[0].length,
      node: { name: 'highlight', content: [m[1]] },
    }));
  },
};

const parser = new KMarkdownParser({
  syntaxes: defaultSyntaxes.map((group) =>
    group.name === 'inline'
      ? { ...group, syntaxes: [...group.syntaxes, highlightSyntax] }
      : group
  ),
  nodeMap: { ...defaultNodeMap, highlight: KMarkdownHighlightNode },
});
```

## License

This project is licensed under the [MulanPSL-2.0](./LICENSE).
