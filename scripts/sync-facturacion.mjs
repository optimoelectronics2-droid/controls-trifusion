#!/usr/bin/env node
import { appendFileSync } from 'node:fs';
/**
 * Sincroniza el resumen de facturación desde Firestore hacia el Web App de
 * CONTROL.
 *
 * El Web App no puede leer Firestore por sí mismo porque su implementación
 * desplegada no tiene autorizado el permiso script.external_request. Este
 * proceso hace esa lectura con la sesión de Firebase y entrega al backend el
 * documento reportStats ya reducido (solo periodos, fuente y fecha).
 *
 * Variables de entorno:
 *   FIREBASE_REFRESH_TOKEN  Obligatoria. Secreto de GitHub Actions.
 *   CONTROL_TOKEN           Obligatoria. Token del Web App de CONTROL.
 *   FORCE_SYNC              "true" para guardar aunque no haya cambios.
 *   CONTROL_WEB_APP_URL     Opcional. URL /exec del Web App.
 *   FIREBASE_API_KEY        Opcional. Llave pública del proyecto Firebase.
 *   FIREBASE_UID            Opcional. UID de la cuenta de facturación.
 *   FIREBASE_PROJECT        Opcional. ID del proyecto Firebase.
 */

const WEB_APP = process.env.CONTROL_WEB_APP_URL ||
  'https://script.google.com/macros/s/AKfycbxy0lJr54UaT2KrCYC2rbxEX8z4oh_MdoCcUASPeShYDKE4eB9cH939dB55rqhoC4gEHg/exec';
const CONTROL_TOKEN = String(process.env.CONTROL_TOKEN || '').trim();
const REFRESH_TOKEN = String(process.env.FIREBASE_REFRESH_TOKEN || '').trim();
const API_KEY = String(process.env.FIREBASE_API_KEY || 'AIzaSyDlOJqBgd-8KqUT-Y94lsma5W8T79PsPjM').trim();
const UID = String(process.env.FIREBASE_UID || 'bHKd4RFPMcc21nH9cSEnVF4TGK13').trim();
const PROJECT = String(process.env.FIREBASE_PROJECT || 'trifusion-cotizador').trim();
const FORCE = /^(1|true|yes|si|sí)$/i.test(String(process.env.FORCE_SYNC || '').trim());
const TIMEOUT_MS = Number(process.env.SYNC_TIMEOUT_MS || 180000);

function log(message) {
  console.log(`[facturación] ${message}`);
}

function fail(message) {
  console.error(`[facturación] ERROR: ${message}`);
  process.exitCode = 1;
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`${label}: el servidor no devolvió JSON. Inicio: ${String(text || '').slice(0, 300)}`);
  }
}

async function fetchWithRetry(url, options, label) {
  const intentos = 3;
  let ultimoError = null;
  for (let intento = 1; intento <= intentos; intento++) {
    try {
      const response = await fetch(url, Object.assign({}, options, {
        signal: AbortSignal.timeout(TIMEOUT_MS)
      }));
      const text = await response.text();
      if (!response.ok) {
        throw new Error(`${label}: HTTP ${response.status}. ${String(text || '').slice(0, 300)}`);
      }
      return { response, text };
    } catch (e) {
      ultimoError = e;
      if (intento < intentos) {
        const espera = intento * 3000;
        log(`${label}: intento ${intento} falló (${e.message}). Reintentando en ${espera / 1000}s.`);
        await new Promise((resolve) => setTimeout(resolve, espera));
      }
    }
  }
  throw ultimoError;
}

function fromFirestoreValue(value) {
  if (!value || typeof value !== 'object') return null;
  if ('nullValue' in value) return null;
  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return !!value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('timestampValue' in value) return value.timestampValue;
  if ('mapValue' in value) {
    const salida = {};
    const campos = (value.mapValue && value.mapValue.fields) || {};
    Object.keys(campos).forEach((clave) => {
      salida[clave] = fromFirestoreValue(campos[clave]);
    });
    return salida;
  }
  if ('arrayValue' in value) {
    return ((value.arrayValue && value.arrayValue.values) || []).map(fromFirestoreValue);
  }
  return null;
}

async function obtenerIdToken() {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: REFRESH_TOKEN
  });
  const { text } = await fetchWithRetry(
    `https://securetoken.googleapis.com/v1/token?key=${encodeURIComponent(API_KEY)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    },
    'Firebase Auth'
  );
  const json = parseJson(text, 'Firebase Auth');
  if (!json.id_token) throw new Error('Firebase no devolvió un id_token.');
  // Firebase puede devolver un refresh_token nuevo en la respuesta. El token
  // original sigue siendo válido para las siguientes renovaciones; si algún
  // día se revoca, la autenticación fallará con un mensaje claro.
  return json.id_token;
}

async function leerReportStats(idToken) {
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(PROJECT)}` +
    `/databases/(default)/documents/accounts/${encodeURIComponent(UID)}/_singletons/reportStats`;
  const { text } = await fetchWithRetry(url, {
    headers: { Authorization: `Bearer ${idToken}` }
  }, 'Firestore reportStats');
  const doc = parseJson(text, 'Firestore reportStats');
  const value = fromFirestoreValue(doc && doc.fields && doc.fields.value);
  if (!value || !value.periods || !value.generatedAt) {
    throw new Error('El documento reportStats no contiene periods/generatedAt.');
  }
  return {
    generatedAt: String(value.generatedAt),
    version: value.version,
    source: value.source || {},
    periods: value.periods
  };
}

function leerResumenServidor() {
  const query = new URLSearchParams({ action: 'appFacturacionResumen', token: CONTROL_TOKEN });
  return fetchWithRetry(`${WEB_APP}?${query.toString()}`, {
    headers: { Accept: 'application/json' }
  }, 'appFacturacionResumen').then(({ text }) => parseJson(text, 'appFacturacionResumen'));
}

async function guardarResumen(resumen) {
  const body = JSON.stringify({
    token: CONTROL_TOKEN,
    action: 'appGuardarFacturacionResumen',
    datos: { resumen }
  });
  const { text } = await fetchWithRetry(WEB_APP, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
      Accept: 'application/json'
    },
    body
  }, 'appGuardarFacturacionResumen');
  return parseJson(text, 'appGuardarFacturacionResumen');
}

function metricas(resumen) {
  const totales = (resumen && resumen.totales) || {};
  const mes = (resumen && resumen.periodos && resumen.periodos.mes) || {};
  return {
    facturas: Number(totales.facturas) || 0,
    ventas: Number(totales.ventas) || 0,
    ganancia: Number(totales.ganancia) || 0,
    costo: Number(totales.costo) || 0,
    mesFacturas: Number(mes.facturas) || 0,
    mesVentas: Number(mes.ventas) || 0,
    mesGanancia: Number(mes.ganancia) || 0
  };
}

function formatoDinero(valor) {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    maximumFractionDigits: 2
  }).format(Number(valor) || 0);
}

function escribirResumenPaso(origen, antes, despues, mensaje) {
  const archivo = process.env.GITHUB_STEP_SUMMARY;
  if (!archivo) return;
  const lineas = [
    '## Sincronización de facturación',
    '',
    `- **Datos de facturación:** ${origen.generatedAt}`,
    `- **Resultado:** ${mensaje}`,
    '',
    '| Métrica | Antes | Después |',
    '| --- | ---: | ---: |',
    `| Facturas | ${antes.facturas} | ${despues.facturas} |`,
    `| Ventas | ${formatoDinero(antes.ventas)} | ${formatoDinero(despues.ventas)} |`,
    `| Ganancia | ${formatoDinero(antes.ganancia)} | ${formatoDinero(despues.ganancia)} |`,
    `| Facturas del mes | ${antes.mesFacturas} | ${despues.mesFacturas} |`,
    `| Ganancia del mes | ${formatoDinero(antes.mesGanancia)} | ${formatoDinero(despues.mesGanancia)} |`
  ];
  try {
    appendFileSync(archivo, `${lineas.join('\n')}\n`);
  } catch (e) {
    // El resumen del paso es informativo; no debe tumbar la sincronización.
  }
}

async function main() {
  if (!CONTROL_TOKEN) throw new Error('Falta el secreto CONTROL_TOKEN.');
  if (!REFRESH_TOKEN) throw new Error('Falta el secreto FIREBASE_REFRESH_TOKEN.');

  log('Leyendo reportStats de Firestore...');
  const idToken = await obtenerIdToken();
  const origen = await leerReportStats(idToken);
  log(`reportStats generado: ${origen.generatedAt} | facturas: ${origen.source.invoiceCount || 0} | válidas: ${origen.source.validInvoiceCount || 0}`);

  const servidorAntes = await leerResumenServidor();
  if (!servidorAntes || servidorAntes.ok === false) {
    throw new Error(`El Web App no entregó el resumen: ${(servidorAntes && servidorAntes.error) || 'respuesta vacía'}`);
  }
  const antes = metricas(servidorAntes);
  const mismoOrigen = servidorAntes.modo === 'reportStats' &&
    servidorAntes.fuente &&
    String(servidorAntes.fuente.generatedAt || '') === origen.generatedAt;

  if (mismoOrigen && !FORCE) {
    log('Sin cambios: el servidor ya tiene este mismo reportStats.');
    log(`Totales vigentes: ${antes.facturas} facturas | ventas ${formatoDinero(antes.ventas)} | ganancia ${formatoDinero(antes.ganancia)}`);
    escribirResumenPaso(origen, antes, antes, 'Sin cambios; el servidor ya estaba al día.');
    return;
  }

  log(`Servidor antes: modo=${servidorAntes.modo || '—'} | ${antes.facturas} facturas | ventas ${formatoDinero(antes.ventas)} | ganancia ${formatoDinero(antes.ganancia)}`);
  log('Guardando resumen consolidado en el Web App...');
  const guardado = await guardarResumen(origen);
  if (!guardado || guardado.ok === false) {
    throw new Error(`No se pudo guardar el resumen: ${(guardado && guardado.error) || 'respuesta vacía'}`);
  }
  if (guardado.modo !== 'reportStats') {
    throw new Error(
      'El servidor guardó el resumen pero sigue leyendo la caché de facturas ' +
      `(modo=${guardado.modo || 'desconocido'}). Revisa la prioridad de factLeerResumen_ en Apps Script.`
    );
  }
  if (guardado.fuente && guardado.fuente.generatedAt &&
      String(guardado.fuente.generatedAt) !== origen.generatedAt) {
    throw new Error(
      `El servidor guardó otra versión: esperaba ${origen.generatedAt} y recibió ${guardado.fuente.generatedAt}.`
    );
  }

  const despues = metricas(guardado);
  log(`Servidor después: modo=${guardado.modo} | actualizado=${guardado.actualizado || '—'} | ${despues.facturas} facturas | ventas ${formatoDinero(despues.ventas)} | ganancia ${formatoDinero(despues.ganancia)}`);
  log(`Mes actual: ${despues.mesFacturas} facturas | ventas ${formatoDinero(despues.mesVentas)} | ganancia ${formatoDinero(despues.mesGanancia)}`);
  escribirResumenPaso(origen, antes, despues, FORCE ? 'Sincronización forzada completada.' : 'Sincronización completada.');
}

main().catch((error) => {
  fail(error && error.message ? error.message : String(error));
});
