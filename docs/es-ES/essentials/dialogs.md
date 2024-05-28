# Diálogos

El diálogo es una función de uso común en el proceso de desarrollo. `Infernus` proporciona soporte orientado a objetos y **async**, para que puedas usarlo de forma más elegante.

Al mismo tiempo, en términos generales, ya no es necesario seguir el `id` del diálogo de la forma tradicional, y el código se generará aleatoriamente.

El tradicional evento de callback `PlayerEvent.OnDialogResponse` puede seguir siendo utilizado, pero no es recomendable.

## Ejemplo

Con el ejemplo, puede utilizar diálogos de forma elegante y continua para almacenar la lógica relevante en el mismo segmento de código, en lugar de tan complejo como el desarrollo nativo en el pasado.

### Comprobación de registro

```ts
import { PlayerEvent, Dialog, DialogStylesEnum } from "@infernus/core";

PlayerEvent.onCommandText("register", async ({ player, next }) => {
  const dialog = new Dialog({
    style: DialogStylesEnum.PASSWORD,
    caption: "Registro",
    info: "Por favor, ingresa la contraseña",
    button1: "ok",
  });

  const { inputText: password } = await dialog.show(player);

  // Puede reutilizar una instancia de diálogo existente, modificar su información y volver a utilizarla más adelante.
  // Hay muchos setter además de info.
  dialog.info = "Por favor, ingresa la contraseña nuevamente";

  const { inputText: againPassword } = await dialog.show(player);

  if (password !== againPassword) {
    player.sendClientMessage(
      "#f00",
      "La contraseña que ha introducido dos veces no es la misma, inténtelo de nuevo."
    );
  }

  return next();
});
```

### Cerrar diálogo

```ts
import { PlayerEvent, Player, Dialog } from "@infernus/core";

PlayerEvent.onCommandText("closeDialog", ({ player, subcommand, next }) => {
  const [playerId] = subcommand;

  if (!playerId) {
    player.sendClientMessage(
      "#f00",
      "Introduzca el cuadro de diálogo del jugador que desea cerrar"
    );
    return next();
  }

  // Los comandos introducidos por el jugador son todos cadenas, por lo que es necesario convertir el tipo a un tipo numérico.
  const closePlayer = Player.getInstance(+playerId);

  if (!closePlayer) {
    player.sendClientMessage("#f00", "El jugadorn no está conectado.");
  } else {
    // Método estático de diálogo
    Dialog.close(closePlayer);
    player.sendClientMessage("#ff0", "Has cerrado el diálogo del jugador.");
  }

  return next();
});
```
