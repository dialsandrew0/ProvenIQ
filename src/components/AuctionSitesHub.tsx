import React, { useState } from "react";
import { SleeperGem, CTBidsWatchlistItem, CTBidsAccountConfig, TrackedItem, LotItemBreakdown, CTBidsLotInspectionResult } from "../types";
import { 
  Search, Sparkles, Flame, Tag, Check, RefreshCw, ExternalLink, Globe, MapPin, Clock, 
  Truck, Bookmark, Eye, ShieldCheck, Building2, AlertTriangle, Layers, ArrowUpRight,
  Calculator, CheckCircle2, XCircle, Info, DollarSign, Zap, ArrowRight, ShieldAlert,
  Camera
} from "lucide-react";

interface AuctionSitesHubProps {
  onLoggedPurchase?: (item: any) => void;
  onTrackItem?: (item: TrackedItem) => void;
  onSendToAppraisal?: (item: { title: string; image?: string; notes?: string }) => void;
  selectedNicheFilter?: string;
}

// Sample CTBids Watchlist initial mock items with full AI bid analysis
const mockWatchlistData: CTBidsWatchlistItem[] = [
  {
    id: "wl-101",
    lotNumber: "CTB-90281",
    title: "Vintage Danish Teak Slide Door Sideboard Credenza",
    currentBid: 65,
    myMaxBid: 350,
    recommendedMaxBid: 350,
    estValue: 1850,
    endTime: "Today at 7:15 PM EST",
    imageUrl: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80",
    lotUrl: "https://ctbids.com/search?keyword=teak+sideboard",
    directItemLink: "https://ctbids.com/search?keyword=Danish+Teak+Credenza+Faarup",
    itemCompsLink: "https://www.ebay.com/sch/i.html?_nkw=Faarup+Mobelfabrik+Teak+Credenza&_lh=1&LH_Complete=1&LH_Sold=1",
    willShip: true,
    location: "Los Angeles, CA (Local or Ships)",
    distanceMiles: 12,
    isSleeperGem: true,
    biddingEquation: "($1,850 Resale × 0.25 Target Capital) - $30 Pickup = $350 Maximum Suggested Bid",
    gemAnalysis: {
      id: "wl-101-gem",
      itemName: "Ib Kofod-Larsen Teak Credenza",
      listedTitle: "Vintage Danish Teak Slide Door Sideboard Credenza",
      askingPrice: 65,
      estimatedValue: 1850,
      profitGap: 1785,
      roiMultiple: 28.4,
      gemScore: 97,
      niche: "Furniture / MCM",
      sleeperReason: "Omitted Faarup Møbelfabrik designer name from title. Unstamped burn mark inside drawer.",
      hallmarkToCheck: "Look inside top left drawer for gold Faarup Møbelfabrik stamp.",
      verdict: "GOD-TIER GEM",
      riskLevel: "Low",
      actionSteps: ["Increase max bid to $350 before auction close", "Arrange white-glove pickup or freight shipping"]
    }
  },
  {
    id: "wl-102",
    lotNumber: "CTB-88310",
    title: "Marantz Model 2230 Vintage Stereo Receiver & Wooden Case",
    currentBid: 40,
    myMaxBid: 220,
    recommendedMaxBid: 220,
    estValue: 820,
    endTime: "Tomorrow at 8:30 PM EST",
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
    lotUrl: "https://ctbids.com/search?keyword=marantz+receiver",
    directItemLink: "https://ctbids.com/search?keyword=Marantz+2230+Receiver",
    itemCompsLink: "https://www.ebay.com/sch/i.html?_nkw=Marantz+2230+Receiver+WC-22&_lh=1&LH_Complete=1&LH_Sold=1",
    willShip: true,
    location: "Pasadena, CA (Will Ship)",
    distanceMiles: 18,
    isSleeperGem: true,
    biddingEquation: "($820 Resale × 0.30 Target) - $25 Shipping = $220 Maximum Suggested Bid",
    gemAnalysis: {
      id: "wl-102-gem",
      itemName: "Marantz Model 2230 Receiver",
      listedTitle: "Marantz Model 2230 Vintage Stereo Receiver & Wooden Case",
      askingPrice: 40,
      estimatedValue: 820,
      profitGap: 780,
      roiMultiple: 20.5,
      gemScore: 94,
      niche: "Vintage Audio & Electronics",
      sleeperReason: "Includes rare walnut WC-22 cabinet worth $250 alone. Listed as generic audio amp.",
      hallmarkToCheck: "Check rear serial plate and gyro-wheel tuning feel.",
      verdict: "TREASURE BUY",
      riskLevel: "Low",
      actionSteps: ["Set max bid $220", "Request bubble wrap shipping"]
    }
  },
  {
    id: "wl-103",
    lotNumber: "CTB-77419",
    title: "Heavy Sterling Silver Flatware & Serving Spoons Lot (925 Marked)",
    currentBid: 85,
    myMaxBid: 600,
    recommendedMaxBid: 600,
    estValue: 1400,
    endTime: "In 2 Days (Thu 6:00 PM)",
    imageUrl: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=600&q=80",
    lotUrl: "https://ctbids.com/search?keyword=sterling+flatware",
    directItemLink: "https://ctbids.com/search?keyword=Towle+Old+Master+Sterling+Flatware",
    itemCompsLink: "https://www.ebay.com/sch/i.html?_nkw=Towle+Old+Master+Sterling+Silver+Flatware&_lh=1&LH_Complete=1&LH_Sold=1",
    willShip: true,
    location: "Dallas, TX (Will Ship)",
    distanceMiles: 45,
    isSleeperGem: true,
    biddingEquation: "Silver Melt Floor $980 + Collectible Premium = $600 Max Bid (Zero Downside)",
    gemAnalysis: {
      id: "wl-103-gem",
      itemName: "Towle Old Master Sterling Flatware Set",
      listedTitle: "Heavy Sterling Silver Flatware & Serving Spoons Lot (925 Marked)",
      askingPrice: 85,
      estimatedValue: 1400,
      profitGap: 1315,
      roiMultiple: 16.4,
      gemScore: 98,
      niche: "Fine Jewelry & Precious Metals",
      sleeperReason: "Total silver scrap melt weight is ~1,200g. Melt value floor alone is $980.",
      hallmarkToCheck: "Look for 'Towle Sterling .925' hallmark on back handle necks.",
      verdict: "GOD-TIER GEM",
      riskLevel: "Ultra Low",
      actionSteps: ["Bid aggressively up to $600", "Instant liquidity via refinery or eBay silver buyers"]
    }
  },
  {
    id: "wl-104",
    lotNumber: "CTB-65022",
    title: "L.S. Starrett Precision Micrometers & Machinist Gauges Box",
    currentBid: 20,
    myMaxBid: 85,
    recommendedMaxBid: 85,
    estValue: 280,
    endTime: "In 3 Days",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    lotUrl: "https://ctbids.com/search?keyword=starrett+micrometer",
    directItemLink: "https://ctbids.com/search?keyword=Starrett+Precision+Micrometer",
    itemCompsLink: "https://www.ebay.com/sch/i.html?_nkw=Starrett+Precision+Micrometer+Set&_lh=1&LH_Complete=1&LH_Sold=1",
    willShip: true,
    location: "Phoenix, AZ (Will Ship)",
    distanceMiles: 30,
    isSleeperGem: true,
    biddingEquation: "($280 Resale × 0.35 Target) = $85 Maximum Suggested Bid",
    gemAnalysis: {
      id: "wl-104-gem",
      itemName: "Starrett No. 226 Machinist Micrometer Set",
      listedTitle: "L.S. Starrett Precision Micrometers & Machinist Gauges Box",
      askingPrice: 20,
      estimatedValue: 280,
      profitGap: 260,
      roiMultiple: 14.0,
      gemScore: 89,
      niche: "Tools & Industrial Collectibles",
      sleeperReason: "Includes complete wooden presentation case and carbide tipped spindle.",
      hallmarkToCheck: "Verify ratchet thimble smoothness and zero calibration line.",
      verdict: "STRONG BUY",
      riskLevel: "Low",
      actionSteps: ["Set proxy bid of $85", "Verify case hinges intact"]
    }
  },
  {
    id: "wl-105",
    lotNumber: "CTB-41109",
    title: "Vintage Le Creuset Enamel Cast Iron Dutch Oven #26 Flame Orange",
    currentBid: 35,
    myMaxBid: 110,
    recommendedMaxBid: 110,
    estValue: 320,
    endTime: "Ends in 4 Days",
    imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80",
    lotUrl: "https://ctbids.com/search?keyword=le+creuset+orange",
    directItemLink: "https://ctbids.com/search?keyword=Le+Creuset+Flame+Orange+Dutch+Oven",
    itemCompsLink: "https://www.ebay.com/sch/i.html?_nkw=Vintage+Le+Creuset+Flame+Orange+26+Dutch+Oven&_lh=1&LH_Complete=1&LH_Sold=1",
    willShip: true,
    location: "San Jose, CA (Will Ship)",
    distanceMiles: 22,
    isSleeperGem: true,
    biddingEquation: "($320 Resale × 0.35 Target) - $15 Shipping = $110 Maximum Suggested Bid",
    gemAnalysis: {
      id: "wl-105-gem",
      itemName: "Le Creuset #26 Flame Dutch Oven",
      listedTitle: "Vintage Le Creuset Enamel Cast Iron Dutch Oven #26 Flame Orange",
      askingPrice: 35,
      estimatedValue: 320,
      profitGap: 285,
      roiMultiple: 9.1,
      gemScore: 91,
      niche: "Kitchenware & Vintage Cookware",
      sleeperReason: "Original French production with pristine interior enamel coating and ribbed lid knob.",
      hallmarkToCheck: "Look for 'MADE IN FRANCE' and '26' embossed on underside of lid.",
      verdict: "TREASURE BUY",
      riskLevel: "Low",
      actionSteps: ["Set proxy bid $110", "Confirm interior enamel has no chips"]
    }
  }
];

export default function AuctionSitesHub({ onLoggedPurchase, onTrackItem, onSendToAppraisal, selectedNicheFilter }: AuctionSitesHubProps) {
  const [platformTab, setPlatformTab] = useState<"ctbids" | "hibid" | "liveauctioneers" | "estatesales" | "govdeals">("ctbids");
  
  // CTBids Sub-modes
  const [ctbidsSubMode, setCtbidsSubMode] = useState<"watchlist" | "lot-url" | "radius-search">("watchlist");
  const [lotQuery, setLotQuery] = useState("");
  const [lotResult, setLotResult] = useState<any>(null);
  const [searchingLot, setSearchingLot] = useState(false);
  
  // Location / Radius Search State
  const [liveLocation, setLiveLocation] = useState("90210");
  const [searchRadiusMiles, setSearchRadiusMiles] = useState(25);
  const [shippingOnlyFilter, setShippingOnlyFilter] = useState(false);
  const [liveQuery, setLiveQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [watchlistItems, setWatchlistItems] = useState<CTBidsWatchlistItem[]>(mockWatchlistData);
  const [syncingWatchlist, setSyncingWatchlist] = useState(false);
  const [watchlistSearch, setWatchlistSearch] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState<string>("Just now");

  const handleSyncWatchlist = async () => {
    setSyncingWatchlist(true);
    try {
      const res = await fetch("/api/ctbids/sync-watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountName: "CTBids Verified Collector" })
      });
      const data = await res.json();
      if (data && data.watchlist) {
        setWatchlistItems(data.watchlist);
        setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.warn("Watchlist sync notice:", err);
    } finally {
      setSyncingWatchlist(false);
    }
  };

  const filteredWatchlist = watchlistItems.filter((item) => {
    if (!watchlistSearch.trim()) return true;
    const q = watchlistSearch.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.lotNumber.toLowerCase().includes(q) ||
      (item.gemAnalysis?.niche || "").toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
    );
  });

  // HiBid specific state
  const [hibidLotUrl, setHibidLotUrl] = useState("");
  const [hibidResult, setHibidResult] = useState<any>(null);
  
  // LiveAuctioneers state
  const [artQuery, setArtQuery] = useState("");
  const [artResult, setArtResult] = useState<any>(null);

  // EstateSales.net state
  const [saleZip, setSaleZip] = useState("90210");
  
  // GovDeals state
  const [govQuery, setGovQuery] = useState("");

  const handleInspectCtbidsLot = async () => {
    if (!lotQuery) return;
    setSearchingLot(true);

    try {
      const res = await fetch("/api/ctbids/search-lot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lotQuery,
          zipCode: liveLocation,
          radiusMiles: searchRadiusMiles,
          willShipOnly: shippingOnlyFilter
        })
      });
      const data = await res.json();
      if (data && data.result) {
        setLotResult(data.result);
      }
    } catch (err) {
      console.warn("Lot search notice:", err);
    } finally {
      setSearchingLot(false);
    }
  };

  const handleInspectHibid = async () => {
    if (!hibidLotUrl) return;
    setSearchingLot(true);
    await new Promise((r) => setTimeout(r, 1000));
    setHibidResult({
      title: "HiBid Soft-Close Lot: Starrett Machinist Precision Gauge Set",
      currentBid: 18,
      estValue: 240,
      softCloseTimer: "14m 20s remaining (3m extension rule)",
      auctioneerRating: "4.9/5 (1,240 Sales)",
      lotUrl: hibidLotUrl.includes("http") ? hibidLotUrl : `https://hibid.com/lot/${hibidLotUrl}`
    });
    setSearchingLot(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#11161d] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
              <Globe className="h-5.5 w-5.5 text-amber-400" />
              Estate Sale &amp; Auction Platform Hub
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Dedicated landing spots customized to each major estate auction portal. Watchlist auto-sync, direct lot URL inspection, radius search, soft-close sniper timing, and hammer price archives.
            </p>
          </div>

          <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" /> Multi-Site Sourcing Radar
          </span>
        </div>

        {/* Site Platform Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono font-bold">
          <button
            onClick={() => setPlatformTab("ctbids")}
            className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
              platformTab === "ctbids"
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/10"
                : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900"
            }`}
          >
            <Bookmark className="h-4 w-4 text-amber-400" /> CTBids Hub
          </button>

          <button
            onClick={() => setPlatformTab("hibid")}
            className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
              platformTab === "hibid"
                ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900"
            }`}
          >
            <Clock className="h-4 w-4 text-indigo-400" /> HiBid Soft-Close
          </button>

          <button
            onClick={() => setPlatformTab("liveauctioneers")}
            className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
              platformTab === "liveauctioneers"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900"
            }`}
          >
            <Building2 className="h-4 w-4 text-emerald-400" /> LiveAuctioneers
          </button>

          <button
            onClick={() => setPlatformTab("estatesales")}
            className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
              platformTab === "estatesales"
                ? "bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-lg shadow-purple-500/10"
                : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900"
            }`}
          >
            <MapPin className="h-4 w-4 text-purple-400" /> EstateSales.net
          </button>

          <button
            onClick={() => setPlatformTab("govdeals")}
            className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
              platformTab === "govdeals"
                ? "bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-lg shadow-sky-500/10"
                : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900"
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-sky-400" /> GovDeals Surplus
          </button>
        </div>
      </div>

      {/* PLATFORM 1: CTBIDS HUB */}
      {platformTab === "ctbids" && (
        <div className="bg-[#11161d] rounded-2xl border border-amber-500/30 p-6 shadow-xl space-y-5">
          <div className="flex gap-2 text-xs font-mono border-b border-slate-800 pb-3 overflow-x-auto">
            <button
              onClick={() => setCtbidsSubMode("watchlist")}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                ctbidsSubMode === "watchlist"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-slate-950 text-slate-400 hover:bg-slate-900"
              }`}
            >
              <Bookmark className="h-3.5 w-3.5 text-amber-400" /> CTBids Watchlist Auto-Sync ({watchlistItems.length})
            </button>

            <button
              onClick={() => setCtbidsSubMode("lot-url")}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                ctbidsSubMode === "lot-url"
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                  : "bg-slate-950 text-slate-400 hover:bg-slate-900"
              }`}
            >
              <Search className="h-3.5 w-3.5 text-indigo-400" /> Direct CTBids Lot URL Inspector
            </button>

            <button
              onClick={() => setCtbidsSubMode("radius-search")}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                ctbidsSubMode === "radius-search"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-950 text-slate-400 hover:bg-slate-900"
              }`}
            >
              <MapPin className="h-3.5 w-3.5 text-emerald-400" /> Location &amp; Distance Radius Search
            </button>
          </div>

          {/* Sub-mode 1: Watchlist */}
          {ctbidsSubMode === "watchlist" && (
            <div className="space-y-5">
              {/* Watchlist Header Toolbar */}
              <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        <Bookmark className="h-4 w-4 text-amber-400" /> Synced CTBids Watchlist
                      </h3>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Auto-Sync Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Listing all items on your CTBids watchlist with AI bid suggestions, mathematical budget equations, and direct item links.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleSyncWatchlist}
                      disabled={syncingWatchlist}
                      className="w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/10"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${syncingWatchlist ? "animate-spin text-amber-400" : ""}`} />
                      {syncingWatchlist ? "Syncing Watchlist..." : "Sync CTBids Account"}
                    </button>
                  </div>
                </div>

                {/* Stats summary & Search Filter Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-900">
                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] text-slate-500 uppercase font-mono font-bold">Watchlist Items</div>
                      <div className="text-sm font-bold text-slate-200">{watchlistItems.length} Lots Tracked</div>
                    </div>
                    <Bookmark className="h-4 w-4 text-amber-400" />
                  </div>

                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] text-slate-500 uppercase font-mono font-bold">Projected Net Margin</div>
                      <div className="text-sm font-bold text-emerald-400">
                        +${watchlistItems.reduce((acc, item) => acc + (item.estValue - item.currentBid), 0).toLocaleString()}
                      </div>
                    </div>
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                      <input
                        type="text"
                        value={watchlistSearch}
                        onChange={(e) => setWatchlistSearch(e.target.value)}
                        placeholder="Filter watchlist by keyword, lot #, or category..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Watchlist Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredWatchlist.map((item) => {
                  const recommendedBid = item.recommendedMaxBid || item.myMaxBid || Math.round(item.estValue * 0.35);
                  const profitMargin = item.estValue - item.currentBid;
                  const gem = item.gemAnalysis;

                  return (
                    <div key={item.id} className="bg-slate-950 rounded-2xl border border-slate-800 hover:border-amber-500/40 p-5 space-y-4 shadow-xl transition-all">
                      {/* Card Header: Lot #, Location & Gem Badges */}
                      <div className="flex justify-between items-start gap-2 border-b border-slate-900 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 uppercase font-bold">
                              {item.lotNumber}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-amber-400" /> {item.location}
                            </span>
                            {item.willShip && (
                              <span className="text-[9px] font-mono bg-sky-500/10 text-sky-300 px-1.5 py-0.5 rounded border border-sky-500/30 flex items-center gap-1">
                                <Truck className="h-2.5 w-2.5" /> Ships
                              </span>
                            )}
                          </div>
                        </div>

                        {gem && (
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                              gem.verdict === "GOD-TIER GEM"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-md shadow-amber-500/10"
                                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            }`}>
                              {gem.verdict}
                            </span>
                            <span className="text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800 px-1.5 py-0.5 rounded font-bold">
                              {gem.gemScore}/100
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Thumbnail Image + Title */}
                      <div className="flex gap-4 items-start">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-xl border border-slate-800 bg-slate-900 shrink-0"
                        />
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-slate-100 leading-snug line-clamp-2">
                            {item.title}
                          </h3>
                          <div className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {item.endTime}
                          </div>
                          {gem?.niche && (
                            <div className="text-[10px] text-slate-400 font-mono">
                              Category: <span className="text-slate-200">{gem.niche}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Financial Metrics 4-Grid */}
                      <div className="grid grid-cols-4 gap-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center font-mono text-xs">
                        <div>
                          <div className="text-[8px] text-slate-500 uppercase">Current Bid</div>
                          <div className="text-xs font-bold text-slate-200">${item.currentBid}</div>
                        </div>
                        <div>
                          <div className="text-[8px] text-slate-500 uppercase">Est Resale</div>
                          <div className="text-xs font-bold text-slate-300">${item.estValue}</div>
                        </div>
                        <div className="bg-amber-500/10 rounded-lg p-1 border border-amber-500/20">
                          <div className="text-[8px] text-amber-400 uppercase font-bold">Target Max Bid</div>
                          <div className="text-xs font-extrabold text-amber-300">${recommendedBid}</div>
                        </div>
                        <div>
                          <div className="text-[8px] text-slate-500 uppercase">Profit Gap</div>
                          <div className="text-xs font-bold text-emerald-400">+${profitMargin}</div>
                        </div>
                      </div>

                      {/* AI Bidding Strategy & Equation Box */}
                      <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 p-3 space-y-2 text-xs">
                        {item.biddingEquation && (
                          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-[11px] font-mono text-amber-300/90 flex items-start gap-1.5">
                            <Calculator className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-slate-400">Target Capital Formula: </span>
                              {item.biddingEquation}
                            </div>
                          </div>
                        )}

                        {gem?.sleeperReason && (
                          <div className="text-slate-300 text-[11px] leading-relaxed flex items-start gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-slate-100">Tactical Sleeper Analysis: </span>
                              {gem.sleeperReason}
                            </div>
                          </div>
                        )}

                        {gem?.hallmarkToCheck && (
                          <div className="text-slate-400 text-[11px] flex items-start gap-1.5">
                            <Eye className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-indigo-300">Hallmarks to Check: </span>
                              {gem.hallmarkToCheck}
                            </div>
                          </div>
                        )}

                        {gem?.actionSteps && gem.actionSteps.length > 0 && (
                          <div className="pt-1 border-t border-slate-800/60 flex items-center gap-2 text-[10px] font-mono text-emerald-300">
                            <Zap className="h-3 w-3 text-emerald-400 shrink-0" />
                            <span>
                              <strong>Next Action:</strong> {gem.actionSteps.join(" • ")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Direct Links & Bidding Tracker Actions */}
                      <div className="space-y-2 pt-1">
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                          <a
                            href={item.directItemLink || item.lotUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all text-center font-bold"
                          >
                            <ExternalLink className="h-3.5 w-3.5" /> Direct CTBids Link
                          </a>

                          <a
                            href={item.itemCompsLink || `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(item.title)}&_lh=1&LH_Complete=1&LH_Sold=1`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 flex items-center justify-center gap-1.5 transition-all text-center font-bold"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5 text-indigo-400" /> eBay Sold Comps
                          </a>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {onTrackItem && (
                            <button
                              onClick={() =>
                                onTrackItem({
                                  id: `ctb-tr-${Date.now()}`,
                                  title: item.title,
                                  platform: "ctbids",
                                  platformUrl: item.directItemLink || item.lotUrl,
                                  imageUrl: item.imageUrl,
                                  currentBid: item.currentBid,
                                  myMaxBudget: recommendedBid,
                                  myCurrentBid: item.currentBid,
                                  endTime: item.endTime,
                                  status: "bidding",
                                  dateAdded: new Date().toISOString().split("T")[0],
                                  bidHistory: []
                                })
                              }
                              className="py-2.5 px-3 rounded-xl text-xs font-mono font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-indigo-600/20"
                            >
                              <Bookmark className="h-3.5 w-3.5 text-amber-300" /> Track in Bidding (${recommendedBid})
                            </button>
                          )}

                          {onSendToAppraisal && (
                            <button
                              onClick={() =>
                                onSendToAppraisal({
                                  title: item.title,
                                  image: item.imageUrl,
                                  notes: `CTBids Lot ${item.lotNumber} in ${item.location}. Current bid: $${item.currentBid}. Sleeper reason: ${item.gemAnalysis?.sleeperReason || "Check hallmarks"}`
                                })
                              }
                              className="py-2.5 px-3 rounded-xl text-xs font-mono font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center justify-center gap-1.5 transition-all"
                            >
                              <Camera className="h-3.5 w-3.5 text-amber-400" /> Send to Optical Appraisal
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-mode 2: Lot URL Inspector */}
          {ctbidsSubMode === "lot-url" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-medium mb-1">Direct CTBids Lot URL or ID</label>
                  <input
                    type="text"
                    value={lotQuery}
                    onChange={(e) => setLotQuery(e.target.value)}
                    placeholder="e.g. https://ctbids.com/lot/104 or CTB-9021"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleInspectCtbidsLot}
                    disabled={searchingLot}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl py-2.5 px-4 shadow-lg shadow-indigo-600/20 transition-all font-mono text-xs uppercase"
                  >
                    {searchingLot ? "Inspecting..." : "Inspect CTBids Lot"}
                  </button>
                </div>
              </div>

              {lotResult && (
                <div className="bg-slate-950 rounded-2xl border border-indigo-500/40 p-5 space-y-6 font-mono text-xs">
                  {/* Lot Summary Top Bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-bold uppercase">
                          {lotResult.lotNumber || "Lot Details"}
                        </span>
                        {lotResult.location && (
                          <span className="text-slate-400 text-[11px] flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-amber-400" /> {lotResult.location}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-100 mt-1">{lotResult.title}</h3>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={lotResult.lotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all text-xs shadow-md"
                      >
                        <ExternalLink className="h-4 w-4" /> 📦 Direct Link to Full Lot Page
                      </a>
                    </div>
                  </div>

                  {/* 4-Metric Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-center">
                    <div>
                      <div className="text-[10px] text-slate-500">CURRENT BID</div>
                      <div className="text-base font-bold text-slate-200">${lotResult.currentBid}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">EST TOTAL RESALE</div>
                      <div className="text-base font-bold text-amber-300">${lotResult.estimatedValue}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">RECOMMENDED MAX BID</div>
                      <div className="text-base font-bold text-indigo-400">${lotResult.lotBiddingEquation?.recommendedMaxLotBid ?? Math.round(lotResult.estimatedValue * 0.3)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">EST PROFIT GAP</div>
                      <div className="text-base font-bold text-emerald-400">+${lotResult.profitGap}</div>
                    </div>
                  </div>

                  {/* Lot Bidding Equation Box */}
                  {lotResult.lotBiddingEquation && (
                    <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                        <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase">
                          <Calculator className="h-4 w-4 text-indigo-400" /> Master Lot Bidding Equation &amp; Valuation Formula
                        </div>
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 font-mono">
                          Target Yield Standard
                        </span>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-indigo-500/20 text-indigo-200 font-mono text-xs leading-relaxed">
                        <span className="text-slate-400 block text-[10px] uppercase mb-1 font-bold">Mathematical Equation:</span>
                        {lotResult.lotBiddingEquation.equationFormula}
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl">
                        <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                          <Zap className="h-4 w-4 text-emerald-400 shrink-0" />
                          <span>{lotResult.lotBiddingEquation.verdictSummary}</span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {onTrackItem && (
                            <button
                              onClick={() =>
                                onTrackItem({
                                  id: `ctb-lot-${Date.now()}`,
                                  title: lotResult.title,
                                  platform: "ctbids",
                                  platformUrl: lotResult.lotUrl,
                                  imageUrl: lotResult.imageUrl,
                                  currentBid: lotResult.currentBid,
                                  myMaxBudget: lotResult.lotBiddingEquation?.recommendedMaxLotBid || 300,
                                  myCurrentBid: lotResult.currentBid,
                                  endTime: "In Progress",
                                  status: "bidding",
                                  dateAdded: new Date().toISOString().split("T")[0],
                                  bidHistory: []
                                })
                              }
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all shadow-md shrink-0 text-xs font-mono"
                            >
                              <Bookmark className="h-3.5 w-3.5" /> Carry to Bidding Tracker
                            </button>
                          )}

                          {onSendToAppraisal && (
                            <button
                              onClick={() =>
                                onSendToAppraisal({
                                  title: lotResult.title,
                                  image: lotResult.imageUrl,
                                  notes: `CTBids Lot ${lotResult.lotNumber}. Location: ${lotResult.location}. Current bid: $${lotResult.currentBid}. Est. total value: $${lotResult.estimatedLotValue}`
                                })
                              }
                              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all shrink-0 text-xs font-mono"
                            >
                              <Camera className="h-3.5 w-3.5 text-amber-400" /> Send to Optical Appraisal
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Granular Per-Item Breakdown in Lot */}
                  {lotResult.itemsBreakdown && lotResult.itemsBreakdown.length > 0 && (
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <h4 className="text-xs font-bold text-amber-300 uppercase flex items-center gap-2">
                          <Layers className="h-4 w-4 text-amber-400" />
                          Lot Item Breakdown &amp; Direct Item Links ({lotResult.itemsBreakdown.length} Items Detected)
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          Direct links to each individual item vs full lot
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {lotResult.itemsBreakdown.map((item: LotItemBreakdown) => {
                          const ctbidsItemQueryUrl = item.itemUrl || `https://ctbids.com/search?keyword=${encodeURIComponent(item.itemName + ' ' + (item.makerOrBrand || ''))}`;
                          const ebaySoldCompsUrl = item.directSearchUrl || `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(item.itemName + ' ' + (item.makerOrBrand || ''))}&_lh=1&LH_Complete=1&LH_Sold=1`;

                          return (
                            <div key={item.id} className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 space-y-3">
                              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                        item.recommendation === "BUY"
                                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                          : item.recommendation === "PASS"
                                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                      }`}
                                    >
                                      {item.recommendation === "BUY" ? "★ BUY / KEEP" : item.recommendation === "PASS" ? "✕ PASS / JUNK" : "― NEUTRAL"}
                                    </span>
                                    {item.category && (
                                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                                        {item.category}
                                      </span>
                                    )}
                                    {item.makerOrBrand && (
                                      <span className="text-slate-400 text-[11px] font-medium">
                                        Maker: <span className="text-slate-200">{item.makerOrBrand}</span>
                                      </span>
                                    )}
                                  </div>
                                  <h5 className="text-sm font-bold text-slate-100 mt-1">{item.itemName}</h5>
                                </div>

                                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                                  <div className="text-xs">
                                    <span className="text-slate-500 text-[10px] block">EST RESALE</span>
                                    <span className="font-bold text-amber-300">${item.estValue}</span>
                                  </div>
                                  <div className="text-xs">
                                    <span className="text-slate-500 text-[10px] block">NET LINE CONTRIBUTION</span>
                                    <span className="font-bold text-emerald-400">${item.lineItemValueContribution}</span>
                                  </div>
                                </div>
                              </div>

                              {/* DIRECT ITEM LINKS vs LOT LINK ACTION BAR */}
                              <div className="bg-slate-950 p-2.5 rounded-xl border border-indigo-500/30 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                                <div className="text-slate-400 font-bold flex items-center gap-1.5 text-[10px] uppercase">
                                  <ArrowRight className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                                  DIRECT ITEM NAVIGATOR:
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  {/* Direct CTBids Item Link */}
                                  <a
                                    href={ctbidsItemQueryUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold px-2.5 py-1 rounded-lg border border-amber-500/40 flex items-center gap-1 transition-all"
                                    title="Go directly to CTBids search for this specific item name"
                                  >
                                    <ExternalLink className="h-3 w-3" /> 🎯 Direct Item Link (CTBids)
                                  </a>

                                  {/* Direct Item Sold Comps Link */}
                                  <a
                                    href={ebaySoldCompsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold px-2.5 py-1 rounded-lg border border-blue-500/40 flex items-center gap-1 transition-all"
                                    title="View exact eBay sold comps for this specific item"
                                  >
                                    <ExternalLink className="h-3 w-3" /> 📊 Item Sold Comps
                                  </a>

                                  {/* Parent Lot Link */}
                                  <a
                                    href={lotResult.lotUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 transition-all"
                                    title="Go back to the full lot page on CTBids"
                                  >
                                    <ExternalLink className="h-3 w-3" /> 📦 Parent Lot Page
                                  </a>
                                </div>
                              </div>

                              {/* Item Bid Equation */}
                              {item.bidEquation && (
                                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
                                  <Calculator className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                                  <span><strong className="text-indigo-300">Item Formula:</strong> {item.bidEquation}</span>
                                </div>
                              )}

                              {/* Tactical Reasons */}
                              {item.tacticalReasons && (
                                <div className="bg-amber-950/20 border border-amber-500/30 p-3 rounded-lg text-amber-200 text-xs space-y-1">
                                  <div className="font-bold text-amber-300 text-[11px] uppercase flex items-center gap-1.5">
                                    <Zap className="h-3.5 w-3.5 text-amber-400" /> Strategic &amp; Tactical Assessment:
                                  </div>
                                  <p className="leading-relaxed text-[11px] text-slate-300">{item.tacticalReasons}</p>
                                </div>
                              )}

                              {/* Things to Look For Checklist */}
                              {item.thingsToLookFor && item.thingsToLookFor.length > 0 && (
                                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                                  <div className="font-bold text-indigo-300 text-[11px] uppercase flex items-center gap-1.5">
                                    <Eye className="h-3.5 w-3.5 text-indigo-400" /> Physical Inspection Checks &amp; Hallmarks to Verify:
                                  </div>
                                  <ul className="space-y-1 pl-1">
                                    {item.thingsToLookFor.map((check: string, idx: number) => (
                                      <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>{check}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Item Footer & Carry Over Individual Item */}
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1 border-t border-slate-800/80">
                                {item.conditionNotes && (
                                  <span className="text-[10px] text-slate-400">
                                    Condition: <span className="text-slate-300">{item.conditionNotes}</span>
                                  </span>
                                )}

                                {onTrackItem && (
                                  <button
                                    onClick={() =>
                                      onTrackItem({
                                        id: `ctb-item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                                        title: item.itemName,
                                        platform: "ctbids",
                                        platformUrl: ctbidsItemQueryUrl,
                                        imageUrl: lotResult.imageUrl,
                                        currentBid: Math.round(item.lineItemValueContribution * 0.2),
                                        myMaxBudget: Math.round(item.lineItemValueContribution * 0.5),
                                        myCurrentBid: Math.round(item.lineItemValueContribution * 0.2),
                                        endTime: "Lot In Progress",
                                        status: "watching",
                                        dateAdded: new Date().toISOString().split("T")[0],
                                        bidHistory: []
                                      })
                                    }
                                    className="py-1.5 px-3 rounded-lg text-[11px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-all ml-auto"
                                  >
                                    <Bookmark className="h-3 w-3 text-amber-400" /> Carry Over Item to Inventory
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Sub-mode 3: Location Radius */}
          {ctbidsSubMode === "radius-search" && (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Zip Code / Location</label>
                  <input
                    type="text"
                    value={liveLocation}
                    onChange={(e) => setLiveLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Distance Radius</label>
                  <select
                    value={searchRadiusMiles}
                    onChange={(e) => setSearchRadiusMiles(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value={10}>10 Miles</option>
                    <option value={25}>25 Miles</option>
                    <option value={50}>50 Miles</option>
                    <option value={100}>100 Miles</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Fulfillment Option</label>
                  <select
                    value={shippingOnlyFilter ? "ship" : "all"}
                    onChange={(e) => setShippingOnlyFilter(e.target.value === "ship")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="all">Local Pickup &amp; Shipping</option>
                    <option value="ship">Will Ship Nationwide Only</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => alert(`Running CTBids search in ${liveLocation} (${searchRadiusMiles} mile radius)...`)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl shadow-lg shadow-amber-500/20"
              >
                Scan CTBids Sales in {liveLocation} Radius
              </button>
            </div>
          )}
        </div>
      )}

      {/* PLATFORM 2: HIBID */}
      {platformTab === "hibid" && (
        <div className="bg-[#11161d] rounded-2xl border border-indigo-500/30 p-6 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Clock className="h-4 w-4" /> HiBid Soft-Close Sniper &amp; Auctioneer Monitor
          </div>
          <p className="text-slate-400">
            Paste HiBid auction lot URL or lot ID to monitor soft-close extension windows, auctioneer reputation, and place late-stage strategic bids.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                value={hibidLotUrl}
                onChange={(e) => setHibidLotUrl(e.target.value)}
                placeholder="e.g. https://hibid.com/lot/12345"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={handleInspectHibid}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl py-2.5 shadow-lg shadow-indigo-600/20 uppercase"
            >
              Inspect HiBid Lot
            </button>
          </div>

          {hibidResult && (
            <div className="bg-slate-950 p-5 rounded-2xl border border-indigo-500/30 space-y-3">
              <h3 className="text-sm font-bold text-slate-100">{hibidResult.title}</h3>
              <div className="grid grid-cols-3 gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                <div>
                  <div className="text-[9px] text-slate-500">CURRENT BID</div>
                  <div className="text-sm font-bold text-slate-200">${hibidResult.currentBid}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500">SOFT-CLOSE TIMER</div>
                  <div className="text-sm font-bold text-indigo-400">{hibidResult.softCloseTimer}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500">AUCTIONEER RATING</div>
                  <div className="text-sm font-bold text-emerald-400">{hibidResult.auctioneerRating}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PLATFORM 3: LIVEAUCTIONEERS */}
      {platformTab === "liveauctioneers" && (
        <div className="bg-[#11161d] rounded-2xl border border-emerald-500/30 p-6 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Building2 className="h-4 w-4" /> LiveAuctioneers &amp; Fine Art Catalog Search
          </div>
          <p className="text-slate-400">
            Search curated fine art, antiques, and high-end estate catalogs. Access historical hammer prices and provenance verification.
          </p>
          <input
            type="text"
            value={artQuery}
            onChange={(e) => setArtQuery(e.target.value)}
            placeholder="e.g. Picasso lithograph, Hans Wegner chair, Cartier brooch"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => alert(`Querying LiveAuctioneers hammer price archives for "${artQuery || 'Fine Art'}"...`)}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-600/20 uppercase"
          >
            Search LiveAuctioneers Catalogs &amp; Hammer Archives
          </button>
        </div>
      )}

      {/* PLATFORM 4: ESTATESALES.NET */}
      {platformTab === "estatesales" && (
        <div className="bg-[#11161d] rounded-2xl border border-purple-500/30 p-6 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
            <MapPin className="h-4 w-4" /> EstateSales.net &amp; Regional Sale Directory
          </div>
          <p className="text-slate-400">
            Locate upcoming local on-site estate sales near your zip code. Inspect full photo galleries before arrival to flag treasure lots.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={saleZip}
              onChange={(e) => setSaleZip(e.target.value)}
              placeholder="e.g. 90210"
              className="sm:col-span-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={() => alert(`Finding EstateSales.net sales in ${saleZip}...`)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl py-2.5 shadow-lg shadow-purple-600/20 uppercase"
            >
              Scan Regional Sales
            </button>
          </div>
        </div>
      )}

      {/* PLATFORM 5: GOVDEALS */}
      {platformTab === "govdeals" && (
        <div className="bg-[#11161d] rounded-2xl border border-sky-500/30 p-6 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <ShieldCheck className="h-4 w-4" /> GovDeals &amp; Government Surplus Hub
          </div>
          <p className="text-slate-400">
            Inspect government, university, and municipal surplus auctions. Evaluates pallet manifests and tool lot lots.
          </p>
          <input
            type="text"
            value={govQuery}
            onChange={(e) => setGovQuery(e.target.value)}
            placeholder="e.g. Machinist lathe, surplus electronics, fleet tools"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
          />
          <button
            onClick={() => alert(`Scanning GovDeals surplus lots for "${govQuery || 'Surplus'}"...`)}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-sky-600/20 uppercase"
          >
            Scan GovDeals &amp; Surplus Manifests
          </button>
        </div>
      )}
    </div>
  );
}
