namespace OmpNode.Enum {
  export enum FightingStyles {
    NORMAL,
    BOXING,
    KUNGFU,
    KNEEHEAD,
    GRABKICK,
    ELBOW,
  }

  export enum MapIconStyles {
    LOCAL,
    GLOBAL,
    LOCAL_CHECKPOINT,
    GLOBAL_CHECKPOINT,
  }

  export enum CameraCutStyles {
    MOVE = 1,
    CUT,
  }

  export enum SpectateModes {
    NORMAL = 1,
    FIXED,
    SIDE,
  }

  export enum PlayerState {
    NONE,
    ONFOOT,
    DRIVER,
    PASSENGER,
    EXIT_VEHICLE,
    ENTER_VEHICLE_DRIVER,
    ENTER_VEHICLE_PASSENGER,
    WASTED,
    SPAWNED,
    SPECTATING,
  }

  export enum BodyParts {
    TORSO = 3,
    GROIN,
    LEFT_ARM,
    RIGHT_ARM,
    LEFT_LEG,
    RIGHT_LEG,
    HEAD,
  }
}
