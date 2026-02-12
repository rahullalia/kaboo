"use client"

import { use } from "react"
import Link from "next/link"
import Header from "@/components/Header"
import RoundEntryForm from "@/components/RoundEntryForm"
import Button from "@/components/ui/Button"
import { useGame } from "@/hooks/useGame"

export default function RoundEntryPage({
  params,
}: {
  params: Promise<{ gameId: string }>
}) {
  const { gameId } = use(params)
  const { game, loading, addRound } = useGame(gameId)

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="space-y-3 w-full max-w-sm px-4">
          <div className="h-12 rounded-2xl bg-zinc-800/40 animate-pulse" />
          <div className="h-48 rounded-2xl bg-zinc-800/40 animate-pulse" />
          <div className="h-48 rounded-2xl bg-zinc-800/40 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!game || game.status === "completed") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-500">
        <p>{!game ? "Game not found" : "Game is already completed"}</p>
        <Link href={game ? `/game/${game.id}` : "/"}>
          <Button variant="secondary">Go Back</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <Header
        title={`Round ${game.rounds.length + 1}`}
        showBack
        backHref={`/game/${game.id}`}
      />
      <main className="flex-1 p-4">
        <RoundEntryForm game={game} onSave={addRound} />
      </main>
    </>
  )
}
