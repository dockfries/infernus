import type { BitStream } from "raknet/bitStream";
import type { PacketIdList } from "raknet/enums";

export const SyncId = (value: PacketIdList): ClassDecorator => {
  return (target: any) => {
    Object.defineProperty(target.prototype, "_packetId", {
      configurable: false,
      enumerable: false,
      writable: false,
      value,
    });
  };
};

export const SyncReader: MethodDecorator = (
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  const originalMethod = descriptor.value;

  descriptor.value = function (
    this: { bs: BitStream; _packetId: number },
    ...args: unknown[]
  ) {
    const bs: BitStream = this.bs;

    bs.resetReadPointer();
    const packetId = bs.readBits(8);

    if (packetId !== this._packetId) return null;

    return originalMethod.apply(this, args);
  };
};

export const SyncWriter: MethodDecorator = (
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  const originalMethod = descriptor.value;

  descriptor.value = function (
    this: { bs: BitStream; _packetId: number },
    ...args: unknown[]
  ) {
    const bs: BitStream = this.bs;

    bs.resetWritePointer();
    bs.writeBits(this._packetId, 8);

    originalMethod.apply(this, args);
  };
};
