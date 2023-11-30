import { I18n } from "../i18n";
import type { CallbackRet, PromisifyCallbackRet } from "../bus";
import { defineEvent, emptyMiddlewares } from "../bus";
import { Player } from "./entity";

export type CmdBusCallback = {
  player: Player;
  subcommand: string[];
  next: () => CallbackRet;
};

const commandBus = new Map<
  string,
  ReturnType<typeof defineEvent<CmdBusCallback>>
>();

const commandPattern = /[^/\s]+/gi;

export const CommandErrors = {
  NOT_EXIST: { code: 1, msg: "command does not exist" },
  REJECTED: {
    code: 2,
    msg: "An event registered through CmdBus.on returned false",
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
    error: (typeof CommandErrors)["NOT_EXIST"]
  ) {
    return { player, command, error };
  },
});

const [onCommandText] = defineEvent({
  name: "OnPlayerCommandTextI18n",
  identifier: "iai",
  beforeEach(id: number, buffer: number[]) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const matchedCommand = rawCommand.match(commandPattern)!;

  const maybes = generateCombinations(matchedCommand);

  const maybeFind = maybes.find((maybe) => commandBus.get(maybe));

  const fullCommand = matchedCommand.join(" ");

  if (!maybeFind) {
    return triggerOnError(player, fullCommand, CommandErrors.NOT_EXIST);
  }

  const received = triggerOnReceived(player, fullCommand);
  if (!received) return received;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const definedCommands = commandBus.get(maybeFind)!;

  const [, triggerCommand] = definedCommands;

  const subcommand = fullCommand.replace(maybeFind, "").trim().split(" ");

  const middlewaresRet = triggerCommand(player, subcommand);

  if (!middlewaresRet) {
    return triggerOnError(player, fullCommand, CommandErrors.REJECTED);
  }

  const ret = triggerOnPerformed(player, fullCommand);
  if (!ret) return ret;

  return next();
});

export const CmdBus = {
  on(
    command: string | string[],
    cb: (ret: CmdBusCallback) => PromisifyCallbackRet
  ) {
    const _command = Array.isArray(command) ? command : [command];

    const inValidCmd = _command.find((cmd) => !cmd.match(commandPattern));

    if (inValidCmd) {
      console.log(`error command ${inValidCmd} format`);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {};
    }

    const offs = _command.map((cmd) => {
      if (!commandBus.has(cmd)) {
        const e = defineEvent({
          name: cmd,
          isNative: false,
          beforeEach(player: Player, subcommand: string[]) {
            return { player, subcommand };
          },
        });
        commandBus.set(cmd, e);
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [run] = commandBus.get(cmd)!;
      return run(cb);
    });

    return () => {
      offs.forEach((off) => off());
    };
  },
  off(command: string | string[]) {
    const _command = Array.isArray(command) ? command : [command];
    _command.forEach((cmd) => {
      if (commandBus.has(cmd)) emptyMiddlewares(cmd);
    });
  },
};
