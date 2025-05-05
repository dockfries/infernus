import { I18n } from "@infernus/core";
import en_US from "./en-US";
import zh_CN from "./zh-CN";
import ru from "./ru";

const locales = {
  en_US,
  zh_CN,
  ru,
};

export const i18n = new I18n("en_US", locales);
export const { $t } = i18n;
