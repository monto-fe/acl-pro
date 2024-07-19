import { makeAutoObservable } from "mobx"

import { CurrentUser, initialState } from './user';
import { i18nLocaleDefault } from "./i18n";
import { I18nKey } from "@/@types/i18n";

export const observerRoot = makeAutoObservable({
  user: initialState,
  get userInfo() { return this.user; },
  updateUserInfo(userInfo: CurrentUser) {
    this.user = userInfo;
  },

  i18n: i18nLocaleDefault,
  get i18nLocale() { return this.i18n },
  updateI18n(lang: I18nKey) {
    return this.i18n = lang;
  }
})