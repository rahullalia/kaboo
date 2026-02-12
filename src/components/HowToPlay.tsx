"use client"

import { useState } from "react"
import { Info, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Card from "@/components/ui/Card"
import { cn } from "@/lib/utils"

export default function HowToPlay() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-400 transition-colors mx-auto"
      >
        <Info className="w-3.5 h-3.5" />
        How to Play
        <ChevronDown
          className={cn(
            "w-3 h-3 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="mt-3 space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-zinc-300 mb-1.5">Game Rules</h4>
                <ul className="space-y-1 text-xs text-zinc-400">
                  <li>Goal: End with the lowest score. First to 100 is eliminated.</li>
                  <li>Each turn: draw/swap cards, try to minimize your hand total.</li>
                  <li>Call &ldquo;Kaboo&rdquo; when you think you have the lowest total.</li>
                  <li>Correct Kaboo = 0 points. Wrong Kaboo = card total + 50 penalty.</li>
                  <li>Special cards: 7 (peek own), 8 (peek opponent), 10 (blind swap).</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-300 mb-1.5">Using the App</h4>
                <ul className="space-y-1 text-xs text-zinc-400">
                  <li>Add 3–10 players and start a game.</li>
                  <li>Each round: tap who called Kaboo, mark correct/wrong, enter card totals.</li>
                  <li>Scoreboard tracks totals — highest score is losing.</li>
                  <li>Game ends when someone hits 100.</li>
                </ul>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
