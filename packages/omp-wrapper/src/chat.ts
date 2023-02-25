export const ToggleChatTextReplacement = (toggle: boolean): void => {
  samp.callNative("ToggleChatTextReplacement", "i", toggle);
};

export const ChatTextReplacementToggled = (): boolean => {
  return Boolean(samp.callNative("ChatTextReplacementToggled", ""));
};
