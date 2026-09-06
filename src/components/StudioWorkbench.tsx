import React, { useState, useEffect } from "react";
import { StudioWidget, StudioPreset } from "../types";
import BulkScanner from "./BulkScanner";
import ItemAnalysis from "./ItemAnalysis";
import EstateAnalysis from "./EstateAnalysis";
import FeedbackLoop from "./FeedbackLoop";
import RoutePlanner from "./RoutePlanner";
import NicheExplorer from "./NicheExplorer";
import HallmarkDecoder from "./HallmarkDecoder";
import { Grid, Puzzle, Sliders, Eye, RefreshCw, Check, Sparkles, Plus, Trash2, ArrowRight, Layers, ShieldCheck } from "lucide-react";

interface StudioWorkbenchProps {
  onLoggedPurchase: (item: any) => void;
  activeNicheFilter?: string;
}

const defaultWidgets: StudioWidget[] = [
  {
    id: "widget-scanner",
    title: "Sleeper Buy & Bulk Radar",
    category: "Scanner",
    enabled: true,
    colSpan: "full",
    iconName: "Zap",
    description: "Scan bulk catalog listings & text dumps to auto-detect hidden gems"
  },
  {
    id: "widget-appraisal",
    title: "AI Appraisal Station",
    category: "Appraisal",
    enabled: true,
    colSpan: "full",
    iconName: "Camera",
    description: "Visual valuation interpreter & risk-adjusted buy max limits"
  },
  {
    id: "widget-hallmark",
    title: "Hallmark & Stamp Decoder",
    category: "Research",
    enabled: true,
    colSpan: "full",
    iconName: "ShieldCheck",
    description: "Decode maker marks, sterling stamps, signatures, and patent dates"
  },
  {
    id: "widget-estate",
    title: "Multi-Lot Estate Optimizer",
    category: "Valuation",
    enabled: true,
    colSpan: "full",
    iconName: "FolderOpen",
    description: "Rank multi-item lots, infer Collector Profile DNA, and outlays"
  },
  {
    id: "widget-ledger",
    title: "Outcomes Ledger & P&L",
    category: "Analytics",
    enabled: true,
    colSpan: "full",
    iconName: "TrendingUp",
    description: "Log sourced purchases, resales, net profit, and win rate"
  },
  {
    id: "widget-route",
    title: "Estate Route Logistics",
    category: "Logistics",
    enabled: false,
    colSpan: "full",
    iconName: "Compass",
    description: "GPS-optimized estate sale itinerary based on opportunity density"
  },
  {
    id: "widget-taxonomy",
    title: "Niche Intelligence Taxonomy",
    category: "Reference",
    enabled: false,
    colSpan: "full",
    iconName: "Layers",
    description: "Curated value markers, forgery red flags, and reference cases"
  }
];

const studioPresets: StudioPreset[] = [
  {
    id: "preset-master",
    name: "Master Side Hustle Workbench",
    description: "Full suite of intelligence tools for multi-niche estate flippers.",
    nicheFocus: "All Niches",
    widgetIds: ["widget-scanner", "widget-appraisal", "widget-hallmark", "widget-estate", "widget-ledger", "widget-route", "widget-taxonomy"]
  },
  {
    id: "preset-mcm",
    name: "MCM & Scandinavian Design Studio",
    description: "Optimized for teak furniture, modernist lithos, and vintage ceramics.",
    nicheFocus: "Furniture / MCM",
    widgetIds: ["widget-scanner", "widget-appraisal", "widget-estate", "widget-ledger"]
  },
  {
    id: "preset-silver",
    name: "Sterling Silver & Fine Jewelry Studio",
    description: "Tailored for hallmark verification, precious metal purity, and melt floors.",
    nicheFocus: "Fine Jewelry & Precious Metals",
    widgetIds: ["widget-hallmark", "widget-scanner", "widget-appraisal", "widget-ledger"]
  },
  {
    id: "preset-audio",
    name: "Vintage Hi-Fi & Audio Studio",
    description: "Designed for receiver amps, turntables, instruments, and electronics.",
    nicheFocus: "Vintage Audio & Electronics",
    widgetIds: ["widget-scanner", "widget-appraisal", "widget-ledger", "widget-route"]
  },
  {
    id: "preset-tools",
    name: "Machinist Tools & Industrial Studio",
    description: "Targeted at Starrett tools, cast iron vises, and heavy garage liquidations.",
    nicheFocus: "Tools & Machining",
    widgetIds: ["widget-scanner", "widget-appraisal", "widget-route", "widget-ledger"]
  }
];

export default function StudioWorkbench({ onLoggedPurchase, activeNicheFilter }: StudioWorkbenchProps) {
  const [widgets, setWidgets] = useState<StudioWidget[]>(() => {
    const saved = localStorage.getItem("artperiod_studio_widgets");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultWidgets;
      }
    }
    return defaultWidgets;
  });

  const [activePreset, setActivePreset] = useState<string>("preset-master");
  const [customizing, setCustomizing] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("artperiod_studio_widgets", JSON.stringify(widgets));
  }, [widgets]);

  const handleApplyPreset = (preset: StudioPreset) => {
    setActivePreset(preset.id);
    setWidgets(
      widgets.map((w) => ({
        ...w,
        enabled: preset.widgetIds.includes(w.id)
      }))
    );
  };

  const toggleWidget = (id: string) => {
    setWidgets(
      widgets.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const moveWidget = (index: number, direction: "up" | "down") => {
    const newWidgets = [...widgets];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newWidgets.length) return;
    const temp = newWidgets[index];
    newWidgets[index] = newWidgets[targetIndex];
    newWidgets[targetIndex] = temp;
    setWidgets(newWidgets);
  };

  const enabledWidgets = widgets.filter((w) => w.enabled);

  return (
    <div id="studio-workbench-section" className="space-y-6">
      {/* Studio Workbench Header & Puzzle Customizer Bar */}
      <div className="bg-[#11161d] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-display font-semibold text-slate-100 flex items-center gap-2">
              <Puzzle className="h-5 w-5 text-indigo-400" />
              Plug &amp; Play Modular Studio Workbench
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Mix and match feature puzzle pieces to design your personalized side hustle studio layout.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCustomizing(!customizing)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                customizing
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20"
                  : "bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800"
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              {customizing ? "Close Customizer" : "Mix & Match Studio Pieces"}
            </button>
          </div>
        </div>

        {/* Studio Presets selector */}
        <div className="space-y-2">
          <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
            Choose Your Side Hustle Studio Preset
          </div>
          <div className="flex flex-wrap gap-2">
            {studioPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all border ${
                  activePreset === preset.id
                    ? "bg-indigo-600/10 text-indigo-300 border-indigo-500/40 shadow"
                    : "bg-slate-950/60 text-slate-400 hover:text-slate-200 border-slate-850"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Customizer Drawer */}
        {customizing && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center text-xs border-b border-slate-900 pb-2">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Grid className="h-4 w-4 text-indigo-400" /> Toggle Puzzle Feature Modules
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {enabledWidgets.length} of {widgets.length} enabled
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {widgets.map((widget, idx) => (
                <div
                  key={widget.id}
                  className={`p-3 rounded-xl border transition-all flex justify-between items-center gap-3 ${
                    widget.enabled
                      ? "bg-indigo-950/20 border-indigo-500/30 text-slate-200"
                      : "bg-slate-900/40 border-slate-850 text-slate-500"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold">{widget.title}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{widget.description}</div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveWidget(idx, "up")}
                      disabled={idx === 0}
                      className="text-slate-500 hover:text-slate-300 text-[10px] disabled:opacity-30 p-1"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveWidget(idx, "down")}
                      disabled={idx === widgets.length - 1}
                      className="text-slate-500 hover:text-slate-300 text-[10px] disabled:opacity-30 p-1"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => toggleWidget(widget.id)}
                      className={`h-5 w-5 rounded border flex items-center justify-center shrink-0 ml-1 transition-all ${
                        widget.enabled
                          ? "bg-indigo-600 border-indigo-500 text-white"
                          : "border-slate-700 bg-slate-950 text-transparent"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Render Enabled Puzzle Modules in Order */}
      <div className="space-y-8">
        {widgets.map((widget) => {
          if (!widget.enabled) return null;

          if (widget.id === "widget-scanner") {
            return (
              <div key={widget.id} className="relative">
                <BulkScanner onLoggedPurchase={onLoggedPurchase} selectedNicheFilter={activeNicheFilter} />
              </div>
            );
          }

          if (widget.id === "widget-appraisal") {
            return (
              <div key={widget.id} className="relative">
                <ItemAnalysis onLoggedPurchase={onLoggedPurchase} />
              </div>
            );
          }

          if (widget.id === "widget-hallmark") {
            return (
              <div key={widget.id} className="relative">
                <HallmarkDecoder />
              </div>
            );
          }

          if (widget.id === "widget-estate") {
            return (
              <div key={widget.id} className="relative">
                <EstateAnalysis />
              </div>
            );
          }

          if (widget.id === "widget-ledger") {
            return (
              <div key={widget.id} className="relative">
                <FeedbackLoop />
              </div>
            );
          }

          if (widget.id === "widget-route") {
            return (
              <div key={widget.id} className="relative">
                <RoutePlanner />
              </div>
            );
          }

          if (widget.id === "widget-taxonomy") {
            return (
              <div key={widget.id} className="relative">
                <NicheExplorer />
              </div>
            );
          }

          return null;
        })}

        {enabledWidgets.length === 0 && (
          <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-3">
            <Puzzle className="h-8 w-8 text-slate-700 mx-auto" />
            <div className="text-sm font-medium">All Studio Puzzle Pieces Disabled</div>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Click "Mix &amp; Match Studio Pieces" above or pick a preset to enable feature modules for your studio.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
