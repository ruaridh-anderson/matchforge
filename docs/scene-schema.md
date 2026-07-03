# Scene document schema

Matchforge scene documents are serializable JSON objects that describe editable matchday graphics independently from React components and match scoring logic.

## Project and scene structure

A `MatchforgeProject` has `schemaVersion`, project metadata, `activeSceneId`, and a `scenes` array. Each `SceneDocument` has:

- `schemaVersion`: currently `1`.
- `id`: stable scene identifier.
- `metadata`: title, optional graphic type, tags, and timestamps.
- `dimensions`: pixel width and height.
- `background`: solid, gradient, or transparent background value.
- `layers`: ordered editable layers.

## Supported layer types

All layers share `id`, `type`, `name`, `visible`, `locked`, `x`, `y`, `width`, `height`, `rotation`, `opacity`, and `zIndex`.

Supported discriminated layer types are `text`, `data-text`, `image`, `rectangle`, `ellipse`, `line`, and `group`.

Text layers include content, font family, size, weight, style, horizontal and vertical alignment, colour, line height, letter spacing, and transform. Image layers include src, alt, fit, position, border radius, optional crop, and optional binding. Shape layers include fill, stroke, stroke width, and border radius where applicable.

## Supported bindings

Bindings are resolved by `resolveBindingValue` and are deliberately separate from scoring logic. Initial keys are:

- `match.homeTeam.name`, `match.homeTeam.shortName`, `match.homeTeam.logo`, `match.homeTeam.score`
- `match.awayTeam.name`, `match.awayTeam.shortName`, `match.awayTeam.logo`, `match.awayTeam.score`
- `match.clock`, `match.status`
- `event.type`, `event.playerName`, `event.playerNumber`, `event.teamName`, `event.minute`, `event.score`
- `competition.name`, `venue.name`

## Templates

Starter templates live in `src/lib/scene/templates.ts`, not UI components. They are plain data documents for Try, Score Update, Half Time, Full Time, Yellow Card, and Red Card.

## Versioning and migrations

Schema changes should increment `schemaVersion`. Runtime import should validate the incoming version first, then either accept the current version or run a pure migration function from the previous version to the next. Migrations should be small, deterministic, covered by tests, and should not depend on React, Zustand, browser APIs, or live match state.
