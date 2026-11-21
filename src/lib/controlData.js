import { controlApiGet } from "./controlWebApp.js";

export async function getControlSummary() {
  const data = await controlApiGet("appResumenRapido");
  return data?.resumen || {};
}

export async function getControlMovements(limit = 15) {
  const data = await controlApiGet("appData");
  return (data?.recientes || []).slice(0, limit);
}

export async function getControlNotifications() {
  const data = await controlApiGet("appNotificacionesRapido");
  const rows = [];
  (data?.eventos || []).slice(0, 8).forEach((item) => rows.push({
    id: item.id, title: `Recordatorio: ${item.titulo || item.descripcion || "Recordatorio"}`,
    date: item.fechaISO || "", tone: "info",
  }));
  (data?.cola || []).slice(0, 8).forEach((item) => rows.push({
    id: item.id || item.idMovimiento || "", title: item.titulo || item.descripcion || "Aviso",
    date: item.fecha || item.fechaISO || "", tone: item.tono || "info",
  }));
  (data?.notificacionesRecientes || []).slice(0, 8).forEach((item) => rows.push({
    id: item.id || "", title: item.titulo || item.descripcion || "Notificación",
    date: item.fecha || item.fechaISO || "", tone: item.tono || "info",
  }));
  return { rows, summary: data?.resumen || {} };
}

export function summarizeSummary(summary) {
  return {
    ingresos: Number(summary.ingresos || 0),
    gastos: Number(summary.gastos || 0),
    resultado: Number(summary.resultado || 0),
    pendiente: Number(summary.porPagar || 0),
    movimientos: Number(summary.movimientos || 0),
  };
}

export function movementLabel(movement) {
  const tipo = movement.tipo || movement.naturaleza || movement.type || "Movimiento";
  const descripcion = movement.descripcion || movement.categoria || movement.concept || "Sin descripción";
  return { tipo, descripcion, monto: Number(movement.importe || movement.amount || 0), fecha: movement.fechaISO || movement.fecha || "" };
}
