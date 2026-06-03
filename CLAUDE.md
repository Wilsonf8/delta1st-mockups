# Delta1st POS Mockups

## Tech Stack

Turborepo monorepo, pnpm, Next.js 16 (App Router), Tailwind CSS v4, shadcn/ui

## Getting Started

```bash
pnpm install
pnpm dev --filter web
```

App runs at http://localhost:3000

## Project Structure

```
apps/web/          # Next.js app
  src/
    app/           # Routes (/, /orders)
    components/    # UI components
    components/ui/ # shadcn/ui primitives
    context/       # React context (employee state)
    lib/           # Types, mock data, utils
```

## Mock Employee PINs

| Employee | PIN    |
|----------|--------|
| John W.  | 111111 |
| Jane D.  | 222222 |
| Mike S.  | 333333 |

All employees start clocked out. State persists in localStorage. Clear it to reset: `localStorage.clear()`

## Deploy

Hosted on Vercel. Every push to `main` auto-deploys.

```bash
git add <files>
git commit -m "description"
git push
```

Vercel config: Root Directory is set to `apps/web`.
