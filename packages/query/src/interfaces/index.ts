import { RequestPacket } from "../enums";

export interface ServerInfo {
  isPassword: boolean;
  hostname: string;
  hostnameBuffer: Buffer;
  gameMode: string;
  gameModeBuffer: Buffer;
  language: string;
  languageBuffer: Buffer;
  maxPlayers: number;
  playerCount: number;
  rtt: number;
}

export interface ServerRule {
  ruleName: string;
  ruleNameBuffer: Buffer;
  ruleValue: string;
  ruleValueBuffer: Buffer;
}

export interface Client {
  playerNick: string;
  playerNickBuffer: Buffer;
  score: number;
}

export interface ClientDetail extends Client {
  playerId: number;
  ping: number;
}

export interface Options<T extends RequestPacket> {
  address: string;
  port?: number;
  opcode?: T;
  timeout?: number;
}
