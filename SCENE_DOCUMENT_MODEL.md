# Scene document model

## Architectural decisions

- Matchforge now has a serializable project document that owns scenes, canvas metadata and the active scene pointer. The first schema version is deliberately local-only and JSON-safe so it can later be persisted in Supabase without changing the editor contract.
- Scene documents are visual templates only. They reference normalized match data through `data-text` layer bindings and do not calculate rugby scores or mutate match state.
- Layers use a discriminated union with shared transform and editor fields (`visible`, `locked`, position, size, rotation, opacity and z-index) plus type-specific payloads for text, images, shapes and data-bound text.
- Undo and redo are implemented as immutable present/past/future snapshots. The helper is generic so it can be reused for full scene documents now and richer project-level edits later.
- The current DOM-based preview remains unchanged visually. The document model is introduced alongside the existing interface as the foundation for the planned React Konva editor.

## Remaining limitations

- The renderer does not yet draw from the scene document; `GraphicCanvas` still uses the existing React markup to preserve the current interface while the model stabilizes.
- Scene editing controls are not exposed in the UI yet, so history is wired for document changes but only template selection currently commits snapshots.
- Runtime validation is not included yet. The TypeScript schema keeps local sample documents strongly typed, and a future persistence layer should add explicit JSON validation before loading remote projects.
- Sample templates cover the requested match moments only and intentionally avoid sport-specific scoring logic.
