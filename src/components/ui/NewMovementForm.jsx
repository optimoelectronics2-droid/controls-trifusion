import { useState } from "react";
import { Button } from "./Button.jsx";
import { Input } from "./Input.jsx";
import { Select } from "./Select.jsx";
import { Textarea } from "./Textarea.jsx";
import { createQuickMovement } from "../../lib/controlData.js";

const TIPOS = ["Ingreso", "Gasto operativo", "Inversión"];
const CATEGORIAS_INGRESO = ["Ventas", "Servicios", "Otros ingresos"];
const CATEGORIAS_GASTO = ["Comida", "Combustible", "Envíos / Mensajería", "Electricidad", "Internet", "Bebida", "Otros gastos", "Nomina", "Material Gastable"];
const METODOS = ["Efectivo", "Tarjeta", "Transferencia", "Deposito"];

export function NewMovementForm({ open, onClose, onSuccess }) {
  if (!open) return null;
  const [tipo, setTipo] = useState("Gasto operativo");
  const [categoria, setCategoria] = useState(CATEGORIAS_GASTO[0]);
  const [importe, setImporte] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [metodo, setMetodo] = useState("Efectivo");
  const [observaciones, setObservaciones] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categorias = tipo === "Ingreso" ? CATEGORIAS_INGRESO : CATEGORIAS_GASTO;
  const signo = tipo === "Ingreso" ? "1" : "-1";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const datos = {
        tipo,
        Categoria: categoria,
        importe: Number(importe),
        comentario: descripcion || categoria,
        metodo: metodo || "Efectivo",
        fecha: fecha || new Date().toISOString().slice(0, 10),
        signo,
      };
      await createQuickMovement(datos);
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err?.message || "No se pudo guardar el movimiento.");
    }
  }

  return (
    <Modal open onClose={onClose} title="Nuevo movimiento">
      {error && <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Select label="Tipo" value={tipo} onChange={setTipo} options={TIPOS.map((t) => ({ value: t, label: t }))} />
        <Select label="Categoría" value={categoria} onChange={setCategoria} options={categorias.map((c) => ({ value: c, label: c }))} />
        <Input label="Monto" type="number" value={importe} onChange={setImporte} placeholder="0.00" required />
        <Input label="Descripción" value={descripcion} onChange={setDescripcion} placeholder="Ej: Compra de insumos" />
        <Select label="Método de pago" value={metodo} onChange={setMetodo} options={METODOS.map((m) => ({ value: m, label: m }))} />
        <Input label="Fecha" type="date" value={fecha} onChange={setFecha} required />
        <Textarea label="Observaciones" value={observaciones} onChange={setObservaciones} placeholder="Notas adicionales" />
        <div className="flex justify-end gap-2 pt-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-white/60 hover:bg-white/10 rounded-lg">
            Cancelar
          </button>
          <Button variant="primary" type="submit" loading={loading}>
            Guardar movimiento
          </Button>
        </div>
      </form>
    </Modal>
  );
}
