"use client"

import { useCallback, useSyncExternalStore } from "react"
import { Game, Round } from "@/lib/types"
import { getGamesSnapshot, saveGame, subscribeGames } from "@/lib/storage"
import { checkGameOver } from "@/lib/gameLogic"

const noSubscription = () => () => {}
const notLoaded = () => null

// The saved games, read as the screen renders; null on the server and until hydration.
export function useSavedGames(): Game[] | null {
  return useSyncExternalStore<Game[] | null>(noSubscription, getGamesSnapshot, notLoaded)
}

export function useGame(gameId: string) {
  const games = useSyncExternalStore<Game[] | null>(subscribeGames, getGamesSnapshot, notLoaded)
  const loading = games === null
  const game = games?.find((g) => g.id === gameId) ?? null

  const addRound = useCallback(
    (round: Round) => {
      if (!game) return

      const updated: Game = {
        ...game,
        rounds: [...game.rounds, round],
      }

      const result = checkGameOver(updated)
      if (result.isOver) {
        updated.status = "completed"
        updated.completedAt = new Date().toISOString()
        updated.winnerId = result.winnerId
        updated.loserId = result.loserId
      }

      saveGame(updated)
    },
    [game]
  )

  const undoLastRound = useCallback(() => {
    if (!game || game.rounds.length === 0) return

    const updated: Game = {
      ...game,
      rounds: game.rounds.slice(0, -1),
      status: "active",
      completedAt: undefined,
      winnerId: undefined,
      loserId: undefined,
    }

    saveGame(updated)
  }, [game])

  const updateRound = useCallback(
    (roundId: string, updatedRound: Round) => {
      if (!game) return

      const updated: Game = {
        ...game,
        rounds: game.rounds.map((r) => (r.id === roundId ? updatedRound : r)),
        status: "active",
        completedAt: undefined,
        winnerId: undefined,
        loserId: undefined,
      }

      const result = checkGameOver(updated)
      if (result.isOver) {
        updated.status = "completed"
        updated.completedAt = new Date().toISOString()
        updated.winnerId = result.winnerId
        updated.loserId = result.loserId
      }

      saveGame(updated)
    },
    [game]
  )

  const deleteRound = useCallback(
    (roundId: string) => {
      if (!game) return

      const filtered = game.rounds
        .filter((r) => r.id !== roundId)
        .map((r, i) => ({ ...r, roundNumber: i + 1 }))

      const updated: Game = {
        ...game,
        rounds: filtered,
        status: "active",
        completedAt: undefined,
        winnerId: undefined,
        loserId: undefined,
      }

      const result = checkGameOver(updated)
      if (result.isOver) {
        updated.status = "completed"
        updated.completedAt = new Date().toISOString()
        updated.winnerId = result.winnerId
        updated.loserId = result.loserId
      }

      saveGame(updated)
    },
    [game]
  )

  const restartGame = useCallback(() => {
    if (!game) return

    const updated: Game = {
      ...game,
      rounds: [],
      status: "active",
      createdAt: new Date().toISOString(),
      completedAt: undefined,
      winnerId: undefined,
      loserId: undefined,
    }

    saveGame(updated)
  }, [game])

  return { game, loading, addRound, undoLastRound, updateRound, deleteRound, restartGame }
}
