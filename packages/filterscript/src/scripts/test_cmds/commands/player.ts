import {
  Player,
  PlayerEvent,
  SpecialActionsEnum,
  Vehicle,
} from "@infernus/core";

export function createPlayerCommands() {
  const weap = PlayerEvent.onCommandText(
    "weap",
    ({ player, subcommand, next }) => {
      const [weaponId] = subcommand;
      if (!weaponId) return next();
      player.giveWeapon(+weaponId, 9999);
      return next();
    },
  );

  const goto = PlayerEvent.onCommandText(
    "goto",
    ({ player, subcommand, next }) => {
      const [pId] = subcommand;
      const p = Player.getInstance(+pId);
      if (!p) return next();

      const pos = p.getPos();
      if (!pos) return next();

      const { x, y, z } = pos;

      const veh = player.getVehicle();
      if (veh) {
        veh.setPos(x + 2, y + 2, z);
      } else {
        player.setPos(x + 2, y + 2, z);
      }
      return next();
    },
  );

  const bring = PlayerEvent.onCommandText(
    "bring",
    ({ player, subcommand, next }) => {
      const [pId] = subcommand;
      const p = Player.getInstance(+pId);
      if (!p) return next();

      const pos = player.getPos();
      if (!pos) return next();

      const { x, y, z } = pos;

      const veh = p.getVehicle();

      if (veh) {
        veh.setPos(x + 2, y + 2, z);
      } else {
        p.setPos(x + 2, y + 2, z);
      }

      return next();
    },
  );

  const me2v = PlayerEvent.onCommandText(
    "me2v",
    ({ player, subcommand, next }) => {
      const [vehId] = subcommand;
      const veh = Vehicle.getInstance(+vehId);
      if (!veh) return next();
      veh.putPlayerIn(player, 0);
      return next();
    },
  );

  const tpzero = PlayerEvent.onCommandText("tpzero", ({ player, next }) => {
    const veh = player.getVehicle();
    if (veh && veh.isValid()) {
      veh.setPos(0.0, 0.0, 10.0);
    }
    return next();
  });

  const myvw = PlayerEvent.onCommandText(
    "myvw",
    ({ player, subcommand, next }) => {
      const [worldId] = subcommand;
      player.setVirtualWorld(+worldId);
      return next();
    },
  );

  const fight = PlayerEvent.onCommandText(
    "fight",
    ({ player, subcommand, next }) => {
      const [style] = subcommand;
      player.setFightingStyle(+style);
      const name = player.getName();
      Player.sendClientMessageToAll(
        0x4499ccff,
        `(${name}) fighting style changed to ${style}`,
      );
      return next();
    },
  );

  const myfacingangle = PlayerEvent.onCommandText(
    "myfacingangle",
    ({ player, next }) => {
      const angle = player.getFacingAngle();
      Player.sendClientMessageToAll(0x4499ccff, `Facing: ${angle}`);
      return next();
    },
  );

  const crime = PlayerEvent.onCommandText(
    "crime",
    ({ player, subcommand, next }) => {
      const [suspectId, crimeId] = subcommand;
      const suspect = Player.getInstance(+suspectId);
      if (!suspect) return next();
      player.playCrimeReport(suspect, +crimeId);
      return next();
    },
  );

  const weapskill = PlayerEvent.onCommandText(
    "weapskill",
    ({ player, subcommand, next }) => {
      const [skill, level] = subcommand;
      player.setSkillLevel(+skill, +level);
      return next();
    },
  );

  const setfacingzero = PlayerEvent.onCommandText(
    "setfacingzero",
    ({ player, next }) => {
      player.setFacingAngle(0.0);
      return next();
    },
  );

  const setskin = PlayerEvent.onCommandText(
    "setskin",
    ({ player, subcommand, next }) => {
      const [skinId] = subcommand;
      player.setSkin(+skinId);
      return next();
    },
  );

  const kill = PlayerEvent.onCommandText("kill", ({ player, next }) => {
    player.setHealth(0.0);
    return next();
  });

  const kickallnpc = PlayerEvent.onCommandText("kickallnpc", ({ next }) => {
    Player.getInstances().forEach((p) => p.isNpc() && p.kick());
    return next();
  });

  const setweap = PlayerEvent.onCommandText(
    "setweap",
    ({ player, subcommand, next }) => {
      const [weaponId] = subcommand;
      player.setArmedWeapon(+weaponId);
      return next();
    },
  );

  const jetpack = PlayerEvent.onCommandText("jetpack", ({ player, next }) => {
    player.setSpecialAction(SpecialActionsEnum.USEJETPACK);
    return next();
  });

  const dropaudio = PlayerEvent.onCommandText(
    "dropaudio",
    ({ player, next }) => {
      const pos = player.getPos();
      if (pos) {
        player.playAudioStream(
          "http://somafm.com/tags.pls",
          pos.x,
          pos.y,
          pos.z,
          40.0,
        );
      }
      return next();
    },
  );

  const officefloor = PlayerEvent.onCommandText(
    "officefloor",
    ({ player, next }) => {
      player.setPos(1786.0645, -1298.751, 104.2);
      return next();
    },
  );

  const lvpd = PlayerEvent.onCommandText("lvpd", ({ player, next }) => {
    player.setInterior(3);
    player.setPos(237.5571, 148.7559, 1005.4703);
    return next();
  });

  const usecell = PlayerEvent.onCommandText("usecell", ({ player, next }) => {
    player.setSpecialAction(SpecialActionsEnum.USECELLPHONE);
    // player.setAttachedObject(4, 330, 6); // 4 = attachment slot, 330 = cellphone model, 6 = right hand
    return next();
  });

  const stopcell = PlayerEvent.onCommandText("stopcell", ({ player, next }) => {
    player.setSpecialAction(SpecialActionsEnum.STOPUSECELLPHONE);
    player.removeAttachedObject(4);
    return next();
  });

  const uncontrol = PlayerEvent.onCommandText(
    "uncontrol",
    ({ player, next }) => {
      player.toggleControllable(false);
      // setTimeout(() => {
      //   player.toggleControllable(true);
      // }, 5000);
      return next();
    },
  );

  const recontrol = PlayerEvent.onCommandText(
    "recontrol",
    ({ player, next }) => {
      player.toggleControllable(true);
      return next();
    },
  );

  const kkeys = PlayerEvent.onCommandText("kkeys", ({ player, next }) => {
    const message = `{FFFFFF}Left Key: {FFFF00}~k~~GO_LEFT~ {FFFFFF}Right Key: {FFFF00}~k~~GO_RIGHT~ {FFFFFF}Fire Key: {FFFF00}~k~~PED_FIREWEAPON~`;
    player.sendClientMessage(0xffffffff, message);
    return next();
  });

  const cam_interp = PlayerEvent.onCommandText(
    "cam_interp",
    ({ player, next }) => {
      const pos = player.getPos();
      if (pos) {
        const { x, y, z } = pos;
        player.interpolateCameraPos(
          x,
          y,
          z,
          x + 100.0,
          y + 100.0,
          z + 20.0,
          10000,
        );
      }
      return next();
    },
  );

  const cam_interp_look = PlayerEvent.onCommandText(
    "cam_interp_look",
    ({ player, next }) => {
      const pos = player.getPos();
      if (pos) {
        const { x, y, z } = pos;
        player.interpolateCameraPos(
          x,
          y,
          z,
          x + 100.0,
          y + 100.0,
          z + 20.0,
          10000,
        );
        player.interpolateCameraLookAt(x, y, z, 0.0, 0.0, 0.0, 10000);
      }
      return next();
    },
  );

  const cam_behind = PlayerEvent.onCommandText(
    "cam_behind",
    ({ player, next }) => {
      player.setCameraBehind();
      return next();
    },
  );

  function kickWithMessage(player: Player, message: string) {
    player.sendClientMessage(0xff4444ff, message);
    setTimeout(() => {
      player.kick();
    }, 1000);
  }

  const kickmessage = PlayerEvent.onCommandText(
    "kickmessage",
    ({ player, next }) => {
      kickWithMessage(player, "Bye!");
      return next();
    },
  );

  const animindex = PlayerEvent.onCommandText(
    "animindex",
    ({ player, next }) => {
      const { animLib, animName } = player.getAnimationName();
      const msg = `AnimIndex: ${player.getAnimationIndex()} is ${animLib}:${animName}`;
      player.sendClientMessage(0xffffffff, msg);
      return next();
    },
  );

  const weapdata = PlayerEvent.onCommandText("weapdata", ({ player, next }) => {
    let x = 0;
    while (x !== 13) {
      const { weapons, ammo } = player.getWeaponData(x);
      const msg = `WeapSlot(${x}) ${weapons}:${ammo}`;
      player.sendClientMessage(0xffffffff, msg);
      x++;
    }
    return next();
  });

  function createExplosionEx(
    x: number,
    y: number,
    z: number,
    type: number,
    radius: number,
    virtualWorld: number,
  ) {
    Player.getInstances().forEach((p) => {
      if (virtualWorld === -1 || virtualWorld === p.getVirtualWorld()) {
        p.createExplosion(x, y, z, type, radius);
      }
    });
  }

  const explosion = PlayerEvent.onCommandText(
    "explosion",
    ({ player, subcommand, next }) => {
      const [radius] = subcommand;
      const pos = player.getPos();
      if (pos) {
        const { x, y, z } = pos;
        createExplosionEx(x + 10.0, y + 10.0, z + 10.0, 1, 2.0, +radius);
      }
      return next();
    },
  );

  const disablecamtarget = PlayerEvent.onCommandText(
    "disablecamtarget",
    ({ player, next }) => {
      player.enableCameraTarget(false);
      return next();
    },
  );

  const enablecamtarget = PlayerEvent.onCommandText(
    "enablecamtarget",
    ({ player, next }) => {
      player.enableCameraTarget(true);
      return next();
    },
  );

  const poolsize = PlayerEvent.onCommandText("poolsize", ({ player, next }) => {
    let higestPlayerId = -1;
    let higestVehicleId = -1;
    Player.getInstances().forEach((p) => {
      if (p.id > higestPlayerId) higestPlayerId = p.id;
    });
    Vehicle.getInstances().forEach((v) => {
      if (v.id > higestPlayerId) higestVehicleId = v.id;
    });
    player.sendClientMessage(0xffffffff, `PlayerPoolSize: ${higestPlayerId}`);
    player.sendClientMessage(0xffffffff, `VehiclePoolSize: ${higestVehicleId}`);
    return next();
  });

  return [
    weap,
    goto,
    bring,
    me2v,
    tpzero,
    myvw,
    fight,
    myfacingangle,
    crime,
    weapskill,
    setfacingzero,
    setskin,
    kill,
    kickallnpc,
    setweap,
    jetpack,
    dropaudio,
    officefloor,
    lvpd,
    usecell,
    stopcell,
    uncontrol,
    recontrol,
    kkeys,
    cam_interp,
    cam_interp_look,
    cam_behind,
    kickmessage,
    animindex,
    weapdata,
    explosion,
    disablecamtarget,
    enablecamtarget,
    poolsize,
  ];
}
