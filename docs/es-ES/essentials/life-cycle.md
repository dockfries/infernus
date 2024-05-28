# Ciclo de vida

El ciclo de vida permite saber cuándo se ejecutan los scripts `samp-node`.

![Ciclo de vida](/images/life-cycle.png)

Sólo tienes que tener en cuenta que **todas las llamadas `api` relacionadas con el juego deben ser colocadas en el evento callback `on`**, al igual que en el desarrollo nativo, de lo contrario las llamadas a `samp.caller` no funcionarán cuando no estén listas.

```ts
import { GameMode } from "@infernus/core";

// No haga esto. Este código no es válido.
GameMode.setWeather(10);

// Para hacer eso, intenta esto.
GameMode.onInit(({ next }) => {
  GameMode.setWeather(10);
  return next();
});
```
