"use client"

import { motion } from "framer-motion"
import { Crown, Zap } from "lucide-react"
import Badge from "@/components/ui/Badge"
import Card from "@/components/ui/Card"
import { Player, PlayerStanding } from "@/lib/types"
import { cn, getPlayerColor } from "@/lib/utils"

interface ScoreboardProps {
  standings: PlayerStanding[]
  roundCount: number
  players: Player[]
}

export default function Scoreboard({ standings, roundCount, players }: ScoreboardProps) {
  const maxScore = Math.max(...standings.map((s) => s.totalScore))
  const lastPlaceCount = standings.filter((s) => s.totalScore === maxScore).length

  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-700/50 flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-400">Standings</span>
        <span className="text-sm text-zinc-500">
          {roundCount} {roundCount === 1 ? "round" : "rounds"}
        </span>
      </div>
      <div className="divide-y divide-zinc-700/30">
        {standings.map((s, i) => (
          <motion.div
            key={s.player.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "flex items-center justify-between px-4 py-3",
              s.totalScore === maxScore && roundCount > 0
                ? lastPlaceCount === 1
                  ? "bg-red-500/8"
                  : "bg-amber-500/8"
                : s.warningLevel === "danger"
                  ? "bg-red-500/5"
                  : s.warningLevel === "caution"
                    ? "bg-amber-500/5"
                    : undefined
            )}
          >
            <div className="flex items-center gap-3">
              {(() => {
                const playerIndex = players.findIndex((p) => p.id === s.player.id)
                const color = getPlayerColor(playerIndex)
                return (
                  <span
                    className={cn(
                      "w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold",
                      s.rank === 1 && roundCount > 0
                        ? `${color.bg} text-white`
                        : `${color.pill}`
                    )}
                  >
                    {s.rank === 1 && roundCount > 0 ? (
                      <Crown className="w-3.5 h-3.5" />
                    ) : (
                      s.rank
                    )}
                  </span>
                )
              })()}
              <div>
                <span className="font-medium text-zinc-100">
                  {s.player.name}
                </span>
                {s.kabooCallsCorrect > 0 && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    <span className="text-xs text-cyan-400">
                      {s.kabooCallsCorrect}x Kaboo
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {s.warningLevel === "caution" && (
                <Badge variant="caution">80+</Badge>
              )}
              {s.warningLevel === "danger" && (
                <Badge variant="danger">90+</Badge>
              )}
              <span
                className={cn(
                  "text-2xl font-bold tabular-nums",
                  s.totalScore === maxScore && roundCount > 0
                    ? lastPlaceCount === 1
                      ? "text-red-400"
                      : "text-amber-400"
                    : s.warningLevel === "danger"
                      ? "text-red-400"
                      : s.warningLevel === "caution"
                        ? "text-amber-400"
                        : "text-zinc-100"
                )}
              >
                {s.totalScore}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
