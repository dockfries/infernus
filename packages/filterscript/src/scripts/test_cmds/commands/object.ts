import {
  PlayerEvent,
  DynamicObject,
  LimitsEnum,
  Vehicle,
  MaterialTextAlign,
  MaterialTextSizes,
  Player,
} from "@infernus/core";
import { spawnVehicleInFrontOfPlayer } from "filterscript/utils/gl_common";

export function createObjectCommands() {
  const holdobjectid = PlayerEvent.onCommandText(
    "holdobjectid",
    ({ player, subcommand, next }) => {
      const [modelId] = subcommand;
      player.setAttachedObject(0, +modelId, 6);
      player.setAttachedObject(1, +modelId, 5);
      // player.setAttachedObject(0, 1254, 2, 0.1, 0.05, 0, 0, 90, 0);
      return next();
    },
  );

  const removeheld = PlayerEvent.onCommandText(
    "removeheld",
    ({ player, next }) => {
      let zz = 0;
      while (zz !== LimitsEnum.MAX_PLAYER_ATTACHED_OBJECTS) {
        if (player.isAttachedObjectSlotUsed(zz)) {
          player.removeAttachedObject(zz);
        }
        zz++;
      }
      return next();
    },
  );

  const attachobj = PlayerEvent.onCommandText(
    "attachobj",
    ({ player, subcommand, next }) => {
      const [modelId] = subcommand;
      if (!modelId) return next();

      const veh = player.getVehicle();
      if (!veh) return next();

      const obj = new DynamicObject({
        modelId: +modelId,
        x: 0.0,
        y: 0.0,
        z: 0.0,
        rx: 0.0,
        ry: 0.0,
        rz: 0.0,
        drawDistance: 200.0,
      }).create();
      obj.attachToVehicle(veh, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0);
      return next();
    },
  );

  const attachtome = PlayerEvent.onCommandText(
    "attachtome",
    ({ player, subcommand, next }) => {
      const [modelId] = subcommand;
      if (!modelId) return next();
      const obj = new DynamicObject({
        modelId: +modelId,
        x: 0.0,
        y: 0.0,
        z: 0.0,
        rx: 0.0,
        ry: 0.0,
        rz: 0.0,
        drawDistance: 200.0,
      }).create();
      obj.attachToPlayer(player, 0.0, 0.0, 2.0, 0.0, 0.0, 0.0);
      return next();
    },
  );

  let fence: DynamicObject | null = null;

  const cfence = PlayerEvent.onCommandText("cfence", ({ player, next }) => {
    player.setPos(2496.4, -1664.84, 13.19);
    if (!fence)
      fence = new DynamicObject({
        modelId: 1410,
        x: 2496.8,
        y: -1661.88,
        z: 13.4,
        rx: 0.0,
        ry: 0.0,
        rz: 0.0,
      }).create();
    return next();
  });

  const mfence1 = PlayerEvent.onCommandText("mfence1", ({ next }) => {
    fence?.move(2494.56, -1664.12, 13.4, 1.0, 0.0, 0.0, -90.0);
    return next();
  });

  const mfence2 = PlayerEvent.onCommandText("mfence2", ({ next }) => {
    fence?.move(2496.8, -1661.88, 13.4, 1.0, 0.0, 0.0, 0.0);
    return next();
  });

  const objvehst = PlayerEvent.onCommandText("objvehst", ({ player, next }) => {
    const pos = player.getPos();
    if (!pos.ret) return next();
    const { x, y, z } = pos;
    const objVeh = new Vehicle({
      modelId: 563,
      x: x + 2.0,
      y: y + 2.0,
      z,
      zAngle: 0.0,
      color: [0, 0],
      respawnDelay: -1,
    });
    objVeh.create();
    const objAtt = new DynamicObject({
      modelId: 19277,
      x: 0.0,
      y: 0.0,
      z: 0.0,
      rx: 0.0,
      ry: 0.0,
      rz: 0.0,
      drawDistance: 200.0,
    }).create();
    objAtt.attachToVehicle(objVeh, 2.0, 0.15, 0.0, 0.0, 0.0, 90.0);
    return next();
  });

  const objlim1 = PlayerEvent.onCommandText("objlim1", ({ player, next }) => {
    const pos = player.getPos();
    if (!pos.ret) return next();
    const { x, z } = pos;
    let { y } = pos;
    let lp = 0;
    while (lp !== 999) {
      new DynamicObject({
        modelId: 1656,
        x,
        y,
        z,
        rx: 0,
        ry: 0,
        rz: 0,
        drawDistance: 1000.0,
      }).create();
      y += 0.25;
      lp++;
    }
    return next();
  });

  const editattach = PlayerEvent.onCommandText(
    "editattach",
    ({ player, next }) => {
      if (!player.isAttachedObjectSlotUsed(0)) {
        player.setAttachedObject(0, 19006, 2); // red sunglasses to head bone
      }
      player.sendClientMessage(
        0xffffffff,
        "Hint: Use {FFFF00}~k~~PED_SPRINT~{FFFFFF} to look around.",
      );
      player.editAttachedObject(0);
      return next();
    },
  );

  let edit_objectid: DynamicObject | null = null;

  const editobject = PlayerEvent.onCommandText(
    "editobject",
    ({ player, next }) => {
      if (!edit_objectid) {
        const pos = player.getPos();
        if (!pos.ret) return next();
        const { x, y, z } = pos;
        edit_objectid = new DynamicObject({
          playerId: player.id,
          modelId: 1656,
          x: x + 1.0,
          y: y + 1.0,
          z: z + 0.5,
          rx: 0.0,
          ry: 0.0,
          rz: 0.0,
          drawDistance: 200.0,
        });
        edit_objectid.create();
      }
      player.sendClientMessage(
        0xffffffff,
        "Hint: Use {FFFF00}~k~~PED_SPRINT~{FFFFFF} to look around.",
      );
      edit_objectid.edit(player);
      return next();
    },
  );

  const selobj = PlayerEvent.onCommandText("selobj", ({ player, next }) => {
    player.sendClientMessage(
      0xffffffff,
      "Hint: Use {FFFF00}~k~~PED_SPRINT~{FFFFFF} to look around.",
    );
    player.beginObjectSelecting();
    return next();
  });

  const canceledit = PlayerEvent.onCommandText(
    "canceledit",
    ({ player, next }) => {
      player.endObjectEditing();
      return next();
    },
  );

  const editpobject = PlayerEvent.onCommandText(
    "editpobject",
    ({ player, next }) => {
      if (!edit_objectid) {
        const pos = player.getPos();
        if (!pos.ret) return next();
        const { x, y, z } = pos;
        edit_objectid = new DynamicObject({
          playerId: player.id,
          modelId: 19522,
          x: x + 1.0,
          y: y + 1.0,
          z: z + 0.5,
          rx: 0.0,
          ry: 0.0,
          rz: 0.0,
          drawDistance: 200.0,
        });
        edit_objectid.create();
      }
      player.sendClientMessage(
        0xffffffff,
        "Hint: Use {FFFF00}~k~~PED_SPRINT~{FFFFFF} to look around.",
      );
      edit_objectid.edit(player);
      return next();
    },
  );

  const cam_on_obj = PlayerEvent.onCommandText(
    "cam_on_obj",
    ({ player, next }) => {
      const pos = player.getPos();
      if (!pos.ret) return next();
      const { x, y, z } = pos;
      if (!edit_objectid) {
        edit_objectid = new DynamicObject({
          modelId: 19320,
          x: x + 1.0,
          y: y + 1.0,
          z: z + 0.5,
          rx: 0.0,
          ry: 0.0,
          rz: 0.0,
          drawDistance: 200.0,
        });
        edit_objectid.create();
      }
      // player.toggleSpectating(true);
      edit_objectid.attachCamera(player);
      edit_objectid.move(x, y + 2000.0, z + 400.0, 20.0);
      return next();
    },
  );

  const cam_on_train = PlayerEvent.onCommandText(
    "cam_on_train",
    ({ player, next }) => {
      const pos = player.getPos();
      if (!pos.ret) return next();
      if (!edit_objectid) {
        const { x, y, z } = pos;
        edit_objectid = new DynamicObject({
          modelId: 19320,
          x: x + 1.0,
          y: y + 1.0,
          z: z + 0.5,
          rx: 0.0,
          ry: 0.0,
          rz: 0.0,
          drawDistance: 200.0,
        });
        edit_objectid.create();
      }
      player.toggleSpectating(true);
      const veh = Vehicle.getInstance(9);
      if (!veh) {
        return next();
      }
      edit_objectid.attachToVehicle(veh, 0.0, 0.0, 2.0, 0.0, 0.0, 0.0);
      player.spectateVehicle(veh);
      edit_objectid.attachCamera(player);
      return next();
    },
  );

  const crplain = PlayerEvent.onCommandText("crplain", ({ next }) => {
    new DynamicObject({
      modelId: 19003,
      x: 416.54,
      y: 1655.75,
      z: 700.0,
      rx: 0.0,
      ry: 0.0,
      rz: 0.0,
      drawDistance: 200.0,
    }).create();
    new DynamicObject({
      modelId: 4561,
      x: -26.98,
      y: 1639.33,
      z: 98.03,
      rx: 0.0,
      ry: 0.0,
      rz: 0.0,
      drawDistance: 1000.0,
    }).create();
    return next();
  });

  const testplain = PlayerEvent.onCommandText(
    "testplain",
    ({ player, next }) => {
      new DynamicObject({
        modelId: 19003,
        x: 416.54,
        y: 1655.75,
        z: 700.0,
        rx: 0.0,
        ry: 0.0,
        rz: 0.0,
      }).create();
      const veh = player.getVehicle();
      if (veh) {
        veh.setPos(416.54, 1655.75, 705.0);
      } else {
        player.setPos(416.54, 1655.75, 710.0);
      }
      return next();
    },
  );

  const testplain2 = PlayerEvent.onCommandText(
    "testplain2",
    ({ player, next }) => {
      new DynamicObject({
        modelId: 10766,
        x: 168.86,
        y: 1686.77,
        z: 44.86,
        rx: 0.0,
        ry: 0.0,
        rz: 0.0,
        drawDistance: 1000.0,
      }).create();
      new DynamicObject({
        modelId: 10766,
        x: 168.86,
        y: 1532.52,
        z: 44.86,
        rx: 0.0,
        ry: 0.0,
        rz: 0.0,
        drawDistance: 1000.0,
      }).create();
      const veh = player.getVehicle();
      if (veh) {
        veh.setPos(162.9956, 1606.2555, 55.3197);
      } else {
        player.setPos(162.9956, 1606.2555, 55.3197);
      }
      return next();
    },
  );

  const test_tex_objects: DynamicObject[] = [];
  let text_update_timer: NodeJS.Timeout | null = null;

  const crptex = PlayerEvent.onCommandText("crptex", ({ player, next }) => {
    let lp = 0;
    const pos = player.getPos();
    if (!pos.ret) return next();
    let x = pos.x;
    const y = pos.y;
    const z = pos.z;
    x += 1.0;
    while (lp !== 128) {
      test_tex_objects[lp] = new DynamicObject({
        playerId: player.id,
        modelId: 19372,
        x,
        y,
        z: z + 0.5,
        rx: 0.0,
        ry: 0.0,
        rz: 0.0,
        drawDistance: 0.0,
      });
      test_tex_objects[lp].create();
      test_tex_objects[lp].setMaterial(0, 0, "null", "null", 0);

      if (lp % 2 === 0) {
        test_tex_objects[lp].setMaterial(
          0,
          19325,
          "all_walls",
          "stormdrain3_nt",
          0xff00ff00,
        );
      } else {
        test_tex_objects[lp].setMaterial(
          0,
          19371,
          "all_walls",
          "stormdrain3_nt",
          0xff551155,
        );
      }

      x += 2.0;
      lp++;
    }
  });

  const crpmix = PlayerEvent.onCommandText("crpmix", ({ player, next }) => {
    let lp = 0;
    const pos = player.getPos();
    if (!pos.ret) return next();
    let x = pos.x;
    const y = pos.y;
    const z = pos.z;
    x += 1.0;
    while (lp !== 128) {
      test_tex_objects[lp] = new DynamicObject({
        playerId: player.id,
        modelId: 19371,
        x,
        y,
        z: z + 0.5,
        rx: 0.0,
        ry: 0.0,
        rz: 0.0,
        drawDistance: 300.0,
      });
      test_tex_objects[lp].create();
      // test_tex_objects[lp].setMaterialText(
      //   player.charset,
      //   0,
      //   `Text Here: {00FF00}${lp}`,
      //   MaterialTextSizes.SIZE_512x512,
      //   "Verdana",
      //   60,
      //   1,
      //   0xff5555ff,
      //   0xff000000,
      //   MaterialTextAlign.CENTER,
      // );
      if (lp % 2 === 0) {
        test_tex_objects[lp].setMaterial(
          0,
          19371,
          "all_walls",
          "stormdrain3_nt",
          0xff55aa55,
        );
      } else {
        test_tex_objects[lp].setMaterialText(
          player.charset,
          0,
          "Text: {00FF00}%d",
          MaterialTextSizes.SIZE_512x256,
          "Verdana",
          60,
          1,
          0xff5555ff,
          0xff000000,
          MaterialTextAlign.CENTER,
        );
      }
      x += 2.0;
      lp++;
    }
    return next();
  });

  let text_counter = 0;
  let text_update_player: Player | null = null;
  function updateTextTimer() {
    if (!text_update_player) return;
    const textdisp = `Dynamic Update (${text_counter})`;
    text_counter++;
    test_tex_objects[0].setMaterialText(
      text_update_player.charset,
      0,
      textdisp,
      MaterialTextSizes.SIZE_512x128,
      "Courier New",
      48,
      1,
      0xff000000,
      0,
      0,
    );
  }

  const crptext = PlayerEvent.onCommandText("crptext", ({ player, next }) => {
    const pos = player.getPos();
    if (!pos.ret) return next();

    let x = pos.x + 1.0;
    const y = pos.y;
    const z = pos.z;

    test_tex_objects[0] = new DynamicObject({
      playerId: player.id,
      modelId: 19479,
      x,
      y,
      z: z + 0.5,
      rx: 0.0,
      ry: 0.0,
      rz: 0.0,
      drawDistance: 300.0,
    });
    test_tex_objects[0].create();
    test_tex_objects[0].setMaterialText(
      player.charset,
      0,
      "Dynamic Update (0)",
      MaterialTextSizes.SIZE_512x128,
      "Courier New",
      48,
      1,
      0xff000000,
      0,
      0,
    );
    x += 3.0;

    // This is a dynamic update material text
    if (!text_update_timer) {
      text_update_timer = setInterval(() => {
        updateTextTimer();
      }, 1000);
      text_update_player = player;
    }

    test_tex_objects[1] = new DynamicObject({
      playerId: player.id,
      modelId: 19479,
      x,
      y,
      z: z + 4.0,
      rx: 0.0,
      ry: 0.0,
      rz: 0.0,
      drawDistance: 300.0,
    });
    test_tex_objects[1].create();
    test_tex_objects[1].setMaterialText(
      player.charset,
      0,
      "ABDSJFUEGI\nABDRJCFEGI\n{DDDDDD}Center",
      MaterialTextSizes.SIZE_512x256,
      "GTAWEAPON3",
      70,
      0,
      0xff00ff00,
      0xff444477,
      MaterialTextAlign.CENTER,
    );
    x += 3.0;

    test_tex_objects[2] = new DynamicObject({
      playerId: player.id,
      modelId: 19480,
      x,
      y,
      z: z + 4.0,
      rx: 0.0,
      ry: 0.0,
      rz: 0.0,
      drawDistance: 300.0,
    });
    test_tex_objects[2].create();
    test_tex_objects[2].setMaterialText(
      player.charset,
      0,
      "Blue Text\nVerdana\nAlpha BG\n{DDDDDD}Center",
      MaterialTextSizes.SIZE_512x256,
      "Verdana",
      60,
      1,
      0xff000000,
      0xffffffff,
      MaterialTextAlign.CENTER,
    );
    x += 3.0;

    test_tex_objects[3] = new DynamicObject({
      playerId: player.id,
      modelId: 19481,
      x,
      y,
      z: z + 4.0,
      rx: 0.0,
      ry: 0.0,
      rz: 0.0,
      drawDistance: 300.0,
    });
    test_tex_objects[3].create();
    test_tex_objects[3].setMaterialText(
      player.charset,
      0,
      "Blue Text\nArial\nAlpha BG\n{DDDDDD}Center",
      MaterialTextSizes.SIZE_512x256,
      "Arial",
      60,
      1,
      0xff000000,
      0xffcdd704,
      MaterialTextAlign.CENTER,
    );
    x += 3.0;

    test_tex_objects[4] = new DynamicObject({
      playerId: player.id,
      modelId: 19482,
      x,
      y,
      z: z + 4.0,
      rx: 0.0,
      ry: 0.0,
      rz: 0.0,
      drawDistance: 300.0,
    });
    test_tex_objects[4].create();
    test_tex_objects[4].setMaterialText(
      player.charset,
      0,
      "Blue Text\nVerdana\nAlpha BG\n{DDDDDD}Center",
      MaterialTextSizes.SIZE_512x256,
      "Verdana",
      60,
      1,
      0xff000000,
      0xffcdd704,
      MaterialTextAlign.CENTER,
    );
    x += 3.0;

    test_tex_objects[5] = new DynamicObject({
      playerId: player.id,
      modelId: 19483,
      x,
      y,
      z: z + 4.0,
      rx: 0.0,
      ry: 0.0,
      rz: 0.0,
      drawDistance: 300.0,
    });
    test_tex_objects[5].create();
    test_tex_objects[5].setMaterialText(
      player.charset,
      0,
      "Blue Text\nArial\nAlpha BG\n{DDDDDD}Center",
      MaterialTextSizes.SIZE_512x256,
      "Arial",
      60,
      1,
      0xff000000,
      0,
      MaterialTextAlign.CENTER,
    );
    x += 3.0;

    // test_tex_objects[0].edit(player);
    return next();
  });

  const delptex = PlayerEvent.onCommandText("delptex", ({ next }) => {
    let lp = 0;
    while (lp !== 128) {
      if (test_tex_objects[lp] && test_tex_objects[lp].isValid()) {
        test_tex_objects[lp].destroy();
      }
      lp++;
    }
    if (text_update_timer) {
      clearInterval(text_update_timer);
      text_update_timer = null;
    }
    return next();
  });

  // Damian's bed that crashed because material object id and original object id were the same
  const crashbed = PlayerEvent.onCommandText("crashbed", ({ player, next }) => {
    const pos = player.getPos();
    if (!pos.ret) return next();

    const { x, y, z } = pos;

    // 14446
    //0:18028:cj_bar2:CJ_nastybar_D2:000000;
    //2:18646:matcolours:blue:000fff;
    const objBed1 = new DynamicObject({
      playerId: player.id,
      modelId: 14446,
      x,
      y,
      z: z + 0.1,
      rx: 0.0,
      ry: 0.0,
      rz: 0.0,
      drawDistance: 300.0,
    });
    objBed1.create();
    objBed1.setMaterial(0, 18028, "cj_bar2", "CJ_nastybar_D2", 0xff000000);
    objBed1.setMaterial(2, 18646, "matcolours", "blue", 0xff000fff);

    // 14446
    //0:0:none:none:000000;
    //1:0:none:none:0000ff;
    //2:14446:carter_block:zebra_skin:000000;
    const objBed2 = new DynamicObject({
      playerId: player.id,
      modelId: 14446,
      x,
      y: y + 2.0,
      z: z + 0.1,
      rx: 0.0,
      ry: 0.0,
      rz: 0.0,
      drawDistance: 300.0,
    });
    objBed2.create();
    objBed2.setMaterial(0, 0, "none", "none", 0xff000000);
    objBed2.setMaterial(1, 0, "none", "none", 0xff0000ff);
    // objBed2.setMaterial(2, 18646, "matcolours", "blue", 0xffffffff);
    objBed2.setMaterial(2, 14446, "carter_block", "mp_carter_wall", 0xffffffff);

    return next();
  });

  // Damian's house object that is crashing in 0.3x
  const crash_hobj = PlayerEvent.onCommandText(
    "crash_hobj",
    ({ player, next }) => {
      const pos = player.getPos();
      if (!pos.ret) return next();
      //2385
      //;index_id:model_id:txd_name:txd_txt:txd_color(0 if no color);
      //;0:2748:pizza_furn:CJ_WOOD6:0;
      //;1:2748:pizza_furn:CJ_WOOD6:A78D84;
      //;2:2748:pizza_furn:CJ_WOOD6:A78D84;
      const objcab = new DynamicObject({
        playerId: player.id,
        modelId: 2385,
        x: pos.x,
        y: pos.y,
        z: pos.z + 0.1,
        rx: 0.0,
        ry: 0.0,
        rz: 0.0,
        drawDistance: 0.0,
      });
      objcab.create();
      objcab.setMaterial(0, 2748, "pizza_furn", "CJ_WOOD6", 0);
      objcab.setMaterial(1, 2748, "pizza_furn", "CJ_WOOD6", 0xffa78d84);
      objcab.setMaterial(2, 2748, "pizza_furn", "CJ_WOOD6", 0xffa78d84);

      // objcab.setMaterial(0, -1, "none", "none", 0xff00aa00);
      // objcab.setMaterial(1, -1, "none", "none", 0xff00aa00);
      // objcab.setMaterial(2, -1, "none", "none", 0xff00aa00);

      return next();
    },
  );

  const removeallbuilding = PlayerEvent.onCommandText(
    "removeallbuilding",
    ({ player, next }) => {
      player.removeBuilding(-1, 0.0, 0.0, 0.0, 6000.0);
      return next();
    },
  );

  const crobj = PlayerEvent.onCommandText(
    "crobj",
    ({ player, subcommand, next }) => {
      const pos = player.getPos();
      if (!pos.ret) return next();
      const { x, y, z } = pos;
      const [modelId] = subcommand;
      new DynamicObject({
        modelId: +modelId,
        x: x + 1.0,
        y: y + 1.0,
        z: z + 0.5,
        rx: 0.0,
        ry: 0.0,
        rz: 0.0,
        drawDistance: 200.0,
      }).create();
      return next();
    },
  );

  const flatbedcontainer = PlayerEvent.onCommandText(
    "flatbedcontainer",
    ({ player, next }) => {
      const create_flatbed = spawnVehicleInFrontOfPlayer(player, 578, -1, -1);
      const obj = new DynamicObject({
        modelId: 19321,
        x: 0,
        y: 0,
        z: 0,
        rx: 0,
        ry: 0,
        rz: 0,
      });
      obj.create();
      obj.attachToVehicle(
        create_flatbed,
        -0.0165,
        -2.066,
        1.2442,
        0.0,
        0.0,
        0.0,
      );
      return next();
    },
  );

  return [
    holdobjectid,
    removeheld,
    attachobj,
    attachtome,
    cfence,
    mfence1,
    mfence2,
    objvehst,
    objlim1,
    editattach,
    editobject,
    selobj,
    canceledit,
    editpobject,
    cam_on_obj,
    cam_on_train,
    crplain,
    testplain,
    testplain2,
    crptex,
    crpmix,
    crptext,
    delptex,
    crashbed,
    crash_hobj,
    removeallbuilding,
    crobj,
    flatbedcontainer,
    () => {
      test_tex_objects.forEach((o) => o.destroy());
      test_tex_objects.length = 0;
    },
  ];
}
