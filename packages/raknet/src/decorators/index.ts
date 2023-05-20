import type { PacketIdList } from "@/enums";

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
  target[propertyKey] = (...args: any) => {
    target.bs.resetReadPointer();
    const packetId = target.bs.readBits(8);
    if (packetId !== target.prototype._packetId) return null;
    return target[propertyKey](...args);
  };
};

export const syncWrite: MethodDecorator = (
  target: any,
  propertyKey: string | symbol
) => {
  target[propertyKey] = (...args: any) => {
    target.bs.resetWritePointer();
    target.bs.writeBits(8, target.prototype._packetId);
    target[propertyKey](...args);
  };
};
