"use client"

import { use } from "react"
import Link from "next/link"
import Header from "@/components/Header"
import RoundEntryForm from "@/components/RoundEntryForm"
import Button from "@/components/ui/Button"
import { useGame } from "@/hooks/useGame"

export default function EditRoundPage({
  params,
}: {
  params: Promise<{ gameId: string; roundId: string }>
}) {
  const { gameId, roundId } = use(params)
  const { game, loading, updateRound } = useGame(gameId)

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="space-y-3 w-full max-w-sm px-4">
          <div className="h-12 rounded-2xl bg-zinc-800/40 animate-pulse" />
          <div className="h-64 rounded-2xl bg-zinc-800/40 animate-pulse" />
        </div>
      </div>
    )
  }

  const round = game?.rounds.find((r) => r.id === roundId)

  if (!game || !round) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-500">
        <p>{!game ? "Game not found" : "Round not found"}</p>
        <Link href={game ? `/game/${game.id}/history` : "/"}>
          <Button variant="secondary">Go Back</Button>
        </Link>
      </div>
    )
  }

  const handleSave = (updatedRound: typeof round) => {
    updateRound(roundId, updatedRound)
  }

  return (
    <>
      <Header
        title={`Edit Round ${round.roundNumber}`}
        showBack
        backHref={`/game/${game.id}/history`}
      />
      <main className="flex-1 p-4">
        <RoundEntryForm game={game} onSave={handleSave} editRound={round} />
      </main>
    </>
  )
}
