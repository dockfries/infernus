# Hooks

Con `defineHooks` puede interceptar todas las llamadas posteriores a una función dada con su propia implementación.

**El alcance se limita a su código TypeScript — no afecta a otros complementos ni al Pawn nativo.**

## Ejemplo básico

```ts
import { defineHooks, Player } from "@infernus/core";

// Desestructurar para obtener todos los métodos originales y la función setHook.
export const [orig_playerMethods, setPlayerHook] = defineHooks(Player);
// Este ejemplo intercepta la clase Player. La mayoría de las clases de entidad (Vehicle, TextDraw, etc.) funcionan de manera similar.

// El primer parámetro es el nombre del método a interceptar, con sugerencias de tipo TS.
// El valor de retorno es su función hook (el segundo parámetro).
export const my_setPlayerArmour = setPlayerHook("setArmour", function (armour: number) {
  // Dentro del hook, `this` se refiere a la instancia actual del jugador.
  const flag = true; // asumimos verdadero para este ejemplo
  if (flag) {
    console.log("my hook");
    // Llamar al setArmour original — restamos 1 y devolvemos el resultado original.
    return orig_playerMethods.setArmour.call(this, armour - 1);
    // Nunca llame a this.setArmour(armour) directamente — causaría un bucle infinito.
    // Dentro del cuerpo del hook, use siempre orig_playerMethods para las llamadas originales.
  } else {
    return false;
  }
});

/*
setPlayerHook(
  "setArmour",
  function (armour: number) {
    // Solo puede interceptar un método una vez dentro del mismo grupo defineHooks.
    // Si necesita interceptar un método varias veces, llame a defineHooks por separado
    // en diferentes archivos o con diferentes nombres de variable.
  },
);
*/
```

## Inyectables

> Algunas clases de entidad proporcionan un método estático `__inject__` para inyección.

Debido a la naturaleza especial de algunas clases de entidad encapsuladas, no puede usar `defineHooks` directamente.

Por ejemplo, `Vehicle` tiene `AddStaticVehicle(ex)`, `CreateVehicle` y `DestroyVehicle`.

Estas funciones nativas se activan internamente cuando `Vehicle` crea o destruye una instancia.

```ts
import { Vehicle, type LimitsEnum } from "@infernus/core";

export const orig_CreateVehicle = Vehicle.__inject__.create;

export function my_CreateVehicle(...args: Parameters<typeof orig_CreateVehicle>) {
  const id = orig_CreateVehicle(...args);

  if (id > 0 && id < LimitsEnum.MAX_VEHICLES) {
    console.log(`hook: vehicle ${id} created`);
  }

  return id;
}

Vehicle.__inject__.create = my_CreateVehicle;
```
