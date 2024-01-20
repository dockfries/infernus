# 对话框

对话框是开发过程中很常用的功能，`Infernus`做了面向对象和**异步支持**，让您可以更优雅的使用。

同时，通常来说您不再需要以传统的方式关注对话框的 `id`，代码内部将随机生成。

传统的 `PlayerEvent.OnDialogResponse` 回调事件仍然可以使用，但是不推荐。

## 基本示例

通过基本示例，您可以优雅，连续地使用对话框，将相关逻辑存放在同一个代码段，而不再像过去原生开发那样复杂。

### 注册校验

```ts
import { PlayerEvent, Dialog, DialogStylesEnum } from "@infernus/core";

PlayerEvent.onCommandText("register", async ({ player, next }) => {
  const dialog = new Dialog({
    style: DialogStylesEnum.PASSWORD,
    caption: "注册",
    info: "请输入你的密码",
    button1: "ok",
  });

  const { inputText: password } = await dialog.show(player);

  // 对于已有的对话框实例您可以重复使用，修改它的信息，然后稍后再一次使用它。
  // 除了setInfo还有很多方法
  dialog.info = "请再输入一次您的密码";

  const { inputText: againPassword } = await dialog.show(player);

  if (password !== againPassword) {
    player.sendClientMessage("#f00", "您两次输入的密码不一致，请重试！");
  }

  return next();
});
```

### 关闭对话框

```ts
import { PlayerEvent, Player, Dialog } from "@infernus/core";

PlayerEvent.onCommandText("closeDialog", ({ player, subcommand, next }) => {
  const [playerId] = subcommand;

  const closePlayer = Player.getInstance(+playerId);

  if (!closePlayer) {
    player.sendClientMessage("#f00", "该玩家不在线");
  } else {
    // 对话框静态方法
    Dialog.close(closePlayer);
    player.sendClientMessage("#ff0", "您关闭了该玩家的对话框");
  }

  return next();
});
```
