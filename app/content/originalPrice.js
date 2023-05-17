const ORIGINAL_PRICE_STYLES_ID = "original-price-styles";

async function getIsOriginalPrice() {
  return (await chrome.storage.sync.get("isOriginalPriceShown"))
    .isOriginalPriceShown;
}

function injectOriginalPriceCSS() {
  const styles = document.createElement("link");
  styles.setAttribute("rel", "stylesheet");
  styles.setAttribute("href", chrome.runtime.getURL("originalPrice.css"));
  styles.setAttribute("id", ORIGINAL_PRICE_STYLES_ID);
  document.head.appendChild(styles);
}

function removeOriginalPriceCSS() {
  const styles = document.getElementById(ORIGINAL_PRICE_STYLES_ID);

  if (styles) {
    styles.remove();
  }
}

(async function () {
  const isOriginalPrice = await getIsOriginalPrice();

  if (isOriginalPrice) {
    injectOriginalPriceCSS();
  }
})();

chrome.storage.onChanged.addListener(({ isOriginalPriceShown }) => {
  if (isOriginalPriceShown) {
    if (isOriginalPriceShown.newValue) {
      injectOriginalPriceCSS();
    } else {
      removeOriginalPriceCSS();
    }
  }
});
