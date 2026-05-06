setInterval(() => {}, 1000);
import fs from 'node:fs';
import { KMarkdownParser } from '../../src/index.js';
const testCode = fs.readFileSync('./test/test.md', 'utf-8');
console.time('parse');
const a = new KMarkdownParser({ autoParseLink: false });
console.timeEnd('parse');
console.log(a.parse(testCode));
