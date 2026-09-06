import React, { useState } from "react";
import { TrackedItem, ItemLifecycleStatus, FulfillmentStatus, InventoryDestination, BidLog, PsychologicalBiddingAdvisor } from "../types";
import { 
  Bookmark, Zap, Award, XCircle, Box, Flame, DollarSign, Clock, MapPin, ExternalLink, 
  Plus, Check, ArrowRight, ShieldCheck, AlertCircle, RefreshCw, Layers, TrendingUp, Tag, Truck, Sparkles
} from "lucide-react";

interface InventoryBiddingCenterProps {
  trackedItems: TrackedItem[];
  setTrackedItems: React.Dispatch<React.SetStateAction<TrackedItem[]>>;
  onSendToStoreStudio?: (item: TrackedItem) => void;
}

export default function InventoryBiddingCenter({
  trackedItems,
  setTrackedItems,
  onSendToStoreStudio
}: InventoryBiddingCenterProps) {
  const [activeTab, setActiveTab] = useState<ItemLifecycleStatus>("bidding");
  
  // Modal / Inputs for manually adding a watched or bidding item
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPlatform, setNewPlatform] = useState<any>("ctbids");
  const [newPlatformUrl, setNewPlatformUrl] = useState("");
  const [newCurrentBid, setNewCurrentBid] = useState<number>(25);
  const [newMaxBudget, setNewMaxBudget] = useState<number>(150);
  const [newEndTime, setNewEndTime] = useState("2h 15m remaining");
  const [newCategory, setNewCategory] = useState("Antiques & Collectibles");

  // Filter items by status
  const watchingItems = trackedItems.filter((i) => i.status === "watching");
  const biddingItems = trackedItems.filter((i) => i.status === "bidding");
  const wonItems = trackedItems.filter((i) => i.status === "won_pending");
  const lostItems = trackedItems.filter((i) => i.status === "lost");
  const inventoryItems = trackedItems.filter((i) => i.status === "inventory_in_hand");

  // Helper to place a strategic bid on an actively bidding item
  const handlePlaceStrategicBid = (itemId: string, bidAmount: number, tactic: string) => {
    setTrackedItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newLog: BidLog = {
            id: `bid-${Date.now()}`,
            amount: bidAmount,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            isMyBid: true,
            tacticUsed: tactic,
            note: `Placed strategic bid at $${bidAmount} utilizing ${tactic}`
          };
          const updatedCurrentBid = Math.max(item.currentBid, bidAmount);
          return {
            ...item,
            currentBid: updatedCurrentBid,
            myCurrentBid: bidAmount,
            bidHistory: [newLog, ...item.bidHistory]
          };
        }
        return item;
      })
    );
  };

  // Status transitions
  const handleUpdateStatus = (itemId: string, newStatus: ItemLifecycleStatus) => {
    setTrackedItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            status: newStatus,
            fulfillmentStatus: newStatus === "won_pending" ? "pending_pickup" : item.fulfillmentStatus,
            inventoryDestination: newStatus === "inventory_in_hand" ? (item.inventoryDestination || "store_resale") : item.inventoryDestination,
            purchasePrice: newStatus === "won_pending" || newStatus === "inventory_in_hand" ? (item.myCurrentBid || item.currentBid) : item.purchasePrice
          };
        }
        return item;
      })
    );
  };

  const handleUpdateFulfillment = (itemId: string, fStatus: FulfillmentStatus) => {
    setTrackedItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, fulfillmentStatus: fStatus } : item))
    );
  };

  const handleUpdateDestination = (itemId: string, dest: InventoryDestination) => {
    setTrackedItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, inventoryDestination: dest } : item))
    );
  };

  const handleAddNewTrackedItem = () => {
    if (!newTitle.trim()) return;
    const newItem: TrackedItem = {
      id: `tr-${Date.now()}`,
      title: newTitle,
      platform: newPlatform,
      platformUrl: newPlatformUrl || "https://ctbids.com",
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60",
      currentBid: newCurrentBid,
      myMaxBudget: newMaxBudget,
      myCurrentBid: newCurrentBid,
      endTime: newEndTime,
      status: activeTab === "watching" ? "watching" : "bidding",
      dateAdded: new Date().toISOString().split("T")[0],
      category: newCategory,
      bidHistory: [
        {
          id: `b1`,
          amount: newCurrentBid,
          timestamp: "Initial Bid",
          isMyBid: true,
          tacticUsed: "Odd-Number Opening Increments",
          note: "Starting bid anchored at odd threshold"
        }
      ],
      psychologicalAdvisor: {
        suggestedNextBid: Math.round(newCurrentBid * 1.15 + 3),
        primaryTactic: "Odd-Number Escalation ($" + Math.round(newCurrentBid * 1.15 + 3) + ")",
        tacticalReasoning: "Odd-number bids create cognitive friction for opponents accustomed to round numbers ($10, $25, $50).",
        behavioralInsight: "Submitting in the final 15 seconds disarms emotional retaliatory bidding loops while respecting soft-close rules.",
        maxBudgetCap: newMaxBudget,
        dangerZoneThreshold: Math.round(newMaxBudget * 0.9)
      },
      channelPricing: {
        ebayEst: Math.round(newMaxBudget * 2.2),
        fbMarketplaceEst: Math.round(newMaxBudget * 1.8),
        specialtyHouseEst: Math.round(newMaxBudget * 2.8),
        recommendedChannel: "eBay"
      }
    };

    setTrackedItems((prev) => [newItem, ...prev]);
    setShowAddModal(false);
    setNewTitle("");
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Lifecycle Nav */}
      <div className="bg-[#11161d] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
              <Box className="h-5.5 w-5.5 text-amber-400" />
              Inventory &amp; Bidding Lifecycle Hub
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Track items from initial watch state to active live bidding (with psychological game-theory advice), won status, fulfillment pipeline, and in-hand inventory organization.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 shrink-0"
          >
            <Plus className="h-4 w-4" /> Add Item to Lifecycle
          </button>
        </div>

        {/* Status Nav Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab("watching")}
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              activeTab === "watching"
                ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Bookmark className="h-4 w-4 text-amber-400" /> Watching
            </span>
            <span className="bg-slate-900 px-2 py-0.5 rounded text-[10px] text-amber-300">{watchingItems.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("bidding")}
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              activeTab === "bidding"
                ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-300"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-indigo-400" /> Bidding
            </span>
            <span className="bg-slate-900 px-2 py-0.5 rounded text-[10px] text-indigo-300">{biddingItems.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("won_pending")}
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              activeTab === "won_pending"
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-emerald-400" /> Won / Fulfillment
            </span>
            <span className="bg-slate-900 px-2 py-0.5 rounded text-[10px] text-emerald-300">{wonItems.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("lost")}
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              activeTab === "lost"
                ? "bg-rose-500/10 border-rose-500/40 text-rose-300"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <XCircle className="h-4 w-4 text-rose-400" /> Lost Bids
            </span>
            <span className="bg-slate-900 px-2 py-0.5 rounded text-[10px] text-rose-300">{lostItems.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("inventory_in_hand")}
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              activeTab === "inventory_in_hand"
                ? "bg-purple-500/10 border-purple-500/40 text-purple-300"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Box className="h-4 w-4 text-purple-400" /> In-Hand Inventory
            </span>
            <span className="bg-slate-900 px-2 py-0.5 rounded text-[10px] text-purple-300">{inventoryItems.length}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: WATCHING LIST */}
      {activeTab === "watching" && (
        <div className="space-y-4">
          {watchingItems.length === 0 ? (
            <div className="bg-[#11161d] rounded-2xl border border-slate-800 p-8 text-center text-slate-400 font-mono text-xs">
              No items currently in Watchlist. Save items from CTBids or auction sites to monitor them here.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {watchingItems.map((item) => (
                <div key={item.id} className="bg-slate-950 rounded-2xl border border-slate-850 p-5 space-y-4">
                  <div className="flex gap-4">
                    <img src={item.imageUrl} alt={item.title} className="w-24 h-24 object-cover rounded-xl border border-slate-800 bg-slate-900" />
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 uppercase font-bold">
                        {item.platform}
                      </span>
                      <h3 className="text-sm font-bold text-slate-100 line-clamp-2">{item.title}</h3>
                      <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-amber-400" /> {item.endTime}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-xs">
                    <div>
                      <div className="text-[9px] text-slate-500">CURRENT BID</div>
                      <div className="text-sm font-bold text-slate-200">${item.currentBid}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-500">MAX BUDGET CAP</div>
                      <div className="text-sm font-bold text-emerald-400">${item.myMaxBudget}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(item.id, "bidding")}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-indigo-600/15"
                    >
                      <Zap className="h-4 w-4" /> Move to Active Bidding
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: ACTIVELY BIDDING (WITH PSYCHOLOGICAL BIDDING ADVISOR & BID LOG) */}
      {activeTab === "bidding" && (
        <div className="space-y-6">
          {biddingItems.length === 0 ? (
            <div className="bg-[#11161d] rounded-2xl border border-slate-800 p-8 text-center text-slate-400 font-mono text-xs">
              No active bidding items currently tracked. Move items from Watchlist or add a new lot.
            </div>
          ) : (
            biddingItems.map((item) => {
              const adv = item.psychologicalAdvisor;
              const nextBid = adv?.suggestedNextBid || Math.round(item.currentBid * 1.1 + 3);

              return (
                <div key={item.id} className="bg-[#11161d] rounded-2xl border border-indigo-500/30 p-6 shadow-2xl space-y-5">
                  {/* Item Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-xl border border-slate-800 shrink-0 bg-slate-900" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/40 uppercase font-bold">
                            {item.platform}
                          </span>
                          <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 animate-pulse" /> {item.endTime}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-100 mt-1">{item.title}</h3>
                      </div>
                    </div>

                    <div className="flex gap-2 font-mono text-xs shrink-0">
                      <button
                        onClick={() => handleUpdateStatus(item.id, "won_pending")}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-600/15"
                      >
                        <Award className="h-4 w-4" /> Mark Won
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(item.id, "lost")}
                        className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold px-3 py-2 rounded-xl flex items-center gap-1 transition-all"
                      >
                        <XCircle className="h-4 w-4" /> Mark Lost
                      </button>
                    </div>
                  </div>

                  {/* Bidding Analytics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500">CURRENT HIGH BID</div>
                      <div className="text-2xl font-extrabold text-slate-100 mt-0.5">${item.currentBid}</div>
                      <div className="text-[10px] text-indigo-400 mt-1">My Last Bid: ${item.myCurrentBid || item.currentBid}</div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500">MAX BUDGET CAP</div>
                      <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">${item.myMaxBudget}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Safe Margin: +${item.myMaxBudget - item.currentBid}</div>
                    </div>

                    <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/30">
                      <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" /> SUGGESTED NEXT STRATEGIC BID
                      </div>
                      <div className="text-2xl font-extrabold text-amber-300 mt-0.5">${nextBid}</div>
                      <div className="text-[10px] text-amber-400/90 mt-1">Odd-Number Increment Tactic</div>
                    </div>
                  </div>

                  {/* Psychological Bidding Advisor Box */}
                  {adv && (
                    <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-500/10 p-5 rounded-2xl border border-amber-500/30 space-y-3">
                      <div className="flex items-center gap-2 font-mono text-amber-400 font-bold text-xs">
                        <ShieldCheck className="h-4 w-4 text-amber-400" />
                        EVIDENCE-BASED PSYCHOLOGICAL BIDDING STRATEGY
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-[10px] text-amber-300 font-bold">TACTICAL BEHAVIORAL INSIGHT:</span>
                          <p className="text-slate-300 leading-relaxed text-[11px] font-sans">{adv.tacticalReasoning}</p>
                        </div>
                        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-[10px] text-indigo-300 font-bold">ANTI-SNIPE TIMING WINDOW:</span>
                          <p className="text-slate-300 leading-relaxed text-[11px] font-sans">{adv.behavioralInsight}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                        <div className="text-xs font-mono text-slate-400">
                          Recommended next bid: <strong className="text-amber-300 text-sm">${nextBid}</strong> (Odd increment)
                        </div>

                        <button
                          onClick={() => handlePlaceStrategicBid(item.id, nextBid, adv.primaryTactic)}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/20"
                        >
                          <Zap className="h-4 w-4" /> Execute Strategic Bid (${nextBid})
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Bid History Chronological Log */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-indigo-400" /> Bid History &amp; Event Log ({item.bidHistory.length} Bids)
                    </h4>

                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-xs font-mono">
                      {item.bidHistory.map((bid) => (
                        <div key={bid.id} className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold">${bid.amount}</span>
                            <span className="text-[10px] text-slate-500">• {bid.timestamp}</span>
                            {bid.tacticUsed && (
                              <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">
                                {bid.tacticUsed}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{bid.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 3: WON BIDS (PENDING FULFILLMENT) */}
      {activeTab === "won_pending" && (
        <div className="space-y-4">
          {wonItems.length === 0 ? (
            <div className="bg-[#11161d] rounded-2xl border border-slate-800 p-8 text-center text-slate-400 font-mono text-xs">
              No won items awaiting fulfillment. Mark active bids as won to manage pickup and shipping.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {wonItems.map((item) => (
                <div key={item.id} className="bg-slate-950 rounded-2xl border border-emerald-500/30 p-5 space-y-4">
                  <div className="flex gap-4">
                    <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover rounded-xl border border-slate-800 bg-slate-900" />
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase font-bold">
                        AUCTION WON • ${item.purchasePrice || item.currentBid}
                      </span>
                      <h3 className="text-sm font-bold text-slate-100 line-clamp-2">{item.title}</h3>
                    </div>
                  </div>

                  {/* Fulfillment Status Step */}
                  <div className="space-y-2 bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs font-mono">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                      Fulfillment &amp; Delivery Status
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <button
                        onClick={() => handleUpdateFulfillment(item.id, "pending_pickup")}
                        className={`p-2 rounded-lg border text-[10px] font-bold ${
                          item.fulfillmentStatus === "pending_pickup"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : "bg-slate-950 border-slate-800 text-slate-500"
                        }`}
                      >
                        Pickup Scheduled
                      </button>

                      <button
                        onClick={() => handleUpdateFulfillment(item.id, "shipped_in_transit")}
                        className={`p-2 rounded-lg border text-[10px] font-bold ${
                          item.fulfillmentStatus === "shipped_in_transit"
                            ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                            : "bg-slate-950 border-slate-800 text-slate-500"
                        }`}
                      >
                        Shipped / In Transit
                      </button>

                      <button
                        onClick={() => handleUpdateFulfillment(item.id, "received")}
                        className={`p-2 rounded-lg border text-[10px] font-bold ${
                          item.fulfillmentStatus === "received"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : "bg-slate-950 border-slate-800 text-slate-500"
                        }`}
                      >
                        Received &amp; Inspected
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpdateStatus(item.id, "inventory_in_hand")}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-purple-600/15"
                  >
                    <Box className="h-4 w-4" /> Move to In-Hand Inventory
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: LOST BIDS */}
      {activeTab === "lost" && (
        <div className="space-y-4">
          {lostItems.length === 0 ? (
            <div className="bg-[#11161d] rounded-2xl border border-slate-800 p-8 text-center text-slate-400 font-mono text-xs">
              No lost bids logged.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lostItems.map((item) => (
                <div key={item.id} className="bg-slate-950 rounded-xl border border-slate-850 p-4 flex justify-between items-center text-xs font-mono">
                  <div>
                    <h4 className="font-bold text-slate-300">{item.title}</h4>
                    <div className="text-[10px] text-slate-500 mt-0.5">My Max Cap: ${item.myMaxBudget} • Platform: {item.platform}</div>
                  </div>
                  <span className="text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20">
                    Archived Lost
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: IN-HAND INVENTORY (WITH DESTINATION ORGANIZATION & STORE STUDIO LINK) */}
      {activeTab === "inventory_in_hand" && (
        <div className="space-y-5">
          {inventoryItems.length === 0 ? (
            <div className="bg-[#11161d] rounded-2xl border border-slate-800 p-8 text-center text-slate-400 font-mono text-xs">
              No in-hand inventory logged. Receive won items or add items directly to view inventory.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {inventoryItems.map((item) => {
                const dest = item.inventoryDestination || "store_resale";

                return (
                  <div key={item.id} className="bg-slate-950 rounded-2xl border border-purple-500/30 p-5 space-y-4">
                    <div className="flex gap-4">
                      <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover rounded-xl border border-slate-800 bg-slate-900" />
                      <div className="space-y-1 flex-1">
                        <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20 font-bold">
                          IN-HAND INVENTORY • Cost: ${item.purchasePrice || item.myCurrentBid || 35}
                        </span>
                        <h3 className="text-sm font-bold text-slate-100 line-clamp-2">{item.title}</h3>
                      </div>
                    </div>

                    {/* Destination Category Selector */}
                    <div className="space-y-2 bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs font-mono">
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                        Item Destination &amp; Status
                      </label>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <button
                          onClick={() => handleUpdateDestination(item.id, "store_resale")}
                          className={`p-2 rounded-lg border text-[10px] font-bold ${
                            dest === "store_resale"
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : "bg-slate-950 border-slate-800 text-slate-500"
                          }`}
                        >
                          Store / Resale
                        </button>

                        <button
                          onClick={() => handleUpdateDestination(item.id, "specialty_item")}
                          className={`p-2 rounded-lg border text-[10px] font-bold ${
                            dest === "specialty_item"
                              ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                              : "bg-slate-950 border-slate-800 text-slate-500"
                          }`}
                        >
                          Specialty Item
                        </button>

                        <button
                          onClick={() => handleUpdateDestination(item.id, "personal_collection")}
                          className={`p-2 rounded-lg border text-[10px] font-bold ${
                            dest === "personal_collection"
                              ? "bg-pink-500/20 text-pink-300 border-pink-500/40"
                              : "bg-slate-950 border-slate-800 text-slate-500"
                          }`}
                        >
                          Not for Resale
                        </button>
                      </div>
                    </div>

                    {/* Channel Pricing Estimates */}
                    {item.channelPricing && (
                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                        <div>
                          <div className="text-[9px] text-slate-500">EBAY EST</div>
                          <div className="text-sm font-bold text-indigo-300">${item.channelPricing.ebayEst}</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-slate-500">FB MARKET</div>
                          <div className="text-sm font-bold text-sky-300">${item.channelPricing.fbMarketplaceEst}</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-slate-500">SPECIALTY</div>
                          <div className="text-sm font-bold text-amber-300">${item.channelPricing.specialtyHouseEst}</div>
                        </div>
                      </div>
                    )}

                    {dest === "store_resale" && onSendToStoreStudio && (
                      <button
                        onClick={() => onSendToStoreStudio(item)}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-amber-500/20"
                      >
                        <Tag className="h-4 w-4" /> Open in Store Listing Studio
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal for adding manual tracked item */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur flex items-center justify-center p-4">
          <div className="bg-[#11161d] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 font-mono text-xs shadow-2xl">
            <h3 className="text-base font-bold text-slate-100 font-display">Add Item to Lifecycle Tracker</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Item Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Vintage Sterling Silver Pitcher"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Platform</label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="ctbids">CTBids</option>
                    <option value="hibid">HiBid</option>
                    <option value="liveauctioneers">LiveAuctioneers</option>
                    <option value="estatesales">EstateSales.net</option>
                    <option value="govdeals">GovDeals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Category</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Current Bid ($)</label>
                  <input
                    type="number"
                    value={newCurrentBid}
                    onChange={(e) => setNewCurrentBid(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Max Budget Cap ($)</label>
                  <input
                    type="number"
                    value={newMaxBudget}
                    onChange={(e) => setNewMaxBudget(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-900 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewTrackedItem}
                className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                Add to Tracker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
