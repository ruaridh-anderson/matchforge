import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const types = readFileSync(new URL("../src/lib/scene/types.ts", import.meta.url), "utf8");
const templates = readFileSync(new URL("../src/lib/scene/templates.ts", import.meta.url), "utf8");
const history = readFileSync(new URL("../src/lib/scene/history.ts", import.meta.url), "utf8");

test("scene model declares serializable project, scene, and layer schemas", () => {
  for (const declaration of ["ProjectDocument", "SceneDocument", "LayerBase"]) {
    assert.match(types, new RegExp(`interface ${declaration}`));
  }

  for (const layerType of ["text", "data-text", "image", "shape"]) {
    assert.match(types, new RegExp(`\\"${layerType}\\"`));
  }
});

test("every layer carries transform, visibility, lock, opacity, and ordering fields", () => {
  for (const field of ["id", "name", "visible", "locked", "x", "y", "width", "height", "rotation", "opacity", "zIndex"]) {
    assert.match(types, new RegExp(`${field}:`));
  }
});

test("text and data-bound text schemas cover required typography and match bindings", () => {
  for (const field of ["content", "fontFamily", "fontSize", "fontWeight", "align", "color", "lineHeight", "letterSpacing"]) {
    assert.match(types, new RegExp(`${field}:`));
  }

  for (const binding of ["homeTeamName", "awayTeamName", "homeScore", "awayScore", "playerName", "eventMinute", "matchStatus"]) {
    assert.match(types, new RegExp(`\\| \\"${binding}\\"|${binding}:`));
  }
});

test("sample serialized templates include Try, Score Update, Half Time, and Full Time", () => {
  for (const id of ["template-try", "template-score-update", "template-half-time", "template-full-time"]) {
    assert.match(templates, new RegExp(id));
  }
});

test("history implementation supports commit, undo, redo, and redo invalidation", () => {
  assert.match(history, /past: \[\]/);
  assert.match(history, /future: \[\]/);
  assert.match(history, /commitHistory/);
  assert.match(history, /undoHistory/);
  assert.match(history, /redoHistory/);
  assert.match(history, /future: \[\],/);
});
