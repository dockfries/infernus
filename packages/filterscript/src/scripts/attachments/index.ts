//-------------------------------------------------
//
// This is an example of using the EditAttachedObject functions
// to allow the player to customize their character.
//
// h02 2012
//
// SA-MP 0.3e and above
//
//-------------------------------------------------

import type { IFilterScript } from "@infernus/core";
import {
  Dialog,
  DialogStylesEnum,
  DynamicObjectEvent,
  LimitsEnum,
  PlayerEvent,
} from "@infernus/core";
import { attachmentBones, attachmentObjects } from "./constants";

export const Attachments: IFilterScript = {
  name: "attachments",
  load() {
    const offCommand = PlayerEvent.onCommandText(
      "attachments",
      async ({ player, next }) => {
        let attachmentIndexSel = 0;
        let attachmentModelSel = 0;

        let slotUsedInfo = "";
        for (let x = 0; x < LimitsEnum.MAX_PLAYER_ATTACHED_OBJECTS; x++) {
          if (player.isAttachedObjectSlotUsed(x))
            slotUsedInfo += `${x} (Used)\n`;
          else slotUsedInfo += `${x}\n`;
        }
        const INDEX_SELECTION = await new Dialog({
          style: DialogStylesEnum.LIST,
          caption: "{FF0000}Attachment Modification - Index Selection",
          info: slotUsedInfo,
          button1: "Select",
          button2: "Cancel",
        }).show(player);

        if (!INDEX_SELECTION.response) return next();

        attachmentIndexSel = INDEX_SELECTION.listItem;

        if (player.isAttachedObjectSlotUsed(attachmentIndexSel)) {
          const EDIT_REPLACE = await new Dialog({
            style: DialogStylesEnum.MSGBOX,
            caption: "{FF0000}Attachment Modification",
            info: "Do you wish to edit the attachment in that slot, or delete it?",
            button1: "Edit",
            button2: "Delete",
          }).show(player);

          if (EDIT_REPLACE.response) {
            player.editAttachedObject(attachmentIndexSel);
          } else {
            player.removeAttachedObject(attachmentIndexSel);
          }
          return next();
        }

        const attachmentNames = attachmentObjects
          .map((item) => item[1])
          .join("\n");

        const MODEL_SELECTION = await new Dialog({
          style: DialogStylesEnum.LIST,
          caption: "{FF0000}Attachment Modification - Model Selection",
          info: attachmentNames,
          button1: "Select",
          button2: "Cancel",
        }).show(player);

        if (!MODEL_SELECTION.response) return next();

        attachmentModelSel = attachmentObjects[MODEL_SELECTION.listItem][0];

        const boneNames = attachmentBones.join("\n");

        const BONE_SELECTION = await new Dialog({
          style: DialogStylesEnum.LIST,
          caption: "{FF0000}Attachment Modification - Bone Selection",
          info: boneNames,
          button1: "Select",
          button2: "Cancel",
        }).show(player);

        if (!BONE_SELECTION.response) return next();

        player.setAttachedObject(
          attachmentIndexSel,
          attachmentModelSel,
          BONE_SELECTION.listItem + 1,
        );
        player.editAttachedObject(attachmentIndexSel);
        player.sendClientMessage(
          "#fff",
          "Hint: Use {FFFF00}~k~~PED_SPRINT~{FFFFFF} to look around.",
        );

        return next();
      },
    );

    const offAttached = DynamicObjectEvent.onPlayerEditAttached(
      ({
        player,
        next,
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
      }) => {
        const debug_string = `SetPlayerAttachedObject(${player.id}, ${index},${modelId},${boneId},\
          ${fOffsetX},${fOffsetY},${fOffsetZ},${fRotX},${fRotY},${fRotZ},${fScaleX},${fScaleY},${fScaleZ})`;
        console.log(debug_string);

        player.sendClientMessage("#fff", debug_string);
        player.setAttachedObject(
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
        );
        player.sendClientMessage(
          "#fff",
          "You finished editing an attached object",
        );
        return next();
      },
    );

    return [offCommand, offAttached];
  },
  unload() {},
};
