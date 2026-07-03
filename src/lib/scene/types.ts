import type { GraphicType, MatchStatus } from "@/types/match";

export type SceneDocumentVersion = 1;
export type LayerType = "text" | "data-text" | "image" | "shape";
export type TextAlign = "left" | "center" | "right";
export type FontWeight = 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type ShapeKind = "rectangle" | "ellipse" | "line";
export type DataBindingKey =
  | "homeTeamName"
  | "awayTeamName"
  | "homeScore"
  | "awayScore"
  | "playerName"
  | "eventMinute"
  | "matchStatus";

export interface MatchDataBindings {
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  playerName?: string;
  eventMinute?: number;
  matchStatus: MatchStatus;
}

export interface LayerBase {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
}

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: FontWeight;
  align: TextAlign;
  color: string;
  lineHeight: number;
  letterSpacing: number;
}

export interface TextLayer extends LayerBase, TextStyle {
  type: "text";
  content: string;
}

export interface DataTextLayer extends LayerBase, TextStyle {
  type: "data-text";
  binding: DataBindingKey;
  fallback: string;
  format?: "plain" | "score" | "minute" | "uppercase";
}

export interface ImageLayer extends LayerBase {
  type: "image";
  src: string;
  alt: string;
  objectFit: "cover" | "contain" | "fill";
}

export interface ShapeLayer extends LayerBase {
  type: "shape";
  shape: ShapeKind;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  radius?: number;
}

export type SceneLayer = TextLayer | DataTextLayer | ImageLayer | ShapeLayer;

export interface SceneDocument {
  id: string;
  name: string;
  graphicType: GraphicType;
  width: number;
  height: number;
  background: string;
  layers: SceneLayer[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDocument {
  schemaVersion: SceneDocumentVersion;
  id: string;
  name: string;
  sport: "rugby-union";
  scenes: SceneDocument[];
  activeSceneId: string;
  createdAt: string;
  updatedAt: string;
}
