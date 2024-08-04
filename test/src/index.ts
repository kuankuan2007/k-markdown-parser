setInterval(() => {}, 1000);
import fs from 'fs';
import KMarkdownParser from '../../dist/index.js';
const testCode = fs.readFileSync('./test/test.md', 'utf-8');
const a = new KMarkdownParser({ autoParseLink: false });
console.log(a.parse(testCode));
