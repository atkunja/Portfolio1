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
assert.ok(index.includes('id="experience"') && !index.includes('arena-view'), 'Production must serve the basic portfolio')
assert.ok(index.includes('Oceanus Marine Technologies') && index.includes('January 2027'))
assert.equal((index.match(/class="company-logo"/g) || []).length, 7, 'All seven experience rows have logos')
assert.equal((index.match(/class="incoming-status"/g) || []).length, 1, 'The future role is explicitly incoming')
assert.ok(!index.includes('self.__next_f') && !index.includes('src="/index.js"'), 'No stale hydration or arena entry point')
assert.ok(index.includes('id="education"') && index.includes('href="/#education"'), 'Education has a working navigation target')
assert.ok(index.indexOf('alt="Ether Autonomy logo"') < index.indexOf('alt="Barracuda Networks logo"'), 'Ether appears above Barracuda')
assert.ok(index.includes('August 2026 – Present'), 'Ether uses the updated start date')
assert.ok(!/<footer|<header|id="contact"/.test(index), 'Removed top bar, contact section and footer stay removed')
console.log(`Production asset verification passed: ${checked} references; basic portfolio and one incoming role.`)
