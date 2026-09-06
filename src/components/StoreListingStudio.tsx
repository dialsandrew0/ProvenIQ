import React, { useState } from "react";
import { TrackedItem, GeneratedStorePosting } from "../types";
import { Tag, DollarSign, Copy, Check, Sparkles, ExternalLink, Globe, ShoppingBag, Share2, Layers, Award, FileText } from "lucide-react";

interface StoreListingStudioProps {
  inventoryItems?: TrackedItem[];
  onLoggedSale?: (item: any) => void;
}

export default function StoreListingStudio({ inventoryItems = [], onLoggedSale }: StoreListingStudioProps) {
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [customTitle, setCustomTitle] = useState("");
  const [category, setCategory] = useState("Antiques & Collectibles");
  const [condition, setCondition] = useState("Excellent Vintage Condition (Pristine Patina)");
  const [originalCost, setOriginalCost] = useState<number>(35);
  const [estimatedRetail, setEstimatedRetail] = useState<number>(250);
  const [itemContext, setItemContext] = useState("");
  
  const [generating, setGenerating] = useState(false);
  const [posting, setPosting] = useState<GeneratedStorePosting | null>(null);
  const [copied, setCopied] = useState(false);

  // When an inventory item is selected
  const handleSelectInventoryItem = (id: string) => {
    setSelectedItemId(id);
    const item = inventoryItems.find((i) => i.id === id);
    if (item) {
      setCustomTitle(item.title);
      setOriginalCost(item.purchasePrice || item.myCurrentBid || 35);
      if (item.channelPricing?.ebayEst) {
        setEstimatedRetail(item.channelPricing.ebayEst);
      }
    }
  };

  const handleGenerateListings = async () => {
    setGenerating(true);
    setCopied(false);

    // Simulate AI optimization steps
    await new Promise((res) => setTimeout(res, 1200));

    const basePrice = estimatedRetail || 200;

    const generated: GeneratedStorePosting = {
      title: customTitle
        ? `VINTAGE ${customTitle.toUpperCase()} - Authentic Rare Find`
        : "VINTAGE MCM TEAK CREDENZA - Mid Century Scandinavian Danish Design",
      recommendedPlatform: basePrice > 500 ? "Specialty House / LiveAuctioneers" : basePrice > 100 ? "eBay" : "Facebook Marketplace",
      recommendedPrice: basePrice,
      pricePerChannel: {
        ebay: Math.round(basePrice * 1.1), // higher to cover 13% fees & shipping standard
        fbMarketplace: Math.round(basePrice * 0.88), // lower for fast local cash pickup
        specialtyHouse: Math.round(basePrice * 1.3) // premium for curated catalog buyers
      },
      conditionGrade: condition,
      description: `AUTHENTIC VINTAGE COLLECTIBLE

ITEM SPECIFICATIONS & CONDITION:
• Item Name: ${customTitle || "Mid Century Teak Credenza"}
• Category: ${category}
• Physical Condition: ${condition}
• Details & Provenance: ${itemContext || "Inspected for authenticity. Clean joins, original hardware intact, no structural damage."}

PRICING & SHIPPING:
• Well-packed with heavy foam protection & tracked shipping.
• Local pickup available by appointment.

SERIOUS COLLECTORS ONLY - Rare piece in exceptional surviving state.`,
      hashtags: ["#VintageFinds", "#EstateSaleFinds", "#MidCenturyModern", "#AntiquesDealer", "#CollectorItem", "#ThriftStoreFinds"],
      listingNotes: "Pro-Tip: Post on Facebook Marketplace for quick local cash pickup. Use eBay with 'Buy It Now + Best Offer' set to $20 above minimum."
    };

    setPosting(generated);
    setGenerating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#11161d] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-amber-400" />
              Store &amp; Multi-Channel Selling Studio
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select items from your In-Hand Inventory or enter custom sourced treasures to generate channel-specific pricing (eBay, Facebook Marketplace, Specialty Auction) and platform-optimized listings.
            </p>
          </div>

          <div className="bg-amber-500/10 px-3.5 py-1.5 rounded-xl border border-amber-500/30 text-xs font-mono text-amber-300 font-bold shrink-0 flex items-center gap-1.5">
            <DollarSign className="h-4 w-4" /> Multi-Channel Price Arbitrage
          </div>
        </div>

        {/* Input & Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-mono">
          {/* Select from Inventory */}
          <div className="space-y-1.5">
            <label className="block text-slate-400 font-semibold uppercase tracking-wider">
              Import from In-Hand Inventory
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => handleSelectInventoryItem(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="">-- Choose In-Hand Item ({inventoryItems.length}) --</option>
              {inventoryItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} (Cost: ${item.purchasePrice || item.currentBid})
                </option>
              ))}
            </select>
          </div>

          {/* Title input */}
          <div className="space-y-1.5">
            <label className="block text-slate-400 font-semibold uppercase tracking-wider">
              Item Title / Name
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. Marantz 2270 Stereo Receiver or Teak Side Table"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-slate-400 font-semibold uppercase tracking-wider">
              Sourcing Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Furniture / MCM">Furniture &amp; Mid-Century Modern</option>
              <option value="Fine Jewelry & Silver">Fine Jewelry &amp; Sterling Silver</option>
              <option value="Vintage Audio & Electronics">Vintage Audio &amp; Hi-Fi</option>
              <option value="Fine Art & Lithos">Fine Art, Prints &amp; Lithos</option>
              <option value="Tools & Machining">Machinist Tools &amp; Hardware</option>
              <option value="Antiques & Collectibles">Antiques &amp; Collectibles</option>
            </select>
          </div>

          {/* Cost Basis & Est Retail */}
          <div className="space-y-1.5">
            <label className="block text-slate-400 font-semibold uppercase tracking-wider">
              Your Cost Basis ($)
            </label>
            <input
              type="number"
              value={originalCost}
              onChange={(e) => setOriginalCost(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-400 font-semibold uppercase tracking-wider">
              Target Est. Retail ($)
            </label>
            <input
              type="number"
              value={estimatedRetail}
              onChange={(e) => setEstimatedRetail(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-400 font-semibold uppercase tracking-wider">
              Condition Grade
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Mint / New Old Stock">Mint / New Old Stock</option>
              <option value="Excellent Vintage Condition (Pristine Patina)">Excellent Vintage Condition</option>
              <option value="Good Condition (Minor Surface Wear)">Good Condition (Minor Wear)</option>
              <option value="Restored / Refinished">Restored / Refinished</option>
              <option value="As-Is / For Parts or Restoration">As-Is / Project Piece</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
            Key Features, Stamps, Hallmarks or Provenance Notes
          </label>
          <textarea
            rows={2}
            value={itemContext}
            onChange={(e) => setItemContext(e.target.value)}
            placeholder="e.g. Stamped with Danish Control button on underside, original walnut oil finish intact."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono resize-none"
          />
        </div>

        <button
          onClick={handleGenerateListings}
          disabled={generating}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold rounded-xl py-3.5 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-mono"
        >
          {generating ? (
            <span className="animate-pulse flex items-center gap-2">
              <Sparkles className="h-4 w-4 animate-spin" /> Optimizing Multi-Channel Listings &amp; Pricing...
            </span>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Generate Channel Listings &amp; Pricing Matrix
            </>
          )}
        </button>
      </div>

      {/* Generated Output */}
      {posting && (
        <div className="bg-[#11161d] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                RECOMMENDED BEST CHANNEL
              </div>
              <h3 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2 mt-0.5">
                <Award className="h-5 w-5 text-amber-400" /> {posting.recommendedPlatform}
              </h3>
            </div>

            <button
              onClick={() => copyToClipboard(`${posting.title}\n\n${posting.description}\n\n${posting.hashtags.join(" ")}`)}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" /> Copied Full Listing!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy Full Listing to Clipboard
                </>
              )}
            </button>
          </div>

          {/* Pricing Per Channel Matrix */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Pricing Strategy per Platform
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
              {/* eBay */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5" /> eBay (Worldwide)
                  </span>
                  <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    +13% Fee Factor
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-slate-100">${posting.pricePerChannel.ebay}</div>
                <div className="text-[11px] text-emerald-400 font-bold">
                  Est. Net Profit: +${posting.pricePerChannel.ebay - originalCost - Math.round(posting.pricePerChannel.ebay * 0.13)}
                </div>
              </div>

              {/* FB Marketplace */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-sky-400 flex items-center gap-1">
                    <Share2 className="h-3.5 w-3.5" /> FB Marketplace
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                    Zero Fees / Fast Cash
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-slate-100">${posting.pricePerChannel.fbMarketplace}</div>
                <div className="text-[11px] text-emerald-400 font-bold">
                  Est. Net Profit: +${posting.pricePerChannel.fbMarketplace - originalCost}
                </div>
              </div>

              {/* Specialty Auction */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" /> Specialty Auction
                  </span>
                  <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                    Curated Collectors
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-amber-300">${posting.pricePerChannel.specialtyHouse}</div>
                <div className="text-[11px] text-emerald-400 font-bold">
                  Est. Net Profit: +${posting.pricePerChannel.specialtyHouse - originalCost - Math.round(posting.pricePerChannel.specialtyHouse * 0.15)}
                </div>
              </div>
            </div>
          </div>

          {/* Formatted Listing Copy */}
          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Generated Optimized Title</label>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-amber-300 font-bold select-all">
                {posting.title}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Generated Body Description &amp; Condition Report</label>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 whitespace-pre-wrap font-mono text-xs leading-relaxed select-all">
                {posting.description}
              </pre>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Recommended Collector Hashtags</label>
              <div className="flex flex-wrap gap-2">
                {posting.hashtags.map((tag, idx) => (
                  <span key={idx} className="bg-slate-900 text-indigo-300 px-2.5 py-1 rounded-lg border border-slate-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/30 text-amber-300 text-[11px]">
              <strong>Strategic Advice:</strong> {posting.listingNotes}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
