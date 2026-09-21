# ArmX - V1 status

Status date: 2026-09-21

## Honest completion score

**Core V1 user-facing product: 92% complete.**

**Overall release project: 78% complete.** This lower number includes the work that still has to happen outside the local product: GitHub publication, CI, Lighthouse/E2E evidence, device-width verification, and deployment.

## Evidence by area

| Area | Status | Evidence / remaining work |
| --- | ---: | --- |
| Product scope and UX direction | 100% | Product and UX briefs are written and reflected in the app |
| Workout loop | 100% | Exercise selection, repetitions, sets, timer, completion feedback |
| Local persistence | 95% | IndexedDB survives refresh; schema migration strategy remains future work |
| History and progress | 90% | History, totals, seven-day bars; richer trends are post-MVP |
| Export/import | 95% | Versioned JSON, CSV export, validated JSON merge import |
| PWA/offline | 85% | Manifest, service worker, offline indicator; real device offline install test remains |
| Accessibility/responsive UI | 85% | Labels, focus states, reduced motion, safe-area layout; 375px and landscape evidence remains |
| Automated quality | 65% | Typecheck, lint, unit tests, build, dependency audit; no Playwright/Lighthouse CI yet |
| Security/release operations | 60% | Headers and dependency audit; CodeQL, Dependabot, CSP hardening review, and Vercel setup remain |
| GitHub/publication | 0% | No remote repository, commit, or push has been authorized or made |

## Remaining gates for release-ready V1

1. Create the GitHub repository, commit the local V1, and add CI.
2. Add one Playwright flow covering workout completion and JSON export.
3. Run Lighthouse and real offline install checks at 375px portrait, iPhone-sized portrait, desktop, and landscape.
4. Review production CSP and deploy to Vercel only after the above evidence passes.

## Explicitly out of V1

Cloud sync, accounts, social features, encrypted local storage, push notifications, and a SQLite export are intentionally not included in this score.
