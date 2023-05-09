currency = [
  { v: "руб", p: 1, to: " руб" },
  { v: "$", p: 16.35, to: " руб" },
  { v: "€", p: 18.45, to: " руб" },
  { v: "Lei", p: 0.95, to: " руб" },
];

let timerID,
  switchBlock,
  sw = 0,
  tick = 10;

setTimeout("addPriceBlock()", 500);
function addPriceBlock() {
  document.querySelectorAll(".priceBox").forEach((e) => {
    let span = document.createElement("span");
    span.className = "initialPrice";
    span.innerHTML = e.textContent;
    e.append(span);
  });
  startTimer();
}

function startTimer() {
  timerID = setInterval(() => {
    document.querySelectorAll(".priceBox").forEach((e) => {
      initialPrice = e.querySelector(".initialPrice");
      convertPrice = e.querySelector(".ls-detail_price, .item_title_price");
      currency.forEach((i) => {
        if (initialPrice.textContent.includes(i.v)) {
          convertPrice.innerHTML =
            Math.trunc(
              parseInt(initialPrice.textContent.split(" ").join("")) * i.p
            )
              .toString()
              .replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + " ") + i.to;
        }
      });
    });
    tick *= 20;
    console.log(tick);
    clearInterval(timerID);
    startTimer();
  }, tick);

  if (sw < 1) {
    sw++;
    switchBlock = document.getElementById("toolbar_rightControls");
    let div = document.createElement("div");
    div.className = "switchBlock";
    div.innerHTML += "<button class='switchBtn switchBtn-RUP'/>RUP";
    div.innerHTML += "<button class='switchBtn switchBtn-Dollar'/>Dollar";
    div.innerHTML += "<button class='switchBtn switchBtn-EUR'/>EUR";
    div.innerHTML += "<button class='switchBtn switchBtn-Lei'/>Lei";
    switchBlock.append(div);

    document.querySelector(".switchBtn-RUP").addEventListener("click", () => {
      currency = [
        { v: "руб", p: 1, to: " руб" },
        { v: "$", p: 16.35, to: " руб" },
        { v: "€", p: 18.45, to: " руб" },
        { v: "Lei", p: 0.95, to: " руб" },
      ];
      intervalRestart();
    });
    document
      .querySelector(".switchBtn-Dollar").addEventListener("click", () => {
        currency = [
          { v: "$", p: 1, to: " $" },
          { v: "руб", p: 0.06135, to: " $" },
          { v: "€", p: 0.5698, to: " $" },
          { v: "Lei", p: 0.06, to: " $" },
        ];
        intervalRestart();
      });
    document.querySelector(".switchBtn-EUR").addEventListener("click", () => {
      currency = [
        { v: "€", p: 1, to: " €" },
        { v: "$", p: 1.07, to: " €" },
        { v: "Lei", p: 18.47, to: " €" },
        { v: "руб", p: 17.55, to: " €" },
      ];
      intervalRestart();
    });
    document.querySelector(".switchBtn-Lei").addEventListener("click", () => {
      currency = [
        { v: "Lei", p: 1, to: " Lei" },
        { v: "$", p: 0.0538, to: " Lei" },
        { v: "€", p: 0.0477, to: " Lei" },
        { v: "руб", p: 0.88, to: " Lei" },
      ];
      intervalRestart();
    });
  }
  function intervalRestart(){
    tick = 10;
    clearInterval(timerID);
    startTimer();
  }
}

document.querySelectorAll("input, a, button").forEach(() => {
  addEventListener("click", () => {
    (tick = 10), clearInterval(timerID), startTimer();
  });
});
