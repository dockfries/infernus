import { DialogStylesEnum } from "@/enums";
import { OnDialogResponse, ShowPlayerDialog } from "@/utils/helperUtils";
import { HidePlayerDialog } from "omp-wrapper";
import { BasePlayer } from "../player/basePlayer";
import { I18n } from "../i18n";
import {
  IDialog,
  IDialogFuncQueue,
  IDialogResRaw,
  IDialogResResult,
} from "@/interfaces";

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
    const callback = BaseDialog.waitingQueue.get(playerid);
    if (!callback) return 0;
    // bug: does not trigger resolve of promise
    // fix: it only works if you put it in an event loop
    setTimeout(() => callback.resolve({ response, listitem, inputbuf }));
    return 1;
  }
);

export class BaseDialog<T extends BasePlayer> {
  private id: number;
  private static CREATED_ID = -1;
  private static MAX_DIALOGID = 32767;
  private dialog: IDialog;
  public static waitingQueue: Map<number, IDialogFuncQueue> = new Map();

  constructor(
    dialog: IDialog = {
      style: DialogStylesEnum.MSGBOX,
      caption: "",
      info: "",
      button1: "",
      button2: "",
    }
  ) {
    if (BaseDialog.CREATED_ID < BaseDialog.MAX_DIALOGID) {
      BaseDialog.CREATED_ID++;
    } else {
      console.log("[Dialog]: The maximum number of dialogs is reached");
    }
    this.dialog = dialog;
    this.id = BaseDialog.CREATED_ID;
  }

  // #region
  public get style(): DialogStylesEnum | undefined {
    return this.dialog.style;
  }
  public set style(v: DialogStylesEnum | undefined) {
    this.dialog.style = v;
  }

  public get caption(): string | undefined {
    return this.dialog.caption;
  }
  public set caption(v: string | undefined) {
    this.dialog.caption = v;
  }

  public get info(): string | undefined {
    return this.dialog.info;
  }
  public set info(v: string | undefined) {
    this.dialog.info = v;
  }

  public get button1(): string | undefined {
    return this.dialog.button1;
  }
  public set button1(v: string | undefined) {
    this.dialog.button1 = v;
  }

  public get button2(): string | undefined {
    return this.dialog.button2;
  }
  public set button2(v: string | undefined) {
    this.dialog.button2 = v;
  }

  //#endregion

  private static delDialogRecord<T extends BasePlayer>(
    player: T,
    reject = false
  ): boolean {
    if (reject) {
      // if player disconnect and still await response
      // should stop promise waiting
      BaseDialog.waitingQueue.get(player.id)?.reject("forceclose");
    }
    if (BaseDialog.waitingQueue.has(player.id)) {
      BaseDialog.waitingQueue.delete(player.id);
      return true;
    }
    return false;
  }

  public show(player: T): Promise<IDialogResResult> {
    return new Promise((resolve, reject) => {
      const p = new Promise<IDialogResRaw>((dialogResolve, dialogReject) => {
        BaseDialog.waitingQueue.set(player.id, {
          resolve: dialogResolve,
          reject: dialogReject,
        });
        ShowPlayerDialog(player, this.id, this.dialog);
      });
      p.then(
        (DialogRes: IDialogResRaw) => {
          const { response, listitem } = DialogRes;
          const inputtext = I18n.decodeFromBuf(
            DialogRes.inputbuf,
            player.charset
          );
          resolve({ response, listitem, inputtext });
        },
        (reason: string) => reject(reason)
      ).finally(() => {
        BaseDialog.delDialogRecord(player);
      });
    });
  }

  public static close<T extends BasePlayer>(player: T) {
    BaseDialog.delDialogRecord(player, true);
    HidePlayerDialog(player.id);
  }
}
