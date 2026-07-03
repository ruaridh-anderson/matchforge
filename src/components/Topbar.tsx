"use client";

import { Check, ChevronDown, Cloud, Download, Redo2, Share2, Undo2 } from "lucide-react";

interface TopbarProps {
  exporting: boolean;
  onExport: () => void;
}

export function Topbar({ exporting, onExport }: TopbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center border-b border-zinc-200 bg-white px-5">
      <div className="flex min-w-0 items-center gap-3">
        <h1 className="text-sm font-semibold tracking-tight text-zinc-950">Matchforge</h1>
        <span className="h-5 w-px bg-zinc-200" />
        <button className="flex items-center gap-2 truncate text-xs font-medium text-zinc-700">
          Gala RFC vs Boroughmuir RFC <ChevronDown size={13} className="text-zinc-400" />
        </button>
        <span className="ml-3 hidden text-[10px] text-zinc-400 xl:inline">1080 × 1350</span>
        <button className="hidden rounded-md border border-zinc-200 px-2 py-1.5 text-[9px] font-medium text-zinc-500 hover:bg-zinc-50 xl:inline">
          Resize
        </button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="grid size-8 place-items-center rounded-lg text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700">
          <Undo2 size={15} />
        </button>
        <button className="grid size-8 place-items-center rounded-lg text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700">
          <Redo2 size={15} />
        </button>
        <span className="mx-1 h-5 w-px bg-zinc-200" />
        <span className="hidden items-center gap-1.5 text-[10px] text-zinc-500 lg:flex">
          <Cloud size={13} /> Saved <Check size={11} className="text-emerald-500" />
        </span>
        <button className="ml-2 hidden h-9 items-center gap-2 rounded-lg border border-zinc-200 px-3 text-[10px] font-semibold text-zinc-700 hover:bg-zinc-50 lg:flex">
          <Share2 size={13} /> Share
        </button>
        <button
          onClick={onExport}
          disabled={exporting}
          className="flex h-9 items-center gap-2 rounded-lg bg-[#11161B] px-4 text-[10px] font-semibold text-white shadow-sm transition hover:bg-black disabled:cursor-wait disabled:opacity-60"
        >
          <Download size={13} /> {exporting ? "Exporting..." : "Export PNG"}
        </button>
      </div>
    </header>
  );
}
