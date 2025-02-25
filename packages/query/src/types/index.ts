import { RequestPacket } from "../enums";
import { Client, ClientDetail, ServerInfo, ServerRule } from "../interfaces";

export type ResponseTypeMap = {
  [RequestPacket.INFORMATION]: ServerInfo;
  [RequestPacket.RULES]: ServerRule[];
  [RequestPacket.CLIENT_LIST]: Client[];
  [RequestPacket.DETAILED]: ClientDetail[];
};
