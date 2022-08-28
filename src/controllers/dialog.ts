import { OnDialogResponse, ShowPlayerDialog } from "@/utils/helper";
import { HidePlayerDialog } from "omp-wrapper";
import { BasePlayer } from "./player";
// import { $t } from "./i18n";

interface IDialog {
  style?: OmpNode.Enum.DialogStyles;
  caption?: string;
  info?: string;
  button1?: string;
  button2?: string;
}

type DialogResponse = {
  response: number;
  listitem: number;
  inputtext: string;
};

/* You don't need to define the dialog id, 
  but you need to pay attention to the fact that you shouldn't repeatedly new the dialog in the function, 
  instead you should call the open method.
  
  If you need to change the value dynamically, you should do it by setter method
*/

OnDialogResponse(
  (
    player: BasePlayer,
    response: number,
    listitem: number,
    inputtext: string
  ) => {
    const callback = BaseDialog.waitingQueue.get(player.id);
    if (!callback) return;
    // bug: does not trigger resolve of promise
    // fix: it only works if you put it in an event loop
    setTimeout(() => callback({ response, listitem, inputtext }));
  }
);

class BaseDialog {
  private id: number;
  private static CREATED_ID: number = -1;
  private static MAX_DIALOGID: number = 32767;
  private dialog: IDialog;
  public static waitingQueue: Map<Number, Function> = new Map();

  constructor(
    dialog: IDialog = {
      style: OmpNode.Enum.DialogStyles.MSGBOX,
      caption: "",
      info: "",
      button1: "",
      button2: "",
    }
  ) {
    if (BaseDialog.CREATED_ID < BaseDialog.MAX_DIALOGID) {
      BaseDialog.CREATED_ID++;
    } else {
      console.log($t("error.dialogLimited"));
    }
    this.dialog = dialog;
    this.id = BaseDialog.CREATED_ID;
  }

  // #region
  public get style(): OmpNode.Enum.DialogStyles | undefined {
    return this.dialog.style;
  }
  public set style(v: OmpNode.Enum.DialogStyles | undefined) {
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

  private static delDialogRecord(player: BasePlayer): boolean {
    if (BaseDialog.waitingQueue.has(player.id)) {
      BaseDialog.waitingQueue.delete(player.id);
      return true;
    }
    return false;
  }

  public show(player: BasePlayer): Promise<DialogResponse> {
    const p = new Promise<DialogResponse>((resolve) => {
      BaseDialog.waitingQueue.set(player.id, resolve);
      ShowPlayerDialog(player, this.id, this.dialog);
    });
    p.then(() => BaseDialog.delDialogRecord(player));
    return p;
  }

  public static close(player: BasePlayer) {
    BaseDialog.delDialogRecord(player);
    HidePlayerDialog(player.id);
  }
}

export default BaseDialog;
export type { IDialog, DialogResponse };
