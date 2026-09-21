# ArmX - Agent-driven development

## Roles

| Role | Responsibility |
| --- | --- |
| Product | Keep the core loop small and measurable |
| UX/UI | Protect hierarchy, accessibility, and mobile ergonomics |
| Frontend | Implement the local workout loop and responsive shell |
| Storage | Keep the IndexedDB and import/export contract stable |
| Security/QA | Review input handling, headers, tests, and runtime evidence |

## Decision log template

```md
## Decision: <short title>
- Context:
- Options:
- Choice:
- Why:
- Impact:
```

## Reporting format

```md
Progress: <percentage>
Risk: low | medium | high
Evidence: <commands, screenshots, or runtime checks>
Next: <one or two concrete actions>
```

## Working agreement

Keep changes small, preserve unrelated work, validate the actual UI, and distinguish passing static checks from proven runtime behavior. Use conventional commit names when commits are explicitly requested.
