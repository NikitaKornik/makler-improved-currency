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

const switchForm = document.forms.switch;
const mainForm = document.forms.main;

switchForm.addEventListener("change", function () {
  const value = this.elements["switch-control"].value;

  chrome.storage.sync.set({ switchControl: value });
});

mainForm.elements.currency.addEventListener("change", function (e) {
  const value = this.value;

  chrome.storage.sync.set({ preferredCurrency: value });
});

function injectRatesTable() {
  const root = document.createElement("div");
  const table = document.createElement("div");
  table.classList.add("exc");
  const hr = document.createElement("hr");
  const h3 = document.createElement("h3");
  h3.innerText = "Exchange rates";

  root.appendChild(hr);
  root.appendChild(h3);

  exchangeRates.forEach(function ({ name, rate }) {
    const row = document.createElement("div");
    row.classList.add("exc-row");

    const colName = document.createElement("div");
    colName.classList.add("exc-name");
    colName.innerText = name;

    const colValue = document.createElement("div");
    colValue.classList.add("exc-value");
    colValue.innerText = rate;

    row.appendChild(colName);
    row.appendChild(colValue);
    table.appendChild(row);
  });

  root.appendChild(table);
  document.body.appendChild(root);
}

(async function () {
  const { switchControl } = await chrome.storage.sync.get("switchControl");
  switchForm.elements["switch-control"].value = switchControl;

  injectRatesTable();
})();

(async function () {
  const { preferredCurrency } = await chrome.storage.sync.get(
    "preferredCurrency"
  );

  mainForm.elements.currency.value = preferredCurrency;
})();
