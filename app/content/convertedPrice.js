const FULL_EXCHANGE_RATES_AMOUNT = 12;

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

function updateDOMValue(DOMEl, value) {
  if (DOMEl.innerHTML !== value) {
    DOMEl.innerHTML = value;
  }
}

function calculate(sign, preferredCurrency, originalValue, exchangeRates) {
  const rate = exchangeRates[`${sign}/${preferredCurrency}`];
  const originalPrice = Number(originalValue.replace(/[^0-9.]/g, ""));

  const calculatedPrice = originalPrice * rate;
  let roundFunction = Math.round;

  // Avoid converts into 0. E.g 5 LEI = 0 USD
  if (calculatedPrice < 1 && originalPrice) {
    roundFunction = Math.ceil;
  }

  return roundFunction(calculatedPrice);
}

async function updatePrices(preferredCurrency) {
  const exchangeRates = await getExchangeRates();

  if (Object.values(exchangeRates).length !== FULL_EXCHANGE_RATES_AMOUNT) {
    return;
  }

  document.querySelectorAll(getPriceSelector()).forEach((priceBlock) => {
    const originalValue =
      priceBlock.dataset.originValue || priceBlock.textContent;

    const targetFragment = fragments.find(({ fragment }) => {
      return originalValue.includes(fragment);
    });

    if (!targetFragment) {
      return;
    }

    const { sign } = targetFragment;

    if (sign === preferredCurrency) {
      updateDOMValue(priceBlock, originalValue);

      delete priceBlock.dataset.originValue;
      return;
    }

    const calculatedPrice = calculate(
      sign,
      preferredCurrency,
      originalValue,
      exchangeRates
    );

    const resultPrice =
      `${calculatedPrice} ${currencySigns[preferredCurrency]}`.replace(
        /(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, // Add spaces before each 3 digits
        "$1" + " "
      );

    if (!priceBlock.dataset.originValue) {
      // Save original price in data attribute in case it is converted
      priceBlock.dataset.originValue = priceBlock.textContent;
    }

    if (priceBlock.dataset.originValue === resultPrice) {
      delete priceBlock.dataset.originValue;
    }

    updateDOMValue(priceBlock, resultPrice);
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

async function refreshPrices(switchProp, currency) {
  const switchControl = switchProp || (await getSwitchControl());
  const preferredCurrency = currency || (await getPreferredCurrency());

  if (switchControl) {
    updatePrices(preferredCurrency);
  } else {
    revokePrices();
  }
}

chrome.storage.onChanged.addListener((state) => {
  if (state.preferredCurrency) {
    refreshPrices(null, state.preferredCurrency.newValue);
  }
  if (state.switchControl) {
    refreshPrices(state.switchControl.newValue);
  }
  if (state.rates) {
    refreshPrices();
  }
});

chrome.runtime.onMessage.addListener(function (payload) {
  if (payload === "refresh") {
    refreshPrices();
  }
});

refreshPrices();
