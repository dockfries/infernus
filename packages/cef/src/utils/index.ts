export const patchCefNatives = (...args: any[]) => {
  return samp.callPublic("CefNatives", `a`, args);
};
