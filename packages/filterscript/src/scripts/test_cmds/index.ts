//
//  SA-MP 0.3+ commands for internal testing.
//  These were left in the distribution in case
//  anyone found the snippets useful for their
//  own scripts.
//  Don't load this script on a public server
//  as it could break your existing scripts.
//  Kye 2009-2015
//

// pvars, testformat are removed.

import { IFilterScript } from "@infernus/core";
import { createCallbacks } from "./callbacks";
import { createActorCommands } from "./commands/actor";
import { createDialogCommands } from "./commands/dialog";
import { createLabelCommands } from "./commands/label";
import { createMapIconCommands } from "./commands/mapicon";
import { createObjectCommands } from "./commands/object";
import { createPlayerCommands } from "./commands/player";
import { createTextDrawCommands } from "./commands/textdraw";
import { createVehCommands } from "./commands/vehicle";

export const TestCmds: IFilterScript = {
  name: "test_cmds",
  load() {
    const offCallbacks = createCallbacks();
    const offActorCommands = createActorCommands();
    const offDialogCommands = createDialogCommands();
    const offLabelCommands = createLabelCommands();
    const offMapIconsCommands = createMapIconCommands();
    const offObjectCommands = createObjectCommands();
    const offPlayerCommands = createPlayerCommands();
    const offTextDrawCommands = createTextDrawCommands();
    const offVehCommands = createVehCommands();
    return [
      ...offCallbacks,
      ...offActorCommands,
      ...offDialogCommands,
      ...offLabelCommands,
      ...offMapIconsCommands,
      ...offObjectCommands,
      ...offPlayerCommands,
      ...offTextDrawCommands,
      ...offVehCommands,
    ];
  },
  unload() {},
};
