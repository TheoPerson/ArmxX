# Forearm Lab - UX/UI system

## Direction: strength studio

The visual language is a quiet training studio: mineral surfaces, ink contrast, one signal-orange action color, and a circular rep ring as the single memorable gesture. It avoids a generic dashboard grid by making the exercise interaction the visual anchor.

## Tokens

| Role | Dark | Light |
| --- | --- | --- |
| Canvas | `#111210` | `#F3F0E8` |
| Surface | `#20231E` | `#FFFDF8` |
| Primary text | `#EFF1E8` | `#1D211B` |
| Muted text | `#B9BEB2` | `#60665D` |
| Action | `#FF714E` | `#E55231` |

Typography uses Manrope for readable UI and DM Mono only for compact measurements, timers, and status labels. Spacing follows a 4/8px rhythm. Cards are reserved for grouping, not decoration.

## Screen map

- Today: focus statement, start card, exercise library, seven-day pulse.
- Workout: exercise name, series progress, rep ring, `+1` control, set validation.
- History: chronological sessions with reps, sets, and duration.
- Settings: JSON/CSV export, JSON import, theme preference, privacy note.

## Interaction rules

- The primary action is always explicit and named by its result.
- Feedback is immediate: the rep ring fills and the button pulses after `+1`.
- Reduced-motion users receive the same state change without animation.
- No icon-only control is used without an accessible label.
- The bottom navigation is limited to three destinations and respects the safe-area inset.
