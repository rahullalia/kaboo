export interface Player {
  id: string
  name: string
}

export interface RoundScore {
  playerId: string
  cardTotal: number
  calledKaboo: boolean
  kabooCorrect: boolean
  finalScore: number
}

export interface Round {
  id: string
  roundNumber: number
  scores: RoundScore[]
  timestamp: string
}

export interface Game {
  id: string
  players: Player[]
  rounds: Round[]
  status: "active" | "completed"
  createdAt: string
  completedAt?: string
  winnerId?: string
  loserId?: string
}

export interface PlayerStanding {
  player: Player
  totalScore: number
  rank: number
  kabooCallsMade: number
  kabooCallsCorrect: number
  warningLevel: "none" | "caution" | "danger"
}
