# k-markdown-parser

此模块是[宽宽](https://www.kuankuan.site/ '宽宽的小天地')独立开发、维护的 Markdown 解析器。用于在各个平台上运行，无需依赖任何运行时环境。

## 特点

- 无依赖
- 可扩展、可定制
- 大量依赖正则表达式

## 使用

```js
import KMarkdownParser from '@kuankuan/k-markdown-parser';

const parser = new KMarkdownParser({
    ...//options
});
const article = parser.parse('# Hello World');
```

`article` 是解析器返回的 `KMarkdownNode` 对象，即根节点，具体的说，它是`KMarkdownRootNode`对象。

对于每个`KMarkdownNode`，他有以下属性：

- `content`: 节点的内容，它是一个`(string|KMarkdownNode<Record<string, any>>)[]`数组
- `args`: 节点的参数，这个属性的类型取决于节点的类型
- `_canParseSubContent`: 用于标记当前节点是否可以解析子节点

对于`KMarkdownParser`，它有两个其他方法：

- `toPlant` : 将 `KMarkdownNode` 中，被解析器替换、转义后的文本转换为普通文本
- `toMarkdown` : 将 `KMarkdownNode` 中，被解析器替换、转义后的文本转换为 Markdown 格式

## 配置&定制

```ts
type Option = Readonly<{
  syntaxes?: KMarkdownSyntax[][];
  replacerTagStart?: string;
  replacerTagMap?: {
    '\\': string;
    [key: string]: string;
  };
  nodeMap?: {
    [key: string]:KMarkdownNode<Record<string, any>>;
}>;
```

- `syntaxes`: 语法定义

这是一个`KMarkdownSyntax`的**二维数组**，用于定义 Markdown 解析器支持的语法。

你可以在`@kuankuan/k-markdown-parser/options.js`导出的`defaultSyntaxes`中看到默认设置。

之所以将其设定为**二维数组**，是为了便于语法的各种嵌套。也就是说，我们给语法设定了等级。从某个等级的语法产生的节点如果需要被递归解析，它将仅适用比产生该节点的语法等级相等或者更低的语法。举个例子：

```js
syntaxes= [
    [代码块匹配语法，xml块匹配语法],
    [有序列表语法，无序列表语法],
    [加粗语法，删除线语法],
]
```

在这个设置中，一个`无序列表语法`产生的节点的内容将会按照`有序列表`=>`无序列表`=>`加粗`=>`删除线`的顺序解析。

- `replacerTagStart` & `replacerTagMap`: 这将决定转义字符的处理方式，

KMarkdownParser 将会把 Markdown 中的特殊字符或转义字符以`replacerTagStart`+`replacerTagMap[字符]`中的格式替换，以便于解析。比如：

```js
replacerTagStart = '¨';
replacerTagMap = {
  '\\': 'AA',
  '(': 'BB',
  ')': 'CC',
};
```

在这个配置中`\`字符将被`¨AA`替换，`(`将被`¨BB`替换，`)`将被`¨CC`替换。

- `nodeMap`: 这是一个映射关系，用于将不同的 Markdown 节点类型映射到自定义的节点类型。你可以通过修改这个映射来实现自定义的 Markdown 节点类型。你可以在`@kuankuan/k-markdown-parser/options.js`导出的`defaultNodeMap`中看到默认设置。

## 开源

本项目使用[MulanPSL-2.0](./LICENSE)开源协议。
