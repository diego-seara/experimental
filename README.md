# Sabadell · Research no moderado · V7 (UserZoom)

## Publicación en Vercel

Este directorio es una web estática. Se puede importar como proyecto y desplegar desde la raíz.
`vercel.json` contiene rewrites a archivos HTML distintos por pantalla, evitando depender de pushState en una única URL.

- Investigador: `/research`
- Participante: `/splash?scenario=ok` (o `warning`, `fraud`)
- Splash `/splash` → Acceso `/acceso` → Inicio `/inicio`.
- Cada navegación principal realiza un **document navigation**: cambia el pathname y carga un documento HTML diferente.
- Los parámetros existentes del enlace se conservan en las siguientes rutas, incluidos identificadores de seguimiento añadidos externamente por la plataforma de research.
- Las variables de formularios se conservan en `sessionStorage` por pestaña. Se borran al entrar por `/splash` para evitar arrastres entre participantes.
- Las preguntas en lenguaje natural utilizan detección local de intenciones. No hay modelo de IA conectado y las respuestas están acotadas a estos casos de prueba.
- El panel puede emitir cambios de escenario en directo mediante `BroadcastChannel` / `localStorage`, **solo entre pestañas del mismo origen en un navegador**. No es una capacidad de control remoto entre dispositivos sin servicio backend.

## Rutas de seguimiento

```
/splash                 /acceso                      /inicio
/mi-dinero              /productos                   /contratar
/operar                 /perfil                      /ayuda
/buzon                  /buzon/mensaje               /prevision
/cuentas/online         /cuentas/ahorro               /tarjetas/debito
/conversacion/saldo     /conversacion/pagos          /conversacion/gasto
/conversacion/tarjetas  /conversacion/ayuda          /bizum/datos
/bizum/revision         /bizum/completado            /transferencia/datos
/transferencia/revision /transferencia/completada   /recibos/cubrir
/recibos/completado     /seguridad/revisar           /seguridad/tarjeta-bloqueada
/seguridad/pago-reconocido /notificaciones
/contratar/cuenta /contratar/tarjeta /contratar/ahorro /contratar/solicitud-recibida
```

## Ejemplos de tareas en UserZoom

- **Bizum**: Inicio `/inicio` → Datos `/bizum/datos` → Revisión `/bizum/revision` → éxito `/bizum/completado`.
- **Transferencia**: `/transferencia/datos` → `/transferencia/revision` → `/transferencia/completada`.
- **Cubrir recibo**: enviar enlace de escenario `warning`; llegada `/recibos/completado` indica que se completó.
- **Seguridad**: enviar enlace `fraud`; llegada `/seguridad/tarjeta-bloqueada` o `/seguridad/pago-reconocido` identifica la elección.

**Importante:** operación y biometría son experiencias de interfaz, no transacciones financieras ni validación real. No utilizar credenciales, IBAN ni datos bancarios reales de participantes. No publicar como web abierta sin aprobación de la organización.

## Afinado de microtransiciones (V7.1)

- Navegación entre URL: entrada mediante cambio leve de opacidad (140 ms) sin desplazamiento horizontal, evitando el efecto de arrastre entre documentos.
- Insights: aparición sin movimiento de posición (200 ms).
- Confirmaciones: escala apenas perceptible (220 ms), sin rebote.
- Se conserva la transición de splash y la verificación de Face ID; `prefers-reduced-motion` desactiva las animaciones.
