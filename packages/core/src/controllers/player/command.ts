import { distance, closest } from "fastest-levenshtein";
import { I18n } from "../i18n";
import type { CallbackRet, PromisifyCallbackRet } from "../bus";
import { defineEvent, eventBus } from "../bus";
import { Player } from "./entity";

export interface CmdBusCallback {
  player: Player;
  mainCommand: string;
  subcommand: string[];
  cmdText: string;
  buffer: number[];
  isStrict: boolean;
  next: () => CallbackRet;
}

export type CommandErrorTypes =
  | "NOT_EXIST"
  | "REJECTED"
  | "PERFORMED"
  | "RECEIVED_THROW"
  | "RECEIVED_REJECTED";

export interface CommandErrorRet {
  code: number;
  msg: string;
  error?: any;
}

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

export const CommandErrors: Record<CommandErrorTypes, CommandErrorRet> = {
  NOT_EXIST: { code: 1, msg: "command does not exist" },
  REJECTED: {
    code: 2,
    msg: "An event registered through onCommandText returned false",
  },
  PERFORMED: {
    code: 3,
    msg: "An event registered through onCommandPerformed returned false",
  },
  RECEIVED_THROW: {
    code: 4,
    msg: "An event registered through onCommandReceived throw an error",
  },
  RECEIVED_REJECTED: {
    code: 5,
    msg: "An event registered through onCommandReceived returned false",
  },
};

export const [onCommandReceived, triggerOnReceived] = defineEvent({
  name: "OnCommandReceived",
  isNative: false,
  throwOnError: true,
  beforeEach(
    player: Player,
    command: CmdBusCallback["cmdText"],
    cmdText: CmdBusCallback["cmdText"],
    buffer: CmdBusCallback["buffer"],
    strictMainCmd: CmdBusCallback["mainCommand"],
    noStrictMainCmd: CmdBusCallback["mainCommand"],
    hasStrict: boolean,
    hasNoStrict: boolean,
    subcommand: CmdBusCallback["subcommand"],
  ) {
    return {
      player,
      command,
      cmdText,
      buffer,
      strictMainCmd,
      noStrictMainCmd,
      hasStrict,
      hasNoStrict,
      subcommand,
    };
  },
});

export const [onCommandPerformed, triggerOnPerformed] = defineEvent({
  name: "OnCommandPerformed",
  isNative: false,
  beforeEach(
    player: Player,
    command: CmdBusCallback["cmdText"],
    cmdText: CmdBusCallback["cmdText"],
    buffer: CmdBusCallback["buffer"],
    strictMainCmd: CmdBusCallback["mainCommand"],
    noStrictMainCmd: CmdBusCallback["mainCommand"],
    hasStrict: boolean,
    hasNoStrict: boolean,
    subcommand: CmdBusCallback["subcommand"],
  ) {
    return {
      player,
      command,
      cmdText,
      buffer,
      strictMainCmd,
      noStrictMainCmd,
      hasStrict,
      hasNoStrict,
      subcommand,
    };
  },
});

export const [onCommandError, triggerOnError] = defineEvent({
  name: "OnCommandError",
  isNative: false,
  defaultValue: false,
  beforeEach(
    player: Player,
    error: CommandErrorRet,
    command: CmdBusCallback["cmdText"],
    cmdText: CmdBusCallback["cmdText"],
    buffer: CmdBusCallback["buffer"],
    strictMainCmd: CmdBusCallback["mainCommand"],
    noStrictMainCmd: CmdBusCallback["mainCommand"],
    hasStrict: boolean,
    hasNoStrict: boolean,
    subcommand: CmdBusCallback["subcommand"],
  ) {
    return {
      player,
      error,
      command,
      cmdText,
      buffer,
      strictMainCmd,
      noStrictMainCmd,
      hasStrict,
      hasNoStrict,
      subcommand,
      getSuggestion() {
        const suggestion = closest(cmdText, [
          ...strictCmdMap.keys(),
          ...noStrictCmdMap.keys(),
        ]);
        const _distance = distance(cmdText, suggestion);
        return { suggestion, distance: _distance };
      },
    };
  },
});

const [onCommandText] = defineEvent({
  name: "OnPlayerCommandTextI18n",
  identifier: "iai",
  beforeEach(id: number, buffer: number[]) {
    const player = Player.getInstance(id)!;
    const cmdText = I18n.decodeFromBuf(buffer, player.charset);
    return { player, buffer, cmdText };
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

onCommandText(({ player, buffer, cmdText, next }) => {
  const matchedCommand = cmdText.match(commandPattern)!;

  const maybes = generateCombinations(matchedCommand);

  const strictMainCmd = maybes.find((maybe) => strictCmdMap.has(maybe));

  const noStrictMainCmd = maybes
    .map((maybe) => maybe.toLowerCase())
    .find((maybe) => noStrictCmdMap.has(maybe));

  const hasStrict = !!strictMainCmd;
  const hasNoStrict = !!noStrictMainCmd;

  const fullCommand = matchedCommand.join(" ");

  let subcommand: CmdBusCallback["subcommand"] = [];

  const mainCmdRelations = [
    [strictMainCmd, strictCmdMap, true],
    [noStrictMainCmd, noStrictCmdMap, false],
  ] as const;

  const triggerParams = [
    fullCommand,
    cmdText,
    buffer,
    strictMainCmd,
    noStrictMainCmd,
    hasStrict,
    hasNoStrict,
    subcommand,
  ] as const;

  if (hasStrict || hasNoStrict) {
    const mainCmd = mainCmdRelations[0][0] || mainCmdRelations[1][0];
    subcommand = fullCommand.replace(mainCmd!, "").trim().split(" ");
  } else {
    return triggerOnError(player, CommandErrors.NOT_EXIST, ...triggerParams);
  }

  try {
    const received = triggerOnReceived(player, ...triggerParams);
    if (!received)
      return triggerOnError(
        player,
        CommandErrors.RECEIVED_REJECTED,
        ...triggerParams,
      );
  } catch (err) {
    const spreadErr = typeof err === "object" ? err : { error: err };
    return triggerOnError(
      player,
      {
        ...CommandErrors.RECEIVED_THROW,
        ...spreadErr,
      },
      ...triggerParams,
    );
  }

  for (const [mainCmd, cmdMap, isStrict] of mainCmdRelations) {
    if (!mainCmd) continue;

    const definedCommands = cmdMap.get(mainCmd)!;

    const [, triggerCommand] = definedCommands;

    const middlewaresRet = triggerCommand(
      player,
      mainCmd,
      subcommand,
      cmdText,
      buffer,
      isStrict,
    );

    if (!middlewaresRet) {
      return triggerOnError(player, CommandErrors.REJECTED, ...triggerParams);
    }
  }

  const ret = triggerOnPerformed(
    player,
    fullCommand,
    cmdText,
    buffer,
    strictMainCmd,
    noStrictMainCmd,
    hasStrict,
    hasNoStrict,
    subcommand,
  );
  if (!ret)
    return triggerOnError(player, CommandErrors.PERFORMED, ...triggerParams);

  return next();
});

function cmdBeforeEach(
  player: CmdBusCallback["player"],
  mainCommand: CmdBusCallback["mainCommand"],
  subcommand: CmdBusCallback["subcommand"],
  cmdText: CmdBusCallback["cmdText"],
  buffer: CmdBusCallback["buffer"],
  isStrict: CmdBusCallback["isStrict"],
): Omit<CmdBusCallback, "next"> {
  return { player, mainCommand, subcommand, cmdText, buffer, isStrict };
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
        const e = defineEvent({
          name: caseSensitive ? "$" + whichCmd : whichCmd,
          isNative: false,
          beforeEach: cmdBeforeEach,
        });

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
        if (eventBus.has(_cmd)) eventBus.delete(_cmd);
        if (strictCmdMap.has(_cmd)) strictCmdMap.delete(_cmd);
      }

      _cmd = _cmd.toLowerCase();

      if (noStrictCmdMap.has(_cmd)) {
        if (eventBus.has(_cmd)) eventBus.delete(_cmd);
        if (noStrictCmdMap.has(_cmd)) noStrictCmdMap.delete(_cmd);
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
