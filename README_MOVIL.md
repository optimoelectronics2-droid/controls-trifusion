# CONTROL · Aplicación independiente

Duplicado funcional de la aplicación CONTROL de Google Apps Script, servido como PWA independiente desde GitHub Pages.

## Qué hace

- Se conecta directamente al Web App de CONTROL (`script.google.com/macros/s/...`) usando el mismo token del sistema.
- Lee y escribe en la misma hoja de cálculo de Google Drive: movimientos, pagos, presupuestos, inversiones, abonos, cierres, informes y notificaciones.
- Conserva el diseño, las pantallas y los formularios de la app original: Inicio, Ingresos, Gastos, Facturación, Por pagar, Histórico, Movimientos, Presupuestos, Inversiones, Notificaciones, Informes PDF y Ajustes.
- Permite crear, editar, eliminar, confirmar, anular y cerrar períodos desde la misma interfaz.
- Incluye manifest y service worker para instalarse como PWA en el teléfono.

## Backend

- Web App: `https://script.google.com/macros/s/AKfycbxy0lJr54UaT2KrCYC2rbxEX8z4oh_MdoCcUASPeShYDKE4eB9cH939dB55rqhoC4gEHg/exec`
- Hoja de cálculo: `https://docs.google.com/spreadsheets/d/1JATjob7EA_rCjcn1AbouFLF5faErTCqJv1ah_UIeMBw/edit`
- Las operaciones de escritura usan `POST` con `Content-Type: text/plain` y el cuerpo `{ token, action, ... }`.
- Las lecturas usan `GET` con `action` y `token`.

## Desarrollo

```bash
npm install
npm run dev
```

## Construcción

```bash
npm run build
```

El resultado queda en `dist/` y se publica en la rama `gh-pages`.

## Archivos principales

- `index.html`: aplicación completa (diseño y lógica original de CONTROL, transporte adaptado a fetch).
- `public/sw.js`: service worker de la PWA.
- `public/manifest.json`: manifest de instalación.
- `src/lib/controlWebApp.js`: helpers de transporte usados por el código React histórico.
