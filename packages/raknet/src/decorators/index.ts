import type { PacketIdList } from "raknet/enums";

export const syncId = (value: PacketIdList): ClassDecorator => {
  return (target: any) => {
    Object.defineProperty(target.prototype, "_packetId", {
      configurable: false,
      enumerable: false,
      writable: false,
      value,
    });
  };
};

export const syncReader: MethodDecorator = (
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

export const syncWriter: MethodDecorator = (
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
