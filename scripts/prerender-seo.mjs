import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = process.cwd()
const vite = await createServer({
  configFile: resolve(root, 'vite.config.js'),
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
})

try {
  const { default: App } = await vite.ssrLoadModule('/src/Portfolio.jsx')
  const rendered = renderToString(React.createElement(App))
  const htmlPath = resolve(root, 'dist/index.html')
  const html = await readFile(htmlPath, 'utf8')

  if (!html.includes('<div id="root"></div>')) {
    throw new Error('Le point de montage vide est introuvable dans dist/index.html.')
  }
  if (!/<h1\b/.test(rendered) || !rendered.includes('Développeur')) {
    throw new Error('Le rendu statique ne contient pas le titre principal du portfolio.')
  }

  await writeFile(
    htmlPath,
    html.replace('<div id="root"></div>', `<div id="root">${rendered}</div>`),
  )
  console.log(`Pré-rendu SEO terminé : ${rendered.length} caractères HTML, titre principal inclus.`)
} finally {
  await vite.close()
}
