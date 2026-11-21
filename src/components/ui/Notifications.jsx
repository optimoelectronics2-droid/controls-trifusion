export function Notifications({ items }) {
  if (!items.length) return <div className="mb-4 text-sm text-white/50">Sin notificaciones ni recordatorios próximos.</div>;
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-black uppercase tracking-widest text-white/60">Notificaciones y recordatorios</h2>
      <div className="space-y-2">
        {items.slice(0, 10).map((item) => (
          <div key={item.id || item.title} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-white/60">{item.date || "Sin fecha"}</p>
              </div>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                  item.tone === "info"
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                    : item.tone === "danger"
                    ? "bg-red-500/20 text-red-300 border-red-500/40"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                }`}
              >
                {item.tone || "Alerta"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
