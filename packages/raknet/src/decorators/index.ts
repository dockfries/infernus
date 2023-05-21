import type { PacketIdList } from "raknet/enums";

export const sync = (value: PacketIdList): ClassDecorator => {
  return (target: any) => {
    Object.defineProperty(target.prototype, "_packetId", {
      configurable: false,
      enumerable: false,
      writable: false,
      value,
    });
  };
};

export const syncRead: MethodDecorator = (
  target: any,
  propertyKey: string | symbol
) => {
  const rawFunc = target[propertyKey];
  target[propertyKey] = (...args: any) => {
    target.bs.resetReadPointer();
    const packetId = target.bs.readBits(8);
    if (packetId !== target.prototype._packetId) return null;
    return rawFunc(...args);
  };
};

export const syncWrite: MethodDecorator = (
  target: any,
  propertyKey: string | symbol
) => {
  const rawFunc = target[propertyKey];
  target[propertyKey] = (...args: any) => {
    target.bs.resetWritePointer();
    target.bs.writeBits(8, target.prototype._packetId);
    rawFunc(...args);
  };
};
