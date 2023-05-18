const ratesOrder = [
  "USD/RUP",
  "RUP/USD",
  "EUR/RUP",
  "RUP/EUR",
  "MDL/RUP",
  "RUP/MDL",
  "USD/MDL",
  "MDL/USD",
  "EUR/MDL",
  "MDL/EUR",
  "EUR/USD",
  "USD/EUR",
];

function round(num, decimals = 2) {
  const operand = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * operand) / operand;
}

async function getExchangeRates() {
  const rates = (await chrome.storage.sync.get("rates")).rates;

  return rates;
}

async function injectRatesTable(ratesProp) {
  const rates = ratesProp || (await getExchangeRates());
  const isReady = Object.values(rates).length >= ratesOrder.length;

  const root = document.createElement("div");
  const table = document.createElement("div");
  table.classList.add("exc");
  const line = document.createElement("hr");
  const heading = document.createElement("h4");
  heading.classList.add("heading");
  heading.innerText = "Exchange rates";

  if (!isReady) {
    const loading = document.createElement("div");
    loading.classList.add("spinner");
    loading.innerHTML = "<div></div><div></div><div></div><div></div>";
    heading.appendChild(loading);
  }

  root.appendChild(line);
  root.appendChild(heading);

  ratesOrder.forEach(function (name) {
    const row = document.createElement("div");
    row.classList.add("exc-row");

    const colName = document.createElement("div");
    colName.classList.add("exc-name");
    colName.innerText = name;

    const colValue = document.createElement("div");
    colValue.classList.add("exc-value");
    colValue.innerText = round(rates[name], 4) || "-";

    row.appendChild(colName);
    row.appendChild(colValue);
    table.appendChild(row);
  });

  root.appendChild(table);
  document.body.appendChild(root);
}

const switchForm = document.forms.switch;
const mainForm = document.forms.main;

switchForm.addEventListener("change", function () {
  const value = this.elements["switch-control"].value;

  chrome.storage.sync.set({ switchControl: value });
});

mainForm.elements.currency.addEventListener("change", function (e) {
  chrome.storage.sync.set({ preferredCurrency: e.target.value });
});

mainForm.elements["original-price"].addEventListener("change", function (e) {
  chrome.storage.sync.set({
    isOriginalPriceShown: e.target.checked,
  });
});

(async function () {
  const { switchControl } = await chrome.storage.sync.get("switchControl");
  switchForm.elements["switch-control"].value = switchControl;

  const { preferredCurrency } = await chrome.storage.sync.get(
    "preferredCurrency"
  );
  mainForm.elements.currency.value = preferredCurrency;

  const { isOriginalPriceShown } = await chrome.storage.sync.get(
    "isOriginalPriceShown"
  );
  mainForm.elements["original-price"].checked = isOriginalPriceShown;

  const version = chrome.runtime.getManifest().version;
  document.getElementById("version").innerHTML = version;

  injectRatesTable();
})();
