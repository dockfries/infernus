namespace OmpNode.Enum {
  export enum ObjectMaterialTextSize {
    SIZE_32x32 = 10,
    SIZE_64x32 = 20,
    SIZE_64x64 = 30,
    SIZE_128x32 = 40,
    SIZE_128x64 = 50,
    SIZE_128x128 = 60,
    SIZE_256x32 = 70,
    SIZE_256x64 = 80,
    SIZE_256x128 = 90,
    SIZE_256x256 = 100,
    SIZE_512x64 = 110,
    SIZE_512x128 = 120,
    SIZE_512x256 = 130,
    SIZE_512x512 = 140,
  }
  export enum ObjectMaterialAlignmment {
    LEFT,
    CENTER,
    RIGHT,
  }
  export enum SelectObjectTypes {
    GLOBAL_OBJECT = 1,
    PLAYER_OBJECT,
  }
}
