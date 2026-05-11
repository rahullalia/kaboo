# CLAUDE.md - Kaboo

## Context
- Pre-compact: Run `/wrap` before any auto-compact
- Root instructions: See `/Users/rahullalia/lalia/CLAUDE.md`
- Naming: camelCase for all files and folders

---

## Project Overview

**Kaboo** — Score tracker PWA for the Kaboo card game. Built for mobile-first use during game nights.

**Tech Stack:** Next.js 16.1.6 (App Router, Turbopack), TypeScript, Tailwind CSS v4, Framer Motion, Sonner (toasts), Lucide icons
**Deployment:** Vercel (project: `kaboo`, auto-deploys on push to `main`)
**Repo:** https://github.com/rahullalia/kaboo

---

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing — player setup, active games, how to play
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

Each color provides `{ bg, text, ring, pill }` Tailwind class sets. Access via `getPlayerColor(index)` from `utils.ts`.

**Used in:** PlayerSetup (number badges), Scoreboard (rank circles), RoundEntryForm (caller pills), RoundBreakdown (player names)

**Design rule:** Semantic colors (red/amber for warnings, emerald for success) are NOT overridden — they stay for danger/caution/Kaboo-correct states.

## Key Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `MIN_PLAYERS` | 3 | Minimum players per game |
| `MAX_PLAYERS` | 10 | Maximum (matches palette size) |
| `KABOO_PENALTY` | 50 | Wrong Kaboo call penalty |
| `ELIMINATION_SCORE` | 100 | Score that triggers game over |
| `STORAGE_KEY` | `kaboo_games` | localStorage key |

## Tailwind Notes

- Using Tailwind CSS v4 with `@import "tailwindcss"` syntax
- Multiple `via-` gradient stops NOT supported — use inline `style={{ backgroundImage }}` for multi-stop gradients (see GameOverBanner rainbow)
- Dark theme only, base bg is subtle gradient not flat black

---

*Last Updated: 2026-02-13*
