const DEFAULT_CURRENCY = "USD";

const setDefaultCurrency = async function () {
  const preferredCurrency =
    (await chrome.storage.sync.get("preferredCurrency")).preferredCurrency ||
    DEFAULT_CURRENCY;

  chrome.storage.sync.set({ preferredCurrency });
};

setDefaultCurrency();
