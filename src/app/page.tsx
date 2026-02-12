"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { History, Gamepad2 } from "lucide-react"
import Header from "@/components/Header"
import PlayerSetup from "@/components/PlayerSetup"
import HowToPlay from "@/components/HowToPlay"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import { Game } from "@/lib/types"
import { getGames } from "@/lib/storage"
import { getStandings } from "@/lib/gameLogic"

export default function HomePage() {
  const [activeGames, setActiveGames] = useState<Game[]>([])
  const [hasHistory, setHasHistory] = useState(false)

  useEffect(() => {
    const games = getGames()
    setActiveGames(games.filter((g) => g.status === "active"))
    setHasHistory(games.some((g) => g.status === "completed"))
  }, [])

  const getLeaderInfo = (game: Game): string => {
    if (game.rounds.length === 0) return "No rounds yet"
    const standings = getStandings(game)
    const leader = standings[0]
    return `Round ${game.rounds.length} · ${leader.player.name} leads with ${leader.totalScore}`
  }

  return (
    <>
      <Header
        title="Kaboo"
        action={
          hasHistory ? (
            <Link href="/history">
              <Button variant="ghost" size="sm">
                <History className="w-4 h-4 mr-1.5" />
                History
              </Button>
            </Link>
          ) : undefined
        }
      />

      <main className="flex-1 p-4 space-y-4">
        {activeGames.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-zinc-400 px-1 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Continue Playing
            </h2>
            {activeGames.map((game) => (
              <Link key={game.id} href={`/game/${game.id}`}>
                <Card className="hover:bg-zinc-800/80 transition-colors cursor-pointer flex items-center justify-between border-l-2 border-emerald-500/50">
                  <div>
                    <div className="text-sm text-zinc-300">
                      {game.players.map((p) => p.name).join(", ")}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {getLeaderInfo(game)}
                    </div>
                  </div>
                  <Gamepad2 className="w-5 h-5 text-emerald-400" />
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="space-y-2">
          {activeGames.length > 0 ? (
            <h2 className="text-sm font-medium text-zinc-400 px-1">
              Or Start Fresh
            </h2>
          ) : (
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold text-zinc-100">Kaboo</h2>
              <p className="text-sm text-zinc-500 mt-1">
                Score tracker for the card game
              </p>
            </div>
          )}
          <PlayerSetup />
        </div>

        <HowToPlay />
      </main>

      <footer className="py-4 text-center">
        <a
          href="https://rsla.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          Powered by RSL/A
        </a>
      </footer>
    </>
  )
}
