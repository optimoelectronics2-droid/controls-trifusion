import { movementLabel } from "../../lib/movementHelpers.js";
import { StatusBadge } from "./StatusBadge.jsx";
import { currency } from "../../lib/formatters.js";

export function RecentMovements({ movements, loading, onRefresh }) {
  if (loading) return <div className="flex items-center justify-center py-12 text-sm text-white/60">Cargando control de gastos…</div>;
  if (!movements.length) return <div className="rounded-xl border border-white/10 p-4 text-sm text-white/60">Sin movimientos recientes.</div>;
  return (
    <div className="mb-3 overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wider text-white/60 sticky top-0 z-10">
          <tr>
            <th className="px-3 py-2">Fecha</th>
            <th className="px-3 py-2">Tipo</th>
            <th className="px-3 py-2">Descripción</th>
            <th className="px-3 py-2">Estado</th>
            <th className="px-3 py-2 text-right">Monto</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {movements.map((movement) => {
            const row = movementLabel(movement);
            return (
              <tr key={movement.id || row.descripcion} className="hover:bg-white/5">
                <td className="px-3 py-2 text-white/80">{row.fecha || "—"}</td>
                <td className="px-3 py-2 text-white/80">{row.tipo}</td>
                <td className="px-3 py-2 text-white">{row.descripcion}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={movement.estado} />
                </td>
                <td className="px-3 py-2 text-right font-semibold">{currency.format(row.monto)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
