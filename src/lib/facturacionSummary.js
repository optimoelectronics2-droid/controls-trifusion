import { getFacturacionSummary, getFacturacionExpenses } from "./facturacionFirebase.js";
import { currency } from "./formatters.js";

export async function getFacturacionSummaryData() {
  const summary = await getFacturacionSummary();
  return summary;
}

export async function getFacturacionRecentExpenses(limitCount = 10) {
  const expenses = await getFacturacionExpenses(limitCount);
  return expenses.map((exp) => ({
    id: exp.id,
    concept: exp.concept || "Sin descripción",
    amount: Number(exp.amount || 0),
    status: exp.status || "",
    date: exp.date || "",
  }));
}

export function summarizeFacturacion(summary) {
  return {
    total: currency.format(summary.total || 0),
    pending: currency.format(summary.pending || 0),
    paid: currency.format(summary.paid || 0),
    expenseCount: summary.expenseCount || 0,
  };
}
