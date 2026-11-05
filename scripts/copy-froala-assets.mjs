// Runs after `npm run package` (postpackage). Puts in package/assets/froala only the Froala
// files FsFroalaLoaderService loads, so an app copies those instead of all of froala-editor
// (its bundles, sources, demos and images): about 0.8 MB instead of 6.4 MB.
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const froala = path.join(root, 'node_modules/froala-editor');
const dest = path.join(root, 'package/assets/froala');

// Every plugin an app can turn on: a FroalaPlugin value is the plugin's file name
const pluginEnum = fs.readFileSync(path.join(root, 'src/app/modules/html-editor/enums/default-plugin.enum.ts'), 'utf8');
const plugins = [...pluginEnum.matchAll(/=\s*'([a-z_]+)'/g)].map(([, plugin]) => plugin);

const files = [
  'License.txt',
  'css/froala_editor.pkgd.min.css',
  'js/froala_editor.min.js',
  ...plugins.map((plugin) => `js/plugins/${plugin}.min.js`),
];

// A file missing from froala-editor fails the package rather than ship an editor that 404s
const missing = files.filter((file) => !fs.existsSync(path.join(froala, file)));
if (!plugins.length || missing.length) {
  console.error(`Froala assets: missing ${missing.join(', ') || 'the FroalaPlugin values'}`);
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
files.forEach((file) => {
  fs.mkdirSync(path.dirname(path.join(dest, file)), { recursive: true });
  fs.copyFileSync(path.join(froala, file), path.join(dest, file));
});

console.log(`Froala assets: ${files.length} files in package/assets/froala`);
