import React, { useState } from "react";
import { MapPin, Compass, Navigation, ArrowRight, Plus, Trash2, Calendar } from "lucide-react";

interface SaleLocation {
  name: string;
  address: string;
  zip: string;
  opportunityScore: number;
}

const defaultSales: SaleLocation[] = [
  {
    name: "Oak St Mid-Century Estate Sale",
    address: "412 Oak Street, Portland, OR",
    zip: "97205",
    opportunityScore: 84
  },
  {
    name: "Glisan St Tool & Machinery Auction",
    address: "1822 NE Glisan St, Portland, OR",
    zip: "97232",
    opportunityScore: 78
  },
  {
    name: "Ainsworth Fine Art Liquidators",
    address: "815 Ainsworth Ave, Portland, OR",
    zip: "97211",
    opportunityScore: 92
  },
  {
    name: "Hawthorne Collectible Clearance",
    address: "3404 SE Hawthorne Blvd, Portland, OR",
    zip: "97214",
    opportunityScore: 61
  }
];

export default function RoutePlanner() {
  const [startZip, setStartZip] = useState<string>("97201");
  const [sales, setSales] = useState<SaleLocation[]>(defaultSales);
  const [newName, setNewName] = useState<string>("");
  const [newAddress, setNewAddress] = useState<string>("");
  const [newZip, setNewZip] = useState<string>("");
  const [newOpp, setNewOpp] = useState<number>(70);
  
  const [optimizedRoute, setOptimizedRoute] = useState<any[]>([]);
  const [totalDistance, setTotalDistance] = useState<string>("");
  const [totalDriveTime, setTotalDriveTime] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAddress) return;
    setSales([...sales, {
      name: newName,
      address: newAddress,
      zip: newZip || "Local",
      opportunityScore: newOpp
    }]);
    setNewName("");
    setNewAddress("");
    setNewZip("");
    setNewOpp(70);
  };

  const handleRemoveSale = (idx: number) => {
    setSales(sales.filter((_, i) => i !== idx));
  };

  const handleCalculateRoute = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/route-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startZip, locations: sales })
      });
      const data = await response.json();
      setOptimizedRoute(data.route || []);
      setTotalDistance(data.totalDistance || "0 miles");
      setTotalDriveTime(data.totalDriveTime || "0 mins");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="route-planner-section" className="bg-[#11161d] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-100 flex items-center gap-2">
            <Compass className="h-5 w-5 text-emerald-400" />
            Estate Route Logistics Optimizer
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compute a travel-optimized itinerary prioritizing sales by aggregate opportunity density and estimated queue-value.
          </p>
        </div>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/20 font-mono flex items-center gap-1">
          <Calendar className="h-3 w-3" /> ROUTE PLANNER
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sourcing List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Starting Location &amp; Origin
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={startZip}
                onChange={(e) => setStartZip(e.target.value)}
                placeholder="Starting ZIP code or address"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Sourcing Stops ({sales.length})
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Max Bid Priority</span>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {sales.map((sale, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-medium text-slate-200 line-clamp-1">{sale.name}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{sale.address}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-[11px] font-semibold ${
                      sale.opportunityScore >= 80 ? "text-emerald-400" : sale.opportunityScore >= 65 ? "text-indigo-400" : "text-slate-400"
                    }`}>
                      Opp: {sale.opportunityScore}
                    </span>
                    <button
                      onClick={() => handleRemoveSale(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Stop Form */}
            <form onSubmit={handleAddSale} className="border-t border-slate-800/80 pt-3 space-y-2">
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Add Sourcing Sale Lot
              </div>
              <input
                type="text"
                required
                placeholder="Sale name (e.g. Main St Tag Sale)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Address or city"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="ZIP"
                  value={newZip}
                  onChange={(e) => setNewZip(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Est. Opportunity: {newOpp}</span>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={newOpp}
                  onChange={(e) => setNewOpp(parseInt(e.target.value))}
                  className="w-24 accent-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 rounded py-1.5 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="h-3.5 w-3.5 text-indigo-400" /> Add Stop
              </button>
            </form>
          </div>

          <button
            onClick={handleCalculateRoute}
            disabled={sales.length === 0 || loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium rounded-xl py-3 text-xs shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-all"
          >
            {loading ? (
              <span className="animate-pulse">Optimizing Trajectory...</span>
            ) : (
              <>
                <Navigation className="h-4 w-4" /> Calculate GPS-Optimized Route
              </>
            )}
          </button>
        </div>

        {/* Right Column: Optimization Outcome */}
        <div className="lg:col-span-7">
          {optimizedRoute.length > 0 ? (
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5 space-y-4 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs text-slate-400">
                    SEQUENCE METRICS
                  </span>
                  <div className="flex gap-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-500">Distance:</span>{" "}
                      <span className="font-semibold text-emerald-400">
                        {totalDistance}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Drive Time:</span>{" "}
                      <span className="font-semibold text-indigo-400">
                        {totalDriveTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vertical Step list */}
                <div className="mt-4 space-y-4">
                  {optimizedRoute.map((stop, i) => (
                    <div key={i} className="relative flex gap-4 pl-1">
                      {/* Connector Line */}
                      {i < optimizedRoute.length - 1 && (
                        <div className="absolute left-3 top-6 bottom-[-20px] w-0.5 bg-slate-800 border-dashed border-l" />
                      )}

                      <div className="relative flex items-center justify-center bg-slate-950 border border-slate-800 h-6 w-6 rounded-full text-[10px] font-mono text-indigo-400 font-bold shrink-0">
                        {i + 1}
                      </div>

                      <div className="flex-1 bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-200">
                            {stop.name}
                          </div>
                          <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-600 shrink-0" />
                            {stop.address}
                          </div>
                          <div className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-indigo-300 font-medium inline-block">
                            Priority arrival: {stop.suggestedArrival}
                          </div>
                        </div>

                        <div className="text-right font-mono text-[10px] shrink-0 pl-4 space-y-1">
                          <div className="text-emerald-400 font-bold">
                            OPP: {stop.opportunityScore}
                          </div>
                          <div className="text-slate-500">
                            +{stop.driveTime} ({stop.distance})
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>OPTIMIZATION MATRIX: AP-ROUTE v1.0</span>
                <span className="text-emerald-400/80 flex items-center gap-1">
                  ● HIGH CONFIDENCE SEQUENCE <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/20 border border-slate-800 border-dashed rounded-xl p-10 h-full flex flex-col items-center justify-center text-center space-y-3">
              <Navigation className="h-10 w-10 text-slate-700 animate-pulse" />
              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-400">
                  No Optimization Calculated Yet
                </div>
                <p className="text-xs text-slate-500 max-w-sm">
                  Add local estate sales and input your starting coordinates, then click the optimizer to plot an aggressive route map.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
