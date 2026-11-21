import { useCallback, useEffect, useState } from "react";
import { getControlSummary, getControlMovements, getControlNotifications, createQuickMovement, confirmMovement, deleteQuickMovement } from "./lib/controlData.js";
import { currency } from "./lib/formatters.js";
import { ErrorBoundary } from "./components/ui/ErrorBoundary.jsx";
import { Kpi } from "./components/ui/Kpi.jsx";
import { Loading } from "./components/ui/Loading.jsx";
import { ErrorText } from "./components/ui/ErrorText.jsx";
import { RecentMovements } from "./components/ui/RecentMovements.jsx";
import { Notifications } from "./components/ui/Notifications.jsx";
import { NewMovementForm } from "./components/ui/NewMovementForm.jsx";
import { ConfirmMovementForm } from "./components/ui/ConfirmMovementForm.jsx";
import { DeleteMovementForm } from "./components/ui/DeleteMovementForm.jsx";
import { Button } from "./components/ui/Button.jsx";

export default function App() {
  const [summary, setSummary] = useState({});
  const [movements, setMovements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [summaryData, movementsData, notificationsData] = await Promise.all([
        getControlSummary(),
        getControlMovements(15),
        getControlNotifications(),
      ]);
      setSummary(summaryData);
      setMovements(movementsData);
      setNotifications(notificationsData.rows);
    } catch (e) {
      setError(e?.message || "No se pudo cargar el control de gastos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleNewMovement = async (datos) => {
    setLoading(true);
    try {
      await createQuickMovement(datos);
      setNewOpen(false);
      await load();
    } catch (e) {
      setError(e?.message || "No se pudo crear el movimiento.");
      setLoading(false);
    }
  };

  const handleConfirm = async (movement) => {
    setLoading(true);
    try {
      await confirmMovement(movement.id, new Date().toISOString().slice(0, 10));
      setConfirmOpen(false);
      setSelectedMovement(null);
      await load();
    } catch (e) {
      setError(e?.message || "No se pudo confirmar el movimiento.");
      setLoading(false);
    }
  };

  const handleDelete = async (movement) => {
    setLoading(true);
    try {
      await deleteQuickMovement(movement.id, "Eliminado desde app móvil");
      setDeleteOpen(false);
      setSelectedMovement(null);
      await load();
    } catch (e) {
      setError(e?.message || "No se pudo eliminar el movimiento.");
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-[#0A0A0F] text-white">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0A0A0F]/90 px-4 py-3 backdrop-blur sm:px-6">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <div>
              <h1 className="font-display text-xl font-black sm:text-2xl">CONTROL · Gastos</h1>
              <p className="text-sm text-white/60">Datos directos de la tabla de CONTROL</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => void load()}
                className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/20"
              >
                Recargar
              </button>
              <button
                onClick={() => setNewOpen(true)}
                className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600"
              >
                +
              </button>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Kpi label="Ingresos" value={currency.format(summary.ingresos || 0)} tone="green" />
            <Kpi label="Gastos" value={currency.format(summary.gastos || 0)} tone="red" />
            <Kpi label="Resultado" value={currency.format(summary.resultado || 0)} tone="violet" />
            <Kpi label="Pendiente" value={currency.format(summary.porPagar || 0)} tone="amber" />
          </div>
        </section>

        <section className="mx-auto max-w-2xl px-4 sm:px-6">
          {error ? <ErrorText message={error} /> : <RecentMovements movements={movements} loading={loading} />}
        </section>

        <section className="mx-auto max-w-2xl px-4 pb-4 sm:px-6">
          <Notifications items={notifications} />
        </section>

        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur">
            <Loading />
          </div>
        )}

        <NewMovementForm open={newOpen} onClose={() => setNewOpen(false)} onSuccess={handleNewMovement} />
        {selectedMovement && (
          <ConfirmMovementForm open={confirmOpen} movement={selectedMovement} onClose={() => setConfirmOpen(false)} onSuccess={handleConfirm} />
        )}
        {selectedMovement && (
          <DeleteMovementForm open={deleteOpen} movement={selectedMovement} onClose={() => setDeleteOpen(false)} onSuccess={handleDelete} />
        )}
      </main>
    </ErrorBoundary>
  );
}
