import { I18n } from "../i18n";
import type { CallbackRet, PromisifyCallbackRet } from "../bus";
import { defineEvent, eventBus } from "../bus";
import { Player } from "./entity";

export type CmdBusCallback = {
  player: Player;
  subcommand: string[];
  next: () => CallbackRet;
};

export interface ICmdOptions {
  caseSensitive?: boolean;
  command: string | string[];
  run: (ret: CmdBusCallback) => PromisifyCallbackRet;
}

const strictCmdMap = new Map<
  string,
  ReturnType<typeof defineEvent<CmdBusCallback>>
>();

const noStrictCmdMap = new Map<
  string,
  ReturnType<typeof defineEvent<CmdBusCallback>>
>();

const commandPattern = /[^/\s]+/gi;

export const CommandErrors = {
  NOT_EXIST: { code: 1, msg: "command does not exist" },
  REJECTED: {
    code: 2,
    msg: "An event registered through onCommandText returned false",
  },
  PERFORMED: {
    code: 3,
    msg: "An event registered through onCommandPerformed returned false",
  },
};

export const [onCommandReceived, triggerOnReceived] = defineEvent({
  name: "OnCommandReceived",
  isNative: false,
  beforeEach(player: Player, command: string) {
    return { player, command };
  },
});

export const [onCommandPerformed, triggerOnPerformed] = defineEvent({
  name: "OnCommandPerformed",
  isNative: false,
  beforeEach(player: Player, command: string) {
    return { player, command };
  },
});

export const [onCommandError, triggerOnError] = defineEvent({
  name: "OnCommandError",
  isNative: false,
  defaultValue: false,
  beforeEach(
    player: Player,
    command: string,
    error: (typeof CommandErrors)["NOT_EXIST"],
  ) {
    return { player, command, error };
  },
});

const [onCommandText] = defineEvent({
  name: "OnPlayerCommandTextI18n",
  identifier: "iai",
  beforeEach(id: number, buffer: number[]) {
    const player = Player.getInstance(id)!;
    return { player, buffer };
  },
});

function generateCombinations(arr: any[]) {
  const result = [];
  let current = "";
  for (let i = 0; i < arr.length; i++) {
    current += arr[i] + " ";
    result.push(current.trimEnd());
  }
  return result.reverse();
}

onCommandText(({ player, buffer, next }) => {
  const rawCommand = I18n.decodeFromBuf(buffer, player.charset);

  const matchedCommand = rawCommand.match(commandPattern)!;

  const maybes = generateCombinations(matchedCommand);

  const strictMainCmd = maybes.find((maybe) => strictCmdMap.has(maybe));

  const noStrictMainCmd = maybes
    .map((maybe) => maybe.toLowerCase())
    .find((maybe) => {
      return (
        noStrictCmdMap.has(maybe) && (!strictMainCmd || maybe !== strictMainCmd)
      );
    });

  const fullCommand = matchedCommand.join(" ");

  if (!strictMainCmd && !noStrictMainCmd) {
    return triggerOnError(player, fullCommand, CommandErrors.NOT_EXIST);
  }

  const received = triggerOnReceived(player, fullCommand);
  if (!received) return received;

  const mainCmdRelations = [
    [strictMainCmd, strictCmdMap],
    [noStrictMainCmd, noStrictCmdMap],
  ] as const;

  for (const [mainCmd, cmdMap] of mainCmdRelations) {
    if (!mainCmd) continue;

    const definedCommands = cmdMap.get(mainCmd)!;

    const [, triggerCommand] = definedCommands;

    const subcommand = fullCommand.replace(mainCmd, "").trim().split(" ");

    const middlewaresRet = triggerCommand(player, subcommand);

    if (!middlewaresRet) {
      return triggerOnError(player, fullCommand, CommandErrors.REJECTED);
    }
  }

  const ret = triggerOnPerformed(player, fullCommand);
  if (!ret) return triggerOnError(player, fullCommand, CommandErrors.PERFORMED);

  return next();
});

function cmdBeforeEach(player: Player, subcommand: string[]) {
  return { player, subcommand };
}

export class CmdBus {
  static caseSensitive = false;
  private constructor() {}

  static on(
    command: ICmdOptions["command"],
    run: ICmdOptions["run"],
  ): () => void;
  static on(options: ICmdOptions): () => void;
  static on(
    commandOrOptions: ICmdOptions | ICmdOptions["command"],
    run?: ICmdOptions["run"],
  ) {
    let caseSensitive = CmdBus.caseSensitive;
    let command: ICmdOptions["command"];
    let cb: ICmdOptions["run"];

    if (
      typeof commandOrOptions === "string" ||
      commandOrOptions instanceof Array
    ) {
      command = commandOrOptions;
      cb = run!;
    } else {
      command = commandOrOptions.command;
      cb = commandOrOptions.run;
      if (typeof commandOrOptions.caseSensitive !== "undefined") {
        caseSensitive = commandOrOptions.caseSensitive;
      }
    }

    const _command = Array.isArray(command) ? command : [command];

    const invalidCmd = _command.find((cmd) => !cmd.match(commandPattern));

    if (invalidCmd) {
      console.log(`error command ${invalidCmd} format`);
      return () => {};
    }

    const whichCmdMap = caseSensitive ? strictCmdMap : noStrictCmdMap;

    const offs = _command.map((cmd) => {
      const _cmd = cmd.replaceAll("/", "");

      const whichCmd = caseSensitive ? _cmd : _cmd.toLowerCase();

      if (!whichCmdMap.has(whichCmd)) {
        let e = strictCmdMap.get(whichCmd) || noStrictCmdMap.get(whichCmd);

        if (!e) {
          e = defineEvent({
            name: whichCmd,
            isNative: false,
            beforeEach: cmdBeforeEach,
          });
        }

        whichCmdMap.set(whichCmd, e);
      }

      const [pusher] = whichCmdMap.get(whichCmd)!;
      return [whichCmd, pusher(cb)] as const;
    });

    return () => {
      offs.forEach((item) => {
        const [name, off] = item;
        const len = off();
        if (len === 0) {
          whichCmdMap.delete(name);
        }
      });
    };
  }
  static off(command: string | string[]) {
    const _command = Array.isArray(command) ? command : [command];
    _command.forEach((cmd) => {
      let _cmd = cmd.replaceAll("/", "");

      if (strictCmdMap.has(_cmd)) {
        eventBus.has(_cmd) && eventBus.delete(_cmd);
        strictCmdMap.has(_cmd) && strictCmdMap.delete(_cmd);
      }

      _cmd = _cmd.toLowerCase();

      if (noStrictCmdMap.has(_cmd)) {
        eventBus.has(_cmd) && eventBus.delete(_cmd);
        noStrictCmdMap.has(_cmd) && noStrictCmdMap.delete(_cmd);
      }
    });
  }
  static enableCaseSensitive() {
    CmdBus.caseSensitive = true;
  }
  static disableCaseSensitive() {
    CmdBus.caseSensitive = false;
  }
  static isCaseSensitive() {
    return CmdBus.caseSensitive;
  }
}
