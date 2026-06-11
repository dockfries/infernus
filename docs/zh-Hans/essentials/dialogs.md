# 对话框

对话框是开发中常用的功能。`Infernus` 提供了面向对象和**异步支持**，让您能够更优雅地使用。

通常您不再需要关注对话框的 ID，代码内部会自动生成。

传统的 `PlayerEvent.OnDialogResponse` 回调事件仍可使用，但不推荐。

## 基本示例

通过本示例，您可以优雅连贯地使用对话框，将相关逻辑汇聚在同一代码段中，不再像原生开发那样复杂。

### 注册校验

```ts
import { PlayerEvent, Dialog, DialogStylesEnum } from "@infernus/core";

PlayerEvent.onCommandText("register", async ({ player, next }) => {
  const dialog = new Dialog({
    style: DialogStylesEnum.PASSWORD,
    caption: "注册",
    info: "请输入您的密码",
    button1: "ok",
  });

  const { inputText: password } = await dialog.show(player);

  // 对话框实例可重复使用，修改属性后再次展示
  // 除了 info 之外还有其他 setter
  dialog.info = "请再次输入您的密码";

  const { inputText: againPassword } = await dialog.show(player);

  if (password !== againPassword) {
    player.sendClientMessage("#f00", "两次输入的密码不一致，请重试！");
  }

  return next();
});
```

### 关闭对话框

```ts
import { PlayerEvent, Player, Dialog } from "@infernus/core";

PlayerEvent.onCommandText("closeDialog", ({ player, subcommand, next }) => {
  const [playerId] = subcommand;

  if (!playerId) {
    player.sendClientMessage("#f00", "请指定要关闭哪个玩家的对话框");
    return next();
  }

  // 玩家输入均为字符串，需转换为数值类型
  const closePlayer = Player.getInstance(+playerId);

  if (!closePlayer) {
    player.sendClientMessage("#f00", "该玩家不在线");
  } else {
    Dialog.close(closePlayer); // 静态方法
    player.sendClientMessage("#ff0", "已关闭该玩家的对话框");
  }

  return next();
});
```
