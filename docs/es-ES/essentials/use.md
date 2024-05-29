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

const script = {
  name: 'my_script',
  load(...args) {
    console.log('Mi script se cargó correctamente.')
  }
  unload() {
    console.log('Ya no se cargará mi script.')
  }
}

// No se pasan parámetros al método de carga
GameMode.use(script);
// Pasar parámetros al método de carga
GameMode.use(script, 'arg1', 'arg2');
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
Si usas funciones middleware en tu script, deberías cancelar estas funciones intermedias cuando el script se descarga, ¡de lo contrario habrá una fuga de memoria!
La razón es simple: si no lo haces, el middleware no será desinstalado cuando el GameMode se reinicie o ejecute manualmente el comando de reinicio del script, y cada vez se añadirá una nueva función intermedia a la función `load` del script, ¡lo que provocará una fuga de memoria!
:::

Además, no debe llamar a `script.load()` o `script.unload()`. Debe usar el [cargar comando](#load-command) para llamar.

```ts

const offs = []

const script = {
  name: 'my_script',
  load(...args) {
    const off = GameMode.onInit(() => {
    })
    offs.push(off)
  }
  unload() {
    offs.forEach(off => off());
  }
}

GameMode.use(script);

```

## Reescribe el oficial filterscript

`Infernus` ha intentado reescribir el filterscript oficial, pero hasta ahora solo se ha implementado una pequeña parte. Puedes probarlo instalando `@infernus/fs`. Si está interesado, puede continuar mejorando el filterscript oficial que no se ha reescrito y enviarlo al repositorio.

```sh
pnpm install @infernus/fs
```

```ts
import { GameMode } from "@infernus/core";
import { useA51BaseFS } from "@infernus/fs";

GameMode.use(useA51BaseFS({ debug: true }));
```

Luego ingresas `/a51` en el juego para teletransportarte a la base.
