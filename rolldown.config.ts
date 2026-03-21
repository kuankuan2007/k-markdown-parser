import { defineConfig } from 'rolldown';
import path from 'path';
import fs from 'fs';

const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), './package.json'), 'utf-8')
);
const banner = `/*!
 * @name k-markdown-parser
 * @package @kuankuan/k-markdown-parser
 * @license MulanPSL-2.0
 * @copyright (c) ${new Date().getFullYear()} kuankuan2007
 * @author KUANKUAN <2163826131@qq.com>
 * @source https://github.com/kuankuan/k-markdown-parser
 * @build ${new Date().toISOString()}
 * @version ${packageJson.version}
 */`;

async function dfsFiles(now: string): Promise<string[]> {
  if (!fs.existsSync(now)) {
    throw new Error(`${now} not exists`);
  }
  if ((await fs.promises.stat(now)).isDirectory()) {
    return fs.promises
      .readdir(now)
      .then((files) => Promise.all(files.map((file) => dfsFiles(path.resolve(now, file)))))
      .then((files) => files.flat());
  } else {
    return [now];
  }
}
async function buildInputOptions() {
  const files = await dfsFiles('src');
  const result: Record<string, string> = {};
  for (const file of files) {
    const relativePath = path.relative(path.resolve(process.cwd(), 'src'), file);
    const outputPath = `${relativePath.replace(/\.ts$/, '').replace(/\\/g, '/')}`;
    result[outputPath] = file;
  }
  return result;
}
export default defineConfig([
  {
    input: await buildInputOptions(),
    output: {
      dir: 'dist',
      sourcemap: true,
      cleanDir: true,
      format: 'esm',
      banner: (info) => {
        const fileName = info.fileName;
        if (fileName === 'index.js') {
          return banner;
        }
        return `/*!
 * @package @kuankuan/k-markdown-parser
 * @copyright (c) ${new Date().getFullYear()} kuankuan2007
 * @file ${fileName}
 */`;
      },
    },
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.iife.min.js',
      format: 'iife',
      name: 'KMarkdownParser',
      minify: true,
      sourcemap: true,
      banner,
    },
  },
]);
