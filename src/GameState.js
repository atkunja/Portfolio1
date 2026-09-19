const STORAGE_KEY = 'kunja-drive-progress-v1'

export class GameState {
  constructor(projects) {
    this.projectIds = projects.map((project) => project.id)
    this.visited = new Set()
    this.collected = new Set()
    this.startedAt = performance.now()
    this.distance = 0
    this.load()
  }

  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      this.visited = new Set((saved.visited || []).filter((id) => this.projectIds.includes(id)))
      this.collected = new Set(saved.collected || [])
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      visited: [...this.visited],
      collected: [...this.collected],
    }))
  }

  visit(id) {
    const isNew = !this.visited.has(id)
    this.visited.add(id)
    this.save()
    return isNew
  }

  collect(id) {
    const isNew = !this.collected.has(id)
    this.collected.add(id)
    this.save()
    return isNew
  }

  reset() {
    this.visited.clear()
    this.collected.clear()
    this.distance = 0
    this.startedAt = performance.now()
    this.save()
  }

  get projectProgress() { return this.visited.size }
  get elapsed() { return performance.now() - this.startedAt }
}
