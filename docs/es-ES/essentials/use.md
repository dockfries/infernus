# Uso

**`GameMode.use` es un método para simular `filterscript`, que se utiliza para la reutilización lógica en GameMode.**

::: tip
Debido a que se trata de una simulación y no de un `filterscript` real, no puede operar estos scripts a través de comandos como `rcon loadfs/unloadfs`.
:::

## Tipo

```ts
interface IFilterScript {
  name: string;
  load: (...args: Array<any>) => any;
  unload: () => any;
  [propName: string | number | symbol]: any;
}

type Use = (plugin: IFilterScript, ...options: Array<any>) => GameMode;
```

## Definir script

Puedes escribir tú mismo algunos scripts de reutilización lógica y compartirlos con otros a través de `node package` u otras formas.

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
    console.log('Mi script cargó.', args);
  },
  unload() {
    console.log('Mi script se descargó.');
  }
};

// Ningún parámetro es pasado al método load
GameMode.use(MyScript);
// Pasa parámetros al método load
GameMode.use(MyScript, 'arg1', 'arg2', 'arg...');
```

::: tip
Los scripts registrados se cargan automáticamente después del inicio del GameMode.
El script cargado se descarga automáticamente al salir del GameMode.
:::

## Cargar un comando

- `GameMode.loadUseScript(name: string)`: Cargar un script registrado
- `GameMode.unloadUseScript(nombre: cadena)`: Descargar un script registrado
- `GameMode.reloadUseScript(nombre: cadena)`: Recargar un script registrado

### Ejemplo

```ts
import { GameMode, PlayerEvent } from "@infernus/core";

PlayerEvent.onCommandText("reloadMyScript", ({ next }) => {
  GameMode.reloadUseScript("my_script");
  return next();
});
```

## Noticia

::: warning
No deberías de registrar el evento `GameMode.onInit` en la función `load`, ya que se ejecuta en su evento cuando es cargada a través de `GameMode.use`.

Si usas funciones de middleware en la función `load`, deberías retornar un arreglo de funciones de middleware canceladas la final, ¡de otra forma habría un fenómeno de fuga de memoria! Para otras variables globales, como los timers, ¡deberías reiniciarlas en la función `unload`!

La razón es simple, si no haces eso, el middleware no va a ser descargado cuando la GameMode es reiniciada o se ejecuta de forma manual el script del comando para reiniciar, y cada vez que el script es cargado, una nueva función intermedia es agregada, ¡lo que provocará una fuga de memoria!  
:::

Además, no debe llamar a `script.load()` o `script.unload()`. Debe usar el [cargar comando](#load-command) para llamar.

```ts
const MyScript = {
  name: 'my_script',
  load(...args) {
    const off1 = PlayerEvent.onCommandText("foo", ({ player, next }) => {
      return next();
    });

    const off2 = PlayerEvent.onConnect(({ player, next }) => {
      return next();
    });

    return [off1, off2];
  },
  unload() {

  }
}

GameMode.use(MyScript);
```

## Reescribe el oficial filterscript

`Infernus` ha intentado reescribir el filtro oficial. Puedes probarlo instalando [@infernus/fs](https://github.com/dockfries/infernus/tree/main/packages/filterscript).

Si está interesado, puede referirse a estos casos para familiarizarse con la sintaxis más rápido. También puedes descargar el código fuente y modificarlo para aplicarlo mejor en tu GameMode.

```sh
pnpm install @infernus/fs
```

```ts
import { GameMode } from "@infernus/core";
import { A51Base } from "@infernus/fs";

GameMode.use(A51Base, { debug: true });
```

Luego ingresas `/a51` en el juego para teletransportarte a la base.