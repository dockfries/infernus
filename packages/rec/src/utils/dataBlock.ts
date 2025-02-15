import { RecordTypesEnum } from "../enums";
import { Field } from "./decorators";

export abstract class DataBlock {}

export class HeaderDataBlock extends DataBlock {
  @Field("uint32_t", -2)
  version: number = 1000;

  @Field("uint32_t", -1)
  type: number = RecordTypesEnum.NONE;

  // Custom field not present in .rec file
  hydra: boolean = false;
}

export class OnFootDataBlock extends DataBlock {
  @Field("uint32_t", 0)
  time: number = 0;

  @Field("int16_t", 1)
  leftRight: number = 0;

  @Field("int16_t", 2)
  upDown: number = 0;

  @Field("uint16_t", 3)
  keys: number = 0;

  @Field("float", 4)
  position: [number, number, number] = [0, 0, 0];

  @Field("float", 5)
  rotation: [number, number, number, number] = [0, 0, 0, 0];

  @Field("uint8_t", 6)
  health: number = 0;

  @Field("uint8_t", 7)
  armour: number = 0;

  @Field("struct", 8, [
    { type: "uint8_t", field: "weaponId", bitWidth: 6 },
    { type: "uint8_t", field: "yesNoBack", bitWidth: 2 },
  ])
  weaponIdYesNoBack: {
    weaponId: number;
    yesNoBack: number;
  } = {
    weaponId: 0,
    yesNoBack: 0,
  };

  @Field("uint8_t", 9)
  specialAction: number = 0;

  @Field("float", 10)
  velocity: [number, number, number] = [0, 0, 0];

  @Field("float", 11)
  surfing: [number, number, number] = [0, 0, 0];

  @Field("uint16_t", 12)
  surfingId: number = 0;

  @Field("uint16_t", 13)
  animationId: number = 0;

  @Field("struct", 14, [
    { type: "uint8_t", field: "animationDelta" },
    { type: "bool", field: "animationLoop", bitWidth: 1 },
    { type: "bool", field: "animationLockX", bitWidth: 1 },
    { type: "bool", field: "animationLockY", bitWidth: 1 },
    { type: "bool", field: "animationFreeze", bitWidth: 1 },
    { type: "uint8_t", field: "animationTime", bitWidth: 4 },
  ])
  animationFlags: {
    animationDelta: number;
    animationLoop: boolean;
    animationLockX: boolean;
    animationLockY: boolean;
    animationFreeze: boolean;
    animationTime: number;
  } = {
    animationDelta: 0,
    animationLoop: false,
    animationLockX: false,
    animationLockY: false,
    animationFreeze: false,
    animationTime: 0,
  };
}

export class VehicleDataBlock extends DataBlock {
  @Field("uint32_t", 0)
  time: number = 0;

  @Field("uint16_t", 11)
  vehicleId: number = 0;

  @Field("int16_t", 12)
  leftRight: number = 0;

  @Field("int16_t", 13)
  upDown: number = 0;

  @Field("uint16_t", 14)
  keys: number = 0;

  @Field("float", 15)
  rotation: [number, number, number, number] = [0, 0, 0, 0];

  @Field("float", 16)
  position: [number, number, number] = [0, 0, 0];

  @Field("float", 17)
  velocity: [number, number, number] = [0, 0, 0];

  @Field("float", 18)
  vehicleHealth: number = 0;

  @Field("uint8_t", 19)
  health: number = 0;

  @Field("uint8_t", 20)
  armour: number = 0;

  @Field("struct", 21, [
    { type: "uint8_t", field: "weaponId", bitWidth: 6 },
    { type: "uint8_t", field: "yesNoBack", bitWidth: 2 },
  ])
  weaponIdYesNoBack: {
    weaponId: number;
    yesNoBack: number;
  } = {
    weaponId: 0,
    yesNoBack: 0,
  };

  @Field("bool", 22)
  sirenState: boolean = false;

  @Field("bool", 23)
  gearState: boolean = false;

  @Field("uint16_t", 24)
  trailerId: number = 0;

  @Field("union", 25, [
    { type: "uint16_t", field: "hydraThrustAngle" },
    { type: "float", field: "trainSpeed" },
  ])
  hydraThrustAngleTrainSpeed: {
    hydraThrustAngle: [number, number];
    trainSpeed: number;
  } = {
    hydraThrustAngle: [0, 0],
    trainSpeed: 0,
  };
}
