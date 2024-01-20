# Dialogs

Dialog is a commonly used function in the development process. `Infernus` provides object-oriented and **async support**, so that you can use it more elegantly.

At the same time, generally speaking, you no longer need to follow the `id` of the dialog in the traditional way, and the code will be generated randomly.

The traditional `PlayerEvent.OnDialogResponse` callback event can still be used, but it is not recommended.

## Example

With the example, you can use dialogs gracefully and continuously to store the relevant logic in the same code segment, rather than as complex as native development in the past.

### Register check

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

  // You can reuse an existing dialog instance, modify its information, and then use it again later.
  // There are many setter besides info.
  dialog.info = "Please enter your password again";

  const { inputText: againPassword } = await dialog.show(player);

  if (password !== againPassword) {
    player.sendClientMessage(
      "#f00",
      "The password you entered twice is not the same, please try again!"
    );
  }

  return next();
});
```

### Close dialog

```ts
import { PlayerEvent, Player, Dialog } from "@infernus/core";

PlayerEvent.onCommandText("closeDialog", ({ player, subcommand, next }) => {
  const [playerId] = subcommand;

  if (!playerId) {
    player.sendClientMessage(
      "#f00",
      "Please enter the dialog for which player you want to close"
    );
    return next();
  }

  // The commands entered by the player are all strings, so you need to convert the type to a numeric type.
  const closePlayer = Player.getInstance(+playerId);

  if (!closePlayer) {
    player.sendClientMessage("#f00", "The player is not online.");
  } else {
    // Dialog static method
    Dialog.close(closePlayer);
    player.sendClientMessage("#ff0", "You closed the player's dialog.");
  }

  return next();
});
```
