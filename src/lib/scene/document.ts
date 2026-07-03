import type { MatchforgeProject, SceneDocument, SceneLayer } from "./types";

export interface ValidationResult<T> { success: boolean; data?: T; errors: string[]; }

export const serializeScene = (scene: SceneDocument): string => JSON.stringify(scene, null, 2);
export const restoreScene = (json: string): ValidationResult<SceneDocument> => validateSceneDocument(JSON.parse(json) as unknown);
export const serializeProject = (project: MatchforgeProject): string => JSON.stringify(project, null, 2);
export const restoreProject = (json: string): ValidationResult<MatchforgeProject> => validateProjectDocument(JSON.parse(json) as unknown);

export function validateProjectDocument(input: unknown): ValidationResult<MatchforgeProject> {
  const errors: string[] = [];
  if (!isObject(input)) return { success: false, errors: ["Project must be an object."] };
  check(input.schemaVersion === 1, "schemaVersion must be 1.", errors);
  checkString(input.id, "id", errors); checkString(input.name, "name", errors); checkString(input.activeSceneId, "activeSceneId", errors);
  check(Array.isArray(input.scenes), "scenes must be an array.", errors);
  const scenes = Array.isArray(input.scenes) ? input.scenes.map(validateSceneDocument) : [];
  scenes.forEach((result, index) => result.errors.forEach((error) => errors.push(`scenes.${index}: ${error}`)));
  if (errors.length) return { success: false, errors };
  return { success: true, data: input as unknown as MatchforgeProject, errors: [] };
}

export function validateSceneDocument(input: unknown): ValidationResult<SceneDocument> {
  const errors: string[] = [];
  if (!isObject(input)) return { success: false, errors: ["Scene must be an object."] };
  check(input.schemaVersion === 1, "schemaVersion must be 1.", errors);
  checkString(input.id, "id", errors);
  check(isObject(input.metadata), "metadata must be an object.", errors);
  if (isObject(input.metadata)) checkString(input.metadata.title, "metadata.title", errors);
  check(isObject(input.dimensions), "dimensions must be an object.", errors);
  if (isObject(input.dimensions)) { checkNumber(input.dimensions.width, "dimensions.width", errors); checkNumber(input.dimensions.height, "dimensions.height", errors); }
  check(isObject(input.background), "background must be an object.", errors);
  check(Array.isArray(input.layers), "layers must be an array.", errors);
  if (Array.isArray(input.layers)) validateLayers(input.layers, errors, "layers");
  return errors.length ? { success: false, errors } : { success: true, data: input as unknown as SceneDocument, errors: [] };
}

function validateLayers(layers: unknown[], errors: string[], path: string) {
  const ids = new Set<string>();
  layers.forEach((layer, index) => {
    const p = `${path}.${index}`;
    if (!isObject(layer)) { errors.push(`${p} must be an object.`); return; }
    ["id", "type", "name"].forEach((field) => checkString(layer[field], `${p}.${field}`, errors));
    ["visible", "locked"].forEach((field) => check(typeof layer[field] === "boolean", `${p}.${field} must be boolean.`, errors));
    ["x", "y", "width", "height", "rotation", "opacity", "zIndex"].forEach((field) => checkNumber(layer[field], `${p}.${field}`, errors));
    if (typeof layer.id === "string") { check(!ids.has(layer.id), `${p}.id duplicates ${layer.id}.`, errors); ids.add(layer.id); }
    if (layer.type === "text" || layer.type === "data-text") validateText(layer, p, errors);
    if (layer.type === "data-text" || (layer.type === "image" && layer.binding !== undefined)) validateBinding(layer.binding, `${p}.binding`, errors);
    if (layer.type === "image") ["src", "alt", "objectFit", "objectPosition"].forEach((field) => checkString(layer[field], `${p}.${field}`, errors));
    if (["rectangle", "ellipse"].includes(String(layer.type))) checkString(layer.fill, `${p}.fill`, errors);
    if (layer.type === "line") { checkString(layer.stroke, `${p}.stroke`, errors); checkNumber(layer.strokeWidth, `${p}.strokeWidth`, errors); checkNumber(layer.x2, `${p}.x2`, errors); checkNumber(layer.y2, `${p}.y2`, errors); }
    if (layer.type === "group") {
      if (Array.isArray(layer.children)) validateLayers(layer.children, errors, `${p}.children`);
      else errors.push(`${p}.children must be an array.`);
    }
  });
}

function validateText(layer: Record<string, unknown>, path: string, errors: string[]) {
  ["content", "fontFamily", "fontStyle", "textAlign", "verticalAlign", "colour", "textTransform"].forEach((field) => checkString(layer[field], `${path}.${field}`, errors));
  ["fontSize", "fontWeight", "lineHeight", "letterSpacing"].forEach((field) => checkNumber(layer[field], `${path}.${field}`, errors));
}
function validateBinding(binding: unknown, path: string, errors: string[]) { check(isObject(binding), `${path} must be an object.`, errors); if (isObject(binding)) checkString(binding.key, `${path}.key`, errors); }
function isObject(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function checkString(value: unknown, path: string, errors: string[]) { check(typeof value === "string" && value.length > 0, `${path} must be a non-empty string.`, errors); }
function checkNumber(value: unknown, path: string, errors: string[]) { check(typeof value === "number" && Number.isFinite(value), `${path} must be a finite number.`, errors); }
function check(condition: boolean, message: string, errors: string[]) { if (!condition) errors.push(message); }

export function flattenLayerIds(layers: SceneLayer[]): string[] { return layers.flatMap((layer) => layer.type === "group" ? [layer.id, ...flattenLayerIds(layer.children)] : [layer.id]); }
