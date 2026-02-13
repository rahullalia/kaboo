"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, ClipboardList, Undo2, Trash2, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import Header from "@/components/Header"
import Scoreboard from "@/components/Scoreboard"
import GameOverBanner from "@/components/GameOverBanner"
import Button from "@/components/ui/Button"
import ConfirmDialog from "@/components/ui/ConfirmDialog"
import { useGame } from "@/hooks/useGame"
import { getStandings } from "@/lib/gameLogic"
import { deleteGame } from "@/lib/storage"

export default function GamePage({
  params,
}: {
  params: Promise<{ gameId: string }>
}) {
  const { gameId } = use(params)
  const { game, loading, undoLastRound, restartGame } = useGame(gameId)
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="space-y-3 w-full max-w-sm px-4">
          <div className="h-12 rounded-2xl bg-zinc-800/40 animate-pulse" />
          <div className="h-48 rounded-2xl bg-zinc-800/40 animate-pulse" />
          <div className="h-13 rounded-xl bg-zinc-800/40 animate-pulse" />
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

  const standings = getStandings(game)
  const isOver = game.status === "completed"

  const handleDelete = () => {
    deleteGame(game.id)
    toast.success("Game deleted")
    router.push("/")
  }

  const handleUndo = () => {
    undoLastRound()
    toast("Last round undone", { icon: "↩️" })
  }

  const handleRestart = () => {
    restartGame()
    toast.success("Game restarted!")
    setShowRestartConfirm(false)
  }

  return (
    <>
      <Header
        title={isOver ? "Game Over" : `Round ${game.rounds.length + 1}`}
        showBack
        backHref="/"
        action={
          <div className="flex items-center gap-1">
            {game.rounds.length > 0 && !isOver && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                aria-label="Undo last round"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        }
      />

      <main className="flex-1 p-4 space-y-4">
        {isOver && <GameOverBanner game={game} />}

        <Scoreboard standings={standings} roundCount={game.rounds.length} players={game.players} />

        {!isOver && (
          <Link href={`/game/${game.id}/round`}>
            <Button size="lg" className="w-full">
              <Plus className="w-5 h-5 mr-2" />
              Enter Round {game.rounds.length + 1} Scores
            </Button>
          </Link>
        )}

        {isOver && (
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => setShowRestartConfirm(true)}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Rematch
          </Button>
        )}

        {game.rounds.length > 0 && (
          <Link href={`/game/${game.id}/history`}>
            <Button variant="secondary" className="w-full mt-2">
              <ClipboardList className="w-4 h-4 mr-2" />
              Round History
            </Button>
          </Link>
        )}
      </main>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Game"
        description="This will permanently remove the game and all its rounds."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <ConfirmDialog
        open={showRestartConfirm}
        title="Rematch?"
        description="Same players, fresh scores. All rounds will be cleared."
        confirmLabel="Rematch"
        variant="warning"
        onConfirm={handleRestart}
        onCancel={() => setShowRestartConfirm(false)}
      />
    </>
  )
}
