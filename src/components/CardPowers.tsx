"use client"

import { useState } from "react"
import { Info, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const powers = [
  { card: "7", effect: "Peek at one of your own cards" },
  { card: "8", effect: "Peek at another player's card" },
  { card: "10", effect: "Blind swap with another player" },
]

export default function CardPowers() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-400 transition-colors mx-auto"
      >
        <Info className="w-3.5 h-3.5" />
        Card Powers
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
            <div className="mt-3 space-y-1.5">
              {powers.map((p) => (
                <div
                  key={p.card}
                  className="flex items-center gap-2 text-xs text-zinc-400"
                >
                  <span className="w-6 h-6 flex items-center justify-center rounded bg-zinc-700/50 text-zinc-300 font-bold text-xs shrink-0">
                    {p.card}
                  </span>
                  {p.effect}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
