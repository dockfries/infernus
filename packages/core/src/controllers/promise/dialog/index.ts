import { DialogStylesEnum } from "@/enums";
import { OnDialogResponse, ShowPlayerDialog } from "@/utils/helperUtils";
import { HidePlayerDialog } from "@infernus/wrapper";
import type { Player } from "../../player/basePlayer";
import { I18n } from "../../i18n";
import type {
  IDialog,
  IDialogFuncQueue,
  IDialogResRaw,
  IDialogResResult,
} from "@/interfaces";
import { logger } from "@/logger";

/* You don't need to define the dialog id, 
  but you need to pay attention to the fact that you shouldn't repeatedly new the dialog in the function, 
  instead you should call the open method.
  
  If you need to change the value dynamically, you should do it by setter method
*/

OnDialogResponse(
  (
    playerid: number,
    dialogid: number,
    response: number,
    listitem: number,
    inputbuf: number[]
  ): number => {
    const callback = Dialog.waitingQueue.get(playerid);
    if (!callback) return 0;
    // bug: does not trigger resolve of promise
    // fix: it only works if you put it in an event loop
    setTimeout(() => callback.resolve({ response, listitem, inputbuf }));
    return 1;
  }
);

export class Dialog<T extends Player> {
  private id: number;
  private static CREATED_ID = -1;
  private static MAX_DIALOGID = 32767;
  private dialog: IDialog;
  static waitingQueue: Map<number, IDialogFuncQueue> = new Map();

  constructor(
    dialog: IDialog = {
      style: DialogStylesEnum.MSGBOX,
      caption: "",
      info: "",
      button1: "",
      button2: "",
    }
  ) {
    if (Dialog.CREATED_ID < Dialog.MAX_DIALOGID) {
      Dialog.CREATED_ID++;
    } else {
      logger.warn("[Dialog]: The maximum number of dialogs is reached");
    }
    this.dialog = dialog;
    this.id = Dialog.CREATED_ID;
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

  private static delDialogTask<T extends Player>(
    player: T,
    reject = false
  ): boolean {
    // if player disconnect and still await response
    // should stop promise waiting
    const task = Dialog.waitingQueue.get(player.id);
    if (!task) return false;
    if (reject)
      task.reject(
        "[Dialog]: player timeout does not respond or second request show dialog"
      );
    Dialog.waitingQueue.delete(player.id);
    return true;
  }

  show(player: T) {
    return new Promise<IDialogResRaw>((resolve, reject) => {
      Dialog.close(player);
      Dialog.waitingQueue.set(player.id, { resolve, reject });
      ShowPlayerDialog(player, this.id, this.dialog);
    })
      .then((DialogRes: IDialogResRaw) => {
        const { response, listitem } = DialogRes;
        const inputtext = I18n.decodeFromBuf(
          DialogRes.inputbuf,
          player.charset
        );
        return Promise.resolve({
          response,
          listitem,
          inputtext,
        } as IDialogResResult);
      })
      .catch((e) => Promise.reject(e))
      .finally(() => Dialog.delDialogTask(player));
  }

  static close<T extends Player>(player: T) {
    Dialog.delDialogTask(player, true);
    HidePlayerDialog(player.id);
  }
}
