"use client"

import { use, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import Header from "@/components/Header"
import RoundBreakdown from "@/components/RoundBreakdown"
import Button from "@/components/ui/Button"
import ConfirmDialog from "@/components/ui/ConfirmDialog"
import { useGame } from "@/hooks/useGame"

export default function GameHistoryPage({
  params,
}: {
  params: Promise<{ gameId: string }>
}) {
  const { gameId } = use(params)
  const { game, loading, deleteRound } = useGame(gameId)
  const [roundToDelete, setRoundToDelete] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="space-y-3 w-full max-w-sm px-4">
          <div className="h-12 rounded-2xl bg-zinc-800/40 animate-pulse" />
          <div className="h-32 rounded-2xl bg-zinc-800/40 animate-pulse" />
          <div className="h-32 rounded-2xl bg-zinc-800/40 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-500">
        <p>Game not found</p>
        <Link href="/">
          <Button variant="secondary">Back to Home</Button>
        </Link>
      </div>
    )
  }

  const handleDeleteRound = () => {
    if (!roundToDelete) return
    deleteRound(roundToDelete)
    toast.success("Round deleted")
    setRoundToDelete(null)
  }

  return (
    <>
      <Header
        title="Round History"
        showBack
        backHref={`/game/${game.id}`}
      />
      <main className="flex-1 p-4">
        <RoundBreakdown
          game={game}
          gameId={gameId}
          onDeleteRound={(roundId) => setRoundToDelete(roundId)}
        />
      </main>

      <ConfirmDialog
        open={roundToDelete !== null}
        title="Delete Round"
        description="This round's scores will be removed and remaining rounds renumbered."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteRound}
        onCancel={() => setRoundToDelete(null)}
      />
    </>
  )
}
