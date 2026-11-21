export function StatusBadge({ status }) {
  const tone = { pending: "amber", paid: "green", cancelled: "red", anulada: "red", Confirmado: "green", Parcial: "amber", Pendiente: "amber", Anulado: "red", Confirmado: "green" }[status] || "violet";
  const label = { pending: "Pendiente", paid: "Pagado", cancelled: "Cancelado", anulada: "Anulado", Confirmado: "Confirmado", Parcial: "Parcial", Pendiente: "Pendiente", Anulado: "Anulado" }[status] || status;
  const colors = {
    amber: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    green: "bg-green-500/20 text-green-300 border-green-500/40",
    red: "bg-red-500/20 text-red-300 border-red-500/40",
    violet: "bg-violet-500/20 text-violet-300 border-violet-500/40",
  }[tone];
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${colors}`}>
      {label}
    </span>
  );
}
