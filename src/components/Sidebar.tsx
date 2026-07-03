"use client";

import Image from "next/image";
import {
  Boxes,
  CircleHelp,
  Frame,
  ImageIcon,
  Layers3,
  LayoutDashboard,
  Palette,
  Plus,
  Settings,
  Shield,
  Type,
  Users,
} from "lucide-react";

const designItems = [
  { label: "Templates", icon: Frame },
  { label: "Elements", icon: Boxes },
  { label: "Text", icon: Type },
  { label: "Images", icon: ImageIcon },
  { label: "My Library", icon: Layers3 },
  { label: "Brand Kit", icon: Palette },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-[174px] shrink-0 flex-col border-r border-white/8 bg-[#11161B] text-white">
      <div className="flex h-16 items-center px-4">
        <Image
          src="/matchforge-mark.svg"
          alt="Matchforge"
          width={38}
          height={38}
          className="text-white invert"
        />
      </div>

      <div className="px-3 pb-4">
        <button className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.035] text-xs font-medium transition hover:bg-white/[0.07]">
          <Plus size={15} /> Create New
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        <p className="px-3 pb-2 pt-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
          Design
        </p>
        {designItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-xs text-white/65 transition hover:bg-white/[0.05] hover:text-white"
          >
            <Icon size={16} strokeWidth={1.7} /> {label}
          </button>
        ))}

        <p className="px-3 pb-2 pt-5 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
          Live
        </p>
        <button className="flex h-10 w-full items-center gap-3 rounded-lg bg-white/[0.08] px-3 text-left text-xs font-medium text-white">
          <LayoutDashboard size={16} /> Dashboard
          <span className="ml-auto size-1.5 rounded-full bg-[#D73154]" />
        </button>
        <button className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-xs text-white/65 transition hover:bg-white/[0.05] hover:text-white">
          <Shield size={16} /> Scoreboard
        </button>

        <p className="px-3 pb-2 pt-5 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
          Workspace
        </p>
        <button className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-xs text-white/65 transition hover:bg-white/[0.05] hover:text-white">
          <Users size={16} /> Teams
        </button>
        <button className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-xs text-white/65 transition hover:bg-white/[0.05] hover:text-white">
          <Settings size={16} /> Settings
        </button>
      </nav>

      <div className="border-t border-white/8 p-3">
        <button className="mb-3 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-xs text-white/60 hover:bg-white/[0.05]">
          <CircleHelp size={16} /> Help
        </button>
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.035] p-2">
          <div className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-zinc-300 to-zinc-600 text-xs font-bold text-zinc-950">
            RA
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold">Ruaridh A.</p>
            <p className="text-[10px] text-white/40">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
