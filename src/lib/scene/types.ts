import type { GraphicType, MatchStatus } from "@/types/match";

export const SCENE_SCHEMA_VERSION = 1 as const;
export type SceneDocumentVersion = typeof SCENE_SCHEMA_VERSION;
export type LayerType = "text" | "data-text" | "image" | "rectangle" | "ellipse" | "line" | "group";
export type TextAlign = "left" | "center" | "right" | "justify";
export type VerticalAlign = "top" | "middle" | "bottom";
export type FontWeight = 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type FontStyle = "normal" | "italic";
export type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";
export type ObjectFit = "cover" | "contain" | "fill" | "none";
export type BindingFormat = "plain" | "score" | "minute" | "uppercase";

export type SceneBindingKey =
  | "match.homeTeam.name"
  | "match.homeTeam.shortName"
  | "match.homeTeam.logo"
  | "match.homeTeam.score"
  | "match.awayTeam.name"
  | "match.awayTeam.shortName"
  | "match.awayTeam.logo"
  | "match.awayTeam.score"
  | "match.clock"
  | "match.status"
  | "event.type"
  | "event.playerName"
  | "event.playerNumber"
  | "event.teamName"
  | "event.minute"
  | "event.score"
  | "competition.name"
  | "venue.name";

export interface SceneMetadata {
  title: string;
  description?: string;
  graphicType?: GraphicType;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SceneDimensions { width: number; height: number; unit: "px"; }
export interface SceneBackground { type: "solid" | "gradient" | "transparent"; value: string; }
export interface LayerBinding { key: SceneBindingKey; fallback?: string; format?: BindingFormat; }
export interface ImageCrop { x: number; y: number; width: number; height: number; }

export interface LayerBase {
  id: string; type: LayerType; name: string; visible: boolean; locked: boolean;
  x: number; y: number; width: number; height: number; rotation: number; opacity: number; zIndex: number;
}

export interface TextProperties {
  content: string; fontFamily: string; fontSize: number; fontWeight: FontWeight; fontStyle: FontStyle;
  textAlign: TextAlign; verticalAlign: VerticalAlign; colour: string; lineHeight: number; letterSpacing: number; textTransform: TextTransform;
}
export interface FillStrokeProperties { fill: string; stroke?: string; strokeWidth?: number; }

export interface TextLayer extends LayerBase, TextProperties { type: "text"; }
export interface DataTextLayer extends LayerBase, TextProperties { type: "data-text"; binding: LayerBinding; }
export interface ImageLayer extends LayerBase { type: "image"; src: string; alt: string; objectFit: ObjectFit; objectPosition: string; borderRadius: number; crop?: ImageCrop; binding?: LayerBinding; }
export interface RectangleLayer extends LayerBase, FillStrokeProperties { type: "rectangle"; borderRadius: number; }
export interface EllipseLayer extends LayerBase, FillStrokeProperties { type: "ellipse"; }
export interface LineLayer extends LayerBase { type: "line"; stroke: string; strokeWidth: number; x2: number; y2: number; }
export interface GroupLayer extends LayerBase { type: "group"; children: SceneLayer[]; }
export type SceneLayer = TextLayer | DataTextLayer | ImageLayer | RectangleLayer | EllipseLayer | LineLayer | GroupLayer;

export interface SceneDocument {
  schemaVersion: SceneDocumentVersion; id: string; metadata: SceneMetadata; dimensions: SceneDimensions; background: SceneBackground; layers: SceneLayer[];
}

export interface MatchforgeProject {
  schemaVersion: SceneDocumentVersion; id: string; name: string; sport: "rugby-union"; scenes: SceneDocument[]; activeSceneId: string; createdAt: string; updatedAt: string;
}
export type ProjectDocument = MatchforgeProject;

export interface BindingMatchContext {
  match: { homeTeam: { name: string; shortName: string; logo?: string; score: number }; awayTeam: { name: string; shortName: string; logo?: string; score: number }; clock: string; status: MatchStatus; };
  event?: { type?: GraphicType; playerName?: string; playerNumber?: string | number; teamName?: string; minute?: number; score?: string; };
  competition?: { name?: string };
  venue?: { name?: string };
}
