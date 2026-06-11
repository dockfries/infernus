# Uso

**`GameMode.use` simula un `filterscript` para reutilizar lógica entre GameModes.**

::: tip
Dado que se trata de una simulación y no de un `filterscript` real, no puede administrar estos scripts mediante comandos como `rcon loadfs/unloadfs`.
:::

## Tipo

```ts
interface IFilterScript {
  name: string;
  load: (...args: Array<any>) => Array<() => void> | Promise<Array<() => void>>;
  unload: () => any;
  [propName: string | number | symbol]: any;
}

type Use = (plugin: IFilterScript, ...options: Array<any>) => GameMode;
```

## Definir un script

Puede escribir scripts de lógica reutilizable y compartirlos mediante `node package` u otros medios.

```ts
import { GameMode } from "@infernus/core";
import type { IFilterScript } from "@infernus/core";

interface IMyScriptOptions {
  debug?: boolean;
}

interface IMyScript extends IFilterScript {
  load(options: IMyScriptOptions): ReturnType<IFilterScript["load"]>;
}

const MyScript: IMyScript = {
  name: "my_script",
  load(...args) {
    console.log("Mi script cargado.", args);
  },
  unload() {
    console.log("Mi script descargado.");
  },
};

// Sin argumentos para load
GameMode.use(MyScript);
// Con argumentos para load
GameMode.use(MyScript, "arg1", "arg2", "arg...");
```

::: tip
Los scripts registrados se cargan automáticamente tras la inicialización del GameMode.
Los scripts cargados se descargan automáticamente al salir del GameMode.
:::

## Comandos de carga

- `GameMode.loadUseScript(name: string)`: Cargar un script registrado
- `GameMode.unloadUseScript(name: string)`: Descargar un script registrado
- `GameMode.reloadUseScript(name: string)`: Recargar un script registrado

### Ejemplo

```ts
import { GameMode, PlayerEvent } from "@infernus/core";

PlayerEvent.onCommandText("reloadMyScript", ({ next }) => {
  GameMode.reloadUseScript("my_script");
  return next();
});
```

## Notas importantes

::: warning
No debe registrar `GameMode.onInit` dentro de la función `load`, ya que `load` se ejecuta precisamente dentro de ese evento.

Si usa funciones de middleware dentro de `load`, asegúrese de devolver un arreglo con sus funciones de cancelación al final — ¡de lo contrario habrá fugas de memoria! Del mismo modo, las variables globales como los temporizadores deben reiniciarse en la función `unload`.

La razón es simple: sin esto, el middleware no se limpiará al reiniciar el GameMode o al recargar el script manualmente. Cada recarga añade nuevo middleware, provocando una fuga de memoria.
::：

Además, no debe llamar a `script.load()` o `script.unload()` directamente — use los [comandos de carga](#comandos-de-carga).

```ts
import { PlayerEvent } from "@infernus/core";

const MyScript = {
  name: "my_script",
  load(...args) {
    const off1 = PlayerEvent.onCommandText("foo", ({ player, next }) => {
      return next();
    });

    const off2 = PlayerEvent.onConnect(({ player, next }) => {
      return next();
    });

    return [off1, off2];
  },
  unload() {},
};

GameMode.use(MyScript);
```

## Reescritura de filterscripts oficiales

`Infernus` ha reimplementado los filterscripts oficiales. Puede probarlos instalando [@infernus/fs](https://github.com/dockfries/infernus/tree/main/packages/filterscript).

Si le interesa, estos ejemplos le ayudarán a familiarizarse con la sintaxis más rápidamente. También puede descargar el código fuente y modificarlo para adaptarlo mejor a su GameMode.

```sh
pnpm install @infernus/fs
```

```ts
import { GameMode } from "@infernus/core";
import { A51Base } from "@infernus/fs";

GameMode.use(A51Base, { debug: true });
```

Luego ingrese `/a51` en el juego para teletransportarse a la base.
