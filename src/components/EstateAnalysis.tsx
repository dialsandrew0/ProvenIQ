import React, { useState } from "react";
import { EstateReport } from "../types";
import { Layers, FolderOpen, Award, BarChart3, AlertCircle, ArrowUpRight, Check } from "lucide-react";

// Pre-packaged catalog simulations for users to test bulk evaluations instantly
const mockCatalogManor = [
  { itemName: "Ib Kofod-Larsen Teak Buffet Credenza", opportunity: 92, verdict: "TREASURE", category: "Furniture / MCM", buyMax: { conservative: 200, standard: 450, aggressive: 700 }, expectedResale: { quickSaleMin: 1200, retailMax: 2400 } },
  { itemName: "Vintage Pyrex Pink Gooseberry Nesting Bowls", opportunity: 78, verdict: "BUY", category: "Studio Glass / Tableware", buyMax: { conservative: 15, standard: 40, aggressive: 65 }, expectedResale: { quickSaleMin: 180, retailMax: 280 } },
  { itemName: "Alexander Calder Mourlot Exhibition Print (1969)", opportunity: 81, verdict: "STRONG BUY", category: "Fine Art / Graphics", buyMax: { conservative: 45, standard: 80, aggressive: 120 }, expectedResale: { quickSaleMin: 350, retailMax: 650 } },
  { itemName: "Standard Household Kitchen Chairs (Set of 4)", opportunity: 38, verdict: "PASS", category: "Furniture / MCM", buyMax: { conservative: 5, standard: 15, aggressive: 25 }, expectedResale: { quickSaleMin: 30, retailMax: 80 } }
];

const mockCatalogWorkshop = [
  { itemName: "Starrett No. 224 Micrometer Calibration Kit", opportunity: 74, verdict: "BUY", category: "Industrial Tools & Machining", buyMax: { conservative: 10, standard: 40, aggressive: 75 }, expectedResale: { quickSaleMin: 110, retailMax: 190 } },
  { itemName: "Brown & Sharpe Heavy Duty Bench Vise (1955)", opportunity: 79, verdict: "STRONG BUY", category: "Industrial Tools & Machining", buyMax: { conservative: 25, standard: 60, aggressive: 100 }, expectedResale: { quickSaleMin: 150, retailMax: 320 } },
  { itemName: "Mixed Box of Antique Iron Spanners & Wrenches", opportunity: 45, verdict: "ONLY IF CHEAP", category: "Industrial Tools & Machining", buyMax: { conservative: 2, standard: 10, aggressive: 20 }, expectedResale: { quickSaleMin: 15, retailMax: 45 } }
];

const mockCatalogSilver = [
  { itemName: "Sterling 1847 Rogers Bros Table Set (83 pieces)", opportunity: 89, verdict: "STRONG BUY", category: "Fine Jewelry / Metalware", buyMax: { conservative: 75, standard: 180, aggressive: 280 }, expectedResale: { quickSaleMin: 700, retailMax: 1250 } },
  { itemName: "Vintage Navajo Turquoise Cuff Bracelet", opportunity: 83, verdict: "STRONG BUY", category: "Fine Jewelry / Metalware", buyMax: { conservative: 40, standard: 90, aggressive: 140 }, expectedResale: { quickSaleMin: 250, retailMax: 480 } },
  { itemName: "Plated Brass Candle Holders (Set of 6)", opportunity: 32, verdict: "PASS", category: "Fine Jewelry / Metalware", buyMax: { conservative: 2, standard: 5, aggressive: 10 }, expectedResale: { quickSaleMin: 10, retailMax: 30 } }
];

export default function EstateAnalysis() {
  const [estateName, setEstateName] = useState("Mid-Century Manor Liquidation");
  const [activeCatalog, setActiveCatalog] = useState<any[]>(mockCatalogManor);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<EstateReport | null>(null);

  const triggerEstateAnalysis = async () => {
    setAnalyzing(true);
    setReport(null);
    try {
      const response = await fetch("/api/analyze-estate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: activeCatalog, estateName })
      });
      const data = await response.json();
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSelectPreload = (type: "manor" | "workshop" | "silver") => {
    if (type === "manor") {
      setEstateName("Mid-Century Manor Liquidation");
      setActiveCatalog(mockCatalogManor);
    } else if (type === "workshop") {
      setEstateName("Machinist Garage Settlement");
      setActiveCatalog(mockCatalogWorkshop);
    } else {
      setEstateName("Victorian Jewelry & Silver Collection");
      setActiveCatalog(mockCatalogSilver);
    }
    setReport(null);
  };

  return (
    <div id="estate-analysis-section" className="space-y-6">
      {/* Configuration & Selection Panel */}
      <div className="bg-[#11161d] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-display font-semibold text-slate-100 flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-indigo-400" />
              Multi-Lot Estate &amp; Catalog Analyzer
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select or model bulk catalog lists to rank opportunities, outline capital outlays, and extract original Collector Profile DNA.
            </p>
          </div>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded border border-indigo-500/20 font-mono">
            AGGREGATED OPTIMIZER
          </span>
        </div>

        {/* Selection buttons */}
        <div className="space-y-3.5">
          <div className="text-xs text-slate-500 font-mono uppercase tracking-wider">Select Preset Sourcing catalog</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleSelectPreload("manor")}
              className={`text-left p-3.5 rounded-xl border transition-all ${
                estateName.includes("Manor")
                  ? "bg-indigo-600/10 border-indigo-500/40 text-slate-100 shadow"
                  : "bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400"
              }`}
            >
              <div className="text-xs font-semibold">Mid-Century Manor</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Teak, Pyrex, Fine Art Prints (4 lots)</div>
            </button>

            <button
              onClick={() => handleSelectPreload("workshop")}
              className={`text-left p-3.5 rounded-xl border transition-all ${
                estateName.includes("Garage")
                  ? "bg-indigo-600/10 border-indigo-500/40 text-slate-100 shadow"
                  : "bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400"
              }`}
            >
              <div className="text-xs font-semibold">Machinist Garage</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Heavy vises, micrometers, tools (3 lots)</div>
            </button>

            <button
              onClick={() => handleSelectPreload("silver")}
              className={`text-left p-3.5 rounded-xl border transition-all ${
                estateName.includes("Jewelry")
                  ? "bg-indigo-600/10 border-indigo-500/40 text-slate-100 shadow"
                  : "bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400"
              }`}
            >
              <div className="text-xs font-semibold">Jewelry &amp; Silver</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Sterling silverware, cuff bands (3 lots)</div>
            </button>
          </div>
        </div>

        {/* Active Catalog display */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3.5">
          <div className="flex justify-between items-center text-xs border-b border-slate-900 pb-2">
            <span className="font-semibold text-slate-300">Catalog Inventory Stop: {estateName}</span>
            <span className="text-[10px] text-slate-500 font-mono">{activeCatalog.length} active lots</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
            {activeCatalog.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                <div className="space-y-0.5">
                  <span className="font-medium text-slate-200">{item.itemName}</span>
                  <div className="text-[10px] text-slate-500 font-mono">{item.category}</div>
                </div>
                <span className={`font-mono font-bold ${
                  item.opportunity >= 80 ? "text-emerald-400" : "text-indigo-400"
                }`}>
                  Opp: {item.opportunity}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={triggerEstateAnalysis}
            disabled={analyzing}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg py-2.5 shadow-lg shadow-indigo-600/15 transition-all text-xs"
          >
            {analyzing ? "Synthesizing Estate Footprint..." : "Trigger Aggregated Intelligence Scan"}
          </button>
        </div>
      </div>

      {/* Structured Estate Valuation Report */}
      {report && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Collector Profile (Estate DNA) */}
            <div className="bg-[#11161d] border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">COLLECTOR PROFILE</span>
                  <span className="bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 text-[10px] px-2 py-0.5 rounded font-mono">
                    GRADE: {report.estateGrade}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-display font-bold text-slate-200">
                    {report.collectorProfile?.type}
                  </h3>
                  <div className="text-[11px] font-mono text-indigo-400 font-medium">
                    {report.collectorProfile?.incomeTier}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-850">
                  {report.collectorProfile?.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 mt-4 text-[11px] font-mono text-slate-500 space-y-1">
                <div>• Inferred Travel: {report.collectorProfile?.travelNotes}</div>
                <div>• Gem Probability: {report.collectorProfile?.gemProbability}%</div>
              </div>
            </div>

            {/* Financial ROI and capital required */}
            <div className="bg-[#11161d] border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">AGGREGATE POTENTIAL</span>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                    <div className="text-[10px] text-slate-500 font-mono">ESTIMATED ROI</div>
                    <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">
                      {report.roiPotential?.lowRoi} - {report.roiPotential?.highRoi}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                    <div className="text-[10px] text-slate-500 font-mono">CAPITAL REQUIRED</div>
                    <div className="text-sm font-bold font-mono text-slate-200 mt-2">
                      {report.roiPotential?.capitalRequired}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 text-xs">
                  <div className="text-slate-400 font-semibold mb-1">Acquisition Strategy:</div>
                  <div className="text-slate-300 leading-relaxed">{report.acquisitionStrategy}</div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4" /> ESTATE METRICS v1.0
              </div>
            </div>

            {/* Best Lots vs Worst Lots */}
            <div className="bg-[#11161d] border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
              <div>
                <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider block">DAY 1 PRIORITY LOTS</span>
                <div className="space-y-1.5 mt-2 max-h-36 overflow-y-auto pr-1">
                  {report.bestLots?.map((lot, idx) => (
                    <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-xs flex justify-between items-center">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-200 line-clamp-1">{lot.itemName}</div>
                        <div className="text-[10px] text-emerald-500 font-mono">Max Bid: ${lot.maxBid}</div>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold shrink-0 pl-3">Opp: {lot.opportunity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-rose-400 font-mono uppercase tracking-wider block">LOTS TO IGNORE / CLEARANCE</span>
                <div className="space-y-1.5 mt-2 max-h-36 overflow-y-auto pr-1">
                  {report.worstLots?.map((lot, idx) => (
                    <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-xs flex justify-between items-center">
                      <span className="font-medium text-slate-400 line-clamp-1">{lot.itemName}</span>
                      <span className="text-slate-500 font-mono shrink-0 pl-3">Opp: {lot.opportunity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
