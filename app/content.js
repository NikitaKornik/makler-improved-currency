const exchangeRates = [
  { fragment: "$", rate: 16.35 },
  { fragment: "€", rate: 18.45 },
  { fragment: "Lei", rate: 0.95 },
];

function updatePrices() {
  document
    .querySelectorAll(".ls-detail_price, .item_title_price")
    .forEach((priceBlock) => {
      exchangeRates.forEach(({ fragment, rate }) => {
        if (priceBlock.textContent.includes(fragment)) {
          const originPrice = Number(
            priceBlock.textContent.replace(/\D+/g, "")
          );

          const calculatedPrice = Math.round(originPrice * rate);

          priceBlock.innerHTML = (calculatedPrice + " руб").replace(
            /(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, // set spaces before every 3 digits
            "$1" + " "
          );
        }
      });
    });
}

chrome.runtime.onMessage.addListener(function (payload) {
  if (payload === "refresh") {
    updatePrices();
  }
});
