import { Game, PlayerStanding, RoundScore } from "./types"
import {
  KABOO_PENALTY,
  ELIMINATION_SCORE,
  CAUTION_THRESHOLD,
  DANGER_THRESHOLD,
} from "./constants"

export function computeFinalScore(
  cardTotal: number,
  calledKaboo: boolean,
  kabooCorrect: boolean
): number {
  if (!calledKaboo) return cardTotal
  if (kabooCorrect) return 0
  return cardTotal + KABOO_PENALTY
}

export function getScoreWarningLevel(
  score: number
): "none" | "caution" | "danger" {
  if (score >= DANGER_THRESHOLD) return "danger"
  if (score >= CAUTION_THRESHOLD) return "caution"
  return "none"
}

export function getStandings(game: Game): PlayerStanding[] {
  const standings: PlayerStanding[] = game.players.map((player) => {
    let totalScore = 0
    let kabooCallsMade = 0
    let kabooCallsCorrect = 0

    for (const round of game.rounds) {
      const score = round.scores.find((s) => s.playerId === player.id)
      if (score) {
        totalScore += score.finalScore
        if (score.calledKaboo) {
          kabooCallsMade++
          if (score.kabooCorrect) kabooCallsCorrect++
        }
      }
    }

    return {
      player,
      totalScore,
      rank: 0,
      kabooCallsMade,
      kabooCallsCorrect,
      warningLevel: getScoreWarningLevel(totalScore),
    }
  })

  standings.sort((a, b) => {
    if (a.totalScore !== b.totalScore) return a.totalScore - b.totalScore
    // Tiebreaker: more successful Kaboo calls wins
    if (a.kabooCallsCorrect !== b.kabooCallsCorrect)
      return b.kabooCallsCorrect - a.kabooCallsCorrect
    // Final tiebreaker: original player order
    const aIdx = game.players.findIndex((p) => p.id === a.player.id)
    const bIdx = game.players.findIndex((p) => p.id === b.player.id)
    return aIdx - bIdx
  })

  standings.forEach((s, i) => {
    s.rank = i + 1
  })

  return standings
}

export function checkGameOver(game: Game): {
  isOver: boolean
  winnerId?: string
  loserId?: string
} {
  const standings = getStandings(game)
  const eliminated = standings.filter(
    (s) => s.totalScore >= ELIMINATION_SCORE
  )

  if (eliminated.length === 0) {
    return { isOver: false }
  }

  // Highest score = loser (if multiple 100+, highest loses)
  const loser = eliminated.reduce((worst, s) =>
    s.totalScore > worst.totalScore ? s : worst
  )

  // Winner = lowest score
  const winner = standings[0]

  return {
    isOver: true,
    winnerId: winner.player.id,
    loserId: loser.player.id,
  }
}

export function buildRoundScore(
  playerId: string,
  cardTotal: number,
  calledKaboo: boolean,
  kabooCorrect: boolean
): RoundScore {
  return {
    playerId,
    cardTotal,
    calledKaboo,
    kabooCorrect,
    finalScore: computeFinalScore(cardTotal, calledKaboo, kabooCorrect),
  }
}
