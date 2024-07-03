// Test menu functionality filterscipt

import type { IFilterScript, Player } from "@infernus/core";
import { Menu, MenuEvent, PlayerEvent } from "@infernus/core";

let testMenu: Menu | null = null;
const testMenuStrings = ["Test1", "Test2", "Test3", "Test4", "Test5", "Test6"];

function handleTestMenuSelection(player: Player, row: number) {
  if (row < testMenuStrings.length) {
    const s = `You selected item ${testMenuStrings[row]}`;
    player.sendClientMessage(0xffffffff, s);
  }
}

function initTestMenu() {
  testMenu = new Menu("Test Menu", 1, 200.0, 150.0, 200.0, 200.0);

  testMenu.create();

  for (let x = 0; x < testMenuStrings.length; x++) {
    testMenu.addItem(0, testMenuStrings[x]);
  }
}

export const MenuTest: IFilterScript = {
  name: "menu_test",
  load() {
    initTestMenu();

    const onSelectedRow = MenuEvent.onPlayerSelectedRow(
      ({ player, row, next }) => {
        const PlayerMenu = Menu.getInstanceByPlayer(player);
        if (PlayerMenu === testMenu) {
          handleTestMenuSelection(player, row);
        }
        return next();
      },
    );

    const menuCommand = PlayerEvent.onCommandText(
      "menutest",
      ({ player, next }) => {
        testMenu?.showForPlayer(player);
        return next();
      },
    );

    return [onSelectedRow, menuCommand];
  },
  unload() {
    testMenu?.destroy();
    testMenu = null;
  },
};
