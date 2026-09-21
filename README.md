# ArmX

ArmX is a private, offline-first training log for focused forearm work. It is intentionally local-only: sessions live in IndexedDB and can be exported as JSON or CSV at any time.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Quality commands

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Product docs

- [PRODUCT.md](./PRODUCT.md) - scope, personas, acceptance criteria
- [UX_UI.md](./UX_UI.md) - visual system and interaction rules
- [TECH.md](./TECH.md) - architecture, storage, PWA and export contract
- [SECURITY.md](./SECURITY.md) - threat model and safeguards
- [ADE.md](./ADE.md) - agent workflow and decision logging
- [ROADMAP.md](./ROADMAP.md) - honest V1 completion score and remaining release gates
