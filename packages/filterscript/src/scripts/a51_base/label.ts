import { ColorEnum } from "filterscript/scripts/a51_base/enums/color";
import { log } from "filterscript/utils/gl_common";
import type { Player, I18n } from "@infernus/core";
import { Dynamic3DTextLabel, Dynamic3DTextLabelEvent } from "@infernus/core";
import { gateInfo } from "./object";
import type { IA51BaseFSOptions, IGateList } from "./interfaces";

const labelGates: Map<number, Array<Dynamic3DTextLabel>> = new Map();

const A51TextLabels = (gate: IGateList, player: Player) => {
  return [
    new Dynamic3DTextLabel({
      text: "",
      color: ColorEnum.GATES_LABEL,
      x: gate.north.labelPos.x,
      y: gate.north.labelPos.y,
      z: gate.north.labelPos.z,
      drawDistance: 10.5,
      worldId: 0,
      playerId: player.id,
    }),
    new Dynamic3DTextLabel({
      text: "",
      color: ColorEnum.GATES_LABEL,
      x: gate.east.labelPos.x,
      y: gate.east.labelPos.y,
      z: gate.east.labelPos.z,
      drawDistance: 10.5,
      worldId: 0,
      playerId: player.id,
    }),
  ];
};

export const loadLabels = (
  p: Player,
  options: IA51BaseFSOptions,
  i18n: I18n,
) => {
  labelGates.set(p.id, A51TextLabels(gateInfo, p));
  labelGates.get(p.id)?.forEach((t) => t.create()?.toggleCallbacks());
  log(options, `  |--  ${i18n?.$t("a51.labels.created")}`);
};

export const unloadLabels = (
  options: IA51BaseFSOptions,
  i18n: I18n,
  p?: Player,
) => {
  if (p) {
    labelGates.get(p.id)?.forEach((t) => t.isValid() && t.destroy());
    labelGates.delete(p.id);
  } else {
    labelGates.forEach((v) => v.forEach((t) => t.isValid() && t.destroy()));
  }
  log(options, `  |--  ${i18n?.$t("a51.labels.destroyed")}`);
};

export const registerLabelEvent = (options: IA51BaseFSOptions, i18n: I18n) => {
  const onStreamIn = Dynamic3DTextLabelEvent.onStreamIn(
    ({ instance: label, player, next }) => {
      if (!i18n) return false;
      const gateIdx = labelGates.get(player.id)?.findIndex((l) => l === label);

      const gateName =
        gateIdx === 1
          ? "a51.objects.gate.name.eastern"
          : "a51.objects.gate.name.northern";

      label.updateText(
        label.getColor() || "#fff",
        i18n?.$t(
          "a51.labels.tips",
          [i18n?.$t(gateName, null, player.locale)],
          player.locale,
        ) || "",
        player.charset,
      );
      return next();
    },
  );

  log(options, "  |---------------------------------------------------");

  return onStreamIn;
};
