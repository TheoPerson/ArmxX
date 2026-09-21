# ArmX - Product brief

## Vision

Make a serious forearm session feel as immediate as starting a timer. ArmX is a mobile-first, local-only PWA for athletes who want the useful parts of a training log without accounts, feeds, or friction.

## MVP scope

| Priority | Capability | Acceptance signal |
| --- | --- | --- |
| P0 | Choose a forearm exercise | Three clear exercise cards with target sets/reps |
| P0 | Count repetitions and sets | Large tap target, keyboard Space shortcut, visible progress |
| P0 | Save completed sessions | Session appears in local history after completion |
| P0 | Work offline | App shell and existing UI remain usable after service-worker cache |
| P0 | Export/import | JSON and CSV download; validated JSON import |
| P1 | Theme preference | Light/dark choice persists locally |
| P1 | Lightweight progress view | 7-day activity bars and totals |

## Non-goals

No account system, server database, social layer, cloud sync, push notifications, or medical coaching in the MVP. Those features would add cost and risk without improving the core training loop.

## Primary journey

1. Open the app and see today's focus immediately.
2. Choose a movement.
3. Tap `+1` for each repetition and validate each set.
4. Finish the session and see it in history.
5. Export a portable copy when needed.

## Acceptance criteria

- First interaction is available without a perceptible loading screen after the shell has been cached.
- Every control has a visible focus state and a touch target of at least 44px.
- Session data remains on-device and survives a refresh.
- Exported JSON can be imported again without writing malformed records.
- The interface works at 375px wide and remains comfortable on desktop.
