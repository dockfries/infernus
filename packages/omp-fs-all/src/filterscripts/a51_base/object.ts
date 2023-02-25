import { GateStatusEnum } from "@/filterscripts/a51_base/enums/gate";
import { IA51Options, ICommonOptions, IGateList } from "@/interfaces";
import { log, PlaySoundForPlayersInRange } from "@/utils/gl_common";
import {
  BaseGameText,
  BasePlayer,
  DynamicObject,
  DynamicObjectEvent,
  I18n,
  KeysEnum,
} from "omp-node-lib";
import { ColorEnum } from "./enums/color";
import { A51Player, A51PlayerEvent, playerEvent } from "./player";

export const gateInfo: IGateList = {
  east: {
    status: GateStatusEnum.CLOSED,
    labelPos: {
      x: 287.12,
      y: 1821.51,
      z: 18.14,
    },
    instance: null,
    openPos: {
      x: 286.008666,
      y: 1833.744628,
      z: 20.010623,
      speed: 1.1,
      rx: 0,
      ry: 0,
      rz: 90,
    },
    closePos: {
      x: 286.008666,
      y: 1822.744628,
      z: 20.010623,
      speed: 1.1,
      rx: 0,
      ry: 0,
      rz: 90,
    },
  },
  north: {
    status: GateStatusEnum.CLOSED,
    labelPos: {
      x: 135.09,
      y: 1942.37,
      z: 19.82,
    },
    instance: null,
    openPos: {
      x: 121.545074,
      y: 1941.527709,
      z: 21.691408,
      speed: 1.3,
      rx: 0,
      ry: 0,
      rz: 180,
    },
    closePos: {
      x: 134.545074,
      y: 1941.527709,
      z: 21.691408,
      speed: 1.3,
      rx: 0,
      ry: 0,
      rz: 180,
    },
  },
};

class MyDynamicObjectEvent extends DynamicObjectEvent<
  BasePlayer,
  DynamicObject
> {
  onMoved(object: DynamicObject) {
    const { north, east } = gateInfo;
    if (object === north.instance) {
      gateInfo.north.status =
        north.status === GateStatusEnum.CLOSING
          ? GateStatusEnum.CLOSED
          : GateStatusEnum.OPEN;
      return true;
    }
    if (object === east.instance) {
      gateInfo.east.status =
        east.status === GateStatusEnum.CLOSING
          ? GateStatusEnum.CLOSED
          : GateStatusEnum.OPEN;
      return true;
    }
    return true;
  }
}

const A51LandObject: DynamicObject = new DynamicObject({
  modelid: 11692,
  x: 199.344,
  y: 1943.79,
  z: 18.2031,
  rx: 0,
  ry: 0,
  rz: 0,
});
const A51Buildings: Array<DynamicObject> = [
  new DynamicObject({
    modelid: 19905,
    x: 206.79895,
    y: 1931.643432,
    z: 16.450595,
    rx: 0,
    ry: 0,
    rz: 0,
  }),
  new DynamicObject({
    modelid: 19905,
    x: 188.208908,
    y: 1835.033569,
    z: 16.450595,
    rx: 0,
    ry: 0,
    rz: 0,
  }),
  new DynamicObject({
    modelid: 19905,
    x: 230.378875,
    y: 1835.033569,
    z: 16.450595,
    rx: 0,
    ry: 0,
    rz: 0,
  }),
  new DynamicObject({
    modelid: 19907,
    x: 142.013977,
    y: 1902.538085,
    z: 17.633581,
    rx: 0,
    ry: 0,
    rz: 270.0,
  }),
  new DynamicObject({
    modelid: 19907,
    x: 146.854003,
    y: 1846.008056,
    z: 16.53358,
    rx: 0,
    ry: 0,
    rz: 0,
  }),
  new DynamicObject({
    modelid: 19909,
    x: 137.90039,
    y: 1875.024291,
    z: 16.836734,
    rx: 0,
    ry: 0,
    rz: 270.0,
  }),
  new DynamicObject({
    modelid: 19909,
    x: 118.170387,
    y: 1875.184326,
    z: 16.846735,
    rx: 0,
    ry: 0,
    rz: 0,
  }),
];
const A51Fence: DynamicObject = new DynamicObject({
  modelid: 19312,
  x: 191.141,
  y: 1870.04,
  z: 21.4766,
  rx: 0,
  ry: 0,
  rz: 0,
});
const { closePos: nClosePos } = gateInfo.north;
const A51NorthernGate: DynamicObject = new DynamicObject({
  modelid: 19313,
  x: nClosePos.x,
  y: nClosePos.y,
  z: nClosePos.z,
  rx: nClosePos.rx,
  ry: nClosePos.ry,
  rz: nClosePos.rz,
});
const { closePos: eClosePos } = gateInfo.east;
const A51EasternGate: DynamicObject = new DynamicObject({
  modelid: 19313,
  x: eClosePos.x,
  y: eClosePos.y,
  z: eClosePos.z,
  rx: eClosePos.rx,
  ry: eClosePos.ry,
  rz: eClosePos.rz,
});

export const moveGate = (
  playerEvent: A51PlayerEvent,
  player: A51Player,
  newkeys: KeysEnum,
  options: IA51Options,
  i18n: I18n
): void => {
  if (!(newkeys & KeysEnum.YES)) return;
  const { beforeMoveGate, onGateOpen, onGateClose } = options;
  if (beforeMoveGate) {
    const res = beforeMoveGate(player);
    if (!res) return;
  }
  const door = whichPlayerDoor(player, i18n);
  if (!door) return;

  const {
    name,
    direction,
    status,
    labelPos: position,
    openPos,
    closePos,
  } = door;

  const { onGateMoving } = options;

  if (status === GateStatusEnum.OPENING) {
    if (onGateMoving) {
      onGateMoving(player, direction, status);
      return;
    }
    player.sendClientMessage(
      ColorEnum.MESSAGE_YELLOW,
      i18n?.$t("a51.objects.gate.status.waiting.open", [name], player.locale) ||
        ""
    );
    return;
  }

  if (status === GateStatusEnum.CLOSING) {
    if (onGateMoving) {
      onGateMoving(player, direction, status);
      return;
    }
    player.sendClientMessage(
      ColorEnum.MESSAGE_YELLOW,
      i18n?.$t(
        "a51.objects.gate.status.waiting.close",
        [name],
        player.locale
      ) || ""
    );
    return;
  }

  PlaySoundForPlayersInRange(
    playerEvent.getPlayersArr(),
    1035,
    50.0,
    position.x,
    position.y,
    position.z
  );

  const {
    x: ox,
    y: oy,
    z: oz,
    speed: ospeed,
    rx: orx,
    ry: ory,
    rz: orz,
  } = openPos;

  const {
    x: cx,
    y: cy,
    z: cz,
    speed: cspeed,
    rx: crx,
    ry: cry,
    rz: crz,
  } = closePos;

  if (status === GateStatusEnum.CLOSED) {
    let openRes;
    if (onGateOpen) {
      openRes = onGateOpen(player, direction);
    } else {
      const gt = new BaseGameText(
        i18n?.$t("a51.objects.gate.status.opening", [name], player.locale) ||
          "",
        3000,
        3
      );
      gt.forPlayer(player);
    }
    if (onGateOpen && !openRes) return;
    gateInfo[direction].instance?.move(ox, oy, oz, ospeed, orx, ory, orz);
    gateInfo[direction].status = GateStatusEnum.OPENING;
    return;
  }
  let closeRes;
  if (onGateClose) {
    closeRes = onGateClose(player, direction);
  } else {
    const gt = new BaseGameText(
      i18n?.$t("a51.objects.gate.status.closing", [name], player.locale) || "",
      3000,
      3
    );
    gt.forPlayer(player);
  }
  if (onGateClose && !closeRes) return;
  gateInfo[direction].instance?.move(cx, cy, cz, cspeed, crx, cry, crz);
  gateInfo[direction].status = GateStatusEnum.CLOSING;
  return;
};

const whichPlayerDoor = (player: A51Player, i18n: I18n) => {
  const { x: ex, y: ey, z: ez } = gateInfo.east.labelPos;
  const { x: nx, y: ny, z: nz } = gateInfo.north.labelPos;
  let direction: keyof IGateList | null = null;
  if (player.isInRangeOfPoint(10.0, ex, ey, ez)) direction = "east";
  else if (player.isInRangeOfPoint(10.0, nx, ny, nz)) direction = "north";
  if (!direction) return;
  const name = i18n?.$t(
    direction === "east"
      ? "a51.objects.gate.name.eastern"
      : "a51.objects.gate.name.northern",
    null,
    player.locale
  );
  return {
    name,
    direction,
    ...gateInfo[direction],
  };
};

export const removeBuilding = (player: A51Player) => {
  player.removeBuilding(16203, 199.344, 1943.79, 18.2031, 250.0);
  player.removeBuilding(16590, 199.344, 1943.79, 18.2031, 250.0);
  player.removeBuilding(16323, 199.336, 1943.88, 18.2031, 250.0);
  player.removeBuilding(16619, 199.336, 1943.88, 18.2031, 250.0);
  player.removeBuilding(1697, 228.797, 1835.34, 23.2344, 250.0);
  player.removeBuilding(16094, 191.141, 1870.04, 21.4766, 250.0);
};

export const loadObjects = (options: ICommonOptions, i18n: I18n) => {
  // event should before create
  new MyDynamicObjectEvent(playerEvent.getPlayersMap(), false);

  A51LandObject.create();
  log(options, `  |--  ${i18n?.$t("a51.objects.created.land")}`);

  A51Fence.create();
  log(options, `  |--  ${i18n?.$t("a51.objects.created.fence")}`);

  A51Buildings.forEach((o) => o.create());
  log(options, `  |--  ${i18n?.$t("a51.objects.created.building")}`);

  gateInfo["east"].instance = A51EasternGate;
  gateInfo["north"].instance = A51NorthernGate;

  A51NorthernGate.create();
  A51EasternGate.create();

  log(options, `  |--  ${i18n?.$t("a51.objects.created.gate")}`);

  playerEvent.getPlayersArr().forEach((p) => {
    if (!p.isConnected() || p.isNpc()) return;
    removeBuilding(p);
  });
};

export const unloadObjects = (options: ICommonOptions, i18n: I18n) => {
  if (destroyValidObject(A51LandObject)) {
    log(options, "  |---------------------------------------------------");
    log(options, `  |--  ${i18n?.$t("a51.objects.destroyed.land")}`);
  }

  if (destroyValidObject(A51Fence)) {
    log(options, `  |--  ${i18n?.$t("a51.objects.destroyed.fence")}`);
  }

  if (destroyValidObject(gateInfo.north.instance)) {
    log(options, `  |--  ${i18n?.$t("a51.objects.destroyed.gate.northern")}`);
  }

  if (destroyValidObject(gateInfo.east.instance)) {
    log(options, `  |--  ${i18n?.$t("a51.objects.destroyed.gate.eastern")}`);
  }

  A51Buildings?.forEach((o, i) => {
    if (destroyValidObject(o)) {
      log(
        options,
        `  |--  ${i18n?.$t("a51.objects.destroyed.building", [i + 1])}`
      );
    }
  });
};

const destroyValidObject = (o: DynamicObject | Array<DynamicObject> | null) => {
  if (o === null) return false;
  if (Array.isArray(o)) {
    o.forEach((v) => destroyValidObject(v));
    return true;
  }
  if (o.isValid()) {
    o.destroy();
    return true;
  }
  return false;
};
