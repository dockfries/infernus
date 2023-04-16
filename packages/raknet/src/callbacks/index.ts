import { packetCallback, rpcCallback } from "@/types";

// raw callback
const incomingPackets: packetCallback[] = [];
const incomingRPCs: rpcCallback[] = [];
const outgoingPackets: packetCallback[] = [];
const outgoingRPCs: rpcCallback[] = [];

samp.registerEvent("OnIncomingPacket", "iii");
samp.addEventListener(
  "OnIncomingPacket",
  (...args: [number, number, number]) => {
    return incomingPackets.every((func) => func(...args));
  }
);

samp.registerEvent("OnIncomingRPC", "iii");
samp.addEventListener("OnIncomingRPC", (...args: [number, number, number]) => {
  return incomingRPCs.every((func) => func(...args));
});

samp.registerEvent("OnOutgoingPacket", "iii");
samp.addEventListener(
  "OnOutgoingPacket",
  (...args: [number, number, number]) => {
    return outgoingPackets.every((func) => func(...args));
  }
);

samp.registerEvent("OnOutgoingRPC", "iii");
samp.addEventListener("OnOutgoingRPC", (...args: [number, number, number]) => {
  return outgoingRPCs.every((func) => func(...args));
});

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
  func: (playerId: number, bs: number) => boolean
) => {
  OnIncomingPacket((playerId, packetId, bs) => {
    if (packetId === eventId) return func(playerId, bs);
    return true;
  });
};

export const IRPC = (
  eventId: number,
  func: (playerId: number, bs: number) => boolean
) => {
  OnIncomingRPC((playerId, rpcId, bs) => {
    if (rpcId === eventId) return func(playerId, bs);
    return true;
  });
};

export const OPacket = (
  eventId: number,
  func: (playerId: number, bs: number) => boolean
) => {
  OnOutgoingPacket((playerId, packetId, bs) => {
    if (packetId === eventId) return func(playerId, bs);
    return true;
  });
};

export const ORPC = (
  eventId: number,
  func: (playerId: number, bs: number) => boolean
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
