# Lifecycle

The lifecycle diagram shows when `samp-node` scripts are executed.

![Lifecycle](/images/life-cycle.png)

The key takeaway is that **all game-related API calls should be placed inside `on` callback events**, just like in native development. Calls to `samp.caller` will fail if the runtime isn't ready yet.

```ts
import { GameMode } from "@infernus/core";

// Don't do this — it won't work.
GameMode.setWeather(10);

// Do this instead.
GameMode.onInit(({ next }) => {
  GameMode.setWeather(10);
  return next();
});
```
