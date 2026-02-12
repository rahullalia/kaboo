"use client"

import { useState, useEffect, useCallback } from "react"
import { Game, Round } from "@/lib/types"
import { getGame, saveGame } from "@/lib/storage"
import { checkGameOver } from "@/lib/gameLogic"

export function useGame(gameId: string) {
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const g = getGame(gameId)
    setGame(g)
    setLoading(false)
  }, [gameId])

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
      setGame(updated)
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
    setGame(updated)
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
      setGame(updated)
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
      setGame(updated)
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
    setGame(updated)
  }, [game])

  return { game, loading, addRound, undoLastRound, updateRound, deleteRound, restartGame }
}
