import React, { useState, useRef, useEffect } from "react";
import { 
  Minus, Maximize2, Minimize2, X, Move, Sparkles, Wind,
  ChevronDown, ChevronUp, Layers, Eye, ShieldCheck, ArrowUpRight
} from "lucide-react";

export interface MagicCarpetWindowProps {
  id: string;
  title: string;
  stageNumber?: string;
  subtitle?: string;
  icon: React.ElementType;
  accentColor?: "amber" | "indigo" | "sky" | "emerald" | "purple" | "rose";
  badgeText?: string;
  isFloating?: boolean; // levitation bobbing animation
  isMinimized?: boolean;
  isFullscreen?: boolean;
  zIndex?: number;
  initialX?: number;
  initialY?: number;
  onFocus?: () => void;
  onClose?: () => void;
  onToggleMinimize?: () => void;
  onToggleFullscreen?: () => void;
  children: React.ReactNode;
  actionsRight?: React.ReactNode;
}

export default function MagicCarpetWindow({
  id,
  title,
  stageNumber,
  subtitle,
  icon: Icon,
  accentColor = "amber",
  badgeText,
  isFloating = true,
  isMinimized = false,
  isFullscreen = false,
  zIndex = 10,
  initialX = 0,
  initialY = 0,
  onFocus,
  onClose,
  onToggleMinimize,
  onToggleFullscreen,
  children,
  actionsRight
}: MagicCarpetWindowProps) {
  const carpetRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, initialX: 0, initialY: 0 });

  // 3D Perspective Tilt on Hover
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, shineX: 50, shineY: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [localLevitate, setLocalLevitate] = useState(isFloating);

  // Sync floating state
  useEffect(() => {
    setLocalLevitate(isFloating);
  }, [isFloating]);

  // Color mappings for magic under-glow cushion & silk borders
  const colorStyles = {
    amber: {
      glow: "rgba(245, 158, 11, 0.22)",
      glowPulse: "from-amber-500/20 via-amber-600/10 to-transparent",
      rim: "border-amber-500/35 hover:border-amber-400/60",
      pill: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      accentText: "text-amber-400",
      gradientBar: "from-amber-500/30 via-slate-900 to-transparent",
    },
    indigo: {
      glow: "rgba(99, 102, 241, 0.22)",
      glowPulse: "from-indigo-500/20 via-indigo-600/10 to-transparent",
      rim: "border-indigo-500/35 hover:border-indigo-400/60",
      pill: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
      accentText: "text-indigo-400",
      gradientBar: "from-indigo-500/30 via-slate-900 to-transparent",
    },
    sky: {
      glow: "rgba(14, 165, 233, 0.22)",
      glowPulse: "from-sky-500/20 via-sky-600/10 to-transparent",
      rim: "border-sky-500/35 hover:border-sky-400/60",
      pill: "bg-sky-500/20 text-sky-300 border-sky-500/40",
      accentText: "text-sky-400",
      gradientBar: "from-sky-500/30 via-slate-900 to-transparent",
    },
    emerald: {
      glow: "rgba(16, 185, 129, 0.22)",
      glowPulse: "from-emerald-500/20 via-emerald-600/10 to-transparent",
      rim: "border-emerald-500/35 hover:border-emerald-400/60",
      pill: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      accentText: "text-emerald-400",
      gradientBar: "from-emerald-500/30 via-slate-900 to-transparent",
    },
    purple: {
      glow: "rgba(168, 85, 247, 0.22)",
      glowPulse: "from-purple-500/20 via-purple-600/10 to-transparent",
      rim: "border-purple-500/35 hover:border-purple-400/60",
      pill: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      accentText: "text-purple-400",
      gradientBar: "from-purple-500/30 via-slate-900 to-transparent",
    },
    rose: {
      glow: "rgba(244, 63, 94, 0.22)",
      glowPulse: "from-rose-500/20 via-rose-600/10 to-transparent",
      rim: "border-rose-500/35 hover:border-rose-400/60",
      pill: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      accentText: "text-rose-400",
      gradientBar: "from-rose-500/30 via-slate-900 to-transparent",
    },
  }[accentColor];

  // Mouse move tilt calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carpetRef.current || isDragging || isFullscreen) return;
    const rect = carpetRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt: max 2.5 degrees for smooth elegance
    const rotX = ((y - centerY) / centerY) * -2.2;
    const rotY = ((x - centerX) / centerX) * 2.2;

    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;

    setTilt({ rotateX: rotX, rotateY: rotY, shineX, shineY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, shineX: 50, shineY: 50 });
  };

  // Dragging logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isFullscreen) return;
    if (onFocus) onFocus();
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: coords.x,
      initialY: coords.y,
    };
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.mouseX;
      const dy = e.clientY - dragStartRef.current.mouseY;
      setCoords({
        x: dragStartRef.current.initialX + dx,
        y: dragStartRef.current.initialY + dy,
      });
    };

    const onMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  const animationClass =
    localLevitate && !isDragging && !isFullscreen && !isHovered
      ? (id.charCodeAt(0) % 2 === 0 ? "carpet-float-active" : "carpet-float-reverse")
      : "";

  return (
    <div
      ref={carpetRef}
      onMouseDown={onFocus}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        zIndex,
        transform: isFullscreen
          ? "none"
          : `translate3d(${coords.x}px, ${coords.y}px, 0) perspective(1400px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: isDragging
          ? "none"
          : "transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease",
      }}
      className={`relative rounded-3xl transition-all duration-300 ${
        isFullscreen ? "w-full my-3" : "w-full"
      } ${animationClass}`}
    >
      {/* 1. Ambient Levitation Underglow Cushion (The Magic Carpet Cushion of Light) */}
      <div
        className="absolute -inset-2.5 rounded-[32px] pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 60%, ${colorStyles.glow} 0%, rgba(0,0,0,0) 72%)`,
          filter: "blur(24px)",
          opacity: isHovered ? 1 : 0.65,
        }}
      />

      {/* 2. Frameless Glass Vessel */}
      <div
        className={`relative overflow-hidden rounded-3xl border ${colorStyles.rim} bg-[#0b0e14]/92 backdrop-blur-2xl shadow-[0_28px_80px_-15px_rgba(0,0,0,0.88),0_0_1px_1px_rgba(255,255,255,0.06)] transition-all`}
      >
        {/* Dynamic Specular Silk Sheen that follows mouse cursor */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${tilt.shineX}% ${tilt.shineY}%, rgba(255, 255, 255, 0.08) 0%, transparent 60%)`,
          }}
        />

        {/* Top Silk Edge Highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* 3. The Frameless Levitation Header (Carpet Grip & Rune Controls) */}
        <div
          onMouseDown={handleMouseDown}
          className="relative px-5 py-3.5 flex items-center justify-between border-b border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent cursor-grab active:cursor-grabbing select-none"
        >
          {/* Left: Stage Sigil & Identity */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Stage Indicator Orb */}
            <div className="flex items-center gap-2">
              {stageNumber && (
                <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${colorStyles.pill}`}>
                  PHASE {stageNumber}
                </span>
              )}
              <div className={`p-1.5 rounded-xl bg-slate-900/80 border border-white/10 ${colorStyles.accentText} shadow-inner`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-display font-bold text-slate-100 tracking-tight truncate">
                  {title}
                </h3>
                {badgeText && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hidden sm:inline">
                    {badgeText}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-[11px] text-slate-400 truncate font-sans">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right: Magic Carpet Flight Controls */}
          <div
            className="flex items-center gap-1.5 shrink-0"
            onMouseDown={(e) => e.stopPropagation()} // don't trigger drag on button click
          >
            {actionsRight}

            {/* Breeze / Levitation Float Toggle */}
            <button
              type="button"
              onClick={() => setLocalLevitate((prev) => !prev)}
              className={`p-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1 border ${
                localLevitate
                  ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                  : "bg-slate-900/70 text-slate-500 border-slate-800 hover:text-slate-300"
              }`}
              title={localLevitate ? "Levitation motion: Active (Click to Anchor)" : "Levitation motion: Anchored (Click to Float)"}
            >
              <Wind className="h-3.5 w-3.5" />
              <span className="hidden md:inline text-[10px]">{localLevitate ? "Float" : "Anchor"}</span>
            </button>

            {/* Unfurl / Roll Up (Minimize) */}
            {onToggleMinimize && (
              <button
                type="button"
                onClick={onToggleMinimize}
                className="p-1.5 rounded-lg bg-slate-900/70 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
                title={isMinimized ? "Unfurl Carpet (Expand)" : "Roll Up Carpet (Collapse)"}
              >
                {isMinimized ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
              </button>
            )}

            {/* Full Flight (Fullscreen / Expand) */}
            {onToggleFullscreen && (
              <button
                type="button"
                onClick={onToggleFullscreen}
                className="p-1.5 rounded-lg bg-slate-900/70 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors hidden sm:flex items-center"
                title={isFullscreen ? "Restore Flight Size" : "Full Flight Span"}
              >
                {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>
            )}

            {/* Send to Dock (Close) */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-900/70 hover:bg-rose-950/50 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-colors"
                title="Send back to Magic Dock"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 4. The Magic Carpet Viewport Content */}
        {!isMinimized && (
          <div className="relative p-5 max-h-[82vh] overflow-y-auto carpet-scroll">
            {children}
          </div>
        )}

        {/* Bottom Silk Fringes / Subtle Ambient Status Bar */}
        <div className="px-5 py-2 bg-[#080a0f]/80 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${localLevitate ? "bg-amber-400" : "bg-slate-500"}`}></span>
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${localLevitate ? "bg-amber-500" : "bg-slate-600"}`}></span>
            </span>
            <span>{localLevitate ? "Levitating • 3D Spatial Canvas" : "Anchored"}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Drag top bar to fly</span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400 capitalize">{accentColor} Silk Weave</span>
          </div>
        </div>
      </div>
    </div>
  );
}
