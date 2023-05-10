  currency = [
    { initialCurrencySymbol: "руб", sell: 1, buy: 1, toCurrencySymbol: " руб" },
    { initialCurrencySymbol: "$", sell: 1, buy: 16.35, toCurrencySymbol: " руб" },
    { initialCurrencySymbol: "€", sell: 1, buy: 18.45, toCurrencySymbol: " руб" },
    { initialCurrencySymbol: "Lei", sell: 1, buy: 0.95, toCurrencySymbol: " руб" },
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

  //        находим блок с ценником/ добавляем блок в который записываем начальную сумму/ в найденном блоке проводим расчеты

  function startTimer() {
    timerID = setInterval(() => {
      document.querySelectorAll(".priceBox").forEach((e) => {
        // нашли блок с ценником
        initialPrice = e.querySelector(".initialPrice"); // ввели переменную с начальным ценником
        convertPrice = e.querySelector(".ls-detail_price, .item_title_price"); // ввели переменную с основным ценником, который будем менять на свою валюту
        currency.forEach((i) => {
          if (initialPrice.textContent.includes(i.initialCurrencySymbol)) {
            // находим в ценнике символ валюты для дальнейших расчетов
            convertPrice.innerHTML =
              Math.trunc(
                parseInt(initialPrice.textContent.split(" ").join("")) * i.buy / i.sell  // производим расчет и подставляем полученный результат в заранее созданную переменную
              )
                .toString()
                .replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + " ") + i.toCurrencySymbol; // добавляем пробелы через каждые 3 символа в ценнике, добавляем пробел перед символом валюты и подставляем символ выбранной валюты
          }
        }); // по нашей формуле мы умнажаем наш ценник на "продажу" определенной валюты банка. (нужно переделать из "a * b" в "a * b / c") a наш ценник, b = ценник валюты переводим в рубль ПМР "BUY" по курсу продажи rup банком и делим на курс продажи выбраннов валюты "SELL"
      }); // конец расчетов, дальше идет повтор цикла.
      tick *= 20;
      clearInterval(timerID);
      startTimer();
    }, tick);

    // switch (переключение между отображаемой валютой)

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
          { initialCurrencySymbol: "руб", sell: 1, buy: 1, toCurrencySymbol: " руб" },
          { initialCurrencySymbol: "$", sell: 1, buy: 16.35, toCurrencySymbol: " руб" },
          { initialCurrencySymbol: "€", sell: 1, buy: 18.45, toCurrencySymbol: " руб" },
          { initialCurrencySymbol: "Lei", sell: 1, buy: 0.95, toCurrencySymbol: " руб" },
        ];
        intervalRestart();
      });
      document
        .querySelector(".switchBtn-Dollar")
        .addEventListener("click", () => {
          currency = [
            { initialCurrencySymbol: "руб", sell: 16.3, buy: 1, toCurrencySymbol: " $" },
            { initialCurrencySymbol: "$", sell: 1, buy: 1, toCurrencySymbol: " $" },
            { initialCurrencySymbol: "€", sell: 16.3, buy: 18.45, toCurrencySymbol: " $" },
            { initialCurrencySymbol: "Lei", sell: 16.3, buy: 0.95, toCurrencySymbol: " $" },
          ];
          intervalRestart();
        });
      document.querySelector(".switchBtn-EUR").addEventListener("click", () => {
        currency = [
          { initialCurrencySymbol: "руб", sell: 17.55, buy: 1, toCurrencySymbol: " €" },
          { initialCurrencySymbol: "$", sell: 17.55, buy: 16.35, toCurrencySymbol: " €" },
          { initialCurrencySymbol: "€", sell: 1, buy: 1, toCurrencySymbol: " €" },
          { initialCurrencySymbol: "Lei", sell: 17.55, buy: 0.95, toCurrencySymbol: " €" },
        ];
        intervalRestart();
      });
      document.querySelector(".switchBtn-Lei").addEventListener("click", () => {
        currency = [
          { initialCurrencySymbol: "руб", sell: 0.88, buy: 1, toCurrencySymbol: " Lei" },
          { initialCurrencySymbol: "$", sell: 0.88, buy: 16.35, toCurrencySymbol: " Lei" },
          { initialCurrencySymbol: "€", sell: 0.88, buy: 18.45, toCurrencySymbol: " Lei" },
          { initialCurrencySymbol: "Lei", sell: 1, buy: 1, toCurrencySymbol: " Lei" },
        ];
        intervalRestart();
      });
    }
    function intervalRestart() {
      tick = 10;
      clearInterval(timerID);
      startTimer();
    }
  }

  document.querySelectorAll("input, a, button").forEach((e) => {
    e.addEventListener("click", () => {
      setTimeout(() => {
        if (document.querySelector(".initialPrice")) {
          (tick = 20), clearInterval(timerID), startTimer();
        } else {
          (tick = 20), clearInterval(timerID), setTimeout("addPriceBlock()", 500);
        }
      }, 400);
    });
  });

  document.querySelectorAll("input").forEach((e) => {
    e.addEventListener("keypress", (key) => {
      if (key.key === "Enter") {
        setTimeout(() => {
          if (document.querySelector(".initialPrice")) {
            (tick = 20), clearInterval(timerID), startTimer();
          } else {
            (tick = 20),
              clearInterval(timerID),
              setTimeout("addPriceBlock()", 500);
          }
        }, 400);
      }
    });
  });
  console.log("not yet");
  document.onload = console.log("document onload");
  console.log("yes, right now");
