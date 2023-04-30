import { ColorEnum } from "@/filterscripts/a51_base/enums/color";
import type { IA51Options, IGateList } from "@/interfaces";
import { log } from "@/utils/gl_common";
import type { Player, I18n } from "@infernus/core";
import { Dynamic3DTextLabel, Dynamic3dTextLabelEvent } from "@infernus/core";
import { gateInfo } from "./object";
import { playerEvent } from "./player";

const labelGates: Map<number, Array<Dynamic3DTextLabel>> = new Map();

const A51TextLabels = (gate: IGateList, player: Player) => {
  return [
    new Dynamic3DTextLabel({
      text: "",
      colour: ColorEnum.GATES_LABEL,
      x: gate.north.labelPos.x,
      y: gate.north.labelPos.y,
      z: gate.north.labelPos.z,
      drawdistance: 10.5,
      worldid: 0,
      playerid: player.id,
    }),
    new Dynamic3DTextLabel({
      text: "",
      colour: ColorEnum.GATES_LABEL,
      x: gate.east.labelPos.x,
      y: gate.east.labelPos.y,
      z: gate.east.labelPos.z,
      drawdistance: 10.5,
      worldid: 0,
      playerid: player.id,
    }),
  ];
};

export class My3dTextLabelEvent extends Dynamic3dTextLabelEvent<
  Player,
  Dynamic3DTextLabel
> {
  constructor(destroyOnExit: boolean, private i18n: I18n | null) {
    super(playerEvent.getPlayersMap(), destroyOnExit);
  }
  onStreamIn(label: Dynamic3DTextLabel, player: Player) {
    if (!this.i18n) return false;
    const gateIdx = labelGates.get(player.id)?.findIndex((l) => l === label);

    const gateName =
      gateIdx === 1
        ? "a51.objects.gate.name.eastern"
        : "a51.objects.gate.name.northern";

    label.updateText(
      label.getColour() || "#fff",
      this.i18n?.$t(
        "a51.labels.tips",
        [this.i18n?.$t(gateName, null, player.locale)],
        player.locale
      ) || "",
      player.charset
    );
    return true;
  }
}

export const loadLabels = (p: Player, options: IA51Options, i18n: I18n) => {
  labelGates.set(p.id, A51TextLabels(gateInfo, p));
  labelGates.get(p.id)?.forEach((t) => t.create()?.toggleCallbacks());
  log(options, `  |--  ${i18n?.$t("a51.labels.created")}`);
};

export const unloadLabels = (options: IA51Options, i18n: I18n, p?: Player) => {
  if (p) {
    labelGates.get(p.id)?.forEach((t) => t.isValid() && t.destroy());
    labelGates.delete(p.id);
  } else {
    labelGates.forEach((v) => v.forEach((t) => t.isValid() && t.destroy()));
  }
  log(options, `  |--  ${i18n?.$t("a51.labels.destroyed")}`);
};

export const registerLabelEvent = (options: IA51Options, i18n: I18n) => {
  new My3dTextLabelEvent(false, i18n);
  log(options, "  |---------------------------------------------------");
};
