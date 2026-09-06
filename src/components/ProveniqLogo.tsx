import React from "react";

interface ProveniqLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  badge?: string;
  className?: string;
}

export default function ProveniqLogo({
  size = "md",
  showText = true,
  showSubtitle = true,
  subtitle = "Estate Intelligence & Arbitrage",
  badge,
  className = ""
}: ProveniqLogoProps) {
  // Dimensions map
  const dimensions = {
    xs: { icon: 22, text: "text-sm", sub: "text-[9px]" },
    sm: { icon: 28, text: "text-base", sub: "text-[10px]" },
    md: { icon: 38, text: "text-lg", sub: "text-[11px]" },
    lg: { icon: 48, text: "text-2xl", sub: "text-xs" },
    xl: { icon: 64, text: "text-3xl", sub: "text-sm" }
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Intelligent Vector Emblem */}
      <div 
        className="relative shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-b from-[#181e28] to-[#0c0f14] p-1 border border-amber-500/25 shadow-lg shadow-amber-500/10 transition-transform duration-300 hover:scale-105"
        style={{ width: dimensions.icon + 10, height: dimensions.icon + 10 }}
      >
        {/* Ambient subtle glow */}
        <div className="absolute inset-0 rounded-2xl bg-amber-500/10 blur-sm pointer-events-none" />

        <svg 
          viewBox="0 0 100 100" 
          width={dimensions.icon} 
          height={dimensions.icon}
          className="relative z-10 drop-shadow-[0_2px_8px_rgba(245,158,11,0.25)]"
        >
          <defs>
            <linearGradient id="pvnq-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="30%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>
            <linearGradient id="pvnq-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <radialGradient id="pvnq-lens-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer Chronometer / Micrometer Calibration Dial Ticks */}
          <circle 
            cx="56" 
            cy="40" 
            r="25" 
            fill="none" 
            stroke="#F59E0B" 
            strokeWidth="1.2" 
            strokeDasharray="2.5 3.5" 
            strokeOpacity="0.35" 
          />

          {/* Vertical Precision Caliper Spine (Left stem of P) */}
          <rect x="20" y="16" width="10" height="68" rx="5" fill="url(#pvnq-gold-grad)" />
          {/* Depth shading on stem base */}
          <rect x="20" y="58" width="10" height="26" rx="5" fill="#78350F" opacity="0.45" />

          {/* Loupe Loop (P upper hemisphere) */}
          <path 
            d="M 28 16 
               H 58 
               C 73 16, 84 27, 84 41 
               C 84 55, 73 66, 58 66 
               H 28 
               Z" 
            fill="none" 
            stroke="url(#pvnq-gold-grad)" 
            strokeWidth="9" 
            strokeLinejoin="round"
          />

          {/* Q Viewfinder Ray / Tail (dynamic 45° angle) */}
          <path 
            d="M 52 56 L 78 84" 
            stroke="url(#pvnq-gold-grad)" 
            strokeWidth="9" 
            strokeLinecap="round"
          />

          {/* Optical Lens Ambient Glow */}
          <circle cx="56" cy="40" r="14" fill="url(#pvnq-lens-glow)" />

          {/* Internal Gemstone Facet (Optical Aperture) */}
          <polygon 
            points="56,29 67,40 56,51 45,40" 
            fill="#0b1329" 
            stroke="url(#pvnq-cyan-grad)" 
            strokeWidth="2.2" 
            strokeLinejoin="round"
          />

          {/* Central AI Optical Reticle Core */}
          <circle cx="56" cy="40" r="3.5" fill="url(#pvnq-cyan-grad)" />
          <circle cx="56" cy="40" r="1.5" fill="#FFFFFF" />

          {/* Precision Alignment Reticle Crosshairs */}
          <line x1="56" y1="23" x2="56" y2="27" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="56" y1="53" x2="56" y2="57" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="39" y1="40" x2="43" y2="40" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="69" y1="40" x2="73" y2="40" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Typography Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-display font-black tracking-tight text-white ${dimensions.text} uppercase flex items-center`}>
              PROVEN<span className="text-amber-400 font-extrabold">IQ</span>
            </span>
            {badge && (
              <span className="text-[10px] bg-amber-500/15 text-amber-300 font-mono font-bold px-2 py-0.5 rounded border border-amber-500/25 tracking-wide uppercase">
                {badge}
              </span>
            )}
          </div>
          {showSubtitle && (
            <p className={`text-slate-400 font-mono tracking-wider uppercase leading-none mt-1 ${dimensions.sub}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
