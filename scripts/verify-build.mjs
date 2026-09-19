import { readFile, stat } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { resolve } from 'node:path'

// The preserved site's HTML still references some photos from the site root.
// Verify those assets in the actual output, not just in the source directory.
let checked = 0
for (const route of ['index.html', 'classic/index.html', 'classic/projects/index.html']) {
  const html = await readFile(resolve('dist', route), 'utf8')
  const assets = [...html.matchAll(/(?:src|href|poster)="(\/[^"#?]+\.[a-z\d]+)(?:[?#][^"]*)?"/gi)].map(m => m[1])
  for (const asset of new Set(assets)) {
    assert.ok((await stat(resolve('dist', `.${asset}`))).isFile(), `${route}: missing ${asset}`)
    checked++
  }
}
const index = await readFile('dist/index.html', 'utf8')
assert.ok(index.includes('arena-view') && !index.includes('js-canvas'), 'Production must serve the new arena')
console.log(`Production asset verification passed: ${checked} references across the arena and both classic routes.`)
