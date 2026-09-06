import React from "react";
import { 
  Search, Camera, Bookmark, ShoppingBag, ShieldCheck, Compass, Puzzle, Layers,
  ArrowRight, Sparkles, CheckCircle2, ChevronRight, HelpCircle, Eye, Zap, Flame
} from "lucide-react";
import { TrackedItem } from "../types";

export type PipelineStage = 
  | "scout"          // 01. Scout & Source (AuctionSitesHub)
  | "appraise"       // 02. Optical Appraisal (ItemAnalysis)
  | "bid"            // 03. Bid & Secure (InventoryBiddingCenter)
  | "liquidate"      // 04. List & Liquidate (StoreListingStudio)
  | "hallmark"       // Field Kit: Hallmark Decoder
  | "route"          // Field Kit: Route Logistics
  | "workbench"      // Field Kit: Studio Workbench
  | "taxonomy";      // Field Kit: Niche Taxonomies

interface PipelineStreamBarProps {
  currentStage: PipelineStage;
  onSelectStage: (stage: PipelineStage) => void;
  trackedItems: TrackedItem[];
  watchlistCount?: number;
  onToggleGuide: () => void;
  isGuideOpen: boolean;
}

export default function PipelineStreamBar({
  currentStage,
  onSelectStage,
  trackedItems,
  watchlistCount = 4,
  onToggleGuide,
  isGuideOpen
}: PipelineStreamBarProps) {
  // Compute counts for the pipeline nodes
  const biddingActiveCount = trackedItems.filter((i) => i.status === "bidding" || i.status === "watching").length;
  const wonPendingCount = trackedItems.filter((i) => i.status === "won_pending").length;
  const inHandInventoryCount = trackedItems.filter((i) => i.status === "inventory_in_hand").length;

  const isFieldKitActive = ["hallmark", "route", "workbench", "taxonomy"].includes(currentStage);

  const stages = [
    {
      id: "scout" as PipelineStage,
      step: "01",
      name: "Scout & Radar",
      sub: "CTBids, HiBid & Estate Sleepers",
      icon: Search,
      badgeText: `${watchlistCount} Lots Scanned`,
      accentColor: "amber",
      borderColor: "border-amber-500/40",
      activeBg: "bg-amber-500/15 text-amber-300",
      dotColor: "bg-amber-400"
    },
    {
      id: "appraise" as PipelineStage,
      step: "02",
      name: "Optical Appraisal",
      sub: "Vision AI, Hallmarks & Comps",
      icon: Camera,
      badgeText: "Multimodal AI",
      accentColor: "indigo",
      borderColor: "border-indigo-500/40",
      activeBg: "bg-indigo-500/15 text-indigo-300",
      dotColor: "bg-indigo-400"
    },
    {
      id: "bid" as PipelineStage,
      step: "03",
      name: "Bidding Terminal",
      sub: "Odd-Number Sniper & Cap Rules",
      icon: Bookmark,
      badgeText: `${biddingActiveCount} Active • ${wonPendingCount} Won`,
      accentColor: "cyan",
      borderColor: "border-sky-500/40",
      activeBg: "bg-sky-500/15 text-sky-300",
      dotColor: "bg-sky-400"
    },
    {
      id: "liquidate" as PipelineStage,
      step: "04",
      name: "Vault & Commerce",
      sub: "Multi-Channel Cross-Lister",
      icon: ShoppingBag,
      badgeText: `${inHandInventoryCount} In-Hand Items`,
      accentColor: "emerald",
      borderColor: "border-emerald-500/40",
      activeBg: "bg-emerald-500/15 text-emerald-300",
      dotColor: "bg-emerald-400"
    }
  ];

  const fieldKitTools = [
    { id: "hallmark" as PipelineStage, name: "Hallmark Loupe", icon: ShieldCheck, desc: "Maker Marks & Silver" },
    { id: "route" as PipelineStage, name: "Route Logistics", icon: Compass, desc: "Drive Time & Clusters" },
    { id: "workbench" as PipelineStage, name: "Puzzle Studio", icon: Puzzle, desc: "Specialist Sandbox" },
    { id: "taxonomy" as PipelineStage, name: "Taxonomies", icon: Layers, desc: "Comps Matrix & Guide" }
  ];

  return (
    <div className="space-y-3">
      {/* Primary 4-Stage Arbitrage Pipeline River */}
      <div className="bg-[#0e131a] rounded-2xl border border-slate-850 p-2 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow beam */}
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-2">
          {/* 4 Connected Pipeline Stages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 flex-1">
            {stages.map((st, idx) => {
              const Icon = st.icon;
              const isActive = currentStage === st.id;

              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onSelectStage(st.id)}
                  className={`relative p-3.5 rounded-xl text-left transition-all flex flex-col justify-between border group ${
                    isActive
                      ? `${st.activeBg} ${st.borderColor} shadow-lg shadow-black/40 ring-1 ring-inset ring-white/10`
                      : "bg-slate-950/70 border-slate-900 hover:border-slate-800 hover:bg-slate-900/60 text-slate-400"
                  }`}
                >
                  {/* Top node info */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded ${
                        isActive ? "bg-white/10 text-white" : "bg-slate-900 text-slate-500 group-hover:text-slate-400"
                      }`}>
                        {st.step}
                      </span>
                      <Icon className={`h-4 w-4 ${isActive ? "text-current" : "text-slate-500 group-hover:text-slate-300"}`} />
                    </div>

                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                      isActive 
                        ? "bg-black/30 border-current font-bold" 
                        : "bg-slate-900/80 border-slate-800 text-slate-500"
                    }`}>
                      {st.badgeText}
                    </span>
                  </div>

                  {/* Stage titles */}
                  <div>
                    <div className={`text-xs font-display font-bold tracking-tight ${
                      isActive ? "text-slate-100" : "text-slate-300 group-hover:text-slate-100"
                    }`}>
                      {st.name}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate font-sans">
                      {st.sub}
                    </div>
                  </div>

                  {/* Flow Arrow for connecting pipeline */}
                  {idx < stages.length - 1 && (
                    <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-slate-900 border border-slate-800 items-center justify-center text-slate-500 pointer-events-none">
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right action: Workflow Flow Explainer Toggle */}
          <div className="flex lg:flex-col justify-end lg:justify-center items-center gap-2 px-2 shrink-0">
            <button
              type="button"
              onClick={onToggleGuide}
              className={`py-2 px-3 rounded-xl border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all w-full lg:w-auto justify-center ${
                isGuideOpen
                  ? "bg-indigo-600/30 text-indigo-300 border-indigo-500/50 shadow-md"
                  : "bg-slate-950 text-slate-400 border-slate-850 hover:border-slate-700 hover:text-slate-200"
              }`}
              title="Learn how all four layers connect into one seamless arbitrage loop"
            >
              <HelpCircle className="h-3.5 w-3.5 text-indigo-400" />
              <span>{isGuideOpen ? "Close Flow Guide" : "Why This Flow?"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Specialist Field Kit Drawer / Secondary Instruments */}
      <div className="bg-[#0b0e14] rounded-xl border border-slate-900 px-3.5 py-2 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1 font-bold">
            <Eye className="h-3 w-3 text-amber-400" /> Specialist Field Instruments:
          </span>
          <span className="text-[11px] text-slate-600 hidden sm:inline">•</span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Auxiliary diagnostics to verify maker marks, plan pickup routes, or browse categories
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {fieldKitTools.map((tool) => {
            const Icon = tool.icon;
            const isToolActive = currentStage === tool.id;

            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => onSelectStage(tool.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 border ${
                  isToolActive
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold shadow-md shadow-amber-500/10"
                    : "bg-slate-950 text-slate-400 border-slate-850 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isToolActive ? "text-amber-400" : "text-slate-500"}`} />
                <span>{tool.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
