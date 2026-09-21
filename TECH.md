# ArmX - Technical notes

## Architecture

- Next.js 15 App Router with React 19 and TypeScript.
- Client-side app shell for fast, local interactions.
- Direct IndexedDB wrapper in `lib/storage.ts`; no ORM or database dependency.
- Service worker in `public/sw.js` for shell and runtime GET caching.
- `app/manifest.ts` provides install metadata.

The brief proposed Tailwind, but the MVP uses a small semantic CSS token layer instead. This keeps the bundle and dependency graph smaller while preserving a responsive, token-driven design system.

## Local data model

```ts
type Session = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  date: string;
  sets: number;
  reps: number;
  durationSeconds: number;
};
```

IndexedDB database: `forearm-lab`, version 1, object store: `sessions`, key: `id`.

## Export contract

JSON exports are versioned envelopes:

```json
{ "version": 1, "exportedAt": "ISO-8601", "sessions": [] }
```

CSV exports contain `id`, `exercise`, `date`, `sets`, `reps`, and `duration_seconds` columns. Imports validate every session before persistence and merge by ID.

## Performance and offline strategy

- No server fetch is required to render or complete a session.
- Session reads/writes are small IndexedDB transactions.
- The service worker caches the app shell and runtime GET responses.
- Animations are transform/opacity based and disabled for reduced motion.
