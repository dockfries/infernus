import { ObjectMp } from "./entity";
import { GameMode } from "core/components/gamemode";
import { defineEvent } from "core/utils/bus";
import { Player } from "core/components/player/entity";
import { objectMpPool, playerObjectPool } from "core/utils/pools";
import { EditResponseTypesEnum, SelectObjectTypesEnum } from "core/enums";

GameMode.onExit(({ next }) => {
  ObjectMp.getInstances().forEach((o) => o.destroy());
  ObjectMp.getPlayersInstances()
    .map(([, o]) => o)
    .flat()
    .forEach((o) => o.destroy());
  objectMpPool.clear();
  playerObjectPool.clear();
  return next();
});

const [onPlayerSelect] = defineEvent({
  name: "OnPlayerSelectObject",
  identifier: "iiiifff",
  defaultValue: false,
  beforeEach(
    playerId: number,
    type: SelectObjectTypesEnum,
    objectId: number,
    modelId: number,
    fX: number,
    fY: number,
    fZ: number,
  ) {
    const player = Player.getInstance(playerId)!;
    const isPlayerObject =
      type !== SelectObjectTypesEnum.UNKNOWN &&
      type === SelectObjectTypesEnum.PLAYER_OBJECT;
    const isGlobal =
      type !== SelectObjectTypesEnum.UNKNOWN &&
      type === SelectObjectTypesEnum.GLOBAL_OBJECT;
    return {
      player,
      type,
      isPlayerObject,
      isGlobal,
      objectMp:
        type === SelectObjectTypesEnum.GLOBAL_OBJECT
          ? ObjectMp.getInstance(objectId)!
          : ObjectMp.getInstance(objectId, player)!,
      modelId,
      fX,
      fY,
      fZ,
    };
  },
});

const [onPlayerEdit] = defineEvent({
  name: "OnPlayerEditObject",
  identifier: "iiiiffffff",
  defaultValue: false,
  beforeEach(
    playerId: number,
    playerObject: number,
    objectId: number,
    response: EditResponseTypesEnum,
    fX: number,
    fY: number,
    fZ: number,
    fRotX: number,
    fRotY: number,
    fRotZ: number,
  ) {
    const player = Player.getInstance(playerId)!;
    const isPlayerObject = playerObject === 1;
    const isGlobal = !isPlayerObject;
    return {
      player,
      isPlayerObject,
      isGlobal,
      objectMp: isPlayerObject
        ? ObjectMp.getInstance(objectId, player)!
        : ObjectMp.getInstance(objectId)!,
      response,
      fX,
      fY,
      fZ,
      fRotX,
      fRotY,
      fRotZ,
    };
  },
});

const [onPlayerEditAttached] = defineEvent({
  name: "OnPlayerEditAttachedObject",
  identifier: "iiiiifffffffff",
  defaultValue: false,
  beforeEach(
    pid: number,
    response: number,
    index: number,
    modelId: number,
    boneId: number,
    fOffsetX: number,
    fOffsetY: number,
    fOffsetZ: number,
    fRotX: number,
    fRotY: number,
    fRotZ: number,
    fScaleX: number,
    fScaleY: number,
    fScaleZ: number,
  ) {
    return {
      player: Player.getInstance(pid)!,
      response,
      index,
      modelId,
      boneId,
      fOffsetX,
      fOffsetY,
      fOffsetZ,
      fRotX,
      fRotY,
      fRotZ,
      fScaleX,
      fScaleY,
      fScaleZ,
    };
  },
});

const [onGlobalMoved] = defineEvent({
  name: "OnObjectMoved",
  identifier: "i",
  beforeEach(objectId) {
    return {
      objectMp: ObjectMp.getInstance(objectId)!,
    };
  },
});

const [onPlayerMoved] = defineEvent({
  name: "OnPlayerObjectMoved",
  identifier: "ii",
  beforeEach(playerId: number, objectId: number) {
    const player = Player.getInstance(playerId)!;
    return {
      player,
      playerObject: ObjectMp.getInstance(objectId, player)!,
    };
  },
});

export const ObjectMpEvent = Object.freeze({
  onPlayerSelect,
  onPlayerEdit,
  onPlayerEditAttached,
  onGlobalMoved,
  onPlayerMoved,
});
