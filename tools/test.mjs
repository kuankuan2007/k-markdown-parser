// @ts-check
import esbuild from 'esbuild';
import path from 'path';
import { build } from './build.mjs';

const rootPath = path.resolve(process.cwd());

(async () => {
  const tsconfig = path.resolve(rootPath, './tsconfig.json');
  await build();
  await esbuild.build({
    entryPoints: [path.resolve(rootPath, './test/src/index.ts')],
    tsconfig: tsconfig,
    outdir: path.resolve(rootPath, './test/dist'),
    bundle: false,
    platform: 'node',
    target: 'node21',
    format: 'esm',
    sourcemap: true,
    outExtension: { '.js': '.mjs' },
  });
  await import('../test/dist/index.mjs');
})();
