export type TeamSide = "home" | "away";

export type GraphicType =
  | "try"
  | "conversion"
  | "penalty"
  | "drop-goal"
  | "yellow-card"
  | "red-card"
  | "half-time"
  | "full-time"
  | "score-update"
  | "kick-off";

export type MatchStatus = "pre-match" | "live" | "half-time" | "full-time";

export interface Team {
  name: string;
  shortName: string;
  score: number;
  primary: string;
  secondary: string;
  monogram: string;
}

export interface MatchEvent {
  id: string;
  type: GraphicType;
  minute: number;
  team: TeamSide | null;
  player?: string;
  label: string;
  homeScore: number;
  awayScore: number;
  createdAt: number;
}

export interface GraphicScene {
  id: string;
  type: GraphicType;
  title: string;
  subtitle: string;
  player?: string;
  minute?: number;
  homeScore: number;
  awayScore: number;
  createdAt: number;
}
