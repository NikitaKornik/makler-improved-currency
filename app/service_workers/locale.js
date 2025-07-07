import { availableLanguages, langCodesMap } from "../constants/languages.js";

const browserLanguage = chrome.i18n.getUILanguage();

const defaultLocale =
  langCodesMap[String(browserLanguage).toLowerCase()] || availableLanguages.en;

const setDefaultLocale = async function () {
  const language =
    (await chrome.storage.sync.get("locale")).locale || defaultLocale;

  chrome.storage.sync.set({ language });
};

setDefaultLocale();
