# RouteMapper

RouteMapper es una aplicación Next.js (App Router) que permite a los viajeros diseñar rutas turísticas combinando mapeo interactivo con persistencia ligera.

## Características Principales

- Mapa base Leaflet + OpenStreetMap para colocar puntos de interés mediante clics.
- Búsqueda de puntos de interés impulsada por el geocodificador público Nominatim (OpenStreetMap), para que los usuarios puedan agregar coordenadas precisas sin adivinar.
- Lista ordenada de puntos de interés con controles de arrastre (mover arriba/abajo, editar, eliminar) que mantiene la polilínea de la ruta sincronizada.
- Persistencia de rutas en archivos JSON dentro de `data/routes/`, simulando una base de datos simple que puede versionarse con el proyecto.
- Enlaces de ruta compartibles (`/view-route/:id`) para que cualquiera con la URL pueda abrir el mapa completo sin autenticación.
- Identidad de usuario ligera almacenada en `localStorage` (UUID + nombre de usuario) para evitar la autenticación completa mientras se mantiene la atribución en las rutas guardadas.

## Decisiones Técnicas

- **Librería de mapeo**: Se seleccionó Leaflet en lugar de Google Maps para evitar claves de API y simplificar el desarrollo local. Los tiles provienen de OpenStreetMap y la atribución se inyecta automáticamente por Leaflet.
- **Carga dinámica de activos**: El CSS/JS de Leaflet se inyecta solo en el cliente dentro de `MapComponent` para mantener ligera la compilación del servidor de Next.js.
- **Gestión de marcadores**: Los puntos de interés se renderizan como `circleMarker`s más iconos div numerados para que el orden permanezca visible en el mapa. Las rutas se conectan con una polilínea discontinua y la ventana gráfica se ajusta automáticamente a todos los puntos de interés.
- **Geocodificación**: En lugar de depender de un proveedor de pago, el cliente consulta el endpoint de búsqueda de Nominatim con una tasa de uso suave de una solicitud por acción del usuario. Los resultados exponen tanto una etiqueta amigable como una descripción completa para que el creador pueda editar los detalles después de insertar el punto de interés.
- **Persistencia**: `lib/routes-storage.ts` lee/escribe archivos JSON individuales con clave por el ID de la ruta. Esto mantiene la implementación transparente y fácil de restablecer para su evaluación, al mismo tiempo que cumple con el requisito de almacenamiento basado en archivos.
- **Identidad temporal**: `lib/context/user-context.tsx` asigna un UUID una vez por navegador y almacena el nombre de usuario en `localStorage`, alineándose con el requisito de evitar la autenticación JWT completa.

## Notas de Desarrollo

1. Instala las dependencias con `pnpm install` (o npm/yarn si lo prefieres).
2. Ejecuta el servidor de desarrollo con `pnpm dev` y abre http://localhost:3000.
3. Las rutas JSON se almacenan en `data/routes/`. Elimina los archivos allí para restablecer el conjunto de datos.

## Consejos de Uso

- Desde el panel de control (dashboard), introduce un nombre de usuario una vez para desbloquear el flujo del creador.
- En la página **Crear Ruta**, haz clic en el mapa o busca una ubicación por nombre/dirección. Cada ruta guardada requiere al menos dos puntos de interés.
- Después de guardar, copia el enlace para compartir desde el panel Detalles de la Ruta y envíalo a quien quieras. Pueden pegar el ID en `/view-route` o visitar el enlace directamente.


