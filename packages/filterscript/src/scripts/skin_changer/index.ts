//
// Admin player skin changer using previews. For SA-MP 0.3x and above.
// - Kye 2012
//

import type { IFilterScript, Player } from "@infernus/core";
import {
  InvalidEnum,
  PlayerEvent,
  TextDraw,
  TextDrawEvent,
  TextDrawFontsEnum,
} from "@infernus/core";
import * as constants from "./constants";

const gTotalItems = constants.TOTAL_ITEMS;
const gCurrentPageTextDraw = new Map<Player, TextDraw>();
const gHeaderTextDraw = new Map<Player, TextDraw>();
const gBackgroundTextDraw = new Map<Player, TextDraw>();
const gNextButtonTextDraw = new Map<Player, TextDraw>();
const gPrevButtonTextDraw = new Map<Player, TextDraw>();
const gSelectionItems = new Map<Player, TextDraw[]>();
const gSelectionItemsTag = new Map<Player, number[]>();
const skinChangePage = new Map<Player, number>();
const skinChangeActive = new Set<Player>();

function getNumberOfPages() {
  if (
    gTotalItems >= constants.SELECTION_ITEMS &&
    gTotalItems % constants.SELECTION_ITEMS === 0
  ) {
    return Math.floor(gTotalItems / constants.SELECTION_ITEMS);
  } else return Math.floor(gTotalItems / constants.SELECTION_ITEMS + 1);
}

function createCurrentPageTextDraw(player: Player, x: number, y: number) {
  const txtInit = new TextDraw({ player, x, y, text: "0/0" });
  txtInit.create();
  txtInit
    .useBox(false)
    .setLetterSize(0.4, 1.1)
    .setFont(1)
    .setShadow(0)
    .setOutline(1)
    .setColor(0xaccbf1ff)
    .show();
  return txtInit;
}

// Creates a button textdraw and returns the textdraw.

function createPlayerDialogButton(
  player: Player,
  x: number,
  y: number,
  width: number,
  height: number,
  text: string,
) {
  const txtInit = new TextDraw({ player, x, y, text });
  txtInit.create();
  txtInit
    .useBox(true)
    .setBoxColors(0x000000ff)
    .setBackgroundColors(0x000000ff)
    .setLetterSize(0.4, 1.1);
  txtInit.setFont(1).setShadow(0); // no shadow
  txtInit
    .setOutline(0)
    .setColor(0x4a5a6bff)
    .setSelectable(true)
    .setAlignment(2);
  txtInit.setTextSize(height, width); // The width and height are reversed for centering.. something the game does <g>
  txtInit.show();
  return txtInit;
}

function createPlayerHeaderTextDraw(
  player: Player,
  x: number,
  y: number,
  text: string,
) {
  const txtInit = new TextDraw({ player, x, y, text });
  txtInit.create();
  txtInit
    .useBox(false)
    .setLetterSize(1.25, 3.0)
    .setFont(0)
    .setShadow(0)
    .setOutline(1)
    .setColor(0xaccbf1ff);
  txtInit.show();
  return txtInit;
}

function createPlayerBackgroundTextDraw(
  player: Player,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const txtBackground = new TextDraw({
    player,
    x,
    y,
    text: `                                            ~n~`,
  }); // enough space for everyone
  txtBackground.create();
  txtBackground
    .useBox(true)
    .setBoxColors(0x4a5a6bbb)
    .setLetterSize(5.0, 5.0)
    .setFont(0)
    .setShadow(0);
  txtBackground
    .setOutline(0)
    .setColor(0x000000ff)
    .setTextSize(width, height)
    .setBackgroundColors(0x4a5a6bbb);
  txtBackground.show();
  return txtBackground;
}

// Creates a model preview sprite

function createModelPreviewTextDraw(
  player: Player,
  modelIndex: number,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const txtPlayerSprite = new TextDraw({ player, x, y, text: "" }); // it has to be set with SetText later
  txtPlayerSprite.create();
  txtPlayerSprite
    .setFont(TextDrawFontsEnum.MODEL_PREVIEW)
    .setColor(0xffffffff)
    .setBackgroundColors(0x88888899);
  txtPlayerSprite.setTextSize(width, height); // Text size is the Width:Height
  txtPlayerSprite.setPreviewModel(modelIndex).setSelectable(true);
  txtPlayerSprite.show();
  return txtPlayerSprite;
}

function destroyPlayerModelPreviews(player: Player) {
  const items = gSelectionItems.get(player);
  if (!items) return;
  items.forEach((item) => item.isValid() && item.destroy());
  gSelectionItems.delete(player);
}

function showPlayerModelPreviews(player: Player) {
  let x = 0;
  let baseX: number = constants.DIALOG_BASE_X;
  let baseY: number = constants.DIALOG_BASE_Y - constants.SPRITE_DIM_Y * 0.33; // down a bit
  let lineTracker = 0;

  let itemAt = (skinChangePage.get(player) || 0) * constants.SELECTION_ITEMS;

  // Destroy any previous ones created
  destroyPlayerModelPreviews(player);

  const gSelectionItemsArr: TextDraw[] = [];
  const gSelectionItemsTagArr: number[] = [];

  while (x !== constants.SELECTION_ITEMS && itemAt < gTotalItems) {
    if (lineTracker === 0) {
      baseX = constants.DIALOG_BASE_X + 25.0; // in a bit from the box
      baseY += constants.SPRITE_DIM_Y + 1.0; // move on the Y for the next line
    }

    gSelectionItemsArr[x] = createModelPreviewTextDraw(
      player,
      constants.gItemList[itemAt],
      baseX,
      baseY,
      constants.SPRITE_DIM_X,
      constants.SPRITE_DIM_Y,
    );
    gSelectionItemsTagArr[x] = constants.gItemList[itemAt];
    baseX += constants.SPRITE_DIM_X + 1.0; // move on the X for the next sprite
    lineTracker++;
    if (lineTracker === constants.ITEMS_PER_LINE) lineTracker = 0;
    itemAt++;
    x++;
  }
  gSelectionItems.set(player, gSelectionItemsArr);
  gSelectionItemsTag.set(player, gSelectionItemsTagArr);
}

function updatePageTextDraw(player: Player) {
  const currentPage = (skinChangePage.get(player) || 0) + 1;
  const pageText = `${currentPage}/${getNumberOfPages()}`;
  const textDraw = gCurrentPageTextDraw.get(player);
  textDraw!.setString(pageText);
}

function createSelectionMenu(player: Player) {
  gBackgroundTextDraw.set(
    player,
    createPlayerBackgroundTextDraw(
      player,
      constants.DIALOG_BASE_X,
      constants.DIALOG_BASE_Y + 20.0,
      constants.DIALOG_WIDTH,
      constants.DIALOG_HEIGHT,
    ),
  );
  gHeaderTextDraw.set(
    player,
    createPlayerHeaderTextDraw(
      player,
      constants.DIALOG_BASE_X,
      constants.DIALOG_BASE_Y,
      constants.HEADER_TEXT,
    ),
  );
  gCurrentPageTextDraw.set(
    player,
    createCurrentPageTextDraw(
      player,
      constants.DIALOG_WIDTH - 30.0,
      constants.DIALOG_BASE_Y + 15.0,
    ),
  );
  gNextButtonTextDraw.set(
    player,
    createPlayerDialogButton(
      player,
      constants.DIALOG_WIDTH - 30.0,
      constants.DIALOG_BASE_Y + constants.DIALOG_HEIGHT + 100.0,
      50.0,
      16.0,
      constants.NEXT_TEXT,
    ),
  );
  gPrevButtonTextDraw.set(
    player,
    createPlayerDialogButton(
      player,
      constants.DIALOG_WIDTH - 90.0,
      constants.DIALOG_BASE_Y + constants.DIALOG_HEIGHT + 100.0,
      50.0,
      16.0,
      constants.PREV_TEXT,
    ),
  );
  showPlayerModelPreviews(player);
  updatePageTextDraw(player);
}

function destroySelectionMenu(player: Player) {
  destroyPlayerModelPreviews(player);

  const headerTextDraw = gHeaderTextDraw.get(player);
  const backgroundTextDraw = gBackgroundTextDraw.get(player);
  const currentPageTextDraw = gCurrentPageTextDraw.get(player);
  const nextButtonTextDraw = gNextButtonTextDraw.get(player);
  const prevButtonTextDraw = gPrevButtonTextDraw.get(player);

  [
    headerTextDraw,
    backgroundTextDraw,
    currentPageTextDraw,
    nextButtonTextDraw,
    prevButtonTextDraw,
  ].forEach((draw) => {
    if (draw?.isValid()) draw.destroy();
  });

  gHeaderTextDraw.delete(player);
  gBackgroundTextDraw.delete(player);
  gCurrentPageTextDraw.delete(player);
  gNextButtonTextDraw.delete(player);
  gPrevButtonTextDraw.delete(player);
}

function handlePlayerItemSelection(player: Player, selectedItem: number) {
  // In this case we change the player's skin
  const tag = gSelectionItemsTag.get(player);
  if (tag && tag[selectedItem] >= 0 && tag[selectedItem] < 319) {
    player.setSkin(tag[selectedItem]);
    return;
  }
}

export const SkinChanger: IFilterScript = {
  name: "skin_changer",
  load() {
    // Even though only Player* textdraws are used in this script,
    // OnPlayerClickTextDraw is still required to handle ESC
    const onPlayerClickGlobal = TextDrawEvent.onPlayerClickGlobal(
      ({ player, textDraw, next }) => {
        if (!skinChangeActive.has(player)) return next();

        // Handle: They cancelled (with ESC)
        if (textDraw === InvalidEnum.TEXT_DRAW) {
          destroySelectionMenu(player);
          skinChangeActive.delete(player);
          player.playSound(1085, 0.0, 0.0, 0.0);
          return next();
        }
      },
    );

    const onPlayerClickPlayer = TextDrawEvent.onPlayerClickPlayer(
      ({ player, textDraw, next }) => {
        if (!skinChangeActive.has(player)) return next();

        const curPage = skinChangePage.get(player) || 0;

        // Handle: next button
        if (textDraw === gNextButtonTextDraw.get(player)) {
          if (curPage < getNumberOfPages() - 1) {
            skinChangePage.set(player, curPage + 1);
            showPlayerModelPreviews(player);
            updatePageTextDraw(player);
            player.playSound(1083, 0.0, 0.0, 0.0);
          } else {
            player.playSound(1085, 0.0, 0.0, 0.0);
          }
          return next();
        }

        // Handle: previous button
        if (textDraw === gPrevButtonTextDraw.get(player)) {
          if (curPage > 0) {
            skinChangePage.set(player, curPage - 1);
            showPlayerModelPreviews(player);
            updatePageTextDraw(player);
            player.playSound(1084, 0.0, 0.0, 0.0);
          } else {
            player.playSound(1085, 0.0, 0.0, 0.0);
          }
          return next();
        }

        // Search in the array of textdraws used for the items

        skinChangeActive.delete(player);

        const items = gSelectionItems.get(player);

        let x = 0;
        while (items && x !== constants.SELECTION_ITEMS) {
          if (textDraw === items[x]) {
            handlePlayerItemSelection(player, x);
            player.playSound(1083, 0.0, 0.0, 0.0);
            destroySelectionMenu(player);
            player.cancelSelectTextDraw();
            return next();
          }
          x++;
        }

        return next();
      },
    );

    const skinChange = PlayerEvent.onCommandText(
      "skinchange",
      ({ player, next }) => {
        if (!player.isAdmin()) return false;
        // If there was a previously created selection menu, destroy it
        destroySelectionMenu(player);

        skinChangeActive.add(player);
        // skinChangePage.set(player, 0); // will reset the page back to the first

        createSelectionMenu(player);
        player.selectTextDraw(0xaccbf1ff);
        return next();
      },
    );

    console.log("\n--Admin Player Skin Changer Loaded\n");

    return [onPlayerClickGlobal, onPlayerClickPlayer, skinChange];
  },
  unload() {
    [...gCurrentPageTextDraw.values()].forEach(
      (t) => t.isValid() && t.destroy(),
    );
    [...gHeaderTextDraw.values()].forEach((t) => t.isValid() && t.destroy());
    [...gBackgroundTextDraw.values()].forEach(
      (t) => t.isValid() && t.destroy(),
    );
    [...gNextButtonTextDraw.values()].forEach(
      (t) => t.isValid() && t.destroy(),
    );
    [...gPrevButtonTextDraw.values()].forEach(
      (t) => t.isValid() && t.destroy(),
    );
    [...gSelectionItems.values()]
      .flat()
      .forEach((t) => t.isValid() && t.destroy());

    gCurrentPageTextDraw.clear();
    gHeaderTextDraw.clear();
    gBackgroundTextDraw.clear();
    gNextButtonTextDraw.clear();
    gPrevButtonTextDraw.clear();
    gSelectionItems.clear();
    gSelectionItemsTag.clear();
    skinChangePage.clear();
    skinChangeActive.clear();
  },
};
