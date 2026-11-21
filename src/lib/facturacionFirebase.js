import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, getDocs, limit, orderBy } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyDlOJqBgd-8KqUT-Y94lsma5W8T79PsPjM",
  authDomain: "trifusion-cotizador.firebaseapp.com",
  projectId: "trifusion-cotizador",
  storageBucket: "trifusion-cotizador.firebasestorage.app",
  messagingSenderId: "407374211882",
  appId: "1:407374211882:web:b692792ccc39c8d48f4c53",
};

export const app = initializeApp(firebaseConfig, "facturacion-control-movil");
export const db = getFirestore(app);

export async function getFacturacionExpenses(limitCount = 20) {
  const snap = await getDocs(query(collection(db, "expenses"), orderBy("date", "desc"), limit(limitCount)));
  return snap.docs.map((doc) => doc.data());
}

export async function getFacturacionSummary() {
  const expenses = await getFacturacionExpenses(20);
  const total = Number(expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0).toFixed(2));
  const pending = Number(expenses.filter((exp) => String(exp.status || "").toLowerCase() === "pending").reduce((sum, exp) => sum + Number(exp.amount || 0), 0).toFixed(2));
  const paid = Number(expenses.filter((exp) => String(exp.status || "").toLowerCase() === "paid").reduce((sum, exp) => sum + Number(exp.amount || 0), 0).toFixed(2));
  return { expenseCount: expenses.length, total, pending, paid, lastUpdated: new Date().toISOString() };
}
