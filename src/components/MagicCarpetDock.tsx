import React from "react";
import { 
  Search, Camera, Bookmark, ShoppingBag, ShieldCheck, Compass, 
  Puzzle, Layers, Sparkles, Wind, LayoutGrid, Columns, Maximize2,
  Minimize2, Zap, ArrowRight, Eye, RefreshCw
} from "lucide-react";
import { PipelineStage } from "./PipelineStreamBar";

export type FlightFormation = "solo" | "dual" | "tiled" | "free";

export interface ActiveCarpetState {
  id: PipelineStage;
  isOpen: boolean;
  isMinimized: boolean;
  isFullscreen: boolean;
  zIndex: number;
}

interface MagicCarpetDockProps {
  carpets: Record<PipelineStage, ActiveCarpetState>;
  onToggleCarpet: (id: PipelineStage) => void;
  onSetFormation: (formation: FlightFormation) => void;
  currentFormation: FlightFormation;
  isBreezeFloating: boolean;
  onToggleBreeze: () => void;
  trackedCount: number;
  inHandCount: number;
  activeStageId?: PipelineStage;
}

export default function MagicCarpetDock({
  carpets,
  onToggleCarpet,
  onSetFormation,
  currentFormation,
  isBreezeFloating,
  onToggleBreeze,
  trackedCount,
  inHandCount,
  activeStageId
}: MagicCarpetDockProps) {
  const dockItems: Array<{
    id: PipelineStage;
    name: string;
    shortName: string;
    step?: string;
    icon: React.ElementType;
    badge?: string;
    accent: string;
    glow: string;
  }> = [
    {
      id: "scout",
      name: "Scout & Radar",
      shortName: "Scout",
      step: "01",
      icon: Search,
      badge: "Sleeper AI",
      accent: "text-amber-400",
      glow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:border-amber-400/60"
    },
    {
      id: "appraise",
      name: "Optical Appraisal",
      shortName: "Appraisal",
      step: "02",
      icon: Camera,
      badge: "Vision",
      accent: "text-indigo-400",
      glow: "hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:border-indigo-400/60"
    },
    {
      id: "bid",
      name: "Bidding Terminal",
      shortName: "Bidding",
      step: "03",
      icon: Bookmark,
      badge: `${trackedCount} Active`,
      accent: "text-sky-400",
      glow: "hover:shadow-[0_0_20px_rgba(14,165,233,0.35)] hover:border-sky-400/60"
    },
    {
      id: "liquidate",
      name: "Store & Vault",
      shortName: "Store",
      step: "04",
      icon: ShoppingBag,
      badge: `${inHandCount} Items`,
      accent: "text-emerald-400",
      glow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:border-emerald-400/60"
    },
    {
      id: "hallmark",
      name: "Hallmark Loupe",
      shortName: "Loupe",
      icon: ShieldCheck,
      accent: "text-amber-300",
      glow: "hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:border-amber-400/50"
    },
    {
      id: "route",
      name: "Route Logistics",
      shortName: "Route",
      icon: Compass,
      accent: "text-indigo-300",
      glow: "hover:shadow-[0_0_20px_rgba(129,140,248,0.3)] hover:border-indigo-400/50"
    },
    {
      id: "workbench",
      name: "Puzzle Studio",
      shortName: "Studio",
      icon: Puzzle,
      accent: "text-purple-300",
      glow: "hover:shadow-[0_0_20px_rgba(192,132,252,0.3)] hover:border-purple-400/50"
    },
    {
      id: "taxonomy",
      name: "Taxonomies",
      shortName: "Matrix",
      icon: Layers,
      accent: "text-rose-300",
      glow: "hover:shadow-[0_0_20px_rgba(251,113,133,0.3)] hover:border-rose-400/50"
    }
  ];

  return (
    <div className="fixed bottom-4 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
      {/* Floating Curved Glass Magic Carpet Dock */}
      <div className="pointer-events-auto bg-[#0b0e14]/90 backdrop-blur-2xl border border-white/10 rounded-full px-3 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_1px_1px_rgba(255,255,255,0.08)] flex items-center gap-1 sm:gap-2 max-w-full overflow-x-auto carpet-scroll">
        
        {/* Left Flight Formation Presets */}
        <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
          <button
            type="button"
            onClick={() => onSetFormation("solo")}
            className={`p-2 rounded-full transition-all text-xs flex items-center gap-1 ${
              currentFormation === "solo"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
            title="Solo Flight: Focus on single grand carpet"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span className="text-[10px] font-mono hidden xl:inline">Solo</span>
          </button>

          <button
            type="button"
            onClick={() => onSetFormation("dual")}
            className={`p-2 rounded-full transition-all text-xs flex items-center gap-1 ${
              currentFormation === "dual"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
            title="Dual Flight: Side-by-side carpets (Scout & Appraisal tandem)"
          >
            <Columns className="h-3.5 w-3.5" />
            <span className="text-[10px] font-mono hidden xl:inline">Dual</span>
          </button>

          <button
            type="button"
            onClick={() => onSetFormation("tiled")}
            className={`p-2 rounded-full transition-all text-xs flex items-center gap-1 ${
              currentFormation === "tiled"
                ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
            title="Tiled Orbit: 4-Stage Arbitrage Flow floating in tandem"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="text-[10px] font-mono hidden xl:inline">Orbit</span>
          </button>

          <button
            type="button"
            onClick={onToggleBreeze}
            className={`p-2 rounded-full transition-all text-xs flex items-center gap-1 ${
              isBreezeFloating
                ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                : "text-slate-500 hover:text-slate-300"
            }`}
            title={isBreezeFloating ? "Levitation Breeze: Active (Click to Anchor all carpets)" : "Levitation Breeze: Anchored (Click to Float)"}
          >
            <Wind className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Carpet Runes (Click to summon or send to sky) */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {dockItems.map((item) => {
            const Icon = item.icon;
            const carpet = carpets[item.id];
            const isOpen = carpet?.isOpen;
            const isActive = activeStageId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggleCarpet(item.id)}
                className={`group relative px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 border shrink-0 ${item.glow} ${
                  isOpen
                    ? "bg-slate-900 text-slate-100 border-white/25 shadow-lg"
                    : "bg-slate-950/60 text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-900/60"
                } ${isActive ? "ring-1 ring-amber-400/60" : ""}`}
                title={`Click to summon or tuck ${item.name} carpet`}
              >
                {/* Floating carpet indicator thread */}
                {isOpen && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-3.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                )}

                <div className={`p-1 rounded-full ${isOpen ? item.accent : "text-slate-500 group-hover:text-slate-400"}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>

                <span className={`text-[11px] font-semibold hidden md:inline ${isOpen ? "text-slate-200" : "text-slate-500 group-hover:text-slate-300"}`}>
                  {item.shortName}
                </span>

                {item.step && (
                  <span className={`text-[9px] font-bold px-1 rounded ${
                    isOpen ? "bg-white/10 text-slate-300" : "bg-slate-900 text-slate-600"
                  }`}>
                    {item.step}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
