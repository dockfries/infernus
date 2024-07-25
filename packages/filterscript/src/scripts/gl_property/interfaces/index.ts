// Uniq Interiors Interface
export interface E_INTERIORS {
  inIntID: number;
  inExitX: number;
  inExitY: number;
  inExitZ: number;
  inExitA: number;
  inName: string;
}

// Properties Interface
export interface E_PROPERTIES {
  // eInterior: number,
  eType: number;
  eEntX: number;
  eEntY: number;
  eEntZ: number;
  eEntA: number;
  eUniqIntId: number;
  eOwner: number;
  ePrice: number;
  ePname: string;
}
