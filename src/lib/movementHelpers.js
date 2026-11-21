export function movementLabel(movement) {
  const tipo = movement.tipo || movement.naturaleza || movement.type || "Movimiento";
  const descripcion = movement.descripcion || movement.categoria || movement.concept || "Sin descripción";
  const monto = Number(movement.importe || movement.amount || 0);
  return { tipo, descripcion, monto, fecha: movement.fechaISO || movement.fecha || "" };
}
