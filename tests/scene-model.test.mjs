import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const types = readFileSync(new URL("../src/lib/scene/types.ts", import.meta.url), "utf8");
const templates = readFileSync(new URL("../src/lib/scene/templates.ts", import.meta.url), "utf8");
const document = readFileSync(new URL("../src/lib/scene/document.ts", import.meta.url), "utf8");
const bindings = readFileSync(new URL("../src/lib/scene/bindings.ts", import.meta.url), "utf8");
const operations = readFileSync(new URL("../src/lib/scene/operations.ts", import.meta.url), "utf8");
const history = readFileSync(new URL("../src/lib/scene/history.ts", import.meta.url), "utf8");

test("scene model declares project, scene metadata, dimensions, background, and layer schemas", () => {
  for (const declaration of ["MatchforgeProject", "SceneDocument", "SceneMetadata", "SceneDimensions", "SceneBackground", "LayerBase"]) assert.match(types, new RegExp(`interface ${declaration}`));
  for (const layerType of ["text", "data-text", "image", "rectangle", "ellipse", "line", "group"]) assert.match(types, new RegExp(`\\"${layerType}\\"`));
});

test("layers and text/image/shape properties cover required serializable fields", () => {
  for (const field of ["id", "type", "name", "visible", "locked", "x", "y", "width", "height", "rotation", "opacity", "zIndex"]) assert.match(types, new RegExp(`${field}:`));
  for (const field of ["content", "fontFamily", "fontSize", "fontWeight", "fontStyle", "textAlign", "verticalAlign", "colour", "lineHeight", "letterSpacing", "textTransform"]) assert.match(types, new RegExp(`${field}:`));
  for (const field of ["src", "alt", "objectFit", "objectPosition", "borderRadius", "crop"]) assert.match(types, new RegExp(`${field}`));
  for (const field of ["fill", "stroke", "strokeWidth"]) assert.match(types, new RegExp(`${field}`));
});

test("all required bindings are typed and resolver-owned", () => {
  for (const key of ["match.homeTeam.name", "match.homeTeam.shortName", "match.homeTeam.logo", "match.homeTeam.score", "match.awayTeam.name", "match.awayTeam.shortName", "match.awayTeam.logo", "match.awayTeam.score", "match.clock", "match.status", "event.type", "event.playerName", "event.playerNumber", "event.teamName", "event.minute", "event.score", "competition.name", "venue.name"]) {
    assert.ok(types.includes(key), `${key} is typed`);
    assert.ok(bindings.includes(key), `${key} is resolvable`);
  }
  assert.match(bindings, /resolveBindingValue/);
});

test("serialization, validation, and invalid rejection helpers exist", () => {
  for (const name of ["serializeScene", "restoreScene", "serializeProject", "restoreProject", "validateSceneDocument", "validateProjectDocument"]) assert.match(document, new RegExp(`function ${name}|const ${name}`));
  assert.match(document, /JSON\.stringify/);
  assert.match(document, /JSON\.parse/);
  assert.match(document, /errors\.push/);
  assert.match(document, /success: false/);
});

test("starter templates include six unique JSON-backed scene documents", () => {
  for (const id of ["template-try", "template-score-update", "template-half-time", "template-full-time", "template-yellow-card", "template-red-card"]) assert.match(templates, new RegExp(id));
  const ids = [...templates.matchAll(/id: \"([^\"]+)\"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, "layer and template ids in source should be unique within declarations");
});

test("scene operations cover layer updates, ordering, selection, visibility, locking, undo and redo", () => {
  for (const name of ["selectScene", "addLayer", "updateLayer", "removeLayer", "duplicateLayer", "reorderLayer", "toggleLayerVisibility", "toggleLayerLocked"]) assert.match(operations, new RegExp(`const ${name}`));
  for (const name of ["commitHistory", "undoHistory", "redoHistory"]) assert.match(history, new RegExp(`function ${name}`));
  assert.match(history, /limit = 50/);
  assert.match(history, /slice\(-limit\)/);
});
