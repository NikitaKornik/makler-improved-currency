const exchangeRates = [
  { name: "PRUB/USD", fragment: "$", rate: 16.35 },
  // { name: "USD/PRUB", fragment: "$", rate: 16.3 },
  { name: "PRUB/EUR", fragment: "€", rate: 18.45 },
  // { name: "EUR/PRUB", fragment: "€", rate: 18.45 },
  { name: "PRUB/LEI", fragment: "Lei", rate: 0.95 },
  // { name: "LEI/PRUB", fragment: "Lei", rate: 0.95 },
];

const priceSelector = ".ls-detail_price, .item_title_price";

function updatePrices() {
  document.querySelectorAll(priceSelector).forEach((priceBlock) => {
    priceBlock.setAttribute("data-origin-value", priceBlock.textContent);

    exchangeRates.forEach(({ fragment, rate }) => {
      if (priceBlock.textContent.includes(fragment)) {
        const originPrice = Number(priceBlock.textContent.replace(/\D+/g, ""));
        const calculatedPrice = Math.round(originPrice * rate);

        priceBlock.innerHTML = (calculatedPrice + " руб").replace(
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
