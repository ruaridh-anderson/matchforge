import type { GraphicType } from "@/types/match";
import type { DataBindingKey, ProjectDocument, SceneDocument, SceneLayer, TextLayer } from "./types";

const now = "2026-01-01T00:00:00.000Z";
const canvas = { width: 1080, height: 1350 };
const textStyle = {
  fontFamily: "Inter, Arial, sans-serif",
  fontWeight: 900 as const,
  align: "left" as const,
  color: "#FFFFFF",
  lineHeight: 0.9,
  letterSpacing: -2,
};

function baseLayer(id: string, name: string, zIndex: number) {
  return { id, name, visible: true, locked: false, rotation: 0, opacity: 1, zIndex };
}

function title(id: string, content: string): TextLayer {
  return {
    ...baseLayer(id, "Moment title", 30),
    type: "text",
    x: 76,
    y: 278,
    width: 760,
    height: 220,
    content,
    ...textStyle,
    fontSize: 132,
  };
}

function data(id: string, name: string, binding: DataBindingKey, x: number, y: number, width: number, zIndex: number, fontSize = 42) {
  return {
    ...baseLayer(id, name, zIndex),
    type: "data-text" as const,
    x,
    y,
    width,
    height: fontSize * 1.35,
    binding,
    fallback: "—",
    format: binding === "eventMinute" ? "minute" as const : binding === "homeScore" || binding === "awayScore" ? "score" as const : "plain" as const,
    ...textStyle,
    fontSize,
    fontWeight: 800 as const,
    letterSpacing: binding.includes("Team") ? 3 : -1,
  };
}

function scene(id: string, name: string, graphicType: GraphicType, layers: SceneLayer[]): SceneDocument {
  return {
    id,
    name,
    graphicType,
    ...canvas,
    background: "radial-gradient(circle at 72% 28%, var(--club-accent) 0, transparent 34%), linear-gradient(135deg, #090A0C 0%, #15171B 48%, #090A0C 100%)",
    layers: [...layers].sort((a, b) => a.zIndex - b.zIndex),
    createdAt: now,
    updatedAt: now,
  };
}

const commonLayers: SceneLayer[] = [
  { ...baseLayer("bg-grid", "Subtle pitch grid", 0), type: "shape", shape: "rectangle", x: 0, y: 0, width: 1080, height: 1350, fill: "rgba(255,255,255,0.04)" },
  { ...baseLayer("accent-slash", "Club accent slash", 10), type: "shape", shape: "rectangle", x: -130, y: 570, width: 970, height: 190, rotation: -9, fill: "var(--club-accent)" },
  { ...baseLayer("player-silhouette", "Player silhouette", 20), type: "image", x: 520, y: 238, width: 560, height: 920, src: "/player-silhouette.svg", alt: "Stylised player silhouette", objectFit: "contain" },
  data("home-team", "Home team name", "homeTeamName", 76, 1110, 260, 40, 28),
  data("home-score", "Home score", "homeScore", 440, 1088, 88, 41, 54),
  data("away-score", "Away score", "awayScore", 552, 1088, 88, 42, 54),
  data("away-team", "Away team name", "awayTeamName", 744, 1110, 260, 43, 28),
];

export const sampleSceneTemplates: Record<"try" | "score-update" | "half-time" | "full-time", SceneDocument> = {
  try: scene("template-try", "Try", "try", [
    ...commonLayers,
    title("try-title", "TRY"),
    data("try-player", "Try scorer", "playerName", 80, 540, 420, 31, 38),
    data("try-minute", "Event minute", "eventMinute", 540, 540, 120, 32, 38),
  ]),
  "score-update": scene("template-score-update", "Score Update", "score-update", [
    ...commonLayers.filter((layer) => layer.id !== "player-silhouette"),
    title("score-title", "SCORE UPDATE"),
    data("score-status", "Match status", "matchStatus", 80, 540, 360, 31, 36),
  ]),
  "half-time": scene("template-half-time", "Half Time", "half-time", [
    ...commonLayers.filter((layer) => layer.id !== "player-silhouette"),
    title("half-title", "HALF TIME"),
    data("half-status", "Match status", "matchStatus", 80, 540, 360, 31, 36),
  ]),
  "full-time": scene("template-full-time", "Full Time", "full-time", [
    ...commonLayers.filter((layer) => layer.id !== "player-silhouette"),
    title("full-title", "FULL TIME"),
    data("full-status", "Match status", "matchStatus", 80, 540, 360, 31, 36),
  ]),
};

export const sampleProjectDocument: ProjectDocument = {
  schemaVersion: 1,
  id: "project-local-demo",
  name: "Gala RFC matchday templates",
  sport: "rugby-union",
  scenes: Object.values(sampleSceneTemplates),
  activeSceneId: sampleSceneTemplates.try.id,
  createdAt: now,
  updatedAt: now,
};

export function getTemplateForGraphic(type: GraphicType): SceneDocument {
  if (type === "half-time" || type === "full-time" || type === "score-update" || type === "try") {
    return sampleSceneTemplates[type];
  }
  return sampleSceneTemplates["score-update"];
}
