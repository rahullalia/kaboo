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
}

export function deleteGame(id: string): void {
  const games = getGames().filter((g) => g.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
}
