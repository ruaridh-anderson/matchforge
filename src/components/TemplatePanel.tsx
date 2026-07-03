"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMatchStore } from "@/store/useMatchStore";
import type { GraphicType } from "@/types/match";

const groups: { title: string; items: { type: GraphicType; label: string }[] }[] = [
  {
    title: "Live Moments",
    items: [
      { type: "try", label: "Try" },
      { type: "conversion", label: "Conversion" },
      { type: "penalty", label: "Penalty" },
      { type: "yellow-card", label: "Yellow Card" },
      { type: "red-card", label: "Red Card" },
      { type: "drop-goal", label: "Drop Goal" },
    ],
  },
  {
    title: "Game Status",
    items: [
      { type: "half-time", label: "Half Time" },
      { type: "full-time", label: "Full Time" },
      { type: "kick-off", label: "Kick Off" },
    ],
  },
  {
    title: "Score & Features",
    items: [
      { type: "score-update", label: "Score Update" },
      { type: "try", label: "Try Scorer" },
      { type: "full-time", label: "Match Result" },
    ],
  },
];

export function TemplatePanel() {
  const { activeGraphic, setActiveGraphic, accent } = useMatchStore();

  return (
    <section className="flex h-screen w-[314px] shrink-0 flex-col border-r border-zinc-200 bg-white">
      <div className="flex h-16 items-end gap-7 border-b border-zinc-100 px-5">
        <button className="h-12 border-b-2 border-zinc-950 text-xs font-semibold text-zinc-950">
          Templates
        </button>
        <button className="h-12 text-xs font-medium text-zinc-400">My Designs</button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="mb-5 flex gap-2">
          <label className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-zinc-200 px-3 text-zinc-400 focus-within:border-zinc-400">
            <Search size={14} />
            <input
              className="w-full bg-transparent text-xs text-zinc-700 outline-none placeholder:text-zinc-400"
              placeholder="Search templates..."
            />
          </label>
          <button className="grid size-9 place-items-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50">
            <SlidersHorizontal size={14} />
          </button>
        </div>

        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.title}>
              <div className="mb-2.5 flex items-center justify-between">
                <h2 className="text-[11px] font-semibold text-zinc-900">{group.title}</h2>
                <button className="text-[10px] text-zinc-400 hover:text-zinc-700">View all</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {group.items.map((item, index) => {
                  const selected = activeGraphic.type === item.type && index === 0;
                  return (
                    <button
                      key={`${group.title}-${item.type}-${index}`}
                      onClick={() => setActiveGraphic(item.type)}
                      className={`group relative aspect-[1.68/1] overflow-hidden rounded-lg border text-left transition ${
                        selected
                          ? "border-zinc-950 ring-1 ring-zinc-950"
                          : "border-zinc-200 hover:border-zinc-400"
                      }`}
                      style={{
                        backgroundImage: `radial-gradient(circle at 85% 20%, ${accent}aa, transparent 35%), linear-gradient(135deg, #111216, #241219 70%, #0b0c0e)`,
                      }}
                    >
                      <span
                        className="absolute -right-4 top-1/2 h-12 w-24 -translate-y-1/2 -rotate-12 opacity-60"
                        style={{ background: accent }}
                      />
                      <span className="absolute left-2 top-2 grid size-4 place-items-center rounded bg-white/10 text-[8px] font-black text-white">
                        G
                      </span>
                      <span className="absolute inset-x-2 bottom-2 text-[11px] font-black uppercase leading-none tracking-[-0.03em] text-white">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
