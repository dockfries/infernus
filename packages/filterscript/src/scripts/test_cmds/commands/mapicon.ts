import {
  DynamicMapIcon,
  PlayerEvent,
  DynamicCheckpoint,
  MapIconStyles,
} from "@infernus/core";

const mapIconArr: DynamicMapIcon[] = [];

export function createMapIconCommands() {
  const mapicontest = PlayerEvent.onCommandText(
    "mapicontest",
    ({ player, next }) => {
      const pos = player.getPos();
      if (!pos.ret) return next();
      const { x, y, z } = pos;
      new DynamicCheckpoint({
        playerId: player.id,
        x,
        y,
        z,
        size: 5.0,
      }).create();
      mapIconArr[0] = new DynamicMapIcon({
        playerId: player.id,
        x: x + 50.0,
        y,
        z,
        type: 52,
        color: 0,
        style: MapIconStyles.LOCAL_CHECKPOINT,
      }).create();
      mapIconArr[1] = new DynamicMapIcon({
        playerId: player.id,
        x: x + 100.0,
        y,
        z,
        type: 53,
        color: 0,
        style: MapIconStyles.LOCAL_CHECKPOINT,
      }).create();
      mapIconArr[2] = new DynamicMapIcon({
        playerId: player.id,
        x: x + 150.0,
        y,
        z,
        type: 54,
        color: 0,
        style: MapIconStyles.LOCAL_CHECKPOINT,
      }).create();
      mapIconArr[3] = new DynamicMapIcon({
        playerId: player.id,
        x: x + 200.0,
        y,
        z,
        type: 55,
        color: 0,
        style: MapIconStyles.LOCAL_CHECKPOINT,
      }).create();
      mapIconArr[4] = new DynamicMapIcon({
        playerId: player.id,
        x: x + 200.0,
        y,
        z,
        type: 0,
        color: 0x00ff00ff,
      }).create();
      return next();
    },
  );

  const mapicondel = PlayerEvent.onCommandText("mapicondel", ({ next }) => {
    mapIconArr.forEach((m) => m.isValid() && m.destroy());
    mapIconArr.length = 0;
    return next();
  });

  const mapicontest2 = PlayerEvent.onCommandText(
    "mapicontest2",
    ({ player, next }) => {
      const pos = player.getPos();
      if (!pos.ret) return next();
      const { x, y, z } = pos;
      if (mapIconArr[0].isValid()) {
        mapIconArr[0].destroy();
      }
      mapIconArr[0] = new DynamicMapIcon({
        playerId: player.id,
        x,
        y,
        z,
        type: 33,
        color: 0,
        style: MapIconStyles.GLOBAL,
      }).create();
      if (mapIconArr[2].isValid()) {
        mapIconArr[2].destroy();
      }
      mapIconArr[0] = new DynamicMapIcon({
        playerId: player.id,
        x: x + 100,
        y,
        z,
        type: 55,
        color: 0,
        style: MapIconStyles.LOCAL,
      }).create();
      return next();
    },
  );

  return [mapicontest, mapicondel, mapicontest2];
}
