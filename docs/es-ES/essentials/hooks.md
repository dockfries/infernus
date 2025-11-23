# Hooks

Con `defineHooks` puedes definir algunos `hooks`, lo que hace que las llamadas posteriores a esa función pasen por tu función definida.

**​​El alcance está limitado a tu código `ts` y no tiene efecto en otros plugins o en `pawn` nativo.​**

## Ejemplo Básico

```ts
import { defineHooks, Player } from "@infernus/core";

// Desestructura para obtener todos los métodos originales y el método para establecer hooks.
export const [orig_playerMethods, setPlayerHook] = defineHooks(Player);
// Esto demuestra el hooking de la clase Player. La mayoría de las clases de entidad pueden pasarse, como Vehicle, TextDraw...

// El primer parámetro es el nombre del método hookeable, que tendrá sugerencias de tipo TS.
// El valor de retorno es el segundo parámetro que pasaste.
export const my_setPlayerArmour = setPlayerHook(
  "setArmour",
  function (armour: number) {
    // Aquí, `this` se refiere al jugador actual
    const flag = true; // Asume verdadero para este ejemplo
    if (flag) {
      console.log("my hook");
      // Llama al método setArmour original, pero restamos 1 intencionalmente y devolvemos el resultado original
      return orig_playerMethods.setArmour.call(this, armour - 1);
      // Nunca uses directamente this.setArmour(armour), ya que causará un bucle infinito
      // Dentro del cuerpo de la función hook, solo puedes llamar a las funciones originales a través de orig_playerMethods.
    } else {
      return false;
    }
  },
);

/*
setPlayerHook(
  "setArmour",
  function (armour: number) {
    // Solo puedes hookear un método una vez dentro del mismo grupo defineHooks
    // Nunca hookees el mismo método nuevamente.
    // Si necesitas hookear varias veces, usa la función defineHooks múltiples veces y divide archivos o define nombres de variables diferentes.
  },
);
*/
```

## Inyectables

> Algunas clases de entidad proporcionan métodos estáticos `__inject__` para inyección.

Debido a la naturaleza especial de algunas clases de entidad encapsuladas, no puedes usar `defineHooks` directamente.

Por ejemplo, `AddStaticVehicle(ex), CreateVehicle, DestroyVehicle` en la clase `Vehicle`.

Estas funciones nativas se activan cuando se llama a `create` o `destroy` internamente en `Vehicle`.

```ts
import { Vehicle, type LimitsEnum } from "@infernus/core";

export const orig_CreateVehicle = Vehicle.__inject__.create;

export function my_CreateVehicle(
  ...args: Parameters<typeof orig_CreateVehicle>
) {
  const id = orig_CreateVehicle(...args);

  if (id > 0 && id < LimitsEnum.MAX_VEHICLES) {
    console.log(`hook: vehicle ${id} created`);
  }

  return id;
}

Vehicle.__inject__.create = my_CreateVehicle;
```
