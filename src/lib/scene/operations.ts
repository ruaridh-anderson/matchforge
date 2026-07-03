import type { SceneDocument, SceneLayer } from "./types";

const touch = (scene: SceneDocument): SceneDocument => ({ ...scene, metadata: { ...scene.metadata, updatedAt: new Date().toISOString() } });
const sort = (layers: SceneLayer[]) => [...layers].sort((a, b) => a.zIndex - b.zIndex).map((layer, zIndex) => ({ ...layer, zIndex }));
export const selectScene = (project: { scenes: SceneDocument[] }, id: string) => project.scenes.find((scene) => scene.id === id);
export const addLayer = (scene: SceneDocument, layer: SceneLayer): SceneDocument => touch({ ...scene, layers: sort([...scene.layers, layer]) });
export const updateLayer = (scene: SceneDocument, id: string, patch: Partial<SceneLayer>): SceneDocument => touch({ ...scene, layers: scene.layers.map((layer) => layer.id === id ? ({ ...layer, ...patch, id, type: layer.type } as SceneLayer) : layer) });
export const removeLayer = (scene: SceneDocument, id: string): SceneDocument => touch({ ...scene, layers: scene.layers.filter((layer) => layer.id !== id) });
export const duplicateLayer = (scene: SceneDocument, id: string, newId = `${id}-copy`): SceneDocument => { const layer = scene.layers.find((item) => item.id === id); return layer ? addLayer(scene, { ...layer, id: newId, name: `${layer.name} copy`, x: layer.x + 24, y: layer.y + 24, zIndex: scene.layers.length }) : scene; };
export const reorderLayer = (scene: SceneDocument, id: string, zIndex: number): SceneDocument => touch({ ...scene, layers: sort(scene.layers.map((layer) => layer.id === id ? { ...layer, zIndex } : layer)) });
export const toggleLayerVisibility = (scene: SceneDocument, id: string): SceneDocument => updateLayer(scene, id, { visible: !scene.layers.find((layer) => layer.id === id)?.visible } as Partial<SceneLayer>);
export const toggleLayerLocked = (scene: SceneDocument, id: string): SceneDocument => updateLayer(scene, id, { locked: !scene.layers.find((layer) => layer.id === id)?.locked } as Partial<SceneLayer>);
