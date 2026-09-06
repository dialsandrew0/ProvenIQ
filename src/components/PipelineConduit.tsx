import React from "react";
import { 
  ArrowRight, Camera, Bookmark, ShoppingBag, ShieldCheck, 
  ExternalLink, DollarSign, Sparkles, X, CheckCircle2 
} from "lucide-react";
import { PipelineStage } from "./PipelineStreamBar";

export interface InFlightItem {
  id: string;
  title: string;
  imageUrl?: string;
  category?: string;
  source?: string;
  estValue?: number;
  currentBid?: number;
  targetMaxBid?: number;
  notes?: string;
  stageOriginated: PipelineStage;
}

interface PipelineConduitProps {
  item: InFlightItem | null;
  currentStage: PipelineStage;
  onNavigateToStage: (stage: PipelineStage) => void;
  onClearItem: () => void;
}

export default function PipelineConduit({
  item,
  currentStage,
  onNavigateToStage,
  onClearItem
}: PipelineConduitProps) {
  if (!item) return null;

  const profitGap = Math.max(0, (item.estValue || 0) - (item.targetMaxBid || item.currentBid || 0));

  return (
    <div className="bg-gradient-to-r from-amber-950/40 via-[#111722] to-indigo-950/40 border border-amber-500/30 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
      {/* Top indicator bar */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-2.5 mb-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-extrabold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Pipeline Subject in Flight
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] font-mono text-slate-400">
            Originated in <strong className="text-slate-200 capitalize">{item.stageOriginated}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {profitGap > 0 && (
            <span className="text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> Profit Potential: +${profitGap}
            </span>
          )}
          <button
            type="button"
            onClick={onClearItem}
            className="text-slate-500 hover:text-slate-300 text-xs p-1 rounded-lg hover:bg-slate-800 transition-colors"
            title="Dismiss active subject"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Content & Flow Buttons */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Item Thumbnail & Context */}
        <div className="flex items-center gap-3.5 min-w-0">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-14 h-14 object-cover rounded-xl border border-amber-500/30 bg-slate-900 shrink-0 shadow-md"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-center shrink-0">
              <Camera className="h-6 w-6 text-slate-600" />
            </div>
          )}

          <div className="space-y-0.5 min-w-0">
            <h4 className="text-sm font-bold text-slate-100 truncate font-display">
              {item.title}
            </h4>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 flex-wrap">
              {item.category && <span>Category: <span className="text-slate-200">{item.category}</span></span>}
              {item.currentBid !== undefined && (
                <span>Bid: <strong className="text-amber-300">${item.currentBid}</strong></span>
              )}
              {item.estValue !== undefined && (
                <span>Est. Resale: <strong className="text-emerald-400">${item.estValue}</strong></span>
              )}
            </div>
          </div>
        </div>

        {/* Seamless Pipeline Action Forwarders */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider hidden lg:inline mr-1">
            Fast Flow:
          </span>

          {currentStage !== "appraise" && (
            <button
              type="button"
              onClick={() => onNavigateToStage("appraise")}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Camera className="h-3.5 w-3.5" /> 2. Appraise Lens
            </button>
          )}

          {currentStage !== "bid" && (
            <button
              type="button"
              onClick={() => onNavigateToStage("bid")}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/40 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Bookmark className="h-3.5 w-3.5" /> 3. Bidding Terminal
            </button>
          )}

          {currentStage !== "liquidate" && (
            <button
              type="button"
              onClick={() => onNavigateToStage("liquidate")}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <ShoppingBag className="h-3.5 w-3.5" /> 4. Cross-List Store
            </button>
          )}

          <button
            type="button"
            onClick={() => onNavigateToStage("hallmark")}
            className="px-2.5 py-1.5 rounded-xl text-xs font-mono text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center gap-1.5 transition-all"
            title="Inspect hallmarks or maker marks on this item"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Loupe</span>
          </button>
        </div>
      </div>
    </div>
  );
}
