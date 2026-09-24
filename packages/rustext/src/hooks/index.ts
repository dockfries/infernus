import { BitStream, ORPC, PacketRpcValueType, RPCIdList } from "@infernus/raknet";
import { Russifier } from "../natives/russifier";
import { Converter } from "../natives/converter";

function writeTextBytes(bs: BitStream, data: number[]): number {
  if (data.length === 0) return 0;

  return samp.callNative("BS_WriteValue", "ir[ia]", bs.id, PacketRpcValueType.String, data);
}

function writeFixedBytes(bs: BitStream, bytes: readonly number[]): number {
  if (bytes.length === 0) return 0;

  return bs.writeValue(...bytes.map((b) => [PacketRpcValueType.UInt8, b] as const));
}

function readRawBytes(bs: BitStream, size: number): number[] {
  if (size <= 0) return [];

  const items: [PacketRpcValueType.UInt8][] = [];
  for (let i = 0; i < size; i++) items.push([PacketRpcValueType.UInt8]);

  const result = bs.readValue(...(items as any)) as number[];
  return result.slice(0, -1);
}

function readTextBytes(bs: BitStream, textLen: number): number[] | null {
  if (textLen < 0) return null;
  if (textLen * 8 > bs.getNumberOfUnreadBits().bits) return null;

  return readRawBytes(bs, textLen);
}

ORPC(RPCIdList.ShowGameText, ({ bs, playerId, next }) => {
  if (playerId === -1 || !Russifier.isEnabledForPlayer(playerId)) {
    return next();
  }

  const { offset: readOffset } = bs.getReadOffset();
  const { offset: writeOffset } = bs.getWriteOffset();

  try {
    bs.setReadOffset(32 + 32);
    const [textLen] = bs.readUint32();
    const text = readTextBytes(bs, textLen);
    if (text === null) return next();

    const processedText = Converter.process(text, Russifier.getPlayerType(playerId));

    bs.setWriteOffset(32 + 32 + 32);
    writeTextBytes(bs, processedText);
  } finally {
    bs.setReadOffset(readOffset);
    bs.setWriteOffset(writeOffset);
  }

  return next();
});

ORPC(RPCIdList.InitMenu, ({ bs, playerId, next }) => {
  if (playerId === -1 || !Russifier.isEnabledForPlayer(playerId)) {
    return next();
  }

  const { offset: readOffset } = bs.getReadOffset();
  const { offset: writeOffset } = bs.getWriteOffset();

  const MAX_MENU_TEXT_SIZE = 32;
  const MAX_ITEMS = 12;

  try {
    bs.setReadOffset(8);

    const [isTwoColumns] = bs.readUint32();

    if (isTwoColumns > 1) return next();

    const title = readRawBytes(bs, MAX_MENU_TEXT_SIZE);

    let offsetToHeader = 8 + 32 + MAX_MENU_TEXT_SIZE * 8 + 32 + 32 + 32;
    if (isTwoColumns) {
      offsetToHeader += 32;
    }
    offsetToHeader += 32 + MAX_ITEMS * 32;
    bs.setReadOffset(offsetToHeader);

    const headers: [number[], number[]] = [[], []];
    const itemsCount: [number, number] = [0, 0];
    const items: [number[], number[]][] = Array.from({ length: MAX_ITEMS }, () => [[], []]);

    headers[0] = readRawBytes(bs, MAX_MENU_TEXT_SIZE);
    const [itemsCount0] = bs.readUint8();
    itemsCount[0] = itemsCount0;

    if (itemsCount[0] > MAX_ITEMS) return next();

    for (let i = 0; i < itemsCount[0]; i++) {
      items[i][0] = readRawBytes(bs, MAX_MENU_TEXT_SIZE);
    }

    if (isTwoColumns) {
      headers[1] = readRawBytes(bs, MAX_MENU_TEXT_SIZE);
      const [itemsCount1] = bs.readUint8();
      itemsCount[1] = itemsCount1;

      if (itemsCount[1] > MAX_ITEMS) return next();

      for (let i = 0; i < itemsCount[1]; i++) {
        items[i][1] = readRawBytes(bs, MAX_MENU_TEXT_SIZE);
      }
    }

    const playerRussifierType = Russifier.getPlayerType(playerId);

    const processedTitle = Converter.process(title, playerRussifierType);

    for (let i = 0; i < isTwoColumns + 1; i++) {
      headers[i] = Converter.process(headers[i], playerRussifierType);

      for (let j = 0; j < itemsCount[i]; j++) {
        items[j][i] = Converter.process(items[j][i], playerRussifierType);
      }
    }

    bs.setWriteOffset(8 + 32);
    writeFixedBytes(bs, processedTitle);

    bs.setWriteOffset(offsetToHeader);
    writeFixedBytes(bs, headers[0]);
    bs.writeUint8(itemsCount[0]);

    for (let i = 0; i < itemsCount[0]; i++) {
      writeFixedBytes(bs, items[i][0]);
    }

    if (isTwoColumns) {
      writeFixedBytes(bs, headers[1]);
      bs.writeUint8(itemsCount[1]);

      for (let i = 0; i < itemsCount[1]; i++) {
        writeFixedBytes(bs, items[i][1]);
      }
    }
  } finally {
    bs.setReadOffset(readOffset);
    bs.setWriteOffset(writeOffset);
  }

  return next();
});

ORPC(RPCIdList.ShowTextDraw, ({ bs, playerId, next }) => {
  if (playerId === -1 || !Russifier.isEnabledForPlayer(playerId)) {
    return next();
  }

  const { offset: readOffset } = bs.getReadOffset();
  const { offset: writeOffset } = bs.getWriteOffset();

  const offsetToText = 16 + 63 * 8;

  try {
    bs.setReadOffset(offsetToText);

    const [textLen] = bs.readUint16();
    const text = readTextBytes(bs, textLen);
    if (text === null) return next();

    const processedText = Converter.process(text, Russifier.getPlayerType(playerId));

    bs.setWriteOffset(offsetToText + 16);
    writeTextBytes(bs, processedText);
  } finally {
    bs.setReadOffset(readOffset);
    bs.setWriteOffset(writeOffset);
  }

  return next();
});

ORPC(RPCIdList.TextDrawSetString, ({ bs, playerId, next }) => {
  if (playerId === -1 || !Russifier.isEnabledForPlayer(playerId)) {
    return next();
  }

  const { offset: readOffset } = bs.getReadOffset();
  const { offset: writeOffset } = bs.getWriteOffset();

  const offsetToText = 16;

  try {
    bs.setReadOffset(offsetToText);

    const [textLen] = bs.readUint16();
    const text = readTextBytes(bs, textLen);
    if (text === null) return next();

    const processedText = Converter.process(text, Russifier.getPlayerType(playerId));

    bs.setWriteOffset(offsetToText + 16);
    writeTextBytes(bs, processedText);
  } finally {
    bs.setReadOffset(readOffset);
    bs.setWriteOffset(writeOffset);
  }

  return next();
});

export {};
