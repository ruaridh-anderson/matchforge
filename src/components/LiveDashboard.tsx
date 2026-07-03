"use client";

import {
  CircleDot,
  Clock3,
  Goal,
  Pause,
  Play,
  RotateCcw,
  ShieldAlert,
  Square,
  TimerReset,
  Trophy,
  Zap,
} from "lucide-react";
import { useMatchStore } from "@/store/useMatchStore";
import type { GraphicType } from "@/types/match";

const actions: {
  type: GraphicType;
  label: string;
  icon: typeof Goal;
  tone?: "danger" | "warning";
}[] = [
  { type: "try", label: "Try", icon: Goal },
  { type: "conversion", label: "Conversion", icon: CircleDot },
  { type: "penalty", label: "Penalty", icon: Zap },
  { type: "drop-goal", label: "Drop Goal", icon: Trophy },
  { type: "yellow-card", label: "Yellow Card", icon: Square, tone: "warning" },
  { type: "red-card", label: "Red Card", icon: ShieldAlert, tone: "danger" },
  { type: "half-time", label: "Half Time", icon: Clock3 },
  { type: "full-time", label: "Full Time", icon: TimerReset },
  { type: "score-update", label: "Score Update", icon: RotateCcw },
];

function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function eventLabel(type: GraphicType) {
  return type
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function LiveDashboard() {
  const {
    home,
    away,
    status,
    elapsedSeconds,
    clockRunning,
    selectedTeam,
    selectedPlayer,
    events,
    accent,
    setSelectedTeam,
    setSelectedPlayer,
    setAccent,
    setClockRunning,
    recordEvent,
    resetMatch,
  } = useMatchStore();

  return (
    <aside className="flex h-screen w-[354px] shrink-0 flex-col border-l border-zinc-200 bg-white">
      <div className="flex h-16 items-end gap-7 border-b border-zinc-100 px-5">
        <button className="h-12 text-xs font-medium text-zinc-400">Design</button>
        <button className="h-12 border-b-2 border-zinc-950 text-xs font-semibold text-zinc-950">
          Dashboard
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="mb-5 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {status === "live" ? "Live Match" : eventLabel(status as GraphicType)}
          </span>
          <button
            onClick={resetMatch}
            className="text-[10px] font-medium text-zinc-400 hover:text-zinc-800"
          >
            Reset
          </button>
        </div>

        <section className="border-b border-zinc-100 pb-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-zinc-900">Match Info</h2>
            <button className="rounded-md border border-zinc-200 px-2 py-1 text-[10px] text-zinc-500 hover:bg-zinc-50">
              Edit
            </button>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="text-center">
              <div className="mx-auto mb-2 grid size-11 place-items-center rounded-xl border border-zinc-200 bg-zinc-50 text-lg font-black">
                {home.monogram}
              </div>
              <p className="truncate text-[9px] font-semibold uppercase tracking-wide text-zinc-600">
                {home.shortName}
              </p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-black tracking-tight text-zinc-950">
                {home.score} <span className="font-light text-zinc-300">-</span> {away.score}
              </p>
              <button
                onClick={() => setClockRunning(!clockRunning)}
                className="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold"
                style={{ color: accent, backgroundColor: `${accent}12` }}
              >
                {clockRunning ? <Pause size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" />}
                {formatClock(elapsedSeconds)}
              </button>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-2 grid size-11 place-items-center rounded-xl border border-zinc-200 bg-zinc-50 text-lg font-black">
                {away.monogram}
              </div>
              <p className="truncate text-[9px] font-semibold uppercase tracking-wide text-zinc-600">
                {away.shortName}
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-100 py-5">
          <h2 className="mb-3 text-xs font-semibold text-zinc-900">Event Context</h2>
          <div className="mb-3 grid grid-cols-2 gap-2 rounded-lg bg-zinc-100 p-1">
            <button
              onClick={() => setSelectedTeam("home")}
              className={`rounded-md px-3 py-2 text-[10px] font-semibold transition ${
                selectedTeam === "home" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500"
              }`}
            >
              {home.shortName}
            </button>
            <button
              onClick={() => setSelectedTeam("away")}
              className={`rounded-md px-3 py-2 text-[10px] font-semibold transition ${
                selectedTeam === "away" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500"
              }`}
            >
              {away.shortName}
            </button>
          </div>
          <input
            value={selectedPlayer}
            onChange={(event) => setSelectedPlayer(event.target.value)}
            placeholder="Player name"
            className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-xs text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500"
          />
          <div className="mt-3 flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2.5">
            <span className="text-[10px] font-medium text-zinc-500">Brand accent</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-zinc-400">{accent}</span>
              <input
                type="color"
                value={accent}
                onChange={(event) => setAccent(event.target.value)}
                className="size-6 cursor-pointer overflow-hidden rounded border-0 bg-transparent p-0"
                aria-label="Brand accent colour"
              />
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-100 py-5">
          <h2 className="mb-3 text-xs font-semibold text-zinc-900">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-2">
            {actions.map(({ type, label, icon: Icon, tone }) => (
              <button
                key={type}
                onClick={() => recordEvent(type)}
                className="group flex min-h-20 flex-col items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 text-[9px] font-medium text-zinc-700 transition hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-sm active:translate-y-0"
              >
                <Icon
                  size={17}
                  strokeWidth={1.6}
                  className={
                    tone === "danger"
                      ? "text-red-500"
                      : tone === "warning"
                        ? "text-amber-500"
                        : "text-zinc-700"
                  }
                />
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => recordEvent("kick-off")}
            className="mt-2 h-10 w-full rounded-lg border border-zinc-200 text-[10px] font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            Start / Resume Match
          </button>
        </section>

        <section className="py-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-zinc-900">Match Events</h2>
            <span className="text-[9px] text-zinc-400">Latest first</span>
          </div>
          <div className="space-y-1">
            {events.length === 0 && (
              <div className="rounded-lg border border-dashed border-zinc-200 py-7 text-center text-[10px] text-zinc-400">
                Match events will appear here.
              </div>
            )}
            {events.map((event) => (
              <div
                key={event.id}
                className="grid grid-cols-[34px_1fr_auto] items-start gap-2 rounded-lg px-2 py-2.5 transition hover:bg-zinc-50"
              >
                <div className="relative flex justify-center">
                  <span
                    className="z-10 grid size-6 place-items-center rounded-full border-2 border-white text-[8px] font-bold text-white shadow-sm"
                    style={{ background: event.team === "away" ? away.primary : accent }}
                  >
                    {event.minute}&apos;
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-zinc-800">{event.label}</p>
                  <p className="truncate text-[9px] text-zinc-400">
                    {event.player || "Match status"}
                  </p>
                </div>
                <span className="rounded bg-zinc-100 px-1.5 py-1 text-[9px] font-semibold text-zinc-600">
                  {event.homeScore} - {event.awayScore}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
