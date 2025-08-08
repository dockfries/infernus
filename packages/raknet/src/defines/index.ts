if (!samp.defined) {
  samp.defined = {};
}

samp.defined.PAWNRAKNET_INC_ = true;

export const PR_MAX_HANDLERS = 256;
export const PR_MAX_WEAPON_SLOTS = 13;

export const PR_BITS_TO_BYTES = (bits: number) => Math.ceil(bits / 8);
export const PR_BYTES_TO_BITS = (bytes: number) => bytes * 8;
