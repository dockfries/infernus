export const PROP_VW = 10000;
export const MAX_INTERIORS = 146;

export const TYPE_EMPTY = 0;
export const TYPE_HOUSE = 1;
export const TYPE_BUSINESS = 2;
export const TYPE_BANK = 3;
export const TYPE_COP = 4;

//  [ Array of property type iconid's and strings for property type ]
export const propIcons = [
  [0, ""], // TYPE_EMPTY ( not used )
  [1273, "House"], // TYPE_HOUSE green house icon
  [1272, "Business"], // TYPE_BUSINESS blue house icon
  [1274, "Bank"], // TYPE_BANK dollar sign icon
  [1247, "Police Station"], // TYPE_COP Bribe Star 1247
] as const;

export const propFile = [
  // "blank",
  "properties/houses.txt",
  "properties/businesses.txt",
  "properties/banks.txt",
  "properties/police.txt",
] as const;
