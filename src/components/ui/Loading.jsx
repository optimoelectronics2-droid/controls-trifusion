export function Loading({ message = "Cargando…" }) {
  return <div className="flex items-center justify-center py-12 text-sm text-white/60">{message}</div>;
}
