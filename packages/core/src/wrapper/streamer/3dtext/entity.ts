import { InvalidEnum } from "core/enums";
import type { IDynamic3DTextLabel } from "core/interfaces";
import { rgba } from "core/utils/colorUtils";
import {
  CreateDynamic3DTextLabel,
  CreateDynamic3DTextLabelEx,
  GetDynamic3DTextLabelText,
  UpdateDynamic3DTextLabelText,
} from "core/utils/helperUtils";
import {
  DestroyDynamic3DTextLabel,
  E_STREAMER,
  IsValidDynamic3DTextLabel,
  StreamerDistances,
  StreamerItemTypes,
} from "@infernus/streamer";
import { Streamer } from "../common";
import { streamerFlag } from "../flag";
import { Player, Vehicle } from "core/controllers";

export class Dynamic3DTextLabel {
  static readonly texts = new Map<number, Dynamic3DTextLabel>();

  private sourceInfo: IDynamic3DTextLabel;

  private _id = -1;
  get id(): number {
    return this._id;
  }

  constructor(textLabel: IDynamic3DTextLabel) {
    this.sourceInfo = textLabel;
  }
  create(): this {
    if (this.id !== -1)
      throw new Error("[Streamer3DTextLabel]: Unable to create again");
    let {
      attachedPlayer,
      attachedVehicle,
      testLos,
      streamDistance,
      worldId,
      interiorId,
      playerId,
      areaId,
      priority,
    } = this.sourceInfo;
    const { charset, text, color, drawDistance, x, y, z, extended } =
      this.sourceInfo;

    attachedPlayer ??= InvalidEnum.PLAYER_ID;
    attachedVehicle ??= InvalidEnum.VEHICLE_ID;
    streamDistance ??= StreamerDistances.TEXT_3D_LABEL_SD;
    testLos ??= false;
    priority ??= 0;

    if (extended) {
      if (typeof worldId === "number") worldId = [-1];
      else worldId ??= [-1];
      if (typeof interiorId === "number") interiorId = [-1];
      else interiorId ??= [-1];
      if (typeof playerId === "number") playerId = [-1];
      else playerId ??= [-1];
      if (typeof areaId === "number") areaId = [-1];
      else areaId ??= [-1];

      this._id = CreateDynamic3DTextLabelEx(
        text,
        rgba(color),
        x,
        y,
        z,
        drawDistance,
        attachedPlayer,
        attachedVehicle,
        testLos,
        streamDistance,
        worldId,
        interiorId,
        playerId,
        areaId,
        priority,
        charset || "utf8",
      );
    } else {
      if (Array.isArray(worldId)) worldId = -1;
      else worldId ??= -1;
      if (Array.isArray(interiorId)) interiorId = -1;
      else interiorId ??= -1;
      if (Array.isArray(playerId)) playerId = -1;
      else playerId ??= -1;
      if (Array.isArray(areaId)) areaId = -1;
      else areaId ??= -1;

      this._id = CreateDynamic3DTextLabel(
        charset || "utf8",
        text,
        rgba(color),
        x,
        y,
        z,
        drawDistance,
        attachedPlayer,
        attachedVehicle,
        testLos,
        worldId,
        interiorId,
        playerId,
        streamDistance,
        areaId,
        priority,
      );
    }
    Dynamic3DTextLabel.texts.set(this.id, this);
    return this;
  }
  destroy(): this {
    if (this.id === -1 && !streamerFlag.skip)
      throw new Error("[Streamer3DTextLabel]: Unable to destroy before create");
    if (!streamerFlag.skip) DestroyDynamic3DTextLabel(this.id);
    Dynamic3DTextLabel.texts.delete(this.id);
    this._id = -1;
    return this;
  }
  isValid(): boolean {
    if (streamerFlag.skip && this.id !== -1) return true;
    return IsValidDynamic3DTextLabel(this.id);
  }
  getColor(): string | number {
    if (this.id === -1)
      throw new Error(
        "[Streamer3DTextLabel]: Unable to get color before create",
      );
    return this.sourceInfo.color;
  }
  getCharset(): void | string {
    if (this.id === -1)
      throw new Error(
        "[Streamer3DTextLabel]: Unable to get charset before create",
      );
    return this.sourceInfo.charset;
  }
  getText(): string {
    if (this.id === -1)
      throw new Error(
        "[Streamer3DTextLabel]: Unable to get text before create",
      );
    return GetDynamic3DTextLabelText(
      this.id,
      this.sourceInfo.charset || "utf8",
    );
  }
  updateText(
    color: string | number,
    text: string,
    charset = this.sourceInfo.charset,
  ): number {
    if (this.id === -1)
      throw new Error(
        "[Streamer3DTextLabel]: Unable to update text before create",
      );
    this.sourceInfo.charset = charset;
    return UpdateDynamic3DTextLabelText(
      this.id,
      rgba(color),
      text,
      charset || "utf8",
    );
  }
  toggleCallbacks(toggle = true): number {
    if (this.id === -1)
      throw new Error(
        "[Streamer3DTextLabel]: Unable to toggle callbacks before create",
      );
    return Streamer.toggleItemCallbacks(
      StreamerItemTypes.TEXT_3D_LABEL,
      this.id,
      toggle,
    );
  }
  isToggleCallbacks(): boolean {
    if (this.id === -1) return false;
    return Streamer.isToggleItemCallbacks(
      StreamerItemTypes.TEXT_3D_LABEL,
      this.id,
    );
  }
  setOffsets(offsetX: number, offsetY: number, offsetZ: number) {
    if (this.id === -1) return 0;
    const ret = Streamer.setFloatData(
      StreamerItemTypes.TEXT_3D_LABEL,
      this.id,
      E_STREAMER.ATTACH_OFFSET_X,
      offsetX,
    );
    Streamer.setFloatData(
      StreamerItemTypes.TEXT_3D_LABEL,
      this.id,
      E_STREAMER.ATTACH_OFFSET_Y,
      offsetY,
    );
    Streamer.setFloatData(
      StreamerItemTypes.TEXT_3D_LABEL,
      this.id,
      E_STREAMER.ATTACH_OFFSET_Z,
      offsetZ,
    );
    this.sourceInfo.x = offsetX;
    this.sourceInfo.y = offsetY;
    this.sourceInfo.z = offsetZ;
    return ret;
  }
  attachToPlayer(
    player: Player | InvalidEnum.PLAYER_ID,
    offsetX: number,
    offsetY: number,
    offsetZ: number,
  ): number {
    if (this.id === -1)
      throw new Error(
        "[Streamer3DTextLabel]: Cannot attachToPlayer before created",
      );
    const playerId = typeof player === "number" ? player : player.id;
    const ret = Streamer.setIntData(
      StreamerItemTypes.TEXT_3D_LABEL,
      this.id,
      E_STREAMER.ATTACHED_PLAYER,
      playerId,
    );
    if (playerId !== InvalidEnum.PLAYER_ID) {
      this.setOffsets(offsetX, offsetY, offsetZ);
    }
    this.sourceInfo.attachedPlayer = playerId;
    return ret;
  }
  attachToVehicle(
    vehicle: Vehicle | InvalidEnum.VEHICLE_ID,
    offsetX: number,
    offsetY: number,
    offsetZ: number,
  ): number {
    if (this.id === -1)
      throw new Error(
        "[Streamer3DTextLabel]: Cannot attachToVehicle before created",
      );
    const vehicleId = typeof vehicle === "number" ? vehicle : vehicle.id;
    const ret = Streamer.setIntData(
      StreamerItemTypes.TEXT_3D_LABEL,
      this.id,
      E_STREAMER.ATTACHED_VEHICLE,
      vehicleId,
    );
    if (vehicleId !== InvalidEnum.VEHICLE_ID) {
      this.setOffsets(offsetX, offsetY, offsetZ);
    }
    this.sourceInfo.attachedVehicle = vehicleId;
    return ret;
  }
  static togglePlayerUpdate(player: Player, update = true) {
    return Streamer.toggleItemUpdate(
      player,
      StreamerItemTypes.TEXT_3D_LABEL,
      update,
    );
  }
  static hideForPlayer(player: Player, z = -50000) {
    Streamer.updateEx(player, 0, 0, z);
    return this.togglePlayerUpdate(player, false);
  }
  static showForPlayer(player: Player, z = -50000) {
    const pos = player.getPos();
    if (pos) {
      Streamer.updateEx(player, pos.x, pos.y, pos.z);
    } else {
      Streamer.updateEx(player, 0, 0, z);
    }
    return this.togglePlayerUpdate(player, true);
  }
  static getInstance(id: number) {
    return this.texts.get(id);
  }
  static getInstances() {
    return [...this.texts.values()];
  }
}
