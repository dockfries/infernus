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
  modelid: number;
  bone: number;
  fScaleX: number;
  fScaleY: number;
  fScaleZ: number;
  materialcolor1: number;
  materialcolor2: number;
}

export interface IMaterial {
  modelid: number;
  txdname: string;
  texturename: string;
  materialcolor: number;
}

export interface IMaterialText {
  text: string;
  materialsize: number;
  fontface: string;
  fontsize: number;
  bold: number;
  fontcolor: number;
  backcolor: number;
  textalignment: number;
}

export interface IAttachedData {
  attached_vehicleid: number;
  attached_objectid?: number;
  attached_playerid: number;
}
