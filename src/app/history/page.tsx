"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import GameHistoryList from "@/components/GameHistoryList"
import { Game } from "@/lib/types"
import { getGames } from "@/lib/storage"

export default function HistoryPage() {
  const [completedGames, setCompletedGames] = useState<Game[]>([])

  useEffect(() => {
    const games = getGames().filter((g) => g.status === "completed")
    setCompletedGames(games)
  }, [])

  return (
    <>
      <Header title="Past Games" showBack backHref="/" />
      <main className="flex-1 p-4">
        <GameHistoryList games={completedGames} />
      </main>
    </>
  )
}
