import fs from "node:fs";
import path from "node:path";
import {
  Player,
  PlayerEvent,
  Vehicle,
  VehicleEvent,
  VehicleModelInfoEnum,
  VehicleParamsEnum,
} from "@infernus/core";
import { spawnVehicleInFrontOfPlayer } from "filterscript/utils/gl_common";

export function createVehCommands() {
  const player2v = PlayerEvent.onCommandText(
    "player2v",
    ({ subcommand, next }) => {
      const [vId, pId] = subcommand;
      const veh = Vehicle.getInstance(+vId);
      const putPlayer = Player.getInstance(+pId);
      if (!veh || !putPlayer) return next();
      veh.putPlayerIn(putPlayer, 0);
      return next();
    },
  );

  const vc = PlayerEvent.onCommandText("vc", ({ player, subcommand, next }) => {
    const [vModelId] = subcommand;
    if (!vModelId) return next();
    const created_vehicle_id = spawnVehicleInFrontOfPlayer(
      player,
      +vModelId,
      -1,
      -1,
    );
    const msg = `Created vehicle: ${created_vehicle_id}`;
    player.sendClientMessage(0xaaaaaaaa, msg);
    return next();
  });

  const dvehicle = PlayerEvent.onCommandText(
    "dvehicle",
    ({ player, subcommand, next }) => {
      const [vehId] = subcommand;
      const veh = Vehicle.getInstance(+vehId);
      if (!veh) return;
      veh.destroy();
      const msg = `Destroyed vehicle: ${vehId}`;
      player.sendClientMessage(0xaaaaaaaa, msg);
      return next();
    },
  );

  const repairmycar = PlayerEvent.onCommandText(
    "repairmycar",
    ({ player, next }) => {
      const veh = player.getVehicle();
      if (veh) veh.repair();
      return next();
    },
  );

  const bv = PlayerEvent.onCommandText("bv", ({ player, subcommand, next }) => {
    const [vehicleId] = subcommand;
    if (!vehicleId)
      return player.sendClientMessage(0xffffffff, "DO: /bv [vehicleid]");
    fs.writeFile(
      path.resolve("scriptfiles", "badvehicles.txt"),
      vehicleId + "\n",
      {
        mode: "a",
      },
      () => {
        const name = player.getName();
        Player.sendClientMessageToAll(
          0xffffffff,
          `Veh ID ${vehicleId} marked as bad vehicle by ${name}`,
        );
      },
    );
    return next();
  });

  // Test reapplying vehicle mods on respawn

  let savanna: Vehicle | null = null;
  let blade: Vehicle | null = null;

  const onSpawn = VehicleEvent.onSpawn(({ vehicle, next }) => {
    if (vehicle === savanna) {
      vehicle.addComponent(1189); //Front Bumper
      vehicle.addComponent(1187); //Rear Bumper
      vehicle.addComponent(1129); //Exhaust
      vehicle.addComponent(1102); //Left Side Skirt
      vehicle.addComponent(1133); //Right Side Skirt
      vehicle.addComponent(1078); //Wheels
      vehicle.addComponent(1010); //Nitro 10x
      vehicle.addComponent(1087); //Hydraulics
    } else if (vehicle === blade) {
      vehicle.addComponent(1182); //Front Bumper
      vehicle.addComponent(1184); //Rear Bumper
      vehicle.addComponent(1104); //Exhaust
      vehicle.addComponent(1108); //Left Side Skirt
      vehicle.addComponent(1107); //Right Side Skirt
      vehicle.addComponent(1078); //Wheels
      vehicle.addComponent(1010); //Nitro 10x
      vehicle.addComponent(1087); //Hydraulics
    }
    return next();
  });

  const carmodtest = PlayerEvent.onCommandText("carmodtest", ({ next }) => {
    // spawns a couple of cars in Grove with mods applied
    savanna = new Vehicle({
      modelId: 567,
      x: 2509.1343,
      y: -1686.233,
      z: 13.2296,
      zAngle: 47.3679,
      color: [16, 16],
      respawnDelay: 10000,
    });
    savanna.create();
    savanna.addComponent(1189); //Front Bumper
    savanna.addComponent(1187); //Rear Bumper
    savanna.addComponent(1129); //Exhaust
    savanna.addComponent(1102); //Left Side Skirt
    savanna.addComponent(1133); //Right Side Skirt
    savanna.addComponent(1078); //Wheels
    savanna.addComponent(1010); //Nitro 10x
    savanna.addComponent(1087); //Hydrolics

    blade = new Vehicle({
      modelId: 536,
      x: 2509.8462,
      y: -1671.8666,
      z: 13.151,
      zAngle: 348.3512,
      color: [16, 16],
      respawnDelay: 10000,
    });
    blade.create();
    blade.addComponent(1182); //Front Bumper
    blade.addComponent(1184); //Rear Bumper
    blade.addComponent(1104); //Exhaust
    blade.addComponent(1108); //Left Side Skirt
    blade.addComponent(1107); //Right Side Skirt
    blade.addComponent(1078); //Wheels
    blade.addComponent(1010); //Nitro 10x
    blade.addComponent(1087); //Hydrolics
    return next();
  });

  const addnitro = PlayerEvent.onCommandText("addnitro", ({ player, next }) => {
    const vid = player.getVehicle();
    if (vid) {
      vid.addComponent(1010);
    }
    return next();
  });

  const remnitro = PlayerEvent.onCommandText("remnitro", ({ player, next }) => {
    const vid = player.getVehicle();
    if (vid) {
      vid.removeComponent(1010);
    }
    return next();
  });

  const paintjob = PlayerEvent.onCommandText(
    "paintjob",
    ({ player, subcommand, next }) => {
      const [jobId] = subcommand;
      const vid = player.getVehicle();
      if (jobId && vid) {
        vid.changePaintjob(+jobId as 0 | 1 | 2);
      }
      return next();
    },
  );

  const startengine = PlayerEvent.onCommandText(
    "startengine",
    ({ player, next }) => {
      const vid = player.getVehicle();
      if (vid) {
        const { lights, alarm, doors, bonnet, boot, objective } =
          vid.getParamsEx()!;
        vid.setParamsEx(true, lights, alarm, doors, bonnet, boot, objective);
      }
      return next();
    },
  );

  const stopengine = PlayerEvent.onCommandText(
    "stopengine",
    ({ player, next }) => {
      const vid = player.getVehicle();
      if (vid) {
        const { lights, alarm, doors, bonnet, boot, objective } =
          vid.getParamsEx()!;
        vid.setParamsEx(false, lights, alarm, doors, bonnet, boot, objective);
      }
      return next();
    },
  );

  const openboot = PlayerEvent.onCommandText("openboot", ({ player, next }) => {
    const vid = player.getVehicle();
    if (vid) {
      const { engine, lights, alarm, doors, bonnet, objective } =
        vid.getParamsEx()!;
      vid.setParamsEx(engine, lights, alarm, doors, bonnet, true, objective);
    }
    return next();
  });

  const closeboot = PlayerEvent.onCommandText(
    "closeboot",
    ({ player, next }) => {
      const vid = player.getVehicle();
      if (vid) {
        const { engine, lights, alarm, doors, bonnet, objective } =
          vid.getParamsEx()!;
        vid.setParamsEx(engine, lights, alarm, doors, bonnet, false, objective);
      }
      return next();
    },
  );

  const openbonnet = PlayerEvent.onCommandText(
    "openbonnet",
    ({ player, next }) => {
      const vid = player.getVehicle();
      if (vid) {
        const { engine, lights, alarm, doors, boot, objective } =
          vid.getParamsEx()!;
        vid.setParamsEx(engine, lights, alarm, doors, true, boot, objective);
      }
      return next();
    },
  );

  const closebonnet = PlayerEvent.onCommandText(
    "closebonnet",
    ({ player, next }) => {
      const vid = player.getVehicle();
      if (vid) {
        const { engine, lights, alarm, doors, boot, objective } =
          vid.getParamsEx()!;
        vid.setParamsEx(engine, lights, alarm, doors, false, boot, objective);
      }
      return next();
    },
  );

  const alarmon = PlayerEvent.onCommandText("alarmon", ({ player, next }) => {
    const vid = player.getVehicle();
    if (vid) {
      const { engine, lights, doors, boot, bonnet, objective } =
        vid.getParamsEx()!;
      vid.setParamsEx(engine, lights, true, doors, bonnet, boot, objective);
    }
    return next();
  });

  const alarmoff = PlayerEvent.onCommandText("alarmoff", ({ player, next }) => {
    const vid = player.getVehicle();
    if (vid) {
      const { engine, lights, doors, boot, bonnet, objective } =
        vid.getParamsEx()!;
      vid.setParamsEx(engine, lights, true, doors, bonnet, boot, objective);
    }
    return next();
  });

  const lightson = PlayerEvent.onCommandText("lightson", ({ player, next }) => {
    const vid = player.getVehicle();
    if (vid) {
      const { engine, alarm, doors, boot, bonnet, objective } =
        vid.getParamsEx()!;
      vid.setParamsEx(engine, true, alarm, doors, bonnet, boot, objective);
    }
    return next();
  });

  const lightsoff = PlayerEvent.onCommandText(
    "lightsoff",
    ({ player, next }) => {
      const vid = player.getVehicle();
      if (vid) {
        const { engine, alarm, doors, boot, bonnet, objective } =
          vid.getParamsEx()!;
        vid.setParamsEx(engine, false, alarm, doors, bonnet, boot, objective);
      }
      return next();
    },
  );

  const atrailer = PlayerEvent.onCommandText(
    "atrailer",
    ({ player, subcommand, next }) => {
      const veh = player.getVehicle();
      if (!veh) return next();
      const [trailerId] = subcommand;
      const trailer = Vehicle.getInstance(+trailerId);
      if (!trailer) return next();
      veh.attachTrailer(trailer);
      return next();
    },
  );

  const dtrailer = PlayerEvent.onCommandText(
    ["dtrailer", "detachtrailer"],
    ({ player, next }) => {
      const veh = player.getVehicle();
      if (!veh) return next();

      const trailer = veh.getTrailer();
      if (trailer) {
        veh.detachTrailer();
      }
      return next();
    },
  );

  const respawn_veh = PlayerEvent.onCommandText(
    "respawn_veh",
    ({ subcommand, next }) => {
      const [vehId] = subcommand;
      const veh = Vehicle.getInstance(+vehId);
      if (veh) {
        veh.setRespawn();
      }
      return next();
    },
  );

  const timed_vd = PlayerEvent.onCommandText("timed_vd", ({ player, next }) => {
    setTimeout(() => {
      const vehicleToKill = player.getVehicle();
      if (vehicleToKill && vehicleToKill.isValid()) {
        vehicleToKill.destroy();
      }
    }, 3000);
    return next();
  });

  const vmodelsize = PlayerEvent.onCommandText(
    "vmodelsize",
    ({ player, next }) => {
      const pos = player.getPos();
      if (!pos.ret) return next();
      const veh = player.getVehicle();
      if (!veh) {
        player.sendClientMessage(
          0xffffffff,
          "/vmodelsize : Be in a vehicle to use this command.",
        );
        return next();
      }
      const vehModel = veh.getModel();
      const { x, y, z } = veh.getModelInfo(VehicleModelInfoEnum.SIZE);
      const _x = x.toFixed(4);
      const _y = y.toFixed(4);
      const _z = z.toFixed(4);
      player.sendClientMessage(
        0xffffffff,
        `Vehicle(${vehModel}) Size: ${_x}, ${_y}, ${_z}`,
      );
      return next();
    },
  );

  const sirenstate = PlayerEvent.onCommandText(
    "sirenstate",
    ({ player, next }) => {
      const veh = player.getVehicle();
      if (veh && veh.getParamsSirenState() === VehicleParamsEnum.ON) {
        player.sendClientMessage(0xffffffff, "Siren is ON");
      } else {
        player.sendClientMessage(0xffffffff, "Siren is OFF");
      }
      return next();
    },
  );

  const opencardoors = PlayerEvent.onCommandText(
    "opencardoors",
    ({ player, next }) => {
      const veh = player.getVehicle();
      if (veh) {
        veh.setParamsCarDoors(true, true, true, true);
      }
      // const targetVeh = player.getCameraTargetVehicle();
      // if (targetVeh) {
      //   targetVeh.setParamsCarDoors(true, true, true, true);
      // }
      return next();
    },
  );

  const closecardoors = PlayerEvent.onCommandText(
    "closecardoors",
    ({ player, next }) => {
      const veh = player.getVehicle();
      if (veh) {
        veh.setParamsCarDoors(false, false, false, false);
      }
      // const targetVeh = player.getCameraTargetVehicle();
      // if (targetVeh) {
      //   targetVeh.setParamsCarDoors(false, false, false, false);
      // }
      return next();
    },
  );

  const opencarwindows = PlayerEvent.onCommandText(
    "opencarwindows",
    ({ player, next }) => {
      const veh = player.getVehicle();
      if (veh) {
        veh.setParamsCarWindows(true, true, true, true);
      }
      return next();
    },
  );

  const closecarwindows = PlayerEvent.onCommandText(
    "closecarwindows",
    ({ player, next }) => {
      const veh = player.getVehicle();
      if (veh) {
        veh.setParamsCarWindows(false, false, false, false);
      }
      return next();
    },
  );

  const disablevcol = PlayerEvent.onCommandText(
    "disablevcol",
    ({ player, next }) => {
      player.disableRemoteVehicleCollisions(true);
      return next();
    },
  );

  const enablevcol = PlayerEvent.onCommandText(
    "enablevcol",
    ({ player, next }) => {
      player.disableRemoteVehicleCollisions(false);
      return next();
    },
  );

  return [
    player2v,
    vc,
    dvehicle,
    repairmycar,
    bv,
    onSpawn,
    carmodtest,
    addnitro,
    remnitro,
    paintjob,
    startengine,
    stopengine,
    openboot,
    closeboot,
    openbonnet,
    closebonnet,
    alarmon,
    alarmoff,
    lightson,
    lightsoff,
    atrailer,
    dtrailer,
    respawn_veh,
    timed_vd,
    vmodelsize,
    sirenstate,
    opencardoors,
    closecardoors,
    opencarwindows,
    closecarwindows,
    disablevcol,
    enablevcol,
  ];
}
