# Eventos

El evento de `Infernus` es parecido al evento nativo. Deberías ir a [Open Multiplayer](https://open.mp) para consultar la documentación relevante del desarrollo nativo.

## Ejemplo

Toma `OnGameModeInit` como ejemplo, en `Infernus`, es `GameMode.onInit(callback)`.

Otras clases de eventos tienen la misma sintaxis similar, que puedes entender con el tipo de `TypeScript`.

```ts
import { GameMode } from "@infernus/core";

GameMode.onInit(({ next }) => {
  console.log("El modo de juego se inicializó");
  return next();
});

GameMode.onExit(({ next }) => {
  console.log("Se cerró el modo de juego");
  return next();
});

GameMode.onIncomingConnection(({ next, playerId, ipAddress, port }) => {
  console.log(
    `player id:${playerId},ip:${ipAddress},port:${port} intenta conectarse`
  );
  return next();
});
```

## Comportamiento por defecto

::: tip
**El comportamiento por defecto se refiere al comportamiento subyacente del servidor de juego que se activa cuando no devolvemos o devolvemos un valor.**

No todos los comportamientos por defecto devuelven `true`, pero también puede ser `false`, dependiendo de cómo estén definidas las funciones subyacentes del servidor de juego.

:::

Tomemos como ejemplo el evento de entrada de texto del jugador, si devolvemos `true` o `1`, significa que el evento de entrada de texto subyacente del servidor del juego continúa ejecutándose. **En este punto verás un mensaje por defecto en la caja de chat.**

```ts
import { PlayerEvent } from "@infernus/core";

PlayerEvent.onText(({ player, next }) => {
  return true;
});
```

## Middleware

Habrás notado que hay un parámetro `next` en la función callback de casi todos los eventos, que es similar a muchos frameworks, como `express`, que se utiliza para ejecutar la siguiente función en el middleware.

**Con el patrón middleware, puedes dividir tus eventos más fácilmente en lugar de escribir todos los eventos en la misma función.**

:::warning
No olvides llamar a `next()` a menos que sepas muy bien que la siguiente función no debe ejecutarse.
:::

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onConnect(({ player, next }) => {
  console.log("player connected 1");
  // return next(); Supongamos que olvidas llamarlo
});

PlayerEvent.onConnect(({ player, next }) => {
  console.log("player connected 2");
  // Este middleware no se ejecutará
  return next();
});
```

### Soporte asíncrono

Tomemos como ejemplo los eventos de jugador. La clase de evento del jugador es `PlayerEvent`.

Puedes usar `async` directamente o devolver una función `Promise` en el callback.

```ts
import { Player, PlayerEvent } from "@infernus/core";

// Para demostrar el falso async
const fakePromise = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

// Puede utilizar async directamente, que es también la opción recomendada
PlayerEvent.onCommandText("async", async ({ player, next }) => {
  await fakePromise();
  player.sendClientMessage("#fff", "Enviar un mensaje después de un retraso de 1 segundo.");
  return next();
});

// Promise is OK, but it is not recommended
PlayerEvent.onCommandText("promise", ({ player, next }) => {
  return new Promise((resolve) => {
    fakePromise().then(() => {
      player.sendClientMessage(
        "#fff",
        "Enviar un mensaje después de un retraso de 1 segundo."
      );
      resolve();
      return next();
    });
  });
});
```

### Retorno asíncrono

:::warning
Debido a la lógica subyacente, **el valor de retorno de la función asíncrona que definas no tiene sentido!**

Aunque el tipo `TypeScript` requiere que devuelvas un valor, en realidad no se utiliza.

**Si siempre devuelves el valor de retorno del siguiente middleware como valor de retorno, el valor de retorno siempre devuelve el valor por defecto subyacente cuando se encuentra una función async.**
:::

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onText(({ player, next }) => {
  return next(); // 1
});

PlayerEvent.onText(({ player, next }) => {
  return next(); // 1
});

PlayerEvent.onText(async ({ player, next }) => {
  // porque es asíncrono,
  // el valor de retorno específico depende del valor de retorno por defecto de
  // el evento definido por el defineEvento subyacente del código fuente.
  //
  // no depende de lo que devuelva la función asíncrona.
  // onText por defecto es true, y la capa subyacente se convertirá a int, es decir, 1
  const ret = next(); // la función después de ejecutarse
  return ret; // convertir false en int = 0
});

// El valor de retorno síncrono definido después de la función asíncrona tampoco tiene sentido,
// y se ha devuelto el valor por defecto cuando se encuentra una función asíncrona
PlayerEvent.onText(({ player, next }) => {
  return false;
});
```

### Cancelar

::: tip
Todas las funciones de middleware para eventos definidas por [defineEvent](#custom-event) pueden ser canceladas, y la mayoría de los callbacks existentes se definen a través de él.
:::

Esta función se suele utilizar cuando sólo se desea ejecutar una vez o cancelar en algún momento.

```ts
// Definir un comando de una sola vez
const off = PlayerEvent.onCommandText("once", ({ player, next }) => {
  console.log(
    "Este comando sólo se ejecuta una vez, y la siguiente ejecución no existirá."
  );
  const ret = next();
  off(); // la siguiente función debe ejecutarse antes que la función off
  return ret;
});
```

## Obtener instancia

Normalmente, puede que necesites obtener todas las instancias orientadas a objetos encapsuladas por `Infernus`, como instancias de jugadores, según `id`.

Puedes obtener ejemplos de las siguientes formas, así como otros ejemplos como vehículos.

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onConnect(({ player, next }) => {
  const players = Player.getInstances(); // Obtener una matriz de todas las instancias de jugador
  players.forEach((p) => {
    p.sendClientMessage("#fff", `jugador ${player.getName()} conectado`);
  });

  const player = Player.getInstance(0); // Obtener la instancia de un jugador cuyo id es 0
  console.log(player);

  return next();
});
```

## Comandos de jugadores

En este caso se ha utilizado el evento de comando del jugador, que tiene una gran mejora en la sintaxis comparado con la anterior escritura nativa `pawn`, simplifica la sentencia de muchas funciones como `strcmp`, y puede extraer la lógica del comando con el modo middleware. Si has utilizado el desarrollo nativo, sabrás de lo que estoy hablando.

**Los eventos del comando player soportan la definición de múltiples cadenas a la vez, o puedes definir subcomandos fácilmente.**

El comando de un jugador también soporta la indefinición, y el valor de retorno de `onCommandText` es la función de cancelación.

El comando del jugador también proporciona guardia delantera, guardia trasera y guardia equivocada, que se refiere a la idea de `zcmd` en la biblioteca `pawn`.

### Ejemplo

```ts
import { Player, PlayerEvent } from "@infernus/core";

// Definir un comando de primer nivel
PlayerEvent.onCommandText("help", ({ player, next }) => {
  console.log(`jugador ${player.getName()}, hola`);
  return next();
});

// Definir un comando de segundo nivel
PlayerEvent.onCommandText("help teleport", ({ player, next }) => {
  console.log(
    `jugador ${player.getName()} desea obtener información de ayuda relacionada con la teletransportación`
  );
  return next();
});

// Definir un comando que puede ser activado por /msg o /message
PlayerEvent.onCommandText(
  ["msg", "message"],
  ({ player, subcommand, next }) => {
    console.log(
      `el jugador ${player.getName()} introdujo este comando, y también puede haber introducido un subcomando ${subcommand.toString()}`
    );

    // Equivale a que el jugador introduzca /message global o /msg global
    if (subcommand[0] === "global") {
      // Lógica adicional que desees incorporar
      return next();
    } else {
      next();
      // Pensado como un subcomando inválido, activará la retaguardia
      return false;
    }
  }
);
```

### Antes de guardia

La guardia `onCommandReceived` se ejecuta antes que `onCommandText`, y puedes añadir alguna lógica adicional.

Si devuelve `false`, lo considerará como una denegación activa y entrará en la guardia de error.

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onCommandReceived(({ player, command, next }) => {
  return next();
});
```

### Después de la guardia

Después de la guardia `onCommandPerformed` se ejecuta después de `onCommandText`. Puedes añadir alguna lógica adicional.

Si devuelve `false`, lo considerará como una denegación activa y entrará en la guardia de error.

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onCommandPerformed(({ player, command, next }) => {
  return next();
});
```

### Protección contra errores

La guardia de error `onCommandError` se ejecuta cuando la guardia antes/después `return false` o cuando el jugador introduce un comando indefinido, se puede añadir alguna lógica adicional, normalmente sólo se define una globalmente.

Si se devuelve `false`, se ejecutará el comportamiento por defecto, es decir, el comportamiento por defecto del evento nativo `OnPlayerCommandText`.

```ts
PlayerEvent.onCommandError(({ player, command, error, next }) => {
  player.sendClientMessage(
    "#f00",
    `player ${player.id} command ${command} with error ${error.code}, ${error.msg}`
  );

  next(); // Si existen otros middleware onCommandError, ejecute
  return true; // Devolver true indica que el error ha sido gestionado y el evento por defecto ya no se dispara
});
```

## Evento personalizado

Puedes definir un evento middleware tú mismo a través de `defineEvent`, que normalmente se utiliza para extender algunos nuevos callbacks.

Por ejemplo, puedes activar el nuevo evento que definiste en `onUpdate` de acuerdo a ciertas condiciones, y luego puedes usar el nuevo evento middleware que definiste en algunos lugares.

```ts
import type { Player } from "@infernus/core";
import { defineEvent, PlayerEvent } from "@infernus/core";

const healthDangerSet = new Set<Player>();

const [onPlayerDanger, trigger] = defineEvent({
  // Sólo se enumeran las piezas más utilizadas
  isNative: false, // No es un evento nativo, es decir, nuestro evento personalizado.
  // Si es true, significa el evento nativo en pwn o el evento nativo del plugin.
  name: "OnPlayerDanger", // Por favor, plantee un nombre de evento único, que no entre en conflicto con el existente, normalmente en este formato
  defaultValue: true, // Define el valor de retorno por defecto del middleware como true
  // Si su evento personalizado tiene parámetros de devolución de llamada, asegúrese de escribir beforeEach para mejorar el aviso de tipo ts
  // BeforeEach se ejecuta antes de que se ejecute todo el middleware para mejorar los parámetros
  beforeEach(player: Player, health: number) {
    // Debe devolver un objeto
    return { player, health };
  },
  // AfterEach se utiliza para ejecutar después de que todos los middleware se ejecutan (esperando a que todos los async terminen)
  afterEach({ player, health }) {},
});

PlayerEvent.onUpdate(({ player, next }) => {
  const isDanger = healthDangerSet.has(player);
  const health = player.getHealth();

  if (!isDanger && health <= 10) {
    healthDangerSet.add(player);
    const ret = trigger(player, health);
    if (!ret) return false;
  }
  if (isDanger && health > 10) {
    healthDangerSet.delete(player);
  }

  return next();
});

onPlayerDanger(({ player, health, next }) => {
  player.sendClientMessage(
    "#ff0",
    `¡PELIGRO! Su salud es sólo ${health}, y el sistema devolverá automáticamente la sangre para usted después de 3 segundos.`
  );
  setTimeout(() => {
    player.setHealth(100);
  }, 3000);
  return next();
});
```
