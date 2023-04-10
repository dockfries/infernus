// - It's not clear if registering multiple callbacks at the same time and then having one false followed by the next true will still execute (whether it's the same eventId i.e. packetId or rpcId)

// If they affect each other, a copy of the global array will be saved, and then the callback will be called in a loop. If one of them returns false, the return will be executed.
// Otherwise return true when the loop is complete, maybe?

// raw callback
export const OnIncomingPacket = (
  func: (playerId: number, packetId: number, bs: number) => boolean
) => {
  return samp.addEventListener("OnIncomingPacket", func);
};

export const OnIncomingRPC = (
  func: (playerId: number, rpcId: number, bs: number) => boolean
) => {
  return samp.addEventListener("OnIncomingRPC", func);
};

export const OnOutgoingPacket = (
  func: (playerId: number, packetId: number, bs: number) => boolean
) => {
  return samp.addEventListener("OnOutgoingPacket", func);
};

export const OnOutgoingRPC = (
  func: (playerId: number, rpcId: number, bs: number) => boolean
) => {
  return samp.addEventListener("OnOutgoingRPC", func);
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
