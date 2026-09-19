import test from 'node:test'
import assert from 'node:assert/strict'
import { GameState } from '../src/GameState.js'

const memory = new Map()
globalThis.localStorage = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => memory.set(key, value),
  removeItem: (key) => memory.delete(key),
}

const projects = [{ id: 'one' }, { id: 'two' }, { id: 'three' }]

test('progress is deduplicated and persisted', () => {
  memory.clear()
  const state = new GameState(projects)
  assert.equal(state.visit('one'), true)
  assert.equal(state.visit('one'), false)
  assert.equal(state.collect('spark-1'), true)
  assert.equal(state.collect('spark-1'), false)

  const restored = new GameState(projects)
  assert.deepEqual([...restored.visited], ['one'])
  assert.deepEqual([...restored.collected], ['spark-1'])
})

test('reset clears all saved discoveries', () => {
  const state = new GameState(projects)
  state.reset()
  assert.equal(state.visited.size, 0)
  assert.equal(state.collected.size, 0)
})
