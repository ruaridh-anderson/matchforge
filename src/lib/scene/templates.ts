import type { GraphicType } from "@/types/match";
import type { MatchforgeProject, SceneBindingKey, SceneDocument, SceneLayer, TextLayer } from "./types";

const now = "2026-01-01T00:00:00.000Z";
const dimensions = { width: 1080, height: 1350, unit: "px" as const };
const background = { type: "gradient" as const, value: "radial-gradient(circle at 72% 28%, var(--club-accent) 0, transparent 34%), linear-gradient(135deg, #090A0C 0%, #15171B 48%, #090A0C 100%)" };
const textStyle = { fontFamily: "Inter, Arial, sans-serif", fontWeight: 900 as const, fontStyle: "normal" as const, textAlign: "left" as const, verticalAlign: "top" as const, colour: "#FFFFFF", lineHeight: 0.9, letterSpacing: -2, textTransform: "uppercase" as const };

function baseLayer(id: string, name: string, zIndex: number) { return { id, name, visible: true, locked: false, rotation: 0, opacity: 1, zIndex }; }
function title(id: string, content: string): TextLayer { return { ...baseLayer(id, "Moment title", 30), type: "text", x: 76, y: 278, width: 840, height: 230, content, ...textStyle, fontSize: content.length > 10 ? 96 : 132 }; }
function data(id: string, name: string, key: SceneBindingKey, x: number, y: number, width: number, zIndex: number, fontSize = 42): SceneLayer { return { ...baseLayer(id, name, zIndex), type: "data-text", x, y, width, height: fontSize * 1.35, binding: { key, fallback: "—", format: key.includes("score") ? "score" : key === "event.minute" ? "minute" : "uppercase" }, content: "", ...textStyle, fontSize, fontWeight: 800, letterSpacing: key.includes("Team") ? 3 : -1 }; }
function scene(id: string, titleText: string, graphicType: GraphicType, layers: SceneLayer[]): SceneDocument { return { schemaVersion: 1, id, metadata: { title: titleText, graphicType, tags: ["starter", graphicType], createdAt: now, updatedAt: now }, dimensions, background, layers: [...layers].sort((a, b) => a.zIndex - b.zIndex) }; }

const commonLayers: SceneLayer[] = [
  { ...baseLayer("bg-grid", "Subtle pitch grid", 0), type: "rectangle", x: 0, y: 0, width: 1080, height: 1350, fill: "rgba(255,255,255,0.04)", borderRadius: 0 },
  { ...baseLayer("accent-slash", "Club accent slash", 10), type: "rectangle", x: -130, y: 570, width: 970, height: 190, rotation: -9, fill: "var(--club-accent)", borderRadius: 0 },
  { ...baseLayer("player-silhouette", "Player silhouette", 20), type: "image", x: 520, y: 238, width: 560, height: 920, src: "/player-silhouette.svg", alt: "Stylised player silhouette", objectFit: "contain", objectPosition: "bottom center", borderRadius: 0, crop: { x: 0, y: 0, width: 1, height: 1 } },
  data("home-team", "Home team name", "match.homeTeam.shortName", 76, 1110, 260, 40, 28),
  data("home-score", "Home score", "match.homeTeam.score", 440, 1088, 88, 41, 54),
  data("away-score", "Away score", "match.awayTeam.score", 552, 1088, 88, 42, 54),
  data("away-team", "Away team name", "match.awayTeam.shortName", 744, 1110, 260, 43, 28),
];
const noPlayer = () => commonLayers.filter((layer) => layer.id !== "player-silhouette");

export const sampleSceneTemplates: Record<"try" | "score-update" | "half-time" | "full-time" | "yellow-card" | "red-card", SceneDocument> = {
  try: scene("template-try", "Try", "try", [...commonLayers, title("try-title", "TRY"), data("try-player", "Try scorer", "event.playerName", 80, 540, 420, 31, 38), data("try-minute", "Event minute", "event.minute", 540, 540, 120, 32, 38)]),
  "score-update": scene("template-score-update", "Score Update", "score-update", [...noPlayer(), title("score-title", "SCORE UPDATE"), data("score-status", "Match status", "match.status", 80, 540, 360, 31, 36)]),
  "half-time": scene("template-half-time", "Half Time", "half-time", [...noPlayer(), title("half-title", "HALF TIME"), data("half-status", "Match status", "match.status", 80, 540, 360, 31, 36)]),
  "full-time": scene("template-full-time", "Full Time", "full-time", [...noPlayer(), title("full-title", "FULL TIME"), data("full-status", "Match status", "match.status", 80, 540, 360, 31, 36)]),
  "yellow-card": scene("template-yellow-card", "Yellow Card", "yellow-card", [...commonLayers, { ...baseLayer("yellow-card-shape", "Yellow card", 25), type: "rectangle", x: 740, y: 250, width: 210, height: 420, rotation: 8, fill: "#F4D43C", borderRadius: 24 }, title("yellow-title", "YELLOW CARD"), data("yellow-player", "Carded player", "event.playerName", 80, 540, 420, 31, 38)]),
  "red-card": scene("template-red-card", "Red Card", "red-card", [...commonLayers, { ...baseLayer("red-card-shape", "Red card", 25), type: "rectangle", x: 740, y: 250, width: 210, height: 420, rotation: 8, fill: "#EF3340", borderRadius: 24 }, title("red-title", "RED CARD"), data("red-player", "Carded player", "event.playerName", 80, 540, 420, 31, 38)]),
};

export const sampleProjectDocument: MatchforgeProject = { schemaVersion: 1, id: "project-local-demo", name: "Gala RFC matchday templates", sport: "rugby-union", scenes: Object.values(sampleSceneTemplates), activeSceneId: sampleSceneTemplates.try.id, createdAt: now, updatedAt: now };
export function getTemplateForGraphic(type: GraphicType): SceneDocument { return type in sampleSceneTemplates ? sampleSceneTemplates[type as keyof typeof sampleSceneTemplates] : sampleSceneTemplates["score-update"]; }
