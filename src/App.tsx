import React, { useState, useEffect } from "react";
import ProveniqLogo from "./components/ProveniqLogo";
import ItemAnalysis from "./components/ItemAnalysis";
import AuctionSitesHub from "./components/AuctionSitesHub";
import InventoryBiddingCenter from "./components/InventoryBiddingCenter";
import StoreListingStudio from "./components/StoreListingStudio";
import StudioWorkbench from "./components/StudioWorkbench";
import HallmarkDecoder from "./components/HallmarkDecoder";
import EstateAnalysis from "./components/EstateAnalysis";
import FeedbackLoop from "./components/FeedbackLoop";
import RoutePlanner from "./components/RoutePlanner";
import NicheExplorer from "./components/NicheExplorer";

import PipelineStreamBar, { PipelineStage } from "./components/PipelineStreamBar";
import PipelineConduit, { InFlightItem } from "./components/PipelineConduit";
import PipelineFlowGuide from "./components/PipelineFlowGuide";

import MagicCarpetBackdrop from "./components/MagicCarpetBackdrop";
import MagicCarpetWindow from "./components/MagicCarpetWindow";
import MagicCarpetDock, { FlightFormation, ActiveCarpetState } from "./components/MagicCarpetDock";

import { 
  Camera, Globe, Box, ShoppingBag, ShieldCheck, Zap, TrendingUp, 
  CheckCircle2, Compass, Layers, Puzzle, Flame, Tag, Bookmark, ArrowRight,
  Sparkles, Wind, Columns, LayoutGrid, Maximize2, Move, HelpCircle
} from "lucide-react";
import { PurchaseRecord, TrackedItem } from "./types";

// Initial sample tracked items for lifecycle demonstration
const initialTrackedItems: TrackedItem[] = [
  {
    id: "tr-1",
    title: "Vintage Marantz 2270 Receiver in Walnut Cabinet",
    platform: "ctbids",
    platformUrl: "https://ctbids.com/lot/188",
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=60",
    lotNumber: "Lot #188",
    location: "Glendale, CA",
    currentBid: 45,
    myMaxBudget: 300,
    myCurrentBid: 45,
    endTime: "5h 45m remaining",
    status: "bidding",
    dateAdded: "2026-08-08",
    category: "Vintage Audio & Electronics",
    bidHistory: [
      {
        id: "b1",
        amount: 45,
        timestamp: "10:15 AM",
        isMyBid: true,
        tacticUsed: "Odd-Number Opening Bid ($45)",
        note: "Anchored opening bid on CTBids"
      }
    ],
    psychologicalAdvisor: {
      suggestedNextBid: 53,
      primaryTactic: "Odd-Number Escalation ($53)",
      tacticalReasoning: "Bidding $53 creates cognitive friction for competitors anchoring on round $50 increments.",
      behavioralInsight: "Submit in final 15 seconds to disrupt human emotional counter-bidding while respecting soft-close rules.",
      maxBudgetCap: 300,
      dangerZoneThreshold: 270
    },
    channelPricing: {
      ebayEst: 720,
      fbMarketplaceEst: 580,
      specialtyHouseEst: 850,
      recommendedChannel: "eBay"
    }
  },
  {
    id: "tr-2",
    title: "Mid Century Danish Teak Side Table with Sculpted Pulls",
    platform: "ctbids",
    platformUrl: "https://ctbids.com/lot/104",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60",
    lotNumber: "Lot #104",
    location: "Pasadena, CA",
    currentBid: 35,
    myMaxBudget: 220,
    myCurrentBid: 35,
    endTime: "3h 10m remaining",
    status: "watching",
    dateAdded: "2026-08-08",
    category: "Furniture / MCM",
    bidHistory: [],
    channelPricing: {
      ebayEst: 450,
      fbMarketplaceEst: 380,
      specialtyHouseEst: 550,
      recommendedChannel: "Facebook Marketplace"
    }
  },
  {
    id: "tr-3",
    title: "1847 Rogers Bros Silverplate Cutlery Set in Chest",
    platform: "hibid",
    platformUrl: "https://hibid.com/lot/203",
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&auto=format&fit=crop&q=60",
    lotNumber: "Lot #203",
    location: "San Jose, CA",
    currentBid: 25,
    myMaxBudget: 120,
    myCurrentBid: 25,
    endTime: "Auction Ended - Won",
    status: "won_pending",
    fulfillmentStatus: "pending_pickup",
    purchasePrice: 25,
    dateAdded: "2026-08-07",
    category: "Fine Jewelry & Precious Metals",
    bidHistory: [
      { id: "b2", amount: 25, timestamp: "Yesterday", isMyBid: true, tacticUsed: "Soft Close Late Snipe", note: "Won at $25" }
    ],
    channelPricing: {
      ebayEst: 180,
      fbMarketplaceEst: 140,
      specialtyHouseEst: 220,
      recommendedChannel: "eBay"
    }
  },
  {
    id: "tr-4",
    title: "Starrett Machinist Precision Micrometer Set in Wooden Case",
    platform: "govdeals",
    platformUrl: "https://govdeals.com/lot/405",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60",
    lotNumber: "Lot #405",
    location: "Oakland, CA",
    currentBid: 40,
    myMaxBudget: 180,
    myCurrentBid: 40,
    endTime: "In-Hand",
    status: "inventory_in_hand",
    fulfillmentStatus: "received",
    inventoryDestination: "store_resale",
    purchasePrice: 40,
    dateAdded: "2026-08-05",
    category: "Tools & Machining",
    bidHistory: [],
    channelPricing: {
      ebayEst: 280,
      fbMarketplaceEst: 220,
      specialtyHouseEst: 320,
      recommendedChannel: "eBay"
    }
  }
];

export default function App() {
  // Unified 4-Stage Arbitrage Pipeline + Specialist Field Kit
  const [activeStage, setActiveStage] = useState<PipelineStage>("scout");
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  
  // Spatial Canvas: Magic Carpets & Formations
  const [displayMode, setDisplayMode] = useState<"carpet" | "pipeline">("carpet");
  const [flightFormation, setFlightFormation] = useState<FlightFormation>("solo");
  const [isBreezeFloating, setIsBreezeFloating] = useState<boolean>(true);
  const [topZIndex, setTopZIndex] = useState<number>(30);

  const [carpetStates, setCarpetStates] = useState<Record<PipelineStage, ActiveCarpetState>>({
    scout: { id: "scout", isOpen: true, isMinimized: false, isFullscreen: false, zIndex: 20 },
    appraise: { id: "appraise", isOpen: false, isMinimized: false, isFullscreen: false, zIndex: 19 },
    bid: { id: "bid", isOpen: false, isMinimized: false, isFullscreen: false, zIndex: 18 },
    liquidate: { id: "liquidate", isOpen: false, isMinimized: false, isFullscreen: false, zIndex: 17 },
    hallmark: { id: "hallmark", isOpen: false, isMinimized: false, isFullscreen: false, zIndex: 16 },
    route: { id: "route", isOpen: false, isMinimized: false, isFullscreen: false, zIndex: 15 },
    workbench: { id: "workbench", isOpen: false, isMinimized: false, isFullscreen: false, zIndex: 14 },
    taxonomy: { id: "taxonomy", isOpen: false, isMinimized: false, isFullscreen: false, zIndex: 13 }
  });

  const [selectedNiche, setSelectedNiche] = useState<string>("All Niches");
  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>(initialTrackedItems);

  // Active item in flight across pipeline stages
  const [inFlightItem, setInFlightItem] = useState<InFlightItem | null>({
    id: "flight-1",
    title: "Vintage Danish Teak Slide Door Credenza (Faarup Møbelfabrik)",
    imageUrl: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80",
    category: "Mid-Century Modern Furniture",
    source: "CTBids Lot #449",
    estValue: 1850,
    currentBid: 65,
    targetMaxBid: 380,
    notes: "Omitted Faarup Møbelfabrik maker name from title. Unstamped burn mark inside drawer.",
    stageOriginated: "scout"
  });

  // Pre-filled item for Optical Appraisal
  const [initialAppraisalItem, setInitialAppraisalItem] = useState<{ title?: string; image?: string; notes?: string } | null>({
    title: "Vintage Danish Teak Slide Door Credenza (Faarup Møbelfabrik)",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80",
    notes: "Identified in CTBids Lot #449 without designer attribution. Verify Danish Control burn mark and joinery."
  });

  // Portfolio metrics
  const [portfolioStats, setPortfolioStats] = useState({
    profit: 0,
    winRate: 100,
    active: 0,
    deployed: 0
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("artperiod_portfolio");
    if (saved) {
      try {
        const list: PurchaseRecord[] = JSON.parse(saved);
        const sold = list.filter((p) => p.sold);
        const profit = sold.reduce((sum, p) => sum + ((p.salePrice || 0) - p.purchasePrice), 0);
        const active = list.filter((p) => !p.sold).length;
        const deployed = list.reduce((sum, p) => sum + p.purchasePrice, 0);
        
        const profitable = sold.filter((p) => (p.salePrice || 0) > p.purchasePrice).length;
        const winRate = sold.length > 0 ? Math.round((profitable / sold.length) * 100) : 100;

        setPortfolioStats({ profit, winRate, active, deployed });
      } catch (e) {
        console.error(e);
      }
    }
  }, [refreshTrigger, activeStage]);

  const handleLoggedPurchaseFromAi = (purchase: { itemName: string; category: string; purchasePrice: number; purchaseDate: string; notes: string }) => {
    const saved = localStorage.getItem("artperiod_portfolio");
    let currentList: PurchaseRecord[] = [];
    if (saved) {
      try {
        currentList = JSON.parse(saved);
      } catch (e) {
        currentList = [];
      }
    }
    const newRecord: PurchaseRecord = {
      id: `p-${Date.now()}`,
      itemName: purchase.itemName,
      category: purchase.category,
      purchasePrice: purchase.purchasePrice,
      purchaseDate: purchase.purchaseDate,
      sold: false,
      notes: purchase.notes
    };
    localStorage.setItem("artperiod_portfolio", JSON.stringify([newRecord, ...currentList]));
    setRefreshTrigger((prev) => prev + 1);
  };

  // Magic Carpet Altitude & Formation Handlers
  const summonAndElevateCarpet = (stage: PipelineStage) => {
    setActiveStage(stage);
    setTopZIndex((prev) => prev + 1);
    setCarpetStates((prev) => ({
      ...prev,
      [stage]: {
        ...prev[stage],
        isOpen: true,
        isMinimized: false,
        zIndex: topZIndex + 1,
      },
    }));
  };

  const toggleCarpet = (stage: PipelineStage) => {
    setActiveStage(stage);
    setTopZIndex((prev) => prev + 1);
    setCarpetStates((prev) => {
      const willOpen = !prev[stage].isOpen;
      return {
        ...prev,
        [stage]: {
          ...prev[stage],
          isOpen: willOpen,
          isMinimized: false,
          zIndex: willOpen ? topZIndex + 1 : prev[stage].zIndex,
        },
      };
    });
  };

  const handleFocusCarpet = (stage: PipelineStage) => {
    setActiveStage(stage);
    setTopZIndex((prev) => prev + 1);
    setCarpetStates((prev) => ({
      ...prev,
      [stage]: {
        ...prev[stage],
        zIndex: topZIndex + 1,
      },
    }));
  };

  const handleToggleMinimize = (stage: PipelineStage) => {
    setCarpetStates((prev) => ({
      ...prev,
      [stage]: {
        ...prev[stage],
        isMinimized: !prev[stage].isMinimized,
      },
    }));
  };

  const handleToggleFullscreen = (stage: PipelineStage) => {
    setCarpetStates((prev) => ({
      ...prev,
      [stage]: {
        ...prev[stage],
        isFullscreen: !prev[stage].isFullscreen,
      },
    }));
  };

  const handleCloseCarpet = (stage: PipelineStage) => {
    setCarpetStates((prev) => ({
      ...prev,
      [stage]: {
        ...prev[stage],
        isOpen: false,
      },
    }));
  };

  const handleSetFormation = (formation: FlightFormation) => {
    setFlightFormation(formation);
    if (formation === "solo") {
      setCarpetStates((prev) => {
        const next = { ...prev };
        (Object.keys(next) as PipelineStage[]).forEach((key) => {
          next[key] = { ...next[key], isOpen: key === activeStage, isFullscreen: false };
        });
        return next;
      });
    } else if (formation === "dual") {
      setCarpetStates((prev) => {
        const next = { ...prev };
        (Object.keys(next) as PipelineStage[]).forEach((key) => {
          next[key] = { ...next[key], isOpen: key === "scout" || key === "appraise", isFullscreen: false };
        });
        return next;
      });
    } else if (formation === "tiled") {
      setCarpetStates((prev) => {
        const next = { ...prev };
        (Object.keys(next) as PipelineStage[]).forEach((key) => {
          next[key] = {
            ...next[key],
            isOpen: ["scout", "appraise", "bid", "liquidate"].includes(key),
            isFullscreen: false,
          };
        });
        return next;
      });
    }
  };

  // Pipeline Flow 1: Forward Scouted item to Stage 02 Optical Appraisal
  const handleSendToAppraisalFromSites = (item: { title: string; image?: string; notes?: string }) => {
    setInitialAppraisalItem(item);
    setInFlightItem({
      id: `inflight-${Date.now()}`,
      title: item.title,
      imageUrl: item.image,
      notes: item.notes,
      stageOriginated: "scout"
    });
    summonAndElevateCarpet("appraise");
  };

  // Pipeline Flow 2: Forward Appraised item to Stage 03 Bidding Terminal
  const handleSendToBiddingFromAppraisal = (item: any) => {
    const newItem: TrackedItem = {
      id: `tr-${Date.now()}`,
      title: item.title,
      platform: "ctbids",
      platformUrl: "https://ctbids.com",
      imageUrl: item.imageUrl,
      currentBid: item.currentBid || 35,
      myMaxBudget: item.myMaxBudget || 140,
      myCurrentBid: item.currentBid || 35,
      endTime: "4h 15m remaining (Soft-Close)",
      status: "bidding",
      dateAdded: new Date().toISOString().split("T")[0],
      category: item.category,
      notes: item.notes,
      bidHistory: [],
      channelPricing: {
        ebayEst: item.estValue || 380,
        fbMarketplaceEst: Math.round((item.estValue || 380) * 0.8),
        specialtyHouseEst: Math.round((item.estValue || 380) * 1.2),
        recommendedChannel: "eBay"
      }
    };
    setTrackedItems((prev) => [newItem, ...prev]);
    setInFlightItem({
      id: newItem.id,
      title: newItem.title,
      imageUrl: newItem.imageUrl,
      category: newItem.category,
      currentBid: newItem.currentBid,
      targetMaxBid: newItem.myMaxBudget,
      estValue: item.estValue,
      notes: newItem.notes,
      stageOriginated: "appraise"
    });
    summonAndElevateCarpet("bid");
  };

  // Pipeline Flow 3: Forward Appraised or Acquired item to Stage 04 Store Lister
  const handleSendToVaultFromAppraisal = (item: any) => {
    const newItem: TrackedItem = {
      id: `inv-${Date.now()}`,
      title: item.title,
      platform: "ctbids",
      platformUrl: "https://ctbids.com",
      imageUrl: item.imageUrl,
      currentBid: item.purchasePrice || 45,
      myMaxBudget: item.purchasePrice || 45,
      purchasePrice: item.purchasePrice || 45,
      endTime: "Acquired",
      status: "inventory_in_hand",
      fulfillmentStatus: "received",
      inventoryDestination: "store_resale",
      dateAdded: new Date().toISOString().split("T")[0],
      category: item.category,
      notes: item.notes,
      bidHistory: [],
      channelPricing: {
        ebayEst: item.estValue || 350,
        fbMarketplaceEst: Math.round((item.estValue || 350) * 0.85),
        specialtyHouseEst: Math.round((item.estValue || 350) * 1.25),
        recommendedChannel: "eBay"
      }
    };
    setTrackedItems((prev) => [newItem, ...prev]);
    setInFlightItem({
      id: newItem.id,
      title: newItem.title,
      imageUrl: newItem.imageUrl,
      category: newItem.category,
      estValue: item.estValue,
      targetMaxBid: newItem.purchasePrice,
      notes: newItem.notes,
      stageOriginated: "appraise"
    });
    summonAndElevateCarpet("liquidate");
  };

  const handleTrackNewItemFromSites = (item: TrackedItem) => {
    setTrackedItems((prev) => [item, ...prev]);
    setInFlightItem({
      id: item.id,
      title: item.title,
      imageUrl: item.imageUrl,
      currentBid: item.currentBid,
      targetMaxBid: item.myMaxBudget,
      notes: item.notes,
      stageOriginated: "scout"
    });
    summonAndElevateCarpet("bid");
  };

  const handleSendToStoreStudio = (item: TrackedItem) => {
    setInFlightItem({
      id: item.id,
      title: item.title,
      imageUrl: item.imageUrl,
      currentBid: item.purchasePrice || item.currentBid,
      targetMaxBid: item.purchasePrice || item.myMaxBudget,
      notes: item.notes,
      stageOriginated: "bid"
    });
    summonAndElevateCarpet("liquidate");
  };

  const handleOpenHallmarkDecoder = (query?: string) => {
    summonAndElevateCarpet("hallmark");
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200 font-sans relative overflow-x-hidden pb-20">
      
      {/* 1. Celestial Stardust & Constellation Backdrop for Floating Windows */}
      <MagicCarpetBackdrop interactive={displayMode === "carpet"} />

      {/* 2. Top Glass Header */}
      <header className="border-b border-white/[0.08] bg-[#0b0e14]/85 backdrop-blur-xl sticky top-0 z-40 px-6 py-3 flex items-center justify-between flex-wrap gap-4">
        <ProveniqLogo 
          size="md" 
          badge="SPATIAL OS"
          subtitle="Frameless Floating Windows • Continuous Arbitrage Stream" 
        />

        {/* Center: Mode & Formation Switches */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Spatial Carpet vs Classic Stream Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/90 rounded-2xl border border-white/10 shadow-inner">
            <button
              type="button"
              onClick={() => setDisplayMode("carpet")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                displayMode === "carpet"
                  ? "bg-gradient-to-r from-amber-500/30 to-amber-600/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Magic Carpets</span>
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode("pipeline")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                displayMode === "pipeline"
                  ? "bg-slate-800 text-slate-100 border border-white/10 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Columns className="h-3.5 w-3.5" />
              <span>Classic Stream</span>
            </button>
          </div>

          {/* Quick Formation Selector in Carpet Mode */}
          {displayMode === "carpet" && (
            <div className="hidden lg:flex items-center gap-1 px-2 py-1 bg-slate-950/80 rounded-2xl border border-white/10 text-xs font-mono">
              <span className="text-[10px] text-slate-500 px-1 uppercase">Flight:</span>
              <button
                type="button"
                onClick={() => handleSetFormation("solo")}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  flightFormation === "solo"
                    ? "bg-amber-500/20 text-amber-300 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Solo
              </button>
              <button
                type="button"
                onClick={() => handleSetFormation("dual")}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  flightFormation === "dual"
                    ? "bg-indigo-500/20 text-indigo-300 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Dual Tandem
              </button>
              <button
                type="button"
                onClick={() => handleSetFormation("tiled")}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  flightFormation === "tiled"
                    ? "bg-sky-500/20 text-sky-300 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Quad Orbit
              </button>
            </div>
          )}

          {/* Levitation Breeze Status */}
          {displayMode === "carpet" && (
            <button
              type="button"
              onClick={() => setIsBreezeFloating((prev) => !prev)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border font-mono transition-all ${
                isBreezeFloating
                  ? "bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                  : "bg-slate-950/80 text-slate-500 border-white/5 hover:text-slate-300"
              }`}
            >
              <Wind className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline text-[11px]">
                {isBreezeFloating ? "Levitation Active" : "Anchored"}
              </span>
            </button>
          )}
        </div>

        {/* Right: Live Portfolio Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-xs bg-slate-950/80 px-4 py-1.5 rounded-xl border border-white/10 font-mono shadow-inner">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">PROFIT:</span>
              <span className="text-emerald-400 font-bold">+${portfolioStats.profit}</span>
            </div>
            <div className="h-3.5 w-[1px] bg-white/10" />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-slate-500">WIN RATE:</span>
              <span className="text-indigo-400 font-bold">{portfolioStats.winRate}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 space-y-6 relative z-10">
        
        {/* Pipeline Navigation / Guide */}
        {displayMode === "pipeline" && (
          <PipelineStreamBar
            currentStage={activeStage}
            onSelectStage={(stage) => summonAndElevateCarpet(stage)}
            trackedItems={trackedItems}
            onToggleGuide={() => setIsGuideOpen((prev) => !prev)}
            isGuideOpen={isGuideOpen}
          />
        )}

        {/* Collapsible Flow Guide */}
        {isGuideOpen && (
          <PipelineFlowGuide
            onSelectStage={(stage) => summonAndElevateCarpet(stage)}
            onClose={() => setIsGuideOpen(false)}
          />
        )}

        {/* Active Subject Conduit (Persistent river carrying current subject item across carpets) */}
        <PipelineConduit
          item={inFlightItem}
          currentStage={activeStage}
          onNavigateToStage={(stage) => summonAndElevateCarpet(stage)}
          onClearItem={() => setInFlightItem(null)}
        />

        {/* ------------------------------------------------------------- */}
        {/* SPATIAL MAGIC CARPET VIEWPORT (Frameless Floating Windows)     */}
        {/* ------------------------------------------------------------- */}
        {displayMode === "carpet" ? (
          <div className="relative min-h-[750px] pb-16">
            
            {/* Aerial Flight Grid or Solo Stage */}
            <div className={`transition-all duration-500 ${
              flightFormation === "dual"
                ? "grid grid-cols-1 xl:grid-cols-2 gap-8 items-start"
                : flightFormation === "tiled"
                ? "grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
                : "space-y-8 max-w-6xl mx-auto"
            }`}>

              {/* CARPET 01: Scout & Radar */}
              {carpetStates.scout.isOpen && (
                <MagicCarpetWindow
                  id="scout"
                  title="Scout & Radar"
                  stageNumber="01"
                  subtitle="Cross-Platform Sleeper Detection & Misspelling Arbitrage"
                  icon={Globe}
                  accentColor="amber"
                  badgeText="CTBids • HiBid • LiveAuctioneers"
                  isFloating={isBreezeFloating}
                  isMinimized={carpetStates.scout.isMinimized}
                  isFullscreen={carpetStates.scout.isFullscreen}
                  zIndex={carpetStates.scout.zIndex}
                  onFocus={() => handleFocusCarpet("scout")}
                  onClose={() => handleCloseCarpet("scout")}
                  onToggleMinimize={() => handleToggleMinimize("scout")}
                  onToggleFullscreen={() => handleToggleFullscreen("scout")}
                >
                  <AuctionSitesHub
                    onLoggedPurchase={handleLoggedPurchaseFromAi}
                    onTrackItem={handleTrackNewItemFromSites}
                    onSendToAppraisal={handleSendToAppraisalFromSites}
                    selectedNicheFilter={selectedNiche}
                  />
                </MagicCarpetWindow>
              )}

              {/* CARPET 02: Optical Appraisal Lens */}
              {carpetStates.appraise.isOpen && (
                <MagicCarpetWindow
                  id="appraise"
                  title="Optical Appraisal Lens"
                  stageNumber="02"
                  subtitle="Multimodal Visual Inspection, Hallmark Attribution & Margin Calculations"
                  icon={Camera}
                  accentColor="indigo"
                  badgeText="Gemini Vision • Comps AI"
                  isFloating={isBreezeFloating}
                  isMinimized={carpetStates.appraise.isMinimized}
                  isFullscreen={carpetStates.appraise.isFullscreen}
                  zIndex={carpetStates.appraise.zIndex}
                  onFocus={() => handleFocusCarpet("appraise")}
                  onClose={() => handleCloseCarpet("appraise")}
                  onToggleMinimize={() => handleToggleMinimize("appraise")}
                  onToggleFullscreen={() => handleToggleFullscreen("appraise")}
                >
                  <ItemAnalysis 
                    onLoggedPurchase={handleLoggedPurchaseFromAi}
                    onSendToBidding={handleSendToBiddingFromAppraisal}
                    onSendToVault={handleSendToVaultFromAppraisal}
                    onOpenHallmarkDecoder={handleOpenHallmarkDecoder}
                    initialItem={initialAppraisalItem}
                  />
                </MagicCarpetWindow>
              )}

              {/* CARPET 03: Bidding Terminal */}
              {carpetStates.bid.isOpen && (
                <MagicCarpetWindow
                  id="bid"
                  title="Bidding Terminal"
                  stageNumber="03"
                  subtitle="Behavioral Defense, Odd-Number Increments & Soft-Close Sniping"
                  icon={Bookmark}
                  accentColor="sky"
                  badgeText={`${trackedItems.filter((i) => i.status === "bidding").length} Active Tracked Lots`}
                  isFloating={isBreezeFloating}
                  isMinimized={carpetStates.bid.isMinimized}
                  isFullscreen={carpetStates.bid.isFullscreen}
                  zIndex={carpetStates.bid.zIndex}
                  onFocus={() => handleFocusCarpet("bid")}
                  onClose={() => handleCloseCarpet("bid")}
                  onToggleMinimize={() => handleToggleMinimize("bid")}
                  onToggleFullscreen={() => handleToggleFullscreen("bid")}
                >
                  <InventoryBiddingCenter
                    trackedItems={trackedItems}
                    setTrackedItems={setTrackedItems}
                    onSendToStoreStudio={handleSendToStoreStudio}
                  />
                </MagicCarpetWindow>
              )}

              {/* CARPET 04: Vault & Store Lister */}
              {carpetStates.liquidate.isOpen && (
                <MagicCarpetWindow
                  id="liquidate"
                  title="Store & In-Hand Vault"
                  stageNumber="04"
                  subtitle="Multi-Channel Liquidation: eBay, Etsy, 1stDibs & Local Dispatch"
                  icon={ShoppingBag}
                  accentColor="emerald"
                  badgeText={`${trackedItems.filter((i) => i.status === "inventory_in_hand").length} Acquired Items`}
                  isFloating={isBreezeFloating}
                  isMinimized={carpetStates.liquidate.isMinimized}
                  isFullscreen={carpetStates.liquidate.isFullscreen}
                  zIndex={carpetStates.liquidate.zIndex}
                  onFocus={() => handleFocusCarpet("liquidate")}
                  onClose={() => handleCloseCarpet("liquidate")}
                  onToggleMinimize={() => handleToggleMinimize("liquidate")}
                  onToggleFullscreen={() => handleToggleFullscreen("liquidate")}
                >
                  <StoreListingStudio
                    inventoryItems={trackedItems.filter((i) => i.status === "inventory_in_hand")}
                    onLoggedSale={handleLoggedPurchaseFromAi}
                  />
                </MagicCarpetWindow>
              )}

              {/* CARPET 05: Hallmark Loupe & Touchmarks */}
              {carpetStates.hallmark.isOpen && (
                <MagicCarpetWindow
                  id="hallmark"
                  title="Hallmark Loupe & Touchmark Vault"
                  subtitle="Sterling Silver, Ceramics, Fine Porcelain & Goldsmith Touchmarks"
                  icon={ShieldCheck}
                  accentColor="amber"
                  badgeText="Assay Office Matrix"
                  isFloating={isBreezeFloating}
                  isMinimized={carpetStates.hallmark.isMinimized}
                  isFullscreen={carpetStates.hallmark.isFullscreen}
                  zIndex={carpetStates.hallmark.zIndex}
                  onFocus={() => handleFocusCarpet("hallmark")}
                  onClose={() => handleCloseCarpet("hallmark")}
                  onToggleMinimize={() => handleToggleMinimize("hallmark")}
                  onToggleFullscreen={() => handleToggleFullscreen("hallmark")}
                >
                  <HallmarkDecoder />
                </MagicCarpetWindow>
              )}

              {/* CARPET 06: Route Logistics */}
              {carpetStates.route.isOpen && (
                <MagicCarpetWindow
                  id="route"
                  title="Route Logistics & Drive Cluster"
                  subtitle="Multi-Estate Drive Clustering & Fuel/Time Overhead Amortization"
                  icon={Compass}
                  accentColor="indigo"
                  badgeText="Field Logistics"
                  isFloating={isBreezeFloating}
                  isMinimized={carpetStates.route.isMinimized}
                  isFullscreen={carpetStates.route.isFullscreen}
                  zIndex={carpetStates.route.zIndex}
                  onFocus={() => handleFocusCarpet("route")}
                  onClose={() => handleCloseCarpet("route")}
                  onToggleMinimize={() => handleToggleMinimize("route")}
                  onToggleFullscreen={() => handleToggleFullscreen("route")}
                >
                  <RoutePlanner />
                </MagicCarpetWindow>
              )}

              {/* CARPET 07: Restoration Workbench */}
              {carpetStates.workbench.isOpen && (
                <MagicCarpetWindow
                  id="workbench"
                  title="Restoration & Puzzle Studio"
                  subtitle="Sandbox Diagnostics & Condition Restoration Logs"
                  icon={Puzzle}
                  accentColor="purple"
                  badgeText="Studio Sandbox"
                  isFloating={isBreezeFloating}
                  isMinimized={carpetStates.workbench.isMinimized}
                  isFullscreen={carpetStates.workbench.isFullscreen}
                  zIndex={carpetStates.workbench.zIndex}
                  onFocus={() => handleFocusCarpet("workbench")}
                  onClose={() => handleCloseCarpet("workbench")}
                  onToggleMinimize={() => handleToggleMinimize("workbench")}
                  onToggleFullscreen={() => handleToggleFullscreen("workbench")}
                >
                  <StudioWorkbench onLoggedPurchase={handleLoggedPurchaseFromAi} activeNicheFilter={selectedNiche} />
                </MagicCarpetWindow>
              )}

              {/* CARPET 08: Taxonomies & Niche Matrix */}
              {carpetStates.taxonomy.isOpen && (
                <MagicCarpetWindow
                  id="taxonomy"
                  title="Taxonomies & Niche Matrix"
                  subtitle="High-Margin Historical Categories & Sleeper Keywords"
                  icon={Layers}
                  accentColor="rose"
                  badgeText="Comps Matrix"
                  isFloating={isBreezeFloating}
                  isMinimized={carpetStates.taxonomy.isMinimized}
                  isFullscreen={carpetStates.taxonomy.isFullscreen}
                  zIndex={carpetStates.taxonomy.zIndex}
                  onFocus={() => handleFocusCarpet("taxonomy")}
                  onClose={() => handleCloseCarpet("taxonomy")}
                  onToggleMinimize={() => handleToggleMinimize("taxonomy")}
                  onToggleFullscreen={() => handleToggleFullscreen("taxonomy")}
                >
                  <NicheExplorer />
                </MagicCarpetWindow>
              )}

            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* CLASSIC SINGLE-STREAM PIPELINE VIEW                            */
          /* ------------------------------------------------------------- */
          <div className="transition-all duration-300">
            {activeStage === "scout" && (
              <AuctionSitesHub
                onLoggedPurchase={handleLoggedPurchaseFromAi}
                onTrackItem={handleTrackNewItemFromSites}
                onSendToAppraisal={handleSendToAppraisalFromSites}
                selectedNicheFilter={selectedNiche}
              />
            )}
            {activeStage === "appraise" && (
              <ItemAnalysis 
                onLoggedPurchase={handleLoggedPurchaseFromAi}
                onSendToBidding={handleSendToBiddingFromAppraisal}
                onSendToVault={handleSendToVaultFromAppraisal}
                onOpenHallmarkDecoder={handleOpenHallmarkDecoder}
                initialItem={initialAppraisalItem}
              />
            )}
            {activeStage === "bid" && (
              <InventoryBiddingCenter
                trackedItems={trackedItems}
                setTrackedItems={setTrackedItems}
                onSendToStoreStudio={handleSendToStoreStudio}
              />
            )}
            {activeStage === "liquidate" && (
              <StoreListingStudio
                inventoryItems={trackedItems.filter((i) => i.status === "inventory_in_hand")}
                onLoggedSale={handleLoggedPurchaseFromAi}
              />
            )}
            {activeStage === "hallmark" && <HallmarkDecoder />}
            {activeStage === "route" && <RoutePlanner />}
            {activeStage === "workbench" && (
              <StudioWorkbench onLoggedPurchase={handleLoggedPurchaseFromAi} activeNicheFilter={selectedNiche} />
            )}
            {activeStage === "taxonomy" && <NicheExplorer />}
          </div>
        )}
      </main>

      {/* Floating Magic Carpet Dock (Bottom Glass Runes Bar) */}
      {displayMode === "carpet" && (
        <MagicCarpetDock
          carpets={carpetStates}
          onToggleCarpet={toggleCarpet}
          onSetFormation={handleSetFormation}
          currentFormation={flightFormation}
          isBreezeFloating={isBreezeFloating}
          onToggleBreeze={() => setIsBreezeFloating((prev) => !prev)}
          trackedCount={trackedItems.filter((i) => i.status === "bidding").length}
          inHandCount={trackedItems.filter((i) => i.status === "inventory_in_hand").length}
          activeStageId={activeStage}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#06080c]/90 px-6 py-4 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-500 font-mono relative z-20">
        <div className="flex items-center gap-2">
          <ProveniqLogo size="xs" showSubtitle={false} />
          <span className="text-slate-700">|</span>
          <span>Decision-Grade Estate &amp; Auction Intelligence</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>Mode: {displayMode === "carpet" ? "Magic Carpet Spatial OS" : "Standard Stream"}</span>
          <span>•</span>
          <span>Formation: {flightFormation.toUpperCase()}</span>
          <span>•</span>
          <span>Levitation: {isBreezeFloating ? "Active" : "Anchored"}</span>
        </div>
      </footer>
    </div>
  );
}

