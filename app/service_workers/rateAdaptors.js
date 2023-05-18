export const PMRRatesAdaptor = [
  {
    name: "RUP/USD",
    key: "abbr",
    val: "USD",
    attr: "sale",
    action: "divide",
  },
  { name: "USD/RUP", key: "abbr", val: "USD", attr: "buy" },
  {
    name: "RUP/EUR",
    key: "abbr",
    val: "EUR",
    attr: "sale",
    action: "divide",
  },
  { name: "EUR/RUP", key: "abbr", val: "EUR", attr: "buy" },
  {
    name: "RUP/MDL",
    key: "abbr",
    val: "MDL",
    attr: "sale",
    action: "divide",
  },
  { name: "MDL/RUP", key: "abbr", val: "MDL", attr: "buy" },
];

export const MDLRatesAdaptor = [
  {
    name: "MDL/USD",
    key: "currency",
    val: "USD",
    attr: "selling",
    action: "divide",
  },
  {
    name: "USD/MDL",
    key: "currency",
    val: "USD",
    attr: "buying",
  },
  {
    name: "MDL/EUR",
    key: "currency",
    val: "EUR",
    attr: "selling",
    action: "divide",
  },
  {
    name: "EUR/MDL",
    key: "currency",
    val: "EUR",
    attr: "buying",
  },
];
