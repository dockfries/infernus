# Características

## Destruir instancia automáticamente

Cuando el GameMode sale, todas las instancias `Streamer/vehicle/textdraw/menus...` serán automáticamente destruidas, lo que significa que ya no necesitas escribir un gran número de funciones destroy repetidamente.

Sin embargo, asumiendo que tu instancia necesita ser destruida cuando el jugador se desconecta, todavía necesitas destruirla manualmente.

## Descartar

Descarta funciones que pueden ser implementadas por funciones integradas en `JavaScript` o librerías de terceros, como `floatabs`, `strcmp`, `sqlite db`, `setTimer` y demás.
Esto significa que debes usar la librería `JavaScript`, y que ya no necesitas ni debes usar plugins de desarrollo nativos, como `mysql`, timerfix`, etc.

## Obtener cadena de texto

Para la mayoría de las búsquedas de cadenas, ya no es necesario definir un arreglo de longitud fija como hacen los desarrolladores nativos. Las funciones más utilizadas se han tratado internamente en `Infernus`. El principio es que se define un array de cadenas con una longitud máxima, y entonces el array se itera automáticamente hasta el punto donde el primer byte es `0` para interceptar la cadena, como `GetPlayerName`, que es `player.getName()`.

El método de intercepción proviene de las [funciones prácticas](./i18n.md#practical-functions) en internacionalización. Si te encuentras con algunos escenarios similares, no tienes que repetir la rueda.

## Conversión de colores

La conversión de color subyacente de `Infernus` utiliza el código fuente de [samp-node-lib, hecho por Peter Szombati](https://github.com/peterszombati/samp-node-lib), utilizado para usar colores más semánticos cuando se llaman a ciertas funciones durante el desarrollo, como `#fff`,`#ffffff`,`(r, g, b)`, `(r, g, b, a)`.

Si no es como se esperaba en algunas escenas, se renderiza en blanco o negro, como textdraw, después de usar valores de color, puede probar un formato diferente. Por ejemplo, cambiar el original `#fff` a `(255,255,255,255)`, o seguir utilizando el formato digital nativo desarrollado.

## Atributo del jugador

- `getFps()`：Para obtener la velocidad de fotogramas actual del jugador, sólo puede obtener `1` actualizaciones cada `1` segundo, y puede ser `0`.
- `lastUpdateTick`：Marca de tiempo de la última actualización del jugador.
- `lastUpdateFpsTick`：La última marca de tiempo fps actualizada del jugador.
- `lastDrunkLevel`：La última vez que el jugador actualizó el nivel de embriaguez.

## Evento de pausa

Eventos callback incorporados para que los jugadores pausen `onPause` y reanuden `onResume`. No es necesariamente adecuado para la versión `sa definitive edition` o Android, y está determinado por temporizador y `onUpdate` con cantidad de errores.

:::tip
La llamada de retorno también puede activarse por error cuando la red del jugador no es buena.
:::
