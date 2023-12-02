export interface IObjectPos {
  fX: number;
  fY: number;
  fZ: number;
}

export interface IObjectRotPos extends IObjectPos {
  fRotX: number;
  fRotY: number;
  fRotZ: number;
}
export interface IAttachedObject extends IObjectRotPos {
  modelId: number;
  bone: number;
  fScaleX: number;
  fScaleY: number;
  fScaleZ: number;
  materialColor1: number;
  materialColor2: number;
}

export interface IMaterial {
  modelId: number;
  txdName: string;
  textureName: string;
  materialColor: number;
}

export interface IMaterialText {
  text: string;
  materialSize: number;
  fontFace: string;
  fontsize: number;
  bold: number;
  fontColor: number;
  backColor: number;
  textAlignment: number;
}

export interface IAttachedData {
  attached_vehicleId: number;
  attached_objectId?: number;
  attached_playerId: number;
}
