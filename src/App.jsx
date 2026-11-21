import { useCallback, useEffect, useState } from "react";
import { getControlSummary, getControlMovements, getControlNotifications, movementLabel, summarizeSummary } from "./lib/controlData.js";
import { getFacturacionSummaryData, summarizeFacturacion } from "./lib/facturacionSummary.js";
import { currency } from "./lib/formatters.js";

export default function App() {
  const [summary, setSummary] = useState({});
  const [movements, setMovements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [facturacion, setFacturacion] = useState({ total: "0.00", pending: "0.00", paid: "0.00", expenseCount: 0 });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const results = await Promise.allSettled([
      getControlSummary(),
      getControlMovements(15),
      getControlNotifications(),
      getFacturacionSummaryData().catch(() => ({ total: 0, pending: 0, paid: 0, expenseCount: 0 })),
    ]);
    if (results.every((result) => result.status === "rejected")) setError("No se pudo cargar el control de gastos.");
    else {
      setSummary(results[0].status === "fulfilled" ? results[0].value : {});
      setMovements(results[1].status === "fulfilled" ? results[1].value : []);
      setNotifications(results[2].status === "fulfilled" ? results[2].value.rows : []);
      setFacturacion(summarizeFacturacion(results[3].status === "fulfilled" ? results[3].value : { total: 0, pending: 0, paid: 0, expenseCount: 0 }));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      const results = await Promise.allSettled([
        getControlSummary(),
        getControlMovements(15),
        getControlNotifications(),
        getFacturacionSummaryData().catch(() => ({ total: 0, pending: 0, paid: 0, expenseCount: 0 })),
      ]);
      if (active) {
        if (results.every((result) => result.status === "rejected")) setError("No se pudo cargar el control de gastos.");
        else {
          setSummary(results[0].status === "fulfilled" ? results[0].value : {});
          setMovements(results[1].status === "fulfilled" ? results[1].value : []);
          setNotifications(results[2].status === "fulfilled" ? results[2].value.rows : []);
          setFacturacion(summarizeFacturacion(results[3].status === "fulfilled" ? results[3].value : { total: 0, pending: 0, paid: 0, expenseCount: 0 }));
        }
      }
      setLoading(false);
    })();
    return () => { active = false };
  }, []);

  const totals = summarizeSummary(summary);

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0A0A0F]/90 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-black sm:text-2xl">CONTROL · Gastos</h1>
            <p className="text-sm text-white/60">Datos directos de la tabla de CONTROL</p>
          </div>
          <button onClick={() => void load()} className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold">Recargar</button>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-4 py-5 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Kpi label="Ingresos" value={currency.format(totals.ingresos)} tone="green" />
          <Kpi label="Gastos Control" value={currency.format(totals.gastos)} tone="red" />
          <Kpi label="Resultado Control" value={currency.format(totals.resultado)} tone="violet" />
          <Kpi label="Pendiente" value={currency.format(totals.pendiente)} tone="amber" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Kpi label="Facturacion total" value={facturacion.total} tone="blue" />
          <Kpi label="Facturacion pendiente" value={facturacion.pending} tone="amber" />
          <Kpi label="Facturacion pagada" value={facturacion.paid} tone="green" />
          <Kpi label="Facturacion docs" value={facturacion.expenseCount} raw />
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 sm:px-6">
        {error ? <ErrorText message={error} /> : <RecentMovements movements={movements} loading={loading} />}
      </section>

      <section className="mx-auto max-w-2xl px-4 pb-4 sm:px-6">
        <Notifications items={notifications} />
      </section>
    </main>
  );
}

function Kpi({ label, value, tone = "" }) {
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
      <div className="mt-1 font-display text-sm font-bold">{value}</div>
    </div>
  );
}

function ErrorText({ message }) {
  return <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{message}</div>;
}

function RecentMovements({ movements, loading }) {
  if (loading) return <div className="rounded-xl border border-white/10 p-4 text-sm text-white/60">Cargando control de gastos…</div>;
  if (!movements.length) return <div className="rounded-xl border border-white/10 p-4 text-sm text-white/60">Sin movimientos recientes.</div>;
  return (
    <div className="mb-3 overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wider text-white/60">
          <tr><th className="px-3 py-2">Fecha</th><th className="px-3 py-2">Tipo</th><th className="px-3 py-2">Descripción</th><th className="px-3 py-2 text-right">Monto</th></tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {movements.map((movement) => {
            const row = movementLabel(movement);
            return (
              <tr key={movement.id || row.descripcion} className="hover:bg-white/5">
                <td className="px-3 py-2 text-white/80">{row.fecha || "—"}</td>
                <td className="px-3 py-2 text-white/80">{row.tipo}</td>
                <td className="px-3 py-2 text-white">{row.descripcion}</td>
                <td className="px-3 py-2 text-right font-semibold">{currency.format(row.monto)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Notifications({ items }) {
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
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${item.tone === "info" ? "bg-blue-500/20 text-blue-300 border-blue-500/40" : item.tone === "danger" ? "bg-red-500/20 text-red-300 border-red-500/40" : "bg-amber-500/20 text-amber-300 border-amber-500/40"}`}>{item.tone || "Alerta"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
