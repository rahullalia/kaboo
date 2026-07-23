# brain.md - Kaboo

Reference material. Rules live in `CLAUDE.md`.

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing: player setup, active games, how to play
│   ├── globals.css         # Tailwind imports, dark gradient bg
│   ├── game/[gameId]/      # Game view, round entry, round history
│   └── history/            # Completed games list
├── components/
│   ├── ui/                 # Primitives: Button, Card, Badge, Input, ConfirmDialog
│   ├── Header.tsx          # Page header with back nav
│   ├── PlayerSetup.tsx     # Player name entry (3-10 players)
│   ├── Scoreboard.tsx      # Ranked standings with warning badges
│   ├── RoundEntryForm.tsx  # Kaboo caller + card totals entry
│   ├── RoundBreakdown.tsx  # Round history with edit/delete
│   ├── GameOverBanner.tsx  # Elimination announcement
│   ├── CardPowers.tsx      # Special card reference
│   └── HowToPlay.tsx       # Collapsible rules section
├── hooks/
│   └── useGame.ts          # Game state management hook
└── lib/
    ├── constants.ts        # Game rules + PLAYER_COLORS palette
    ├── gameLogic.ts        # Score computation, standings
    ├── storage.ts          # localStorage persistence
    ├── types.ts            # TypeScript interfaces
    └── utils.ts            # cn(), generateId(), getPlayerColor()
```

## Color System

10-color rotating player palette defined in `constants.ts`:

`violet, pink, amber, cyan, emerald, rose, sky, orange, lime, fuchsia`

Each color provides a `{ bg, text, ring, pill }` set of Tailwind classes. Access via `getPlayerColor(index)` from `utils.ts`.

Used in: PlayerSetup (number badges), Scoreboard (rank circles), RoundEntryForm (caller pills), RoundBreakdown (player names).

## Key Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `MIN_PLAYERS` | 3 | Minimum players per game |
| `MAX_PLAYERS` | 10 | Maximum (matches palette size) |
| `KABOO_PENALTY` | 50 | Wrong Kaboo call penalty |
| `ELIMINATION_SCORE` | 100 | Score that triggers game over |
| `STORAGE_KEY` | `kaboo_games` | localStorage key |
