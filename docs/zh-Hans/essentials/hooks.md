# 钩子

通过 `defineHooks`，您可以定义钩子来拦截后续对某一函数的所有调用。

**作用域仅限于您的 TypeScript 代码，不会影响其他插件或原生 Pawn。**

## 基础示例

```ts
import { defineHooks, Player } from "@infernus/core";

// 解构得到所有原始方法和设置钩子的方法
export const [orig_playerMethods, setPlayerHook] = defineHooks(Player);
// 此处演示对 Player 进行钩子处理，大部分实体类（Vehicle、TextDraw 等）均可类似操作

// 第一个参数为可钩子的方法名，带有完整的 TS 类型提示
// 返回值即为您传入的第二个参数（钩子函数）
export const my_setPlayerArmour = setPlayerHook("setArmour", function (armour: number) {
  // 此时 this 指向当前玩家实例
  const flag = true; // 假设为 true
  if (flag) {
    console.log("my hook");
    // 调用原始 setArmour，此处故意减 1 并返回原始调用结果
    return orig_playerMethods.setArmour.call(this, armour - 1);
    // 绝对不能直接使用 this.setArmour(armour)，会造成死循环
    // 在钩子函数体内只能通过 orig_playerMethods 调用所有原始方法
  } else {
    return false;
  }
});

/*
setPlayerHook(
  "setArmour",
  function (armour: number) {
    // 同一组 defineHooks 内只能对某个方法钩子一次
    // 如需多次钩子，请多次调用 defineHooks 并拆分文件或使用不同变量名
  },
);
*/
```

## 可注入

> 部分实体类提供了 `__inject__` 静态方法以供注入。

由于某些实体类封装的特殊性，您无法直接使用 `defineHooks`。

例如 `Vehicle` 上的 `AddStaticVehicle(ex)`、`CreateVehicle`、`DestroyVehicle`。

这些原生函数会在 `Vehicle` 内部创建或销毁实例时触发。

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
