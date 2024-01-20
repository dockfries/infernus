# Lifecycle

Lifecycle allows you to know when `samp-node` scripts are executed.

![Lifecycle](/images/life-cycle.png)

You only need to note that **all the `api` calls related to the game should be placed in the `on` callback event**, just like in native development, otherwise the calls to `samp.caller` will not work when they are not ready.

```ts
import { GameMode } from "@infernus/core";

// Don't do this. This is invalid code.
GameMode.setWeather(10);

// To do this.
GameMode.onInit(({ next }) => {
  GameMode.setWeather(10);
  return next();
});
```
