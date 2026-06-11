# Diálogos

Los diálogos son un componente común en el desarrollo de SA:MP. `Infernus` proporciona una API orientada a objetos con **soporte asíncrono** para una experiencia más elegante.

Ya no necesita gestionar manualmente los ID de los diálogos — se generan automáticamente.

La retrollamada tradicional `PlayerEvent.OnDialogResponse` sigue disponible, pero no se recomienda.

## Ejemplo

Con este enfoque, puede manejar diálogos de forma elegante y mantener la lógica relacionada en un solo lugar, a diferencia de la complejidad del desarrollo nativo tradicional.

### Verificación de registro

```ts
import { PlayerEvent, Dialog, DialogStylesEnum } from "@infernus/core";

PlayerEvent.onCommandText("registro", async ({ player, next }) => {
  const dialog = new Dialog({
    style: DialogStylesEnum.PASSWORD,
    caption: "Registro",
    info: "Por favor, ingrese su contraseña",
    button1: "ok",
  });

  const { inputText: password } = await dialog.show(player);

  // Las instancias de diálogo existentes se pueden reutilizar — solo modifique sus propiedades.
  // Hay otros setters además de info.
  dialog.info = "Por favor, ingrese su contraseña nuevamente";

  const { inputText: againPassword } = await dialog.show(player);

  if (password !== againPassword) {
    player.sendClientMessage(
      "#f00",
      "Las contraseñas ingresadas no coinciden. ¡Inténtelo de nuevo!",
    );
  }

  return next();
});
```

### Cerrar un diálogo

```ts
import { PlayerEvent, Player, Dialog } from "@infernus/core";

PlayerEvent.onCommandText("cerrarDialogo", ({ player, subcommand, next }) => {
  const [playerId] = subcommand;

  if (!playerId) {
    player.sendClientMessage("#f00", "Especifique qué diálogo de jugador desea cerrar.");
    return next();
  }

  // La entrada del jugador siempre es texto — conviértalo a número.
  const closePlayer = Player.getInstance(+playerId);

  if (!closePlayer) {
    player.sendClientMessage("#f00", "Ese jugador no está conectado.");
  } else {
    Dialog.close(closePlayer); // método estático
    player.sendClientMessage("#ff0", "Ha cerrado el diálogo de ese jugador.");
  }

  return next();
});
```
