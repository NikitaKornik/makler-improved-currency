import { PMRRatesAdaptor, MDLRatesAdaptor } from "./rateAdaptors.js";

const getRates = async function () {
  return (await chrome.storage.sync.get("rates")).rates;
};

const setRates = function (rates) {
  chrome.storage.sync.set({ rates });
};

function handleFetchError(e) {
  console.log("Network error", e);
}

const getPMRRates = async function () {
  const req = await fetch("https://api.prisbank.com/courses").catch(
    handleFetchError
  );
  const json = await req.text();
  const data = JSON.parse(json);

  const rates = data.find(
    ({ name }) => name === "Коммерческий курс для физических лиц"
  ).courses;

  const result = {};

  PMRRatesAdaptor.forEach(function (rule) {
    const rate = rates.find(function (currency) {
      return currency[rule.key] === rule.val;
    });

    if (rate && rate[rule.attr]) {
      if (rule.action === "divide") {
        result[rule.name] = 1 / Number(rate[rule.attr]);
      } else {
        result[rule.name] = Number(rate[rule.attr]);
      }
    }
  });

  if (Object.keys(result).length) {
    const ratesState = await getRates();
    setRates({ ...ratesState, ...result });
  }
};

const getMDLRates = async function () {
  const req = await fetch(
    "https://www.energbank.com/api/v1/main/corebanking/exchanges/cash/history"
  ).catch(handleFetchError);
  const json = await req.text();
  const rates = JSON.parse(json);

  const result = {};

  MDLRatesAdaptor.forEach(function (rule) {
    const rate = rates.find(function (currency) {
      return currency[rule.key] === rule.val;
    });

    if (rate && rate[rule.attr]) {
      if (rule.action === "divide") {
        result[rule.name] = 1 / Number(rate[rule.attr]);
      } else {
        result[rule.name] = Number(rate[rule.attr]);
      }
    }
  });

  if (result["USD/MDL"] && result["MDL/EUR"]) {
    result["USD/EUR"] = result["USD/MDL"] * result["MDL/EUR"];
  }

  if (result["EUR/MDL"] && result["MDL/USD"]) {
    result["EUR/USD"] = result["EUR/MDL"] * result["MDL/USD"];
  }

  if (Object.keys(result).length) {
    const ratesState = await getRates();
    setRates({ ...ratesState, ...result });
  }
};

async function updateRates() {
  await Promise.all([getPMRRates(), getMDLRates()]);
}

(async function () {
  await updateRates();
})();
