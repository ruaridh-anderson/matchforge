"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { useMatchStore } from "@/store/useMatchStore";
import type { GraphicType } from "@/types/match";

const playerGraphics: GraphicType[] = [
  "try",
  "conversion",
  "penalty",
  "drop-goal",
  "yellow-card",
  "red-card",
];

function displayTitle(type: GraphicType) {
  const titleMap: Record<GraphicType, string> = {
    try: "TRY",
    conversion: "CONVERSION",
    penalty: "PENALTY",
    "drop-goal": "DROP GOAL",
    "yellow-card": "YELLOW CARD",
    "red-card": "RED CARD",
    "half-time": "HALF TIME",
    "full-time": "FULL TIME",
    "score-update": "SCORE UPDATE",
    "kick-off": "KICK OFF",
  };
  return titleMap[type];
}

function TeamBadge({ monogram, label }: { monogram: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-11 place-items-center rounded-xl border border-white/20 bg-white/10 text-lg font-black text-white shadow-lg backdrop-blur">
        {monogram}
      </div>
      <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 sm:block">
        {label}
      </span>
    </div>
  );
}

export const GraphicCanvas = forwardRef<HTMLDivElement>(function GraphicCanvas(
  _,
  ref,
) {
  const { activeGraphic, home, away, accent } = useMatchStore();
  const hasPlayer = playerGraphics.includes(activeGraphic.type);
  const isCard =
    activeGraphic.type === "yellow-card" || activeGraphic.type === "red-card";
  const cardColor = activeGraphic.type === "yellow-card" ? "#F4D43C" : "#EF3340";

  return (
    <div
      ref={ref}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-[3px] bg-[#111216] text-white shadow-[0_28px_90px_rgba(15,18,22,0.22)]"
      style={{
        backgroundImage: `radial-gradient(circle at 72% 28%, ${accent}55 0, transparent 34%), linear-gradient(135deg, #090A0C 0%, #15171B 48%, #090A0C 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      <div className="absolute -left-[12%] top-[34%] h-44 w-[92%] -rotate-[9deg] blur-[1px]" style={{ background: `${accent}cc` }} />
      <div className="absolute -left-[8%] top-[42%] h-12 w-[75%] -rotate-[9deg] bg-white/8" />
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-black via-black/65 to-transparent" />

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-[5.5%]">
        <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/75">
          Netherdale
        </span>
        <div className="grid size-12 place-items-center rounded-2xl border border-white/15 bg-white/10 text-xl font-black backdrop-blur">
          {home.monogram}
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/75">
          Gala Rugby
        </span>
      </header>

      {hasPlayer && (
        <div className="absolute -bottom-[2%] right-[-2%] z-10 h-[82%] w-[58%] opacity-95">
          <Image
            src="/player-silhouette.svg"
            alt="Stylised player silhouette"
            fill
            priority
            className="object-contain object-bottom"
          />
        </div>
      )}

      {isCard && (
        <div
          className="absolute right-[10%] top-[19%] z-10 h-[46%] w-[25%] rotate-[8deg] rounded-xl shadow-[0_35px_80px_rgba(0,0,0,.5)]"
          style={{ background: cardColor }}
        />
      )}

      <main className="absolute inset-x-[7%] top-[19%] z-20">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/60">
          Live match graphic
        </p>
        <h1
          className="max-w-[88%] font-black uppercase leading-[0.82] tracking-[-0.065em] text-white"
          style={{
            fontSize:
              activeGraphic.type === "conversion" ||
              activeGraphic.type === "score-update" ||
              activeGraphic.type === "yellow-card"
                ? "clamp(2.8rem, 7.8vw, 6.2rem)"
                : "clamp(4.5rem, 13vw, 10rem)",
          }}
        >
          {displayTitle(activeGraphic.type)}
        </h1>

        {activeGraphic.player && (
          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.22em] text-white">
              {activeGraphic.player}
            </span>
            <span className="h-px w-10 bg-white/35" />
            <span className="text-sm font-bold text-white/70">
              {activeGraphic.minute}&apos;
            </span>
          </div>
        )}
      </main>

      <footer className="absolute inset-x-[7%] bottom-[6%] z-30">
        <div className="flex items-center justify-between border-y border-white/15 py-4">
          <TeamBadge monogram={home.monogram} label={home.shortName} />
          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className="grid min-w-12 place-items-center rounded-lg px-3 py-2 text-2xl font-black"
              style={{ background: accent }}
            >
              {activeGraphic.homeScore}
            </span>
            <span className="text-xl font-light text-white/55">-</span>
            <span className="grid min-w-12 place-items-center rounded-lg border border-white/20 bg-black/35 px-3 py-2 text-2xl font-black">
              {activeGraphic.awayScore}
            </span>
          </div>
          <TeamBadge monogram={away.monogram} label={away.shortName} />
        </div>
        <p className="mt-5 text-center text-[10px] font-semibold uppercase tracking-[0.42em] text-white/80">
          #UPTHEGALA
        </p>
      </footer>
    </div>
  );
});
