import React from "react";
import { 
  Search, Camera, Bookmark, ShoppingBag, ArrowRight, CheckCircle2, 
  ShieldCheck, Compass, Zap, Flame, DollarSign, X, Layers, RefreshCw
} from "lucide-react";
import { PipelineStage } from "./PipelineStreamBar";

interface PipelineFlowGuideProps {
  onSelectStage: (stage: PipelineStage) => void;
  onClose: () => void;
}

export default function PipelineFlowGuide({ onSelectStage, onClose }: PipelineFlowGuideProps) {
  const steps = [
    {
      id: "scout" as PipelineStage,
      number: "01",
      title: "Scout & Radar",
      headline: "Where the Arbitrage Margin Is Born",
      whyIncluded: "You cannot flip what you haven't uncovered. Online estate sales and municipal liquidations (CTBids, HiBid, GovDeals) list thousands of lots every week under vague names like 'Wood Desk' or 'Assorted Silver'.",
      howItFlows: "Sleeper Radar analyzes catalog photos and scans for omitted designer names (e.g. Faarup, Marantz, Tiffany). Once an opportunity is flagged, 1-click sends it to the Optical Lens for deep appraisal or to the Bidding Terminal.",
      accent: "amber",
      border: "border-amber-500/40",
      bg: "bg-amber-500/10 text-amber-300"
    },
    {
      id: "appraise" as PipelineStage,
      number: "02",
      title: "Optical Appraisal",
      headline: "The Connoisseur's Scientific Lens",
      whyIncluded: "Bidding without decoding maker marks or comps is gambling. An estate flipper needs to know within seconds: Is this $40 IKEA or a $2,000 Scandinavian teak classic? Is this silverplate or solid .925 sterling?",
      howItFlows: "Upload or paste photos of the item, stamps, and joins. AI assigns a domain specialist (MCM, Fine Jewelry, Machining), runs visual feature verification, and calculates your maximum safe bid cap.",
      accent: "indigo",
      border: "border-indigo-500/40",
      bg: "bg-indigo-500/10 text-indigo-300"
    },
    {
      id: "bid" as PipelineStage,
      number: "03",
      title: "Bidding Terminal",
      headline: "Game-Theoretic Cold-Blooded Execution",
      whyIncluded: "Human emotion destroys profit. Auction fever leads to overpaying, and soft-close countdowns trick bidders into bidding up against themselves.",
      howItFlows: "Locks in an unshakeable mathematical budget cap (e.g. 25-30% of fair resale). Employs odd-number psychological anchor bids ($47 vs $50) and soft-close timing. Once won, seamlessly transitions item into In-Hand Inventory.",
      accent: "sky",
      border: "border-sky-500/40",
      bg: "bg-sky-500/10 text-sky-300"
    },
    {
      id: "liquidate" as PipelineStage,
      number: "04",
      title: "Vault & Commerce",
      headline: "Liquidating Physical Goods into Cash",
      whyIncluded: "A won auction is an expense; cash in the bank is the goal. Items sitting unlisted in a garage yield 0% ROI.",
      howItFlows: "Pulls your acquired inventory, calculates platform fee spreads (eBay vs. Etsy vs. Facebook Marketplace), auto-generates SEO titles, condition disclosures, and markdown schedules for rapid liquidation.",
      accent: "emerald",
      border: "border-emerald-500/40",
      bg: "bg-emerald-500/10 text-emerald-300"
    }
  ];

  return (
    <div className="bg-[#10141d] rounded-2xl border border-indigo-500/30 p-6 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex justify-between items-start border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-400" /> THE PROVENIQ VALUE STREAM
            </span>
            <span className="text-xs text-slate-500 font-mono">Organic Lifecycle Flow</span>
          </div>
          <h2 className="text-lg font-display font-bold text-slate-100">
            Why Every Layer Belongs Together: The Closed Arbitrage Loop
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            PROVENIQ is not a disjointed box of tools. It is an end-to-end estate flipping pipeline. Each stage feeds directly into the next, transforming uncataloged garage sales and auction lots into documented inventory and cash profits.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* The 4 Interlocking Phases */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-slate-950/80 rounded-xl border border-slate-850 p-4 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded ${step.bg}`}>
                  PHASE {step.number}
                </span>
                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-200">
                  {step.title}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-display font-bold text-slate-100 leading-snug">
                  {step.headline}
                </h4>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
                <div>
                  <strong className="text-slate-400 font-mono text-[10px] uppercase block mb-0.5">WHY IT&apos;S HERE:</strong>
                  <p className="text-slate-400 text-[11px]">{step.whyIncluded}</p>
                </div>
                <div>
                  <strong className="text-indigo-400 font-mono text-[10px] uppercase block mb-0.5">HOW IT FLOWS:</strong>
                  <p className="text-slate-300 text-[11px]">{step.howItFlows}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectStage(step.id);
                onClose();
              }}
              className="w-full py-2 px-3 rounded-lg text-xs font-mono font-bold bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 flex items-center justify-center gap-1.5 transition-all group-hover:border-indigo-500/40"
            >
              <span>Enter Phase {step.number}</span>
              <ArrowRight className="h-3 w-3 text-indigo-400" />
            </button>
          </div>
        ))}
      </div>

      {/* Role of Specialist Field Kit */}
      <div className="bg-slate-950/90 rounded-xl border border-slate-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 font-mono uppercase">
            <ShieldCheck className="h-4 w-4 text-amber-400" /> What about the Specialist Field Kit?
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            The <strong>Hallmark Loupe</strong>, <strong>Route Logistics</strong>, <strong>Puzzle Workbench</strong>, and <strong>Taxonomies Matrix</strong> are handheld diagnostic tools that you dip into at any moment during the 4 phases—to verify silver touchmarks on a live lot, optimize driving time between 5 estate sales, or analyze historical maker marks.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold shrink-0 transition-all"
        >
          Got It, Return to Pipeline
        </button>
      </div>
    </div>
  );
}
