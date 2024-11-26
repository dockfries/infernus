import { Dialog, DialogStylesEnum, Player, PlayerEvent } from "@infernus/core";

export function createDialogCommands() {
  const testmsgbox = PlayerEvent.onCommandText(
    "testmsgbox",
    ({ player, next }) => {
      new Dialog({
        style: DialogStylesEnum.MSGBOX,
        caption: "Welcome",
        info: "Welcome to the SA-MP 0.3 server. This is test_cmds.pwn /testmsgbox\nHope it's useful to you.",
        button1: "OK",
        button2: "",
      }).show(player);
      return next();
    },
  );

  const testmsgbox2 = PlayerEvent.onCommandText(
    "testmsgbox2",
    ({ player, next }) => {
      new Dialog({
        style: DialogStylesEnum.MSGBOX,
        caption: "Welcome",
        info: "Welcome:\tInfo\nTest:\t\tTabulated\nLine:\t\tHello",
        button1: "OK",
        button2: "Cancel",
      }).show(player);
      return next();
    },
  );

  const testinputbox = PlayerEvent.onCommandText(
    "testinputbox",
    ({ player, next }) => {
      const loginMsg = `Welcome to the SA-MP 0.3 server.\n\n{EEEE88}Account:\t{FFFFFF}${player.getName()}\n\n{FFFFFF}Please enter your password below:`;
      new Dialog({
        style: DialogStylesEnum.INPUT,
        caption: "{EE7777}Login to SA-MP",
        info: loginMsg,
        button1: "Login",
        button2: "Cancel",
      }).show(player);
      return next();
    },
  );

  const testpassbox = PlayerEvent.onCommandText(
    "testpassbox",
    ({ player, next }) => {
      const loginMsg = `Welcome to the SA-MP 0.3 server.\n\n{EEEE88}Account:\t{FFFFFF}${player.getName()}\n\n{FFFFFF}Please enter your password below:`;
      new Dialog({
        style: DialogStylesEnum.PASSWORD,
        caption: "{EE7777}Login to SA-MP",
        info: loginMsg,
        button1: "Login",
        button2: "Cancel",
      }).show(player);
      return next();
    },
  );

  const testlistbox = PlayerEvent.onCommandText(
    "testlistbox",
    ({ player, next }) => {
      const listItems =
        "{FFFFFF}1\t{55EE55}Deagle\n{FFFFFF}2\t{55EE55}Sawnoff\n{FFFFFF}3\t{55EE55}Pistol\n{FFFFFF}4\t{55EE55}Grenade\n{FFFFFF}5\t{55EE55}Parachute\n6\t{55EE55}Lorikeet";
      new Dialog({
        style: DialogStylesEnum.LIST,
        caption: "{448844}List of weapons:",
        info: listItems,
        button1: "Select",
        button2: "Cancel",
      }).show(player);
      return next();
    },
  );

  function tabListDialogTest(player: Player) {
    const listItems = [
      "Deagle\t$5000\t100",
      "Sawnoff\t$5000\t100",
      "Pistol\t$1000\t50",
      "M4\t$10000\t100",
      "MP5\t$7500\t200",
      "Grenade\t$500\t1",
      "Parachute\t$10000\t1",
      "Lorikeet\t$50000\t500",
    ].join("\n");

    new Dialog({
      style: DialogStylesEnum.TABLIST,
      caption: "Buy Weapon",
      info: listItems,
      button1: "Select",
      button2: "Cancel",
    }).show(player);
  }

  const testtablist = PlayerEvent.onCommandText(
    "testtablist",
    ({ player, next }) => {
      tabListDialogTest(player);
      return next();
    },
  );

  function tabListHeadersDialogTest(player: Player) {
    const listItems = [
      "Weapon\tPrice\tAmmo",
      "Deagle\t$5000\t100",
      "Sawnoff\t$5000\t100",
      "Pistol\t$1000\t50",
      "M4\t$10000\t100",
      "MP5\t$7500\t200",
      "Grenade\t$500\t1",
      "Parachute\t$10000\t1",
      "Lorikeet\t$50000\t500",
    ].join("\n");

    new Dialog({
      style: DialogStylesEnum.TABLIST_HEADERS,
      caption: "Buy Weapon",
      info: listItems,
      button1: "Select",
      button2: "Cancel",
    }).show(player);
  }

  const testtablistheaders = PlayerEvent.onCommandText(
    "testtablistheaders",
    ({ player, next }) => {
      tabListHeadersDialogTest(player);
      return next();
    },
  );

  const testtablistcrash = PlayerEvent.onCommandText(
    "testtablistcrash",
    ({ player, next }) => {
      const AMMUNATION_SMGS_DIALOG =
        "Weapon\tAmount\tPrice\n{FFFFFF}MP5\t90\t{FF0000}$3500";
      new Dialog({
        style: DialogStylesEnum.TABLIST_HEADERS,
        caption: "{FFFF00}SMGs",
        info: AMMUNATION_SMGS_DIALOG,
        button1: "Select",
        button2: "Cancel",
      }).show(player);
      return next();
    },
  );

  const testclosebox = PlayerEvent.onCommandText(
    "testclosebox",
    ({ player, next }) => {
      Dialog.close(player);
      return next();
    },
  );

  const timeddlg = PlayerEvent.onCommandText("timeddlg", ({ player, next }) => {
    setTimeout(() => {
      const listItems =
        "{FFFFFF}1\t{55EE55}Deagle\n{FFFFFF}2\t{55EE55}Sawnoff\n{FFFFFF}3\t{55EE55}Pistol\n{FFFFFF}4\t{55EE55}Grenade\n{FFFFFF}5\t{55EE55}Parachute\n6\t{55EE55}Lorikeet";
      new Dialog({
        style: DialogStylesEnum.LIST,
        caption: "{448844}List of weapons:",
        info: listItems,
        button1: "Select",
        button2: "Cancel",
      }).show(player);
    }, 5000);
    return next();
  });

  return [
    testmsgbox,
    testmsgbox2,
    testinputbox,
    testpassbox,
    testlistbox,
    testtablist,
    testtablistheaders,
    testtablistcrash,
    testclosebox,
    timeddlg,
  ];
}
