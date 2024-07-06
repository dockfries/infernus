//
// Generic Special Actions And Anims
// kyeman 2007
//

import type { Player } from "@infernus/core";
import {
  KeysEnum,
  PlayerEvent,
  PlayerStateEnum,
  SpecialActionsEnum,
  TextDraw,
} from "@infernus/core";
import { isKeyJustDown } from "filterscript/utils/gl_common";
import { onFootList, preloadAnimLibs } from "./constants";
import type { IGlActionsFS } from "./interfaces";

const gPlayerUsingLoopingAnim = new Set<Player>();
const gPlayerAnimLibsPreloaded = new Set<Player>();

let txtAnimHelper: TextDraw | null = null;

function onePlayAnim(
  player: Player,
  animLib: string,
  animName: string,
  speed: number,
  looping: boolean,
  lockX: boolean,
  lockY: boolean,
  freeze: boolean,
  time = 0,
) {
  player.applyAnimation(
    animLib,
    animName,
    speed,
    looping,
    lockX,
    lockY,
    freeze,
    time,
  );
}

function loopingAnim(
  player: Player,
  animLib: string,
  animName: string,
  speed: number,
  looping: boolean,
  lockX: boolean,
  lockY: boolean,
  freeze: boolean,
  time = 0,
) {
  gPlayerUsingLoopingAnim.add(player);
  player.applyAnimation(
    animLib,
    animName,
    speed,
    looping,
    lockX,
    lockY,
    freeze,
    time,
  );
  txtAnimHelper!.show(player);
}

function stopLoopingAnim(player: Player) {
  gPlayerUsingLoopingAnim.delete(player);
  player.applyAnimation(
    "CARRY",
    "crry_prtial",
    4.0,
    false,
    false,
    false,
    false,
  );
  if (!player.isControllable()) {
    player.toggleControllable(true);
  }
  txtAnimHelper?.hide(player);
}

function preloadAnimLib(player: Player, animlib: string) {
  player.applyAnimation(animlib, "null", 4.1, false, false, false, false);
}

export const GlActions: IGlActionsFS = {
  name: "gl_actions",
  load(options) {
    // Init our text display
    txtAnimHelper = new TextDraw({
      x: 610.0,
      y: 400.0,
      text: "~r~~k~~PED_SPRINT~ ~w~to stop the animation",
    });
    txtAnimHelper.create();
    txtAnimHelper.useBox(false);
    txtAnimHelper.setFont(2);
    txtAnimHelper.setShadow(0); // no shadow
    txtAnimHelper.setOutline(1); // thickness 1
    txtAnimHelper.setBackgroundColors(0x000000ff);
    txtAnimHelper.setColor(0xffffffff);
    txtAnimHelper.setAlignment(3); // align right

    const onKeyStateChange = PlayerEvent.onKeyStateChange(
      ({ player, newKeys, oldKeys, next }) => {
        if (!gPlayerUsingLoopingAnim.has(player)) return next();

        if (isKeyJustDown(KeysEnum.SPRINT, newKeys, oldKeys)) {
          stopLoopingAnim(player);
          txtAnimHelper!.hide(player);
        }

        return next();
      },
    );

    const onDeath = PlayerEvent.onDeath(({ player, next }) => {
      // if they die whilst performing a looping anim, we should reset the state
      if (gPlayerUsingLoopingAnim.has(player)) {
        gPlayerUsingLoopingAnim.delete(player);
        txtAnimHelper!.hide(player);
      }
      return next();
    });

    const onSpawn = PlayerEvent.onSpawn(({ player, next }) => {
      if (!gPlayerAnimLibsPreloaded.has(player)) {
        preloadAnimLibs.forEach((anim) => {
          preloadAnimLib(player, anim);
        });
        gPlayerAnimLibsPreloaded.add(player);
      }
      return next();
    });

    const onConnect = PlayerEvent.onConnect(({ player, next }) => {
      gPlayerUsingLoopingAnim.delete(player);
      gPlayerAnimLibsPreloaded.delete(player);
      return next();
    });

    const animlist = PlayerEvent.onCommandText(
      "animlist",
      ({ player, next }) => {
        player.sendClientMessage(0xafafafaa, "Available Animations:");
        player.sendClientMessage(
          0xafafafaa,
          "/handsup /drunk /bomb /getarrested /laugh /lookout /robman",
        );
        player.sendClientMessage(
          0xafafafaa,
          "/crossarms /lay /hide /vomit /eat /wave /taichi",
        );
        player.sendClientMessage(
          0xafafafaa,
          "/deal /crack /smokem /smokef /groundsit /chat /dance /f**ku",
        );
        return next();
      },
    );

    const amcuffed = PlayerEvent.onCommandText(
      "amcuffed",
      ({ player, next }) => {
        // note: the cuffs have not been scaled for all player models
        player.setAttachedObject(
          8,
          19418,
          6,
          -0.031999,
          0.024,
          -0.024,
          -7.9,
          -32.000011,
          -72.299987,
          1.115998,
          1.322,
          1.406,
        );
        player.setSpecialAction(SpecialActionsEnum.CUFFED);
        return next();
      },
    );

    const uncuffme = PlayerEvent.onCommandText(
      "uncuffme",
      ({ player, next }) => {
        if (player.isAttachedObjectSlotUsed(8)) {
          player.removeAttachedObject(8);
        }
        player.setSpecialAction(SpecialActionsEnum.NONE);
        return next();
      },
    );

    PlayerEvent.onCommandReceived(({ player, command, next }) => {
      if (onFootList.findIndex((o) => o === command) > -1) {
        // We don't handle anything else after this that can be used in vehicles
        if (player.getState() !== PlayerStateEnum.ONFOOT) {
          return false;
        }
      }
      return next();
    });

    // HANDSUP
    const handsup = PlayerEvent.onCommandText("handsup", ({ player, next }) => {
      player.setSpecialAction(SpecialActionsEnum.HANDSUP);
      return next();
    });

    // CELLPHONE IN
    const cellin = PlayerEvent.onCommandText("cellin", ({ player, next }) => {
      player.setSpecialAction(SpecialActionsEnum.USECELLPHONE);
      return next();
    });

    // CELLPHONE OUT
    const cellout = PlayerEvent.onCommandText("cellout", ({ player, next }) => {
      player.setSpecialAction(SpecialActionsEnum.STOPUSECELLPHONE);
      return next();
    });

    // Drunk
    const drunk = PlayerEvent.onCommandText("drunk", ({ player, next }) => {
      loopingAnim(player, "PED", "WALK_DRUNK", 4.0, true, true, true, true);
      return next();
    });

    // Place a Bomb
    const bomb = PlayerEvent.onCommandText("bomb", ({ player, next }) => {
      player.clearAnimations();
      onePlayAnim(
        player,
        "BOMBER",
        "BOM_Plant",
        4.0,
        false,
        false,
        false,
        false,
      ); // Place Bomb
      return next();
    });

    // Police Arrest
    const getarrested = PlayerEvent.onCommandText(
      "getarrested",
      ({ player, next }) => {
        loopingAnim(
          player,
          "ped",
          "ARRESTgun",
          4.0,
          false,
          true,
          true,
          true,
          -1,
        ); // Gun Arrest
        return next();
      },
    );

    // Laugh
    const laugh = PlayerEvent.onCommandText("laugh", ({ player, next }) => {
      onePlayAnim(
        player,
        "RAPPING",
        "Laugh_01",
        4.0,
        false,
        false,
        false,
        false,
      ); // Laugh
      return next();
    });

    // Rob Lookout
    const lookout = PlayerEvent.onCommandText("lookout", ({ player, next }) => {
      onePlayAnim(
        player,
        "SHOP",
        "ROB_Shifty",
        4.0,
        false,
        false,
        false,
        false,
      ); // Rob Lookout
      return next();
    });

    // Rob Threat
    const robman = PlayerEvent.onCommandText("robman", ({ player, next }) => {
      loopingAnim(
        player,
        "SHOP",
        "ROB_Loop_Threat",
        4.0,
        true,
        false,
        false,
        false,
      ); // Rob
      return next();
    });
    // Arms crossed
    const crossarms = PlayerEvent.onCommandText(
      "crossarms",
      ({ player, next }) => {
        loopingAnim(
          player,
          "COP_AMBIENT",
          "Coplook_loop",
          4.0,
          false,
          true,
          true,
          true,
          -1,
        ); // Arms crossed
        return next();
      },
    );
    // Lay Down
    const lay = PlayerEvent.onCommandText("lay", ({ player, next }) => {
      loopingAnim(player, "BEACH", "bather", 4.0, true, false, false, false); // Lay down
      return next();
    });
    // Take Cover
    const hide = PlayerEvent.onCommandText("hide", ({ player, next }) => {
      loopingAnim(player, "ped", "cower", 3.0, true, false, false, false); // Taking Cover
      return next();
    });
    // Vomit
    const vomit = PlayerEvent.onCommandText("vomit", ({ player, next }) => {
      onePlayAnim(
        player,
        "FOOD",
        "EAT_Vomit_P",
        3.0,
        false,
        false,
        false,
        false,
      ); // Vomit BAH!
      return next();
    });
    // Eat Burger
    const eat = PlayerEvent.onCommandText("eat", ({ player, next }) => {
      onePlayAnim(
        player,
        "FOOD",
        "EAT_Burger",
        3.0,
        false,
        false,
        false,
        false,
      ); // Eat Burger
      return next();
    });
    // Wave
    const wave = PlayerEvent.onCommandText("wave", ({ player, next }) => {
      loopingAnim(
        player,
        "ON_LOOKERS",
        "wave_loop",
        4.0,
        true,
        false,
        false,
        false,
      ); // Wave
      return next();
    });
    // Slap Ass
    const slapass = PlayerEvent.onCommandText("slapass", ({ player, next }) => {
      onePlayAnim(
        player,
        "SWEET",
        "sweet_ass_slap",
        4.0,
        false,
        false,
        false,
        false,
      ); // Ass Slapping
      return next();
    });
    // Dealer
    const deal = PlayerEvent.onCommandText("deal", ({ player, next }) => {
      onePlayAnim(
        player,
        "DEALER",
        "DEALER_DEAL",
        4.0,
        false,
        false,
        false,
        false,
      ); // Deal Drugs
      return next();
    });
    // Crack Dieing
    const crack = PlayerEvent.onCommandText("crack", ({ player, next }) => {
      loopingAnim(player, "CRACK", "crckdeth2", 4.0, true, false, false, false); // Dieing of Crack
      return next();
    });
    // Male Smoking
    const smokem = PlayerEvent.onCommandText("smokem", ({ player, next }) => {
      loopingAnim(
        player,
        "SMOKING",
        "M_smklean_loop",
        4.0,
        true,
        false,
        false,
        false,
      ); // Smoke
      return next();
    });
    // Female Smoking
    const smokef = PlayerEvent.onCommandText("smokef", ({ player, next }) => {
      loopingAnim(
        player,
        "SMOKING",
        "F_smklean_loop",
        4.0,
        true,
        false,
        false,
        false,
      ); // Female Smoking
      return next();
    });
    // Sit
    const groundsit = PlayerEvent.onCommandText(
      "groundsit",
      ({ player, next }) => {
        loopingAnim(
          player,
          "BEACH",
          "ParkSit_M_loop",
          4.0,
          true,
          false,
          false,
          false,
        ); // Sit
        return next();
      },
    );
    // Idle Chat
    const chat = PlayerEvent.onCommandText("chat", ({ player, next }) => {
      onePlayAnim(player, "PED", "IDLE_CHAT", 4.0, false, false, false, false);
      return next();
    });
    // Fucku
    const fucku = PlayerEvent.onCommandText("fucku", ({ player, next }) => {
      onePlayAnim(player, "PED", "fucku", 4.0, false, false, false, false);
      return next();
    });
    // TaiChi
    const taichi = PlayerEvent.onCommandText("taichi", ({ player, next }) => {
      loopingAnim(
        player,
        "PARK",
        "Tai_Chi_Loop",
        4.0,
        true,
        false,
        false,
        false,
      );
      return next();
    });

    // ChairSit
    const chairsit = PlayerEvent.onCommandText(
      "chairsit",
      ({ player, next }) => {
        loopingAnim(
          player,
          "BAR",
          "dnk_stndF_loop",
          4.0,
          true,
          false,
          false,
          false,
        );
        return next();
      },
    );

    // Collapse
    const collapse = PlayerEvent.onCommandText(
      "collapse",
      ({ player, next }) => {
        loopingAnim(
          player,
          "PED",
          "FALL_COLLAPSE",
          4.0,
          true,
          false,
          false,
          false,
        );
        return next();
      },
    );

    // fall
    const fallover = PlayerEvent.onCommandText(
      "fallover",
      ({ player, next }) => {
        loopingAnim(player, "PED", "FALL_FALL", 4.0, true, false, false, false);
        return next();
      },
    );

    // ko
    const ko1 = PlayerEvent.onCommandText("ko1", ({ player, next }) => {
      loopingAnim(
        player,
        "PED",
        "KO_SHOT_STOM",
        200.0,
        false,
        true,
        true,
        true,
        -1,
      );
      return next();
    });

    // ko
    const ko2 = PlayerEvent.onCommandText("ko2", ({ player, next }) => {
      loopingAnim(
        player,
        "PED",
        "KO_SHOT_FACE",
        4.0,
        false,
        true,
        true,
        true,
        -1,
      );
      return next();
    });

    const floorhit = PlayerEvent.onCommandText(
      "floorhit",
      ({ player, next }) => {
        player.applyAnimation(
          "PED",
          "FLOOR_hit_f",
          4.1,
          false,
          false,
          false,
          true,
        );
        return next();
      },
    );

    // Would allow people to troll... but would be cool as a script controlled function
    // Bed Sleep R
    let inbedright: ReturnType<typeof PlayerEvent.onCommandText> | null = null,
      inbedleft: ReturnType<typeof PlayerEvent.onCommandText> | null = null;
    if (options && options.useBedAnim) {
      inbedright = PlayerEvent.onCommandText(
        "inbedright",
        ({ player, next }) => {
          loopingAnim(
            player,
            "INT_HOUSE",
            "BED_Loop_R",
            4.0,
            false,
            true,
            true,
            true,
          );
          return next();
        },
      );

      // Bed Sleep L
      inbedleft = PlayerEvent.onCommandText("inbedleft", ({ player, next }) => {
        loopingAnim(
          player,
          "INT_HOUSE",
          "BED_Loop_L",
          4.0,
          true,
          false,
          false,
          false,
        );
        return next();
      });
    }

    // START DANCING
    const dance = PlayerEvent.onCommandText(
      "dance",
      ({ player, subcommand, next }) => {
        // Get the dance style param
        const tmp = subcommand[0];
        if (!tmp || tmp.length > 2) {
          player.sendClientMessage(0xff0000ff, "USAGE: /dance [style 1-4]");
          return next();
        }

        const danceStyle = +tmp;
        if (danceStyle < 1 || danceStyle > 4) {
          player.sendClientMessage(0xff0000ff, "USAGE: /dance [style 1-4]");
          return next();
        }

        if (danceStyle === 1) {
          player.setSpecialAction(SpecialActionsEnum.DANCE1);
        } else if (danceStyle === 2) {
          player.setSpecialAction(SpecialActionsEnum.DANCE2);
        } else if (danceStyle === 3) {
          player.setSpecialAction(SpecialActionsEnum.DANCE3);
        } else if (danceStyle === 4) {
          player.setSpecialAction(SpecialActionsEnum.DANCE4);
        }
        return next();
      },
    );

    const offs = [
      onKeyStateChange,
      onDeath,
      onSpawn,
      onConnect,

      animlist,
      amcuffed,
      uncuffme,

      handsup,
      cellin,
      cellout,
      drunk,
      bomb,
      getarrested,
      laugh,
      lookout,
      robman,
      crossarms,
      lay,
      hide,
      vomit,
      eat,
      wave,
      slapass,
      deal,
      crack,
      smokem,
      smokef,
      groundsit,
      chat,
      fucku,
      taichi,
      chairsit,
      collapse,
      fallover,
      ko1,
      ko2,
      floorhit,
      dance,
    ];

    if (options && options.useBedAnim) {
      offs.push(inbedright!, inbedleft!);
    }

    return offs;
  },
  unload() {
    [...gPlayerUsingLoopingAnim.values()].forEach((player) => {
      stopLoopingAnim(player);
    });

    txtAnimHelper!.destroy();
    txtAnimHelper = null;

    gPlayerAnimLibsPreloaded.clear();
  },
};
