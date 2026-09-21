# Decision log

## Decision: Direct IndexedDB instead of a client database dependency

- Context: The product needs durable offline session storage.
- Options: LocalStorage, Dexie, direct IndexedDB, SQLite/WASM.
- Choice: Direct IndexedDB.
- Why: It is native, sufficient for the MVP record volume, and avoids shipping an additional dependency.
- Impact: The storage wrapper stays small; migrations must be handled explicitly if the schema grows.

## Decision: Semantic CSS instead of Tailwind for the first slice

- Context: The brief recommends Tailwind, but the product needs a very small dependency graph and an opinionated visual system.
- Options: Tailwind, a component kit, semantic CSS.
- Choice: Semantic CSS tokens.
- Why: Less build/runtime overhead and clearer control over the premium mobile layout.
- Impact: Components use named classes rather than utility strings; the tokens are documented in `UX_UI.md`.
