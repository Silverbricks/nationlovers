"use client";

import { PULSE_ITEMS } from "@/lib/pulse-data";
import { getCategoryIcon } from "@/lib/utils";
import { cn } from "@/lib/utils";

function TrendArrow({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <span className="text-alert-orange">↑</span>;
  if (trend === "down") return <span className="text-alert-green">↓</span>;
  return <span className="text-white/50">→</span>;
}

function PulseItem({ item }: { item: (typeof PULSE_ITEMS)[0] }) {
  return (
    <span className="inline-flex items-center gap-1.5 mx-6 whitespace-nowrap">
      <span className="text-sm">{getCategoryIcon(item.category)}</span>
      <span
        className={cn(
          "text-sm font-medium",
          item.trend === "up" ? "text-white" : item.trend === "down" ? "text-alert-green" : "text-white/70"
        )}
      >
        {item.label}
        {item.state && <span className="text-white/40 text-xs ml-1">({item.state})</span>}
      </span>
      <TrendArrow trend={item.trend} />
      <span
        className={cn(
          "text-xs font-semibold",
          item.trend === "up" ? "text-alert-orange" : item.trend === "down" ? "text-alert-green" : "text-white/50"
        )}
      >
        {item.change}
      </span>
      <span className="text-white/20 mx-2">|</span>
    </span>
  );
}

export function LivePulseBar() {
  // Duplicate for seamless loop
  const items = [...PULSE_ITEMS, ...PULSE_ITEMS];

  return (
    <div className="bg-navy-royal border-b border-gold/30 py-2.5 overflow-hidden">
      <div className="flex items-center">
        {/* LIVE badge — fixed left */}
        <div className="flex items-center gap-2 bg-gold text-navy-deep font-bold text-xs px-3 py-1.5 shrink-0 ml-4 rounded-full mr-4 z-10">
          <span className="w-2 h-2 rounded-full bg-alert-red animate-pulse-dot" />
          LIVE
        </div>

        {/* Scrolling ticker */}
        <div className="marquee-container flex-1">
          <div className="marquee-content">
            {items.map((item, i) => (
              <PulseItem key={`${item.id}-${i}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
