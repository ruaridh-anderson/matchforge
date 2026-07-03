"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMatchStore } from "@/store/useMatchStore";

export function SceneQueue() {
  const { queue, activeGraphic, accent, selectQueuedScene, clearQueue } = useMatchStore();

  return (
    <div className="border-t border-zinc-200 bg-white px-5 py-4">
      <div className="flex items-end gap-3 overflow-x-auto pb-1">
        {queue.map((scene, index) => (
          <button
            key={scene.id}
            onClick={() => selectQueuedScene(scene.id)}
            className="group shrink-0 text-left"
          >
            <div
              className={`relative aspect-[4/5] w-[86px] overflow-hidden rounded-lg border bg-[#111216] transition ${
                activeGraphic.id === scene.id
                  ? "border-zinc-950 ring-1 ring-zinc-950"
                  : "border-zinc-200 hover:border-zinc-400"
              }`}
              style={{
                backgroundImage: `radial-gradient(circle at 75% 25%, ${accent}aa, transparent 35%), linear-gradient(145deg, #111216, #210f15)`,
              }}
            >
              <span className="absolute left-2 top-2 text-[7px] font-bold uppercase tracking-[0.2em] text-white/55">
                Scene {index + 1}
              </span>
              <span className="absolute inset-x-2 top-[38%] text-[13px] font-black uppercase leading-[0.85] tracking-[-0.06em] text-white">
                {scene.title}
              </span>
              <span className="absolute bottom-2 left-2 text-[8px] font-bold text-white/70">
                {scene.homeScore}-{scene.awayScore}
              </span>
            </div>
            <p className="mt-1.5 text-center text-[9px] text-zinc-500">{index + 1}</p>
          </button>
        ))}

        <button className="grid aspect-[4/5] w-[86px] shrink-0 place-items-center rounded-lg border border-dashed border-zinc-300 text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-700">
          <Plus size={18} />
        </button>

        <button
          onClick={clearQueue}
          className="ml-auto flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-[10px] font-medium text-zinc-400 transition hover:bg-zinc-50 hover:text-zinc-700"
        >
          <Trash2 size={13} /> Clear Queue
        </button>
      </div>
    </div>
  );
}
