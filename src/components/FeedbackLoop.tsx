import React, { useState, useEffect } from "react";
import { PurchaseRecord } from "../types";
import { DollarSign, CheckCircle2, TrendingUp, Clock, Plus, Filter, Tag, Check, Award, AlertCircle } from "lucide-react";

// Pre-load past transactions for immediate visual fidelity
const initialPurchases: PurchaseRecord[] = [
  {
    id: "p-1",
    itemName: "Ib Kofod-Larsen Teak Sideboard",
    category: "Furniture / MCM",
    purchasePrice: 200,
    purchaseDate: "2026-05-10",
    sold: true,
    salePrice: 1850,
    saleDate: "2026-06-01",
    saleChannel: "Showroom Consignment",
    actualRoi: 9.25,
    daysToSale: 22,
    notes: "Top restored with organic oil finish. Paid immediate dividends."
  },
  {
    id: "p-2",
    itemName: "Sterling 1847 Rogers Bros Set",
    category: "Fine Jewelry / Metalware",
    purchasePrice: 75,
    purchaseDate: "2026-06-12",
    sold: true,
    salePrice: 1210,
    saleDate: "2026-06-25",
    saleChannel: "Dealer Sale",
    actualRoi: 16.1,
    daysToSale: 13,
    notes: "Immediate cash transaction based on troy ounce purity."
  },
  {
    id: "p-3",
    itemName: "Starrett No. 224 Micrometer Set",
    category: "Industrial Tools & Machining",
    purchasePrice: 10,
    purchaseDate: "2026-06-20",
    sold: true,
    salePrice: 175,
    saleDate: "2026-07-02",
    saleChannel: "eBay",
    actualRoi: 17.5,
    daysToSale: 12,
    notes: "Quick cleaned with light mineral lubricant."
  },
  {
    id: "p-4",
    itemName: "Vintage Pyrex Gooseberry Mixing Bowls",
    category: "Studio Glass / Tableware",
    purchasePrice: 15,
    purchaseDate: "2026-07-05",
    sold: false,
    notes: "Listed on Etsy for $265. High engagement, active collectors messaging."
  }
];

export default function FeedbackLoop() {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>(() => {
    const saved = localStorage.getItem("artperiod_portfolio");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialPurchases;
      }
    }
    return initialPurchases;
  });

  // Save to local storage whenever list changes
  useEffect(() => {
    localStorage.setItem("artperiod_portfolio", JSON.stringify(purchases));
  }, [purchases]);

  // Form states for new purchase
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("Fine Jewelry / Metalware");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  // Sale logging states
  const [selectedForSale, setSelectedForSale] = useState<string | null>(null);
  const [salePrice, setSalePrice] = useState("");
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);
  const [saleChannel, setSaleChannel] = useState("eBay");

  // Filter state
  const [filterMode, setFilterMode] = useState<"all" | "active" | "sold">("all");

  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !purchasePrice) return;

    const newRecord: PurchaseRecord = {
      id: `p-${Date.now()}`,
      itemName,
      category,
      purchasePrice: parseFloat(purchasePrice),
      purchaseDate,
      sold: false,
      notes
    };

    setPurchases([newRecord, ...purchases]);
    setItemName("");
    setPurchasePrice("");
    setNotes("");
  };

  const handleMarkAsSold = (id: string) => {
    setSelectedForSale(id);
    const item = purchases.find((p) => p.id === id);
    if (item) {
      // Suggest double the purchase price as a baseline
      setSalePrice((item.purchasePrice * 3).toString());
    }
  };

  const handleConfirmSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForSale || !salePrice) return;

    setPurchases(
      purchases.map((p) => {
        if (p.id === selectedForSale) {
          const spend = p.purchasePrice;
          const revenue = parseFloat(salePrice);
          const roiValue = parseFloat(((revenue - spend) / spend).toFixed(2));
          
          // Calculate approximate days to sale
          const pDate = new Date(p.purchaseDate);
          const sDate = new Date(saleDate);
          const diffTime = Math.abs(sDate.getTime() - pDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

          return {
            ...p,
            sold: true,
            salePrice: revenue,
            saleDate,
            saleChannel,
            actualRoi: roiValue,
            daysToSale: diffDays
          };
        }
        return p;
      })
    );

    setSelectedForSale(null);
    setSalePrice("");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to remove this cataloged item?")) {
      setPurchases(purchases.filter((p) => p.id !== id));
    }
  };

  // Portfolio Analytics Calculations
  const totalCapitalDeployed = purchases.reduce((sum, p) => sum + p.purchasePrice, 0);
  const soldItems = purchases.filter((p) => p.sold);
  const activeItemsCount = purchases.length - soldItems.length;

  const totalCapitalRecouped = soldItems.reduce((sum, p) => sum + (p.salePrice || 0), 0);
  const totalSpendOnSold = soldItems.reduce((sum, p) => sum + p.purchasePrice, 0);
  const realizedNetProfit = totalCapitalRecouped - totalSpendOnSold;
  
  const averageRealizedRoi = totalSpendOnSold > 0 
    ? Math.round((realizedNetProfit / totalSpendOnSold) * 100)
    : 0;

  const profitableFlipsCount = soldItems.filter((p) => (p.salePrice || 0) > p.purchasePrice).length;
  const winRatePercent = soldItems.length > 0 
    ? Math.round((profitableFlipsCount / soldItems.length) * 100) 
    : 100;

  const averageDaysToSale = soldItems.length > 0
    ? Math.round(soldItems.reduce((sum, p) => sum + (p.daysToSale || 0), 0) / soldItems.length)
    : 0;

  // Filtered List
  const filteredList = purchases.filter((p) => {
    if (filterMode === "active") return !p.sold;
    if (filterMode === "sold") return p.sold;
    return true;
  });

  return (
    <div id="portfolio-feedback-section" className="bg-[#11161d] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-100 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-400" />
            Outcome Ledger &amp; Valuation Feedback Loop
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compare estimated buy recommendations with true resale logs. This feedback calibrates your sourcing confidence over time.
          </p>
        </div>
        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded border border-indigo-500/20 font-mono">
          VALUATION MOAT
        </span>
      </div>

      {/* Grid of Key Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850">
          <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5 text-slate-400" /> Capital Deployed
          </div>
          <div className="text-lg font-bold text-slate-100 mt-1 font-mono">
            ${totalCapitalDeployed}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {activeItemsCount} items currently active
          </div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850">
          <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> Realized Net Profit
          </div>
          <div className="text-lg font-bold text-emerald-400 mt-1 font-mono">
            +${realizedNetProfit}
          </div>
          <div className="text-[10px] text-emerald-500/80 mt-1">
            Avg ROI: {averageRealizedRoi}%
          </div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850">
          <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Sourcing Win Rate
          </div>
          <div className="text-lg font-bold text-slate-100 mt-1 font-mono">
            {winRatePercent}%
          </div>
          <div className="text-[10px] text-indigo-400 mt-1">
            {profitableFlipsCount} / {soldItems.length} profitable flips
          </div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850">
          <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-amber-400" /> Avg Days-to-Sale
          </div>
          <div className="text-lg font-bold text-amber-400 mt-1 font-mono">
            {averageDaysToSale} <span className="text-xs text-slate-500 font-sans">days</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            High Velocity Liquidity
          </div>
        </div>
      </div>

      {/* Sourcing Logging and Ledger layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Catalog Item */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="h-4 w-4 text-indigo-400" /> Log Sourced Purchase
            </h3>

            <form onSubmit={handleAddPurchase} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Item Name / Attribution</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pyrex Gooseberry Mixing Bowls"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Sourcing Niche</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Furniture / MCM">Furniture / MCM</option>
                  <option value="Fine Jewelry / Metalware">Fine Jewelry / Metalware</option>
                  <option value="Fine Art / Graphics">Fine Art / Graphics</option>
                  <option value="Industrial Tools & Machining">Industrial Tools & Machining</option>
                  <option value="Studio Glass / Tableware">Studio Glass / Tableware</option>
                  <option value="Decorative Art & Sculpture">Decorative Art & Sculpture</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Cost Price ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="25"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Purchase Date</label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Sourcing Notes (optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Sourced from Ainsworth estate on day 2. Top was clean."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg py-2.5 transition-colors"
              >
                Catalog Item
              </button>
            </form>
          </div>

          {/* Active Sale Dialog */}
          {selectedForSale && (
            <div className="bg-slate-900 border border-emerald-500/20 p-4 rounded-xl space-y-4">
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="h-4 w-4" /> Log Successful Resale
              </h3>
              <form onSubmit={handleConfirmSale} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Final Sale Price ($)</label>
                  <input
                    type="number"
                    required
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Sale Date</label>
                    <input
                      type="date"
                      value={saleDate}
                      onChange={(e) => setSaleDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Exit Channel</label>
                    <select
                      value={saleChannel}
                      onChange={(e) => setSaleChannel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="eBay">eBay</option>
                      <option value="Etsy">Etsy</option>
                      <option value="Local Showroom">Local Showroom</option>
                      <option value="Consignment">Consignment</option>
                      <option value="Facebook Marketplace">FB Marketplace</option>
                      <option value="Scrap Refining">Scrap Refining</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg font-semibold"
                  >
                    Confirm Sale
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedForSale(null)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Ledger List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center bg-slate-900/30 p-3 rounded-xl border border-slate-800/80">
            <span className="text-xs font-semibold text-slate-300">POTFOLIO LEDGER</span>
            <div className="flex items-center gap-1">
              <Filter className="h-3 w-3 text-slate-500 mr-1" />
              {(["all", "active", "sold"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-2.5 py-1 text-[10px] rounded font-medium uppercase font-mono tracking-wider transition-all ${
                    filterMode === mode
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {filteredList.map((p) => {
              const profit = p.sold ? (p.salePrice || 0) - p.purchasePrice : 0;
              const roiPercent = p.sold && p.purchasePrice > 0 ? Math.round((profit / p.purchasePrice) * 100) : 0;

              return (
                <div key={p.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs flex justify-between items-center gap-4 hover:border-slate-800 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200 text-sm">{p.itemName}</span>
                      <span className="bg-slate-900 text-slate-500 text-[9px] px-1.5 py-0.5 rounded border border-slate-800 font-mono">
                        {p.category}
                      </span>
                    </div>

                    <div className="text-slate-400 flex flex-wrap gap-x-4 gap-y-1 text-[10px]">
                      <div>
                        Cost: <span className="font-mono font-medium text-slate-300">${p.purchasePrice}</span>
                      </div>
                      <div>
                        Date: <span className="font-mono text-slate-500">{p.purchaseDate}</span>
                      </div>
                      {p.notes && (
                        <div className="italic text-slate-500 text-[10px] line-clamp-1 flex-1">
                          "{p.notes}"
                        </div>
                      )}
                    </div>

                    {p.sold && (
                      <div className="text-emerald-400 font-mono text-[10px] flex items-center gap-2 mt-1">
                        <Check className="h-3 w-3" /> Resold for ${p.salePrice} on {p.saleDate} via {p.saleChannel} ({p.daysToSale} days)
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    {p.sold ? (
                      <div className="space-y-0.5">
                        <div className="text-emerald-400 font-bold font-mono text-sm">
                          +${profit}
                        </div>
                        <div className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-1.5 py-0.5 rounded font-mono font-bold">
                          +{roiPercent}% ROI
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <button
                          onClick={() => handleMarkAsSold(p.id)}
                          className="bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/10 px-3 py-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 tracking-wider"
                        >
                          <Check className="h-3.5 w-3.5" /> SELL
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-slate-600 hover:text-rose-400 text-[10px] block w-full text-right"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredList.length === 0 && (
              <div className="bg-slate-900/10 border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-500">
                No items match the selected ledger filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
