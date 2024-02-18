import { defineEvent } from "@infernus/core";
import { BitStream } from "raknet/bitStream";
import type { BitStreamRaw } from "raknet/types";

export const [onIncomingPacket] = defineEvent({
  name: "OnIncomingPacket",
  identifier: "iii",
  beforeEach(playerId: number, packetId: number, bs: BitStreamRaw) {
    return { playerId, packetId, bs: new BitStream(bs) };
  },
});

export const [onIncomingRPC] = defineEvent({
  name: "OnIncomingRPC",
  identifier: "iii",
  beforeEach(playerId: number, rpcId: number, bs: BitStreamRaw) {
    return { playerId, rpcId, bs: new BitStream(bs) };
  },
});

export const [onOutgoingPacket] = defineEvent({
  name: "OnOutgoingPacket",
  identifier: "iii",
  beforeEach(playerId: number, packetId: number, bs: BitStreamRaw) {
    return { playerId, packetId, bs: new BitStream(bs) };
  },
});

export const [onOutgoingRPC] = defineEvent({
  name: "OnOutgoingRPC",
  identifier: "iii",
  beforeEach(playerId: number, rpcId: number, bs: BitStreamRaw) {
    return { playerId, rpcId, bs: new BitStream(bs) };
  },
});

// syntactic sugar callback

export const IPacket = (
  eventId: number,
  func: Parameters<typeof onIncomingPacket>[0],
) => {
  return onIncomingPacket((e) => {
    if (e.packetId === eventId) return func(e);
    return e.next();
  });
};

export const IRPC = (
  eventId: number,
  func: Parameters<typeof onIncomingRPC>[0],
) => {
  return onIncomingRPC((e) => {
    if (e.rpcId === eventId) return func(e);
    return e.next();
  });
};

export const OPacket = (
  eventId: number,
  func: Parameters<typeof onOutgoingPacket>[0],
) => {
  return onOutgoingPacket((e) => {
    if (e.packetId === eventId) return func(e);
    return e.next();
  });
};

export const ORPC = (
  eventId: number,
  func: Parameters<typeof onOutgoingRPC>[0],
) => {
  return onOutgoingRPC((e) => {
    if (e.rpcId === eventId) return func(e);
    return e.next();
  });
};

export const IncomingPacket = IPacket;
export const IncomingRPC = IRPC;
export const OutgoingPacket = OPacket;
export const OutgoingRPC = ORPC;

// it is not clear how custom works
// export const ICustomRPC:%0(%1) PR_Handler<PR_INCOMING_CUSTOM_RPC,icr>:%0(%1)
// export const  IncomingCustomRPC  = ICustomRPC
