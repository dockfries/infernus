import { Dynamic3DTextLabel, Player, PlayerEvent } from "@infernus/core";

export function createLabelCommands() {
  const labelonvehicle = PlayerEvent.onCommandText(
    "labelonvehicle",
    ({ player, next }) => {
      const veh = player.getVehicle();
      if (!veh) return next();
      const txtId = new Dynamic3DTextLabel({
        text: "My Vehicle\nOwned by me\nNo Fuel\nRunning on vapour",
        color: 0xeeeeee50,
        x: 0.0,
        y: -1.6,
        z: -0.35,
        drawDistance: 15.0,
        testLOS: false,
        attachedVehicle: veh.id,
      });
      // tail of the vehicle toward the ground
      txtId.create();
      return next();
    },
  );

  const labelonplayer = PlayerEvent.onCommandText(
    "labelonplayer",
    ({ player, subcommand, next }) => {
      const [pId] = subcommand;
      if (!pId) return next();
      const txtId = new Dynamic3DTextLabel({
        text: "Player Label",
        color: 0xffffffff,
        x: 0.0,
        y: 0.0,
        z: -0.4,
        drawDistance: 40.0,
        testLOS: false,
        attachedPlayer: player.id,
      });
      txtId.create();
      return next();
    },
  );

  const manylabels = PlayerEvent.onCommandText(
    "manylabels",
    ({ player, next }) => {
      const pos = player.getPos();
      if (!pos.ret) return next();
      let { z } = pos;
      const { y } = pos;
      let x = 0;
      while (x !== 50) {
        const txtId = new Dynamic3DTextLabel({
          text: "Mah Labels",
          color: 0xffffffff,
          x,
          y,
          z,
          drawDistance: 100.0,
          testLOS: false,
        });
        txtId.create();
        z = z + 0.1;
        x++;
      }
      return next();
    },
  );

  const dellabel = PlayerEvent.onCommandText(
    "dellabel",
    ({ subcommand, next }) => {
      const [txtId] = subcommand;
      const txt3d = Dynamic3DTextLabel.getInstance(+txtId);
      if (txt3d) txt3d.destroy();
      return next();
    },
  );

  const playerlabel = PlayerEvent.onCommandText(
    "playerlabel",
    ({ player, next }) => {
      const pos = player.getPos();
      if (!pos.ret) return next();

      const { x, y, z } = pos;

      const player3dTextId = new Dynamic3DTextLabel({
        text: "Hello\nI'm at your position",
        color: 0x008080ff,
        x,
        y,
        z,
        drawDistance: 40.0,
        playerId: player.id,
      });
      player3dTextId.create();
      player.sendClientMessage(
        0xffffffff,
        "I created a player label at your position.",
      );
      return next();
    },
  );

  const playerlabelveh = PlayerEvent.onCommandText(
    "playerlabelveh",
    ({ player, next }) => {
      const veh = player.getVehicle();
      if (!veh) return next();

      const player3dTextId = new Dynamic3DTextLabel({
        text: "im in your vehicles\nand hiding behind the walls",
        color: 0x008080ff,
        x: 0.0,
        y: -1.6,
        z: -0.35,
        drawDistance: 20.0,
        attachedVehicle: veh.id,
        testLOS: true,
      });

      player3dTextId.create();
      return next();
    },
  );

  const playerlabelpl = PlayerEvent.onCommandText(
    "playerlabelpl",
    ({ subcommand, next }) => {
      const [attachPlayerId] = subcommand;
      if (!attachPlayerId) return next();

      if (Player.getInstance(+attachPlayerId)) {
        return next();
      }

      const player3dTextId = new Dynamic3DTextLabel({
        text: "Hello Testing",
        color: 0x008080ff,
        x: 0.0,
        y: 0.0,
        z: 0.0,
        drawDistance: 30.0,
        attachedPlayer: +attachPlayerId,
        testLOS: true,
      });
      player3dTextId.create();

      return next();
    },
  );

  const delplayerlabel = PlayerEvent.onCommandText(
    "delplayerlabel",
    ({ subcommand, next }) => {
      const [txtId] = subcommand;
      const txt3d = Dynamic3DTextLabel.getInstance(+txtId);
      if (txt3d) txt3d.destroy();
      return next();
    },
  );

  const updateplayerlabel = PlayerEvent.onCommandText(
    "updateplayerlabel",
    ({ subcommand, next }) => {
      const [txtId] = subcommand;
      const txt3d = Dynamic3DTextLabel.getInstance(+txtId);
      if (txt3d) txt3d.updateText(0xffffffff, "");
      return next();
    },
  );

  return [
    labelonvehicle,
    labelonplayer,
    manylabels,
    dellabel,
    playerlabel,
    playerlabelveh,
    playerlabelpl,
    delplayerlabel,
    updateplayerlabel,
  ];
}
