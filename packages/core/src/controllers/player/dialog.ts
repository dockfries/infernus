import { DialogStylesEnum } from "../../enums";
import type {
  IDialog,
  IDialogFuncQueue,
  IDialogResRaw,
  IDialogResResult,
} from "../../interfaces";
import { HidePlayerDialog } from "core/wrapper/native";
import { I18n } from "../i18n";
import { Player } from "./entity";
import { defineEvent } from "../bus";
import { ShowPlayerDialog } from "core/utils/helperUtils";

export const [onDialogResponse] = defineEvent({
  name: "OnDialogResponseI18n",
  identifier: "iiiiai",
  beforeEach(
    id: number,
    dialogId: number,
    response: number,
    listItem: number,
    buffer: number[]
  ) {
    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      player: Player.getInstance(id)!,
      dialogId,
      response,
      listItem,
      buffer,
    };
  },
});

onDialogResponse(({ next, player, dialogId, response, listItem, buffer }) => {
  const callback = Dialog.waitingQueue.get(player);
  if (!callback) return next();
  if (callback.showId !== dialogId) return next();
  // bug: does not trigger resolve of promise
  // fix: it only works if you put it in an event loop
  setTimeout(() => callback.resolve({ response, listItem, buffer }));
  return next();
});

/**
 * You don't need to care about the dialog id.
 * If you need to change the value dynamically, you should do it by setter method.
 */
export class Dialog {
  private id = -1;
  private static showingIds: number[] = [];
  private static max_dialogId = 32767;
  private dialog: IDialog;
  static waitingQueue: Map<Player, IDialogFuncQueue> = new Map();

  constructor(
    dialog: IDialog = {
      style: DialogStylesEnum.MSGBOX,
      caption: "",
      info: "",
      button1: "",
      button2: "",
    }
  ) {
    this.dialog = dialog;
  }

  // #region
  get style(): DialogStylesEnum | undefined {
    return this.dialog.style;
  }
  set style(v: DialogStylesEnum | undefined) {
    this.dialog.style = v;
  }

  get caption(): string | undefined {
    return this.dialog.caption;
  }
  set caption(v: string | undefined) {
    this.dialog.caption = v;
  }

  get info(): string | undefined {
    return this.dialog.info;
  }
  set info(v: string | undefined) {
    this.dialog.info = v;
  }

  get button1(): string | undefined {
    return this.dialog.button1;
  }
  set button1(v: string | undefined) {
    this.dialog.button1 = v;
  }

  get button2(): string | undefined {
    return this.dialog.button2;
  }
  set button2(v: string | undefined) {
    this.dialog.button2 = v;
  }

  //#endregion

  private static delDialogTask(player: Player, reject = false): boolean {
    // if player disconnect and still await response
    // should stop promise waiting
    const task = Dialog.waitingQueue.get(player);
    if (!task) return false;
    if (reject) {
      task.reject(
        "[Dialog]: player timeout does not respond or second request show dialog"
      );
    }
    Dialog.waitingQueue.delete(player);
    const index = Dialog.showingIds.indexOf(task.showId);
    if (index > -1) Dialog.showingIds.splice(index, 1);
    return true;
  }

  show(player: Player) {
    return new Promise<IDialogResRaw>((resolve, reject) => {
      Dialog.close(player);

      while (this.id === -1 || Dialog.showingIds.includes(this.id)) {
        if (Dialog.showingIds.length === Dialog.max_dialogId) break;
        this.id = Math.floor(Math.random() * (Dialog.max_dialogId + 1));
      }

      if (this.id === -1) {
        reject("[Dialog]: The maximum number of dialogs is reached");
        return;
      }

      Dialog.showingIds.push(this.id);
      Dialog.waitingQueue.set(player, { resolve, reject, showId: this.id });

      ShowPlayerDialog(player, this.id, this.dialog);
    })
      .then((DialogRes: IDialogResRaw) => {
        const { response, listItem } = DialogRes;
        const inputText = I18n.decodeFromBuf(DialogRes.buffer, player.charset);
        return Promise.resolve({
          response,
          listItem,
          inputText,
        } as IDialogResResult);
      })
      .catch((e) => Promise.reject(e))
      .finally(() => Dialog.delDialogTask(player));
  }

  static close(player: Player) {
    Dialog.delDialogTask(player, true);
    HidePlayerDialog(player.id);
  }
}
