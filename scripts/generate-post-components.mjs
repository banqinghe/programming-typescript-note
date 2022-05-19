// @ts-check
import path, { join } from 'path';
import { readdirSync, readFileSync, writeFileSync, rmSync } from 'fs';
import { fileURLToPath } from 'url';
import { dashToCamel } from './utils/index.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// prettier-ignore
const postHTMLPath = join(__dirname, '..', 'src', 'pages', 'posts')
// prettier-ignore
const componentsPath = join(__dirname, '..', 'src', 'pages', 'post.tsx')

function generateComponent(fnName, html) {
  return `
export function ${fnName}() {
  const innerHTML = \`${html}\`;
  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: innerHTML }}
    />
  );
}`;
}

async function go() {
  const componentTextArr = [];

  for (const path of readdirSync(postHTMLPath, 'utf-8')) {
    const filePath = join(postHTMLPath, path);

    const html = readFileSync(filePath, 'utf-8');

    componentTextArr.push(
      generateComponent(dashToCamel(path.replace(/.html$/, '')), html)
    );

    console.log(`transform ${path} to component text`);
  }

  writeFileSync(componentsPath, componentTextArr.join('\n'));
  rmSync(postHTMLPath, { recursive: true, force: true });

  console.log('Done!');
}

go();
