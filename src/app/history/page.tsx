"use client"

import Header from "@/components/Header"
import GameHistoryList from "@/components/GameHistoryList"
import { useSavedGames } from "@/hooks/useGame"

export default function HistoryPage() {
  const completedGames = (useSavedGames() ?? []).filter((g) => g.status === "completed")

  return (
    <>
      <Header title="Past Games" showBack backHref="/" />
      <main className="flex-1 p-4">
        <GameHistoryList games={completedGames} />
      </main>
    </>
  )
}
