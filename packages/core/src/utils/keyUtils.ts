import type { KeysEnum } from "core/enums";

export function isHolding(newKeys: KeysEnum, key: KeysEnum) {
  return (newKeys & key) === key;
}

export function isPressed(newKeys: KeysEnum, oldKeys: KeysEnum, key: KeysEnum) {
  return (newKeys & key) === key && (oldKeys & key) !== key;
}

export function isPressing(keys: KeysEnum, key: KeysEnum) {
  return Boolean(keys & key);
}

export function isReleased(
  newKeys: KeysEnum,
  oldKeys: KeysEnum,
  key: KeysEnum,
) {
  return (newKeys & key) !== key && (oldKeys & key) === key;
}
