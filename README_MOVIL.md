# Sistema de Control Móvil

Aplicación PWA para telefonos que usa la tabla y el Web App de CONTROL (`script.google.com/macros/s/...`), sin duplicar datos: la app lee movimientos, resumen financiero y notificaciones directamente del sistema de CONTROL.

## Instalación
- Via Chrome/Edge: abre el sitio desplegado y usa "Agregar a la pantalla principal".
- Via Safari: comparte y "Añadir a la pantalla de inicio".

## Desarrollo
```bash
npm install
npm run dev
```

## Construcción
```bash
npm run build
```

## Componentes
- `src/lib/controlWebApp.js`: llamadas GET al Web App de CONTROL.
- `src/lib/controlData.js`: mapea datos de `appResumenRapido`, `appData`, `appNotificacionesRapido`.
- `src/App.jsx`: dashboard de ingresos, gastos, resultado y movimientos recientes.
