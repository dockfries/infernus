import { BitStream } from "@/bitStream";
import type { BitStreamRaw, packetCallback, rpcCallback } from "@/types";

// raw callback
const incomingPackets: packetCallback[] = [];
const incomingRPCs: rpcCallback[] = [];
const outgoingPackets: packetCallback[] = [];
const outgoingRPCs: rpcCallback[] = [];

samp.registerEvent("OnIncomingPacket", "iii");
samp.addEventListener(
  "OnIncomingPacket",
  (playerid: number, packetid: number, bs: BitStreamRaw) => {
    return incomingPackets.every((func) =>
      func(playerid, packetid, new BitStream(bs))
    );
  }
);

samp.registerEvent("OnIncomingRPC", "iii");
samp.addEventListener(
  "OnIncomingRPC",
  (playerid: number, rpcid: number, bs: BitStreamRaw) => {
    return incomingRPCs.every((func) =>
      func(playerid, rpcid, new BitStream(bs))
    );
  }
);

samp.registerEvent("OnOutgoingPacket", "iii");
samp.addEventListener(
  "OnOutgoingPacket",
  (playerid: number, packetid: number, bs: BitStreamRaw) => {
    return outgoingPackets.every((func) =>
      func(playerid, packetid, new BitStream(bs))
    );
  }
);

samp.registerEvent("OnOutgoingRPC", "iii");
samp.addEventListener(
  "OnOutgoingRPC",
  (playerid: number, rpcid: number, bs: BitStreamRaw) => {
    return outgoingRPCs.every((func) =>
      func(playerid, rpcid, new BitStream(bs))
    );
  }
);

export const OnIncomingPacket = (func: packetCallback) => {
  incomingPackets.push(func);
};

export const OnIncomingRPC = (func: rpcCallback) => {
  incomingRPCs.push(func);
};

export const OnOutgoingPacket = (func: packetCallback) => {
  outgoingPackets.push(func);
};

export const OnOutgoingRPC = (func: rpcCallback) => {
  outgoingRPCs.push(func);
};

// syntactic sugar callback

export const IPacket = (
  eventId: number,
  func: (playerId: number, bs: BitStream) => boolean
) => {
  OnIncomingPacket((playerId, packetId, bs) => {
    if (packetId === eventId) return func(playerId, bs);
    return true;
  });
};

export const IRPC = (
  eventId: number,
  func: (playerId: number, bs: BitStream) => boolean
) => {
  OnIncomingRPC((playerId, rpcId, bs) => {
    if (rpcId === eventId) return func(playerId, bs);
    return true;
  });
};

export const OPacket = (
  eventId: number,
  func: (playerId: number, bs: BitStream) => boolean
) => {
  OnOutgoingPacket((playerId, packetId, bs) => {
    if (packetId === eventId) return func(playerId, bs);
    return true;
  });
};

export const ORPC = (
  eventId: number,
  func: (playerId: number, bs: BitStream) => boolean
) => {
  OnOutgoingRPC((playerId, rpcId, bs) => {
    if (rpcId === eventId) return func(playerId, bs);
    return true;
  });
};

export const IncomingPacket = IPacket;
export const IncomingRPC = IRPC;
export const OutgoingPacket = OPacket;
export const OutgoingRPC = ORPC;

// it is not clear how custom works
// export const ICustomRPC:%0(%1) PR_Handler<PR_INCOMING_CUSTOM_RPC,icr>:%0(%1)
// export const  IncomingCustomRPC  = ICustomRPC
