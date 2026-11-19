# Sabadell · Research no moderado · V7.2 (UserZoom)

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
/conversacion/seguridad /conversacion/recibo         /conversacion/fin-de-mes
/conversacion/persona
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


## Cambios V7.2

### 1. Lenguaje natural más robusto (detección local, sigue sin IA)
- Entiende importes con «€», «eur», «euros» o «pavos» y verbos de envío («envía», «pásale», «mándale»…); rellena destinatario también con «a mi hermana».
- Intenciones nuevas: **seguridad** (`/conversacion/seguridad`: bloquear, no reconozco, robo…), **cubrir recibo** (`/conversacion/recibo`, solo con aviso de saldo), **fin de mes** (`/conversacion/fin-de-mes`) y **persona** (`/conversacion/persona`).
- El escenario activo manda: en `fraud`, «no reconozco un pago» lleva al pago retenido con bloquear / reconocer; en `warning`, «cubre la luz» lleva al traspaso.
- Si no entiende, lo dice y ofrece lo que sí sabe hacer, incluida la persona. La pantalla de persona avisa de que esa parte no está en la prueba y deja registrada la intención por URL.
- El chat conserva los tres intercambios anteriores en lugar de empezar de cero en cada mensaje.

### 2. Datos coherentes
- Una sola fuente de cifras (`money()` en `app.js`).
- `warning`: Cuenta Online 64 € y luz 87 € el jueves 26 (faltan 23 €); total 929 €. Tras el traspaso: 87 € y 842 € en Ahorro.
- Próximos 7 días: fibra 55,50 € (24 nov) + luz 87 € (26 nov) = 142,50 €. La estimación de gasto usa esas cifras y avisa si la Cuenta Online quedaría en negativo.
- Previsión: nómina de 1.850 € el 28 y 1.240 € de recibos en todas las pantallas; la última nómina en movimientos es del 28 oct.

### 3. Vía de entrada en la URL (`via`)
Cada tarea arrastra `via` hasta su pantalla final (p. ej. `/bizum/completado?scenario=ok&via=caja`):

| via | Origen |
| --- | --- |
| `caja` | Texto escrito en la caja del inicio |
| `pill` | Atajo del inicio |
| `aviso` | Acción del saludo (cubrir, bloquear, reconocer) |
| `chat` | Texto escrito dentro de la conversación |
| `chat-boton` | Botón dentro de la conversación |
| `notificacion` | Desde Notificaciones |
| `nav` | Resto de la app (Mi dinero, Operar, Productos, Ayuda…) |

Las pestañas principales limpian `via`. En UserZoom, usar el patrón de URL de éxito con comodín y segmentar por `via`.

### Otros
- Se carga Libre Franklin desde Google Fonts en todas las páginas (antes caía a Arial).
