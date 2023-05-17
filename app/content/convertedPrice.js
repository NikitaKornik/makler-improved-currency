const NECESSARY_EXCHANGE_RATES_QUANTITY = 12;

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
};

async function getPreferredCurrency() {
  return (await chrome.storage.sync.get("preferredCurrency")).preferredCurrency;
}

async function getSwitchControl() {
  return (await chrome.storage.sync.get("switchControl")).switchControl;
}

async function getExchangeRates() {
  return (await chrome.storage.sync.get("rates")).rates;
}

function getPriceSelector() {
  const mainPage = ".ls-photo_price";
  const feedPage = ".ls-detail_price, .ls-short_price";
  const itemPage = ".item_title_price";
  const myItemsPage = ".title>.price";

  return [mainPage, feedPage, itemPage, myItemsPage].join(",");
}

async function updatePrices() {
  const exchangeRates = await getExchangeRates();

  if (
    Object.values(exchangeRates).length !== NECESSARY_EXCHANGE_RATES_QUANTITY
  ) {
    return;
  }

  const preferredCurrency = await getPreferredCurrency();

  document.querySelectorAll(getPriceSelector()).forEach((priceBlock) => {
    fragments.forEach(({ fragment, sign }) => {
      const priceValue =
        priceBlock.getAttribute("data-origin-value") || priceBlock.textContent;
      if (priceValue.includes(fragment)) {
        const originPrice = Number(priceValue.replace(/[^0-9.]/g, ""));

        let rate = 1;
        if (sign !== preferredCurrency) {
          rate = exchangeRates[`${sign}/${preferredCurrency}`];
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

          if (priceBlock.getAttribute("data-origin-value") === resultPrice) {
            priceBlock.removeAttribute("data-origin-value");
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

async function refreshPrices(switchControlProp) {
  const switchControl = switchControlProp || (await getSwitchControl());

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

chrome.storage.onChanged.addListener(({ rates }) => {
  if (rates) {
    refreshPrices();
  }
});

chrome.storage.onChanged.addListener(({ switchControl }) => {
  if (switchControl) {
    refreshPrices(switchControl.newValue);
  }
});

(function () {
  refreshPrices();
})();
