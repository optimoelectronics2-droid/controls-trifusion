export const CONTROL_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbxy0lJr54UaT2KrCYC2rbxEX8z4oh_MdoCcUASPeShYDKE4eB9cH939dB55rqhoC4gEHg/exec";
export const CONTROL_TOKEN = "15a6c0cfcaf843028000f812b5c3174b";

export async function controlApiGet(action, params = {}) {
  const q = new URLSearchParams({ action, token: CONTROL_TOKEN, ...params });
  const response = await fetch(`${CONTROL_WEB_APP_URL}?${q.toString()}`, {
    credentials: "omit",
    headers: { Accept: "application/json" },
  });
  const data = await response.json();
  if (!data || data.ok === false) {
    throw new Error(data?.error || "Error en el control de gastos.");
  }
  return data;
}

export async function controlApiPost(action, body = {}) {
  const response = await fetch(`${CONTROL_WEB_APP_URL}`, {
    method: "POST",
    credentials: "omit",
    headers: {
      Accept: "application/json",
      "Content-Type": "text/plain",
    },
    body: JSON.stringify({ token: CONTROL_TOKEN, action, ...body }),
  });
  const data = await response.json();
  if (!data || data.ok === false) {
    throw new Error(data?.error || "Error al guardar en el control de gastos.");
  }
  return data;
}
