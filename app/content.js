const ORIGINAL_PRICE_STYLES_ID = "original-price-styles";

const fragments = [
  { fragment: "$", sign: "USD" },
  { fragment: "USD", sign: "USD" },
  { fragment: "€", sign: "EUR" },
  { fragment: "EUR", sign: "EUR" },
  { fragment: "руб", sign: "RUP" },
  { fragment: "TDRub", sign: "RUP" },
  { fragment: "Lei", sign: "MDL" },
];

const currencySigns = {
  RUP: "руб",
  USD: "$",
  EUR: "€",
  MDL: "Lei",
  UAH: "грн",
  RUB: "₽",
};

const exchangeRates = [
  { name: "RUP/USD", rate: 16.35 },
  { name: "USD/RUP", rate: 16.3 },
  { name: "RUP/EUR", rate: 18.3 },
  { name: "EUR/RUP", rate: 17.45 },
  { name: "RUP/MDL", rate: 0.95 },
  { name: "MDL/RUP", rate: 0.88 },

  { name: "MDL/USD", rate: 17.89 },
  { name: "USD/MDL", rate: 17.7 },
  { name: "MDL/EUR", rate: 19.73 },
  { name: "EUR/MDL", rate: 19.5 },

  { name: "USD/EUR", rate: 0.89 },
  { name: "EUR/USD", rate: 1.09 },
];

async function getPreferredCurrency() {
  return (await chrome.storage.sync.get("preferredCurrency")).preferredCurrency;
}

async function getSwitchControl() {
  return (await chrome.storage.sync.get("switchControl")).switchControl;
}

async function getIsOriginalPrice() {
  return (await chrome.storage.sync.get("isOriginalPriceShown"))
    .isOriginalPriceShown;
}

function getPriceSelector() {
  const mainPage = ".ls-photo_price";
  const feedPage = ".ls-detail_price";
  const itemPage = ".item_title_price";
  const myItemsPage = ".title>.price";

  return [mainPage, feedPage, itemPage, myItemsPage].join(",");
}

async function updatePrices() {
  const preferredCurrency = await getPreferredCurrency();

  document.querySelectorAll(getPriceSelector()).forEach((priceBlock) => {
    fragments.forEach(({ fragment, sign }) => {
      if (priceBlock.textContent.includes(fragment)) {
        const originPrice = Number(
          priceBlock.textContent.replace(/[^0-9.]/g, "")
        );

        let rate = 1;
        if (sign !== preferredCurrency) {
          rate = exchangeRates.find(function ({ name }) {
            return name === `${sign}/${preferredCurrency}`;
          }).rate;
        }

        const calculatedPrice = Math.round(originPrice * rate);

        const resultPrice =
          `${calculatedPrice} ${currencySigns[preferredCurrency]}`.replace(
            /(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, // Add spaces before each 3 digits
            "$1" + " "
          );

        if (priceBlock.textContent !== resultPrice) {
          if (!priceBlock.dataset.originValue) {
            // Save original price in data attribute in case it is converted
            priceBlock.setAttribute(
              "data-origin-value",
              priceBlock.textContent
            );
          }

          priceBlock.innerHTML = resultPrice;
        }
      }
    });
  });
}

function revokePrices() {
  document.querySelectorAll(getPriceSelector()).forEach((priceBlock) => {
    const { originValue } = priceBlock.dataset;

    if (originValue) {
      priceBlock.innerHTML = originValue;
      priceBlock.removeAttribute("data-origin-value");
    }
  });
}

async function refreshPrices() {
  const switchControl = await getSwitchControl();

  switch (switchControl) {
    case "on":
      updatePrices();
      break;
    case "off":
      revokePrices();
      break;
    default:
      return;
  }
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

chrome.runtime.onMessage.addListener(function (payload) {
  if (payload === "refresh") {
    refreshPrices();
  }
});

chrome.storage.onChanged.addListener(({ preferredCurrency }) => {
  if (preferredCurrency) {
    refreshPrices();
  }
});

chrome.storage.onChanged.addListener(({ switchControl }) => {
  if (switchControl) {
    refreshPrices();
  }
});

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

refreshPrices();
