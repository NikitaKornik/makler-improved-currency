const fragments = [
  { fragment: "$", sign: "USD" },
  { fragment: "USD", sign: "USD" },
  { fragment: "€", sign: "EUR" },
  { fragment: "EUR", sign: "EUR" },
  { fragment: "руб", sign: "PRUB" },
  { fragment: "TDRub", sign: "PRUB" },
  { fragment: "Lei", sign: "LEI" },
];

const currencySigns = {
  PRUB: "руб",
  USD: "$",
  EUR: "€",
  LEI: "Lei",
};

const exchangeRates = [
  // { name: "PRUB/USD",rate: 16.3 },
  { name: "USD/PRUB", rate: 16.35 },
  // { name: "PRUB/EUR", rate: 18.45 },
  { name: "EUR/PRUB", rate: 18.45 },
  // { name: "PRUB/LEI", rate: 0.95 },
  { name: "LEI/PRUB", rate: 0.95 },
];

const preferredCurrency = "PRUB";

const priceSelector = ".ls-detail_price, .item_title_price, .title>.price";

function updatePrices() {
  document.querySelectorAll(priceSelector).forEach((priceBlock) => {
    priceBlock.setAttribute("data-origin-value", priceBlock.textContent);

    fragments.forEach(({ fragment, sign }) => {
      if (priceBlock.textContent.includes(fragment)) {
        const originPrice = Number(priceBlock.textContent.replace(/\D+/g, ""));

        let rate = 1;
        if (sign !== preferredCurrency) {
          rate = exchangeRates.find(function ({ name }) {
            return name === `${sign}/${preferredCurrency}`;
          }).rate;
        }

        const calculatedPrice = Math.round(originPrice * rate);

        priceBlock.innerHTML =
          `${calculatedPrice} ${currencySigns[preferredCurrency]}`.replace(
            /(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, // set spaces before every 3 digits
            "$1" + " "
          );
      }
    });
  });
}

function revokePrices() {
  document.querySelectorAll(priceSelector).forEach((priceBlock) => {
    const { originValue } = priceBlock.dataset;

    if (originValue) {
      priceBlock.innerHTML = originValue;
      priceBlock.removeAttribute("data-origin-value");
    }
  });
}

async function refreshPrices() {
  const { switchControl } = await chrome.storage.sync.get("switchControl");

  if (switchControl === "on") {
    updatePrices();
  } else {
    revokePrices();
  }
}

chrome.runtime.onMessage.addListener(function (payload) {
  if (payload === "refresh") {
    refreshPrices();
  }
});

refreshPrices();
