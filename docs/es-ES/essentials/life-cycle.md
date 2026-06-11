# Ciclo de vida

El ciclo de vida muestra cuándo se ejecutan los scripts de `samp-node`.

![Ciclo de vida](/images/life-cycle-es-es.png)

El punto clave es que **todas las llamadas a la API relacionadas con el juego deben colocarse dentro de las retrollamadas `on`**, como en el desarrollo nativo. Las llamadas a `samp.caller` fallarán si el entorno de ejecución aún no está listo.

```ts
import { GameMode } from "@infernus/core";

// No haga esto — no funcionará.
GameMode.setWeather(10);

// Hágalo así.
GameMode.onInit(({ next }) => {
  GameMode.setWeather(10);
  return next();
});
```
