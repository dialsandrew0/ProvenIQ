import React, { useState, useEffect } from "react";
import ProveniqLogo from "./ProveniqLogo";
import { ObjectReport } from "../types";
import { 
  Upload, Camera, FileText, CheckSquare, Search, DollarSign, Award, AlertCircle, 
  ArrowUpRight, Check, AlertTriangle, Zap, ShieldCheck, Sparkles, CheckCircle2,
  Plus, X, Image as ImageIcon, StickyNote, ArrowRight, Bookmark, ShoppingBag, Eye
} from "lucide-react";

interface ItemAnalysisProps {
  onLoggedPurchase?: (item: any) => void;
  onSendToBidding?: (item: any) => void;
  onSendToVault?: (item: any) => void;
  onOpenHallmarkDecoder?: (hallmarkQuery?: string) => void;
  initialItem?: { title?: string; image?: string; notes?: string } | null;
}

export default function ItemAnalysis({ 
  onLoggedPurchase,
  onSendToBidding,
  onSendToVault,
  onOpenHallmarkDecoder,
  initialItem 
}: ItemAnalysisProps) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [extraImages, setExtraImages] = useState<string[]>([]);

  // Sync initial item when forwarded from Scout or another pipeline stage
  useEffect(() => {
    if (initialItem) {
      if (initialItem.title) setTitle(initialItem.title);
      if (initialItem.image) setImage(initialItem.image);
      if (initialItem.notes) setNotes(initialItem.notes);
    }
  }, [initialItem]);
  
  const [analyzing, setAnalyzing] = useState(false);
  const [stage, setStage] = useState("");
  const [report, setReport] = useState<ObjectReport | null>(null);
  const [completedChecks, setCompletedChecks] = useState<Record<string, boolean>>({});

  const handlePrimaryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtraImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setExtraImages((prev) => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const removeExtraImage = (index: number) => {
    setExtraImages((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerAnalyze = async () => {
    if (!image && !title && !notes) {
      alert("Please upload at least one photograph or enter item notes/title to begin AI analysis.");
      return;
    }

    setAnalyzing(true);
    setReport(null);
    setCompletedChecks({});

    // Staged updates for premium feel
    const stages = [
      "Visual scan & hallmark feature extraction...",
      "AI auto-classifying primary & sub-niche...",
      "Assigning Specialized Niche Master Agent...",
      "Executing tailored niche databases & catalog searches...",
      "Formulating god-tier precision valuation..."
    ];

    for (let i = 0; i < stages.length; i++) {
      setStage(stages[i]);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          image, 
          extraImages, 
          title, 
          notes,
          context: notes 
        })
      });
      const data = await res.json();
      if (data && data.itemName) {
        setReport(data);
      } else {
        console.warn("Server response missing report payload, utilizing local fallback");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleCheck = (idxStr: string) => {
    setCompletedChecks((prev) => ({
      ...prev,
      [idxStr]: !prev[idxStr]
    }));
  };

  const handlePurchaseDirectly = () => {
    if (!report) return;
    if (onLoggedPurchase) {
      onLoggedPurchase({
        itemName: report.itemName,
        category: report.category,
        purchasePrice: report.buyMax?.standard || 40,
        purchaseDate: new Date().toISOString().split("T")[0],
        notes: `AI Recommended Purchase | Est. Resale $${report.expectedResale?.quickSaleMin}-${report.expectedResale?.retailMax}`
      });
      alert(`Logged: "${report.itemName}" added to your Portfolio ledger at Recommended Bid of $${report.buyMax?.standard}!`);
    }
  };

  return (
    <div id="item-analyzer-section" className="space-y-6">
      {/* Upload and Input Section */}
      <div className="bg-[#11161d] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-display font-semibold text-slate-100 flex items-center gap-2">
              <Camera className="h-5 w-5 text-amber-400" />
              Visual Valuation Interpreter &amp; Niche Classifier
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Powered by PROVENIQ Optical Appraisal Engine: automatically detects niche, materials, maker marks, and market value bounds.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-amber-500/20 text-xs font-mono text-amber-300">
            <ProveniqLogo size="xs" showText={false} />
            <span className="font-bold tracking-wider text-[11px]">PROVENIQ VISION CORE</span>
          </div>
        </div>

        {/* Primary Photo Intake & Extra Detail Photos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Primary Photo Dropzone */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="h-3.5 w-3.5 text-indigo-400" /> Primary Photo Intake
              </label>
              {image && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Ready for AI
                </span>
              )}
            </div>

            <div className="relative group border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950/60 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer min-h-[190px] transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={handlePrimaryImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              {image ? (
                <div className="relative w-full h-[160px] flex items-center justify-center">
                  <img src={image} alt="Primary upload preview" className="max-w-full max-h-full rounded-lg object-contain shadow-md" />
                  <div className="absolute bottom-2 bg-slate-950/85 backdrop-blur border border-slate-800 text-[10px] text-indigo-300 px-2.5 py-1 rounded-lg font-mono font-bold flex items-center gap-1">
                    <Camera className="h-3 w-3" /> Click to Retake or Change Photo
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-indigo-500/10 rounded-full inline-block text-indigo-400 group-hover:scale-110 transition-transform">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-200">Take Photo or Upload Image</div>
                    <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                      Supports camera snapshot, photo library upload, or listing screenshot
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Supplemental Extra Photos Portion */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-amber-400" /> Extra Photos / Detail Shots
              </label>
              <span className="text-[10px] font-mono text-slate-500">
                {extraImages.length} attached
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-3 min-h-[190px] flex flex-col justify-between">
              {extraImages.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {extraImages.map((extraImg, idx) => (
                    <div key={idx} className="relative group/thumb border border-slate-800 rounded-lg overflow-hidden bg-slate-900 h-20">
                      <img src={extraImg} alt={`Extra shot ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExtraImage(idx)}
                        className="absolute top-1 right-1 bg-rose-950/80 hover:bg-rose-600 text-white rounded-full p-1 border border-rose-500/40 opacity-90 group-hover/thumb:opacity-100 transition-all z-20"
                        title="Remove photo"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  {/* Add button if less than 6 */}
                  {extraImages.length < 6 && (
                    <label className="relative border-2 border-dashed border-slate-800 hover:border-amber-500/50 bg-slate-900/50 rounded-lg h-20 flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleExtraImageAdd}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Plus className="h-5 w-5 text-amber-400 mb-0.5" />
                      <span className="text-[9px] font-mono text-slate-400">Add Detail</span>
                    </label>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 space-y-2 my-auto">
                  <div className="p-2 bg-amber-500/10 rounded-full inline-block text-amber-400">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <div className="text-xs text-slate-300 font-medium">No Extra Detail Photos Yet</div>
                  <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Attach close-ups of maker hallmarks, stamps, signatures, serial tags, joinery, or defects.
                  </p>
                </div>
              )}

              {/* Always present upload trigger for extra images */}
              <label className="w-full py-2 px-3 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleExtraImageAdd}
                  className="hidden"
                />
                <Plus className="h-3.5 w-3.5 text-amber-400" /> Add Extra Photo (Hallmark / Tag / Backing)
              </label>
            </div>
          </div>
        </div>

        {/* Notes & Search Context Portion */}
        <div className="space-y-4 pt-2 border-t border-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Notes Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <StickyNote className="h-3.5 w-3.5 text-indigo-400" /> Notes &amp; Field Inspection Observations
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Type physical observations or context (e.g. Stamped '.925' on underside, solid heavy wood joinery, minor chip on left edge, found at Pasadena CTBids sale Lot #104)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono resize-none"
              />
            </div>

            {/* Optional Lot Title / URL */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-slate-400" /> Auction / Estate Lot Title or URL (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lot #104 - Mid Century Teak Sideboard (or CTBids/HiBid listing URL)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              {/* AI Auto Classifier Banner */}
              <div className="bg-gradient-to-r from-indigo-950/80 via-slate-950 to-amber-950/40 p-3 rounded-xl border border-indigo-500/30 flex items-center gap-2.5">
                <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                <div className="text-[11px] text-slate-300 leading-snug">
                  <strong className="text-indigo-200">Zero manual tagging:</strong> When you submit, AI auto-decides the niche, evaluates hallmarks, calculates recommended max bids, and performs comps search.
                </div>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={triggerAnalyze}
            disabled={analyzing}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl py-3 shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-mono"
          >
            {analyzing ? (
              <span className="animate-pulse">Analyzing Photos &amp; Formulating Appraisal...</span>
            ) : (
              <>
                <Search className="h-4 w-4" /> Trigger AI Niche Classification &amp; Valuation
              </>
            )}
          </button>
        </div>

        {/* Analyzing Stage Indicator */}
        {analyzing && (
          <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-center gap-3 animate-pulse">
            <div className="h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin shrink-0" />
            <div className="text-xs">
              <div className="font-semibold text-slate-200">AI NICHE ANALYSIS ACTIVE</div>
              <div className="text-slate-400 font-mono mt-0.5">{stage}</div>
            </div>
          </div>
        )}
      </div>

      {/* Structured Appraisal Report */}
      {report && (
        <div className="space-y-6">
          {/* Specialized Niche Specialist Agent Card */}
          {report.nicheSpecialist && (
            <div className="bg-gradient-to-br from-[#121822] via-[#0f141d] to-[#161324] rounded-2xl border border-indigo-500/30 p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3 border-b border-indigo-500/20 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-base shadow-lg shadow-indigo-600/10">
                    <ShieldCheck className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-100">{report.nicheSpecialist.specialistName}</span>
                      <span className="text-[9px] bg-amber-500/10 text-amber-400 font-mono font-bold px-2 py-0.5 rounded border border-amber-500/20 uppercase">
                        {report.nicheSpecialist.specialistBadge}
                      </span>
                    </div>
                    <div className="text-[11px] text-indigo-300 font-mono">{report.nicheSpecialist.specialistTitle}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-[9px] text-slate-400 font-mono uppercase">AUTO-DETECTED NICHE</div>
                  <div className="text-xs font-bold text-amber-300 font-mono mt-0.5">{report.nicheSpecialist.nicheDetected}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{report.nicheSpecialist.subNicheDetected}</div>
                </div>
              </div>

              {/* Specialized Research Avenues Pursued */}
              <div className="space-y-2">
                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  TAILORED RESEARCH AVENUES &amp; DATABASES EVALUATED
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {report.nicheSpecialist.researchAvenuesEvaluated?.map((avenue, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800 text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="text-[11px]">{avenue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* God-Tier Precision Identification Notes */}
              {report.nicheSpecialist.godTierPrecisionNotes && (
                <div className="bg-indigo-950/30 border border-indigo-500/20 p-3 rounded-xl text-xs text-indigo-200 flex items-start gap-2.5">
                  <Award className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300 font-mono text-[10px] uppercase block mb-0.5">GOD-TIER PRECISION IDENTIFICATION</span>
                    <p className="leading-relaxed text-[11px] text-slate-300">{report.nicheSpecialist.godTierPrecisionNotes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Header Verdict Block */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Verdict Gauge */}
            <div className="bg-[#11161d] rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">OPPORTUNITY INDEX</span>
                <div className="text-4xl font-extrabold font-mono text-indigo-400 mt-2 flex items-baseline">
                  {report.opportunity}
                  <span className="text-xs text-slate-500 font-sans font-normal ml-1">/100</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">VERDICT</div>
                <div className={`text-base font-bold font-display mt-1 tracking-wide ${
                  report.verdict === "TREASURE" ? "text-amber-400" :
                  report.verdict === "STRONG BUY" ? "text-emerald-400" :
                  report.verdict === "BUY" ? "text-indigo-400" :
                  report.verdict === "SPECULATIVE BUY" ? "text-indigo-300" :
                  report.verdict === "INVESTIGATE" ? "text-amber-300" : "text-rose-400"
                }`}>
                  {report.verdict}
                </div>
              </div>
            </div>

            {/* Quick Stats Block */}
            <div className="md:col-span-3 bg-[#11161d] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-display font-bold text-slate-100">{report.itemName}</h3>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5 flex gap-3">
                    <span>Category: {report.category}</span>
                    <span>•</span>
                    <span>Style/Era: {report.stylePeriod}</span>
                  </div>
                </div>
                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] px-2 py-0.5 rounded font-mono">
                  FIDELITY: {report.confidence}%
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                {report.verdictReasoning?.map((reason, idx) => (
                  <div key={idx} className="flex gap-2 text-slate-300 leading-relaxed">
                    <span className="text-indigo-500 shrink-0 font-bold">»</span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Organic Pipeline Advancement Station */}
          <div className="bg-gradient-to-r from-amber-500/10 via-slate-950 to-indigo-950/40 border border-amber-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    Arbitrage Pipeline Next Steps: Advance This Item
                  </h4>
                  <p className="text-xs text-slate-400">
                    Connect this valuation directly to the next stage in your estate flipping workflow
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30 font-bold">
                  Target Profit Spread: +${Math.max(0, (report.expectedResale?.retailMax || 250) - (report.buyMax?.standard || 40))}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {/* Action 1: Advance to Stage 3 Bidding Terminal */}
              <button
                type="button"
                onClick={() => onSendToBidding && onSendToBidding({
                  title: report.itemName,
                  imageUrl: image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60",
                  currentBid: Math.round((report.buyMax?.conservative || 25) * 0.6),
                  myMaxBudget: report.buyMax?.standard || 80,
                  estValue: report.expectedResale?.retailMax || 350,
                  category: report.category,
                  notes: notes || report.verdictReasoning?.[0]
                })}
                className="p-3.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-left transition-all group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Bookmark className="h-3 w-3" /> Step 03 • Bidding
                  </span>
                  <ArrowRight className="h-4 w-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-100">Send to Bidding Terminal</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Cap budget at ${report.buyMax?.standard || 80} with odd-number sniper rules</div>
                </div>
              </button>

              {/* Action 2: Advance to Stage 4 Store Lister */}
              <button
                type="button"
                onClick={() => onSendToVault && onSendToVault({
                  title: report.itemName,
                  imageUrl: image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60",
                  purchasePrice: report.buyMax?.standard || 40,
                  estValue: report.expectedResale?.retailMax || 350,
                  category: report.category,
                  notes: notes || report.verdictReasoning?.[0]
                })}
                className="p-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-left transition-all group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShoppingBag className="h-3 w-3" /> Step 04 • Store Listing
                  </span>
                  <ArrowRight className="h-4 w-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-100">Add to In-Hand Vault &amp; List</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Mark bought &amp; auto-generate eBay/Etsy descriptions</div>
                </div>
              </button>

              {/* Action 3: Inspect Hallmark Decoder */}
              <button
                type="button"
                onClick={() => onOpenHallmarkDecoder && onOpenHallmarkDecoder(report.itemName)}
                className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left transition-all group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Eye className="h-3 w-3" /> Field Kit Lens
                  </span>
                  <ArrowRight className="h-4 w-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-100">Deep Hallmark Verification</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Verify silver touchmarks, maker stamps &amp; foundry marks</div>
                </div>
              </button>
            </div>
          </div>

          {/* Core Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Scores Breakdown */}
            <div className="bg-[#11161d] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Scoring Profile
              </h3>
              
              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Authenticity Probability</span>
                    <span className="font-mono font-bold text-slate-200">{report.authenticity}/100</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${report.authenticity}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Craftsmanship Rating</span>
                    <span className="font-mono font-bold text-slate-200">{report.craftsmanship}/100</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${report.craftsmanship}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Liquidity Velocity</span>
                    <span className="font-mono font-bold text-slate-200">{report.liquidity}/100</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${report.liquidity}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Estimated Market Demand</span>
                    <span className="font-mono font-bold text-slate-200">{report.demand}/100</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400" style={{ width: `${report.demand}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Hidden Gem Score</span>
                    <span className="font-mono font-bold text-slate-200">{report.gemScore}/100</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500" style={{ width: `${report.gemScore}%` }} />
                  </div>
                </div>
              </div>

              {/* Rarity breakdown details */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 mt-4 space-y-2">
                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Rarity Breakdown</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                  <div>• Production: <span className="text-slate-300 font-bold">{report.rarity?.production}</span></div>
                  <div>• Survival: <span className="text-slate-300 font-bold">{report.rarity?.survival}</span></div>
                  <div>• Market: <span className="text-slate-300 font-bold">{report.rarity?.market}</span></div>
                  <div>• Knowledge: <span className="text-slate-300 font-bold">{report.rarity?.knowledge}</span></div>
                </div>
              </div>
            </div>

            {/* Middle: Bid Limits & Exit Strategy */}
            <div className="bg-[#11161d] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Bidding &amp; Liquidation
              </h3>

              {/* Buy-max Engine block */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                <div className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider">Buy-Max Recommended Bid</div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                    <div className="text-slate-500 text-[9px] font-mono">CONSERVATIVE</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">${report.buyMax?.conservative}</div>
                  </div>
                  <div className="bg-indigo-900/15 p-2 rounded-lg border border-indigo-500/20">
                    <div className="text-indigo-400 text-[9px] font-mono">STANDARD</div>
                    <div className="text-sm font-bold text-indigo-300 font-mono mt-0.5">${report.buyMax?.standard}</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                    <div className="text-slate-500 text-[9px] font-mono">AGGRESSIVE</div>
                    <div className="text-sm font-bold text-indigo-100 font-mono mt-0.5">${report.buyMax?.aggressive}</div>
                  </div>
                </div>
              </div>

              {/* Exit strategies */}
              <div className="space-y-2 text-xs">
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Ranked Exit Channels</div>
                <div className="space-y-1.5">
                  {report.bestExitChannels?.map((channel, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-850 text-slate-300">
                      <span className="font-mono text-[10px] text-indigo-400 font-bold">{i + 1}.</span>
                      <span className="line-clamp-1">{channel}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1">Target Client Profile</div>
                <div className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                  {report.targetCollectorProfile}
                </div>
              </div>
            </div>

            {/* Right: Diligence Checklists & Actions */}
            <div className="bg-[#11161d] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Diligence Checklist
              </h3>

              <div className="space-y-2">
                <div className="text-[10px] text-amber-400 font-mono uppercase tracking-wider flex items-center gap-1">
                  <CheckSquare className="h-3.5 w-3.5" /> High-impact physical checks
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {report.researchChecklist?.map((check, idx) => {
                    const idxStr = `chk-${idx}`;
                    const done = completedChecks[idxStr];
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleCheck(idxStr)}
                        className={`w-full flex gap-3 text-left p-2.5 rounded-lg border transition-all text-xs items-start ${
                          done
                            ? "bg-emerald-500/5 border-emerald-500/20 text-slate-400"
                            : "bg-slate-950 border-slate-850 text-slate-200 hover:border-slate-800"
                        }`}
                      >
                        <span className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                          done ? "bg-emerald-500 border-emerald-500 text-slate-950" : "border-slate-700"
                        }`}>
                          {done && <Check className="h-3 w-3 stroke-[3px]" />}
                        </span>
                        <span className={done ? "line-through text-slate-500" : ""}>{check}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Direct action to add to portfolio */}
              <button
                onClick={handlePurchaseDirectly}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-2.5 text-xs font-semibold shadow-lg shadow-emerald-600/15 flex items-center justify-center gap-1.5 transition-all mt-4"
              >
                <Award className="h-4 w-4" /> Log Sourced At Standard Bid
              </button>
            </div>
          </div>

          {/* Known Facts & Missing Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#11161d] border border-slate-800 p-5 rounded-2xl shadow-xl">
            {/* Known Facts */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckSquare className="h-3.5 w-3.5" /> Verified Observations
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {report.knownFacts?.map((fact, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-emerald-500 select-none">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Evidence */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Missing Evidence / Information Gaps
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {report.missingEvidence?.map((gap, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-rose-500 select-none">•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mystery Object Engine Indicator (Conditional) */}
          {report.mysteryObjectAnalysis?.isMystery && (
            <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-display font-bold text-amber-400">Mystery Object Core Engaged</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                  <div className="text-slate-500 text-[10px] font-mono">OBSERVED PATINA &amp; MATERIAL</div>
                  <div className="mt-1 leading-relaxed">{report.mysteryObjectAnalysis.materialNotes}</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                  <div className="text-slate-500 text-[10px] font-mono">FABRICATION DETAILS</div>
                  <div className="mt-1 leading-relaxed">{report.mysteryObjectAnalysis.constructionNotes}</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                  <div className="text-slate-500 text-[10px] font-mono">AUTHENTIC ERA INDICATIONS</div>
                  <div className="mt-1 leading-relaxed">{report.mysteryObjectAnalysis.ageIndicators}</div>
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-xs">
                <span className="text-amber-400 font-mono font-semibold">SUGGESTED DISCOVERY TRAJECTORY:</span> {report.mysteryObjectAnalysis.nextSteps}
              </div>
            </div>
          )}

          {/* Comparable Sales */}
          <div className="bg-[#11161d] border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Historical Comparable Sales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {report.comparableSales?.map((comp, idx) => (
                <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex flex-col justify-between text-xs space-y-3">
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-200 line-clamp-1">{comp.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                      <span>Source: {comp.source}</span>
                      <span>Date: {comp.date}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-slate-900">
                    <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-indigo-400 font-mono">
                      Match: {comp.similarity}
                    </span>
                    <span className="text-base font-extrabold font-mono text-emerald-400">
                      ${comp.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
