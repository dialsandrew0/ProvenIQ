import React, { useState } from "react";
import { HallmarkDecodeResult } from "../types";
import { ShieldCheck, Search, Sparkles, Award, ArrowUpRight, CheckCircle2, AlertTriangle, Layers, BookOpen } from "lucide-react";

const quickReferenceHallmarks = [
  {
    name: "British Sterling Silver Lion Passant",
    category: "Fine Jewelry & Precious Metals",
    query: "Lion walking left (Lion Passant) with anchor mark and letter date code",
    summary: "Guarantees 925/1000 pure sterling silver from Birmingham or London assay offices."
  },
  {
    name: "Faarup Møbelfabrik Danish Teak Stamp",
    category: "Furniture / MCM",
    query: "Gold embossed stamp inside drawer reading 'Made in Denmark Faarup'",
    summary: "Identifies authentic high-tier Danish modern cabinetry designed by Ib Kofod-Larsen."
  },
  {
    name: "L.S. Starrett Athol Mass USA Stamp",
    category: "Tools & Machining",
    query: "Deeply engraved text 'L.S. STARRETT ATHOL MASS U.S.A.' on cast steel frame",
    summary: "Gold standard of vintage precision measurement tools. Highly liquid."
  },
  {
    name: "Mourlot Studio Paris Printer Stamp",
    category: "Fine Art & Graphics",
    query: "Small bottom margin text 'Imprimerie Mourlot Paris' or 'Maeght Editeur'",
    summary: "Confirms authentic period original lithograph printed for Calder, Picasso, or Chagall."
  },
  {
    name: "Pyrex Opalware Mold Mark",
    category: "Studio Glass & Ceramics",
    query: "Circular raised lettering on bottom reading 'PYREX MADE IN U.S.A.' with pattern code #441",
    summary: "Identifies authentic vintage Corning Pyrex mixing bowls from 1957-1966."
  },
  {
    name: "Navajo Native American Studio Mark",
    category: "Fine Jewelry & Precious Metals",
    query: "Stamped '.925' alongside initials 'T.P.' or 'Tahe' with hand-hammered bezel",
    summary: "High collector premium for authentic Native American Southwestern sterling silver."
  }
];

export default function HallmarkDecoder() {
  const [markQuery, setMarkQuery] = useState("");
  const [category, setCategory] = useState("Fine Jewelry & Precious Metals");
  const [decoding, setDecoding] = useState(false);
  const [result, setResult] = useState<HallmarkDecodeResult | null>(null);

  const handleDecode = async (queryToUse?: string) => {
    const q = queryToUse || markQuery;
    if (!q.trim()) return;

    setDecoding(true);
    setResult(null);

    try {
      const res = await fetch("/api/hallmark-decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markQuery: q, category })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Decoder error:", err);
    } finally {
      setDecoding(false);
    }
  };

  const handlePresetSelect = (preset: typeof quickReferenceHallmarks[0]) => {
    setMarkQuery(preset.query);
    setCategory(preset.category);
    handleDecode(preset.query);
  };

  return (
    <div id="hallmark-decoder-module" className="bg-[#11161d] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-400" />
            Hallmark, Stamp &amp; Signature AI Decoder Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Instantly decode obscure hallmarks, maker stamps, signatures, patent dates, or unknown metal purities.
          </p>
        </div>
        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg border border-indigo-500/20 font-mono font-bold">
          REFERENCE DECODER
        </span>
      </div>

      {/* Quick Reference Chips */}
      <div className="space-y-2.5">
        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
          High-Signal Hallmark &amp; Stamp Guides
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickReferenceHallmarks.map((ref, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetSelect(ref)}
              className="text-left bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-indigo-500/30 p-3 rounded-xl transition-all space-y-1 group"
            >
              <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 flex items-center justify-between">
                <span>{ref.name}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-indigo-400" />
              </div>
              <div className="text-[10px] text-slate-500 line-clamp-1">{ref.summary}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block text-slate-400 font-medium mb-1">Describe Stamp, Hallmark, Initials, or Markings</label>
            <input
              type="text"
              value={markQuery}
              onChange={(e) => setMarkQuery(e.target.value)}
              placeholder="e.g. Stamped '.925' with anchor and letter G, or 'Made in Denmark' burn stamp"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Target Niche Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Fine Jewelry & Precious Metals">Fine Jewelry &amp; Precious Metals</option>
              <option value="Furniture / MCM">Furniture / MCM</option>
              <option value="Industrial Tools & Machining">Industrial Tools &amp; Machining</option>
              <option value="Studio Glass & Ceramics">Studio Glass &amp; Ceramics</option>
              <option value="Fine Art & Graphics">Fine Art &amp; Graphics</option>
              <option value="Vintage Audio & Electronics">Vintage Audio &amp; Electronics</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => handleDecode()}
          disabled={decoding || !markQuery.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl py-2.5 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 text-xs"
        >
          {decoding ? (
            <span className="animate-pulse">Decoding Mark Credentials...</span>
          ) : (
            <>
              <Search className="h-4 w-4" /> Trigger Hallmark AI Decoder
            </>
          )}
        </button>
      </div>

      {/* Decode Result */}
      {result && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-indigo-500/30 space-y-4 animate-fadeIn">
          <div className="flex justify-between items-start border-b border-slate-900 pb-3">
            <div>
              <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider block">MATCHED MAKER / HALLMARK IDENTITY</span>
              <h3 className="text-lg font-display font-bold text-slate-100 mt-1">{result.matchedMaker}</h3>
              <div className="text-xs text-slate-400 font-mono mt-0.5">{result.originPeriod} • {result.purityOrMaterial}</div>
            </div>
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-2.5 py-1 rounded-lg font-mono font-bold">
              RARITY: {result.rarityMultiplier}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 bg-slate-900/40 p-3.5 rounded-xl border border-slate-850">
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">SYMBOL INTERPRETATION</div>
              <p className="text-slate-300 leading-relaxed">{result.symbolInterpretation}</p>
            </div>

            <div className="space-y-2 bg-slate-900/40 p-3.5 rounded-xl border border-slate-850">
              <div className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">COLLECTOR VALUE MULTIPLIER</div>
              <p className="text-slate-300 leading-relaxed">{result.knownMarketValueBonus}</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="text-[10px] text-amber-400 font-mono uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> PHYSICAL VERIFICATION STEPS
            </div>
            <div className="space-y-1.5">
              {result.verificationSteps?.map((step, idx) => (
                <div key={idx} className="flex gap-2 text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-850">
                  <span className="text-amber-400 font-bold font-mono">{idx + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
