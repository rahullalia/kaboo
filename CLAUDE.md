# CLAUDE.md - Kaboo

## What This Is

Score tracker PWA for the Kaboo card game. Mobile-first, built for game nights. Next.js 16.1.6 (App Router, Turbopack) + TypeScript + Tailwind CSS v4 + Framer Motion.

- Live: https://kaboo.rsla.io (verified 2026-07-22)
- Repo: https://github.com/rahullalia/kaboo
- Vercel project `kaboo`, auto-deploys on push to `main`

## Rules

- Before ANY auto-compact, run `/wrap` to save session context.
- Naming: existing files keep their convention (React components PascalCase, `lib/` and `hooks/` camelCase, Next.js `page.tsx` and `layout.tsx` locked). New non-code files kebab-case.
- Player colors always come from `getPlayerColor(index)` in `utils.ts`. Never hardcode a player color.
- Semantic colors (red and amber for warnings, emerald for success) are NOT overridden by the player palette. They stay for danger, caution, and Kaboo-correct states.
- Dark theme only. Base background is a subtle gradient, not flat black.

## Gotchas

- Tailwind v4 uses `@import "tailwindcss"` syntax. Multiple `via-` gradient stops are NOT supported. Use inline `style={{ backgroundImage }}` for multi-stop gradients (see `GameOverBanner` rainbow).

## Development

```bash
npm run dev
npm run build
```

## Reference

Architecture, player color palette, game constants: see `brain.md`.

## Parent

Workspace root + conventions: `~/Developer/CLAUDE.md`.
