function round(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

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

  const ratesAdaptor = [
    { name: "RUP/USD", key: "abbr", val: "USD", attr: "sale" },
    { name: "USD/RUP", key: "abbr", val: "USD", attr: "buy" },
    { name: "RUP/EUR", key: "abbr", val: "EUR", attr: "sale" },
    { name: "EUR/RUP", key: "abbr", val: "EUR", attr: "buy" },
    { name: "RUP/MDL", key: "abbr", val: "MDL", attr: "sale" },
    { name: "MDL/RUP", key: "abbr", val: "MDL", attr: "buy" },
  ];

  ratesAdaptor.forEach(function (rule) {
    const rate = rates.find(function (currency) {
      return currency[rule.key] === rule.val;
    });

    if (rate && rate[rule.attr]) {
      result[rule.name] = round(Number(rate[rule.attr]));
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

  const ratesAdaptor = [
    { name: "MDL/USD", key: "currency", val: "USD", attr: "selling" },
    { name: "USD/MDL", key: "currency", val: "USD", attr: "buying" },
    { name: "MDL/EUR", key: "currency", val: "EUR", attr: "selling" },
    { name: "EUR/MDL", key: "currency", val: "EUR", attr: "buying" },
  ];

  ratesAdaptor.forEach(function (rule) {
    const rate = rates.find(function (currency) {
      return currency[rule.key] === rule.val;
    });

    if (rate && rate[rule.attr]) {
      result[rule.name] = round(Number(rate[rule.attr]));
    }
  });

  if (result["USD/MDL"] && result["MDL/EUR"]) {
    result["USD/EUR"] = round(result["USD/MDL"] / result["MDL/EUR"]);
  }

  if (result["EUR/MDL"] && result["MDL/USD"]) {
    result["EUR/USD"] = round(result["EUR/MDL"] / result["MDL/USD"]);
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
