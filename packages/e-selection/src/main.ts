import {
  TextDraw,
  Player,
  PlayerEvent,
  TextDrawAlignEnum,
  TextDrawFontsEnum,
  TextDrawEvent,
  InvalidEnum,
} from "@infernus/core";

const playerMenus = new Map<Player, ModelSelectionMenu>();
const modelSelectionTask = new Map<
  Player,
  {
    resolve: (response: IModelData | null) => any;
    reject: (reason: number) => any;
  }
>();

export interface IModelData {
  modelId: number;
  modelText?: string;
  rotX?: number;
  rotY?: number;
  rotZ?: number;
  zoom?: number;
  vehColor?: [number, number];
}

export interface IModelOptions {
  player: Player;
  models: IModelData[];
  headerText?: string;
  maxItemPerPage?: number;
  bannerColor?: number | string;
  menuBgColor?: number | string;
  menuTextColor?: number | string;
  itemBgColor?: number | string;
  itemTextColor?: number | string;
  coolDownMs?: number;
}

interface IInternalModelProps {
  rightArrow: TextDraw | null;
  leftArrow: TextDraw | null;
  backgroundTd: TextDraw | null;
  topBanner: TextDraw | null;
  bottomBanner: TextDraw | null;
  closeButton: TextDraw | null;
  itemsTd: TextDraw[];
  currentPage: number;
  coolDownTick: number;
  pageCount: number;
  models: IModelData[];
  maxItemPerPage: number;
  coolDownMs: number;
  destroy: (cancelSel?: boolean) => void;
}

const internalPropsKey = Symbol("modelProps");

export class ModelSelectionMenu {
  [internalPropsKey]: IInternalModelProps = {
    rightArrow: null,
    leftArrow: null,
    backgroundTd: null,
    topBanner: null,
    bottomBanner: null,
    closeButton: null,
    itemsTd: [],
    currentPage: 1,
    coolDownTick: 0,
    coolDownMs: 0,
    maxItemPerPage: 0,
    models: [],
    pageCount: 0,
    destroy: (cancelSel = false) => {
      const destroyIfValid = (td: TextDraw | null) => {
        if (td && td.isValid()) {
          td.destroy();
        }
      };

      destroyIfValid(this[internalPropsKey].rightArrow);
      destroyIfValid(this[internalPropsKey].leftArrow);
      destroyIfValid(this[internalPropsKey].backgroundTd);
      destroyIfValid(this[internalPropsKey].topBanner);
      destroyIfValid(this[internalPropsKey].bottomBanner);
      destroyIfValid(this[internalPropsKey].closeButton);
      destroyIfValid(this.headerTd);
      destroyIfValid(this.pageNumber);

      this[internalPropsKey].itemsTd.forEach(destroyIfValid);
      this.itemsTextTd.forEach(destroyIfValid);
      this[internalPropsKey].itemsTd = [];
      this.itemsTextTd = [];

      if (playerMenus.has(this.player)) {
        playerMenus.delete(this.player);
      }

      if (modelSelectionTask.has(this.player))
        modelSelectionTask.delete(this.player);

      if (!cancelSel) {
        this.player.cancelSelectTextDraw();
      }
    },
  };

  private headerTd: TextDraw | null = null;
  private itemsTextTd: TextDraw[];

  private pageNumber: TextDraw | null = null;
  private readonly player: Player;
  private readonly headerText: string;
  private readonly menuBgColor: number | string;
  private readonly bannerColor: number | string;
  private readonly menuTextColor: number | string;
  private readonly itemBgColor: number | string;
  private readonly itemTextColor: number | string;

  constructor(options: IModelOptions) {
    this.player = options.player;

    this[internalPropsKey].models = options.models;
    this[internalPropsKey].maxItemPerPage = options.maxItemPerPage || 18;
    this[internalPropsKey].coolDownMs = options.coolDownMs || 600;

    this.headerText = options.headerText || "header";

    this.menuBgColor = options.menuBgColor || 0x000000dd;
    this.bannerColor = options.bannerColor || 0x808080ff;
    this.menuTextColor = options.menuTextColor || 0xc0c0c0ff;
    this.itemBgColor = options.itemBgColor || 0xd3d3d344;
    this.itemTextColor = options.itemTextColor || 0xd3d3d3aa;

    this[internalPropsKey].currentPage = 1;
    this[internalPropsKey].pageCount = Math.ceil(
      this[internalPropsKey].models.length /
        this[internalPropsKey].maxItemPerPage,
    );
    this[internalPropsKey].coolDownTick = Date.now();
    this[internalPropsKey].itemsTd = [];
    this.itemsTextTd = [];
  }

  private createBackground(): TextDraw {
    return new TextDraw({
      x: 531.333374,
      y: 140.877777,
      text: "_",
      player: this.player,
    })
      .create()
      .setBackgroundColors(0)
      .setAlignment(TextDrawAlignEnum.LEFT)
      .setFont(TextDrawFontsEnum.BANK)
      .setLetterSize(0.0, 22.912965)
      .setColor(0)
      .setOutline(0)
      .setProportional(true)
      .setShadow(0)
      .useBox(true)
      .setBoxColors(this.menuBgColor)
      .setTextSize(121.333328, 0.0)
      .setSelectable(false);
  }

  private createRightArrow(): TextDraw {
    return new TextDraw({
      x: 521.333374,
      y: 339.318542,
      text: "LD_BEAT:right",
      player: this.player,
    })
      .create()
      .setLetterSize(0.0, 0.0)
      .setTextSize(5.999938, 7.051818)
      .setAlignment(TextDrawAlignEnum.LEFT)
      .setColor(-1)
      .setShadow(0)
      .setOutline(0)
      .setFont(TextDrawFontsEnum.SPRITE)
      .setSelectable(true);
  }

  private createLeftArrow(): TextDraw {
    return new TextDraw({
      x: 507.000305,
      y: 339.074066,
      text: "LD_BEAT:left",
      player: this.player,
    })
      .create()
      .setLetterSize(0.0, 0.0)
      .setTextSize(5.999938, 7.051818)
      .setAlignment(TextDrawAlignEnum.LEFT)
      .setColor(-1)
      .setShadow(0)
      .setOutline(0)
      .setFont(TextDrawFontsEnum.SPRITE)
      .setSelectable(true);
  }

  private createTopBanner(): TextDraw {
    return new TextDraw({
      x: 531.000244,
      y: 155.811111,
      text: "TopBanner",
      player: this.player,
    })
      .create()
      .setLetterSize(0.0, -0.44712)
      .setTextSize(121.333328, 0.0)
      .setAlignment(TextDrawAlignEnum.LEFT)
      .setColor(0)
      .useBox(true)
      .setBoxColors(this.bannerColor)
      .setShadow(0)
      .setOutline(0)
      .setFont(TextDrawFontsEnum.BANK);
  }

  private createBottomBanner(): TextDraw {
    return new TextDraw({
      x: 531.333618,
      y: 338.500305,
      text: "BottomBanner",
      player: this.player,
    })
      .create()
      .setLetterSize(0.0, -0.44712)
      .setTextSize(120.666656, 0.0)
      .setAlignment(TextDrawAlignEnum.LEFT)
      .setColor(0)
      .useBox(true)
      .setBoxColors(this.bannerColor)
      .setShadow(0)
      .setOutline(0)
      .setFont(TextDrawFontsEnum.BANK);
  }

  private createCloseButton(): TextDraw {
    return new TextDraw({
      x: 490.666809,
      y: 337.829711,
      text: "CLOSE",
      player: this.player,
    })
      .create()
      .setLetterSize(0.128333, 0.957036)
      .setTextSize(10.5021, 10.0187)
      .setAlignment(TextDrawAlignEnum.CENTER)
      .setColor(this.menuTextColor)
      .setShadow(0)
      .setOutline(0)
      .setBackgroundColors(0x00000033)
      .setFont(TextDrawFontsEnum.SPACEAGE)
      .setProportional(true)
      .setSelectable(true);
  }

  private createPageNumber(): TextDraw {
    return new TextDraw({
      x: 523.333251,
      y: 139.792648,
      text: "0/1",
      player: this.player,
    })
      .create()
      .setLetterSize(0.190666, 1.110518)
      .setAlignment(TextDrawAlignEnum.RIGHT)
      .setColor(this.menuTextColor)
      .setShadow(0)
      .setOutline(1)
      .setBackgroundColors(0x00000033)
      .setFont(TextDrawFontsEnum.SPACEAGE)
      .setProportional(true);
  }

  private createHeaderText(): TextDraw {
    return new TextDraw({
      x: 128.333312,
      y: 139.377761,
      text: this.headerText,
      player: this.player,
    })
      .create()
      .setLetterSize(0.315, 1.247407)
      .setAlignment(TextDrawAlignEnum.LEFT)
      .setColor(this.menuTextColor)
      .setShadow(0)
      .setOutline(1)
      .setBackgroundColors(0x00000033)
      .setFont(TextDrawFontsEnum.SPACEAGE)
      .setProportional(true);
  }

  private createMenuItems() {
    let x = 78.0;
    let y = 162.0;
    for (let i = 0; i < this[internalPropsKey].maxItemPerPage; i++) {
      if (i > 0 && i % 6 === 0) {
        x = 140.0;
        y += 55.0;
      } else {
        x += 62.0;
      }

      this[internalPropsKey].itemsTd[i] = new TextDraw({
        player: this.player,
        x,
        y,
        text: "_",
      })
        .create()
        .setBackgroundColors(this.itemBgColor)
        .setFont(TextDrawFontsEnum.PREVIEW)
        .setLetterSize(1.43, 5.7)
        .setColor(-1)
        .setOutline(1)
        .setProportional(true)
        .useBox(true)
        .setBoxColors(0)
        .setTextSize(61.0, 54.0)
        .setSelectable(true);

      this.itemsTextTd[i] = new TextDraw({
        player: this.player,
        x: x + 31,
        y,
        text: "_",
      })
        .create()
        .setFont(TextDrawFontsEnum.SPACEAGE)
        .setLetterSize(0.199999, 0.6)
        .setAlignment(TextDrawAlignEnum.CENTER)
        .setOutline(0)
        .setProportional(true)
        .setTextSize(0.0, 62.0)
        .setShadow(0)
        .setColor(this.itemTextColor);
    }
  }

  show() {
    return new Promise<IModelData | null>((resolve, reject) => {
      const task = modelSelectionTask.get(this.player);
      if (task) {
        task.reject(1);
      }

      if (!this.player.isConnected()) {
        reject("[ModelSelectionMenu]: player not connected");
        return;
      }

      this[internalPropsKey].backgroundTd = this.createBackground();
      this[internalPropsKey].rightArrow = this.createRightArrow();
      this[internalPropsKey].leftArrow = this.createLeftArrow();
      this[internalPropsKey].topBanner = this.createTopBanner();
      this[internalPropsKey].bottomBanner = this.createBottomBanner();
      this[internalPropsKey].closeButton = this.createCloseButton();
      this.pageNumber = this.createPageNumber();
      this.headerTd = this.createHeaderText();
      this.createMenuItems();

      for (let i = 0; i < this[internalPropsKey].models.length; i++) {
        if (i >= this[internalPropsKey].maxItemPerPage) break;
        this.setModelBox(i, this[internalPropsKey].models[i]);
      }

      const page = `1/${this[internalPropsKey].pageCount}}`;
      this.pageNumber.setString(page).show();
      this.headerTd.show();

      this[internalPropsKey].rightArrow.show();
      this[internalPropsKey].leftArrow.show();
      this[internalPropsKey].backgroundTd.show();
      this[internalPropsKey].topBanner.show();
      this[internalPropsKey].bottomBanner.show();
      this[internalPropsKey].closeButton.show();

      this.player.selectTextDraw(-1);

      modelSelectionTask.set(this.player, {
        resolve: (response) => {
          this[internalPropsKey].destroy();
          setTimeout(() => {
            resolve(response);
          }, 0);
        },
        reject: (reason) => {
          const reasonText =
            reason === 0
              ? "[ModelSelectionMenu]: player disconnected"
              : "[ModelSelectionMenu]: player second request show";
          this[internalPropsKey].destroy(reason === 1);
          setTimeout(() => {
            reject(reasonText);
          }, 0);
        },
      });
      playerMenus.set(this.player, this);
    });
  }

  private setModelBox(index: number, model: IModelData) {
    const td = this[internalPropsKey].itemsTd[index];
    const tdText = this.itemsTextTd[index];

    td.setPreviewModel(model.modelId);
    td.setPreviewRot(
      model.rotX || 0,
      model.rotY || 0,
      model.rotZ || 0,
      model.zoom,
    );

    if (model.vehColor) {
      td.setPreviewVehColors(model.vehColor[0], model.vehColor[1]);
    }

    if (model.modelText) {
      tdText.setString(model.modelText);
      tdText.show();
    }

    td.show();
  }

  setPage(page: number) {
    if (page < 1 || page > this[internalPropsKey].pageCount) return false;

    const start = this[internalPropsKey].maxItemPerPage * (page - 1);

    this[internalPropsKey].itemsTd.forEach((t) => t.hide());
    this.itemsTextTd.forEach((t) => t.hide());

    for (let i = 0; i < this[internalPropsKey].maxItemPerPage; i++) {
      if (start + i >= this[internalPropsKey].models.length) break;
      this.setModelBox(i, this[internalPropsKey].models[start + i]);
    }

    this[internalPropsKey].currentPage = page;

    const pageText = `${page}/${this[internalPropsKey].pageCount}`;
    this.pageNumber!.setString(pageText).show();
    return true;
  }
}

PlayerEvent.onDisconnect(({ player, next }) => {
  if (!playerMenus.has(player)) return next();
  const task = modelSelectionTask.get(player)!;
  task.reject(0);
  return next();
});

TextDrawEvent.onPlayerClickGlobal(({ player, textDraw, next }) => {
  if (!playerMenus.has(player)) return next();

  if (textDraw === InvalidEnum.TEXT_DRAW) {
    const task = modelSelectionTask.get(player);
    if (task) {
      task.resolve(null);
    }
  }

  return next();
});

TextDrawEvent.onPlayerClickPlayer(
  ({ player, textDraw, defaultValue, next }) => {
    if (!playerMenus.has(player)) return next();

    const modelSelection = playerMenus.get(player)!;

    if (
      Date.now() - modelSelection[internalPropsKey].coolDownTick <=
      modelSelection[internalPropsKey].coolDownMs
    )
      return next();

    modelSelection[internalPropsKey].coolDownTick =
      Date.now() + modelSelection[internalPropsKey].coolDownMs;

    const task = modelSelectionTask.get(player)!;

    if (textDraw === InvalidEnum.TEXT_DRAW) {
      task.resolve(null);
      return next();
    }

    if (textDraw === modelSelection[internalPropsKey].closeButton) {
      task.resolve(null);
      return defaultValue;
    }

    if (textDraw === modelSelection[internalPropsKey].rightArrow) {
      if (
        modelSelection[internalPropsKey].currentPage ===
        modelSelection[internalPropsKey].pageCount
      )
        return defaultValue;
      modelSelection.setPage(modelSelection[internalPropsKey].currentPage + 1);
      return defaultValue;
    }

    if (textDraw === modelSelection[internalPropsKey].leftArrow) {
      if (modelSelection[internalPropsKey].currentPage <= 1)
        return defaultValue;
      modelSelection.setPage(modelSelection[internalPropsKey].currentPage - 1);
      return defaultValue;
    }

    let index = 0;
    for (const item of modelSelection[internalPropsKey].itemsTd) {
      if (item === textDraw) {
        const start =
          modelSelection[internalPropsKey].maxItemPerPage *
          (modelSelection[internalPropsKey].currentPage - 1);
        task.resolve(modelSelection[internalPropsKey].models[start + index]);
        return defaultValue;
      }
      index++;
    }

    return next();
  },
);
