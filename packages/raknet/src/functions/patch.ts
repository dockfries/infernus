export const patchRakNetNative = (...args: any[]) => {
  return samp.callPublic("RakNetNative", `a`, args);
};
