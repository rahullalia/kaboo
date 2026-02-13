"use client"

import Link from "next/link"
import { Zap, AlertTriangle, Pencil, Trash2 } from "lucide-react"
import Badge from "@/components/ui/Badge"
import Card from "@/components/ui/Card"
import { Game } from "@/lib/types"
import { cn, getPlayerColor } from "@/lib/utils"

interface RoundBreakdownProps {
  game: Game
  gameId?: string
  onDeleteRound?: (roundId: string) => void
}

export default function RoundBreakdown({ game, gameId, onDeleteRound }: RoundBreakdownProps) {
  if (game.rounds.length === 0) {
    return (
      <Card className="text-center py-8 text-zinc-500">
        No rounds played yet
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {game.rounds.map((round) => (
        <Card key={round.id} className="p-0">
          <div className="px-4 py-2 border-b border-zinc-700/30 flex items-center justify-between">
            <span className="text-sm font-semibold text-zinc-400">
              Round {round.roundNumber}
            </span>
            {onDeleteRound && gameId && (
              <div className="flex items-center gap-1">
                <Link
                  href={`/game/${gameId}/round/${round.id}`}
                  className="flex items-center justify-center w-7 h-7 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => onDeleteRound(round.id)}
                  className="flex items-center justify-center w-7 h-7 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
          <div className="divide-y divide-zinc-700/20">
            {round.scores.map((score) => {
              const playerIndex = game.players.findIndex(
                (p) => p.id === score.playerId
              )
              const player = game.players[playerIndex]
              const color = getPlayerColor(playerIndex)
              return (
                <div
                  key={score.playerId}
                  className="flex items-center justify-between px-4 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("text-sm font-medium", color.text)}>
                      {player?.name}
                    </span>
                    {score.calledKaboo && score.kabooCorrect && (
                      <Badge variant="success">
                        <Zap className="w-3 h-3 mr-1" />
                        Kaboo!
                      </Badge>
                    )}
                    {score.calledKaboo && !score.kabooCorrect && (
                      <Badge variant="danger">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        +50
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {score.calledKaboo && !score.kabooCorrect && (
                      <span className="text-xs text-zinc-500">
                        {score.cardTotal} + 50
                      </span>
                    )}
                    <span
                      className={cn(
                        "text-lg font-bold tabular-nums",
                        score.finalScore === 0
                          ? "text-emerald-400"
                          : score.calledKaboo && !score.kabooCorrect
                            ? "text-red-400"
                            : "text-zinc-200"
                      )}
                    >
                      {score.finalScore}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      ))}
    </div>
  )
}
