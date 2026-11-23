# CONTROL · PWA independiente

Duplicado funcional de la aplicación CONTROL de Google Apps Script, servido como PWA independiente e instalable.

## URL en vivo

https://optimoelectronics2-droid.github.io/controls-trifusion/

## Qué hace

- Se conecta directamente al Web App de CONTROL (`script.google.com/macros/s/...`) usando el mismo token del sistema.
- Lee y escribe en la misma hoja de cálculo de Google Drive: movimientos, pagos, presupuestos, inversiones, abonos, cierres, informes y notificaciones.
- Conserva el diseño, las pantallas y los formularios de la app original: Inicio, Ingresos, Gastos, Facturación, Por pagar, Histórico, Movimientos, Presupuestos, Inversiones, Notificaciones, Informes PDF y Ajustes.
- Permite crear, editar, eliminar, confirmar, anular y cerrar períodos desde la misma interfaz.
- Las eliminaciones conservan la auditoría del sistema original (el registro queda anulado, no se borra físicamente).
- Incluye manifest y service worker para instalarse como PWA en el teléfono.

## Backend

- Web App: `https://script.google.com/macros/s/AKfycbxy0lJr54UaT2KrCYC2rbxEX8z4oh_MdoCcUASPeShYDKE4eB9cH939dB55rqhoC4gEHg/exec`
- Hoja de cálculo: `https://docs.google.com/spreadsheets/d/1JATjob7EA_rCjcn1AbouFLF5faErTCqJv1ah_UIeMBw/edit`
- Las lecturas usan `GET` con `action` y `token`.
- Las escrituras usan `POST` con `Content-Type: text/plain` y el cuerpo `{ token, action, ... }`.

## Instalación en el teléfono

- Android/Chrome: abre la URL en vivo y elige **Instalar aplicación** o **Añadir a pantalla de inicio**.
- iPhone/Safari: abre la URL, toca **Compartir** y luego **Añadir a pantalla de inicio**.
- La app también muestra estas instrucciones en **Ajustes → Instalar app**.

## Desarrollo y publicación

```bash
npm install
npm run build
```

`npm run build` copia `index.html` y `public/` a `dist/` sin reescribir rutas. El contenido de `dist/` se publica en la rama `gh-pages`; GitHub Pages sirve la app en la URL en vivo.

## Archivos principales

- `index.html`: aplicación completa (diseño y lógica original de CONTROL, transporte adaptado a `fetch`).
- `public/sw.js`: service worker de la PWA.
- `public/manifest.json`: manifest de instalación.
- `scripts/build.mjs`: build estático determinista.
- `src/lib/controlWebApp.js`: helpers de transporte usados por el código React histórico.

## Nota sobre el token

La PWA usa el token de acceso embebido del Web App. La opción **Rotar token** de Ajustes está bloqueada en esta app porque invalidaría el acceso hasta actualizar el token embebido; para rotarlo, usa la aplicación original de Apps Script y actualiza el token de la PWA.
