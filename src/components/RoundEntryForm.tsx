"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, X, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import Input from "@/components/ui/Input"
import Badge from "@/components/ui/Badge"
import CardPowers from "@/components/CardPowers"
import { Game, Round } from "@/lib/types"
import { buildRoundScore, computeFinalScore } from "@/lib/gameLogic"
import { generateId, cn, getPlayerColor } from "@/lib/utils"

interface RoundEntryFormProps {
  game: Game
  onSave: (round: Round) => void
  editRound?: Round
}

interface PlayerEntry {
  playerId: string
  name: string
  cardTotal: string
}

export default function RoundEntryForm({ game, onSave, editRound }: RoundEntryFormProps) {
  const router = useRouter()

  const getInitialEntries = (): PlayerEntry[] => {
    if (editRound) {
      return game.players.map((p) => {
        const score = editRound.scores.find((s) => s.playerId === p.id)
        return {
          playerId: p.id,
          name: p.name,
          cardTotal: score ? String(score.cardTotal) : "",
        }
      })
    }
    return game.players.map((p) => ({
      playerId: p.id,
      name: p.name,
      cardTotal: "",
    }))
  }

  const getInitialKabooCaller = (): string | null => {
    if (editRound) {
      const caller = editRound.scores.find((s) => s.calledKaboo)
      return caller?.playerId ?? null
    }
    return null
  }

  const getInitialKabooCorrect = (): boolean | null => {
    if (editRound) {
      const caller = editRound.scores.find((s) => s.calledKaboo)
      return caller ? caller.kabooCorrect : null
    }
    return null
  }

  const [entries, setEntries] = useState<PlayerEntry[]>(getInitialEntries)
  const [kabooCaller, setKabooCaller] = useState<string | null>(getInitialKabooCaller)
  const [kabooCorrect, setKabooCorrect] = useState<boolean | null>(getInitialKabooCorrect)

  const updateCardTotal = (playerId: string, value: string) => {
    if (value !== "" && (!/^\d+$/.test(value) || parseInt(value) < 0)) return
    setEntries(
      entries.map((e) =>
        e.playerId === playerId ? { ...e, cardTotal: value } : e
      )
    )
  }

  const toggleKabooCaller = (playerId: string) => {
    if (kabooCaller === playerId) {
      setKabooCaller(null)
      setKabooCorrect(null)
      setEntries((prev) =>
        prev.map((e) =>
          e.playerId === playerId ? { ...e, cardTotal: "" } : e
        )
      )
    } else {
      setEntries((prev) =>
        prev.map((e) =>
          e.playerId === kabooCaller ? { ...e, cardTotal: "" } : e
        )
      )
      setKabooCaller(playerId)
      setKabooCorrect(null)
    }
  }

  const getPreviewScore = (entry: PlayerEntry): number | null => {
    const cardTotal = parseInt(entry.cardTotal)
    if (isNaN(cardTotal)) return null
    const isCaller = kabooCaller === entry.playerId
    if (isCaller && kabooCorrect === null) return null
    return computeFinalScore(cardTotal, isCaller, kabooCorrect ?? false)
  }

  const saveRound = () => {
    if (entries.some((e) => e.cardTotal === "")) {
      toast.error("Enter card totals for all players")
      return
    }

    if (!kabooCaller) {
      toast.error("Select who called Kaboo")
      return
    }

    if (kabooCorrect === null) {
      toast.error("Was the Kaboo call correct or wrong?")
      return
    }

    const round: Round = {
      id: editRound?.id ?? generateId(),
      roundNumber: editRound?.roundNumber ?? game.rounds.length + 1,
      scores: entries.map((e) => {
        const isCaller = kabooCaller === e.playerId
        return buildRoundScore(
          e.playerId,
          parseInt(e.cardTotal),
          isCaller,
          isCaller ? kabooCorrect : false
        )
      }),
      timestamp: editRound?.timestamp ?? new Date().toISOString(),
    }

    onSave(round)
    toast.success(editRound ? "Round updated!" : "Round saved!")
    router.push(editRound ? `/game/${game.id}/history` : `/game/${game.id}`)
  }

  return (
    <div className="space-y-4">
      {/* Kaboo Caller Selection */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-zinc-200">
            Who called Kaboo?
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {game.players.map((p, i) => {
            const color = getPlayerColor(i)
            return (
              <button
                key={p.id}
                onClick={() => toggleKabooCaller(p.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  kabooCaller === p.id
                    ? `${color.bg} text-white`
                    : `${color.pill} hover:opacity-80`
                )}
              >
                {p.name}
              </button>
            )
          })}
        </div>

        {/* Correct / Wrong toggle */}
        {kabooCaller && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 flex gap-2"
          >
            <button
              onClick={() => {
                setKabooCorrect(true)
                setEntries((prev) =>
                  prev.map((e) =>
                    e.playerId === kabooCaller
                      ? { ...e, cardTotal: "0" }
                      : e
                  )
                )
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all",
                kabooCorrect === true
                  ? "bg-emerald-500 text-white"
                  : "bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700"
              )}
            >
              <Check className="w-4 h-4" />
              Correct
            </button>
            <button
              onClick={() => {
                setKabooCorrect(false)
                setEntries((prev) =>
                  prev.map((e) =>
                    e.playerId === kabooCaller
                      ? { ...e, cardTotal: "" }
                      : e
                  )
                )
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all",
                kabooCorrect === false
                  ? "bg-red-500 text-white"
                  : "bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700"
              )}
            >
              <X className="w-4 h-4" />
              Wrong (+50)
            </button>
          </motion.div>
        )}
      </Card>

      {/* Card Totals */}
      <Card>
        <h3 className="text-sm font-semibold text-zinc-200 mb-3">
          Card Totals
        </h3>
        <div className="space-y-3">
          {entries.map((entry) => {
            const isCaller = kabooCaller === entry.playerId
            const preview = getPreviewScore(entry)

            return (
              <div key={entry.playerId} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-zinc-300 truncate">
                      {entry.name}
                    </span>
                    {isCaller && <Badge variant="kaboo">Kaboo</Badge>}
                  </div>
                  {isCaller && kabooCorrect === true ? (
                    <div className="w-full h-11 rounded-xl bg-zinc-900/40 border border-zinc-600/30 px-3 flex items-center text-zinc-500 text-sm">
                      0 - Correct Kaboo
                    </div>
                  ) : (
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="0"
                      value={entry.cardTotal}
                      onChange={(e) =>
                        updateCardTotal(entry.playerId, e.target.value)
                      }
                      min={0}
                    />
                  )}
                </div>
                <div className="w-16 text-right shrink-0">
                  {preview !== null && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        "text-xl font-bold tabular-nums",
                        preview === 0
                          ? "text-emerald-400"
                          : isCaller && kabooCorrect === false
                            ? "text-red-400"
                            : "text-zinc-300"
                      )}
                    >
                      {preview === 0 ? "0" : `+${preview}`}
                    </motion.span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={() => router.back()}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button onClick={saveRound} className="flex-1">
          {editRound ? "Update Round" : "Save Round"}
        </Button>
      </div>

      <CardPowers />
    </div>
  )
}
