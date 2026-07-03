"use client";

import { create } from "zustand";
import type {
  GraphicScene,
  GraphicType,
  MatchEvent,
  MatchStatus,
  Team,
  TeamSide,
} from "@/types/match";
import { commitHistory, createHistory, redoHistory, undoHistory, type HistoryState } from "@/lib/scene/history";
import { getTemplateForGraphic, sampleProjectDocument } from "@/lib/scene/templates";
import type { ProjectDocument, SceneDocument, SceneLayer } from "@/lib/scene/types";
import { addLayer, duplicateLayer, removeLayer, reorderLayer, toggleLayerLocked, toggleLayerVisibility, updateLayer } from "@/lib/scene/operations";

const pointsFor: Partial<Record<GraphicType, number>> = {
  try: 5,
  conversion: 2,
  penalty: 3,
  "drop-goal": 3,
};

const labels: Record<GraphicType, string> = {
  try: "Try",
  conversion: "Conversion",
  penalty: "Penalty",
  "drop-goal": "Drop goal",
  "yellow-card": "Yellow card",
  "red-card": "Red card",
  "half-time": "Half time",
  "full-time": "Full time",
  "score-update": "Score update",
  "kick-off": "Kick off",
};

const initialHome: Team = {
  name: "Gala RFC",
  shortName: "GALA",
  score: 14,
  primary: "#7A1630",
  secondary: "#F5F0F1",
  monogram: "G",
};

const initialAway: Team = {
  name: "Boroughmuir RFC",
  shortName: "BOR",
  score: 14,
  primary: "#2B5278",
  secondary: "#EAF1F7",
  monogram: "B",
};

const seededEvents: MatchEvent[] = [
  {
    id: "event-52",
    type: "try",
    minute: 52,
    team: "home",
    player: "M. Fotheringham",
    label: "Try",
    homeScore: 12,
    awayScore: 14,
    createdAt: Date.now() - 900_000,
  },
  {
    id: "event-53",
    type: "conversion",
    minute: 53,
    team: "home",
    player: "J. Anderson",
    label: "Conversion",
    homeScore: 14,
    awayScore: 14,
    createdAt: Date.now() - 840_000,
  },
];

interface MatchStore {
  home: Team;
  away: Team;
  status: MatchStatus;
  elapsedSeconds: number;
  clockRunning: boolean;
  selectedTeam: TeamSide;
  selectedPlayer: string;
  accent: string;
  activeGraphic: GraphicScene;
  events: MatchEvent[];
  queue: GraphicScene[];
  sceneProject: ProjectDocument;
  sceneHistory: HistoryState<SceneDocument>;
  selectedLayerId: string | null;
  selectScene: (sceneId: string) => void;
  selectLayer: (layerId: string | null) => void;
  addSceneLayer: (layer: SceneLayer) => void;
  updateSceneLayer: (layerId: string, patch: Partial<SceneLayer>) => void;
  removeSceneLayer: (layerId: string) => void;
  duplicateSceneLayer: (layerId: string) => void;
  reorderSceneLayer: (layerId: string, zIndex: number) => void;
  toggleSceneLayerVisibility: (layerId: string) => void;
  toggleSceneLayerLocked: (layerId: string) => void;
  undoScene: () => void;
  redoScene: () => void;
  setSelectedTeam: (team: TeamSide) => void;
  setSelectedPlayer: (player: string) => void;
  setAccent: (accent: string) => void;
  setClockRunning: (running: boolean) => void;
  tick: () => void;
  setActiveGraphic: (type: GraphicType) => void;
  recordEvent: (type: GraphicType) => void;
  selectQueuedScene: (id: string) => void;
  clearQueue: () => void;
  resetMatch: () => void;
  applyLocalMatch: (homePatch: Partial<Team>, awayPatch: Partial<Team>) => void;
}

function sceneFrom(
  type: GraphicType,
  home: Team,
  away: Team,
  selectedPlayer: string,
  elapsedSeconds: number,
): GraphicScene {
  const minute = Math.max(1, Math.floor(elapsedSeconds / 60));
  const playerTypes: GraphicType[] = [
    "try",
    "conversion",
    "penalty",
    "drop-goal",
    "yellow-card",
    "red-card",
  ];

  return {
    id: `scene-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    title: labels[type],
    subtitle:
      type === "kick-off"
        ? `${home.name} v ${away.name}`
        : type === "half-time" || type === "full-time" || type === "score-update"
          ? `${home.score} - ${away.score}`
          : home.name,
    player: playerTypes.includes(type) ? selectedPlayer || "Player name" : undefined,
    minute,
    homeScore: home.score,
    awayScore: away.score,
    createdAt: Date.now(),
  };
}

const initialScene = sceneFrom(
  "try",
  initialHome,
  initialAway,
  "Craig Keddie",
  67 * 60 + 23,
);
const initialSceneDocument = getTemplateForGraphic(initialScene.type);

export const useMatchStore = create<MatchStore>((set, get) => ({
  home: initialHome,
  away: initialAway,
  status: "live",
  elapsedSeconds: 67 * 60 + 23,
  clockRunning: false,
  selectedTeam: "home",
  selectedPlayer: "Craig Keddie",
  accent: "#8F1738",
  activeGraphic: initialScene,
  events: seededEvents,
  queue: [initialScene],
  sceneProject: sampleProjectDocument,
  sceneHistory: createHistory(initialSceneDocument),
  selectedLayerId: null,

  selectScene: (sceneId) => {
    const state = get();
    const scene = state.sceneProject.scenes.find((item) => item.id === sceneId);
    if (scene) set({ sceneProject: { ...state.sceneProject, activeSceneId: sceneId }, sceneHistory: commitHistory(state.sceneHistory, scene), selectedLayerId: null });
  },
  selectLayer: (selectedLayerId) => set({ selectedLayerId }),
  addSceneLayer: (layer) => set((state) => ({ sceneHistory: commitHistory(state.sceneHistory, addLayer(state.sceneHistory.present, layer)), selectedLayerId: layer.id })),
  updateSceneLayer: (layerId, patch) => set((state) => ({ sceneHistory: commitHistory(state.sceneHistory, updateLayer(state.sceneHistory.present, layerId, patch)) })),
  removeSceneLayer: (layerId) => set((state) => ({ sceneHistory: commitHistory(state.sceneHistory, removeLayer(state.sceneHistory.present, layerId)), selectedLayerId: state.selectedLayerId === layerId ? null : state.selectedLayerId })),
  duplicateSceneLayer: (layerId) => set((state) => ({ sceneHistory: commitHistory(state.sceneHistory, duplicateLayer(state.sceneHistory.present, layerId)) })),
  reorderSceneLayer: (layerId, zIndex) => set((state) => ({ sceneHistory: commitHistory(state.sceneHistory, reorderLayer(state.sceneHistory.present, layerId, zIndex)) })),
  toggleSceneLayerVisibility: (layerId) => set((state) => ({ sceneHistory: commitHistory(state.sceneHistory, toggleLayerVisibility(state.sceneHistory.present, layerId)) })),
  toggleSceneLayerLocked: (layerId) => set((state) => ({ sceneHistory: commitHistory(state.sceneHistory, toggleLayerLocked(state.sceneHistory.present, layerId)) })),

  undoScene: () => set((state) => ({ sceneHistory: undoHistory(state.sceneHistory) })),
  redoScene: () => set((state) => ({ sceneHistory: redoHistory(state.sceneHistory) })),

  setSelectedTeam: (selectedTeam) => set({ selectedTeam }),
  setSelectedPlayer: (selectedPlayer) => set({ selectedPlayer }),
  setAccent: (accent) => set({ accent }),
  setClockRunning: (clockRunning) => set({ clockRunning }),
  tick: () =>
    set((state) => ({
      elapsedSeconds: state.clockRunning
        ? Math.min(state.elapsedSeconds + 1, 99 * 60 + 59)
        : state.elapsedSeconds,
    })),

  setActiveGraphic: (type) => {
    const state = get();
    const activeGraphic = sceneFrom(
      type,
      state.home,
      state.away,
      state.selectedPlayer,
      state.elapsedSeconds,
    );
    const sceneDocument = getTemplateForGraphic(type);
    set({
      activeGraphic,
      sceneProject: { ...state.sceneProject, activeSceneId: sceneDocument.id },
      sceneHistory: commitHistory(state.sceneHistory, sceneDocument),
    });
  },

  recordEvent: (type) => {
    const state = get();
    const side = state.selectedTeam;
    const points = pointsFor[type] ?? 0;
    const nextHome = {
      ...state.home,
      score: state.home.score + (side === "home" ? points : 0),
    };
    const nextAway = {
      ...state.away,
      score: state.away.score + (side === "away" ? points : 0),
    };
    const minute = Math.max(1, Math.floor(state.elapsedSeconds / 60));

    let status = state.status;
    let clockRunning = state.clockRunning;
    if (type === "kick-off") {
      status = "live";
      clockRunning = true;
    }
    if (type === "half-time") {
      status = "half-time";
      clockRunning = false;
    }
    if (type === "full-time") {
      status = "full-time";
      clockRunning = false;
    }

    const scene = sceneFrom(
      type,
      nextHome,
      nextAway,
      state.selectedPlayer,
      state.elapsedSeconds,
    );

    const event: MatchEvent = {
      id: `event-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type,
      minute,
      team:
        type === "half-time" || type === "full-time" || type === "score-update"
          ? null
          : side,
      player:
        type === "half-time" || type === "full-time" || type === "score-update"
          ? undefined
          : state.selectedPlayer,
      label: labels[type],
      homeScore: nextHome.score,
      awayScore: nextAway.score,
      createdAt: Date.now(),
    };

    set({
      home: nextHome,
      away: nextAway,
      status,
      clockRunning,
      activeGraphic: scene,
      events: [event, ...state.events].slice(0, 30),
      queue: [...state.queue, scene].slice(-8),
      sceneProject: { ...state.sceneProject, activeSceneId: getTemplateForGraphic(type).id },
      sceneHistory: commitHistory(state.sceneHistory, getTemplateForGraphic(type)),
    });
  },

  selectQueuedScene: (id) => {
    const scene = get().queue.find((item) => item.id === id);
    if (scene) {
      const sceneDocument = getTemplateForGraphic(scene.type);
      const state = get();
      set({
        activeGraphic: scene,
        sceneProject: { ...state.sceneProject, activeSceneId: sceneDocument.id },
        sceneHistory: commitHistory(state.sceneHistory, sceneDocument),
      });
    }
  },

  clearQueue: () => set({ queue: [] }),

  applyLocalMatch: (homePatch, awayPatch) => set((state) => ({ home: { ...state.home, ...homePatch }, away: { ...state.away, ...awayPatch } })),

  resetMatch: () => {
    const scene = sceneFrom("kick-off", initialHome, initialAway, "", 0);
    set({
      home: { ...initialHome, score: 0 },
      away: { ...initialAway, score: 0 },
      status: "pre-match",
      elapsedSeconds: 0,
      clockRunning: false,
      selectedTeam: "home",
      selectedPlayer: "",
      activeGraphic: scene,
      events: [],
      queue: [scene],
      sceneProject: { ...sampleProjectDocument, activeSceneId: getTemplateForGraphic("score-update").id },
      sceneHistory: createHistory(getTemplateForGraphic("score-update")),
    });
  },
}));
