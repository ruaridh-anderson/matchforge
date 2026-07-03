# Matchforge roadmap

## Phase 1 - Interactive prototype (completed)
- Live match clock
- Home/away event context
- Rugby scoring actions
- Try, conversion, penalty, drop goal, cards, half-time, full-time and score graphics
- Match timeline
- Scene queue
- Club accent control
- PNG export

## Phase 2 - Usable local editor vertical slice (completed in this branch)
- Functional routes for dashboard, templates, editor, matches and brand kit
- Shared application shell with active navigation
- JSON-backed template library with open and duplicate actions
- Three-column editor with scene list, layer list, artboard, properties and toolbar
- Scene-document rendering for text, data-text, image, rectangle, ellipse and line layers
- Layer selection, dragging, property edits, add, duplicate, delete, lock and visibility controls
- Undo/redo for committed document edits
- Local autosave, refresh restore and corrupted-project fallback
- Local active match and brand-kit persistence
- Native-resolution PNG export from the editor artboard

## Phase 3 - Production canvas editor
- Replace the DOM artboard with React Konva for richer resize, rotate, crop and high-resolution export controls
- Add snapping, alignment, guides and drag-and-drop layer ordering
- Add image upload, crops and masks
- Add 1080x1080, 1080x1350, 1080x1920 and broadcast presets

## Phase 4 - Accounts and clubs
- Supabase authentication
- Organisations, roles and invitations
- Brand kits, sponsors, players and team logos
- Cloud projects, autosave and version history
- Row Level Security and audit logs

## Phase 5 - Matchday operations
- Live data feeds and manual fallback
- OBS browser source and scoreboard overlay
- Approval/publishing workflow
- Social platform integrations
- Venue screen and LED-safe outputs
- Football, hockey, cricket and basketball rule adapters
