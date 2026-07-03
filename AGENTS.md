# Matchforge agent guide

## Product intent
Matchforge is a focused sports matchday graphics product. It is not a general-purpose design suite. Every feature should reduce the time between a match event and a publishable graphic.

## Current architecture
- Next.js App Router with TypeScript
- Tailwind CSS v4
- Zustand for live match and scene state
- `html-to-image` for the temporary DOM-based PNG export path
- Local demo data only - no database or authentication yet

## Important boundaries
- Keep match state independent from visual templates.
- Templates receive normalized match data and should not contain scoring logic.
- Scoring changes must happen through `recordEvent` in `src/store/useMatchStore.ts`.
- New sports should implement a scoring rules adapter instead of adding conditionals throughout the UI.
- Keep UI restrained: neutral surfaces, one club accent, compact typography, minimal gradients.
- Avoid fake AI features, excessive glassmorphism, neon glows, giant rounded cards, and placeholder marketing copy.

## Near-term implementation order
1. Move match rules into `src/lib/sports/rugby.ts`.
2. Add an editable scene document model with layers.
3. Replace the DOM preview with React Konva for drag, resize, crop, layer ordering and high-resolution export.
4. Add Supabase Auth, Postgres, Storage and Row Level Security.
5. Add autosave, template versioning and brand kits.
6. Add a browser-output mode for OBS and venue screens.

## Definition of done
- Run `npm run lint`.
- Run `npm run build`.
- Test Try -> Conversion -> Half Time -> Full Time.
- Verify PNG export in a Chromium browser.
- Do not commit secrets or service-role keys.
