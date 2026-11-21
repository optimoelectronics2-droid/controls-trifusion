import { currency } from "../../lib/formatters.js";

export function Kpi({ label, value, tone = "", raw = false }) {
  const toneClass = {
    green: "bg-green-500/15 text-green-300 border-green-500/30",
    red: "bg-red-500/15 text-red-300 border-red-500/30",
    violet: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    blue: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  }[tone] || "bg-white/5 text-white/70 border-white/10";
  return (
    <div className={`rounded-xl border p-3 text-center ${toneClass}`}>
      <div className="text-[10px] font-black uppercase tracking-wider opacity-80">{label}</div>
      <div className="mt-1 font-display text-sm font-bold">{raw ? value : currency.format(value)}</div>
    </div>
  );
}
