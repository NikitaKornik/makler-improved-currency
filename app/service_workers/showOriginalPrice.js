const DEFAULT_ORIGINAL_PRICE = true;

const setDefaultOriginalPriceFlag = async function () {
  const isOriginalPriceShown =
    (await chrome.storage.sync.get("isOriginalPriceShown"))
      .isOriginalPriceShown || DEFAULT_ORIGINAL_PRICE;

  chrome.storage.sync.set({ isOriginalPriceShown });
};

setDefaultOriginalPriceFlag();
