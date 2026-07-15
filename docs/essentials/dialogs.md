# Dialogs

Dialogs are a common UI component in SA:MP development. `Infernus` provides an object-oriented API with **async support** for a more elegant experience.

You no longer need to manually manage dialog IDs — they are generated automatically.

The traditional `PlayerEvent.OnDialogResponse` callback is still available, but not recommended.

## Example

With this approach, you can handle dialogs gracefully and keep related logic in one place, unlike the complexity of traditional native development.

### Registration Check

```ts
import { PlayerEvent, Dialog, DialogStylesEnum } from "@infernus/core";

PlayerEvent.onCommandText("register", async ({ player, next }) => {
  const dialog = new Dialog({
    style: DialogStylesEnum.PASSWORD,
    caption: "Register",
    info: "Please enter your password",
    button1: "ok",
  });

  const { inputText: password } = await dialog.show(player);

  // Existing dialog instances can be reused — just modify their properties.
  // There are other setters besides info.
  dialog.info = "Please enter your password again";

  const { inputText: againPassword } = await dialog.show(player);

  if (password !== againPassword) {
    player.sendClientMessage("#f00", "The passwords you entered do not match. Please try again!");
  }

  return next();
});
```

### Closing a Dialog

```ts
import { PlayerEvent, Player, Dialog } from "@infernus/core";

PlayerEvent.onCommandText("closeDialog", ({ player, subcommand, next }) => {
  const [playerId] = subcommand;

  if (!playerId) {
    player.sendClientMessage("#f00", "Please specify which player's dialog to close.");
    return next();
  }

  // Player input is always a string — parse it to a number.
  const closePlayer = Player.getInstance(+playerId);

  if (!closePlayer) {
    player.sendClientMessage("#f00", "That player is not online.");
  } else {
    Dialog.close(closePlayer); // static method
    player.sendClientMessage("#ff0", "You closed that player's dialog.");
  }

  return next();
});
```
