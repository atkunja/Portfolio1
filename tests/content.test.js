import test from 'node:test'
import assert from 'node:assert/strict'
import { access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { profile, projects } from '../src/content.js'

test('profile contains the contact data required by the about panel', () => {
  assert.ok(profile.name.trim())
  assert.match(profile.email, /^[^@]+@[^@]+\.[^@]+$/)
  assert.ok(profile.intro.length >= 40)
})

test('project destinations have unique IDs and valid world data', () => {
  assert.equal(projects.length, 3)
  assert.equal(new Set(projects.map(({ id }) => id)).size, projects.length)
  projects.forEach((project) => {
    assert.ok(project.title.trim())
    assert.ok(project.description.length >= 60)
    assert.equal(project.position.length, 3)
    assert.ok(project.position.every(Number.isFinite))
    assert.match(project.accent, /^#[0-9a-f]{6}$/i)
  })
})

test('every project image resolves to a shipped public asset', async () => {
  const root = fileURLToPath(new URL('../public/', import.meta.url))
  await Promise.all(projects.map(({ image }) => access(`${root}${image.replace(/^\//, '')}`)))
})

test('the preserved classic portfolio ships its original personal media', async () => {
  const root = fileURLToPath(new URL('../public/classic/', import.meta.url))
  await Promise.all(['MEandMom.jpg', '315bench-poster.jpg', 'wrestling.png'].map((file) => access(`${root}${file}`)))
})
