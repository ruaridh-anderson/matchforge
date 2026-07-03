# Matchforge MVP

Matchforge is a focused sports matchday graphics product for turning live rugby events into publishable graphics quickly.

## Available routes

- `/dashboard` - live match dashboard, event controls, generated graphic preview, and links to edit templates, matches, and brand settings.
- `/templates` - local template library for Try, Score Update, Half Time, Full Time, Yellow Card, and Red Card scene documents.
- `/editor` - local graphics editor with scene, layer, canvas, properties, autosave, undo/redo, and PNG export.
- `/matches` - local match management and active-match selection.
- `/brand-kit` - local club brand kit editor and preview.

## Editor capabilities

The editor uses the serialized scene document as the source of truth. It supports text, data-text, image, rectangle, ellipse, and line rendering; layer selection; dragging; property editing; visibility and lock toggles; duplicate/delete; layer addition; scene duplication, renaming, deletion, and blank-scene creation; undo/redo; and native-resolution PNG export through `html-to-image`.

## Local persistence

Editor projects are autosaved to `localStorage` under `matchforge.editor.project.v1` after a short debounce and restored on refresh after runtime scene validation. Matches and the active match are stored under `matchforge.matches.v1`. Brand-kit values are stored under `matchforge.brandKit.v1`. Invalid project JSON is rejected safely and the built-in sample project is restored without overwriting template definitions.

## Current limitations

- No authentication, Supabase, cloud sync, payments, or social publishing.
- No upload pipeline; image layers accept URLs only.
- The editor canvas is a DOM artboard rather than the planned React Konva renderer.
- No animation or video export.
- Brand-kit values are persisted and previewed, but existing template colours are not force-updated.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000/dashboard` in Chrome or Edge.

## Test and production checks

```bash
npm run lint
npm run test
npm run build
npm start
```

See `AGENTS.md` before giving the repository to Codex. It contains the architecture rules and implementation order.
