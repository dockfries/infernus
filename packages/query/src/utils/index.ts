import { REQUEST_HEADER_LEN } from "../constants";
import { RequestPacket } from "../enums";
import { QueryException } from "../exceptions";
import {
  Client,
  ClientDetail,
  Options,
  ServerInfo,
  ServerRule,
} from "../interfaces";
import { detectAndDecode } from "./helper";

function isValidIPv4(ip: string): boolean {
  const ipv4Regex = /^(?:(\d{1,3})\.){3}(\d{1,3})$/;
  if (!ipv4Regex.test(ip)) return false;

  return ip.split(".").every((part) => {
    const num = Number(part);
    return num >= 0 && num <= 255 && String(num) === part;
  });
}

export function makePacket<T extends RequestPacket>(
  options: Options<T>,
): Buffer {
  if (!isValidIPv4(options.address)) {
    throw new QueryException("Invalid ip address");
  }

  const packet = Buffer.alloc(REQUEST_HEADER_LEN);

  packet.write("SAMP", 0);

  const ipBytes = options.address.split(".").map(Number);

  packet.writeUInt8(ipBytes[0], 4);
  packet.writeUInt8(ipBytes[1], 5);
  packet.writeUInt8(ipBytes[2], 6);
  packet.writeUInt8(ipBytes[3], 7);

  packet.writeUint16LE(options.port || 7777, 8);

  packet.writeUInt8(options.opcode || RequestPacket.INFORMATION, 10);
  return packet;
}

export async function parseResponse(
  response: Buffer,
  requestType: RequestPacket = RequestPacket.INFORMATION,
  rtt: number,
) {
  let reader = REQUEST_HEADER_LEN;

  switch (requestType) {
    case RequestPacket.INFORMATION: {
      const info: ServerInfo = {
        isPassword: false,
        hostname: "",
        hostnameBuffer: Buffer.alloc(0),
        gameMode: "",
        gameModeBuffer: Buffer.alloc(0),
        language: "",
        languageBuffer: Buffer.alloc(0),
        maxPlayers: 0,
        playerCount: 0,
        rtt,
      };

      info.isPassword = !!response.readUInt8(reader);
      reader += 1;

      info.playerCount = response.readUint16LE(reader);
      reader += 2;

      info.maxPlayers = response.readUInt16LE(reader);
      reader += 2;

      const hostnameLen = response.readUint32LE(reader);
      reader += 4;

      info.hostnameBuffer = response.subarray(reader, reader + hostnameLen);
      info.hostname = (await detectAndDecode(info.hostnameBuffer))[0];
      reader += hostnameLen;

      const gameModeLen = response.readUint32LE(reader);
      reader += 4;

      info.gameModeBuffer = response.subarray(reader, reader + gameModeLen);
      info.gameMode = (await detectAndDecode(info.gameModeBuffer))[0];
      reader += gameModeLen;

      const languageLen = response.readUint32LE(reader);
      reader += 4;

      info.languageBuffer = response.subarray(reader, reader + languageLen);
      info.language = (await detectAndDecode(info.languageBuffer))[0];
      reader += languageLen;
      return info;
    }
    case RequestPacket.RULES: {
      const ruleCount = response.readUInt16LE(reader);
      reader += 2;

      const rules: ServerRule[] = [];

      for (let i = 0; i < ruleCount; i++) {
        const ruleNameLen = response.readUInt8(reader);
        reader += 1;

        const ruleNameBuffer = response.subarray(reader, reader + ruleNameLen);
        const ruleName = (await detectAndDecode(ruleNameBuffer))[0];
        reader += ruleNameLen;

        const ruleValueLen = response.readUInt8(reader);
        reader += 1;

        const ruleValueBuffer = response.subarray(
          reader,
          reader + ruleValueLen,
        );
        const ruleValue = (await detectAndDecode(ruleValueBuffer))[0];
        reader += ruleValueLen;

        rules.push({ ruleName, ruleNameBuffer, ruleValue, ruleValueBuffer });
      }
      return rules;
    }
    case RequestPacket.CLIENT_LIST: {
      const playerCount = response.readUInt16LE(reader);
      reader += 2;

      const players: Client[] = [];

      for (let i = 0; i < playerCount; i++) {
        const nickLen = response.readUInt8(reader);
        reader += 1;

        const playerNickBuffer = response.subarray(reader, reader + nickLen);
        const playerNick = (await detectAndDecode(playerNickBuffer))[0];
        reader += nickLen;

        const score = response.readUInt32LE(reader);
        reader += 4;

        players.push({ playerNick, playerNickBuffer, score });
      }
      return players;
    }
    case RequestPacket.DETAILED: {
      const playerCount = response.readUInt16LE(reader);
      reader += 2;

      const players: ClientDetail[] = [];

      for (let i = 0; i < playerCount; i++) {
        const playerId = response.readUInt8(reader);
        reader += 1;

        const nickLen = response.readUInt8(reader);
        reader += 1;

        const playerNickBuffer = response.subarray(reader, reader + nickLen);
        const playerNick = (await detectAndDecode(playerNickBuffer))[0];
        reader += nickLen;

        const score = response.readUInt32LE(reader);
        reader += 4;

        const ping = response.readUInt32LE(reader);
        reader += 4;

        players.push({ playerId, playerNick, playerNickBuffer, score, ping });
      }
      return players;
    }
  }
}
