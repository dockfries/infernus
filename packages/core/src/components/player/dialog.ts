import { DialogStylesEnum } from "../../enums";
import type {
  IDialog,
  IDialogFuncQueue,
  IDialogResCommon,
} from "../../interfaces";
import { HidePlayerDialog } from "core/wrapper/native";
import { I18n } from "../../utils/i18n";
import { Player } from "./entity";
import { defineEvent } from "../../utils/bus";
import { ShowPlayerDialog } from "core/utils/helper";

export const [onDialogResponse] = defineEvent({
  name: "OnDialogResponseI18n",
  identifier: "iiiiai",
  defaultValue: false,
  beforeEach(
    id: number,
    dialogId: number,
    response: number,
    listItem: number,
    buffer: number[],
  ) {
    const player = Player.getInstance(id)!;
    const inputText = I18n.decodeFromBuf(buffer, player.charset);
    return {
      player,
      dialogId,
      response,
      listItem,
      buffer,
      inputText,
    };
  },
});

onDialogResponse(
  ({ next, player, dialogId, response, listItem, buffer, inputText }) => {
    const callback = Dialog.waitingQueue.get(player);
    if (!callback) return next();
    if (callback.showId !== dialogId) return next();
    callback.resolve({ response, listItem, buffer, inputText });
    return next();
  },
);

/**
 * You don't need to care about the dialog id.
 * If you need to change the value dynamically, you should do it by setter method.
 */
export class Dialog {
  private _id = -1;
  private static showingIds: number[] = [];
  private static maxDialogId = 32767;
  private dialog: IDialog;
  static waitingQueue = new WeakMap<Player, IDialogFuncQueue>();

  constructor(
    dialog: IDialog = {
      style: DialogStylesEnum.MSGBOX,
      caption: "",
      info: "",
      button1: "",
      button2: "",
    },
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
    // if player disconnects and still await response
    // should stop promise waiting
    const task = Dialog.waitingQueue.get(player);
    if (!task) return false;
    if (reject) {
      task.reject(
        "[Dialog]: player timeout does not respond or second request show dialog",
      );
    }
    Dialog.waitingQueue.delete(player);
    const index = Dialog.showingIds.indexOf(task.showId);
    if (index > -1) Dialog.showingIds.splice(index, 1);
    return true;
  }

  show(player: Player) {
    return new Promise<IDialogResCommon>((resolve, reject) => {
      Dialog.close(player);

      while (this._id === -1 || Dialog.showingIds.includes(this._id)) {
        if (Dialog.showingIds.length >= Dialog.maxDialogId) {
          this._id = -1;
          break;
        }
        this._id = Math.floor(Math.random() * (Dialog.maxDialogId + 1));
      }

      if (this._id === -1) {
        reject("[Dialog]: Unable to create dialog");
        return;
      }

      Dialog.showingIds.push(this._id);
      Dialog.waitingQueue.set(player, { resolve, reject, showId: this._id });

      Dialog.__inject__ShowPlayerDialog(player, this._id, this.dialog);
    })
      .catch((e) => Promise.reject(e))
      .finally(() => Dialog.delDialogTask(player));
  }

  static close(player: Player) {
    Dialog.delDialogTask(player, true);
    HidePlayerDialog(player.id);
  }

  static __inject__ShowPlayerDialog = ShowPlayerDialog;
}
