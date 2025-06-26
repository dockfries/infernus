# 钩子

通过`defineHooks`您可以定义一些`hook`，它使得之后的该函数调用都会经过您定义的函数。

**作用域仅限您的`ts`代码，在其他插件和原生`pawn`中不生效。**

## 基础示例

```ts
import { defineHooks, Player } from "@infernus/core";

// 解构得到原始的所有方法，以及设置hook的方法。
export const [orig_playerMethods, setPlayerHook] = defineHooks(Player);
// 这里演示的是对Player进行hook，大部分实体类我们都可以传入，比如Vehicle, TextDraw...

// 第一个参数是可hook的方法名，它会有ts类型提示。
// 返回值就是您传入的第二个参数
export const my_setPlayerArmour = setPlayerHook(
  "setArmour",
  function (armour: number) {
    // 此时this指向当前的玩家
    const flag = true; // 这里假设true
    if (flag) {
      console.log("my hook");
      // 调用原始的设置盔甲，但我们故意减去1，并返回原始调用结果
      return orig_playerMethods.setArmour.call(this, armour - 1);
      // 绝对不能直接使用this.setArmour(armour)，这会造成死循环
      // 在hook函数体内里您只能通过orig_playerMethods来调用所有原始函数。
    } else {
      return false;
    }
  },
);

/*
setPlayerHook(
  "setArmour",
  function (armour: number) {
    // 您只能在同一组defineHooks里对某个方法hook一次
    // 绝对不能再次hook同一个方法。
    // 如果您要hook多次，请多次使用defineHooks函数并拆分文件或定义不同变量名。
  },
);
*/
```

## 可注入的

> 一些实体类提供了以`__inject`开头的静态方法以供注入。

由于一些实体类封装的特殊性，您不能直接使用`defineHooks`。

比如`Vehicle`上的`AddStaticVehicle(ex), CreateVehicle, DestroyVehicle`。

这些原生函数在`Vehicle`内部调用`create`或`destroy`时会触发。

```ts
import { Vehicle, type LimitsEnum } from "@infernus/core";

export const orig_CreateVehicle = Vehicle.__inject_CreateVehicle;

export function my_CreateVehicle(
  ...args: Parameters<typeof orig_CreateVehicle>
) {
  const id = orig_CreateVehicle(...args);

  if (id > 0 && id < LimitsEnum.MAX_VEHICLES) {
    console.log(`hook: vehicle ${id} created`);
  }

  return id;
}

Vehicle.__inject_CreateVehicle = my_CreateVehicle;
```
