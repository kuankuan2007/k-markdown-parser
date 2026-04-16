# k-markdown-parser

[![npm version](https://img.shields.io/npm/v/@kuankuan/k-markdown-parser)](https://www.npmjs.com/package/@kuankuan/k-markdown-parser)
[![license](https://img.shields.io/badge/license-MulanPSL--2.0-blue)](./LICENSE)
[![Github](https://img.shields.io/badge/GitHub-black?logo=github)](https://github.com/kuankuan2007/k-markdown-parser)

一个由 [宽宽](https://www.kuankuan.site/ "宽宽的小天地") 独立开发与维护的轻量、快速的 Markdown 解析器。它将 Markdown 文本转换为结构化的语法树（AST），无需任何运行时环境或外部依赖，可在任意 JavaScript 平台上运行，底层逻辑大量使用正则表达式驱动。

## 特性

- **零依赖** — 纯 JavaScript/TypeScript，可在任意环境中运行
- **极致轻量** — IIFE 打包版本仅约 28 KB
- **性能可观** — 速度与 Showdown 相近
- **高度可扩展** — 语法规则、节点类型、解析流水线均可自由定制
- **正则驱动** — 核心解析逻辑基于正则表达式，灵活且高效
- **多模块格式** — 同时提供 ESM、CJS 与 IIFE 格式

## 安装

```bash
npm install @kuankuan/k-markdown-parser
```

或通过 CDN 直接引入（IIFE 格式，全局变量为 `KMarkdownParser`）：

```html
<script src="https://cdn.jsdelivr.net/npm/@kuankuan/k-markdown-parser/dist/index.iife.min.js"></script>
```

## 快速上手

```js
import KMarkdownParser from '@kuankuan/k-markdown-parser';

const parser = new KMarkdownParser(/* 配置项 */);
const root = parser.parse('# Hello World\n\nThis is **bold** text.');

console.log(root);         // KMarkdownRootNode
console.log(root.content); // 子节点或字符串组成的数组
```

`root` 是一个 `KMarkdownRootNode`，即语法树的根节点。树中的每个节点都是 `KMarkdownNode` 的实例。

## 语法树

### `KMarkdownNode`

所有解析节点均继承自 `KMarkdownNode<T>`，包含以下属性：

| 属性 | 类型 | 说明 |
|---|---|---|
| `id` | `string` | 节点类型标识符（如 `"bold"`、`"title"`） |
| `content` | `(string \| KMarkdownNode)[]` | 节点的子内容 |
| `args` | `T` | 节点特有参数（如标题节点的 `{ level: 2 }`） |
| `createBy` | `string \| null` | 产生该节点的语法组名称 |

### 内置节点类型

| 节点 ID | 类名 | `args` |
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

创建一个新的解析器实例。配置项说明见 [配置项](#配置项) 章节。

### `parser.parse(text: string): KMarkdownRootNode`

解析 Markdown 字符串，返回语法树的根节点。

### `parser.markdown2Inner(text: string): string`

将原始 Markdown 文本转换为解析器内部的转义表示。通常用于底层定制开发。

### `parser.inner2Markdown(text: string): string`

将解析器内部表示还原为 Markdown 文本（带转义字符）。当需要从节点中取回原始 Markdown 内容时使用。

### `parser.inner2Plant(text: string): string`

将解析器内部表示转换为纯文本（去除转义字符）。当需要从节点内容中提取可读纯文本时使用。

## 配置项

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

所有配置项均为可选。默认值可从 `@kuankuan/k-markdown-parser/options` 导入：

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

以**命名语法组**数组（`SyntaxesGroup[]`）的形式定义解析流水线。

```ts
type SyntaxesGroup = {
  name: string;
  syntaxes: KMarkdownSyntax[];
  next?: string | null | (string | null)[];
};
```

- `name` — 该语法组的唯一标识符
- `syntaxes` — 该轮解析使用的语法规则列表
- `next` — 该语法组产生的节点在递归解析子内容时所使用的语法组：
  - `undefined`（默认）— 从当前组起的所有后续组
  - `string` — 从指定名称的组起往后
  - `null` — 不再递归解析子内容
  - `(string | null)[]` — 显式指定列表；`null` 表示"上一个指定组之后的所有剩余组"

默认解析流水线如下：

| 语法组 | 包含语法 | 子内容解析起始组 |
|---|---|---|
| `block` | 代码块、LaTeX 块 | （不解析） |
| `post-block` | `#` 标题、`---` 标题、分割线 | `inline` |
| `pre-paragraph` | 分段处理 | （默认） |
| `paragraph` | 引用块、表格、任务列表、无序列表、有序列表、段落 | （默认） |
| `post-paragraph` | 段落 | （默认） |
| `inline` | 行内代码、行内 LaTeX、粗体/斜体、删除线、上下标、图片、链接、邮箱、Emoji、XML | （默认） |

---

### `replacerTagStart` 与 `replacerTagMap`

在正式解析前，解析器会将特殊字符与转义序列替换为内部占位符，以防不同语法规则之间相互干扰。

- `replacerTagStart` — 所有占位符的前缀字符（默认：`'¨'`）
- `replacerTagMap` — 将每个特殊字符映射到一个简短的唯一标签字符串

例如，使用默认配置时，Markdown 转义 `\\` 会变为内部标记 `¨SL`，字符 `(` 会变为 `¨LP`。

---

### `nodeMap`

将节点 ID 字符串映射到对应的 `KMarkdownNode` 子类。通过覆盖其中的条目，可以将内置节点替换为自定义实现：

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

为 `true`（默认）时，文本中裸露的 URL 会自动解析为 `link` 节点。

---

## 自定义语法

实现 `KMarkdownSyntax` 接口即可定义自己的语法规则：

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
  startIndex: number;  // 匹配起始位置
  length: number;      // 匹配的总长度
  node?: {             // 省略则保留匹配文本原样
    name: string;
    content: (string | KMarkdownNodeCreateOptions)[];
    option?: Record<string, unknown>;
    canParseSubContent?: boolean;
  };
};
```

示例——添加自定义的 `==highlight==` 语法：

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

## 许可证

本项目采用 [木兰宽松许可证 第2版（MulanPSL-2.0）](./LICENSE) 授权。
