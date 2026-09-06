import React, { useState, useEffect } from "react";
import { SleeperGem, CTBidsWatchlistItem, CTBidsAccountConfig } from "../types";
import { 
  Search, Sparkles, Flame, Tag, AlertTriangle, ArrowUpRight, Check, Zap, Filter, 
  DollarSign, Layers, CheckCircle2, RefreshCw, ExternalLink, Globe, MapPin, Clock, 
  User, ShieldCheck, Truck, Sliders, Bookmark, Settings, Eye
} from "lucide-react";

interface BulkScannerProps {
  onLoggedPurchase?: (item: any) => void;
  selectedNicheFilter?: string;
}

const presetCatalogTexts = [
  {
    name: "CTBids (Caring Transitions) Local Auction Lot Dump",
    niche: "CTBids / Local Estate Auctions",
    source: "CTBids Direct Dump",
    text: `CTBids Lot #104: Vintage Danish teak side table with sculpted pulls and faint burnt maker logo inside top drawer. Current Bid: $15.
CTBids Lot #188: Heavy brass stereo box receiver marked Marantz 2270 in original wood cabinet. Bidding at $25.
CTBids Lot #203: Wooden cutlery chest containing silver-colored flatware marked 1847 Rogers Bros. Current Bid: $10.
CTBids Lot #312: Vintage Levi's denim work pants found in attic trunk with red tab and stiff selvedge seam. Current Bid: $8.
CTBids Lot #405: Starrett machinist micrometer calibration set in original wooden box. Bidding at $12.`
  },
  {
    name: "MCM & Modernist Estate Cleanout",
    niche: "Furniture / MCM",
    source: "Estate Liquidation",
    text: `Lot 1: Old wooden buffet credenza table with dark legs. Heavy, top has ring marks. $75.
Lot 2: Pink glass nesting bowls set of 4. Listed as old kitchen dishes. $15.
Lot 3: Framed abstract colorful print with sun shapes, pencil numbers in bottom corner 45/150. $30.
Lot 4: Teak dining chairs set of 4 with curved dowel backs and grey fabric. $60.
Lot 5: Vintage brass desktop lamp with green shade. $20.`
  },
  {
    name: "Garage & Machinist Liquidation",
    niche: "Industrial Tools & Machining",
    source: "HiBid / Garage Cleanout",
    text: `Item A: Metal measuring clamp gauge in original wooden box stamped Starrett. $15.
Item B: Heavy cast iron bench vise painted blue, weighs 60 lbs. $45.
Item C: Old grey stereo box receiver marked Marantz with silver dial. $35.
Item D: Mixed box of antique iron wrenches and micrometers. $20.`
  },
  {
    name: "Jewelry, Silver & Attic Sweeps",
    niche: "Fine Jewelry & Precious Metals",
    source: "Local Estate Sale",
    text: `Tray 1: Wooden chest of silver-colored spoons and forks. Box stamped 1847 Rogers Bros. $25.
Tray 2: Heavy turquoise cuff bracelet with faint hand-stamped hallmark on back. $20.
Tray 3: Vintage Levi's work pants with red tab and stiff fabric in attic trunk. $15.
Tray 4: Old gold-colored mechanical pocket watch, turns but ticking softly. $40.`
  }
];

export default function BulkScanner({ onLoggedPurchase, selectedNicheFilter }: BulkScannerProps) {
  // Primary Platform / Site Selector
  const [platformTab, setPlatformTab] = useState<"ctbids" | "hibid" | "estatesales" | "liveauctioneers" | "raw-text">("ctbids");
  
  // CTBids Specific Sub-Modes
  const [ctbidsSubMode, setCtbidsSubMode] = useState<"watchlist" | "lot-url" | "radius-search">("watchlist");

  // CTBids Account Credentials & Preferences
  const [accountConfig, setAccountConfig] = useState<CTBidsAccountConfig>({
    username: "ctbids_collector_pro",
    zipCode: "90210",
    radiusMiles: 50,
    preferWillShip: true,
    autoSyncWatchlist: true,
    isLoggedIn: true,
    lastSyncedAt: new Date().toLocaleTimeString()
  });
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Watchlist State
  const [watchlistUrl, setWatchlistUrl] = useState("https://ctbids.com/user/watchlist");
  const [watchlistItems, setWatchlistItems] = useState<CTBidsWatchlistItem[]>([]);
  const [syncingWatchlist, setSyncingWatchlist] = useState(false);
  const [watchlistStats, setWatchlistStats] = useState({
    totalItems: 0,
    sleeperGemsFound: 0,
    totalPotentialProfit: 0
  });

  // Direct Lot URL State
  const [lotQuery, setLotQuery] = useState("https://ctbids.com/lot/104");
  const [searchingLot, setSearchingLot] = useState(false);
  const [lotResult, setLotResult] = useState<any>(null);

  // Location & Radius Search Controls
  const [liveLocation, setLiveLocation] = useState("90210");
  const [searchRadiusMiles, setSearchRadiusMiles] = useState<number>(50);
  const [liveQuery, setLiveQuery] = useState("estate sale auctions teak silver receiver levi");
  const [rawInput, setRawInput] = useState(presetCatalogTexts[0].text);
  const [sourcePlatform, setSourcePlatform] = useState("CTBids (Caring Transitions)");
  const [niche, setNiche] = useState(selectedNicheFilter || "All Niches");
  const [minRoi, setMinRoi] = useState<number>(3);
  const [searchFilter, setSearchFilter] = useState("");
  
  // Platform-specific filter states
  const [shippingOnlyFilter, setShippingOnlyFilter] = useState(false);
  const [estateSaleTypeFilter, setEstateSaleTypeFilter] = useState("All Sale Types");
  
  // Mode state: watchlist | lot-search | live | paste
  const [activeMode, setActiveMode] = useState<"watchlist" | "lot-search" | "live" | "paste">("watchlist");

  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    totalParsed: number;
    gemsFound: number;
    potentialProfitTotal: number;
    averageRoiMultiple: string;
    gems: SleeperGem[];
  } | null>(null);

  const [addedGems, setAddedGems] = useState<Record<string, boolean>>({});

  // Fetch Watchlist on mount
  const handleSyncWatchlist = async () => {
    setSyncingWatchlist(true);
    try {
      const res = await fetch("/api/ctbids/sync-watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          watchlistUrl,
          accountName: accountConfig.username,
          preferWillShip: accountConfig.preferWillShip,
          zipCode: accountConfig.zipCode
        })
      });
      const data = await res.json();
      if (data && Array.isArray(data.watchlist)) {
        setWatchlistItems(data.watchlist);
        setWatchlistStats({
          totalItems: data.totalItems || data.watchlist.length,
          sleeperGemsFound: data.sleeperGemsFound || 0,
          totalPotentialProfit: data.totalPotentialProfit || 0
        });
        setAccountConfig(prev => ({ ...prev, lastSyncedAt: new Date().toLocaleTimeString() }));
      }
    } catch (err) {
      console.warn("Watchlist sync notice:", err);
    } finally {
      setSyncingWatchlist(false);
    }
  };

  // Direct Lot Search
  const handleSearchLot = async () => {
    if (!lotQuery.trim()) return;
    setSearchingLot(true);
    try {
      const res = await fetch("/api/ctbids/search-lot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lotQuery,
          zipCode: accountConfig.zipCode,
          radiusMiles: accountConfig.radiusMiles,
          willShipOnly: accountConfig.preferWillShip,
          niche: niche === "All Niches" ? "" : niche
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

  // Run Bulk Scan
  const handleRunScan = async (textToScan?: string) => {
    setScanning(true);
    const queryText = textToScan || rawInput;
    try {
      const res = await fetch("/api/scan-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText: queryText,
          niche: niche === "All Niches" ? "" : niche,
          targetMinRoi: minRoi,
          searchFilter,
          sourcePlatform
        })
      });
      const data = await res.json();
      if (data && Array.isArray(data.gems) && data.gems.length > 0) {
        setScanResult(data);
      }
    } catch (err) {
      console.error("Scan error:", err);
    } finally {
      setScanning(false);
    }
  };

  // Run Live Radius & Location Search Across All Platforms
  const handleRunLiveSearch = async () => {
    setScanning(true);
    try {
      const res = await fetch("/api/scan-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "live-search",
          location: liveLocation,
          radiusMiles: searchRadiusMiles,
          rawText: liveQuery,
          niche: niche === "All Niches" ? "" : niche,
          sourcePlatform,
          targetMinRoi: minRoi,
          searchFilter
        })
      });
      const data = await res.json();
      if (data && Array.isArray(data.gems) && data.gems.length > 0) {
        setScanResult(data);
      }
    } catch (err) {
      console.warn("Live search notice:", err);
    } finally {
      setScanning(false);
    }
  };

  // Initial Sync on Mount
  useEffect(() => {
    handleSyncWatchlist();
    handleSearchLot();
  }, []);

  const handlePresetSelect = (preset: typeof presetCatalogTexts[0]) => {
    setActiveMode("paste");
    setRawInput(preset.text);
    setNiche(preset.niche);
    handleRunScan(preset.text);
  };

  const handleLogGemToLedger = (gem: SleeperGem) => {
    if (onLoggedPurchase) {
      onLoggedPurchase({
        itemName: gem.itemName,
        category: gem.niche,
        purchasePrice: gem.askingPrice,
        purchaseDate: new Date().toISOString().split("T")[0],
        notes: `Bulk Scanner Sleeper Buy | Platform: ${gem.auctionPlatform || "CTBids"} | Est Val: $${gem.estimatedValue} | ROI: ${gem.roiMultiple}x`
      });
      setAddedGems((prev) => ({ ...prev, [gem.id]: true }));
    }
  };

  const displayedGems = (scanResult?.gems || []).filter((gem) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      gem.itemName.toLowerCase().includes(q) ||
      gem.listedTitle.toLowerCase().includes(q) ||
      gem.niche.toLowerCase().includes(q) ||
      gem.hallmarkToCheck.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card & Account Sync Status */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-xl font-display font-bold text-amber-300 flex items-center gap-2">
              <Flame className="h-6 w-6 text-amber-400 fill-amber-400/20" />
              CTBids &amp; Auction Watchlist Hidden Gem Engine
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Sync active CTBids Watchlists, inspect direct lot links, or run location &amp; radius searches across all auction platforms.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 font-bold">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>CTBids Session Active ({accountConfig.username})</span>
            </div>

            <button
              onClick={() => setShowConfigModal(true)}
              className="bg-slate-800 hover:bg-slate-750 text-slate-200 p-2 rounded-xl border border-slate-700 transition-all"
              title="CTBids Account & Location Settings"
            >
              <Settings className="h-4 w-4 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Quick Location & Shipping Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-500 block">LOCAL RADIUS ZIP</span>
              <span className="font-bold text-slate-200">{accountConfig.zipCode} ({accountConfig.radiusMiles} Miles)</span>
            </div>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 flex items-center gap-2">
            <Truck className="h-4 w-4 text-indigo-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 block">SHIPPING FILTER</span>
              <span className="font-bold text-slate-200">
                {accountConfig.preferWillShip ? "Will Ship / No Local Pickup Needed" : "Local Pickup & Ship"}
              </span>
            </div>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 block">LAST WATCHLIST SYNC</span>
              <span className="font-bold text-slate-200">{accountConfig.lastSyncedAt || "Just Now"}</span>
            </div>
          </div>

          <button
            onClick={handleSyncWatchlist}
            disabled={syncingWatchlist}
            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl px-3 py-2 font-bold flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCw className={`h-4 w-4 text-amber-400 ${syncingWatchlist ? "animate-spin" : ""}`} />
            <span>{syncingWatchlist ? "Syncing Watchlist..." : "Refresh CTBids Watchlist"}</span>
          </button>
        </div>

        {/* Main Platform / Company Site Navigation Tabs */}
        <div className="flex border-b border-slate-800 text-xs font-mono pt-2 overflow-x-auto gap-1">
          <button
            onClick={() => { setPlatformTab("ctbids"); setSourcePlatform("CTBids (Caring Transitions)"); }}
            className={`px-4 py-2.5 font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              platformTab === "ctbids"
                ? "border-amber-400 text-amber-400 bg-amber-500/10 rounded-t-lg"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Bookmark className="h-4 w-4 text-amber-400" /> CTBids Hub ({watchlistItems.length})
          </button>

          <button
            onClick={() => { setPlatformTab("hibid"); setSourcePlatform("HiBid Local Auctions"); }}
            className={`px-4 py-2.5 font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              platformTab === "hibid"
                ? "border-sky-400 text-sky-400 bg-sky-500/10 rounded-t-lg"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Globe className="h-4 w-4 text-sky-400" /> HiBid Auctions
          </button>

          <button
            onClick={() => { setPlatformTab("estatesales"); setSourcePlatform("EstateSales.net"); }}
            className={`px-4 py-2.5 font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              platformTab === "estatesales"
                ? "border-emerald-400 text-emerald-400 bg-emerald-500/10 rounded-t-lg"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Tag className="h-4 w-4 text-emerald-400" /> EstateSales.net
          </button>

          <button
            onClick={() => { setPlatformTab("liveauctioneers"); setSourcePlatform("LiveAuctioneers"); }}
            className={`px-4 py-2.5 font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              platformTab === "liveauctioneers"
                ? "border-purple-400 text-purple-400 bg-purple-500/10 rounded-t-lg"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="h-4 w-4 text-purple-400" /> LiveAuctioneers
          </button>

          <button
            onClick={() => setPlatformTab("raw-text")}
            className={`px-4 py-2.5 font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              platformTab === "raw-text"
                ? "border-slate-300 text-slate-200 bg-slate-800/50 rounded-t-lg"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="h-4 w-4 text-slate-400" /> Raw Catalog Text
          </button>
        </div>

        {/* PLATFORM 1: CTBIDS HUB */}
        {platformTab === "ctbids" && (
          <div className="space-y-4 pt-2">
            {/* CTBids Sub-Navigation Bar */}
            <div className="flex gap-2 text-xs font-mono border-b border-slate-800 pb-2 overflow-x-auto">
              <button
                onClick={() => setCtbidsSubMode("watchlist")}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  ctbidsSubMode === "watchlist"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-slate-950 text-slate-400 hover:bg-slate-900"
                }`}
              >
                <Bookmark className="h-3.5 w-3.5 text-amber-400" /> Watchlist Auto-Sync ({watchlistItems.length})
              </button>

              <button
                onClick={() => setCtbidsSubMode("lot-url")}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  ctbidsSubMode === "lot-url"
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                    : "bg-slate-950 text-slate-400 hover:bg-slate-900"
                }`}
              >
                <Search className="h-3.5 w-3.5 text-indigo-400" /> Direct CTBids Lot URL Inspector
              </button>

              <button
                onClick={() => setCtbidsSubMode("radius-search")}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  ctbidsSubMode === "radius-search"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-slate-950 text-slate-400 hover:bg-slate-900"
                }`}
              >
                <MapPin className="h-3.5 w-3.5 text-emerald-400" /> CTBids Location &amp; Radius Search
              </button>
            </div>

            {/* CTBids Sub-mode 1: Watchlist Radar */}
            {ctbidsSubMode === "watchlist" && (
              <div className="space-y-5 pt-1">
                <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono text-amber-400 font-bold">
                      <Sparkles className="h-4 w-4" /> ACTIVE CTBIDS WATCHLIST AUTO-POPULATOR
                    </div>
                    <p className="text-slate-400">
                      Syncs directly with your active CTBids account (<code className="text-amber-300">{accountConfig.username}</code>). Evaluates sleeper score, current bid, estimated profit gap, and direct working CTBids lot links.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 font-mono shrink-0">
                    <div className="text-center bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-500">SLEEPER GEMS</div>
                      <div className="text-sm font-bold text-amber-400">{watchlistStats.sleeperGemsFound} / {watchlistItems.length}</div>
                    </div>

                    <div className="text-center bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-500">EST. PROFIT GAP</div>
                      <div className="text-sm font-bold text-emerald-400">${watchlistStats.totalPotentialProfit.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Watchlist Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {watchlistItems.map((item) => {
                    const gem = item.gemAnalysis;
                    const isAdded = gem ? addedGems[gem.id] : false;

                    return (
                      <div
                        key={item.id}
                        className={`bg-slate-950 rounded-xl border p-4 space-y-3 transition-all ${
                          item.isSleeperGem
                            ? "border-amber-500/40 shadow-lg shadow-amber-500/5 hover:border-amber-500/70"
                            : "border-slate-850 hover:border-slate-800"
                        }`}
                      >
                        {/* Top Lot Header */}
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800 font-bold">
                              {item.lotNumber}
                            </span>
                            {item.willShip && (
                              <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20 flex items-center gap-1">
                                <Truck className="h-3 w-3" /> Will Ship
                              </span>
                            )}
                          </div>

                          {item.isSleeperGem && (
                            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                              <Flame className="h-3 w-3 fill-amber-400" /> GOD-TIER SLEEPER
                            </span>
                          )}
                        </div>

                        {/* Image & Title Section */}
                        <div className="flex gap-3.5">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-lg border border-slate-800 shrink-0 bg-slate-900"
                          />
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-slate-100 line-clamp-2">{item.title}</h4>
                            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                              <MapPin className="h-3 w-3 text-slate-500" />
                              <span>{item.location}</span>
                            </div>
                            <div className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{item.endTime}</span>
                            </div>
                          </div>
                        </div>

                        {/* Pricing Arbitrage Box */}
                        <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                          <div>
                            <div className="text-[9px] text-slate-500">CURRENT BID</div>
                            <div className="text-sm font-bold text-slate-200 mt-0.5">${item.currentBid}</div>
                          </div>
                          <div>
                            <div className="text-[9px] text-slate-500">EST. RESALE</div>
                            <div className="text-sm font-bold text-amber-300 mt-0.5">${item.estValue}</div>
                          </div>
                          <div>
                            <div className="text-[9px] text-slate-500">PROFIT GAP</div>
                            <div className="text-sm font-bold text-emerald-400 mt-0.5">+${item.estValue - item.currentBid}</div>
                          </div>
                        </div>

                        {/* AI Hallmark & Reason Box */}
                        {gem && (
                          <div className="bg-amber-500/5 p-3 rounded-lg border border-amber-500/20 space-y-1.5 text-xs">
                            <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex justify-between">
                              <span>Identified Treasure: {gem.itemName}</span>
                              <span className="text-emerald-400">{gem.roiMultiple}x ROI</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">{gem.sleeperReason}</p>
                            <div className="text-[10px] text-amber-300/90 font-mono bg-amber-500/10 p-2 rounded border border-amber-500/20">
                              <strong className="text-amber-400">Hallmark Check:</strong> {gem.hallmarkToCheck}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="pt-2 border-t border-slate-850 flex items-center gap-2">
                          <a
                            href={item.lotUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-1/2 py-2 px-3 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all text-center"
                          >
                            <ExternalLink className="h-3.5 w-3.5" /> Open Lot on CTBids
                          </a>

                          {gem && (
                            <button
                              onClick={() => handleLogGemToLedger(gem)}
                              disabled={isAdded}
                              className={`w-1/2 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                                isAdded
                                  ? "bg-slate-900 text-slate-500 border border-slate-800 cursor-default"
                                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/15"
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="h-4 w-4 text-emerald-400" /> Sourced &amp; Logged
                                </>
                              ) : (
                                <>
                                  <Tag className="h-4 w-4" /> Claim &amp; Log (${gem.askingPrice})
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTBids Sub-mode 2: Direct Lot URL Inspector */}
            {ctbidsSubMode === "lot-url" && (
              <div className="space-y-4 pt-1">
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-indigo-500/20 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-indigo-400 font-bold">
                    <Search className="h-3.5 w-3.5" /> DIRECT CTBIDS LOT LINK INSPECTOR
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Paste any direct CTBids lot URL (e.g. <code className="text-amber-300">https://ctbids.com/lot/104</code>) or CTBids lot number to perform deep research on that exact item, extract high-res images, current bids, estimated resale valuation, hallmark verification steps, and view the direct working lot link.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 font-medium mb-1">Direct CTBids Lot URL or Lot ID</label>
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
                      <input
                        type="text"
                        value={lotQuery}
                        onChange={(e) => setLotQuery(e.target.value)}
                        placeholder="e.g. https://ctbids.com/lot/104 or CTB-90281"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleSearchLot}
                      disabled={searchingLot}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl py-2.5 px-4 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-mono"
                    >
                      {searchingLot ? (
                        <span className="animate-pulse flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" /> Inspecting...
                        </span>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" /> Inspect CTBids Lot
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {lotResult && (
                  <div className="bg-slate-950 rounded-xl border border-indigo-500/30 p-4 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <img
                        src={lotResult.imageUrl}
                        alt={lotResult.title}
                        className="w-full md:w-48 h-48 object-cover rounded-xl border border-slate-800 bg-slate-900"
                      />
                      <div className="space-y-3 flex-1">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30 font-bold">
                              {lotResult.lotNumber}
                            </span>
                            {lotResult.willShip && (
                              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                                <Truck className="h-3 w-3" /> Will Ship
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-slate-100">{lotResult.title}</h3>
                          <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-amber-400" /> {lotResult.location}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800 text-center font-mono">
                          <div>
                            <div className="text-[10px] text-slate-500">CURRENT BID</div>
                            <div className="text-base font-bold text-slate-200 mt-0.5">${lotResult.currentBid}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500">ESTIMATED VALUE</div>
                            <div className="text-base font-bold text-amber-300 mt-0.5">${lotResult.estimatedValue}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500">PROFIT MARGIN</div>
                            <div className="text-base font-bold text-emerald-400 mt-0.5">+${lotResult.profitGap}</div>
                          </div>
                        </div>

                        {lotResult.gemAnalysis && (
                          <div className="bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/30 space-y-1.5 text-xs">
                            <div className="flex justify-between items-center font-mono text-amber-400 font-bold">
                              <span>Identified: {lotResult.gemAnalysis.itemName}</span>
                              <span className="text-emerald-400">{lotResult.gemAnalysis.verdict}</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{lotResult.gemAnalysis.sleeperReason}</p>
                            <div className="text-amber-300 font-mono text-[11px]">
                              <strong>Hallmark to Check:</strong> {lotResult.gemAnalysis.hallmarkToCheck}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-3 pt-1">
                          <a
                            href={lotResult.lotUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-2 transition-all text-center font-mono"
                          >
                            <ExternalLink className="h-4 w-4" /> Open Direct CTBids Lot Link
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CTBids Sub-mode 3: CTBids Radius & Location Search */}
            {ctbidsSubMode === "radius-search" && (
              <div className="space-y-4 pt-1">
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-amber-500/20 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-amber-400 font-bold">
                    <MapPin className="h-3.5 w-3.5" /> CTBIDS LOCATION &amp; DISTANCE RADIUS SEARCH
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Search active Caring Transitions estate auctions near your zip code or nationwide with shipping.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Zip Code / City</label>
                    <div className="relative">
                      <MapPin className="h-3.5 w-3.5 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="text"
                        value={liveLocation}
                        onChange={(e) => setLiveLocation(e.target.value)}
                        placeholder="e.g. 90210"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Distance Radius</label>
                    <select
                      value={searchRadiusMiles}
                      onChange={(e) => setSearchRadiusMiles(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value={10}>10 Miles Radius</option>
                      <option value={25}>25 Miles Radius</option>
                      <option value={50}>50 Miles Radius</option>
                      <option value={100}>100 Miles Radius</option>
                      <option value={500}>Nationwide / Will Ship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Fulfillment Option</label>
                    <select
                      value={shippingOnlyFilter ? "ship" : "all"}
                      onChange={(e) => setShippingOnlyFilter(e.target.value === "ship")}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="all">Local Pickup &amp; Shipping</option>
                      <option value="ship">Will Ship Nationwide Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Target Niche</label>
                    <select
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="All Niches">All Niches</option>
                      <option value="CTBids / Local Estate Auctions">Local Estate Auctions</option>
                      <option value="Furniture / MCM">Furniture / MCM</option>
                      <option value="Fine Jewelry & Precious Metals">Fine Jewelry &amp; Silver</option>
                      <option value="Vintage Audio & Electronics">Vintage Audio</option>
                      <option value="Tools & Machining">Tools &amp; Machining</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                    CTBids Keywords / Item Query
                  </label>
                  <input
                    type="text"
                    value={liveQuery}
                    onChange={(e) => setLiveQuery(e.target.value)}
                    placeholder="e.g. teak credenza marantz stereo sterling spoons levi"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <button
                  onClick={() => { setSourcePlatform("CTBids (Caring Transitions)"); handleRunLiveSearch(); }}
                  disabled={scanning}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold rounded-xl py-3.5 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-mono"
                >
                  {scanning ? (
                    <span className="animate-pulse flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" /> Searching CTBids Sales in {searchRadiusMiles} Mile Radius...
                    </span>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4" /> Run CTBids Location Search ({liveLocation} / {searchRadiusMiles} Miles)
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: Direct Lot URL Inspector */}
        {activeMode === "lot-search" && (
          <div className="space-y-4 pt-2">
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-indigo-500/20 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-mono text-[11px] text-indigo-400 font-bold">
                <Search className="h-3.5 w-3.5" /> DIRECT AUCTION LOT URL INSPECTOR
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Paste any direct CTBids or auction lot URL (e.g., <code className="text-amber-300">https://ctbids.com/lot/104</code>) or lot ID to perform deep research on that exact item, extract high-res images, current bids, estimated resale valuation, hallmark verification steps, and view the direct working lot link.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-medium mb-1">Direct Auction Lot URL or Lot ID</label>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={lotQuery}
                    onChange={(e) => setLotQuery(e.target.value)}
                    placeholder="e.g. https://ctbids.com/lot/104 or CTB-90281"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">&nbsp;</label>
                <button
                  onClick={handleSearchLot}
                  disabled={searchingLot || !lotQuery.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl py-2.5 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  {searchingLot ? (
                    <span className="animate-pulse flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" /> Inspecting Lot...
                    </span>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" /> Inspect Direct Lot
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Lot Search Result Display */}
            {lotResult && (
              <div className="bg-slate-950 rounded-2xl border border-indigo-500/30 p-5 space-y-4">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg border border-indigo-500/20 font-mono font-bold text-xs">
                      LOT: {lotResult.lotNumber}
                    </span>
                    {lotResult.willShip && (
                      <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-500/20 font-mono text-xs flex items-center gap-1">
                        <Truck className="h-3.5 w-3.5" /> Will Ship Nationwide
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-mono bg-slate-900 text-slate-300 px-3 py-1 rounded-lg border border-slate-800">
                    Seller: {lotResult.sellerName}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-5">
                  <img
                    src={lotResult.imageUrl}
                    alt={lotResult.title}
                    className="w-full sm:w-48 h-48 object-cover rounded-xl border border-slate-800 shrink-0 bg-slate-900"
                  />

                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">{lotResult.title}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-amber-400" /> {lotResult.location}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800 text-center font-mono">
                      <div>
                        <div className="text-[10px] text-slate-500">CURRENT BID</div>
                        <div className="text-base font-bold text-slate-200 mt-0.5">${lotResult.currentBid}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">ESTIMATED VALUE</div>
                        <div className="text-base font-bold text-amber-300 mt-0.5">${lotResult.estimatedValue}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">PROFIT MARGIN</div>
                        <div className="text-base font-bold text-emerald-400 mt-0.5">+${lotResult.profitGap}</div>
                      </div>
                    </div>

                    {lotResult.gemAnalysis && (
                      <div className="bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/30 space-y-1.5 text-xs">
                        <div className="flex justify-between items-center font-mono text-amber-400 font-bold">
                          <span>Identified: {lotResult.gemAnalysis.itemName}</span>
                          <span className="text-emerald-400">{lotResult.gemAnalysis.verdict}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{lotResult.gemAnalysis.sleeperReason}</p>
                        <div className="text-amber-300 font-mono text-[11px]">
                          <strong>Hallmark to Check:</strong> {lotResult.gemAnalysis.hallmarkToCheck}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-1">
                      <a
                        href={lotResult.lotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-2 transition-all text-center"
                      >
                        <ExternalLink className="h-4 w-4" /> Open Direct Lot Link
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 3: Radius & Location Auction Search (All Sites) */}
        {activeMode === "live" && (
          <div className="space-y-4 pt-2">
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-emerald-500/20 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400 font-bold">
                <Globe className="h-3.5 w-3.5" /> LOCATION &amp; RADIUS AUCTION SEARCH (ALL PLATFORMS)
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Search active local estate sales, open auction lots, and online sales near your location or zip code across CTBids, HiBid, EstateSales.net, and LiveAuctioneers within your selected radius.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Zip Code / City</label>
                <div className="relative">
                  <MapPin className="h-3.5 w-3.5 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={liveLocation}
                    onChange={(e) => setLiveLocation(e.target.value)}
                    placeholder="e.g. 90210 or Los Angeles, CA"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Search Radius (Miles)</label>
                <select
                  value={searchRadiusMiles}
                  onChange={(e) => setSearchRadiusMiles(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value={10}>10 Miles</option>
                  <option value={25}>25 Miles</option>
                  <option value={50}>50 Miles</option>
                  <option value={100}>100 Miles</option>
                  <option value={500}>Nationwide / Will Ship</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Niche Focus</label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="All Niches">All Niches</option>
                  <option value="CTBids / Local Estate Auctions">CTBids / Local Auctions</option>
                  <option value="Furniture / MCM">Furniture / MCM</option>
                  <option value="Fine Jewelry & Precious Metals">Fine Jewelry &amp; Precious Metals</option>
                  <option value="Vintage Audio & Electronics">Vintage Audio &amp; Electronics</option>
                  <option value="Tools & Machining">Tools &amp; Machining</option>
                  <option value="Studio Glass & Ceramics">Studio Glass &amp; Ceramics</option>
                  <option value="Fine Art & Graphics">Fine Art &amp; Graphics</option>
                  <option value="Vintage Apparel & Denim">Vintage Apparel &amp; Denim</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Auction Platform Target</label>
                <select
                  value={sourcePlatform}
                  onChange={(e) => setSourcePlatform(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="All Auction Platforms">All Platforms (CTBids, HiBid, etc.)</option>
                  <option value="CTBids (Caring Transitions)">CTBids (Caring Transitions)</option>
                  <option value="HiBid Local Auctions">HiBid Local Auctions</option>
                  <option value="EstateSales.net">EstateSales.net</option>
                  <option value="LiveAuctioneers">LiveAuctioneers</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Location &amp; Item Search Keywords
              </label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  value={liveQuery}
                  onChange={(e) => setLiveQuery(e.target.value)}
                  placeholder="e.g. estate sale auctions teak silver receiver levi"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleRunLiveSearch}
              disabled={scanning}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-extrabold rounded-xl py-3.5 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              {scanning ? (
                <span className="animate-pulse flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" /> Searching Open Auctions within {searchRadiusMiles} Miles...
                </span>
              ) : (
                <>
                  <Globe className="h-4 w-4" /> Run Location &amp; Radius Auction Search
                </>
              )}
            </button>
          </div>
        )}

        {/* MODE 4: Raw Catalog Text Sweeper */}
        {activeMode === "paste" && (
          <div className="space-y-4 pt-2">
            <div className="space-y-2.5">
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider flex justify-between items-center">
                <span>Quick Preset Catalog Sweeps</span>
                <span className="text-amber-400 font-bold">Raw Text Pipeline</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {presetCatalogTexts.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetSelect(preset)}
                    className="text-left bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-amber-500/40 p-3 rounded-xl transition-all space-y-1 group"
                  >
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 flex items-center justify-between">
                      <span className="line-clamp-1">{preset.name}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-amber-400 shrink-0" />
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{preset.source}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Paste CTBids Web Page URL OR Raw Lot Text
              </label>
              <textarea
                rows={4}
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="Paste CTBids web page URL or raw listing text..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 font-mono resize-y"
              />
            </div>

            <button
              onClick={() => handleRunScan()}
              disabled={scanning || !rawInput.trim()}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl py-3 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              {scanning ? (
                <span className="animate-pulse">Scraping &amp; Analyzing CTBids Page...</span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Scrape &amp; Analyze CTBids / Lot Text
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Results Spotlight Section for Live & Text Scans */}
      {scanResult && (activeMode === "live" || activeMode === "paste") && (
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
            <div className="border-r border-slate-800/80 pr-2">
              <div className="text-[10px] text-slate-500 uppercase">Parsed Lots</div>
              <div className="text-lg font-bold text-slate-200 mt-0.5">{scanResult.totalParsed}</div>
            </div>
            <div className="border-r border-slate-800/80 pr-2">
              <div className="text-[10px] text-slate-500 uppercase">Sleeper Gems</div>
              <div className="text-lg font-bold text-amber-400 mt-0.5">{scanResult.gemsFound}</div>
            </div>
            <div className="border-r border-slate-800/80 pr-2">
              <div className="text-[10px] text-slate-500 uppercase">Est. Profit Gap</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">${scanResult.potentialProfitTotal.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Avg ROI Multiplier</div>
              <div className="text-lg font-bold text-indigo-400 mt-0.5">{scanResult.averageRoiMultiple}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedGems.map((gem) => {
              const isAdded = addedGems[gem.id];
              const directLink = gem.auctionLink && gem.auctionLink.startsWith("http")
                ? gem.auctionLink
                : `https://ctbids.com/search?keyword=${encodeURIComponent(gem.itemName)}`;

              return (
                <div
                  key={gem.id}
                  className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-500/40 p-5 space-y-4 shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border ${
                        gem.verdict === "GOD-TIER GEM" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                        gem.verdict === "TREASURE BUY" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                        "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                      }`}>
                        {gem.verdict}
                      </span>

                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-slate-400">ROI:</span>
                        <span className="text-emerald-400 font-bold">{gem.roiMultiple}x</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                      <span className="bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                        <Globe className="h-3 w-3 text-amber-400" />
                        {gem.auctionPlatform || sourcePlatform || "CTBids"}
                      </span>
                      <span className="bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-indigo-400" />
                        {gem.saleLocation || liveLocation || "Local Estate Sale"}
                      </span>
                      <span className="bg-slate-950 text-emerald-400 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1 font-bold">
                        <Clock className="h-3 w-3 text-emerald-400" />
                        {gem.biddingEnds || "Open Bidding"}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-display font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                        {gem.itemName}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Listed as: &quot;{gem.listedTitle}&quot;
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      <div>
                        <div className="text-[9px] text-slate-500">ASKING / BID</div>
                        <div className="text-sm font-bold text-slate-200 mt-0.5">${gem.askingPrice}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-500">EST. VALUE</div>
                        <div className="text-sm font-bold text-amber-300 mt-0.5">${gem.estimatedValue}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-500">PROFIT MARGIN</div>
                        <div className="text-sm font-bold text-emerald-400 mt-0.5">+${gem.profitGap}</div>
                      </div>
                    </div>

                    <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/20 text-xs space-y-1.5">
                      <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" /> Sleeper Value Analysis
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{gem.sleeperReason}</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-xs space-y-1">
                      <div className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> Hallmark &amp; Stamp Check
                      </div>
                      <p className="text-slate-300 text-[11px]">{gem.hallmarkToCheck}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-2">
                    <a
                      href={directLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-1/2 py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all text-center"
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" /> View Live Lot / Auction
                    </a>

                    <button
                      onClick={() => handleLogGemToLedger(gem)}
                      disabled={isAdded}
                      className={`w-full sm:w-1/2 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        isAdded
                          ? "bg-slate-900 text-slate-500 border border-slate-800 cursor-default"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/15"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-400" /> Sourced &amp; Logged
                        </>
                      ) : (
                        <>
                          <Tag className="h-4 w-4" /> Claim &amp; Log (${gem.askingPrice})
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Account & Preferences Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Settings className="h-5 w-5 text-amber-400" /> CTBids Platform Settings
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">CTBids Username / Account handle</label>
                <input
                  type="text"
                  value={accountConfig.username}
                  onChange={(e) => setAccountConfig({ ...accountConfig, username: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Local Zip Code</label>
                <input
                  type="text"
                  value={accountConfig.zipCode}
                  onChange={(e) => setAccountConfig({ ...accountConfig, zipCode: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Search Radius (Miles)</label>
                <select
                  value={accountConfig.radiusMiles}
                  onChange={(e) => setAccountConfig({ ...accountConfig, radiusMiles: parseInt(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono"
                >
                  <option value={25}>25 Miles</option>
                  <option value={50}>50 Miles (Recommended)</option>
                  <option value={100}>100 Miles</option>
                  <option value={500}>Nationwide / All Distance</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <div className="font-bold text-slate-200">Prefer &quot;Will Ship&quot; Lots</div>
                  <div className="text-[10px] text-slate-400">Exclude lots that require strictly local in-person pickup</div>
                </div>
                <input
                  type="checkbox"
                  checked={accountConfig.preferWillShip}
                  onChange={(e) => setAccountConfig({ ...accountConfig, preferWillShip: e.target.checked })}
                  className="h-4 w-4 accent-amber-400 rounded cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setShowConfigModal(false);
                handleSyncWatchlist();
              }}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl py-2.5 text-xs uppercase"
            >
              Save Credentials &amp; Sync Watchlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
