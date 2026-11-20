# Sabadell · Research no moderado · V7.6 (UserZoom)

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
/conversacion/persona   /conversacion/hipoteca       /conversacion/prestamo
/conversacion/preaprobado
/hipoteca               /hipoteca/amortizar          /hipoteca/amortizar/revision
/hipoteca/amortizacion-programada
/prestamo               /prestamo/revision           /prestamo/contratado
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
| `pill` | Atajo del inicio (solo con `?pills=directo`) |
| `pill-escrita` | Atajo del inicio que rellenó la caja y se envió sin cambiar la frase base |
| `caja-fija` | Texto escrito en la barra de pregunta fija de las pestañas y pantallas de detalle |
| `aviso` | Acción del saludo (cubrir, bloquear, reconocer) |
| `chat` | Texto escrito dentro de la conversación |
| `chat-boton` | Botón dentro de la conversación |
| `notificacion` | Desde Notificaciones |
| `nav` | Resto de la app (Mi dinero, Operar, Productos, Ayuda…) |

Las pestañas principales limpian `via`. En UserZoom, usar el patrón de URL de éxito con comodín y segmentar por `via`.

### Otros
- Se carga Libre Franklin desde Google Fonts en todas las páginas (antes caía a Arial).


## Cambios V7.3 · Transiciones

- Transiciones entre pantallas con **View Transitions entre documentos** (`@view-transition`), así cada paso sigue siendo una URL y un documento distintos para UserZoom.
- **Avanzar** (abrir una conversación, un detalle, un paso del flujo): la pantalla nueva entra desde la derecha y la anterior se desplaza un poco y se oscurece, como en iOS.
- **Volver** (flecha atrás, «Editar datos», volver al inicio desde un flujo o el botón atrás del navegador): el movimiento contrario.
- **Entre pestañas** (Inicio, Mi dinero, Productos, Contratar…): fundido corto, sin desplazamiento.
- **Arranque** (splash → acceso → inicio): fundido.
- Barra de estado, indicador de inicio y navegación inferior no se mueven; la pantalla se recorta al marco del móvil.
- Requiere Chrome/Edge 126+ o Safari 18.2+. En otros navegadores se navega igual que en V7.2. `prefers-reduced-motion` las desactiva.


## Cambios V7.4 · Atrás y salida

- **«Atrás» vuelve a la pantalla de origen**, no a una fija: si entraste en la cuenta desde el inicio, vuelves al inicio; si la abriste desde Productos, a Productos; una conversación vuelve a la anterior con su texto.
- Desde una **pantalla final** (Bizum enviado, transferencia realizada, traspaso, tarjeta bloqueada, pago reconocido, solicitud recibida) vuelve a donde empezó el flujo, sin pasar por la revisión ni permitir repetir la operación.
- Las pestañas principales (Inicio, Mi dinero, Productos, Contratar…) reinician el recorrido. El botón atrás del navegador sigue funcionando y mantiene el recorrido sincronizado.
- **Transición de salida** más visible: la pantalla que se va se desplaza, se oscurece y pierde opacidad.
- **Sin View Transitions** (Firefox, Safari < 18.2): la pantalla sale animada antes de navegar (170 ms) y la nueva entra animada, en la dirección correcta.


## Cambios V7.5 · Más cerca de Galatea

Capa visual nueva al final de `assets/app.css` (todo lo anterior intacto), sacada del proto de Make: `Inicio`, `app-header`,
`bottom-nav`, `chat-header`, `chat-message`, `chat-composer`, `artifact-kit` y la escala tipográfica de sus guidelines.

- **Tipografía Galatea:** solo 400/600/700 y la escala del Figma (saldo 32/36, importes 24/32 Bold, títulos 20/24 SemiBold,
  texto 16/24, texto pequeño 14/21, etiquetas 14/20, mínimo 12/16, cabeceras 14/21 Bold). Navegación inferior a 14/21.
- **Tarjetas y filas de producto** blancas con borde #bdbdbd, radio 16 y sin sombra; importes 18/28 Regular; iconos en
  círculo con borde azul.
- **Caja del inicio y barra del chat** como `chat-composer`: fondo gris claro, borde suave y, al enfocar, fondo blanco con
  anillo de foco doble. Atajos como chips (40 px, borde #bdbdbd, 14/20).
- **Chat con las voces del proto:** cabecera con avatar (disco azul con destello), «Asistente digital» y «En línea»; turnos
  del asistente firmados y en burbuja blanca con borde; Laura en burbuja gris a la derecha.
- **Tarjetas del chat** con la plantilla de artefactos (superficie blanca, borde suave, radio 16) y respuestas rápidas como
  botones secundarios apilados, una por línea.
- **Botones** de 48 px y 16/24 SemiBold; campos de 48 px con radio 8; resúmenes en panel gris claro.
- Los tokens del kit no vienen en el código exportado: los valores salen de los literales de las pantallas de Figma.


## Cambios V7.6 · Hipoteca, préstamo preaprobado y guiones

### Productos
- Nueva sección **Préstamos e hipotecas** en Productos: la hipoteca y el préstamo preaprobado (marcado como «Preaprobado», con
  borde discontinuo para que no se confunda con lo contratado y un enlace «¿Por qué veo esto?»). En Contratar también aparece.
- Cifras de una sola fuente (`mortgage()`, `loanSim()`): hipoteca de 180.000 € a 30 años al 2,45 % fijo, firmada en agosto de
  2018. Lleva 104 cuotas, quedan 256 (cuota 706,55 €, pendiente 140.760,04 €, última cuota en marzo de 2048).
  Préstamo preaprobado: hasta 12.000 € al 6,95 % TIN (7,18 % TAE calculada), sin comisiones, válido hasta el 31 de diciembre.

### Páginas nuevas
| Ruta | Qué es |
| --- | --- |
| `/hipoteca` | Detalle: pendiente con barra de progreso, cuota, tipo, plazo, últimas cuotas y accesos al simulador y al asistente |
| `/hipoteca/amortizar` | Simulador en vivo: importe (desde la Cuenta Online), reducir cuota o plazo, intereses ahorrados, compensación del 2 %, comparación con la otra opción y aviso si te quedas sin colchón |
| `/hipoteca/amortizar/revision` → `/hipoteca/amortizacion-programada` | Revisión y confirmación; la hipoteca muestra después la amortización programada |
| `/prestamo` | Oferta con simulador en vivo (importe y plazo), TIN/TAE, coste total, peso de la cuota sobre la nómina y **alternativas que no son nuestras** (usar el ahorro, esperar y ahorrar); «No me interesa» oculta la oferta |
| `/prestamo/revision` → `/prestamo/contratado` | Resumen, casilla de información precontractual obligatoria, 14 días de desistimiento; el dinero llega a la Cuenta Online y el préstamo pasa a Productos y Movimientos |

### Guiones del chat
Conversaciones de varios pasos con respuestas sugeridas, un indicador de «escribiendo» y datos reales en cada respuesta.
Cada paso queda en la URL como `?paso=` (con `history.replaceState`, sin recargar). También se puede escribir: entiende
importes («6.000», «20 mil»), plazos («a 48 meses»), palabras clave de las opciones y, si es otra cosa, sale hacia la intención
que toque; si no entiende, lo dice y mantiene las opciones.

| Guion | Se activa con | Pasos |
| --- | --- | --- |
| Hipoteca (`/conversacion/hipoteca`) | «¿Cómo va mi hipoteca?», «¿me conviene amortizar?», «¿me afecta el Euríbor?», «quiero pagar menos cuota», «¿cuánto llevo pagado?» | `overview`, `amort` (compara cuota/plazo y avisa del colchón), `ask-amount`, `pick`, `invest`, `euribor`, `lower`, `extend` (pasa a gestor), `paid` |
| Préstamo (`/conversacion/prestamo`) | «Necesito 6.000 € para un coche», «quiero un préstamo», «Tengo dudas» en la oferta | `intro`, `ask-purpose`, `ask-amount`, `emergency` (primero el ahorro), `too-much` (más de 12.000 €), `compare` (36/60/84 meses), `chosen` (peso sobre la nómina), `think`, `have`, `early` |
| Preaprobado (`/conversacion/preaprobado`) | «¿Por qué veo esto?» en Productos, «¿por qué tengo un préstamo preaprobado?» | `why` (de dónde sale, sin consultas nuevas), `commit`, `dismiss` (oculta la oferta) |

Criterios: explorar no genera contacto comercial, la oferta se puede descartar, siempre hay salida a una persona y las
alternativas se muestran aunque no sean un producto del banco.


## V7.7 · Barras coherentes y barra de pregunta fija
**Reglas de barras**
- Cabecera con avatar, ojo, buzón y ayuda: solo en las 4 pestañas (Inicio, Mi dinero, Productos, Contratar).
- El resto de pantallas llevan flecha de volver y título. Se elimina la casa de la esquina superior derecha (duplicaba «Inicio» y el volver-al-origen).
- Perfil, Buzón, Ayuda, Notificaciones y Operar dejan de ser «pestañas»: son pantallas apiladas y «volver» regresa a donde estabas.
- Barra inferior solo en pestañas y detalles (cuentas, tarjeta, hipoteca, préstamo contratado, previsión, Contratar → producto) con la pestaña padre marcada. Los flujos (Bizum, transferencia, amortizar, préstamo, cubrir recibo, seguridad, solicitud recibida) y el chat van a pantalla completa, sin barra inferior.

**Asistente en el centro**
- Barra de pregunta fija sobre la navegación en Mi dinero, Productos, Contratar y pantallas de detalle, con placeholder contextual («Pregunta sobre tu hipoteca…»).
- Las pills del inicio escriben en la caja en vez de abrir la pantalla: «Quiero enviar un Bizum a …», «¿Cuánto dinero tengo?». `?pills=directo` restaura el comportamiento anterior para comparar celdas en UserZoom.


## V7.8 · Bizum conversacional
El Bizum deja de ser un formulario dentro del chat: una pregunta por turno, se salta lo que ya sabe y todo se puede tocar o escribir.
- **Rellenar huecos:** «Envía 25 € a Paula» salta directo al resumen; «Bizum a Lucía» (no es contacto) pide el teléfono; sin destinatario ni importe, pregunta uno detrás de otro.
- **Respuestas rápidas = frases:** contactos recientes (simulados: Marta AMPA cole, Pau Seara, Mamá) + «Otro número»; importes 10, 20 y 50 €. Al tocar una se convierte en tu burbuja.
- **Resumen en el hilo:** tarjeta con nombre completo, teléfono enmascarado, importe y un único botón «Enviar». Se corrige escribiendo («mejor 30», «no, a Paula») o con los chips; el concepto es opcional («Añadir concepto»). Solo se envía con el botón.
- **Sin saldo suficiente:** lo dice en el hilo y ofrece enviar menos o cancelar.
- **URLs:** `/bizum/datos` (preguntas), `/bizum/revision` (resumen), `/bizum/completado` (recibo). El hilo viaja en la sesión y «atrás» vuelve al origen. `via` no cambia.
- La transferencia sigue con el formulario anterior.


## V7.9 · Realismo del Bizum
- **El Bizum deja huella:** al enviarlo baja el saldo de la Cuenta Online y el total, y el movimiento («Bizum a Marta AMPA cole · Hoy · Cuota AMPA») aparece en Mi dinero y en la cuenta. El texto del saldo en el chat se calcula, ya no es fijo. Se reinicia al volver al inicio de sesión.
- **Importes con memoria:** primera respuesta rápida «15 € · como la última vez» (Marta AMPA cole 15 €, Pau Seara 20 €, Mamá 50 €); tras enviar, la última vez pasa a ser lo que acabas de enviar.
- **Conceptos según la persona:** AMPA (Cuota AMPA, Excursión, Material), Pau (Paga, Cine, Merienda), Mamá (Gracias, Comida, Regalo); resto: Cena, Gracias, Alquiler.

## V7.10 — Nav original con botón Operar
- Barra inferior: Inicio | botón central Operar (círculo azul 56 px con rejilla de 9 puntos) | Contratar. Sin etiqueta en Operar.
- Operar lleva a `/operar` ("¿Qué quieres hacer?"). Solo Inicio y Contratar marcan estado activo.
- Mi dinero y Productos dejan de ser pestañas: se llega desde Inicio ("Ver todos") y desde el buzón/insights.

## V7.11 — Operar abre bottom sheet
- El botón Operar abre una sheet con "Principales operativas" (8) y "¿Te podemos ayudar?" (4), iconos del proto original. El botón pasa a X y cierra; también cierra el scrim.
- Funcionales: Enviar Bizum (chat), Enviar dinero, Consultar domiciliaciones, Límites/Bloquear tarjeta, Centro de ayuda/FAQ. El resto muestra "no disponible en la prueba". "Ver todas" → `/operar`.

## V7.12 — Bizum por formulario desde Operar
- Operar → "Enviar Bizum" (sheet y página `/operar`) abre el **formulario** del proto original, no el chat. Rutas propias para medir por separado en UserZoom:
  - `/operar/bizum` → datos (móvil + Agenda, importe, concepto opcional; validación de móvil, saldo y límite de 1.000 €)
  - `/operar/bizum/revision` → revisión ("Pendiente de firma") + **drawer de firma** (pulsar → deslizar → verificando 1 s → OK verde)
  - `/operar/bizum/enviado` → confirmación (Ver movimiento / Hacer otro Bizum / Ir a Inicio)
- `via=operar` en las tres URLs. El conversacional sigue en `/bizum/…` (caja, pills, chat).
- El Bizum enviado por formulario descuenta saldo y aparece en movimientos igual que el conversacional.

## V7.13 — Inicio nuevo
- Cabecera gris: saludo + insight "Tu último movimiento es un pago de 56,99 € en Nike ↗ con tu tarjeta *5566" (si se ha enviado un Bizum, el último movimiento pasa a ser ese). Los escenarios warning/fraud siguen sustituyendo al insight.
- 4 atajos: Enviar Bizum (formulario, `via=atajo`), Transferencia nacional, Sacar dinero (no disponible), Límites de tarjeta.
- Tus productos con miniaturas (cuenta €, tarjeta Sabadell VISA). El prompt baja al final y desaparecen las pills.
- Tarjeta renumerada a *5566 en todo el proto; Nike es el último movimiento.
- Provisional: el enlace del insight abre el detalle de la tarjeta (o de la cuenta si el último movimiento es un Bizum) hasta tener el detalle de movimiento.

## V7.14 — Detalle de movimiento (Nike y Bizum)
Réplica de `movement-detail` / `card-payment-detail` del proto original.
- `/movimientos/nike`: compra con tarjeta. Mapa (Serrano, Madrid) con píldora de ubicación, avatar, importe, categoría, fecha, tarjeta. Acciones: Fraccionar, Dividir con Bizum, No reconozco este pago, Compartir. Detalle (concepto, tarjeta, cuenta + "Mostrar más"), Notas editables, Histórico.
- `/movimientos/bizum`: Bizum enviado (el último enviado, o el sembrado a Marta AMPA cole de 15 €). Acciones: Fraccionar, Dividir, **Ver documento** (justificante "Mensaje SEPA · Bizum") y Compartir. Detalle con destinatario, justificante, cuenta y titular.
- Asistente digital al pie: entra plegado (píldora sticky con "Ver"), se despliega al llegar al final o al tocarlo; chips contextuales. "Repetir este envío" entra al Bizum conversacional ya relleno (`via=movimiento`).
- Entradas: enlace del insight de Inicio, filas Nike/Bizum de Mi dinero y Cuenta, "Ver movimiento" tras el Bizum por formulario.

## V7.15 — Tarjetas (del proto original)
`/tarjetas/debito` pasa a ser la página **Tarjetas** del original, adaptada:
- Carrusel con deslizamiento (Débito ···· 5566 y Crédito ···· 2209), puntos y flechas.
- **Interruptor en la tarjeta**: apagar es inmediato (la tarjeta se encoge y aparece la franja "Apagada"); encender pide Face ID. Si en el escenario de fraude se bloqueó, aparece "Bloqueada por seguridad".
- Pill "Límites de compras y cajero · Modificar" y acción **Configurar límites**: hoja con deslizadores (compras/mes, cajero/día) y permisos (internet, extranjero). Bajar/desactivar = al momento; subir/activar = **firma** con el mismo deslizador del Bizum.
- **Mostrar PIN**: Face ID → PIN 15 s con cuenta atrás; "Cambiar PIN" va al asistente.
- Añadir a Cartera de Apple; resumen "Gastado este mes" (débito, cuadra con los 326,80 € de Inicio) o Disponible/Gastado + liquidación (crédito).
- Movimientos: pestañas Todos/Fraccionar (>50 €), buscador, agrupados, esqueleto de carga al cambiar de tarjeta. Cada movimiento abre su detalle (`/movimientos/nike` o `/movimientos/tarjeta`).
- "Límites de tarjeta" (atajo de Inicio y sheet de Operar) abre Tarjetas con la hoja de límites.
- Sin función en la prueba: Instant money, Más opciones, Forma de pago, Cartera de Apple.

## V7.16 — Cifras conciliadas + Cuentas (del proto original)
**Una sola fuente de datos.** Los movimientos de las tarjetas mandan:
- Gasto con tarjeta = suma de movimientos (débito 326,80 € + crédito 324,39 € = 651,19 €). Lo usan Inicio, Tarjetas y el asistente.
- La Cuenta Online lista los cargos reales de la débito (mismos nombres, fechas e importes), el Bizum a Marta, los Bizum enviados y la nómina.
- Próximos pagos de la Cuenta Online: Movistar 55,50 · Iberdrola 87 · nómina +1.850 · Mapfre 147,50 · alquiler 950 (recibos hasta el día 30 = 1.240 €, igual que la previsión) · liquidación de la crédito el 1 dic.
- Tarjeta "Tarjetas" de Inicio: 651,19 € · "2 tarjetas · gastado este mes", miniatura de las dos tarjetas reales (azul + negra). Si alguna está apagada, lo dice en ámbar.
- El asistente (consulta de tarjetas) da el gasto por tarjeta y el último movimiento real (Nike).

**Cuentas** (`/cuentas/online`, `/cuentas/ahorro`): carrusel de cuentas con saldo, IBAN copiable y "Ver detalle" (titular, IBAN, BIC, condiciones); acciones Enviar Bizum (formulario, `via=cuentas`), Enviar dinero, Sacar dinero (abre Operar), Más opciones (hoja completa del original); aviso de cuenta (extracto, o la luz en `?scenario=warning`); pestañas Todos (con saldo tras cada movimiento) / Próximos; buscador y esqueleto de carga. Los movimientos de tarjeta y Bizum abren su detalle.
