"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Minus, Plus } from "lucide-react";
import { GraphicCanvas } from "@/components/GraphicCanvas";
import { LiveDashboard } from "@/components/LiveDashboard";
import { SceneQueue } from "@/components/SceneQueue";
import { Sidebar } from "@/components/Sidebar";
import { TemplatePanel } from "@/components/TemplatePanel";
import { Topbar } from "@/components/Topbar";
import { useMatchStore } from "@/store/useMatchStore";

export function MatchforgeApp() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(72);
  const [exporting, setExporting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const tick = useMatchStore((state) => state.tick);
  const clockRunning = useMatchStore((state) => state.clockRunning);

  useEffect(() => {
    if (!clockRunning) return;
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [clockRunning, tick]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 2400);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  async function exportGraphic() {
    if (!canvasRef.current) return;

    setExporting(true);
    try {
      const dataUrl = await toPng(canvasRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#111216",
      });
      const link = document.createElement("a");
      link.download = `matchforge-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setNotice("Graphic exported as PNG");
    } catch (error) {
      console.error(error);
      setNotice("Export failed - try again in Chrome or Edge");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex h-screen min-h-[720px] min-w-[1180px] overflow-hidden bg-[#F4F5F6] text-zinc-950">
      <Sidebar />
      <TemplatePanel />

      <section className="flex min-w-0 flex-1 flex-col">
        <Topbar exporting={exporting} onExport={exportGraphic} />

        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col overflow-auto px-5 py-4 2xl:px-8">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-800">Live Moment / Try</p>
                <p className="mt-0.5 text-[9px] text-zinc-400">
                  Bound to the live match data source
                </p>
              </div>
              <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[9px] font-medium text-zinc-500">
                Auto-save enabled
              </span>
            </div>

            <div className="flex min-h-[520px] flex-1 items-center justify-center rounded-xl border border-zinc-200/80 bg-[#EEF0F2] p-5 shadow-inner">
              <div
                className="w-full max-w-[540px] origin-center transition-transform duration-200"
                style={{ transform: `scale(${zoom / 72})` }}
              >
                <GraphicCanvas ref={canvasRef} />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center">
              <div className="flex h-9 items-center rounded-lg border border-zinc-200 bg-white shadow-sm">
                <button
                  onClick={() => setZoom((value) => Math.max(50, value - 5))}
                  className="grid h-full w-10 place-items-center text-zinc-500 hover:bg-zinc-50"
                  aria-label="Zoom out"
                >
                  <Minus size={13} />
                </button>
                <span className="w-14 text-center text-[10px] font-medium text-zinc-600">{zoom}%</span>
                <button
                  onClick={() => setZoom((value) => Math.min(95, value + 5))}
                  className="grid h-full w-10 place-items-center text-zinc-500 hover:bg-zinc-50"
                  aria-label="Zoom in"
                >
                  <Plus size={13} />
                </button>
                <span className="h-4 w-px bg-zinc-200" />
                <button
                  onClick={() => setZoom(72)}
                  className="h-full px-3 text-[10px] font-medium text-zinc-500 hover:bg-zinc-50"
                >
                  Fit
                </button>
              </div>
            </div>
          </div>

          <SceneQueue />

          {notice && (
            <div className="absolute bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-zinc-950 px-4 py-2.5 text-[11px] font-medium text-white shadow-xl">
              {notice}
            </div>
          )}
        </div>
      </section>

      <LiveDashboard />
    </div>
  );
}
