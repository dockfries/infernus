# Características

## Destrucción automática de instancias

Cuando el GameMode finaliza, todas las instancias de `Streamer/vehículos/textdraw/menús...` se destruyen automáticamente — no más código repetitivo de limpieza.

Sin embargo, si una instancia debe destruirse cuando un jugador se desconecta, aún debe hacerlo manualmente.

## Funciones descartadas

Las funciones que pueden implementarse con características nativas de JavaScript o librerías de terceros (como `floatabs`, `strcmp`, `sqlite db`, `setTimer`) han sido descartadas. Esto significa que debe usar librerías de JavaScript en lugar de complementos nativos como `mysql` o `timerfix`.

## Obtención de cadenas

Para la mayoría de las operaciones con cadenas, ya no necesita definir arreglos de longitud fija como en el desarrollo nativo. Las funciones comunes son manejadas internamente por `Infernus`. El principio es simple: se asigna un búfer de longitud máxima y se itera hasta encontrar el primer byte `0`, que marca el final de la cadena — por ejemplo, `GetPlayerName` se convierte en `player.getName().name`.

Este método proviene de las [funciones prácticas](./i18n.md#practical-functions) del módulo de internacionalización. Si se encuentra con situaciones similares, no necesita reinventar la rueda.

## Conversión de colores

La conversión de color subyacente de `Infernus` utiliza el código fuente de [samp-node-lib, de Peter Szombati](https://github.com/peterszombati/samp-node-lib), permitiéndole usar valores de color más semánticos como `#fff`, `#ffffff`, `(r, g, b)` o `(r, g, b, a)` al llamar a ciertas funciones.

Si un color no se renderiza como espera en ciertos contextos (por ejemplo, los textdraws aparecen en blanco o negro), pruebe con otro formato — cambie `#fff` por `(255, 255, 255, 255)` o use el formato numérico nativo.

## Atributos del jugador

- `getFps()`: Devuelve la tasa de fotogramas actual del jugador (limitada a una actualización por segundo; puede devolver `0`).
- `lastUpdateTick`: Marca de tiempo de la última actualización del jugador.
- `lastUpdateFpsTick`: Marca de tiempo de la última actualización de FPS.
- `lastDrunkLevel`: Último nivel de ebriedad reportado por el jugador.

## Eventos de pausa

Retrollamadas integradas para pausa (`onPause`) y reanudación (`onResume`) del jugador. Pueden no funcionar de forma fiable con la Edición Definitiva de SA o la versión Android, ya que se basan en temporizadores y `onUpdate` con un margen de error.

:::tip
La retrollamada también puede activarse inadvertidamente cuando la conexión de red del jugador es deficiente.
:::
