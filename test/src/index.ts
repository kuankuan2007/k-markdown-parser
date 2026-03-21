setInterval(() => {}, 1000);
import fs from 'node:fs';
import { KMarkdownParser } from '../../src/index.js';
const testCode = fs.readFileSync('./test/test.md', 'utf-8');
const a = new KMarkdownParser({ autoParseLink: false });
console.log(a.parse(testCode));
