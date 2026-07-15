# Eventos

Los eventos de `Infernus` se asemejan mucho a sus equivalentes nativos. Consulte la documentación de [Open Multiplayer](https://open.mp) para obtener detalles sobre los eventos nativos.

## Ejemplo

Tome `OnGameModeInit` — en `Infernus` es `GameMode.onInit(callback)`.

La mayoría de las demás clases de eventos terminan en `Event`, como `PlayerEvent`.

Con las sugerencias de tipo de TypeScript, lo entenderá rápidamente.

```ts
import { GameMode } from "@infernus/core";

GameMode.onInit(({ next }) => {
  console.log("El modo de juego se inicializó");
  return next();
});

GameMode.onExit(({ next }) => {
  console.log("El modo de juego finalizó");
  return next();
});

GameMode.onIncomingConnection(({ next, playerId, ipAddress, port }) => {
  console.log(`jugador ID: ${playerId}, IP: ${ipAddress}, puerto: ${port} intenta conectarse`);
  return next();
});
```

## Comportamiento predeterminado

::: tip
**El comportamiento predeterminado se refiere a la acción subyacente del servidor que se activa cuando no devolvemos un valor, o devolvemos un valor específico.**

No todos los comportamientos predeterminados devuelven `true` — algunos pueden devolver `false`, dependiendo de cómo estén definidas las funciones subyacentes.
:::

Tome el evento de entrada de texto del jugador: devolver `true` o `1` hace que el evento de entrada de texto subyacente continúe ejecutándose. **Verá un mensaje predeterminado en el cuadro de chat.**

```ts
import { PlayerEvent } from "@infernus/core";

PlayerEvent.onText(({ player, next }) => {
  return true;
});
```

## Middleware

Puede haber notado el parámetro `next` en casi todas las retrollamadas de eventos. Al igual que en frameworks como `Express`, ejecuta la siguiente función en la cadena de middleware.

**Con el patrón middleware, puede dividir sus eventos en funciones separadas en lugar de acumular todo en una sola.**

:::warning
No olvide llamar a `next()` a menos que esté seguro de que la siguiente función no debe ejecutarse.
:::

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onConnect(({ player, next }) => {
  console.log("jugador conectado 1");
  // return next(); // Supongamos que olvida llamarlo
});

PlayerEvent.onConnect(({ player, next }) => {
  console.log("jugador conectado 2");
  // Este middleware no se ejecutará
  return next();
});
```

### Soporte asíncrono

Tomando como ejemplo los eventos de jugador — la clase de evento es `PlayerEvent`.

Puede usar `async`/`await` o devolver una `Promise` en la retrollamada.

```ts
import { Player, PlayerEvent } from "@infernus/core";

// Una función async falsa para demostración
const fakePromise = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

// Usar async/await es el enfoque recomendado
PlayerEvent.onCommandText("async", async ({ player, next }) => {
  await fakePromise();
  player.sendClientMessage("#fff", "Mensaje enviado después de 1 segundo de retraso.");
  return next();
});

// Promise también funciona, pero no se recomienda
PlayerEvent.onCommandText("promise", ({ player, next }) => {
  return new Promise((resolve) => {
    fakePromise().then(() => {
      player.sendClientMessage("#fff", "Mensaje enviado después de 1 segundo de retraso.");
      resolve();
      return next();
    });
  });
});
```

### Valor de retorno asíncrono

:::warning
Debido a detalles de implementación subyacentes, **¡el valor de retorno de las funciones asíncronas no tiene sentido!**

Aunque TypeScript requiere que devuelva un valor, este no se utiliza realmente.

**Si siempre pasa el valor de retorno de `next()`, se devolverá el valor subyacente predeterminado cuando se encuentre una función async.**
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
  // Como es async, el valor de retorno depende del valor predeterminado
  // definido por defineEvent, no de lo que devuelva la función async.
  // onText por defecto es true, que se convierte en int 1.
  const ret = next(); // ejecutar la siguiente función
  return ret; // false se convierte en int 0
});

// Los valores de retorno síncronos después de una función async también se ignoran;
// el valor predeterminado ya se devolvió al encontrar la función async.
PlayerEvent.onText(({ player, next }) => {
  return false;
});
```

### Cancelación

::: tip
Todas las funciones de middleware para eventos definidos por [defineEvent](#evento-personalizado) pueden cancelarse. La mayoría de las retrollamadas existentes se definen a través de él.
:::

Esto es útil cuando desea ejecutar un manejador solo una vez, o cancelarlo en un punto específico.

```ts
// Definir un comando de una sola vez
const off = PlayerEvent.onCommandText("once", ({ player, next }) => {
  console.log(
    "Este comando solo se ejecuta una vez; las invocaciones posteriores no lo activarán.",
  );
  const ret = next();
  off(); // llame a off() después de next()
  return ret;
});
```

## Obtención de instancias

A menudo necesitará recuperar instancias orientadas a objetos encapsuladas por `Infernus` (por ejemplo, instancias de jugadores) por su `id`.

Así es como se obtienen instancias — los vehículos y otras entidades funcionan de manera similar.

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onConnect(({ player, next }) => {
  const players = Player.getInstances(); // arreglo de todas las instancias de jugador
  players.forEach((p) => {
    p.sendClientMessage("#fff", `jugador ${player.getName().name} conectado`);
  });

  const player = Player.getInstance(0); // jugador con id 0
  console.log(player);

  return next();
});
```

## Comandos de jugador

El evento de comando de jugador se ha utilizado en ejemplos anteriores. Ofrece una mejora sintáctica significativa sobre el Pawn nativo — elimina las engorrosas cadenas de `strcmp` y permite extraer la lógica de comandos mediante el patrón middleware. Si ha usado desarrollo nativo, sabrá de lo que hablo.

**Los eventos de comando de jugador permiten definir múltiples cadenas a la vez y facilitan los subcomandos.**

Los comandos de jugador también admiten cancelación — el valor de retorno de `onCommandText` es la función de cancelación.

Además, los comandos de jugador proporcionan guardia frontal, guardia trasera y guardia de error, inspirados en la librería `zcmd` de Pawn.

### Ejemplo

```ts
import { Player, PlayerEvent } from "@infernus/core";

// Definir un comando de primer nivel
PlayerEvent.onCommandText("ayuda", ({ player, next }) => {
  console.log(`Hola, jugador ${player.getName().name}`);
  return next();
});

// Definir un subcomando
PlayerEvent.onCommandText("ayuda teletransporte", ({ player, next }) => {
  console.log(`el jugador ${player.getName().name} desea ayuda con teletransporte`);
  return next();
});

// Definir un comando que puede activarse con /msg o /mensaje
PlayerEvent.onCommandText(["msg", "mensaje"], ({ player, subcommand, next }) => {
  console.log(
    `el jugador ${player.getName().name} usó este comando, subcomando: ${subcommand.toString()}`,
  );

  // Equivale a /mensaje global o /msg global
  if (subcommand[0] === "global") {
    return next();
  } else {
    next();
    return false; // se trata como inválido, activando la guardia trasera
  }
});
```

### Sensibilidad a mayúsculas y minúsculas

Por defecto, el registro de comandos **no distingue** entre mayúsculas y minúsculas.

Puede alternar esto mediante métodos en la instancia de `GameMode`.

```ts
import { GameMode } from "@infernus/core";

console.log(GameMode.isCmdCaseSensitive());

GameMode.enableCmdCaseSensitive(); // Activar sensibilidad
GameMode.disableCmdCaseSensitive(); // Desactivar sensibilidad
```

:::warning
Tenga en cuenta que cambiar la sensibilidad normalmente **no puede** hacerse dentro de retrollamadas como `GameMode.onInit`, porque los comandos se registran mediante `PlayerEvent.onCommandText` antes de que esas retrollamadas se disparen.

Si cambia la configuración global y luego importa otros paquetes, también afectará la sensibilidad de los comandos en esos paquetes (por ejemplo, `@infernus/fs`).

Cuando hay múltiples comandos con el mismo nombre pero diferente configuración de sensibilidad, **los middlewares que distinguen mayúsculas y minúsculas se consideran coincidencias estrictas y tienen prioridad sobre los que no.**
:::

Puede activar o desactivar la sensibilidad para los comandos registrados posteriormente.

```ts
import { GameMode, PlayerEvent } from "@infernus/core";

GameMode.disableCmdCaseSensitive();

// Los comandos registrados ahora no distinguen mayúsculas/minúsculas.
// Los jugadores pueden usar help, HeLP, etc.
PlayerEvent.onCommandText("help", ({ player, next }) => {
  player.sendClientMessage(-1, "comando help (no sensible)");
  return next();
});

GameMode.enableCmdCaseSensitive();

// Los comandos registrados ahora distinguen mayúsculas/minúsculas.
// Los jugadores deben usar Help exactamente.
PlayerEvent.onCommandText("Help", ({ player, next }) => {
  player.sendClientMessage(-1, "comando help (sensible)");
  return next();
});
```

### Sensibilidad parcial

Puede pasar una opción para especificar si un comando concreto distingue mayúsculas y minúsculas, independientemente de la configuración global.

```ts
PlayerEvent.onCommandText({
  caseSensitive: false, // anulación para este comando
  command: "foo",
  run({ player, subcommand, next }) {
    return next();
  },
});
```

### Guardia frontal

La guardia frontal `onCommandReceived` se ejecuta antes de `onCommandText`, permitiéndole agregar lógica adicional.

Devolver `false` se considera un rechazo activo y entra en la guardia de error.

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onCommandReceived(({ player, command, next }) => {
  return next();
});
```

### Guardia trasera

La guardia trasera `onCommandPerformed` se ejecuta después de `onCommandText`. Puede agregar lógica adicional aquí.

Devolver `false` se considera un rechazo activo y entra en la guardia de error.

```ts
import { Player, PlayerEvent } from "@infernus/core";

PlayerEvent.onCommandPerformed(({ player, command, next }) => {
  return next();
});
```

### Guardia de error

La guardia de error `onCommandError` se activa cuando la guardia frontal/trasera devuelve `false`, o cuando un jugador introduce un comando no definido. Puede agregar lógica de manejo aquí; normalmente solo se define una guardia de error global.

Devolver `false` ejecuta el comportamiento predeterminado del evento nativo `OnPlayerCommandText`.

```ts
PlayerEvent.onCommandError(({ player, command, error, next }) => {
  player.sendClientMessage(
    "#f00",
    `jugador ${player.id} comando ${command} error ${error.code}: ${error.msg}`,
  );

  next(); // continuar con otros middlewares onCommandError si los hay
  return true; // indica que el error se ha manejado; no disparar el evento predeterminado
});
```

## Evento personalizado

Puede definir eventos middleware personalizados mediante `defineEvent`, normalmente para extender las retrollamadas disponibles.

Por ejemplo, puede disparar su evento personalizado en `onUpdate` basándose en ciertas condiciones, y luego usar el middleware correspondiente en otro lugar.

```ts
import type { Player } from "@infernus/core";
import { defineEvent, PlayerEvent } from "@infernus/core";

const healthDangerSet = new Set<Player>();

const [onPlayerDanger, trigger] = defineEvent({
  // Solo se enumeran las opciones comunes
  isNative: false, // no es un evento nativo — es personalizado
  name: "OnPlayerDanger", // debe ser único; siga esta convención de nomenclatura
  defaultValue: true, // valor de retorno predeterminado del middleware
  // Si su evento personalizado tiene parámetros de retrollamada, use beforeEach para mejores sugerencias de tipo TS.
  // beforeEach se ejecuta antes de todos los middlewares para aumentar los parámetros.
  beforeEach(player: Player, health: number) {
    // Debe devolver un objeto
    return { player, health };
  },
  // afterEach se ejecuta después de que todos los middlewares completen (incluyendo los async)
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
    `¡PELIGRO! Su salud es solo ${health}. Se auto-curará en 3 segundos.`,
  );
  setTimeout(() => {
    player.setHealth(100);
  }, 3000);
  return next();
});
```
