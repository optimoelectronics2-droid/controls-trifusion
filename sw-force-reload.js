// Fuerza a las pestanas/apps PWA abiertas a recargar cuando se activa una
// version nueva del service worker. Sin esto, un cliente puede quedarse
// ejecutando el bundle viejo hasta cerrar manualmente la aplicacion.
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      await self.clients.claim()
    } catch {
      // Si claim falla, igual intentamos recargar los clientes.
    }
    try {
      const clients = await self.clients.matchAll({ type: 'window' })
      await Promise.all(clients.map(async (client) => {
        try {
          await client.navigate(client.url)
        } catch {
          // Algunos clientes no permiten navegacion; se actualizaran al abrirse.
        }
      }))
    } catch {
      // No interrumpir la activacion del service worker.
    }
  })())
})
