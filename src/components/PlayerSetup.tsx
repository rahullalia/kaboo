"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, X, Play } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Card from "@/components/ui/Card"
import { Game, Player } from "@/lib/types"
import { MIN_PLAYERS, MAX_PLAYERS } from "@/lib/constants"
import { generateId } from "@/lib/utils"
import { saveGame } from "@/lib/storage"

export default function PlayerSetup() {
  const router = useRouter()
  const [names, setNames] = useState<string[]>(["", "", ""])

  const addPlayer = () => {
    if (names.length >= MAX_PLAYERS) return
    setNames([...names, ""])
  }

  const removePlayer = (index: number) => {
    if (names.length <= MIN_PLAYERS) return
    setNames(names.filter((_, i) => i !== index))
  }

  const updateName = (index: number, value: string) => {
    const updated = [...names]
    updated[index] = value
    setNames(updated)
  }

  const startGame = () => {
    const trimmed = names.map((n) => n.trim())
    if (trimmed.some((n) => !n)) {
      toast.error("All players need a name")
      return
    }
    if (new Set(trimmed).size !== trimmed.length) {
      toast.error("Names must be unique")
      return
    }

    const players: Player[] = trimmed.map((name) => ({
      id: generateId(),
      name,
    }))

    const game: Game = {
      id: generateId(),
      players,
      rounds: [],
      status: "active",
      createdAt: new Date().toISOString(),
    }

    saveGame(game)
    toast.success("Game started!")
    router.push(`/game/${game.id}`)
  }

  return (
    <Card className="space-y-4">
      <h2 className="text-base font-semibold text-zinc-200">Players</h2>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {names.map((name, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2"
            >
              <span className="w-6 text-sm text-zinc-500 text-right shrink-0">
                {i + 1}.
              </span>
              <Input
                placeholder={`Player ${i + 1}`}
                value={name}
                onChange={(e) => updateName(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (i === names.length - 1 && names.length < MAX_PLAYERS) {
                      addPlayer()
                    }
                  }
                }}
                maxLength={20}
                autoFocus={i === names.length - 1 && names.length > 3}
              />
              {names.length > MIN_PLAYERS && (
                <button
                  onClick={() => removePlayer(i)}
                  className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {names.length < MAX_PLAYERS && (
        <Button variant="ghost" size="sm" onClick={addPlayer} className="w-full">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Player ({names.length}/{MAX_PLAYERS})
        </Button>
      )}

      <Button onClick={startGame} size="lg" className="w-full">
        <Play className="w-5 h-5 mr-2" />
        Start Game
      </Button>
    </Card>
  )
}
