import { Game } from "./types"
import { STORAGE_KEY } from "./constants"

export function getGames(): Game[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return []
  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

let snapshotRaw: string | null = null
let snapshotGames: Game[] = []
const listeners = new Set<() => void>()

// The saved games for useSyncExternalStore: the same array until the stored text changes.
// Never mutate it; getGames() returns a fresh copy for that.
export function getGamesSnapshot(): Game[] {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data !== snapshotRaw) {
    snapshotRaw = data
    try {
      snapshotGames = data ? JSON.parse(data) : []
    } catch {
      snapshotGames = []
    }
  }
  return snapshotGames
}

// Re-renders the screens that change a game (useGame) after each save.
export function subscribeGames(onChange: () => void): () => void {
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

export function getGame(id: string): Game | null {
  const games = getGames()
  return games.find((g) => g.id === id) ?? null
}

export function saveGame(game: Game): void {
  const games = getGames()
  const index = games.findIndex((g) => g.id === game.id)
  if (index >= 0) {
    games[index] = game
  } else {
    games.unshift(game)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
  listeners.forEach((onChange) => onChange())
}

// No change signal: the screen that deletes a game leaves for home right away.
export function deleteGame(id: string): void {
  const games = getGames().filter((g) => g.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
}
