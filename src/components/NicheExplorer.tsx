import React, { useState } from "react";
import { seedCases } from "../data/seedCases";
import { Compass, Hammer, Award, Coins, Sparkles, AlertTriangle, Layers, ArrowUpRight } from "lucide-react";

interface NicheDetails {
  id: string;
  name: string;
  icon: any;
  eras: string[];
  keyMarkers: string[];
  forgeryRisks: string[];
  liquidityTier: "High" | "Medium" | "Low";
  shippingComplexity: "Low" | "Medium" | "High";
  guideText: string;
}

const niches: NicheDetails[] = [
  {
    id: "mcm",
    name: "Mid-Century Modern Furniture",
    icon: Compass,
    eras: ["Danish Modern (1950s-1960s)", "American Modernist (1960s-1970s)"],
    keyMarkers: [
      "Stamped branding under frame (e.g., 'Made in Denmark', 'Faarup', 'Herman Miller')",
      "Tapered dowel legs with brass levellers or wood threads",
      "Solid teak, rosewood, or walnut construction (never particle board)",
      "Organic sculpted wood finger joints and integrated drawer pulls"
    ],
    forgeryRisks: [
      "Later 1980s reproductions with low-grade particle board cores",
      "Sloppy polyurethane coatings mimicking original hand-rubbed oil finishes",
      "Missing brand marks paired with unsubstantiated designer attributions"
    ],
    liquidityTier: "Medium",
    shippingComplexity: "High",
    guideText: "MCM furniture holds extremely high margins if verified. Sourcing focuses on finding high-quality wood grains and signatures. Because of transit costs, verify local market demand or establish freight shipping arrangements before submitting aggressive bids."
  },
  {
    id: "silver-jewelry",
    name: "Jewelry & Sterling Silver",
    icon: Award,
    eras: ["Art Deco (1920-1939)", "Victorian (1837-1901)", "Modernist Studio Silver"],
    keyMarkers: [
      "Stamped purity hallmarks: '.925', 'Sterling', '900', '800' or British hallmark symbols",
      "Maker stamps or studio signatures under loops or inside bracelet bands",
      "Heavy hand-hammered rims and bezel mountings for genuine stones",
      "Patinas in recesses; avoid pieces with absolutely zero wear unless mint in original box"
    ],
    forgeryRisks: [
      "Acid-plated base metal mimicking heavy solid silver (weight test is key)",
      "Fake vintage Navajo stamps applied to modern low-grade alloy imports",
      "Purity hallmarks stamped illegally on silver-plated table serving sets"
    ],
    liquidityTier: "High",
    shippingComplexity: "Low",
    guideText: "The holy grail of thrift. Solid silver offers a secure financial floor through direct scrap/melt value. Sourcing focus is hallmarks. Always carry a loupe, magnet, and digital pocket scale to separate plating from solid sterling immediately."
  },
  {
    id: "fine-art",
    name: "Fine Art & Graphic Prints",
    icon: Sparkles,
    eras: ["Modern Graphics (1950-1980)", "WPA Era Prints", "Exhibition Lithographs"],
    keyMarkers: [
      "Visible texture of fine woven rag paper vs. cheap glossy modern cardstock",
      "Pencil signatures, limited edition annotations (e.g. '45/150' or 'A.P.' for Artist's Proof)",
      "Decker edges (rough raw paper edges) and evidence of impression plate embossing",
      "Original gallery stickers or framing labels on back dust covers"
    ],
    forgeryRisks: [
      "Modern offset poster printing mimicking authentic stone/plate lithographs (look for halftone ink dots under loupe)",
      "Photocopied signatures printed directly onto the sheet instead of hand-written graphite",
      "Unlicensed restrikes printed on modern paper"
    ],
    liquidityTier: "Medium",
    shippingComplexity: "Medium",
    guideText: "Graphic prints represent substantial arbitrage opportunities because general estate sellers rarely distinguish exhibition lithographs from cheap commercial reprints. Measure dimensions and inspect paper margins with a magnifier."
  },
  {
    id: "tools",
    name: "Vintage Tools & Machining",
    icon: Hammer,
    eras: ["Pre-WWII (Pat. 1890-1930)", "Industrial Expansion Era (1940-1970)"],
    keyMarkers: [
      "Embossed trademark stamps: 'Starrett', 'Brown & Sharpe', 'Plomb', 'Stanley Bailey'",
      "Cast iron frames, polished brass adjustment dials, and rosewood handles",
      "Engraved micro-scales with deep, clean alignment ticks",
      "Presence of custom fitted hardwood presentation boxes"
    ],
    forgeryRisks: [
      "Modern cheap alloy imports packaged in aged counterfeit vintage packaging",
      "Mixed parts: low-value replacement blades or handles wedged into valuable older bodies",
      "Re-painted steel to cover hairline structural cracks in heavy vises or calibration frames"
    ],
    liquidityTier: "High",
    shippingComplexity: "Low",
    guideText: "Vintage professional tools are highly liquid because machinists and mechanical collectors aggressively source older heavy-cast tooling. Shipping is cheap and rapid through flat-rate boxes. Look for original boxes and complete anvil kits."
  },
  {
    id: "glassware",
    name: "Ceramics & Glassware",
    icon: Coins,
    eras: ["Mid-Century Kitchen (1950-1970)", "Depression Glass (1930s)", "Studio Art Pottery"],
    keyMarkers: [
      "Molded pattern details and high gloss glaze colors (e.g., Pyrex opal wear patterns)",
      "Incised studio pottery marks or painter initials on base rim",
      "Ground polished pontils (smooth circular indentations under blown glass pieces)",
      "Consistent, thick, vibrant enamelling without dishwasher micro-hazing"
    ],
    forgeryRisks: [
      "Modern fake 'antique' reproductions of rare pattern glassware (often with different weight/seams)",
      "Unsigned commercial ceramics listed as premium 'Studio Art Pottery'",
      "Chemically re-glazed plates hiding deep interior stress cracks"
    ],
    liquidityTier: "High",
    shippingComplexity: "Medium",
    guideText: "Pyrex, Fire-King, and specific studio ceramics sell instantly to specialized collector networks on Etsy and Facebook. Sourcing focuses on paint luster and rim condition. Avoid pieces with dishwasher haze (faint white fog) as it is permanent."
  },
  {
    id: "audio",
    name: "Vintage Audio & Hi-Fi",
    icon: Sparkles,
    eras: ["Silver-Face Era (1970-1979)", "Tube Amp Golden Age (1950-1965)"],
    keyMarkers: [
      "Brushed aluminum faceplates with weighted anodized metal tuning knobs",
      "Walnut wood veneer cabinets and heavy transformers (25+ lbs)",
      "High-end brand badges: Marantz, Sansui, Pioneer, McIntosh, Fisher",
      "Gyro-touch tuning wheels, illuminated blue VU meters, and discrete output transistors"
    ],
    forgeryRisks: [
      "Missing walnut cabinets or cracked glass dial faceplates",
      "Corroded electrolytic capacitors causing loud hums",
      "Blown output transistors replaced with generic modern IC modules"
    ],
    liquidityTier: "High",
    shippingComplexity: "High",
    guideText: "70s silver-face audio receivers (Marantz, Sansui, Pioneer) are liquid gold. Estate sellers routinely label heavy stereo receivers as outdated trash. Clean potentiometers with DeoxIT for instant value resurrection."
  },
  {
    id: "apparel",
    name: "Vintage Apparel & Selvedge Denim",
    icon: Award,
    eras: ["Golden Era Denim (1940-1960s)", "Single-Stitch Band Tees (1980-1990s)"],
    keyMarkers: [
      "Redline selvedge seam ID visible inside cuffed denim hem",
      "Capital 'E' on Levi's red tab (pre-1971 manufacture)",
      "Single-stitch hems on sleeve and waist cuffs of vintage graphic t-shirts",
      "Heavy brass Talon or Scovill zippers on vintage leather jackets"
    ],
    forgeryRisks: [
      "Modern reproduction 'LVC' (Levi's Vintage Clothing) sold as authentic 1950s originals",
      "Dry-rot t-shirts that tear like paper when pulled gently",
      "Counterfeit vintage single-stitch blanks with printed modern graphics"
    ],
    liquidityTier: "High",
    shippingComplexity: "Low",
    guideText: "Vintage workwear and redline selvedge denim have enormous international liquidity. Japanese collectors pay massive premiums for hidden pocket rivets and Big E Levi's tabs found in dusty attics."
  }
];


export default function NicheExplorer() {
  const [selectedNiche, setSelectedNiche] = useState<string>("silver-jewelry");

  const currentNiche = niches.find((n) => n.id === selectedNiche) || niches[0];
  const matchingCases = seedCases.filter(
    (c) => c.category.toLowerCase().includes(selectedNiche.split("-")[0]) || 
           (selectedNiche === "mcm" && c.category.toLowerCase().includes("furniture"))
  );

  return (
    <div id="niche-explorer-section" className="bg-[#11161d] rounded-2xl border border-slate-800 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-100 flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-400" />
            Niche-Specific Intelligence Taxonomy
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Proven research templates, hallmark clues, and reference cases curated for specialized flippers.
          </p>
        </div>
        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20 font-mono">
          GOD-TIER DIRECTIVE
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-4">
        {niches.map((n) => {
          const Icon = n.icon;
          return (
            <button
              key={n.id}
              onClick={() => setSelectedNiche(n.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
                selectedNiche === n.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {n.name}
            </button>
          );
        })}
      </div>

      {/* Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800/80">
            <h3 className="text-base font-medium text-slate-200 font-display mb-2 flex items-center gap-2">
              <span className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400">
                {React.createElement(currentNiche.icon, { className: "h-4 w-4" })}
              </span>
              Sourcing &amp; Valuation Guidelines
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">{currentNiche.guideText}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Markers */}
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> Key Value Markers
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentNiche.keyMarkers.map((m, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-emerald-500 select-none">•</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Forgery Risks */}
            <div className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-xl">
              <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> High Forgery / Damage Risks
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentNiche.forgeryRisks.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-rose-500 select-none">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Market Characteristics
            </h4>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-[10px]">LIQUIDITY VELOCITY</div>
                <div className={`font-semibold mt-1 ${
                  currentNiche.liquidityTier === "High" ? "text-emerald-400" : "text-amber-400"
                }`}>
                  {currentNiche.liquidityTier} Tier
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-[10px]">SHIPPING COMPEXITY</div>
                <div className={`font-semibold mt-1 ${
                  currentNiche.shippingComplexity === "Low" ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {currentNiche.shippingComplexity} Effort
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px] mb-2 font-mono">TARGET DATES &amp; ERAS</div>
              <div className="flex flex-wrap gap-1.5">
                {currentNiche.eras.map((era, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] px-2 py-0.5 rounded font-medium"
                  >
                    {era}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sourcing seeds */}
          {matchingCases.length > 0 && (
            <div className="bg-indigo-950/20 border border-indigo-500/15 p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" /> High-Signal Reference Case
              </h4>
              {matchingCases.map((c) => (
                <div key={c.id} className="text-xs">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <span>{c.image}</span>
                    <span className="line-clamp-1">{c.name}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-1 line-clamp-2">
                    <strong>Value:</strong> ${c.actualValue} | <strong>Why Overlooked:</strong> {c.whyOverlooked}
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                    Outcome: {c.outcome.split(".")[0]}. <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
