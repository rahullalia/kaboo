"use client"

import { motion } from "framer-motion"
import { Skull } from "lucide-react"
import Card from "@/components/ui/Card"
import { Game } from "@/lib/types"
import { getStandings } from "@/lib/gameLogic"

interface GameOverBannerProps {
  game: Game
}

export default function GameOverBanner({ game }: GameOverBannerProps) {
  const standings = getStandings(game)
  const loser = standings.find((s) => s.player.id === game.loserId)

  if (!loser) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", duration: 0.5 }}
    >
      <Card className="text-center space-y-4 border-red-500/30 bg-red-500/5">
        <div className="text-3xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          Game Over!
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-2">
            <Skull className="w-6 h-6 text-red-400" />
          </div>
          <div className="text-lg font-bold text-red-400">
            {loser.player.name}
          </div>
          <div className="text-sm text-zinc-400">
            Eliminated ({loser.totalScore} pts)
          </div>
        </motion.div>
      </Card>
    </motion.div>
  )
}
