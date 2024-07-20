export const TOTAL_ITEMS = 207;
export const SELECTION_ITEMS = 21;
export const ITEMS_PER_LINE = 7;

export const HEADER_TEXT = "Vehicles";
export const NEXT_TEXT = "Next";
export const PREV_TEXT = "Prev";

export const DIALOG_BASE_X = 75.0;
export const DIALOG_BASE_Y = 130.0;
export const DIALOG_WIDTH = 550.0;
export const DIALOG_HEIGHT = 180.0;
export const SPRITE_DIM_X = 60.0;
export const SPRITE_DIM_Y = 70.0;

const excludedNumbers = [449, 537, 538, 569, 570];
const start = 400;
const end = 611;
const fullRange = Array.from({ length: end - start + 1 }, (_, i) => start + i);
export const gItemList = fullRange.filter(
  (num) => !excludedNumbers.includes(num),
);
