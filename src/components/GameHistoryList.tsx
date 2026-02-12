"use client"

import Link from "next/link"
import { Trophy, Users, Clock } from "lucide-react"
import Card from "@/components/ui/Card"
import { Game } from "@/lib/types"
import { getStandings } from "@/lib/gameLogic"

interface GameHistoryListProps {
  games: Game[]
}

export default function GameHistoryList({ games }: GameHistoryListProps) {
  if (games.length === 0) {
    return (
      <Card className="text-center py-8 text-zinc-500">
        No completed games yet
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {games.map((game) => {
        const standings = getStandings(game)
        const winner = standings.find((s) => s.player.id === game.winnerId)
        const date = new Date(game.createdAt)
        const formatted = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })

        return (
          <Link key={game.id} href={`/game/${game.id}/history`}>
            <Card className="hover:bg-zinc-800/80 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm text-zinc-300">
                      {game.players.map((p) => p.name).join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatted}
                    </span>
                    <span>{game.rounds.length} rounds</span>
                  </div>
                </div>
                {winner && (
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      {winner.player.name}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
