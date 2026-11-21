import { useState } from "react";
import { Button } from "./Button.jsx";
import { Modal } from "./Modal.jsx";
import { deleteQuickMovement } from "../../lib/controlData.js";

export function DeleteMovementForm({ open, movement, onClose, onSuccess }) {
  if (!open) return null;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setError("");
    setLoading(true);
    try {
      await deleteQuickMovement(movement.id, "Eliminado desde app móvil");
      setLoading(false);
      onSuccess && onSuccess(movement);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err?.message || "No se pudo eliminar el movimiento.");
    }
  }

  return (
    <Modal open onClose={onClose} title="Anular movimiento">
      <p className="mb-4 text-sm text-white/80">¿Anular el movimiento "{movement.descripcion || movement.tipo}"?</p>
      {error && <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}
      <div className="flex justify-end gap-2 pt-3">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-white/60 hover:bg-white/10 rounded-lg">
          Cancelar
        </button>
        <Button variant="red" type="button" onClick={handleDelete} loading={loading}>
          Anular
        </Button>
      </div>
    </Modal>
  );
}
