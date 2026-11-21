import { controlApiGet, controlApiPost } from "./controlWebApp.js";
import { currency } from "./formatters.js";

export function money(value) {
  return currency.format(value || 0);
}

export async function getControlSummary() {
  const data = await controlApiGet("appResumenRapido");
  const resumen = data?.resumen || {};
  const pagos = data?.pagos || {};
  return {
    ingresos: Number(resumen.ingresos || 0),
    gastos: Number(resumen.gastos || 0),
    inversiones: Number(resumen.inversiones || 0),
    resultado: Number(resumen.resultado || 0),
    flujoEntradas: Number(resumen.flujoEntradas || 0),
    flujoSalidas: Number(resumen.flujoSalidas || 0),
    flujoNeto: Number(resumen.flujoNeto || 0),
    porPagar: Number(resumen.porPagar || 0),
    movimientos: Number(resumen.movimientos || 0),
    pendientes: Number(resumen.pendientes || 0),
    parciales: Number(resumen.parciales || 0),
    anulados: Number(resumen.anulados || 0),
    hoy: data?.hoy || "",
    hoyISO: data?.hoyISO || "",
    periodo: data?.periodo || "",
    pagosVencidos: Number(pagos.vencidos || 0),
    pagosProximos7: Number(pagos.proximos7 || 0),
    pagosMontoVencido: Number(pagos.montoVencido || 0),
    pagosMontoProximos7: Number(pagos.montoProximos7 || 0),
  };
}

export async function getControlMovements(limit = 20) {
  const data = await controlApiGet("appData");
  const detalle = data?.detalle || [];
  return detalle.slice(0, limit).map((mov) => ({
    id: mov.id,
    fecha: mov.fechaISO || mov.fecha || "",
    tipo: mov.tipo || "",
    naturaleza: mov.naturaleza || "",
    categoria: mov.categoria || "",
    descripcion: mov.descripcion || "",
    beneficiario: mov.beneficiario || "",
    importe: Number(mov.importe || 0),
    pagadoMonto: Number(mov.pagadoMonto || 0),
    saldoMonto: Number(mov.saldoMonto || 0),
    metodo: mov.metodo || "",
    cuenta: mov.cuenta || "",
    estado: mov.estado || "",
    signo: Number(mov.signo || 0),
    venceISO: mov.venceISO || "",
    pagadoISO: mov.pagadoISO || "",
    observaciones: mov.observaciones || "",
    prioridad: mov.prioridad || "",
    referencia: mov.referencia || "",
    creadoPor: mov.creadoPor || "",
  }));
}

export async function getControlNotifications() {
  const data = await controlApiGet("appNotificacionesRapido");
  const rows = [];
  (data?.eventos || []).slice(0, 8).forEach((item) => rows.push({
    id: item.id,
    title: "Recordatorio: " + (item.titulo || item.descripcion || "Recordatorio"),
    date: item.fechaISO || "",
    tone: "info",
  }));
  (data?.cola || []).slice(0, 8).forEach((item) => rows.push({
    id: item.id || item.idMovimiento || "",
    title: item.titulo || item.descripcion || "Aviso",
    date: item.fecha || item.fechaISO || "",
    tone: item.tono || "info",
  }));
  (data?.notificacionesRecientes || []).slice(0, 8).forEach((item) => rows.push({
    id: item.id || "",
    title: item.titulo || item.descripcion || "Notificación",
    date: item.fecha || item.fechaISO || "",
    tone: item.tono || "info",
  }));
  return { rows, summary: data?.resumen || {} };
}

export async function createQuickMovement(datos) {
  return controlApiPost("appCrearMovimientoRapido", datos);
}

export async function deleteQuickMovement(id, motivo) {
  return controlApiPost("appEliminarMovimientoRapido", { id, motivo });
}

export async function confirmMovement(id, fechaPago) {
  return controlApiPost("appConfirmarMovimiento", { id, fechaPago });
}

export async function updateMovement(id, datos) {
  return controlApiPost("appActualizarMovimiento", { id, datos });
}

export async function createPayment(datos) {
  return controlApiPost("appCrearPago", datos);
}

export async function deletePayment(id, motivo) {
  return controlApiPost("appEliminarPago", { id, motivo });
}

export async function createCategory(datos) {
  return controlApiPost("appCrearCategoria", datos);
}

export async function configureAvisos(datos) {
  return controlApiPost("appGuardarAvisos", datos);
}

export async function testAvisos() {
  return controlApiPost("appProbarAvisos");
}

export async function generateInforme(opciones) {
  return controlApiPost("appGenerarInforme", opciones);
}

export async function getInforme(id) {
  return controlApiGet("appDescargarInforme", { id });
}
